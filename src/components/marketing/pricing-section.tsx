"use client";

import { ArrowRight, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

import { ease, Reveal, SectionHeading } from "@/components/motion";
import { pricing, roleCopy } from "@/lib/content";
import type { MemberRole } from "@/lib/db/schema";
import { memberRoles } from "@/lib/labels";

const standardFeatures = [
  "Public show page or guest one-sheet",
  "Unlimited matches",
  `Pin up to ${pricing.standardPins} members`,
  "Explore beyond your matches",
  "Direct messages and booking",
  "Workflows and interview CRM",
];

const professionalFeatures = [
  "Everything in Standard",
  `Pin up to ${pricing.professionalPins} members`,
  "Premium explore filters",
  "Higher placement in matches and search",
  "Certified professional badge",
  "Reach and response stats",
];

const notes = [
  "Free to create a profile and look around before you pick a plan.",
  `Your profile link earns ${pricing.affiliatePercent}% referral credit when someone joins through it.`,
  "Card checkout isn't connected in this build. Plan changes are recorded without a charge.",
];

function priceFor(role: MemberRole, tier: "standard" | "professional") {
  if (role === "agency") return tier === "standard" ? pricing.agency.base : pricing.agency.base + 80;
  return pricing[role][tier];
}

export function PricingSection({ heading = true }: { heading?: boolean }) {
  const [role, setRole] = useState<MemberRole>("host");

  const plans = [
    {
      tier: "standard" as const,
      name: "Standard",
      body:
        role === "agency"
          ? `Two client profiles included, then $${pricing.agency.extraClient} per extra client.`
          : "Everything you need to match, message and book interviews.",
      features: standardFeatures,
    },
    {
      tier: "professional" as const,
      name: "Professional",
      body: "More pins, premium filters and a badge that puts you at the top of results.",
      features: professionalFeatures,
      featured: true,
    },
  ];

  return (
    <section id="pricing" className="scroll-mt-20 py-10 sm:py-16">
      <div className="shell">
        {heading && (
          <SectionHeading
            label="Pricing"
            title={
              <>
                Simple plans, <span className="text-ink-faint">priced by role.</span>
              </>
            }
            body="Pick the side of the mic you're on. You can switch roles or plans any time from your dashboard."
          />
        )}

        <Reveal delay={0.05} className={heading ? "mt-8" : undefined}>
          <div className="inline-flex flex-wrap gap-1 rounded-full bg-surface p-1 shadow-e1" role="tablist">
            {memberRoles.map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={role === item}
                onClick={() => setRole(item)}
                className="relative rounded-full px-4 py-2 text-[14px] font-medium sm:px-5"
              >
                {role === item && (
                  <motion.span layoutId="pricing-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: 0.4, ease }} />
                )}
                <span className={`relative ${role === item ? "text-white" : "text-ink-soft hover:text-ink"}`}>
                  {roleCopy[item].label}
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.tier} delay={i * 0.1} className="h-full">
              <article
                className={`group relative flex h-full flex-col overflow-hidden rounded-3xl p-7 shadow-e2 ring-1 ring-line/70 transition-shadow duration-300 hover:shadow-e2 sm:p-8 ${
                  plan.featured ? "bg-ink text-white" : "bg-surface text-ink"
                }`}
              >
                {plan.featured && (
                  <div
                    className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-linear-to-br from-lilac/50 to-peach/50 blur-3xl"
                    aria-hidden
                  />
                )}
                <div className="relative flex items-center justify-between gap-3">
                  <p className={`text-[14px] font-medium ${plan.featured ? "text-white/70" : "text-ink-soft"}`}>{plan.name}</p>
                  {plan.featured && (
                    <span className="rounded-full bg-sun px-2.5 py-1 text-[12px] font-medium text-ink">Most popular</span>
                  )}
                </div>
                <div className="relative mt-6 flex items-baseline gap-1.5">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`${role}-${plan.tier}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease }}
                      className="text-[56px] leading-none font-semibold tracking-[-0.05em] tabular-nums"
                    >
                      ${priceFor(role, plan.tier)}
                    </motion.span>
                  </AnimatePresence>
                  <span className={`text-[15px] ${plan.featured ? "text-white/60" : "text-ink-soft"}`}>/ month</span>
                </div>
                <p className={`relative mt-4 text-[15px] leading-relaxed ${plan.featured ? "text-white/70" : "text-ink-soft"}`}>
                  {plan.body}
                </p>
                <ul className="relative mt-6 mb-8 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-[15px]">
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                          plan.featured ? "bg-white/15 text-white" : "bg-brand-soft text-brand"
                        }`}
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/signup?role=${role}${plan.tier === "professional" ? "&plan=professional" : ""}`}
                  className={`pill relative mt-auto h-12 text-[15px] ${
                    plan.featured ? "bg-white text-ink hover:bg-subtle" : "border border-line bg-surface text-ink hover:bg-subtle"
                  }`}
                >
                  Choose {plan.name}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </article>
            </Reveal>
          ))}

          <Reveal delay={0.2} className="h-full md:col-span-2 lg:col-span-1">
            <article className="stage-soft flex h-full flex-col justify-between gap-6 rounded-3xl p-7 sm:p-8">
              <div>
                <p className="text-[14px] font-medium text-ink-soft">Try it and decide</p>
                <h3 className="mt-3 text-[28px] leading-[1.05] font-semibold tracking-[-0.04em] text-ink">
                  Not useful? We&apos;ll refund your month.
                </h3>
              </div>
              <ul className="space-y-3">
                {notes.map((note) => (
                  <li key={note} className="flex gap-3 text-[14.5px] leading-relaxed text-ink-soft">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink text-white">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {note}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
