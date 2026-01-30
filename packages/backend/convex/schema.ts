import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	profiles: defineTable({
		authUserId: v.string(),
		displayName: v.string(),
		createdAt: v.number(),
		updatedAt: v.number(),
	}).index("by_auth_user_id", ["authUserId"]),
	molts: defineTable({
		ownerId: v.id("profiles"),
		name: v.string(),
		apiToken: v.string(),
		lastHandshakeAt: v.optional(v.number()),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_owner", ["ownerId"])
		.index("by_token", ["apiToken"]),
});
