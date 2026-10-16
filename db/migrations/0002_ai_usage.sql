-- Migration: Add ai_usage table for tracking AI feature usage
-- Created: Phase 5 - AI Features

CREATE TABLE IF NOT EXISTS "ai_usage" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "feature" text NOT NULL, -- 'rewrite_bullet', 'generate_summary', 'tailor_resume'
  "tokens_in" integer NOT NULL DEFAULT 0,
  "tokens_out" integer NOT NULL DEFAULT 0,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Index for querying user's usage
CREATE INDEX IF NOT EXISTS "ai_usage_user_id_idx" ON "ai_usage"("user_id");

-- Index for querying usage by date and feature (for rate limiting)
CREATE INDEX IF NOT EXISTS "ai_usage_user_created_idx" ON "ai_usage"("user_id", "created_at");
