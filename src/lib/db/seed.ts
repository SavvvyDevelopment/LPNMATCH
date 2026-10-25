import { eq } from "drizzle-orm";

import type { MemberRole, PlanTier } from "./schema";
import { db } from "./index";
import {
  conversations,
  interviews,
  leaderboardStats,
  messages,
  metricSnapshots,
  profiles,
  reviews,
  users,
} from "./schema";

const months = ["2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10"];

type SeedPerson = {
  id: string;
  username: string;
  role: MemberRole;
  plan: PlanTier;
  displayName: string;
  title: string;
  showName?: string;
  bio: string;
  location: string;
  topics: string[];
  topicsAvoid?: string[];
  audienceSize: number;
  rates: [response: number, acceptance: number, reliability: number];
  verified: boolean;
  points: number;
  interviewsCount: number;
  reviewsCount: number;
  profileViews: number;
  requests: number;
  socialImpressions: number;
};

const people: SeedPerson[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    username: "dana-brooks",
    role: "host",
    plan: "professional",
    displayName: "Dana Brooks",
    title: "Host of a weekly show on bootstrapped companies",
    showName: "The Bootstrapped Hour",
    bio: "Weekly long-form interviews with founders who grew without venture money. I book two guests a month and send questions a week ahead.",
    location: "Austin, TX",
    topics: ["Business", "Leadership", "Personal Finance"],
    topicsAvoid: ["True Crime", "Comedy"],
    audienceSize: 18000,
    rates: [98, 84, 99],
    verified: true,
    points: 980,
    interviewsCount: 42,
    reviewsCount: 31,
    profileViews: 4210,
    requests: 64,
    socialImpressions: 22100,
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    username: "kai-nakamura",
    role: "host",
    plan: "standard",
    displayName: "Kai Nakamura",
    title: "Tech interviews for builders",
    showName: "Shipping Daily",
    bio: "Thirty-minute conversations with engineers and product people about what they shipped this year. Remote recordings, light edit.",
    location: "Seattle, WA",
    topics: ["Technology", "Business", "Education"],
    audienceSize: 6500,
    rates: [91, 77, 94],
    verified: true,
    points: 560,
    interviewsCount: 19,
    reviewsCount: 12,
    profileViews: 1830,
    requests: 27,
    socialImpressions: 7900,
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    username: "renee-foster",
    role: "host",
    plan: "professional",
    displayName: "Renée Foster",
    title: "Health and wellness conversations",
    showName: "Well Within",
    bio: "Evidence-based wellness interviews with clinicians, coaches and researchers. Video and audio, released every Tuesday.",
    location: "Denver, CO",
    topics: ["Health & Wellness", "Self-Improvement", "Parenting"],
    audienceSize: 24000,
    rates: [96, 72, 97],
    verified: true,
    points: 870,
    interviewsCount: 37,
    reviewsCount: 26,
    profileViews: 3650,
    requests: 51,
    socialImpressions: 19800,
  },
  {
    id: "20000000-0000-4000-8000-000000000001",
    username: "marcus-hale",
    role: "guest",
    plan: "professional",
    displayName: "Marcus Hale",
    title: "Founder and author on bootstrapping",
    bio: "Built and sold a self-funded SaaS company. I talk about pricing, hiring your first five people and staying profitable.",
    location: "Nashville, TN",
    topics: ["Business", "Leadership", "Marketing"],
    topicsAvoid: ["True Crime"],
    audienceSize: 0,
    rates: [97, 88, 98],
    verified: true,
    points: 820,
    interviewsCount: 28,
    reviewsCount: 22,
    profileViews: 2960,
    requests: 44,
    socialImpressions: 14300,
  },
  {
    id: "20000000-0000-4000-8000-000000000002",
    username: "aisha-okafor",
    role: "guest",
    plan: "standard",
    displayName: "Dr. Aisha Okafor",
    title: "Sleep researcher and physician",
    bio: "I translate sleep science into habits people can keep. Comfortable with both clinical deep dives and practical how-tos.",
    location: "Chicago, IL",
    topics: ["Health & Wellness", "Science", "Self-Improvement"],
    audienceSize: 0,
    rates: [89, 81, 93],
    verified: true,
    points: 610,
    interviewsCount: 15,
    reviewsCount: 11,
    profileViews: 1720,
    requests: 23,
    socialImpressions: 6800,
  },
  {
    id: "20000000-0000-4000-8000-000000000003",
    username: "leo-martins",
    role: "guest",
    plan: "standard",
    displayName: "Leo Martins",
    title: "Growth marketer for developer tools",
    bio: "Ran growth at two dev-tool startups. Happy to talk launches, community-led growth and what actually moves signups.",
    location: "Remote",
    topics: ["Marketing", "Technology"],
    audienceSize: 0,
    rates: [92, 79, 90],
    verified: false,
    points: 390,
    interviewsCount: 8,
    reviewsCount: 5,
    profileViews: 940,
    requests: 13,
    socialImpressions: 3100,
  },
  {
    id: "20000000-0000-4000-8000-000000000004",
    username: "grace-whitfield",
    role: "guest",
    plan: "professional",
    displayName: "Grace Whitfield",
    title: "Financial planner for young families",
    bio: "Certified planner who makes budgets and college savings feel doable. Clear, warm and good with listener questions.",
    location: "Charlotte, NC",
    topics: ["Personal Finance", "Parenting", "Education"],
    audienceSize: 0,
    rates: [95, 86, 96],
    verified: true,
    points: 700,
    interviewsCount: 21,
    reviewsCount: 17,
    profileViews: 2140,
    requests: 33,
    socialImpressions: 9200,
  },
  {
    id: "30000000-0000-4000-8000-000000000001",
    username: "sofia-ramirez",
    role: "both",
    plan: "professional",
    displayName: "Sofia Ramirez",
    title: "Host of Mindful Money, and a guest on finance shows",
    showName: "Mindful Money",
    bio: "I host a show about money and mindset and guest on other finance podcasts. Interview swaps are my favorite way to grow.",
    location: "Miami, FL",
    topics: ["Personal Finance", "Self-Improvement", "Business"],
    audienceSize: 9800,
    rates: [94, 83, 95],
    verified: true,
    points: 760,
    interviewsCount: 33,
    reviewsCount: 20,
    profileViews: 2580,
    requests: 39,
    socialImpressions: 11800,
  },
  {
    id: "40000000-0000-4000-8000-000000000001",
    username: "signal-studio",
    role: "agency",
    plan: "professional",
    displayName: "Signal Studio",
    title: "Podcast booking for founders and authors",
    bio: "We represent a small roster of founders and authors. Each client has a profile, and every host conversation stays in one workspace.",
    location: "New York, NY",
    topics: ["Business", "Leadership", "Technology"],
    audienceSize: 0,
    rates: [97, 76, 98],
    verified: true,
    points: 1040,
    interviewsCount: 58,
    reviewsCount: 35,
    profileViews: 4800,
    requests: 72,
    socialImpressions: 25100,
  },
];

