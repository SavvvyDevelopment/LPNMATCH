import type { ConversationStatus, InterviewStatus, MemberRole, PlanTier } from "@/lib/db/schema";

export const memberRoles: MemberRole[] = ["host", "guest", "both", "agency"];

export const roleLabels: Record<MemberRole, string> = {
  host: "Host",
  guest: "Guest",
  both: "Host & Guest",
  agency: "Agency",
};

export const planLabels: Record<PlanTier, string> = {
  standard: "Standard",
  professional: "Professional",
};

export const conversationLabels: Record<ConversationStatus, string> = {
  intro: "Intro",
  scheduling: "Scheduling",
  booked: "Booked",
  released: "Released",
};

export const interviewLabels: Record<InterviewStatus, string> = {
  scheduled: "Scheduled",
  recorded: "Recorded",
  released: "Released",
  cancelled: "Cancelled",
};

export function isMemberRole(value: string): value is MemberRole {
  return (memberRoles as string[]).includes(value);
}

export function hostsShows(role: MemberRole) {
  return role === "host" || role === "both";
}

export function pinLimit(plan: PlanTier) {
  return plan === "professional" ? 25 : 8;
}

export function counterpartRoles(role: MemberRole): MemberRole[] {
  switch (role) {
    case "host":
      return ["guest", "both", "agency"];
    case "guest":
      return ["host", "both"];
    case "agency":
      return ["host", "both"];
    case "both":
      return ["host", "guest", "both", "agency"];
  }
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function slugify(value: string) {
  const base = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
  return base || "member";
}

export function pairIds(a: string, b: string) {
  return a < b ? ([a, b] as const) : ([b, a] as const);
}

export function sharedTopics(a: string[], b: string[]) {
  return a.filter((item) => b.includes(item));
}

export function avoidedTopics(
  a: { topics: string[]; topicsAvoid?: string[] | null },
  b: { topics: string[]; topicsAvoid?: string[] | null },
) {
  return Array.from(
    new Set([
      ...sharedTopics(a.topics, b.topicsAvoid ?? []),
      ...sharedTopics(b.topics, a.topicsAvoid ?? []),
    ]),
  );
}

export function scoreProfiles(
  a: { topics: string[]; topicsAvoid?: string[] | null },
  b: { topics: string[]; topicsAvoid?: string[] | null },
) {
  const shared = sharedTopics(a.topics, b.topics).length;
  const avoided = avoidedTopics(a, b).length;
  return Math.max(42, Math.min(99, 70 + shared * 9 - avoided * 14));
}

export function matchReason(
  a: { topics: string[]; topicsAvoid?: string[] | null; role: MemberRole },
  b: { topics: string[]; topicsAvoid?: string[] | null; role: MemberRole; showName?: string | null },
) {
  const avoided = avoidedTopics(a, b);
  if (avoided.length > 0) return `Careful: one of you skips ${avoided.join(", ")}`;
  const shared = sharedTopics(a.topics, b.topics);
  if (shared.length > 0) return `You both cover ${shared.join(", ")}`;
  if (hostsShows(b.role) && b.showName) return `${b.showName} books guests like you`;
  return `${roleLabels[b.role]} looking for ${roleLabels[a.role].toLowerCase()}s`;
}

export function interviewSides(owner: { id: string; role: MemberRole }, other: { id: string; role: MemberRole }) {
  if (hostsShows(owner.role) && !hostsShows(other.role)) {
    return { hostProfileId: owner.id, guestProfileId: other.id };
  }
  if (hostsShows(other.role)) return { hostProfileId: other.id, guestProfileId: owner.id };
  return { hostProfileId: owner.id, guestProfileId: other.id };
}

export function formatCount(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(value);
}

export const workflowTemplates: Record<MemberRole, { name: string; kind: string; steps: string[] }> = {
  host: {
    name: "Episode production",
    kind: "production",
    steps: [
      "Confirm the topic and talking points",
      "Send the recording link",
      "Record the interview",
      "Edit and publish the episode",
      "Send the guest their share kit",
    ],
  },
  guest: {
    name: "Guest prep",
    kind: "promotion",
    steps: [
      "Read the show's last three episodes",
      "Send your headshot and bio",
      "Test your mic and room",
      "Record the interview",
      "Share the episode on release day",
    ],
  },
  both: {
    name: "Interview swap",
    kind: "production",
    steps: [
      "Agree on topics for both shows",
      "Book both recording slots",
      "Record your guest spot",
      "Record their guest spot",
      "Cross-promote both releases",
    ],
  },
  agency: {
    name: "Client booking",
    kind: "production",
    steps: [
      "Pick the client profile",
      "Review incoming host matches",
      "Confirm the topic with the host",
      "Track the recording date",
      "Collect the episode link and review",
    ],
  },
};
