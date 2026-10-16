import { db } from "../db";
import { sql } from "drizzle-orm";

async function migrateAiUsage() {
  try {
    console.log("Creating ai_usage table...");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "ai_usage" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "feature" text NOT NULL,
        "tokens_in" integer NOT NULL DEFAULT 0,
        "tokens_out" integer NOT NULL DEFAULT 0,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "ai_usage_user_id_idx" ON "ai_usage"("user_id");
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "ai_usage_user_created_idx" ON "ai_usage"("user_id", "created_at");
    `);

    console.log("✓ AI usage table created successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

migrateAiUsage();
