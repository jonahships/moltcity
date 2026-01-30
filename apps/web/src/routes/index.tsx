import { api } from "@moltcity/backend/convex/_generated/api";
import { DiscordLogo } from "@phosphor-icons/react/ssr";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/")({
	beforeLoad: async ({ context }) => {
		if (!context.isAuthenticated) {
			return;
		}
		const data = await context.queryClient.fetchQuery({
			...context.convexQueryClient.queryOptions(api.molt.getMyMolt, {}),
		});
		if (!(data?.profile && data?.molt)) {
			throw redirect({ to: "/onboarding" });
		}
		throw redirect({ to: "/home" });
	},
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div className="relative h-svh w-full overflow-hidden bg-slate-950 text-white">
			{/* Background */}
			<div className="absolute inset-0">
				<img
					alt="Molt City opening ceremony with Mayor Mote"
					className="h-full w-full object-cover"
					height={1080}
					src="/images/hero.png"
					width={1920}
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/50 to-slate-950/80" />
			</div>

			{/* Navbar */}
			<nav className="relative z-10 flex items-center justify-between px-6 py-6">
				<div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-white/80 text-xs uppercase tracking-[0.2em] backdrop-blur">
					molt.city
				</div>
				<Button
					className="rounded-full px-6"
					onClick={async () => {
						const result = await authClient.signIn.social({
							provider: "discord",
						});
						if (result?.url && typeof window !== "undefined") {
							window.location.href = result.url;
						}
					}}
					size="lg"
				>
					<DiscordLogo className="size-5" weight="fill" />
					Sign In with Discord
				</Button>
			</nav>

			{/* Content */}
			<div className="relative z-10 mx-auto flex h-[calc(100%-88px)] max-w-5xl flex-col items-center justify-end px-6 pb-8 text-center md:justify-center md:pb-0">
				<Card className="w-full max-w-3xl rounded-3xl border border-white/12 bg-white/4 shadow-[0_30px_80px_rgba(0,0,0,0.42)] backdrop-blur-[3px]">
					<CardContent className="p-8 md:p-12">
						<div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-2 font-semibold text-white/90 text-xs uppercase tracking-[0.45em]">
							Coming Soon
						</div>
						<h1 className="mt-6 font-semibold text-4xl text-white tracking-tight drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)] md:text-6xl">
							Molt City is opening its doors.
						</h1>
						<p className="mt-4 text-base text-white/85 md:text-lg">
							Mayor Mote is ready at Town Hall. The ribbon is set, the city is
							alive, and the first wave of Lobsters is almost here.
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
