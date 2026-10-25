import {
  Baby,
  Briefcase,
  ChartColumn,
  Cpu,
  FlaskConical,
  Flower2,
  GraduationCap,
  Headphones,
  HeartPulse,
  Laugh,
  type LucideIcon,
  Megaphone,
  MessageSquare,
  Mic,
  Palette,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRound,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import { MemberShowcase } from "@/components/marketing/members";
import { CountUp, Reveal, SectionHeading } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categories, howItWorks, productAreas } from "@/lib/content";
import type { Profile } from "@/lib/db/schema";

const categoryIcons: Record<(typeof categories)[number], { icon: LucideIcon; tone: string }> = {
  Business: { icon: Briefcase, tone: "bg-sun" },
  Entrepreneurship: { icon: Rocket, tone: "bg-peach" },
  Marketing: { icon: Megaphone, tone: "bg-lilac" },
  Technology: { icon: Cpu, tone: "bg-brand-soft" },
  "Health & Wellness": { icon: HeartPulse, tone: "bg-mint" },
  "Personal Finance": { icon: Wallet, tone: "bg-sun" },
  Leadership: { icon: Trophy, tone: "bg-lilac" },
  "Self-Improvement": { icon: Sparkles, tone: "bg-peach" },
  Comedy: { icon: Laugh, tone: "bg-sun" },
  "True Crime": { icon: Search, tone: "bg-ink text-white" },
  Education: { icon: GraduationCap, tone: "bg-brand-soft" },
  Parenting: { icon: Baby, tone: "bg-peach" },
  Sports: { icon: Trophy, tone: "bg-mint" },
  Spirituality: { icon: Flower2, tone: "bg-lilac" },
  Science: { icon: FlaskConical, tone: "bg-brand-soft" },
  Culture: { icon: Palette, tone: "bg-peach" },
};

const productIcons = [Sparkles, MessageSquare, UserRound, Mic, ChartColumn] as const;

