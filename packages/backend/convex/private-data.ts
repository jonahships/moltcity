import type { GenericCtx } from "@convex-dev/better-auth";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { authComponent } from "./auth";

export const get = query({
	args: {},
	handler: async (ctx) => {
		const authCtx = ctx as unknown as GenericCtx<DataModel>;
		const authUser = await authComponent.safeGetAuthUser(authCtx);
		if (!authUser) {
			return {
				message: "Not authenticated",
			};
		}
		return {
			message: "This is private",
		};
	},
});
