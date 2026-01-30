import {
	type CreateAuth,
	createClient,
	type GenericCtx,
} from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL;
if (!siteUrl) {
	throw new Error("SITE_URL is not set");
}

export const authComponent = createClient<DataModel>(components.betterAuth);

const createAuth: CreateAuth<DataModel> = (ctx) => {
	return betterAuth({
		baseURL: siteUrl,
		trustedOrigins: [siteUrl],
		database: authComponent.adapter(ctx),
		socialProviders: {
			discord: {
				clientId: process.env.DISCORD_CLIENT_ID as string,
				clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
			},
		},
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false,
		},
		plugins: [
			convex({
				authConfig,
				jwksRotateOnTokenGenerationError: true,
			}),
		],
	});
};

export { createAuth };

export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		const authCtx = ctx as unknown as GenericCtx<DataModel>;
		return await authComponent.safeGetAuthUser(authCtx);
	},
});
