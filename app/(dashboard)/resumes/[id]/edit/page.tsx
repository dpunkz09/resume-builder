import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { resumes, subscriptions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { ResumeEditorWithAnalyzer } from "@/components/editor/resume-editor-with-analyzer";
import type { Metadata } from "next";
import { BRAND } from "@/components/landing/brand";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      title: "Edit Resume",
    };
  }

  const { id } = await params;

  // Fetch the resume to get its title
  const [resume] = await db
    .select()
    .from(resumes)
    .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)))
    .limit(1);

  const resumeTitle = resume?.title || "Untitled Resume";

  return {
    title: `${resumeTitle} - ${BRAND.name}`,
    description: `Edit your resume: ${resumeTitle}. Customize templates, add sections, and export to PDF.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function EditResumePage({ params }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  // Fetch the resume
  const [resume] = await db
    .select()
    .from(resumes)
    .where(and(eq(resumes.id, id), eq(resumes.userId, session.user.id)))
    .limit(1);

  if (!resume) {
    redirect("/dashboard");
  }

  // Get user's subscription/plan
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, session.user.id))
    .limit(1);

  const userPlan = subscription?.plan || "free";

  return <ResumeEditorWithAnalyzer resume={resume} userPlan={userPlan as "free" | "pro"} />;
}
