"use server";

import { db } from "@/db";
import { verifications, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendVerificationEmail, generateOTP } from "@/lib/email";
import crypto from "crypto";

export async function sendVerificationOTP(email: string) {
  try {
    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing verification codes for this email
    await db.delete(verifications).where(eq(verifications.identifier, email));

    // Store OTP in database
    await db.insert(verifications).values({
      id: crypto.randomUUID(),
      identifier: email,
      value: otp,
      expiresAt,
    });

    // Send email
    const result = await sendVerificationEmail(email, otp);

    if (!result.success) {
      return { success: false, error: "Failed to send verification email" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending verification OTP:", error);
    return { success: false, error: "Failed to send verification code" };
  }
}

export async function verifyOTP(email: string, otp: string) {
  try {
    // Find verification code
    const verification = await db.query.verifications.findFirst({
      where: (verifications, { eq, and, gt }) =>
        and(
          eq(verifications.identifier, email),
          eq(verifications.value, otp),
          gt(verifications.expiresAt, new Date())
        ),
    });

    if (!verification) {
      return { success: false, error: "Invalid or expired verification code" };
    }

    // Delete the used verification code
    await db.delete(verifications).where(eq(verifications.id, verification.id));

    // Mark user email as verified
    const [updatedUser] = await db
      .update(users)
      .set({ emailVerified: true, updatedAt: new Date() })
      .where(eq(users.email, email))
      .returning();

    if (!updatedUser) {
      return { success: false, error: "User not found" };
    }

    // Initialize user subscription after verification
    const { initializeUserData } = await import("./auth-actions");
    await initializeUserData(updatedUser.id);

    return { success: true };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, error: "Failed to verify code" };
  }
}
