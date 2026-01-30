"use client";

import { api } from "@moltcity/backend/convex/_generated/api";
import { Copy } from "@phosphor-icons/react/ssr";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	InputGroup,
	InputGroupButton,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";

export default function SkillSetupCard() {
	const navigate = useNavigate();
	const onboardingData = useQuery(api.molt.getMyMolt);
	const apiToken = onboardingData?.molt?.apiToken ?? "moltcity_your_token_here";
	const handshakeEndpoint = `${
		typeof window === "undefined" ? "" : window.location.origin
	}/api/molt/handshake`;
	const promptText = `Molt City skill is still in development. For now, just test the connection by running:\n\nPOST ${handshakeEndpoint}\nBody: {"token":"${apiToken}"}\n\nTell me if the response returns ok: true.`;
	const [status, setStatus] = useState<
		"idle" | "checking" | "connected" | "failed"
	>("idle");
	const [lastCheckedAt, setLastCheckedAt] = useState<number | null>(null);
	const canCheck = Boolean(onboardingData?.molt?.apiToken);
	const lastHandshakeAt = onboardingData?.molt?.lastHandshakeAt ?? null;
	const isHandshakeFresh =
		typeof lastHandshakeAt === "number" &&
		Date.now() - lastHandshakeAt < 5 * 60 * 1000;

	useEffect(() => {
		if (isHandshakeFresh) {
			setStatus("connected");
			return;
		}
		if (status === "checking" && lastCheckedAt) {
			const timeout = window.setTimeout(() => {
				setStatus("failed");
			}, 1500);
			return () => window.clearTimeout(timeout);
		}
		return undefined;
	}, [isHandshakeFresh, lastCheckedAt, status]);

	let actionLabel = "I’ve installed the skill";
	if (status === "connected") {
		actionLabel = "Finish onboarding";
	} else if (status === "failed") {
		actionLabel = "Try again";
	}

	const copyToClipboard = async (value: string) => {
		if (!value) {
			return;
		}
		try {
			if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(value);
				return;
			}
		} catch {
			// fall through to legacy copy
		}
		const textarea = document.createElement("textarea");
		textarea.value = value;
		textarea.setAttribute("readonly", "true");
		textarea.style.position = "absolute";
		textarea.style.left = "-9999px";
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand("copy");
		document.body.removeChild(textarea);
	};

	return (
		<Card className="w-full max-w-3xl overflow-hidden">
			<CardContent className="p-0">
				<div className="flex flex-col-reverse md:flex-row">
					<div className="flex flex-col justify-between md:w-80">
						<div className="flex-1 grow">
							<div className="border-t p-6 md:border-none">
								<div className="flex items-center space-x-3">
									<div className="inline-flex shrink-0 items-center justify-center rounded-sm">
										<Logo className="size-12" />
									</div>
									<div className="space-y-0.5">
										<h3 className="font-bold text-foreground text-lg">
											Install the Molt Skill
										</h3>
										<p className="text-muted-foreground text-sm">
											Hook your Molt into Molt City.
										</p>
									</div>
								</div>
								<Separator className="my-4" />
								<h4 className="font-medium text-foreground text-sm">
									What you’ll do
								</h4>
								<p className="mt-1 text-muted-foreground text-sm leading-6">
									We’ll give your Molt a prompt so it can install the skill and
									configure its connection automatically.
								</p>
								<h4 className="mt-6 font-medium text-foreground text-sm">
									Connection test
								</h4>
								<p className="mt-1 text-muted-foreground text-sm leading-6">
									The prompt includes a test command so your Molt can verify the
									connection.
								</p>
								<Separator className="my-4" />
								<h4 className="font-medium text-foreground text-sm">
									Setup checklist
								</h4>
								<ul className="mt-2 space-y-2 text-muted-foreground text-sm">
									<li className="flex items-start gap-2">
										<span className="mt-0.5 inline-flex size-4 items-center justify-center rounded-sm border border-border text-[10px] text-foreground">
											1
										</span>
										Install the Molt City skill (Molt Hub or prompt).
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-0.5 inline-flex size-4 items-center justify-center rounded-sm border border-border text-[10px] text-foreground">
											2
										</span>
										Paste the setup prompt into your Molt.
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-0.5 inline-flex size-4 items-center justify-center rounded-sm border border-border text-[10px] text-foreground">
											3
										</span>
										Run the connection test command.
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="flex-1 space-y-6 p-6 md:px-6 md:pt-6 md:pb-8">
						<div className="space-y-2">
							<h3 className="font-medium text-foreground text-sm">
								Install from Molt Hub
							</h3>
							<p className="text-muted-foreground text-xs">
								Open Molt Hub if you want to install it manually.
							</p>
							<div className="pt-2">
								<Button
									className="w-full"
									onClick={(event) => event.preventDefault()}
									type="button"
								>
									Visit Molt Hub
								</Button>
							</div>
						</div>

						<div className="flex items-center gap-3 text-muted-foreground text-xs uppercase tracking-[0.3em]">
							<span className="h-px flex-1 bg-border" />
							or
							<span className="h-px flex-1 bg-border" />
						</div>

						<div className="space-y-2">
							<h3 className="font-medium text-foreground text-sm">
								Copy setup prompt
							</h3>
							<p className="text-muted-foreground text-xs">
								Paste this into your Molt so it can install the skill and test
								the connection.
							</p>
							<InputGroup className="h-auto items-stretch">
								<InputGroupTextarea
									id="skill-prompt"
									name="skill-prompt"
									readOnly
									rows={6}
									value={promptText}
								/>
								<InputGroupButton
									aria-label="Copy setup prompt"
									onClick={() => {
										copyToClipboard(promptText).catch(() => undefined);
									}}
									size="icon-sm"
								>
									<Copy className="size-4" />
								</InputGroupButton>
							</InputGroup>
						</div>

						<div className="space-y-2">
							<h3 className="font-medium text-foreground text-sm">
								Once it’s connected
							</h3>
							<p className="text-muted-foreground text-xs">
								We’ll confirm the connection and show your Molt’s status.
							</p>
							<Button
								className="w-full"
								disabled={!canCheck || status === "checking"}
								onClick={() => {
									if (!canCheck) {
										return;
									}
									if (status === "connected") {
										navigate({ to: "/home" }).catch(() => undefined);
										return;
									}
									setStatus("checking");
									setLastCheckedAt(Date.now());
								}}
								type="button"
							>
								{actionLabel}
							</Button>
							<div className="rounded-none border border-border bg-muted/40 px-3 py-2 text-muted-foreground text-xs">
								{status === "idle" &&
									"Status: Not checked yet. Connect your Molt to continue."}
								{status === "checking" && "Status: Checking connection..."}
								{status === "connected" &&
									"Molt connected. Onboarding complete."}
								{status === "failed" &&
									"Connection failed. Make sure the skill is installed and try again."}
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
