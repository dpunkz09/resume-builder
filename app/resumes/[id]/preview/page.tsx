import { db } from "@/db";
import { resumes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ResumePreview } from "@/components/preview/resume-preview";
import { ResumeContent, Theme } from "@/types";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ResumePreviewPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch the resume (no auth check for preview)
  const [resume] = await db
    .select()
    .from(resumes)
    .where(eq(resumes.id, id))
    .limit(1);

  if (!resume) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <ResumePreview
        content={resume.content as ResumeContent}
        theme={resume.theme as Theme}
        templateId={resume.templateId}
      />
    </div>
  );
}
