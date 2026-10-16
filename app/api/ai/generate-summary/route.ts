import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generateSummary } from "@/lib/ai";
import { z } from "zod";

const RequestSchema = z.object({
  headline: z.string().optional(),
  experience: z
    .array(
      z.object({
        company: z.string(),
        position: z.string(),
        description: z.string().optional(),
      })
    )
    .optional(),
  skills: z
    .array(
      z.object({
        category: z.string(),
        skills: z.array(z.string()),
      })
    )
    .optional(),
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

    const result = await generateSummary(session.user.id, validated.data);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json({ summary: result.summary });
  } catch (error) {
    console.error("Generate summary error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
