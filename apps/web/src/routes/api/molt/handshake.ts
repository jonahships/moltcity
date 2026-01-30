import { createFileRoute } from "@tanstack/react-router";

const convexSiteUrl = process.env.VITE_CONVEX_SITE_URL;

export const Route = createFileRoute("/api/molt/handshake")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				if (!convexSiteUrl) {
					return new Response(
						JSON.stringify({ ok: false, error: "Convex site URL not set" }),
						{
							status: 500,
							headers: { "content-type": "application/json" },
						}
					);
				}

				const body = await request.text();
				const response = await fetch(`${convexSiteUrl}/api/molt/handshake`, {
					method: "POST",
					headers: {
						"content-type": "application/json",
					},
					body,
				});

				return new Response(await response.text(), {
					status: response.status,
					headers: {
						"content-type":
							response.headers.get("content-type") ?? "application/json",
					},
				});
			},
		},
	},
});