let pending: Promise<void> | null = null;

export function ensureDemoData() {
  pending ??= seedIfEmpty().catch((error: unknown) => {
    pending = null;
    throw error;
  });
  return pending;
}

async function seedIfEmpty() {
  const existing = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.username, "dana-brooks"))
    .limit(1);
  if (existing.length > 0) {
    for (const person of people) {
      if (!person.topicsAvoid?.length) continue;
      await db
        .update(profiles)
        .set({ topicsAvoid: person.topicsAvoid })
        .where(eq(profiles.username, person.username));
    }
    return;
  }

  await db
    .insert(users)
    .values(
      people.map((person) => ({
        id: `seed:${person.username}`,
        email: `${person.username}@lpnmatch.example`,
        name: person.displayName,
      })),
    )
    .onConflictDoNothing();

  await db.insert(profiles).values(
    people.map((person) => ({
      id: person.id,
      userId: `seed:${person.username}`,
      username: person.username,
      role: person.role,
      plan: person.plan,
      displayName: person.displayName,
      title: person.title,
      showName: person.showName ?? null,
      bio: person.bio,
      location: person.location,
      topics: person.topics,
      topicsAvoid: person.topicsAvoid ?? [],
      audienceSize: person.audienceSize,
      responseRate: person.rates[0],
      acceptanceRate: person.rates[1],
      reliability: person.rates[2],
      verified: person.verified,
      professionalBadge: person.plan === "professional",
      accepting: true,
    })),
  );

  await db.insert(leaderboardStats).values(
    people.map((person) => ({
      profileId: person.id,
      points: person.points,
      interviewsCount: person.interviewsCount,
      reviewsCount: person.reviewsCount,
      profileViews: person.profileViews,
      requests: person.requests,
      socialImpressions: person.socialImpressions,
    })),
  );

  await db.insert(metricSnapshots).values(
    people.flatMap((person) =>
      months.map((month, index) => ({
        profileId: person.id,
        month,
        views: Math.round(person.profileViews / 8 + index * 22),
        requests: Math.max(1, Math.round(person.requests / 7 + (index % 3))),
        impressions: Math.round(person.socialImpressions / 8 + index * 60),
      })),
    ),
  );

  const dana = people[0].id;
  const marcus = people[3].id;
  const renee = people[2].id;
  const aisha = people[4].id;

  const interviewId = "50000000-0000-4000-8000-000000000001";
  await db.insert(interviews).values([
    {
      id: interviewId,
      hostProfileId: dana,
      guestProfileId: marcus,
      title: "Pricing your first product without investors",
      scheduledAt: new Date("2026-09-02T17:00:00.000Z"),
      status: "released",
      notes: "Recorded remotely. Released as episode 142.",
      episodeUrl: "https://podcasts.example/bootstrapped-hour/142",
    },
    {
      hostProfileId: renee,
      guestProfileId: aisha,
      title: "Sleep habits that survive a busy week",
      scheduledAt: new Date("2026-11-04T16:00:00.000Z"),
      status: "scheduled",
      notes: "Video recording. Aisha is sending her headshot and slides.",
    },
  ]);

  await db.insert(reviews).values([
    {
      interviewId,
      authorProfileId: dana,
      subjectProfileId: marcus,
      rating: 5,
      body: "Marcus came prepared with stories and numbers. Our listeners loved the episode.",
    },
    {
      interviewId,
      authorProfileId: marcus,
      subjectProfileId: dana,
      rating: 5,
      body: "Dana sent thoughtful questions a week ahead and shared the episode everywhere.",
    },
    {
      authorProfileId: renee,
      subjectProfileId: aisha,
      rating: 5,
      body: "Clear, warm and full of practical advice. One of our most-shared episodes.",
    },
  ]);

  const conversationId = "60000000-0000-4000-8000-000000000001";
  await db.insert(conversations).values({
    id: conversationId,
    profileAId: dana,
    profileBId: marcus,
    status: "released",
    nextStep: "Episode is live. Leave a review if you haven't yet.",
  });

  await db.insert(messages).values([
    {
      conversationId,
      senderProfileId: dana,
      body: "Your story about pricing without investors is exactly what my listeners ask about. Want to come on in early September?",
      createdAt: new Date("2026-08-12T15:00:00.000Z"),
    },
    {
      conversationId,
      senderProfileId: marcus,
      body: "I'd love to. September 2nd at noon Central works, and I can send a few stories ahead of time.",
      createdAt: new Date("2026-08-12T18:30:00.000Z"),
    },
    {
      conversationId,
      senderProfileId: dana,
      body: "Booked. I'll send the recording link and questions a week ahead.",
      createdAt: new Date("2026-08-13T13:10:00.000Z"),
    },
  ]);
}
