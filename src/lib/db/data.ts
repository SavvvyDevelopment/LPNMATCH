import { and, asc, desc, eq, gte, ilike, inArray, like, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { auth } from "@/lib/auth/server";
import {
  counterpartRoles,
  hostsShows,
  interviewSides,
  isMemberRole,
  matchReason,
  pairIds,
  scoreProfiles,
  slugify,
  workflowTemplates,
} from "@/lib/labels";

import { ensureDemoData } from "./seed";
import { db } from "./index";
import {
  conversations,
  interviews,
  leaderboardStats,
  matches,
  messages,
  metricSnapshots,
  profiles,
  reviews,
  users,
  workflowSteps,
  workflows,
  type MemberRole,
  type Profile,
} from "./schema";

export async function getSessionUser() {
  const { data: session } = await auth.getSession();
  return session?.user ?? null;
}

export async function getProfileByUserId(userId: string) {
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return profile ?? null;
}

export async function ensureAccount(preferred?: { role?: MemberRole; name?: string }) {
  await ensureDemoData();
  const user = await getSessionUser();
  if (!user?.id || !user.email) return null;

  const name = preferred?.name?.trim() || user.name?.trim() || user.email.split("@")[0] || "Member";

  await db
    .insert(users)
    .values({ id: user.id, email: user.email, name, image: user.image ?? null })
    .onConflictDoUpdate({
      target: users.id,
      set: { email: user.email, name, image: user.image ?? null, updatedAt: new Date() },
    });

  const existing = await getProfileByUserId(user.id);
  if (existing) return { user, profile: existing };

  const profile = await createProfile(user.id, name, preferred?.role ?? "guest");
  return { user, profile };
}

const starterTitles: Record<MemberRole, string> = {
  host: "Podcast host",
  guest: "Podcast guest",
  both: "Podcast host and guest",
  agency: "Podcast booking agency",
};

async function createProfile(userId: string, name: string, role: MemberRole) {
  const suffix = userId.replace(/[^a-z0-9]/gi, "").slice(-6).toLowerCase() || "member";
  let username = `${slugify(name)}-${suffix}`;
  const taken = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.username, username))
    .limit(1);
  if (taken.length > 0) username = `${username}-${Date.now().toString().slice(-4)}`;

  const [profile] = await db
    .insert(profiles)
    .values({
      userId,
      username,
      role,
      displayName: name,
      title: starterTitles[role],
      showName: hostsShows(role) ? `${name.split(" ")[0]}'s Podcast` : null,
      bio: "",
      location: "",
      topics: [],
      plan: "standard",
    })
    .returning();

  await attachStarter(profile);
  return profile;
}

async function attachStarter(profile: Profile) {
  const candidates = await db
    .select()
    .from(profiles)
    .where(and(inArray(profiles.role, counterpartRoles(profile.role)), like(profiles.userId, "seed:%")))
    .limit(4);

  for (const [index, counterpart] of candidates.entries()) {
    const accepted = index === 0;
    await db
      .insert(matches)
      .values({
        ownerProfileId: profile.id,
        counterpartProfileId: counterpart.id,
        score: scoreProfiles(profile, counterpart),
        status: accepted ? "accepted" : "pending",
        reason: matchReason(profile, counterpart),
        pinned: accepted,
      })
      .onConflictDoNothing();

    if (!accepted) continue;

    const [low, high] = pairIds(profile.id, counterpart.id);
    const [conversation] = await db
      .insert(conversations)
      .values({
        profileAId: low,
        profileBId: high,
        status: "scheduling",
        nextStep: "Agree on a topic and pick a recording date.",
      })
      .onConflictDoNothing()
      .returning();

    const existingConversation =
      conversation ??
      (
        await db
          .select()
          .from(conversations)
          .where(and(eq(conversations.profileAId, low), eq(conversations.profileBId, high)))
          .limit(1)
      )[0];

    if (existingConversation) {
      const firstName = profile.displayName.split(" ")[0] ?? "";
      await db.insert(messages).values({
        conversationId: existingConversation.id,
        senderProfileId: counterpart.id,
        body: hostsShows(counterpart.role)
          ? `Hi ${firstName}, I think you'd be a great fit for ${counterpart.showName ?? "my show"}. Which topic would you want to cover?`
          : `Hi ${firstName}, I'd love to be a guest on your show. Happy to send a few topic ideas.`,
      });
    }

    await db.insert(interviews).values({
      ...interviewSides(profile, counterpart),
      title: `Intro interview with ${counterpart.displayName}`,
      scheduledAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      status: "scheduled",
      notes: "Created when your first match was accepted.",
    });
  }

  await db.insert(leaderboardStats).values({
    profileId: profile.id,
    points: 40,
    interviewsCount: 0,
    reviewsCount: 0,
    profileViews: 12,
    requests: candidates.length,
    socialImpressions: 80,
  });

  const months = ["2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10"];
  await db.insert(metricSnapshots).values(
    months.map((month, index) => ({
      profileId: profile.id,
      month,
      views: 4 + index * 3,
      requests: index % 2,
      impressions: 10 + index * 8,
    })),
  );

  const template = workflowTemplates[profile.role];
  const [workflow] = await db
    .insert(workflows)
    .values({ ownerProfileId: profile.id, name: template.name, kind: template.kind })
    .returning();

  await db.insert(workflowSteps).values(
    template.steps.map((title, position) => ({ workflowId: workflow.id, title, position, done: false })),
  );
}

