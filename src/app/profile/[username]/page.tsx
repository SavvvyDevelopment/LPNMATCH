import { ArrowRight, ArrowUpRight, BadgeCheck, Globe, MapPin, Mic, PlayCircle, Star } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter, SiteHeader } from "@/components/marketing/site-chrome";
import { Face } from "@/components/member-face";
import { CountUp, Reveal, Rise } from "@/components/motion";
import { bumpProfileView, getPublicProfile, getSessionUser } from "@/lib/db/data";
import { formatCount, hostsShows, roleLabels } from "@/lib/labels";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const data = await getPublicProfile(username).catch(() => null);
  return { title: data?.profile.displayName ?? "Profile" };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const data = await getPublicProfile(username);
  if (!data) notFound();
  const viewer = await getSessionUser().catch(() => null);
  if (viewer?.id !== data.profile.userId) await bumpProfileView(data.profile.id);

  const { profile, stats, reviews } = data;
  const isHost = hostsShows(profile.role);
  const average = reviews.length ? reviews.reduce((sum, row) => sum + row.review.rating, 0) / reviews.length : 0;

  const tiles = [
    { label: "Interviews", value: stats?.interviewsCount ?? 0 },
    { label: "Reviews", value: stats?.reviewsCount ?? 0 },
    { label: "Profile views", value: stats?.profileViews ?? 0 },
    { label: "Social reach", value: stats?.socialImpressions ?? 0 },
  ];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1 pt-4 pb-10 sm:pt-8">
        <div className="shell grid gap-3 lg:grid-cols-12">
          <Rise className="lg:col-span-8">
            <section className="stage animate-drift relative h-full overflow-hidden rounded-[32px] p-6 sm:p-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                  <Face
                    name={profile.displayName}
                    photoKey={profile.photoKey}
                    className="h-28 w-28 rounded-[28px] text-[36px] shadow-e2 ring-4 ring-surface"
                  />
                  <div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-ink px-2.5 py-1 text-[12px] font-medium text-white">{roleLabels[profile.role]}</span>
                      {profile.professionalBadge && (
                        <span className="rounded-full bg-sun px-2.5 py-1 text-[12px] font-medium text-ink">Certified pro</span>
                      )}
                      <span
                        className={`rounded-full px-2.5 py-1 text-[12px] font-medium ${profile.accepting ? "bg-mint text-ink" : "bg-surface text-ink-soft"}`}
                      >
                        {profile.accepting ? "Open to matches" : "Booked up"}
                      </span>
                    </div>
                    <h1 className="mt-3 flex items-center gap-2 text-[40px] leading-[0.98] font-semibold tracking-[-0.05em] text-ink sm:text-[56px]">
                      {profile.displayName}
                      {profile.verified && <BadgeCheck className="h-7 w-7 shrink-0 text-brand" />}
                    </h1>
                    {isHost && profile.showName && (
                      <p className="mt-2 flex items-center gap-1.5 text-[17px] font-semibold text-ink">
                        <Mic className="h-4 w-4" />
                        {profile.showName}
                      </p>
                    )}
                    <p className="mt-1 max-w-[50ch] text-[16px] text-ink-soft">{profile.title}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {profile.location && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface/80 px-3 py-1.5 text-[13px] font-medium text-ink-soft backdrop-blur">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.location}
                  </span>
                )}
                {isHost && profile.audienceSize > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface/80 px-3 py-1.5 text-[13px] font-medium text-ink-soft backdrop-blur">
                    {formatCount(profile.audienceSize)} listeners per episode
                  </span>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-surface/80 px-3 py-1.5 text-[13px] font-medium text-ink backdrop-blur hover:bg-surface"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    Website
                  </a>
                )}
                {profile.videoPitchUrl && (
                  <a
                    href={profile.videoPitchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[13px] font-medium text-white hover:bg-ink-hover"
                  >
                    <PlayCircle className="h-3.5 w-3.5" />
                    Watch video pitch
                  </a>
                )}
              </div>
            </section>
          </Rise>

          <Rise delay={0.08} className="lg:col-span-4">
            <aside className="flex h-full flex-col rounded-[32px] bg-ink p-6 text-white sm:p-8">
              <p className="text-[13px] font-medium text-white/60">{isHost ? "Want to be on the show?" : "Want them on your show?"}</p>
              <h2 className="mt-2 text-[28px] leading-[1.05] font-semibold tracking-[-0.04em]">
                Message {profile.displayName.split(" ")[0]} directly.
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/70">
                No assistants or booking agents. Match on LPN Match and the thread is just the two of you.
              </p>
              <dl className="mt-6 grid grid-cols-3 gap-2">
                {[
                  { label: "Response", value: profile.responseRate },
                  { label: "Accepts", value: profile.acceptanceRate },
                  { label: "Reliable", value: profile.reliability },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white/10 px-2 py-3 text-center">
                    <dd className="text-[20px] font-semibold tabular-nums">{item.value}%</dd>
                    <dt className="text-[11.5px] text-white/60">{item.label}</dt>
                  </div>
                ))}
              </dl>
              <Link
                href={viewer ? "/dashboard/matches" : `/signup?role=${isHost ? "guest" : "host"}`}
                className="pill group mt-auto h-12 bg-white text-[15px] text-ink hover:bg-subtle max-lg:mt-6"
              >
                {viewer ? "Go to your matches" : "Join free to connect"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </aside>
          </Rise>
        </div>

        <div className="shell mt-3">
          <Reveal>
            <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {tiles.map((tile, i) => (
                <div key={tile.label} className={`rounded-3xl p-6 ${i === 0 ? "bg-sun" : "bg-surface"}`}>
                  <dd className="text-[36px] leading-none font-semibold tracking-[-0.045em] text-ink tabular-nums sm:text-[44px]">
                    <CountUp to={tile.value} />
                  </dd>
                  <dt className={`mt-3 text-[13.5px] font-medium ${i === 0 ? "text-ink/70" : "text-ink-soft"}`}>{tile.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="shell mt-3 grid gap-3 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <section className="lift h-full p-6 sm:p-8">
              <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-ink">About</h2>
              <p className="mt-3 text-[16px] leading-relaxed whitespace-pre-line text-ink-soft">
                {profile.bio || "This member hasn't written a bio yet."}
              </p>
              <h3 className="mt-8 text-[15px] font-semibold text-ink">Talks about</h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {(profile.topics.length ? profile.topics : ["No topics listed"]).map((topic) => (
                  <li key={topic} className="rounded-full bg-sun px-3.5 py-2 text-[13.5px] font-medium text-ink">
                    {topic}
                  </li>
                ))}
              </ul>
              {profile.topicsAvoid.length > 0 && (
                <>
                  <h3 className="mt-6 text-[15px] font-semibold text-ink">Doesn&apos;t talk about</h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {profile.topicsAvoid.map((topic) => (
                      <li key={topic} className="rounded-full bg-peach px-3.5 py-2 text-[13.5px] font-medium text-ink">
                        {topic}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <p className="mt-8 rounded-2xl bg-canvas p-4 text-[13.5px] text-ink-soft">
                Share this page anywhere. It doubles as a referral link:{" "}
                <span className="font-medium text-ink">lpnmatch.com/profile/{profile.username}</span>
              </p>
            </section>
          </Reveal>

          <Reveal delay={0.06} className="lg:col-span-5">
            <section className="lift h-full p-6 sm:p-8">
              <div className="flex items-end justify-between gap-3">
                <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-ink">Reviews</h2>
                {reviews.length > 0 && (
                  <p className="flex items-center gap-1 text-[14px] font-semibold text-ink">
                    <Star className="h-4 w-4 fill-sun text-sun" />
                    {average.toFixed(1)}
                    <span className="font-normal text-ink-soft">({reviews.length})</span>
                  </p>
                )}
              </div>
              {reviews.length === 0 ? (
                <p className="mt-4 rounded-2xl bg-canvas p-4 text-[14px] text-ink-soft">No public reviews yet.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {reviews.map((row) => (
                    <li key={row.review.id} className="rounded-2xl bg-canvas p-4">
                      <div className="flex items-center justify-between gap-3">
                        <Link href={`/profile/${row.author.username}`} className="flex items-center gap-2.5 hover:underline">
                          <Face name={row.author.displayName} photoKey={row.author.photoKey} className="h-8 w-8 text-[11px]" />
                          <span className="text-[14px] font-semibold text-ink">{row.author.displayName}</span>
                        </Link>
                        <span className="flex gap-0.5" aria-label={`${row.review.rating} out of 5`}>
                          {Array.from({ length: 5 }, (_, star) => (
                            <Star key={star} className={`h-3.5 w-3.5 ${star < row.review.rating ? "fill-sun text-sun" : "text-line"}`} />
                          ))}
                        </span>
                      </div>
                      <p className="mt-3 text-[14.5px] leading-relaxed text-ink">{row.review.body}</p>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href={viewer ? "/dashboard/explore" : "/"}
                className="pill group mt-5 h-10 w-fit border border-line bg-surface px-4 text-[14px] text-ink hover:bg-subtle"
              >
                {viewer ? "Back to Explore" : "Discover LPN Match"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </section>
          </Reveal>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
