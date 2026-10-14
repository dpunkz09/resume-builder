-- =============================================
-- Resume Builder Database Schema
-- Apply this entire file in Supabase SQL Editor
-- =============================================

-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS "ai_usage" CASCADE;
DROP TABLE IF EXISTS "resumes" CASCADE;
DROP TABLE IF EXISTS "subscriptions" CASCADE;
DROP TABLE IF EXISTS "account" CASCADE;
DROP TABLE IF EXISTS "session" CASCADE;
DROP TABLE IF EXISTS "verification" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- Better Auth: User table
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"name" text,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);

-- Better Auth: Session table
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);

-- Better Auth: Account table (for OAuth)
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"expiresAt" timestamp,
	"password" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Better Auth: Verification table
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);

-- Application: Subscriptions table
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"provider" varchar(50) NOT NULL,
	"provider_customer_id" varchar(255),
	"provider_subscription_id" varchar(255),
	"plan" varchar(50) DEFAULT 'free' NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"current_period_end" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Application: Resumes table
CREATE TABLE "resumes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" varchar(255) DEFAULT 'Untitled Resume' NOT NULL,
	"template_id" varchar(50) DEFAULT 'minimal' NOT NULL,
	"theme" jsonb DEFAULT '{
    "color": "#0066cc",
    "font": "inter",
    "fontSize": "medium",
    "spacing": "normal",
    "margins": "normal",
    "pageSize": "a4"
  }'::jsonb NOT NULL,
	"content" jsonb DEFAULT '{
    "basics": {
      "fullName": "",
      "headline": "",
      "email": "",
      "phone": "",
      "location": "",
      "website": "",
      "links": []
    },
    "summary": "",
    "sections": []
  }'::jsonb NOT NULL,
	"is_public" varchar(10) DEFAULT 'false' NOT NULL,
	"public_slug" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "resumes_public_slug_unique" UNIQUE("public_slug")
);

-- Application: AI Usage tracking table
CREATE TABLE "ai_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"feature" varchar(100) NOT NULL,
	"tokens_in" varchar(50),
	"tokens_out" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Foreign Key Constraints
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" 
	FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" 
	FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_user_id_fk" 
	FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "resumes" ADD CONSTRAINT "resumes_user_id_user_id_fk" 
	FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "ai_usage" ADD CONSTRAINT "ai_usage_user_id_user_id_fk" 
	FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;

-- Indexes for Performance
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions" USING btree ("user_id");
CREATE INDEX "resumes_user_id_idx" ON "resumes" USING btree ("user_id");
CREATE INDEX "resumes_public_slug_idx" ON "resumes" USING btree ("public_slug");
CREATE INDEX "ai_usage_user_id_idx" ON "ai_usage" USING btree ("user_id");
CREATE INDEX "ai_usage_created_at_idx" ON "ai_usage" USING btree ("created_at");

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Database schema created successfully!';
    RAISE NOTICE 'Tables created: user, session, account, verification, subscriptions, resumes, ai_usage';
END $$;
