"use server";

import { db } from "@/db";
import { resumes, subscriptions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Helper to get current user session
async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session;
}

// Helper to check user's plan and resume count
async function checkResumeLimit(userId: string) {
  // Get user's subscription
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  // If free plan, check resume count
  if (!subscription || subscription.plan === "free") {
    const userResumes = await db.select().from(resumes).where(eq(resumes.userId, userId));

    if (userResumes.length >= 1) {
      return {
        allowed: false,
        message: "Free plan limit: 1 resume. Upgrade to Pro for unlimited resumes.",
      };
    }
  }

  return { allowed: true };
}

// Create a new resume
export async function createResume() {
  const session = await getSession();

  // Check resume limit
  const limitCheck = await checkResumeLimit(session.user.id);
  if (!limitCheck.allowed) {
    return { error: limitCheck.message };
  }

  try {
    const [resume] = await db
      .insert(resumes)
      .values({
        userId: session.user.id,
        title: "Untitled Resume",
      })
      .returning();

    revalidatePath("/dashboard");
    return { success: true, resumeId: resume.id };
  } catch (_error) {
    return { error: "Failed to create resume" };
  }
}

// Get all user's resumes
export async function getUserResumes() {
  const session = await getSession();

  try {
    const userResumes = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, session.user.id))
      .orderBy(desc(resumes.updatedAt));

    return { success: true, resumes: userResumes };
  } catch (_error) {
    return { error: "Failed to fetch resumes" };
  }
}

// Rename a resume
export async function renameResume(resumeId: string, newTitle: string) {
  const session = await getSession();

  if (!newTitle.trim()) {
    return { error: "Title cannot be empty" };
  }

  try {
    const [resume] = await db
      .update(resumes)
      .set({
        title: newTitle,
        updatedAt: new Date(),
      })
      .where(and(eq(resumes.id, resumeId), eq(resumes.userId, session.user.id)))
      .returning();

    if (!resume) {
      return { error: "Resume not found" };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (_error) {
    return { error: "Failed to rename resume" };
  }
}

// Duplicate a resume
export async function duplicateResume(resumeId: string) {
  const session = await getSession();

  // Check resume limit
  const limitCheck = await checkResumeLimit(session.user.id);
  if (!limitCheck.allowed) {
    return { error: limitCheck.message };
  }

  try {
    // Get the original resume
    const [original] = await db
      .select()
      .from(resumes)
      .where(and(eq(resumes.id, resumeId), eq(resumes.userId, session.user.id)))
      .limit(1);

    if (!original) {
      return { error: "Resume not found" };
    }

    // Create duplicate
    const [duplicate] = await db
      .insert(resumes)
      .values({
        userId: session.user.id,
        title: `${original.title} (Copy)`,
        templateId: original.templateId,
        theme: original.theme,
        content: original.content,
        isPublic: "false", // Always make copy private
      })
      .returning();

    revalidatePath("/dashboard");
    return { success: true, resumeId: duplicate.id };
  } catch (_error) {
    return { error: "Failed to duplicate resume" };
  }
}

// Delete a resume
export async function deleteResume(resumeId: string) {
  const session = await getSession();

  try {
    const [deleted] = await db
      .delete(resumes)
      .where(and(eq(resumes.id, resumeId), eq(resumes.userId, session.user.id)))
      .returning();

    if (!deleted) {
      return { error: "Resume not found" };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (_error) {
    return { error: "Failed to delete resume" };
  }
}
