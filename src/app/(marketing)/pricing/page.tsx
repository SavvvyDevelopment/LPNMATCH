import type { Metadata } from "next";

import { Faq } from "@/components/marketing/faq";
import { PricingSection } from "@/components/marketing/pricing-section";
import { ClosingCta } from "@/components/marketing/sections";
import { PingDot, Rise } from "@/components/motion";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <>
      <section className="pt-6 sm:pt-12">
        <div className="shell">
          <Rise>
            <p className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-[12px] font-medium text-ink-soft shadow-e1">
              <PingDot />
              Free to join, pay when you&apos;re ready
            </p>
          </Rise>
          <Rise delay={0.08}>
            <h1 className="mt-6 max-w-4xl text-[44px] leading-[0.98] font-semibold tracking-[-0.05em] text-balance text-ink sm:text-[64px] lg:text-[76px]">
              Pricing for every <span className="text-ink-faint">side of the mic.</span>
            </h1>
          </Rise>
          <Rise delay={0.16}>
            <p className="mt-5 max-w-[56ch] text-[17px] leading-relaxed text-ink-soft sm:text-[19px]">
              Standard covers matching, messaging and booking. Professional adds premium filters, more pins and a
              badge. Agencies start with two client profiles.
            </p>
          </Rise>
        </div>
      </section>
      <PricingSection heading={false} />
      <Faq />
      <ClosingCta />
    </>
  );
}
