import { NextRequest, NextResponse } from "next/server";
import { exportResumeToPDF } from "@/app/actions/pdf-actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { subscriptions, resumes } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  try {
    const { resumeId } = await params;

    // Get user's plan to determine watermark
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get resume to extract title and verify ownership
    const [resume] = await db
      .select()
      .from(resumes)
      .where(and(eq(resumes.id, resumeId), eq(resumes.userId, session.user.id)))
      .limit(1);

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id))
      .limit(1);

    const userPlan = subscription?.plan || "free";

    const result = await exportResumeToPDF(resumeId, userPlan === "free");

    if (result.error || !result.pdf) {
      return NextResponse.json({ error: result.error || "Export failed" }, { status: 400 });
    }

    // Create filename from resume title, sanitize for filesystem
    const title = resume.title || "Resume";
    const filename = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;

    // Return PDF as download
    return new NextResponse(new Uint8Array(result.pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to export resume" }, { status: 500 });
  }
}
