"use client";

import { Lock, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "cn";

import { topics } from "@/lib/content";
import { memberRoles, roleLabels } from "@/lib/labels";

type Filters = {
  q?: string;
  role?: string;
  topic?: string;
  location?: string;
  verified?: string;
  reliability?: string;
};

const chip = "rounded-full px-3.5 py-2 text-[13.5px] font-medium whitespace-nowrap transition-colors";

export function ExploreFilters({ premium, initial }: { premium: boolean; initial: Filters }) {
  const router = useRouter();
  const [q, setQ] = useState(initial.q ?? "");
  const [location, setLocation] = useState(initial.location ?? "");
  const [reliability, setReliability] = useState(initial.reliability ?? "");

  function go(patch: Partial<Filters>) {
    const next: Filters = { ...initial, q, location, reliability, ...patch };
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
    }
    if (!premium) {
      params.delete("verified");
      params.delete("reliability");
    }
    router.push(params.size ? `/dashboard/explore?${params}` : "/dashboard/explore");
  }

  return (
    <div className="space-y-3">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          go({});
        }}
        className="flex flex-col gap-2 rounded-3xl bg-surface p-2 sm:flex-row sm:rounded-full"
      >
        <label className="flex h-12 flex-1 items-center gap-2.5 rounded-full bg-canvas px-4 focus-within:ring-2 focus-within:ring-brand/50">
          <Search className="h-4 w-4 shrink-0 text-ink-faint" />
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search names, shows, topics or keywords"
            className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint"
          />
        </label>
        <label className="flex h-12 items-center gap-2.5 rounded-full bg-canvas px-4 focus-within:ring-2 focus-within:ring-brand/50 sm:w-56">
          <MapPin className="h-4 w-4 shrink-0 text-ink-faint" />
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Location"
            className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint"
          />
        </label>
        <button type="submit" className="pill h-12 bg-ink px-6 text-[15px] text-white hover:bg-ink-hover">
          Search
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => go({ role: undefined })}
          className={cn(chip, !initial.role ? "bg-ink text-white" : "bg-surface text-ink-soft hover:text-ink")}
        >
          Everyone
        </button>
        {memberRoles.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => go({ role: initial.role === role ? undefined : role })}
            className={cn(chip, initial.role === role ? "bg-ink text-white" : "bg-surface text-ink-soft hover:text-ink")}
          >
            {roleLabels[role]}
          </button>
        ))}
        <span className="mx-1 hidden h-6 w-px bg-line sm:block" />
        <button
          type="button"
          disabled={!premium}
          onClick={() => go({ verified: initial.verified === "1" ? undefined : "1" })}
          className={cn(
            chip,
            "inline-flex items-center gap-1.5 disabled:opacity-60",
            initial.verified === "1" ? "bg-brand text-white" : "bg-surface text-ink-soft hover:text-ink",
          )}
        >
          {!premium && <Lock className="h-3 w-3" />}
          Verified only
        </button>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            go({});
          }}
          className="flex items-center gap-1.5 rounded-full bg-surface py-1 pr-1 pl-3.5"
        >
          {!premium && <Lock className="h-3 w-3 text-ink-faint" />}
          <span className="text-[13.5px] font-medium text-ink-soft">Min. reliability</span>
          <input
            type="number"
            min={0}
            max={100}
            value={reliability}
            disabled={!premium}
            onChange={(event) => setReliability(event.target.value)}
            placeholder="90"
            className="h-8 w-16 rounded-full bg-canvas px-3 text-[13.5px] text-ink outline-none disabled:opacity-60"
          />
        </form>
      </div>

      <div className="mask-fade-x -mx-1 overflow-x-auto px-1 pb-1">
        <div className="flex w-max gap-1.5">
          {topics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => go({ topic: initial.topic === topic ? undefined : topic })}
              className={cn(
                chip,
                initial.topic === topic ? "bg-sun text-ink" : "bg-surface/60 text-ink-soft hover:bg-surface hover:text-ink",
              )}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {!premium && (
        <p className="text-[13px] text-ink-faint">Verified and reliability filters come with the Professional plan.</p>
      )}
    </div>
  );
}
