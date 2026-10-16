import { db } from "../db";
import { subscriptions } from "../db/schema";
import { eq } from "drizzle-orm";

async function upgradeUserToPro() {
  try {
    // Get the user email from command line args
    const email = process.argv[2];
    
    if (!email) {
      console.error("Usage: npx tsx scripts/upgrade-to-pro.ts <user-email>");
      process.exit(1);
    }

    // Find user by email
    const { users } = await import("../db/schema");
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      console.error(`User not found: ${email}`);
      process.exit(1);
    }

    console.log(`Found user: ${user.email} (${user.id})`);

    // Check if subscription exists
    const [existing] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .limit(1);

    const currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    if (existing) {
      console.log("Updating existing subscription to Pro...");
      await db
        .update(subscriptions)
        .set({
          plan: "pro",
          status: "active",
          currentPeriodEnd,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.userId, user.id));
    } else {
      console.log("Creating new Pro subscription...");
      await db.insert(subscriptions).values({
        userId: user.id,
        provider: "stripe",
        plan: "pro",
        status: "active",
        currentPeriodEnd,
      });
    }

    console.log(`✓ User ${email} upgraded to Pro successfully!`);
    console.log(`  Plan: pro`);
    console.log(`  Status: active`);
    console.log(`  Valid until: ${currentPeriodEnd.toISOString()}`);
  } catch (error) {
    console.error("Upgrade failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

upgradeUserToPro();
