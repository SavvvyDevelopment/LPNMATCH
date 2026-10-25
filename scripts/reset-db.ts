import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { neon } from "@neondatabase/serverless";

const envFile = resolve(process.cwd(), ".env.local");
for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const separator = trimmed.indexOf("=");
  if (separator === -1) continue;
  const key = trimmed.slice(0, separator).trim();
  let value = trimmed.slice(separator + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  process.env[key] ??= value;
}

const tables = [
  "workflow_steps",
  "workflows",
  "reviews",
  "placements",
  "interviews",
  "messages",
  "conversations",
  "matches",
  "metric_snapshots",
  "leaderboard_stats",
  "profiles",
  "users",
];

const types = [
  "member_role",
  "plan_tier",
  "match_status",
  "placement_status",
  "interview_status",
  "conversation_status",
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing from .env.local");
  const sql = neon(url);
  for (const table of tables) await sql.query(`DROP TABLE IF EXISTS public."${table}" CASCADE`);
  for (const type of types) await sql.query(`DROP TYPE IF EXISTS public."${type}" CASCADE`);
  console.log("App tables dropped. Run pnpm db:push, then pnpm db:seed.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