export async function listMatches(profileId: string) {
  return db
    .select({ match: matches, profile: profiles })
    .from(matches)
    .innerJoin(profiles, eq(matches.counterpartProfileId, profiles.id))
    .where(eq(matches.ownerProfileId, profileId))
    .orderBy(desc(matches.pinned), desc(matches.score));
}

export async function listPinned(profileId: string) {
  const rows = await listMatches(profileId);
  return rows.filter((row) => row.match.pinned);
}

export async function searchProfiles(input: {
  viewerId?: string;
  q?: string;
  role?: string;
  topic?: string;
  location?: string;
  verified?: boolean;
  minReliability?: number;
  premium: boolean;
}) {
  const filters = [];
  if (input.viewerId) filters.push(sql`${profiles.id} <> ${input.viewerId}`);
  if (input.q) {
    const term = `%${input.q}%`;
    filters.push(
      or(
        ilike(profiles.displayName, term),
        ilike(profiles.title, term),
        ilike(profiles.showName, term),
        ilike(profiles.bio, term),
        ilike(profiles.location, term),
      ),
    );
  }
  if (input.role && isMemberRole(input.role)) filters.push(eq(profiles.role, input.role));
  if (input.topic) filters.push(sql`${input.topic} = ANY(${profiles.topics})`);
  if (input.location) filters.push(ilike(profiles.location, `%${input.location}%`));
  if (input.premium && input.verified) filters.push(eq(profiles.verified, true));
  if (input.premium && input.minReliability) {
    filters.push(gte(profiles.reliability, input.minReliability));
  }

  return db
    .select()
    .from(profiles)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(profiles.professionalBadge), desc(profiles.reliability))
    .limit(24);
}

export async function listConversations(profileId: string) {
  const rows = await db
    .select()
    .from(conversations)
    .where(or(eq(conversations.profileAId, profileId), eq(conversations.profileBId, profileId)))
    .orderBy(desc(conversations.updatedAt));

  const others = await Promise.all(
    rows.map(async (conversation) => {
      const otherId =
        conversation.profileAId === profileId ? conversation.profileBId : conversation.profileAId;
      const [profile] = await db.select().from(profiles).where(eq(profiles.id, otherId)).limit(1);
      const [last] = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, conversation.id))
        .orderBy(desc(messages.createdAt))
        .limit(1);
      return { conversation, profile, last };
    }),
  );

  return others.filter((row) => row.profile);
}

export async function getThread(profileId: string, conversationId: string) {
  const [conversation] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);
  if (!conversation) return null;
  if (conversation.profileAId !== profileId && conversation.profileBId !== profileId) return null;

  const otherId =
    conversation.profileAId === profileId ? conversation.profileBId : conversation.profileAId;
  const [profile] = await db.select().from(profiles).where(eq(profiles.id, otherId)).limit(1);
  const thread = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversation.id))
    .orderBy(asc(messages.createdAt));

  return { conversation, profile, messages: thread };
}

export async function listInterviews(profileId: string) {
  const host = alias(profiles, "interview_host");
  const guest = alias(profiles, "interview_guest");
  return db
    .select({ interview: interviews, host, guest })
    .from(interviews)
    .innerJoin(host, eq(interviews.hostProfileId, host.id))
    .innerJoin(guest, eq(interviews.guestProfileId, guest.id))
    .where(or(eq(interviews.hostProfileId, profileId), eq(interviews.guestProfileId, profileId)))
    .orderBy(desc(interviews.createdAt));
}

export async function listReviewsForInterview(interviewId: string) {
  return db.select().from(reviews).where(eq(reviews.interviewId, interviewId));
}

