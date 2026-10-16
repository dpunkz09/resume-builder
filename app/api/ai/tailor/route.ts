import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { tailorToJob } from "@/lib/ai";
import { z } from "zod";

const RequestSchema = z.object({
  currentContent: z.string().min(1).max(2000),
  jobDescription: z.string().min(1).max(5000),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = RequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validated.error.issues },
        { status: 400 }
      );
    }

    const result = await tailorToJob(
      session.user.id,
      validated.data.currentContent,
      validated.data.jobDescription
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json({ suggestions: result.suggestions });
  } catch (error) {
    console.error("Tailor to job error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
