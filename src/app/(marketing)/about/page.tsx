import { Headphones, Mic, ShieldOff, Sparkles } from "lucide-react";
import type { Metadata } from "next";

import { PingDot, Reveal, Rise, SectionHeading } from "@/components/motion";
import { ClosingCta, Guarantee } from "@/components/marketing/sections";

export const metadata: Metadata = { title: "About" };

const principles = [
  {
    icon: ShieldOff,
    title: "No middlemen",
    body: "Hosts and guests talk directly. We don't put assistants, agents or gatekeepers between you.",
  },
  {
    icon: Sparkles,
    title: "Fit over volume",
    body: "Matches are ranked by topic, audience and reliability, so you see fewer pitches that fit better.",
  },
  {
    icon: Mic,
    title: "Hosts in control",
    body: "Show pages tell guests what you cover and who listens, before anyone hits send.",
  },
  {
    icon: Headphones,
    title: "Guests get seen",
    body: "One-sheets carry your topics, video pitch, reviews and past episodes to every new show.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-6 pb-6 sm:pt-12">
        <div className="shell">
          <Rise>
            <p className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-[12px] font-medium text-ink-soft shadow-e1">
              <PingDot />
              About LPN Match
            </p>
          </Rise>
          <Rise delay={0.08}>
            <h1 className="mt-6 max-w-5xl text-[44px] leading-[0.98] font-semibold tracking-[-0.05em] text-balance text-ink sm:text-[64px] lg:text-[76px]">
              Great conversations start with <span className="text-ink-faint">the right two people.</span>
            </h1>
          </Rise>
          <Rise delay={0.16}>
            <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed text-ink-soft sm:text-[19px]">
              Most podcast interviews take weeks of pitching, forwarding and scheduling before the host and guest ever
              speak. We built LPN Match so hosts and guests can find each other, talk directly and get to the
              recording.
            </p>
          </Rise>
        </div>
      </section>

      <section className="py-10 sm:py-16">
        <div className="shell">
          <SectionHeading
            label="What we believe"
            title={
              <>
                Four ideas behind <span className="text-ink-faint">every match.</span>
              </>
            }
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {principles.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08} className="h-full">
                <article className="group h-full rounded-3xl bg-surface p-6 transition-shadow duration-300 hover:shadow-e2 sm:p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-subtle text-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-white">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 text-[20px] font-semibold tracking-[-0.03em] text-ink">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Guarantee />
      <ClosingCta />
    </>
  );
}
