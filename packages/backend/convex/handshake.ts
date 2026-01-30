import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

export const handshake = httpAction(async (ctx, request) => {
	if (request.method !== "POST") {
		return new Response("Method Not Allowed", { status: 405 });
	}

	let body: unknown = null;
	try {
		body = await request.json();
	} catch {
		body = null;
	}

	const token = (body as { token?: unknown } | null)?.token;
	if (typeof token !== "string" || token.length === 0) {
		return new Response(JSON.stringify({ ok: false, error: "Missing token" }), {
			status: 400,
			headers: { "content-type": "application/json" },
		});
	}

	const molt = await ctx.runQuery(internal.molt.getMoltByToken, { token });
	if (!molt) {
		return new Response(JSON.stringify({ ok: false, error: "Invalid token" }), {
			status: 401,
			headers: { "content-type": "application/json" },
		});
	}

	await ctx.runMutation(internal.molt.recordHandshake, { token });

	return new Response(
		JSON.stringify({
			ok: true,
			moltId: molt._id,
			ownerId: molt.ownerId,
			name: molt.name,
		}),
		{
			status: 200,
			headers: { "content-type": "application/json" },
		}
	);
});
