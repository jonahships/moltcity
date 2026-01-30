import { createFileRoute } from "@tanstack/react-router";

import OnboardingDialog from "@/components/blocks/auth/onboarding";

export const Route = createFileRoute("/onboarding/")({
  component: OnboardingPage,
});

function OnboardingPage() {
  return (
    <div className="relative flex min-h-svh items-center justify-center bg-background p-6 text-foreground">
      <div className="absolute inset-0 bg-[url('/images/onboarding-light.png')] bg-cover bg-center opacity-10 dark:bg-[url('/images/onboarding-dark.png')] dark:opacity-20" />
      <div className="relative z-10 flex w-full justify-center">
        <OnboardingDialog />
      </div>
    </div>
  );
}
