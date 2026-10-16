import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { analyzeResume } from "@/lib/ai";
import { z } from "zod";
import { ResumeContentSchema } from "@/types";

const RequestSchema = z.object({
  content: ResumeContentSchema,
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

    const result = await analyzeResume(session.user.id, validated.data.content);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json({ analysis: result.analysis });
  } catch (error) {
    console.error("Analyze resume error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
