"use client";

import { Check, LoaderCircle, Upload } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { cn } from "cn";

import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { topics as topicOptions } from "@/lib/content";
import { saveProfile, setPlan, uploadPhoto } from "@/lib/db/actions";
import type { MemberRole, Profile } from "@/lib/db/schema";
import { hostsShows, memberRoles, planLabels, roleLabels } from "@/lib/labels";

function SaveButton({ pending, label, className }: { pending: boolean; label: string; className?: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn("pill h-12 bg-ink px-6 text-[15px] text-white hover:bg-ink-hover disabled:cursor-wait", className)}
    >
      {pending && <LoaderCircle className="h-4 w-4 animate-spin" />}
      {label}
    </button>
  );
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const [role, setRole] = useState<MemberRole>(profile.role);
  const [accepting, setAccepting] = useState(profile.accepting);
  const [topics, setTopics] = useState<string[]>(profile.topics);
  const [topicsAvoid, setTopicsAvoid] = useState<string[]>(profile.topicsAvoid ?? []);
  const [pending, startTransition] = useTransition();
  const options = Array.from(new Set([...topicOptions, ...profile.topics, ...(profile.topicsAvoid ?? [])]));

  function toggleTopic(topic: string) {
    setTopics((current) => (current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic]));
    setTopicsAvoid((current) => current.filter((item) => item !== topic));
  }

  function toggleAvoid(topic: string) {
    setTopicsAvoid((current) => (current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic]));
    setTopics((current) => current.filter((item) => item !== topic));
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.set("role", role);
    data.set("topics", topics.join(","));
    data.set("topicsAvoid", topicsAvoid.join(","));
    if (accepting) data.set("accepting", "on");
    startTransition(async () => {
      const result = await saveProfile(data);
      if (result.error) toast.error(result.error);
      else toast.success("Profile saved");
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel>I&apos;m on LPN Match as</FieldLabel>
          <div className="flex flex-wrap gap-1.5">
            {memberRoles.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRole(item)}
                aria-pressed={role === item}
                className={cn(
                  "rounded-full px-4 py-2 text-[14px] font-medium transition-colors",
                  role === item ? "bg-ink text-white" : "bg-canvas text-ink-soft hover:text-ink",
                )}
              >
                {roleLabels[item]}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="displayName">Name</FieldLabel>
            <Input id="displayName" name="displayName" defaultValue={profile.displayName} required />
          </Field>
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input id="username" name="username" defaultValue={profile.username} required />
            <FieldDescription>lpnmatch.com/profile/{profile.username}</FieldDescription>
          </Field>
        </div>

        {hostsShows(role) && (
          <div className="grid gap-5 rounded-3xl bg-canvas p-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="showName">Podcast name</FieldLabel>
              <Input id="showName" name="showName" defaultValue={profile.showName ?? ""} className="bg-surface" />
            </Field>
            <Field>
              <FieldLabel htmlFor="audienceSize">Average listeners per episode</FieldLabel>
              <Input
                id="audienceSize"
                name="audienceSize"
                type="number"
                min={0}
                defaultValue={profile.audienceSize || ""}
                className="bg-surface"
              />
            </Field>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="title">Headline</FieldLabel>
            <Input
              id="title"
              name="title"
              defaultValue={profile.title}
              placeholder={hostsShows(role) ? "Weekly interviews with bootstrapped founders" : "Founder and author on pricing"}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <Input id="location" name="location" defaultValue={profile.location} placeholder="City, State or Remote" />
          </Field>
        </div>

        <Field>
          <FieldLabel>Topics I talk about</FieldLabel>
          <div className="flex flex-wrap gap-1.5">
            {options.map((topic) => {
              const active = topics.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors",
                    active ? "bg-sun text-ink" : "bg-canvas text-ink-soft hover:text-ink",
                  )}
                >
                  {active && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  {topic}
                </button>
              );
            })}
          </div>
          <FieldDescription>We match you with people who share these topics.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel>Topics I don&apos;t talk about</FieldLabel>
          <div className="flex flex-wrap gap-1.5">
            {options.map((topic) => {
              const active = topicsAvoid.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleAvoid(topic)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors",
                    active ? "bg-peach text-ink" : "bg-canvas text-ink-soft hover:text-ink",
                  )}
                >
                  {active && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  {topic}
                </button>
              );
            })}
          </div>
          <FieldDescription>Picking one here takes it off the list above and lowers matches that lead with it.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="bio">About</FieldLabel>
          <Textarea
            id="bio"
            name="bio"
            defaultValue={profile.bio}
            rows={5}
            placeholder={hostsShows(role) ? "What's your show about, and who listens?" : "What do you talk about, and why should hosts book you?"}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="website">Website</FieldLabel>
            <Input id="website" name="website" defaultValue={profile.website ?? ""} placeholder="https://" />
          </Field>
          <Field>
            <FieldLabel htmlFor="videoPitchUrl">Video pitch URL</FieldLabel>
            <Input id="videoPitchUrl" name="videoPitchUrl" defaultValue={profile.videoPitchUrl ?? ""} placeholder="YouTube, Loom or Vimeo" />
          </Field>
        </div>

        <label className="flex items-center justify-between gap-4 rounded-3xl bg-canvas p-4">
          <span>
            <span className="block text-[14.5px] font-semibold text-ink">Open to new matches</span>
            <span className="block text-[13px] text-ink-soft">Turn off to pause new matches while you&apos;re booked up.</span>
          </span>
          <Switch checked={accepting} onCheckedChange={setAccepting} />
        </label>

        <SaveButton pending={pending} label="Save profile" className="w-full sm:w-fit" />
      </FieldGroup>
    </form>
  );
}

