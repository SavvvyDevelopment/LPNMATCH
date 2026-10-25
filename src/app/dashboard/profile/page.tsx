import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { PageHeader, Panel } from "@/components/dashboard/page-header";
import { PhotoForm, PlanForm, ProfileForm } from "@/components/dashboard/profile-form";
import { Face } from "@/components/member-face";
import { Reveal } from "@/components/motion";
import { ensureAccount } from "@/lib/db/data";
import { hostsShows, roleLabels } from "@/lib/labels";

export default async function ProfileSettingsPage() {
  const account = await ensureAccount();
  if (!account) return null;
  const { profile } = account;

  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title={
          <>
            Your {hostsShows(profile.role) ? "show page" : "one-sheet"}, <span className="text-ink-faint">your pitch.</span>
          </>
        }
        description="This is what hosts and guests see before they message you. Keep it sharp."
        action={
          <Link
            href={`/profile/${profile.username}`}
            className="pill group h-11 border border-line bg-surface px-5 text-[15px] text-ink hover:bg-subtle"
          >
            View public page
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        }
      />

      <div className="grid gap-3 xl:grid-cols-[1fr_22rem]">
        <Reveal>
          <Panel title="Details">
            <ProfileForm profile={profile} />
          </Panel>
        </Reveal>
        <div className="flex flex-col gap-3">
          <Reveal delay={0.05}>
            <div className="stage overflow-hidden rounded-3xl p-5">
              <div className="flex items-center gap-4">
                <Face name={profile.displayName} photoKey={profile.photoKey} className="h-16 w-16 text-[20px] shadow-e1" />
                <div className="min-w-0">
                  <p className="truncate text-[18px] font-semibold tracking-[-0.02em] text-ink">{profile.displayName}</p>
                  <p className="truncate text-[13.5px] text-ink-soft">{profile.showName ?? roleLabels[profile.role]}</p>
                </div>
              </div>
              <div className="mt-5 rounded-3xl bg-surface p-4">
                <PhotoForm />
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Panel title="Plan">
              <PlanForm plan={profile.plan} />
            </Panel>
          </Reveal>
        </div>
      </div>
    </>
  );
}
