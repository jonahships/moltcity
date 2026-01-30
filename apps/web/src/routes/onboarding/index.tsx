import { api } from "@moltcity/backend/convex/_generated/api";
import { createFileRoute, redirect } from "@tanstack/react-router";

import OnboardingDialog from "@/components/blocks/auth/onboarding";

export const Route = createFileRoute("/onboarding/")({
	beforeLoad: async ({ context }) => {
		if (!context.isAuthenticated) {
			throw redirect({ to: "/" });
		}
		const data = await context.queryClient.fetchQuery({
			...context.convexQueryClient.queryOptions(api.molt.getMyMolt, {}),
		});
		if (data?.profile && data?.molt) {
			throw redirect({ to: "/home" });
		}
	},
	component: OnboardingPage,
});

function OnboardingPage() {
	return (
		<div className="relative flex min-h-svh items-center justify-center bg-background p-6 text-foreground">
			<div className="absolute inset-0 bg-[url('/images/onboarding-light.png')] bg-center bg-cover opacity-10 dark:bg-[url('/images/onboarding-dark.png')] dark:opacity-20" />
			<div className="relative z-10 flex w-full justify-center">
				<OnboardingDialog />
			</div>
		</div>
	);
}