export function PhotoForm() {
  const [pending, startTransition] = useTransition();
  const [fileName, setFileName] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(async () => {
          const result = await uploadPhoto(data);
          if (result.error) toast.error(result.error);
          else toast.success("Photo updated");
        });
      }}
      className="space-y-3"
    >
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-3xl border-2 border-dashed border-line bg-canvas px-4 py-6 text-center transition-colors hover:border-ink-faint">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-surface text-ink shadow-e1">
          <Upload className="h-4 w-4" />
        </span>
        <span className="text-[14px] font-medium text-ink">{fileName || "Choose a photo"}</span>
        <span className="text-[12px] text-ink-faint">JPEG, PNG or WebP, up to 2MB</span>
        <input
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
        />
      </label>
      <button
        type="submit"
        disabled={pending || !fileName}
        className="pill h-11 w-full border border-line bg-surface text-[14px] text-ink hover:bg-subtle disabled:opacity-50"
      >
        {pending && <LoaderCircle className="h-4 w-4 animate-spin" />}
        Upload photo
      </button>
    </form>
  );
}

export function PlanForm({ plan }: { plan: Profile["plan"] }) {
  const [pending, startTransition] = useTransition();

  function choose(next: Profile["plan"]) {
    const data = new FormData();
    data.set("plan", next);
    startTransition(async () => {
      const result = await setPlan(data);
      if (result.error) toast.error(result.error);
      else toast.success(`Plan set to ${planLabels[next]}`);
    });
  }

  return (
    <div className="space-y-2">
      {(["standard", "professional"] as const).map((tier) => {
        const active = plan === tier;
        return (
          <button
            key={tier}
            type="button"
            disabled={pending || active}
            onClick={() => choose(tier)}
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-2xl p-4 text-left transition-colors disabled:cursor-default",
              active ? "bg-ink text-white" : "bg-canvas text-ink hover:bg-subtle",
            )}
          >
            <span>
              <span className="block text-[14.5px] font-semibold">{planLabels[tier]}</span>
              <span className={cn("block text-[12.5px]", active ? "text-white/60" : "text-ink-soft")}>
                {tier === "professional" ? "25 pins, premium filters, badge" : "8 pins, all core features"}
              </span>
            </span>
            {active ? (
              <span className="rounded-full bg-sun px-2.5 py-1 text-[11.5px] font-medium text-ink">Current</span>
            ) : (
              <span className="text-[13px] font-medium">Switch</span>
            )}
          </button>
        );
      })}
      <p className="pt-1 text-[12.5px] text-ink-faint">Switching updates your badge and pin limit. No card is charged.</p>
    </div>
  );
}
