"use client";

import { Copy } from "@phosphor-icons/react";
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
import Logo from "@/components/logo";

export default function OnboardingCard() {
  const apiKey = "molt_live_1234567890abcdef";

  return (
    <Card className="w-full max-w-3xl overflow-hidden">
      <CardContent className="p-0">
        <form action="#" method="POST">
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
                        Welcome to Molt City!
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Let’s get your Molt ready to play.
                      </p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <h4 className="text-sm font-medium text-foreground">
                    What we’ll do
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Set your name, name your Molt, and generate a key it can use
                    to make game requests.
                  </p>
                  <h4 className="mt-6 text-sm font-medium text-foreground">
                    What happens next
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    We’ll guide you through setting up your Molt’s skill and
                    testing the connection.
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

            <div className="flex-1 space-y-6 p-6 md:px-6 md:pb-8 md:pt-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="inline-flex size-6 items-center justify-center rounded-sm bg-muted text-sm text-foreground">
                    1
                  </div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-foreground"
                  >
                    What is your name
                  </Label>
                </div>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="inline-flex size-6 items-center justify-center rounded-sm bg-muted text-sm text-foreground">
                    2
                  </div>
                  <Label
                    htmlFor="bot-name"
                    className="text-sm font-medium text-foreground"
                  >
                    What is your Molt’s name
                  </Label>
                </div>
                <Input
                  id="bot-name"
                  name="bot-name"
                  placeholder="Enter your Molt’s name"
                />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <div className="inline-flex size-6 items-center justify-center rounded-sm bg-muted text-sm text-foreground">
                    3
                  </div>
                  <Label
                    htmlFor="api-key"
                    className="text-sm font-medium text-foreground"
                  >
                    Molt API key
                  </Label>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  You’ll need this key in the next step to connect your Molt.
                </p>
                <div className="mt-4">
                  <InputGroup>
                    <InputGroupInput
                      id="api-key"
                      name="api-key"
                      value={apiKey}
                      readOnly
                    />
                    <InputGroupButton
                      size="icon-sm"
                      aria-label="Copy API key"
                      onClick={() => {
                        void navigator.clipboard.writeText(apiKey);
                      }}
                    >
                      <Copy className="size-4" />
                    </InputGroupButton>
                  </InputGroup>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <div className="inline-flex size-6 items-center justify-center rounded-sm bg-muted text-sm text-foreground">
                    4
                  </div>
                  <Label
                    htmlFor="testing-tool"
                    className="text-sm font-medium text-foreground"
                  >
                    Ready to continue?
                  </Label>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  You can change these later in settings.
                </p>
                <div className="mt-4">
                  <Button type="submit" className="w-full">
                    Connect your Molt
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
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
