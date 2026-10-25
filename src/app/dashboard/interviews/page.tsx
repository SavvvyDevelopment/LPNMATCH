import { ArrowUpRight, CalendarDays, Headphones, Mic, Star } from "lucide-react";

import { EmptyState, PageHeader, StatTile } from "@/components/dashboard/page-header";
import { ToastForm } from "@/components/dashboard/toast-form";
import { Face } from "@/components/member-face";
import { Reveal } from "@/components/motion";
import { advanceInterview, leaveReview } from "@/lib/db/actions";
import { ensureAccount, listInterviews, listReviewsForInterview } from "@/lib/db/data";
import type { InterviewStatus } from "@/lib/db/schema";
import { interviewLabels } from "@/lib/labels";

const statusTone: Record<InterviewStatus, string> = {
  scheduled: "bg-sun text-ink",
  recorded: "bg-brand-soft text-brand",
  released: "bg-mint/80 text-ink",
  cancelled: "bg-subtle text-ink-faint",
};

const nextAction: Partial<Record<InterviewStatus, string>> = {
  scheduled: "Mark recorded",
  recorded: "Mark released",
};

const dateFormat = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

export default async function InterviewsPage() {
  const account = await ensureAccount();
  if (!account) return null;
  const rows = await listInterviews(account.profile.id);
  const reviewGroups = await Promise.all(
    rows.map(async (row) => ({ id: row.interview.id, reviews: await listReviewsForInterview(row.interview.id) })),
  );
  const reviewsById = new Map(reviewGroups.map((group) => [group.id, group.reviews]));
  const count = (status: InterviewStatus) => rows.filter((row) => row.interview.status === status).length;

  return (
    <>
      <PageHeader
        eyebrow="Interviews"
        title={
          <>
            Every recording, <span className="text-ink-faint">start to release.</span>
          </>
        }
        description="Your interview CRM: recording dates, notes, episode links and reviews, all in one place."
      />

      <Reveal>
        <div className="grid gap-3 sm:grid-cols-3">
          <StatTile tone="sun" label="Scheduled" value={count("scheduled")} />
          <StatTile label="Recorded" value={count("recorded")} />
          <StatTile tone="ink" label="Released" value={count("released")} />
        </div>
      </Reveal>

      {rows.length === 0 ? (
        <EmptyState title="No interviews yet" body="Accept a match and an interview slot opens here automatically." />
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {rows.map((row, i) => {
            const { interview } = row;
            const reviews = reviewsById.get(interview.id) ?? [];
            const reviewed = reviews.some((review) => review.authorProfileId === account.profile.id);
            const action = nextAction[interview.status];
            return (
              <Reveal key={interview.id} delay={(i % 2) * 0.06} className="h-full">
                <article className="lift flex h-full flex-col p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-[13px] font-medium text-ink-soft">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {interview.scheduledAt ? dateFormat.format(interview.scheduledAt) : "Date not set"}
                      </p>
                      <h2 className="mt-1.5 text-[20px] leading-snug font-semibold tracking-[-0.03em] text-ink">{interview.title}</h2>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-medium ${statusTone[interview.status]}`}>
                      {interviewLabels[interview.status]}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {[
                      { label: "Host", icon: Mic, person: row.host },
                      { label: "Guest", icon: Headphones, person: row.guest },
                    ].map((side) => (
                      <div key={side.label} className="flex items-center gap-3 rounded-2xl bg-canvas p-3">
                        <Face name={side.person.displayName} photoKey={side.person.photoKey} />
                        <div className="min-w-0">
                          <p className="flex items-center gap-1 text-[11.5px] font-medium text-ink-soft">
                            <side.icon className="h-3 w-3" />
                            {side.label}
                            {side.person.id === account.profile.id && " (you)"}
                          </p>
                          <p className="truncate text-[14px] font-semibold text-ink">{side.person.displayName}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {interview.notes && <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">{interview.notes}</p>}
                  {interview.episodeUrl && (
                    <a
                      href={interview.episodeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="pill group mt-3 h-9 w-fit bg-subtle px-3.5 text-[13px] text-ink hover:bg-ink hover:text-white"
                    >
                      Listen to the episode
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}

                  {reviews.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {reviews.map((review) => (
                        <li key={review.id} className="rounded-2xl bg-canvas p-4">
                          <p className="flex gap-0.5" aria-label={`${review.rating} out of 5`}>
                            {Array.from({ length: 5 }, (_, star) => (
                              <Star
                                key={star}
                                className={`h-3.5 w-3.5 ${star < review.rating ? "fill-sun text-sun" : "text-line"}`}
                              />
                            ))}
                          </p>
                          <p className="mt-2 text-[14px] leading-relaxed text-ink">{review.body}</p>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-auto space-y-3 pt-5">
                    {action && (
                      <ToastForm action={advanceInterview} success={`Interview ${action.replace("Mark ", "")}`}>
                        <input type="hidden" name="interviewId" value={interview.id} />
                        <div className="flex flex-col gap-2 sm:flex-row">
                          {interview.status === "recorded" && (
                            <input
                              name="episodeUrl"
                              type="url"
                              placeholder="Episode link (optional)"
                              className="h-11 flex-1 rounded-full bg-canvas px-4 text-[14px] text-ink outline-none placeholder:text-ink-faint focus:ring-2 focus:ring-brand/50"
                            />
                          )}
                          <button type="submit" className="pill h-11 bg-ink px-5 text-[14px] text-white hover:bg-ink-hover">
                            {action}
                          </button>
                        </div>
                      </ToastForm>
                    )}
                    {!reviewed && interview.status !== "scheduled" && (
                      <ToastForm action={leaveReview} success="Review posted" className="rounded-2xl bg-canvas p-3">
                        <input type="hidden" name="interviewId" value={interview.id} />
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <select
                            name="rating"
                            defaultValue="5"
                            aria-label="Rating"
                            className="h-11 rounded-full bg-surface px-4 text-[14px] text-ink outline-none focus:ring-2 focus:ring-brand/50"
                          >
                            {[5, 4, 3, 2, 1].map((value) => (
                              <option key={value} value={value}>
                                {"★".repeat(value)}
                              </option>
                            ))}
                          </select>
                          <input
                            name="body"
                            required
                            placeholder="How was the interview?"
                            className="h-11 flex-1 rounded-full bg-surface px-4 text-[14px] text-ink outline-none placeholder:text-ink-faint focus:ring-2 focus:ring-brand/50"
                          />
                          <button type="submit" className="pill h-11 border border-line bg-surface px-5 text-[14px] text-ink hover:bg-subtle">
                            Leave review
                          </button>
                        </div>
                      </ToastForm>
                    )}
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
