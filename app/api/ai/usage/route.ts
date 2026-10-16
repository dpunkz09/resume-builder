import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getAIUsageStats } from "@/lib/ai";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getAIUsageStats(session.user.id);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Get AI usage error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
