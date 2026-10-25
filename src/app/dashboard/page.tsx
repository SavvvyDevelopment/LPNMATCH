import { ArrowRight, ArrowUpRight, MessageSquare, Pin, Sparkles } from "lucide-react";
import Link from "next/link";

import { EmptyState, PageHeader, Panel, StatTile } from "@/components/dashboard/page-header";
import { MemberFace } from "@/components/member-face";
import { CountUp, Reveal } from "@/components/motion";
import { ensureAccount, getOwnStats, listInterviews, listMatches, recentActivity } from "@/lib/db/data";
import { hostsShows, interviewLabels, roleLabels } from "@/lib/labels";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export default async function DashboardPage() {
  const account = await ensureAccount();
  if (!account) return null;
  const { profile } = account;
  const [matches, stats, activity, interviews] = await Promise.all([
    listMatches(profile.id),
    getOwnStats(profile.id),
    recentActivity(profile.id),
    listInterviews(profile.id),
  ]);
  const pinned = matches.filter((row) => row.match.pinned);
  const pending = matches.filter((row) => row.match.status === "pending");
  const upcoming = interviews.filter((row) => row.interview.status === "scheduled").slice(0, 3);
  const firstName = profile.displayName.split(" ")[0];
  const seeking = hostsShows(profile.role) ? "guests" : "shows";

  return (
    <>
      <PageHeader
        eyebrow={`${roleLabels[profile.role]} dashboard`}
        title={
          <>
            Hey {firstName}. <span className="text-ink-faint">Let&apos;s book something.</span>
          </>
        }
        description={`${pending.length} new ${pending.length === 1 ? "match is" : "matches are"} waiting on you, and ${upcoming.length} ${upcoming.length === 1 ? "interview is" : "interviews are"} on the calendar.`}
        action={
          <Link href="/dashboard/matches" className="pill group h-11 bg-ink px-5 text-[15px] text-white hover:bg-ink-hover">
            Review matches
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        }
      />

      <Reveal>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile tone="sun" label="Profile views" value={<CountUp to={stats.stats?.profileViews ?? 0} />} hint="All time" />
          <StatTile label="Interview requests" value={<CountUp to={stats.stats?.requests ?? 0} />} hint="From matches and Explore" />
          <StatTile label="Interviews released" value={<CountUp to={stats.stats?.interviewsCount ?? 0} />} hint="Episodes live" />
          <StatTile tone="ink" label="Leaderboard points" value={<CountUp to={stats.stats?.points ?? 0} />} hint="Climb by booking and reviewing" />
        </div>
      </Reveal>

      <div className="grid gap-3 xl:grid-cols-12">
        <Reveal delay={0.05} className="xl:col-span-7">
          <Panel
            title="New matches"
            description={`Hand-picked ${seeking} based on your topics.`}
            action={
              <Link href="/dashboard/matches" className="pill h-9 bg-subtle px-3.5 text-[13px] text-ink hover:bg-ink hover:text-white">
                See all
              </Link>
            }
            className="h-full"
          >
            {pending.length === 0 ? (
              <EmptyState
                title="You're all caught up"
                body="New matches land here as people join. Explore to find more right now."
                action={
                  <Link href="/dashboard/explore" className="pill h-10 bg-ink px-4 text-[14px] text-white hover:bg-ink-hover">
                    Explore
                  </Link>
                }
              />
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {pending.slice(0, 4).map((row) => (
                  <li key={row.match.id}>
                    <Link
                      href="/dashboard/matches"
                      className="group flex h-full flex-col gap-4 rounded-2xl bg-canvas p-4 transition-colors hover:bg-subtle"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <MemberFace
                          name={row.profile.displayName}
                          photoKey={row.profile.photoKey}
                          subtitle={row.profile.showName ?? row.profile.title}
                        />
                        <span className="rounded-full bg-sun px-2.5 py-1 text-[12px] font-semibold text-ink tabular-nums">
                          {row.match.score}%
                        </span>
                      </div>
                      <p className="flex items-center gap-1.5 text-[13px] text-ink-soft">
                        <Sparkles className="h-3.5 w-3.5 shrink-0 text-brand" />
                        <span className="truncate">{row.match.reason}</span>
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </Reveal>

        <Reveal delay={0.1} className="xl:col-span-5">
          <Panel
            title="Upcoming recordings"
            action={
              <Link href="/dashboard/interviews" className="pill h-9 bg-subtle px-3.5 text-[13px] text-ink hover:bg-ink hover:text-white">
                All interviews
              </Link>
            }
            className="h-full"
          >
            {upcoming.length === 0 ? (
              <p className="rounded-2xl bg-canvas p-4 text-[14px] text-ink-soft">
                Accept a match to put your first recording on the calendar.
              </p>
            ) : (
              <ul className="space-y-2">
                {upcoming.map((row) => {
                  const other = row.host.id === profile.id ? row.guest : row.host;
                  return (
                    <li key={row.interview.id} className="flex items-center gap-3 rounded-2xl bg-canvas p-3">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-surface text-center shadow-e1">
                        <span className="text-[11px] leading-tight font-semibold text-ink">
                          {row.interview.scheduledAt ? dateFormat.format(row.interview.scheduledAt) : "TBD"}
                        </span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14.5px] font-semibold text-ink">{row.interview.title}</p>
                        <p className="truncate text-[13px] text-ink-soft">with {other.displayName}</p>
                      </div>
                      <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11.5px] font-medium text-brand">
                        {interviewLabels[row.interview.status]}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </Reveal>

        <Reveal delay={0.05} className="xl:col-span-5">
          <Panel title="Pinned" description="People you're keeping close." className="h-full">
            {pinned.length === 0 ? (
              <p className="rounded-2xl bg-canvas p-4 text-[14px] text-ink-soft">Pin a match to keep them here.</p>
            ) : (
              <ul className="space-y-2">
                {pinned.map((row) => (
                  <li key={row.match.id}>
                    <Link
                      href={`/profile/${row.profile.username}`}
                      className="group flex items-center justify-between gap-3 rounded-2xl bg-canvas p-3 transition-colors hover:bg-subtle"
                    >
                      <MemberFace name={row.profile.displayName} photoKey={row.profile.photoKey} subtitle={roleLabels[row.profile.role]} />
                      <span className="flex items-center gap-2">
                        <Pin className="h-3.5 w-3.5 text-ink-faint" />
                        <ArrowUpRight className="h-4 w-4 text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </Reveal>

        <Reveal delay={0.1} className="xl:col-span-7">
          <Panel title="Recent activity" description="Messages and matches on your profile." className="h-full">
            {activity.length === 0 ? (
              <p className="rounded-2xl bg-canvas p-4 text-[14px] text-ink-soft">Activity shows up after your first match.</p>
            ) : (
              <ul className="space-y-2">
                {activity.map((item) => (
                  <li key={item.id}>
                    <Link href={item.href} className="flex items-center gap-3 rounded-2xl bg-canvas p-3 transition-colors hover:bg-subtle">
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                          item.kind === "message" ? "bg-ink text-white" : "bg-linear-to-br from-lilac to-peach text-ink"
                        }`}
                      >
                        {item.kind === "message" ? <MessageSquare className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[14.5px] font-semibold text-ink">{item.title}</p>
                        <p className="truncate text-[13px] text-ink-soft">{item.detail}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </Reveal>
      </div>
    </>
  );
}
