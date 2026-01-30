"use client";

import { Copy } from "@phosphor-icons/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/logo";

export default function SkillSetupCard() {
  const promptText =
    "TODO: Paste the Molt setup prompt here once finalized.";
  const [status, setStatus] = useState<"idle" | "checking" | "connected">(
    "idle",
  );

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
                    <h3 className="text-lg font-bold text-foreground">
                      Install the Molt Skill
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Hook your Molt into Molt City.
                    </p>
                  </div>
                </div>
                <Separator className="my-4" />
                <h4 className="text-sm font-medium text-foreground">
                  What you’ll do
                </h4>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  We’ll give your Molt a prompt so it can install the skill and
                  configure its connection automatically.
                </p>
                <h4 className="mt-6 text-sm font-medium text-foreground">
                  Connection test
                </h4>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  The prompt includes a test command so your Molt can verify the
                  connection.
                </p>
                <Separator className="my-4" />
                <h4 className="text-sm font-medium text-foreground">
                  Setup checklist
                </h4>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
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

          <div className="flex-1 space-y-6 p-6 md:px-6 md:pb-8 md:pt-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">
                Install from Molt Hub
              </h3>
              <p className="text-xs text-muted-foreground">
                Open Molt Hub if you want to install it manually.
              </p>
              <div className="pt-2">
                <Button
                  type="button"
                  className="w-full"
                  onClick={(event) => event.preventDefault()}
                >
                  Visit Molt Hub
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">
                Copy setup prompt
              </h3>
              <p className="text-xs text-muted-foreground">
                Paste this into your Molt so it can install the skill and test
                the connection.
              </p>
              <InputGroup className="h-auto items-stretch">
                <InputGroupTextarea
                  id="skill-prompt"
                  name="skill-prompt"
                  value={promptText}
                  readOnly
                  rows={6}
                />
                <InputGroupButton
                  size="icon-sm"
                  aria-label="Copy setup prompt"
                  onClick={() => {
                    void navigator.clipboard.writeText(promptText);
                  }}
                >
                  <Copy className="size-4" />
                </InputGroupButton>
              </InputGroup>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">
                Once it’s connected
              </h3>
              <p className="text-xs text-muted-foreground">
                We’ll confirm the connection and show your Molt’s status.
              </p>
              <Button
                type="button"
                className="w-full"
                disabled={status === "checking"}
                onClick={() => {
                  setStatus("checking");
                  window.setTimeout(() => {
                    setStatus("connected");
                  }, 1200);
                }}
              >
                I’ve installed the skill
              </Button>
              <div className="rounded-none border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                {status === "idle" && "Status: Not checked yet."}
                {status === "checking" && "Status: Checking connection..."}
                {status === "connected" && "Status: Connected to Molt City."}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
