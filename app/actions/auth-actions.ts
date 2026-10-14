"use server";

import { ensureUserSubscription } from "@/lib/subscription";

export async function initializeUserData(userId: string) {
  try {
    await ensureUserSubscription(userId);
    return { success: true };
  } catch (error) {
    console.error("Failed to initialize user data:", error);
    return { error: "Failed to initialize user account" };
  }
}
