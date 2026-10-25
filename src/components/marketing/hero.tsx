"use client";

import { ArrowRight, ShieldOff } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { MatchPreview } from "@/components/marketing/match-preview";
import { CountUp, PingDot, rise } from "@/components/motion";

type HeroStats = { members: number; interviews: number; hoursSaved: number };

export function Hero({ stats }: { stats: HeroStats }) {
  const tiles = [
    { value: stats.interviews, suffix: "+", label: "Interviews booked" },
    { value: stats.members, suffix: "", label: "Hosts & guests" },
    { value: stats.hoursSaved, suffix: " hrs", label: "Saved on back-and-forth" },
  ];

  return (
    <section id="top" className="pt-6 pb-10 sm:pt-10 sm:pb-14">
      <div className="shell grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6 xl:col-span-6">
          <motion.p
            {...rise(0)}
            className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-[12px] font-medium text-ink-soft shadow-e1"
          >
            <PingDot />
            Now matching podcast hosts and guests
          </motion.p>

          <motion.h1
            {...rise(0.08)}
            className="mt-6 text-[44px] leading-[0.96] font-semibold tracking-[-0.05em] text-balance text-ink sm:text-[64px] lg:text-[72px] xl:text-[84px]"
          >
            The host. The guest.
            <br />
            <span className="text-ink-faint">Nobody in between.</span>
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mt-6 max-w-[54ch] text-[17px] leading-relaxed text-pretty text-ink-soft sm:text-[19px]"
          >
            LPN Match pairs podcast hosts with the guests their listeners want, by topic and reliability. You message
            each other directly and book the interview. No assistants, booking agents or forwarded email chains.
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-8 flex flex-wrap gap-2.5">
            <Link
              href="/signup?role=host"
              className="pill group h-12 bg-ink px-6 text-[16px] text-white hover:bg-ink-hover"
            >
              I&apos;m a host
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/signup?role=guest"
              className="pill group h-12 border border-line bg-surface px-6 text-[16px] text-ink hover:bg-subtle"
            >
              I want to be a guest
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <motion.div
            {...rise(0.32)}
            className="mt-8 flex max-w-xl items-center gap-4 rounded-3xl bg-ink p-4 pr-6 text-white sm:p-5"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sun text-ink">
              <ShieldOff className="h-5 w-5" />
            </span>
            <p className="text-[14.5px] leading-snug text-white/80">
              <span className="font-semibold text-white">Direct by design.</span> Every match opens a private thread
              between the host and the guest, with no gatekeepers in the loop.
            </p>
          </motion.div>
        </div>

        <motion.div {...rise(0.2)} className="lg:col-span-6 xl:col-span-6">
          <div className="stage animate-drift rounded-[32px] p-3 sm:p-6 lg:p-8">
            <MatchPreview />
          </div>
        </motion.div>
      </div>

      <div className="shell mt-6 sm:mt-8">
        <dl className="grid gap-3 sm:grid-cols-3">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.label}
              {...rise(0.4 + i * 0.08)}
              className={`rounded-3xl p-6 shadow-e2 ring-1 ring-line/60 sm:p-7 ${["bg-sun", "bg-lilac", "bg-peach"][i]}`}
            >
              <dd className="text-[40px] leading-none font-semibold tracking-[-0.045em] text-ink tabular-nums sm:text-[52px]">
                <CountUp to={tile.value} />
                <span className={i === 0 ? "text-ink/50" : "text-ink-faint"}>{tile.suffix}</span>
              </dd>
              <dt className="mt-3 text-[14px] font-medium text-ink/70">
                {tile.label}
              </dt>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
