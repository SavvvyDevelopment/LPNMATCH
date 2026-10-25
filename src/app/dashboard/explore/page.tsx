import { ArrowUpRight, BadgeCheck, MapPin } from "lucide-react";
import Link from "next/link";

import { ExploreFilters } from "@/components/dashboard/explore-filters";
import { EmptyState, PageHeader } from "@/components/dashboard/page-header";
import { Face } from "@/components/member-face";
import { Reveal } from "@/components/motion";
import { ensureAccount, searchProfiles } from "@/lib/db/data";
import { formatCount, hostsShows, roleLabels } from "@/lib/labels";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    role?: string;
    topic?: string;
    location?: string;
    verified?: string;
    reliability?: string;
  }>;
}) {
  const account = await ensureAccount();
  if (!account) return null;
  const params = await searchParams;
  const premium = account.profile.plan === "professional";
  const results = await searchProfiles({
    viewerId: account.profile.id,
    q: params.q,
    role: params.role,
    topic: params.topic,
    location: params.location,
    verified: params.verified === "1",
    minReliability: params.reliability ? Number(params.reliability) : undefined,
    premium,
  });

  return (
    <>
      <PageHeader
        eyebrow="Explore"
        title={
          <>
            Search every host <span className="text-ink-faint">and guest.</span>
          </>
        }
        description="Look past your matches. Professional profiles appear first."
      />

      <Reveal>
        <ExploreFilters premium={premium} initial={params} />
      </Reveal>

      <p className="text-[13.5px] font-medium text-ink-soft">
        {results.length} {results.length === 1 ? "profile" : "profiles"}
      </p>

      {results.length === 0 ? (
        <EmptyState title="No one matches those filters" body="Try a different topic or clear a filter." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {results.map((person, i) => (
            <Reveal key={person.id} delay={(i % 4) * 0.05} className="h-full">
              <Link
                href={`/profile/${person.username}`}
                className="lift group flex h-full flex-col p-6 transition-shadow duration-300 hover:shadow-e2"
              >
                <div className="flex items-start justify-between gap-3">
                  <Face
                    name={person.displayName}
                    photoKey={person.photoKey}
                    className="h-14 w-14 text-[17px] transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="flex flex-wrap justify-end gap-1">
                    {person.professionalBadge && (
                      <span className="rounded-full bg-sun px-2.5 py-1 text-[11.5px] font-medium text-ink">Pro</span>
                    )}
                    <span className="rounded-full bg-subtle px-2.5 py-1 text-[11.5px] font-medium text-ink-soft">
                      {roleLabels[person.role]}
                    </span>
                  </div>
                </div>
                <h2 className="mt-5 flex items-center gap-1.5 text-[18px] font-semibold tracking-[-0.02em] text-ink">
                  {person.displayName}
                  {person.verified && <BadgeCheck className="h-4 w-4 text-brand" />}
                </h2>
                <p className="mt-0.5 text-[14px] leading-snug text-ink-soft">
                  {hostsShows(person.role) && person.showName ? person.showName : person.title}
                </p>
                {person.location && (
                  <p className="mt-2 flex items-center gap-1 text-[13px] text-ink-faint">
                    <MapPin className="h-3.5 w-3.5" />
                    {person.location}
                  </p>
                )}
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {(person.topics.length ? person.topics.slice(0, 3) : ["No topics yet"]).map((topic) => (
                    <li key={topic} className="rounded-full bg-canvas px-2.5 py-1 text-[12px] font-medium text-ink-soft">
                      {topic}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center justify-between border-t border-subtle pt-4 text-[13px] text-ink-soft">
                  <span>
                    {person.audienceSize > 0
                      ? `${formatCount(person.audienceSize)} listeners/ep`
                      : `${person.reliability}% reliable`}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}
