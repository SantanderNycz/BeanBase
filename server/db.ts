import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// In production a database is mandatory; fail fast on misconfiguration.
if (!process.env.DATABASE_URL && process.env.NODE_ENV === "production") {
  throw new Error(
    "DATABASE_URL must be set in production. Did you forget to provision a database?",
  );
}

// In development, when DATABASE_URL is unset the app falls back to in-memory
// storage (see storage.ts / auth/storage.ts), so `db` is never dereferenced.
// This lets `npm run dev` run with zero config.
export const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : undefined;

export const db = pool
  ? drizzle(pool, { schema })
  : (undefined as unknown as ReturnType<typeof drizzle>);
