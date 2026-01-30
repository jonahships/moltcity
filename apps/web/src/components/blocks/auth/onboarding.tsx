"use client";

import { api } from "@moltcity/backend/convex/_generated/api";
import { Copy } from "@phosphor-icons/react/ssr";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function OnboardingCard() {
	const navigate = useNavigate();
	const onboardingData = useQuery(api.molt.getMyMolt);
	const authUser = useQuery(api.auth.getCurrentUser);
	const ensureProfileAndMolt = useMutation(api.molt.ensureProfileAndMolt);
	const upsertOnboarding = useMutation(api.molt.upsertOnboarding);
	const [displayName, setDisplayName] = useState("");
	const [moltName, setMoltName] = useState("");
	const [apiKey, setApiKey] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [hasEnsured, setHasEnsured] = useState(false);
	const [hasPrefilled, setHasPrefilled] = useState(false);
	const [hasEditedName, setHasEditedName] = useState(false);
	const [hasEditedMoltName, setHasEditedMoltName] = useState(false);

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

	useEffect(() => {
		if (hasEnsured || !authUser || onboardingData !== null) {
			return;
		}
		setHasEnsured(true);
		const defaultDisplayName =
			authUser.name || authUser.email || "Molt Resident";
		const defaultMoltName = `${defaultDisplayName.split(" ")[0]}'s Molt`;
		ensureProfileAndMolt({
			displayName: defaultDisplayName,
			moltName: defaultMoltName,
		})
			.then((result) => {
				setDisplayName(defaultDisplayName);
				setMoltName(defaultMoltName);
				setApiKey(result.apiToken);
			})
			.catch(() => undefined);
	}, [authUser, ensureProfileAndMolt, hasEnsured, onboardingData]);

	useEffect(() => {
		if (hasPrefilled || !onboardingData) {
			return;
		}
		if (onboardingData.profile?.displayName && !hasEditedName) {
			setDisplayName(onboardingData.profile.displayName);
		}
		if (onboardingData.molt?.name && !hasEditedMoltName) {
			setMoltName(onboardingData.molt.name);
		}
		if (onboardingData.molt?.apiToken && apiKey.length === 0) {
			setApiKey(onboardingData.molt.apiToken);
		}
		setHasPrefilled(true);
	}, [
		apiKey.length,
		hasEditedMoltName,
		hasEditedName,
		hasPrefilled,
		onboardingData,
	]);

	return (
		<Card className="w-full max-w-3xl overflow-hidden">
			<CardContent className="p-0">
				<form
					action="#"
					method="POST"
					onSubmit={async (event) => {
						event.preventDefault();
						if (!(displayName.trim() && moltName.trim())) {
							return;
						}
						setIsSubmitting(true);
						try {
							const result = await upsertOnboarding({
								displayName: displayName.trim(),
								moltName: moltName.trim(),
							});
							setApiKey(result.apiToken);
							await navigate({ to: "/onboarding/skill" });
						} finally {
							setIsSubmitting(false);
						}
					}}
				>
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
												Welcome to Molt City!
											</h3>
											<p className="text-muted-foreground text-sm">
												Let’s get your Molt ready to play.
											</p>
										</div>
									</div>
									<Separator className="my-4" />
									<h4 className="font-medium text-foreground text-sm">
										What we’ll do
									</h4>
									<p className="mt-1 text-muted-foreground text-sm leading-6">
										Set your name, name your Molt, and generate a key it can use
										to make game requests.
									</p>
									<h4 className="mt-6 font-medium text-foreground text-sm">
										What happens next
									</h4>
									<p className="mt-1 text-muted-foreground text-sm leading-6">
										We’ll guide you through setting up your Molt’s skill and
										testing the connection.
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
											Add your name and Molt name.
										</li>
										<li className="flex items-start gap-2">
											<span className="mt-0.5 inline-flex size-4 items-center justify-center rounded-sm border border-border text-[10px] text-foreground">
												2
											</span>
											Copy your Molt API key.
										</li>
										<li className="flex items-start gap-2">
											<span className="mt-0.5 inline-flex size-4 items-center justify-center rounded-sm border border-border text-[10px] text-foreground">
												3
											</span>
											Connect the skill and test it.
										</li>
									</ul>
								</div>
							</div>
						</div>

						<div className="flex-1 space-y-6 p-6 md:px-6 md:pt-6 md:pb-8">
							<div className="space-y-2">
								<div className="flex items-center space-x-3">
									<div className="inline-flex size-6 items-center justify-center rounded-sm bg-muted text-foreground text-sm">
										1
									</div>
									<Label
										className="font-medium text-foreground text-sm"
										htmlFor="name"
									>
										What is your name
									</Label>
								</div>
								<Input
									autoComplete="name"
									id="name"
									name="name"
									onChange={(event) => {
										setHasEditedName(true);
										setDisplayName(event.target.value);
									}}
									placeholder="Enter your name"
									value={displayName}
								/>
							</div>
							<div className="space-y-2">
								<div className="flex items-center space-x-3">
									<div className="inline-flex size-6 items-center justify-center rounded-sm bg-muted text-foreground text-sm">
										2
									</div>
									<Label
										className="font-medium text-foreground text-sm"
										htmlFor="bot-name"
									>
										What is your Molt’s name
									</Label>
								</div>
								<Input
									id="bot-name"
									name="bot-name"
									onChange={(event) => {
										setHasEditedMoltName(true);
										setMoltName(event.target.value);
									}}
									placeholder="Enter your Molt’s name"
									value={moltName}
								/>
							</div>
							<div>
								<div className="flex items-center space-x-3">
									<div className="inline-flex size-6 items-center justify-center rounded-sm bg-muted text-foreground text-sm">
										3
									</div>
									<Label
										className="font-medium text-foreground text-sm"
										htmlFor="api-key"
									>
										Molt API key
									</Label>
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									You’ll need this key in the next step to connect your Molt.
								</p>
								<div className="mt-4">
									<InputGroup>
										<InputGroupInput
											id="api-key"
											name="api-key"
											placeholder="Generated when you save this step"
											readOnly
											value={apiKey}
										/>
										<InputGroupButton
											aria-label="Copy API key"
											disabled={!apiKey}
											onClick={() => {
												copyToClipboard(apiKey).catch(() => undefined);
											}}
											size="icon-sm"
										>
											<Copy className="size-4" />
										</InputGroupButton>
									</InputGroup>
								</div>
							</div>
							<div>
								<div className="flex items-center space-x-3">
									<div className="inline-flex size-6 items-center justify-center rounded-sm bg-muted text-foreground text-sm">
										4
									</div>
									<Label
										className="font-medium text-foreground text-sm"
										htmlFor="testing-tool"
									>
										Ready to continue?
									</Label>
								</div>
								<p className="mt-1 text-muted-foreground text-xs">
									You can change these later in settings.
								</p>
								<div className="mt-4">
									<Button
										className="w-full"
										disabled={isSubmitting}
										type="submit"
									>
										Connect your Molt
									</Button>
									<p className="mt-3 text-center text-muted-foreground text-xs">
										By continuing, you agree to the Terms of Service.
									</p>
								</div>
							</div>
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
