"use client";

import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

import { CountUp, Reveal, SectionHeading } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { roleCopy } from "@/lib/content";
import { memberRoles } from "@/lib/labels";

export function RoleSwitcher() {
  return (
    <section id="start" className="scroll-mt-20 py-10 sm:py-16">
      <div className="shell">
        <SectionHeading
          label="Start here"
          title={
            <>
              Tell us which side of the mic <span className="text-ink-faint">you&apos;re on.</span>
            </>
          }
          body="Pick one. We'll walk you through the profile, the matches, and how booking works for that role."
        />

        <Reveal delay={0.08} className="mt-8">
          <Tabs defaultValue="host">
            <TabsList className="h-auto! w-full flex-wrap justify-start gap-1 rounded-3xl bg-surface p-1.5 shadow-e1 ring-1 ring-line/70 sm:w-fit sm:rounded-full">
              {memberRoles.map((role) => (
                <TabsTrigger
                  key={role}
                  value={role}
                  className="h-11! flex-none rounded-full px-4 text-[14px] data-active:bg-ink! data-active:text-white! sm:px-5"
                >
                  {roleCopy[role].tab}
                </TabsTrigger>
              ))}
            </TabsList>

            {memberRoles.map((role) => {
              const copy = roleCopy[role];
              return (
                <TabsContent key={role} value={role} className="mt-4">
                  <div className="grid gap-3 lg:grid-cols-12">
                    <Card className="border-0 py-0 shadow-e2 lg:col-span-8">
                      <CardContent className="p-6 sm:p-10">
                        <Badge variant="sun">{copy.label}</Badge>
                        <h3 className="mt-4 max-w-2xl text-[28px] leading-[1.05] font-semibold tracking-[-0.04em] text-balance text-ink sm:text-[40px]">
                          {copy.title}
                        </h3>
                        <p className="mt-4 max-w-[62ch] text-[16px] leading-relaxed text-ink-soft sm:text-[17px]">{copy.body}</p>
                        <ol className="mt-8 grid gap-3">
                          {copy.steps.map((step, index) => (
                            <li key={step.title} className="flex gap-4 rounded-3xl bg-canvas p-4 sm:p-5">
                              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-[15px] font-semibold text-white tabular-nums">
                                {index + 1}
                              </span>
                              <div>
                                <p className="text-[16px] font-semibold tracking-[-0.02em] text-ink">{step.title}</p>
                                <p className="mt-1 text-[14.5px] leading-relaxed text-ink-soft">{step.body}</p>
                              </div>
                            </li>
                          ))}
                        </ol>
                        <div className="mt-8 flex flex-wrap gap-2.5">
                          <Button size="lg" className="px-6" render={<Link href={`/signup?role=${role}`} />}>
                            Start matching
                            <ArrowRight data-icon="inline-end" />
                          </Button>
                          <Button size="lg" variant="outline" render={<Link href="/pricing" />}>
                            See {copy.label.toLowerCase()} pricing
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex flex-col gap-3 lg:col-span-4">
                      <div className="stage relative flex flex-1 flex-col justify-end overflow-hidden rounded-3xl p-7 shadow-e2 ring-1 ring-line/50 sm:p-8">
                        <p className="text-[64px] leading-none font-semibold tracking-[-0.05em] text-ink tabular-nums sm:text-[80px]">
                          <CountUp to={copy.stat.value} duration={0.9} />
                          <span className="text-ink/40">{copy.stat.suffix}</span>
                        </p>
                        <p className="mt-3 max-w-[18ch] text-[16px] font-medium text-ink">{copy.stat.label}</p>
                      </div>
                      <Card className="border-0 bg-ink py-0 text-white shadow-e2">
                        <CardContent className="space-y-3 p-6">
                          {copy.points.map((point) => (
                            <p key={point} className="flex items-start gap-2.5 text-[14.5px] leading-snug">
                              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-sun text-ink">
                                <Check className="size-3" strokeWidth={3} />
                              </span>
                              {point}
                            </p>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </Reveal>
      </div>
    </section>
  );
}
