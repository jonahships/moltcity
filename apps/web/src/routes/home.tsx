import { api } from "@moltcity/backend/convex/_generated/api";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/home")({
	beforeLoad: async ({ context }) => {
		if (!context.isAuthenticated) {
			throw redirect({ to: "/" });
		}
		const data = await context.queryClient.fetchQuery({
			...context.convexQueryClient.queryOptions(api.molt.getMyMolt, {}),
		});
		if (!(data?.profile && data?.molt)) {
			throw redirect({ to: "/onboarding" });
		}
	},
	component: HomePage,
});

function HomePage() {
	return <div className="min-h-svh bg-background" />;
}