export async function listWorkflows(profileId: string) {
  const rows = await db
    .select()
    .from(workflows)
    .where(eq(workflows.ownerProfileId, profileId))
    .orderBy(desc(workflows.createdAt));

  return Promise.all(
    rows.map(async (workflow) => {
      const steps = await db
        .select()
        .from(workflowSteps)
        .where(eq(workflowSteps.workflowId, workflow.id))
        .orderBy(asc(workflowSteps.position));
      return { workflow, steps };
    }),
  );
}

export async function getLeaderboard() {
  return db
    .select({ profile: profiles, stats: leaderboardStats })
    .from(leaderboardStats)
    .innerJoin(profiles, eq(leaderboardStats.profileId, profiles.id))
    .orderBy(desc(leaderboardStats.points))
    .limit(25);
}

export async function getMetricSeries(profileId: string) {
  return db
    .select()
    .from(metricSnapshots)
    .where(eq(metricSnapshots.profileId, profileId))
    .orderBy(asc(metricSnapshots.month));
}

export async function getOwnStats(profileId: string) {
  const [stats] = await db
    .select()
    .from(leaderboardStats)
    .where(eq(leaderboardStats.profileId, profileId))
    .limit(1);
  const series = await getMetricSeries(profileId);
  return { stats, series };
}

export async function getPublicProfile(username: string) {
  const [profile] = await db.select().from(profiles).where(eq(profiles.username, username)).limit(1);
  if (!profile) return null;
  const [stats] = await db
    .select()
    .from(leaderboardStats)
    .where(eq(leaderboardStats.profileId, profile.id))
    .limit(1);
  const profileReviews = await db
    .select({ review: reviews, author: profiles })
    .from(reviews)
    .innerJoin(profiles, eq(reviews.authorProfileId, profiles.id))
    .where(eq(reviews.subjectProfileId, profile.id))
    .orderBy(desc(reviews.createdAt));
  return { profile, stats, reviews: profileReviews };
}

export async function bumpProfileView(profileId: string) {
  await db
    .update(leaderboardStats)
    .set({ profileViews: sql`${leaderboardStats.profileViews} + 1` })
    .where(eq(leaderboardStats.profileId, profileId));
}

export async function getLandingStats() {
  await ensureDemoData();
  const [memberRow] = await db.select({ value: sql<number>`count(*)::int` }).from(profiles);
  const [totals] = await db
    .select({
      interviews: sql<number>`coalesce(sum(${leaderboardStats.interviewsCount}), 0)::int`,
      views: sql<number>`coalesce(sum(${leaderboardStats.profileViews}), 0)::int`,
      impressions: sql<number>`coalesce(sum(${leaderboardStats.socialImpressions}), 0)::int`,
    })
    .from(leaderboardStats);
  const [messageRow] = await db.select({ value: sql<number>`count(*)::int` }).from(messages);
  const interviewsCount = totals?.interviews ?? 0;
  return {
    members: memberRow?.value ?? 0,
    interviews: interviewsCount,
    views: totals?.views ?? 0,
    impressions: totals?.impressions ?? 0,
    messages: messageRow?.value ?? 0,
    hoursSaved: interviewsCount * 3,
  };
}

export async function getFeatured() {
  await ensureDemoData();
  const hosts = await db
    .select()
    .from(profiles)
    .where(inArray(profiles.role, ["host", "both"]))
    .orderBy(desc(profiles.professionalBadge), desc(profiles.audienceSize))
    .limit(4);
  const guests = await db
    .select()
    .from(profiles)
    .where(inArray(profiles.role, ["guest", "agency"]))
    .orderBy(desc(profiles.professionalBadge), desc(profiles.reliability))
    .limit(4);
  return { hosts, guests };
}

export async function recentActivity(profileId: string) {
  const thread = await listConversations(profileId);
  const mine = await listMatches(profileId);
  const items = [
    ...thread.slice(0, 3).map((row) => ({
      id: row.conversation.id,
      kind: "message" as const,
      title: `Message with ${row.profile?.displayName ?? "a member"}`,
      detail: row.last?.body ?? "No messages yet",
      href: `/dashboard/messages?c=${row.conversation.id}`,
    })),
    ...mine.slice(0, 3).map((row) => ({
      id: row.match.id,
      kind: "match" as const,
      title: `${row.match.status === "pending" ? "New match" : "Match"} · ${row.profile.displayName}`,
      detail: row.match.reason,
      href: "/dashboard/matches",
    })),
  ];
  return items.slice(0, 6);
}
