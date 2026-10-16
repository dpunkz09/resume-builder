import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function ensureUserSubscription(userId: string) {
  // Check if user already has a subscription
  const [existing] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  if (existing) {
    return existing;
  }

  // Create default free subscription
  const [newSubscription] = await db
    .insert(subscriptions)
    .values({
      userId,
      provider: "stripe",
      plan: "free",
      status: "active",
    })
    .returning();

  return newSubscription;
}

export async function getUserPlan(userId: string): Promise<"free" | "pro"> {
  const subscription = await ensureUserSubscription(userId);
  return subscription.plan as "free" | "pro";
}

import { Plan, SubscriptionStatus } from "@/types";
import { PRICING } from "./stripe";

export type PlanLimits = {
  resumeLimit: number;
  templates: readonly string[];
  pdfWatermark: boolean;
  aiFeatures: boolean;
};

export function getPlanLimits(plan: Plan): PlanLimits {
  return plan === "pro" ? PRICING.pro : PRICING.free;
}

export function canCreateResume(plan: Plan, currentResumeCount: number): boolean {
  const limits = getPlanLimits(plan);
  return currentResumeCount < limits.resumeLimit;
}

export function canAccessTemplate(plan: Plan, templateId: string): boolean {
  const limits = getPlanLimits(plan);
  return limits.templates.includes(templateId);
}

export function shouldShowWatermark(plan: Plan): boolean {
  const limits = getPlanLimits(plan);
  return limits.pdfWatermark;
}

export function canUseAI(plan: Plan): boolean {
  const limits = getPlanLimits(plan);
  return limits.aiFeatures;
}

export function isPlanActive(status: SubscriptionStatus): boolean {
  return status === "active";
}