function MarqueeRow({ offset = 0, reverse = false }: { offset?: number; reverse?: boolean }) {
  const ordered = [...categories.slice(offset), ...categories.slice(0, offset)];
  const items = [...ordered, ...ordered];
  return (
    <div className="w-full min-w-0 overflow-hidden">
      <ul className={`flex w-max gap-3 py-1.5 ${reverse ? "animate-marquee-reverse" : "animate-marquee"} hover:[animation-play-state:paused]`}>
        {items.map((item, i) => {
          const meta = categoryIcons[item];
          const Icon = meta.icon;
          return (
            <li
              key={`${item}-${i}`}
              aria-hidden={i >= ordered.length}
              className="flex items-center gap-2.5 rounded-full bg-surface px-4 py-2.5 text-[15px] font-medium whitespace-nowrap text-ink shadow-e1 ring-1 ring-line/70"
            >
              <span className={`grid size-7 place-items-center rounded-full ${meta.tone}`}>
                <Icon className="size-3.5" />
              </span>
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function CategoryMarquee() {
  return (
    <section aria-label="Podcast categories on LPN Match" className="py-6 sm:py-10">
      <div className="space-y-3">
        <MarqueeRow />
        <MarqueeRow offset={5} reverse />
      </div>
    </section>
  );
}

export function ProductStrip() {
  return (
    <section id="features" className="scroll-mt-20 py-10 sm:py-16">
      <div className="shell">
        <SectionHeading
          label="Inside the product"
          title={
            <>
              One workspace for <span className="text-ink-faint">every interview.</span>
            </>
          }
          body="Matches, messages, your profile, the recording calendar, and the numbers. Nothing sits in a side inbox."
        />
        <div className="mt-8 flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible">
          {productAreas.map((area, i) => {
            const Icon = productIcons[i];
            return (
              <Reveal key={area.title} delay={i * 0.06} className="w-[16rem] shrink-0 lg:w-auto">
                <Card className={`h-full border-0 py-0 shadow-e2 ${area.tone}`}>
                  <CardHeader className="pt-6">
                    <span className="grid size-11 place-items-center rounded-2xl bg-ink text-white">
                      <Icon className="size-5" />
                    </span>
                    <CardTitle className="mt-4 text-[22px]">{area.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-6 text-[15px] leading-relaxed text-ink">{area.body}</CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 py-10 sm:py-16">
      <div className="shell">
        <SectionHeading
          label="How it works"
          title={
            <>
              From profile to <span className="text-ink-faint">published episode.</span>
            </>
          }
          body="Seven steps. The host and the guest stay in the same thread the whole way."
        />
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {howItWorks.map((step, i) => (
            <li key={step.title} className="h-full">
              <Reveal delay={(i % 4) * 0.06} className="h-full">
                <Card className={`h-full border-0 py-0 shadow-e2 ${i === howItWorks.length - 1 ? "bg-ink text-white" : ""}`}>
                  <CardContent className="p-6">
                    <span
                      className={`grid size-10 place-items-center rounded-full text-[15px] font-semibold tabular-nums ${
                        i === howItWorks.length - 1 ? "bg-sun text-ink" : "bg-brand text-white"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <h3 className="mt-5 text-[18px] font-semibold tracking-[-0.02em]">{step.title}</h3>
                    <p className={`mt-2 text-[15px] leading-relaxed ${i === howItWorks.length - 1 ? "text-white/70" : "text-ink-soft"}`}>
                      {step.body}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            </li>
          ))}
          <li className="h-full">
            <Reveal delay={0.2} className="h-full">
              <Link href="/signup" className="stage flex h-full min-h-48 flex-col justify-between rounded-3xl p-6 shadow-e2 ring-1 ring-line/50">
                <Badge variant="sun">Ready?</Badge>
                <span className="flex items-center justify-between text-[20px] font-semibold tracking-[-0.03em] text-ink">
                  Create your profile
                  <span className="grid size-10 place-items-center rounded-full bg-ink text-white">
                    <Rocket className="size-4" />
                  </span>
                </span>
              </Link>
            </Reveal>
          </li>
        </ol>
      </div>
    </section>
  );
}

export function StatsBand({
  stats,
}: {
  stats: { members: number; interviews: number; views: number; impressions: number; messages: number; hoursSaved: number };
}) {
  const items = [
    { label: "Active members", value: stats.members, tone: "bg-sun text-ink" },
    { label: "Interviews booked", value: stats.interviews, tone: "bg-lilac text-ink" },
    { label: "Profile views", value: stats.views, tone: "bg-peach text-ink" },
    { label: "Social impressions", value: stats.impressions, tone: "bg-white text-ink" },
    { label: "Messages kept in-app", value: stats.messages, tone: "bg-mint text-ink" },
    { label: "Admin hours saved", value: stats.hoursSaved, tone: "bg-brand text-white" },
  ];
  return (
    <section className="py-10 sm:py-16">
      <div className="shell">
        <Reveal>
          <div className="stage-ink overflow-hidden rounded-[32px] p-6 text-white shadow-e2 sm:p-10 lg:p-12">
            <p className="text-[13px] font-medium text-white/60">LPN Match, live</p>
            <h2 className="mt-2 max-w-3xl text-[34px] leading-[1.02] font-semibold tracking-[-0.045em] text-balance sm:text-[48px]">
              Real hosts. Real guests. <span className="text-white/45">Real numbers.</span>
            </h2>
            <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div key={item.label} className={`rounded-3xl p-5 sm:p-6 ${item.tone}`}>
                  <dd className="text-[36px] leading-none font-semibold tracking-[-0.045em] tabular-nums sm:text-[44px]">
                    <CountUp to={item.value} />
                  </dd>
                  <dt className="mt-3 text-[14px] font-medium opacity-70">{item.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function FeaturedMembers({ hosts, guests }: { hosts: Profile[]; guests: Profile[] }) {
  return (
    <section id="members" className="scroll-mt-20 py-10 sm:py-16">
      <div className="shell">
        <SectionHeading
          label="Who's on LPN Match"
          title={
            <>
              Shows looking for guests. <span className="text-ink-faint">Guests looking for shows.</span>
            </>
          }
          body="Every profile is public. Open one to see topics, reviews, and what they won't talk about."
        />
        <MemberShowcase hosts={hosts} guests={guests} />
      </div>
    </section>
  );
}

export function Guarantee() {
  return (
    <section className="py-4 sm:py-6">
      <div className="shell">
        <Reveal>
          <Card className="border-0 bg-peach py-0 shadow-e2">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-ink text-white">
                <ShieldCheck className="size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-ink sm:text-[28px]">Try it, then decide.</h2>
                <p className="mt-1 max-w-2xl text-[15.5px] leading-relaxed text-ink/80">
                  If the workspace isn&apos;t useful, tell us and we&apos;ll refund a paid month. Card checkout isn&apos;t connected in
                  this build, so changing plans only updates your badge and pin limit.
                </p>
              </div>
              <Button variant="default" size="lg" render={<Link href="/pricing" />}>
                Compare plans
              </Button>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

export function ClosingCta() {
  return (
    <section className="py-10 sm:py-16">
      <div className="shell">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] bg-ink px-6 py-14 text-center text-white sm:px-10 sm:py-20">
            <div className="absolute -top-24 -left-16 size-80 rounded-full bg-lilac/50 blur-3xl" aria-hidden />
            <div className="absolute -right-16 -bottom-24 size-80 rounded-full bg-peach/50 blur-3xl" aria-hidden />
            <div className="absolute top-10 right-1/4 size-40 rounded-full bg-sun/30 blur-3xl" aria-hidden />
            <div className="relative">
              <p className="inline-flex items-center gap-2 text-[13px] font-medium text-white/70">
                <Headphones className="size-4 text-sun" />
                Your next episode starts here
              </p>
              <h2 className="mx-auto mt-3 max-w-4xl text-[36px] leading-[1.02] font-semibold tracking-[-0.045em] text-balance sm:text-[60px]">
                Find your next guest, or your next show.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-white/70">
                Join as a host, a guest, both, or an agency. You can switch later.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2.5">
                <Button size="lg" variant="light" className="px-6" render={<Link href="/signup" />}>
                  Join LPN Match
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="bg-white/10 px-6 text-white ring-1 ring-white/20 hover:bg-white/20 hover:text-white"
                  render={<Link href="/#start" />}
                >
                  I&apos;m a host or a guest
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
