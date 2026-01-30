import type { GenericCtx } from "@convex-dev/better-auth";

import { v } from "convex/values";
import type { DataModel } from "./_generated/dataModel";
import {
	internalMutation,
	internalQuery,
	type MutationCtx,
	mutation,
	type QueryCtx,
	query,
} from "./_generated/server";
import { authComponent } from "./auth";

const TOKEN_PREFIX = "moltcity_";
const TOKEN_LENGTH = 32;
const TOKEN_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

function generateToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(TOKEN_LENGTH));
	let value = "";
	for (const byte of bytes) {
		value += TOKEN_ALPHABET[byte % TOKEN_ALPHABET.length];
	}
	return `${TOKEN_PREFIX}${value}`;
}

async function generateUniqueToken(ctx: QueryCtx | MutationCtx) {
	for (let attempt = 0; attempt < 5; attempt += 1) {
		const token = generateToken();
		const existing = await ctx.db
			.query("molts")
			.withIndex("by_token", (q) => q.eq("apiToken", token))
			.first();
		if (!existing) {
			return token;
		}
	}
	throw new Error("Failed to generate unique token");
}

async function getAuthUser(ctx: QueryCtx | MutationCtx) {
	const authUser = await authComponent.safeGetAuthUser(
		ctx as unknown as GenericCtx<DataModel>
	);
	return authUser ?? null;
}

export const getMyMolt = query({
	args: {},
	handler: async (ctx) => {
		const authUser = await getAuthUser(ctx);
		if (!authUser) {
			return null;
		}
		const profile = await ctx.db
			.query("profiles")
			.withIndex("by_auth_user_id", (q) => q.eq("authUserId", authUser._id))
			.first();
		if (!profile) {
			return null;
		}
		const molt = await ctx.db
			.query("molts")
			.withIndex("by_owner", (q) => q.eq("ownerId", profile._id))
			.first();
		return {
			profile,
			molt,
		};
	},
});

export const upsertOnboarding = mutation({
	args: {
		displayName: v.string(),
		moltName: v.string(),
	},
	handler: async (ctx, args) => {
		const authUser = await getAuthUser(ctx);
		if (!authUser) {
			throw new Error("Not authenticated");
		}
		const now = Date.now();
		const existingProfile = await ctx.db
			.query("profiles")
			.withIndex("by_auth_user_id", (q) => q.eq("authUserId", authUser._id))
			.first();

		const profileId =
			existingProfile?._id ??
			(await ctx.db.insert("profiles", {
				authUserId: authUser._id,
				displayName: args.displayName,
				createdAt: now,
				updatedAt: now,
			}));

		if (existingProfile) {
			await ctx.db.patch(profileId, {
				displayName: args.displayName,
				updatedAt: now,
			});
		}

		const existingMolt = await ctx.db
			.query("molts")
			.withIndex("by_owner", (q) => q.eq("ownerId", profileId))
			.first();

		if (!existingMolt) {
			const apiToken = await generateUniqueToken(ctx);
			const moltId = await ctx.db.insert("molts", {
				ownerId: profileId,
				name: args.moltName,
				apiToken,
				createdAt: now,
				updatedAt: now,
			});
			return {
				profileId,
				moltId,
				apiToken,
			};
		}

		await ctx.db.patch(existingMolt._id, {
			name: args.moltName,
			updatedAt: now,
		});

		return {
			profileId,
			moltId: existingMolt._id,
			apiToken: existingMolt.apiToken,
		};
	},
});

export const ensureProfileAndMolt = mutation({
	args: {
		displayName: v.optional(v.string()),
		moltName: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const authUser = await getAuthUser(ctx);
		if (!authUser) {
			throw new Error("Not authenticated");
		}
		const now = Date.now();
		const fallbackName = authUser.name || authUser.email || "Molt Resident";
		const displayName = args.displayName?.trim() || fallbackName;
		const moltName =
			args.moltName?.trim() || `${displayName.split(" ")[0]}'s Molt`;

		const existingProfile = await ctx.db
			.query("profiles")
			.withIndex("by_auth_user_id", (q) => q.eq("authUserId", authUser._id))
			.first();

		const profileId =
			existingProfile?._id ??
			(await ctx.db.insert("profiles", {
				authUserId: authUser._id,
				displayName,
				createdAt: now,
				updatedAt: now,
			}));

		if (existingProfile && existingProfile.displayName !== displayName) {
			await ctx.db.patch(profileId, {
				displayName,
				updatedAt: now,
			});
		}

		const existingMolt = await ctx.db
			.query("molts")
			.withIndex("by_owner", (q) => q.eq("ownerId", profileId))
			.first();

		if (!existingMolt) {
			const apiToken = await generateUniqueToken(ctx);
			const moltId = await ctx.db.insert("molts", {
				ownerId: profileId,
				name: moltName,
				apiToken,
				createdAt: now,
				updatedAt: now,
			});
			return {
				profileId,
				moltId,
				apiToken,
			};
		}

		if (existingMolt.name !== moltName) {
			await ctx.db.patch(existingMolt._id, {
				name: moltName,
				updatedAt: now,
			});
		}

		return {
			profileId,
			moltId: existingMolt._id,
			apiToken: existingMolt.apiToken,
		};
	},
});

export const getMoltByToken = internalQuery({
	args: {
		token: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query("molts")
			.withIndex("by_token", (q) => q.eq("apiToken", args.token))
			.first();
	},
});

export const recordHandshake = internalMutation({
	args: {
		token: v.string(),
	},
	handler: async (ctx, args) => {
		const molt = await ctx.db
			.query("molts")
			.withIndex("by_token", (q) => q.eq("apiToken", args.token))
			.first();
		if (!molt) {
			return null;
		}
		const now = Date.now();
		await ctx.db.patch(molt._id, {
			lastHandshakeAt: now,
			updatedAt: now,
		});
		return molt._id;
	},
});
