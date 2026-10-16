import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { rewriteBullet } from "@/lib/ai";
import { z } from "zod";

const RequestSchema = z.object({
  bulletPoint: z.string().min(1).max(500),
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

    const result = await rewriteBullet(session.user.id, validated.data.bulletPoint);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json({ suggestions: result.suggestions });
  } catch (error) {
    console.error("Rewrite bullet error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
