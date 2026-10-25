import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

function connectionString() {
  const raw = process.env.DATABASE_URL_POOLED ?? process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL_POOLED is not set");
  }
  return raw;
}

const sql = neon(connectionString());

export const db = drizzle(sql, { schema });
