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
