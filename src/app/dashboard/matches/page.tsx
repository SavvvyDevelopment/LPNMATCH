import { ArrowUpRight, BadgeCheck, Check, Pin, PinOff, Sparkles, X } from "lucide-react";
import Link from "next/link";

import { EmptyState, PageHeader } from "@/components/dashboard/page-header";
import { ToastForm } from "@/components/dashboard/toast-form";
import { Face } from "@/components/member-face";
import { Reveal } from "@/components/motion";
import { respondToMatch, togglePin } from "@/lib/db/actions";
import { ensureAccount, listMatches } from "@/lib/db/data";
import { formatCount, hostsShows, roleLabels } from "@/lib/labels";

const statusTone = {
  pending: "bg-sun text-ink",
  accepted: "bg-mint/80 text-ink",
  declined: "bg-subtle text-ink-faint",
} as const;

const statusLabel = { pending: "New", accepted: "Accepted", declined: "Declined" } as const;

export default async function MatchesPage() {
  const account = await ensureAccount();
  if (!account) return null;
  const rows = await listMatches(account.profile.id);
  const seeking = hostsShows(account.profile.role) ? "guests" : "shows";

  return (
    <>
      <PageHeader
        eyebrow="Matches"
        title={
          <>
            Your best-fit {seeking}, <span className="text-ink-faint">ranked.</span>
          </>
        }
        description="Matched on shared topics, audience and reliability. Accepting opens a direct thread and books an interview slot."
        action={
          <Link href="/dashboard/explore" className="pill h-11 border border-line bg-surface px-5 text-[15px] text-ink hover:bg-subtle">
            Explore more
          </Link>
        }
      />

      {rows.length === 0 ? (
        <EmptyState
          title="No matches yet"
          body="Add topics to your profile so we can find the right people, then check Explore."
          action={
            <Link href="/dashboard/profile" className="pill h-10 bg-ink px-4 text-[14px] text-white hover:bg-ink-hover">
              Add topics
            </Link>
          }
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {rows.map((row, i) => {
            const person = row.profile;
            return (
              <Reveal key={row.match.id} delay={(i % 3) * 0.06} className="h-full">
                <article className="lift group flex h-full flex-col p-3 transition-shadow duration-300 hover:shadow-e2">
                  <div className="stage-soft relative rounded-[20px] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <Face
                        name={person.displayName}
                        photoKey={person.photoKey}
                        className="h-16 w-16 text-[20px] shadow-e1 transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="grid h-14 w-14 place-items-center rounded-full bg-surface text-[16px] font-semibold text-ink tabular-nums shadow-e1">
                          {row.match.score}%
                        </span>
                      </div>
                    </div>
                    <h2 className="mt-4 flex items-center gap-1.5 text-[20px] font-semibold tracking-[-0.03em] text-ink">
                      {person.displayName}
                      {person.verified && <BadgeCheck className="h-4 w-4 text-brand" />}
                    </h2>
                    <p className="text-[14px] text-ink-soft">
                      {hostsShows(person.role) && person.showName ? person.showName : person.title}
                    </p>
                    <span className={`absolute top-4 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-1 text-[11.5px] font-medium ${statusTone[row.match.status]}`}>
                      {statusLabel[row.match.status]}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col px-2 pt-4 pb-1">
                    <p className="flex items-start gap-2 text-[14px] text-ink">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      {row.match.reason}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      <li className="rounded-full bg-ink px-2.5 py-1 text-[12px] font-medium text-white">{roleLabels[person.role]}</li>
                      {person.topics.slice(0, 3).map((topic) => (
                        <li key={topic} className="rounded-full bg-canvas px-2.5 py-1 text-[12px] font-medium text-ink-soft">
                          {topic}
                        </li>
                      ))}
                    </ul>
                    <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                      {[
                        { label: "Response", value: `${person.responseRate}%` },
                        { label: "Reliable", value: `${person.reliability}%` },
                        {
                          label: person.audienceSize > 0 ? "Listeners" : "Accepts",
                          value: person.audienceSize > 0 ? formatCount(person.audienceSize) : `${person.acceptanceRate}%`,
                        },
                      ].map((item) => (
                        <div key={item.label} className="rounded-2xl bg-canvas px-2 py-2.5">
                          <dd className="text-[15px] font-semibold text-ink tabular-nums">{item.value}</dd>
                          <dt className="text-[11.5px] text-ink-soft">{item.label}</dt>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-auto flex items-center gap-2 pt-4">
                      {row.match.status === "pending" ? (
                        <>
                          <ToastForm action={respondToMatch} success="Match accepted. Say hi in Messages!" className="flex-1">
                            <input type="hidden" name="matchId" value={row.match.id} />
                            <input type="hidden" name="decision" value="accepted" />
                            <button type="submit" className="pill h-11 w-full bg-ink text-[14px] text-white hover:bg-ink-hover">
                              <Check className="h-4 w-4" />
                              Accept
                            </button>
                          </ToastForm>
                          <ToastForm action={respondToMatch} success="Match declined">
                            <input type="hidden" name="matchId" value={row.match.id} />
                            <input type="hidden" name="decision" value="declined" />
                            <button
                              type="submit"
                              aria-label="Decline"
                              className="pill h-11 w-11 border border-line bg-surface text-ink hover:bg-subtle"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </ToastForm>
                        </>
                      ) : (
                        <Link
                          href={`/profile/${person.username}`}
                          className="pill group/link h-11 flex-1 border border-line bg-surface text-[14px] text-ink hover:bg-subtle"
                        >
                          View profile
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </Link>
                      )}
                      <ToastForm action={togglePin} success={row.match.pinned ? "Unpinned" : "Pinned to your dashboard"}>
                        <input type="hidden" name="matchId" value={row.match.id} />
                        <button
                          type="submit"
                          aria-label={row.match.pinned ? "Unpin" : "Pin"}
                          className={`pill h-11 w-11 ${row.match.pinned ? "bg-sun text-ink hover:bg-sun/80" : "bg-subtle text-ink hover:bg-ink hover:text-white"}`}
                        >
                          {row.match.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                        </button>
                      </ToastForm>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      )}
    </>
  );
}
