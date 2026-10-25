import { BadgeCheck, Trophy } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { Face } from "@/components/member-face";
import { Reveal } from "@/components/motion";
import { ensureAccount, getLeaderboard } from "@/lib/db/data";
import { formatCount, roleLabels } from "@/lib/labels";

const podiumTone = ["bg-sun", "bg-surface", "stage-soft"];

export default async function LeaderboardPage() {
  const [account, rows] = await Promise.all([ensureAccount(), getLeaderboard()]);
  const podium = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <>
      <PageHeader
        eyebrow="Leaderboard"
        title={
          <>
            Who&apos;s booking <span className="text-ink-faint">the most.</span>
          </>
        }
        description="Points come from released interviews, reviews and profile reach."
      />

      <div className="grid gap-3 md:grid-cols-3">
        {podium.map((row, i) => (
          <Reveal key={row.profile.id} delay={i * 0.08} className="h-full">
            <Link
              href={`/profile/${row.profile.username}`}
              className={`group relative flex h-full flex-col overflow-hidden rounded-3xl p-6 transition-shadow duration-300 hover:shadow-e2 sm:p-7 ${podiumTone[i]}`}
            >
              <div className="flex items-start justify-between">
                <Face
                  name={row.profile.displayName}
                  photoKey={row.profile.photoKey}
                  className="h-16 w-16 text-[20px] shadow-e1 transition-transform duration-300 group-hover:scale-105"
                />
                <span className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[13px] font-semibold text-white">
                  <Trophy className="h-3.5 w-3.5 text-sun" />#{i + 1}
                </span>
              </div>
              <h2 className="mt-5 flex items-center gap-1.5 text-[20px] font-semibold tracking-[-0.03em] text-ink">
                {row.profile.displayName}
                {row.profile.verified && <BadgeCheck className="h-4 w-4 text-brand" />}
              </h2>
              <p className="text-[14px] text-ink-soft">{row.profile.showName ?? roleLabels[row.profile.role]}</p>
              <p className="mt-6 text-[48px] leading-none font-semibold tracking-[-0.05em] text-ink tabular-nums">
                {row.stats.points.toLocaleString("en-US")}
                <span className="ml-1.5 text-[16px] font-medium tracking-normal text-ink-soft">pts</span>
              </p>
              <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Interviews", value: row.stats.interviewsCount },
                  { label: "Reviews", value: row.stats.reviewsCount },
                  { label: "Reach", value: formatCount(row.stats.socialImpressions) },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-surface/70 px-2 py-2.5">
                    <dd className="text-[15px] font-semibold text-ink tabular-nums">{item.value}</dd>
                    <dt className="text-[11.5px] text-ink-soft">{item.label}</dt>
                  </div>
                ))}
              </dl>
            </Link>
          </Reveal>
        ))}
      </div>

      {rest.length > 0 && (
        <Reveal delay={0.1}>
          <div className="rounded-3xl bg-surface p-2">
            <div className="hidden grid-cols-[3rem_1fr_7rem_7rem_7rem] gap-3 px-4 py-3 text-[12px] font-medium text-ink-soft md:grid">
              <span>Rank</span>
              <span>Member</span>
              <span className="text-right">Interviews</span>
              <span className="text-right">Reviews</span>
              <span className="text-right">Points</span>
            </div>
            <ol className="space-y-1">
              {rest.map((row, i) => {
                const mine = row.profile.id === account?.profile.id;
                return (
                  <li key={row.profile.id}>
                    <Link
                      href={`/profile/${row.profile.username}`}
                      className={`grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-2xl px-3 py-3 transition-colors md:grid-cols-[3rem_1fr_7rem_7rem_7rem] md:px-4 ${
                        mine ? "bg-brand-soft" : "hover:bg-canvas"
                      }`}
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-canvas text-[13px] font-semibold text-ink tabular-nums">
                        {i + 4}
                      </span>
                      <span className="flex min-w-0 items-center gap-3">
                        <Face name={row.profile.displayName} photoKey={row.profile.photoKey} />
                        <span className="min-w-0">
                          <span className="block truncate text-[14.5px] font-semibold text-ink">
                            {row.profile.displayName}
                            {mine && " (you)"}
                          </span>
                          <span className="block truncate text-[12.5px] text-ink-soft">{roleLabels[row.profile.role]}</span>
                        </span>
                      </span>
                      <span className="hidden text-right text-[14px] text-ink tabular-nums md:block">{row.stats.interviewsCount}</span>
                      <span className="hidden text-right text-[14px] text-ink tabular-nums md:block">{row.stats.reviewsCount}</span>
                      <span className="text-right text-[15px] font-semibold text-ink tabular-nums">
                        {row.stats.points.toLocaleString("en-US")}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </Reveal>
      )}
    </>
  );
}
