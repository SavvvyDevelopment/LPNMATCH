import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const memberRole = pgEnum("member_role", ["host", "guest", "both", "agency"]);

export const planTier = pgEnum("plan_tier", ["standard", "professional"]);

export const matchStatus = pgEnum("match_status", ["pending", "accepted", "declined"]);

export const interviewStatus = pgEnum("interview_status", [
  "scheduled",
  "recorded",
  "released",
  "cancelled",
]);

export const conversationStatus = pgEnum("conversation_status", [
  "intro",
  "scheduling",
  "booked",
  "released",
]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  username: text("username").notNull().unique(),
  role: memberRole("role").notNull().default("guest"),
  plan: planTier("plan").notNull().default("standard"),
  displayName: text("display_name").notNull(),
  title: text("title").notNull().default(""),
  showName: text("show_name"),
  bio: text("bio").notNull().default(""),
  location: text("location").notNull().default(""),
  topics: text("topics").array().notNull(),
  topicsAvoid: text("topics_avoid").array().notNull().default([]),
  audienceSize: integer("audience_size").notNull().default(0),
  photoKey: text("photo_key"),
  videoPitchUrl: text("video_pitch_url"),
  website: text("website"),
  accepting: boolean("accepting").notNull().default(true),
  responseRate: integer("response_rate").notNull().default(100),
  acceptanceRate: integer("acceptance_rate").notNull().default(100),
  reliability: integer("reliability").notNull().default(100),
  verified: boolean("verified").notNull().default(false),
  professionalBadge: boolean("professional_badge").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const matches = pgTable(
  "matches",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerProfileId: uuid("owner_profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    counterpartProfileId: uuid("counterpart_profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    status: matchStatus("status").notNull().default("pending"),
    reason: text("reason").notNull().default(""),
    pinned: boolean("pinned").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("matches_owner_counterpart_idx").on(
      table.ownerProfileId,
      table.counterpartProfileId,
    ),
  ],
);

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    profileAId: uuid("profile_a_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    profileBId: uuid("profile_b_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    status: conversationStatus("status").notNull().default("intro"),
    nextStep: text("next_step").notNull().default("Confirm the topic and share a recording window"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("conversations_pair_idx").on(table.profileAId, table.profileBId)],
);

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  senderProfileId: uuid("sender_profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const interviews = pgTable("interviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  hostProfileId: uuid("host_profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  guestProfileId: uuid("guest_profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  status: interviewStatus("status").notNull().default("scheduled"),
  notes: text("notes").notNull().default(""),
  episodeUrl: text("episode_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  interviewId: uuid("interview_id").references(() => interviews.id, { onDelete: "set null" }),
  authorProfileId: uuid("author_profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  subjectProfileId: uuid("subject_profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const workflows = pgTable("workflows", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerProfileId: uuid("owner_profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  interviewId: uuid("interview_id").references(() => interviews.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  kind: text("kind").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const workflowSteps = pgTable("workflow_steps", {
  id: uuid("id").defaultRandom().primaryKey(),
  workflowId: uuid("workflow_id")
    .notNull()
    .references(() => workflows.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  done: boolean("done").notNull().default(false),
  position: integer("position").notNull(),
});

export const leaderboardStats = pgTable("leaderboard_stats", {
  profileId: uuid("profile_id")
    .primaryKey()
    .references(() => profiles.id, { onDelete: "cascade" }),
  points: integer("points").notNull().default(0),
  interviewsCount: integer("interviews_count").notNull().default(0),
  reviewsCount: integer("reviews_count").notNull().default(0),
  profileViews: integer("profile_views").notNull().default(0),
  requests: integer("requests").notNull().default(0),
  socialImpressions: integer("social_impressions").notNull().default(0),
});

export const metricSnapshots = pgTable("metric_snapshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  month: text("month").notNull(),
  views: integer("views").notNull(),
  requests: integer("requests").notNull(),
  impressions: integer("impressions").notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Interview = typeof interviews.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Workflow = typeof workflows.$inferSelect;
export type WorkflowStep = typeof workflowSteps.$inferSelect;
export type MemberRole = (typeof memberRole.enumValues)[number];
export type PlanTier = (typeof planTier.enumValues)[number];
export type ConversationStatus = (typeof conversationStatus.enumValues)[number];
export type InterviewStatus = (typeof interviewStatus.enumValues)[number];
