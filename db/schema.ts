import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  varchar,
  index,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Better Auth tables
// Users table (Better Auth compatible)
export const users = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Sessions table (Better Auth)
export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Accounts table (Better Auth - for OAuth)
export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  expiresAt: timestamp("expiresAt"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Verifications table (Better Auth - for email verification)
export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Application tables
// Subscriptions table
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    provider: varchar("provider", { length: 50 }).notNull(), // 'stripe' or 'paddle'
    providerCustomerId: varchar("provider_customer_id", { length: 255 }),
    providerSubscriptionId: varchar("provider_subscription_id", { length: 255 }),
    plan: varchar("plan", { length: 50 }).notNull().default("free"), // 'free' or 'pro'
    status: varchar("status", { length: 50 }).notNull().default("active"), // 'active', 'canceled', 'past_due'
    currentPeriodEnd: timestamp("current_period_end"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("subscriptions_user_id_idx").on(table.userId),
  })
);

// Resumes table
export const resumes = pgTable(
  "resumes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 255 }).notNull().default("Untitled Resume"),
    templateId: varchar("template_id", { length: 50 }).notNull().default("minimal"),
    theme: jsonb("theme")
      .$type<{
        color: string;
        font: string;
        fontSize: string;
        spacing: string;
        margins: string;
        pageSize: "a4" | "letter";
      }>()
      .notNull()
      .default(
        sql`'{
    "color": "#0066cc",
    "font": "inter",
    "fontSize": "medium",
    "spacing": "normal",
    "margins": "normal",
    "pageSize": "a4"
  }'::jsonb`
      ),
    content: jsonb("content")
      .$type<{
        basics: {
          fullName: string;
          headline: string;
          email: string;
          phone: string;
          location: string;
          website: string;
          links: Array<{ label: string; url: string }>;
        };
        summary: string;
        sections: Array<{
          id: string;
          type:
            | "experience"
            | "education"
            | "skills"
            | "projects"
            | "certifications"
            | "languages"
            | "custom";
          title: string;
          visible: boolean;
          items: unknown[];
        }>;
      }>()
      .notNull()
      .default(
        sql`'{
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
  }'::jsonb`
      ),
    isPublic: varchar("is_public", { length: 10 }).notNull().default("false"),
    publicSlug: varchar("public_slug", { length: 255 }).unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("resumes_user_id_idx").on(table.userId),
    publicSlugIdx: index("resumes_public_slug_idx").on(table.publicSlug),
  })
);

// AI Usage table
export const aiUsage = pgTable(
  "ai_usage",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    feature: varchar("feature", { length: 100 }).notNull(), // 'rewrite', 'generate_summary', 'tailor', etc.
    tokensIn: varchar("tokens_in", { length: 50 }),
    tokensOut: varchar("tokens_out", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("ai_usage_user_id_idx").on(table.userId),
    createdAtIdx: index("ai_usage_created_at_idx").on(table.createdAt),
  })
);

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type Verification = typeof verifications.$inferSelect;
export type NewVerification = typeof verifications.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;
export type AiUsage = typeof aiUsage.$inferSelect;
export type NewAiUsage = typeof aiUsage.$inferInsert;
