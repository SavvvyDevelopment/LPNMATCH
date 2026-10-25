"use server";

import { and, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { interviewSides, isMemberRole, pinLimit, pairIds, workflowTemplates } from "@/lib/labels";
import { files } from "@/lib/s3";

import { db } from "./index";
import {
  conversationStatus,
  conversations,
  interviews,
  leaderboardStats,
  matches,
  messages,
  profiles,
  reviews,
  workflowSteps,
  workflows,
  type ConversationStatus,
} from "./schema";
import { ensureAccount, getSessionUser } from "./data";

async function current() {
  const account = await ensureAccount();
  if (!account) return null;
  return account;
}

function isConversationStatus(value: string): value is ConversationStatus {
  return (conversationStatus.enumValues as string[]).includes(value);
}

export async function claimProfile(input: { role: string; name: string }) {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Check your email to verify the account, then sign in." };
  }
  if (!isMemberRole(input.role)) return { error: "Choose a valid role." };
  await ensureAccount({ role: input.role, name: input.name });
  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function saveProfile(formData: FormData) {
  const account = await current();
  if (!account) return { error: "Sign in required." };

  const displayName = String(formData.get("displayName") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const videoPitchUrl = String(formData.get("videoPitchUrl") ?? "").trim();
  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
  const role = String(formData.get("role") ?? account.profile.role);
  const showName = String(formData.get("showName") ?? "").trim();
  const audienceSize = Math.max(0, Math.round(Number(formData.get("audienceSize") ?? 0)) || 0);
  const topics = String(formData.get("topics") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const topicsAvoid = String(formData.get("topicsAvoid") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item && !topics.includes(item));
  const accepting = formData.get("accepting") === "on";

  if (!displayName || !username) return { error: "Name and username are required." };
  if (!isMemberRole(role)) return { error: "Choose a valid role." };

  const duplicate = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.username, username))
    .limit(1);
  if (duplicate[0] && duplicate[0].id !== account.profile.id) {
    return { error: "That username is already taken." };
  }

  await db
    .update(profiles)
    .set({
      displayName,
      title,
      bio,
      location,
      website: website || null,
      videoPitchUrl: videoPitchUrl || null,
      username,
      role,
      showName: showName || null,
      audienceSize,
      topics,
      topicsAvoid,
      accepting,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, account.profile.id));

  revalidatePath("/dashboard/profile");
  revalidatePath(`/profile/${username}`);
  return { ok: true as const };
}

export async function uploadPhoto(formData: FormData) {
  const account = await current();
  if (!account) return { error: "Sign in required." };
  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image." };
  if (file.size > 2 * 1024 * 1024) return { error: "Images must be 2MB or smaller." };
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return { error: "Use a JPEG, PNG, or WebP image." };
  }

  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const key = `avatars/${account.profile.id}/${crypto.randomUUID()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await files.upload(key, bytes, { contentType: file.type });

  await db
    .update(profiles)
    .set({ photoKey: key, updatedAt: new Date() })
    .where(eq(profiles.id, account.profile.id));

  revalidatePath("/dashboard/profile");
  revalidatePath(`/profile/${account.profile.username}`);
  return { ok: true as const };
}

export async function setPlan(formData: FormData) {
  const account = await current();
  if (!account) return { error: "Sign in required." };
  const plan = String(formData.get("plan") ?? "");
  if (plan !== "standard" && plan !== "professional") return { error: "Unknown plan." };

  await db
    .update(profiles)
    .set({
      plan,
      professionalBadge: plan === "professional",
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, account.profile.id));

  revalidatePath("/dashboard/profile");
  return { ok: true as const };
}

export async function respondToMatch(formData: FormData) {
  const account = await current();
  if (!account) return { error: "Sign in required." };
  const matchId = String(formData.get("matchId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (decision !== "accepted" && decision !== "declined") return { error: "Unknown decision." };

  const [match] = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
  if (!match || match.ownerProfileId !== account.profile.id) return { error: "Match not found." };

  await db
    .update(matches)
    .set({ status: decision, pinned: decision === "accepted" ? match.pinned : false })
    .where(eq(matches.id, match.id));

  if (decision === "accepted") {
    const [counterpart] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, match.counterpartProfileId))
      .limit(1);

    await db
      .insert(matches)
      .values({
        ownerProfileId: match.counterpartProfileId,
        counterpartProfileId: account.profile.id,
        score: match.score,
        status: "accepted",
        reason: match.reason,
        pinned: false,
      })
      .onConflictDoUpdate({
        target: [matches.ownerProfileId, matches.counterpartProfileId],
        set: { status: "accepted" },
      });

    const [low, high] = pairIds(account.profile.id, match.counterpartProfileId);
    await db
      .insert(conversations)
      .values({
        profileAId: low,
        profileBId: high,
        status: "scheduling",
        nextStep: "Agree on a topic and pick a recording date.",
      })
      .onConflictDoNothing();

    if (counterpart) {
      await db.insert(interviews).values({
        ...interviewSides(account.profile, counterpart),
        title: `Interview with ${counterpart.displayName}`,
        scheduledAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        status: "scheduled",
        notes: "Opened from an accepted match.",
      });
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/matches");
  revalidatePath("/dashboard/messages");
  revalidatePath("/dashboard/interviews");
  return { ok: true as const };
}

export async function togglePin(formData: FormData) {
  const account = await current();
  if (!account) return { error: "Sign in required." };
  const matchId = String(formData.get("matchId") ?? "");
  const [match] = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
  if (!match || match.ownerProfileId !== account.profile.id) return { error: "Match not found." };

  if (!match.pinned) {
    const pinned = await db
      .select({ id: matches.id })
      .from(matches)
      .where(and(eq(matches.ownerProfileId, account.profile.id), eq(matches.pinned, true)));
    if (pinned.length >= pinLimit(account.profile.plan)) {
      return { error: `Your plan pins up to ${pinLimit(account.profile.plan)} members.` };
    }
  }

  await db.update(matches).set({ pinned: !match.pinned }).where(eq(matches.id, match.id));
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/matches");
  return { ok: true as const };
}

export async function sendMessage(formData: FormData) {
  const account = await current();
  if (!account) return { error: "Sign in required." };
  const conversationId = String(formData.get("conversationId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Write a message first." };

  const [conversation] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);
  if (
    !conversation ||
    (conversation.profileAId !== account.profile.id && conversation.profileBId !== account.profile.id)
  ) {
    return { error: "Conversation not found." };
  }

  await db.insert(messages).values({
    conversationId,
    senderProfileId: account.profile.id,
    body,
  });
  await db
    .update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));

  revalidatePath("/dashboard/messages");
  return { ok: true as const };
}

export async function updateConversation(formData: FormData) {
  const account = await current();
  if (!account) return { error: "Sign in required." };
  const conversationId = String(formData.get("conversationId") ?? "");
  const status = String(formData.get("status") ?? "");
  const nextStep = String(formData.get("nextStep") ?? "").trim();
  if (!isConversationStatus(status)) return { error: "Unknown status." };

  const [conversation] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);
  if (
    !conversation ||
    (conversation.profileAId !== account.profile.id && conversation.profileBId !== account.profile.id)
  ) {
    return { error: "Conversation not found." };
  }

  await db
    .update(conversations)
    .set({
      status,
      nextStep: nextStep || conversation.nextStep,
      updatedAt: new Date(),
    })
    .where(eq(conversations.id, conversationId));

  revalidatePath("/dashboard/messages");
  return { ok: true as const };
}

export async function toggleStep(formData: FormData) {
  const account = await current();
  if (!account) return { error: "Sign in required." };
  const stepId = String(formData.get("stepId") ?? "");
  const [step] = await db.select().from(workflowSteps).where(eq(workflowSteps.id, stepId)).limit(1);
  if (!step) return { error: "Step not found." };
  const [workflow] = await db
    .select()
    .from(workflows)
    .where(eq(workflows.id, step.workflowId))
    .limit(1);
  if (!workflow || workflow.ownerProfileId !== account.profile.id) return { error: "Step not found." };

  await db.update(workflowSteps).set({ done: !step.done }).where(eq(workflowSteps.id, step.id));
  revalidatePath("/dashboard/workflows");
  return { ok: true as const };
}

export async function addWorkflow(formData: FormData) {
  const account = await current();
  if (!account) return { error: "Sign in required." };
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name the workflow." };
  const template = workflowTemplates[account.profile.role];
  const [workflow] = await db
    .insert(workflows)
    .values({ ownerProfileId: account.profile.id, name, kind: "custom" })
    .returning();
  await db.insert(workflowSteps).values(
    template.steps.map((title, position) => ({
      workflowId: workflow.id,
      title,
      position,
      done: false,
    })),
  );
  revalidatePath("/dashboard/workflows");
  return { ok: true as const };
}


const nextInterviewStatus = { scheduled: "recorded", recorded: "released" } as const;

async function ownInterview(profileId: string, interviewId: string) {
  const [interview] = await db.select().from(interviews).where(eq(interviews.id, interviewId)).limit(1);
  if (!interview) return null;
  if (interview.hostProfileId !== profileId && interview.guestProfileId !== profileId) return null;
  return interview;
}

export async function advanceInterview(formData: FormData) {
  const account = await current();
  if (!account) return { error: "Sign in required." };
  const interview = await ownInterview(account.profile.id, String(formData.get("interviewId") ?? ""));
  if (!interview) return { error: "Interview not found." };
  if (interview.status !== "scheduled" && interview.status !== "recorded") {
    return { error: "This interview is already wrapped up." };
  }

  const status = nextInterviewStatus[interview.status];
  const episodeUrl = String(formData.get("episodeUrl") ?? "").trim();
  await db
    .update(interviews)
    .set({ status, episodeUrl: episodeUrl || interview.episodeUrl })
    .where(eq(interviews.id, interview.id));

  if (status === "released") {
    await db
      .update(leaderboardStats)
      .set({
        interviewsCount: sql`${leaderboardStats.interviewsCount} + 1`,
        points: sql`${leaderboardStats.points} + 50`,
      })
      .where(inArray(leaderboardStats.profileId, [interview.hostProfileId, interview.guestProfileId]));
  }

  revalidatePath("/dashboard/interviews");
  revalidatePath("/dashboard/leaderboard");
  revalidatePath("/dashboard/stats");
  return { ok: true as const };
}

export async function leaveReview(formData: FormData) {
  const account = await current();
  if (!account) return { error: "Sign in required." };
  const body = String(formData.get("body") ?? "").trim();
  const rating = Number(formData.get("rating") ?? 0);
  if (!body || rating < 1 || rating > 5) return { error: "Add a rating from 1 to 5 and a short note." };

  const interview = await ownInterview(account.profile.id, String(formData.get("interviewId") ?? ""));
  if (!interview) return { error: "Interview not found." };

  const subjectProfileId =
    interview.hostProfileId === account.profile.id ? interview.guestProfileId : interview.hostProfileId;

  const existing = await db
    .select({ id: reviews.id })
    .from(reviews)
    .where(and(eq(reviews.interviewId, interview.id), eq(reviews.authorProfileId, account.profile.id)))
    .limit(1);
  if (existing.length > 0) return { error: "You already reviewed this interview." };

  await db.insert(reviews).values({
    interviewId: interview.id,
    authorProfileId: account.profile.id,
    subjectProfileId,
    rating,
    body,
  });
  await db
    .update(leaderboardStats)
    .set({
      reviewsCount: sql`${leaderboardStats.reviewsCount} + 1`,
      points: sql`${leaderboardStats.points} + 20`,
    })
    .where(eq(leaderboardStats.profileId, subjectProfileId));

  revalidatePath("/dashboard/interviews");
  revalidatePath("/dashboard/leaderboard");
  return { ok: true as const };
}
