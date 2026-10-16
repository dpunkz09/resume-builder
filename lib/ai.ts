import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/db";
import { aiUsage, subscriptions } from "@/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

// AI Feature Types
export type AIFeature = "rewrite_bullet" | "generate_summary" | "tailor_resume" | "analyze_resume";

// Rate Limits per plan (per 24 hours)
const RATE_LIMITS = {
  free: 0, // No AI features
  pro: 100, // 100 AI calls per day
};

/**
 * Check if user has access to AI features and is within rate limits
 */
export async function checkAIAccess(
  userId: string
): Promise<{ allowed: boolean; reason?: string; remaining?: number }> {
  try {
    // Check user's plan
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (!subscription || subscription.plan === "free") {
      return {
        allowed: false,
        reason: "AI features are only available on Pro plan. Upgrade to unlock AI-powered suggestions.",
      };
    }

    // Check rate limit (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const usageCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(aiUsage)
      .where(
        and(
          eq(aiUsage.userId, userId),
          gte(aiUsage.createdAt, twentyFourHoursAgo)
        )
      );

    const count = Number(usageCount[0]?.count || 0);
    const limit = RATE_LIMITS[subscription.plan as keyof typeof RATE_LIMITS] || 0;
    const remaining = Math.max(0, limit - count);

    if (count >= limit) {
      return {
        allowed: false,
        reason: `You've reached your daily AI limit (${limit} requests per day). It will reset in 24 hours.`,
        remaining: 0,
      };
    }

    return {
      allowed: true,
      remaining,
    };
  } catch (error) {
    console.error("Error checking AI access:", error);
    return {
      allowed: false,
      reason: "Unable to verify AI access. Please try again.",
    };
  }
}

/**
 * Log AI usage to database
 */
async function logAIUsage(
  userId: string,
  feature: AIFeature,
  tokensIn: number,
  tokensOut: number
): Promise<void> {
  try {
    await db.insert(aiUsage).values({
      userId,
      feature,
      tokensIn,
      tokensOut,
    });
  } catch (error) {
    console.error("Error logging AI usage:", error);
  }
}

/**
 * Rewrite a bullet point to be more professional and impactful
 */
export async function rewriteBullet(
  userId: string,
  bulletPoint: string
): Promise<{ success: boolean; suggestions?: string[]; error?: string }> {
  try {
    const accessCheck = await checkAIAccess(userId);
    if (!accessCheck.allowed) {
      return { success: false, error: accessCheck.reason };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `You are a professional resume writer. Rewrite the following achievement bullet point to be more impactful and quantifiable.

Original: "${bulletPoint}"

Requirements:
- Use strong action verbs
- Focus on results and achievements
- Be specific and quantifiable where possible
- Keep it concise (one sentence)
- Do NOT add placeholders like [X%] or [number]
- Make it sound professional but authentic

Provide exactly 3 different versions, each on a separate line with no numbering or bullets.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse suggestions (split by newlines, filter empty, remove numbering)
    const suggestions = text
      .split("\n")
      .map((s) => s.trim())
      .map((s) => s.replace(/^[\d\-\*\•\.\)]+\s*/, "")) // Remove numbering/bullets
      .filter((s) => s.length > 0 && s.length < 300); // Filter empty and too long

    // Log usage
    const tokensIn = prompt.length / 4; // Rough estimate: 1 token ≈ 4 chars
    const tokensOut = text.length / 4;
    await logAIUsage(userId, "rewrite_bullet", Math.ceil(tokensIn), Math.ceil(tokensOut));

    return {
      success: true,
      suggestions: suggestions.slice(0, 3), // Ensure max 3
    };
  } catch (error) {
    console.error("Error rewriting bullet:", error);
    return {
      success: false,
      error: "Failed to generate suggestions. Please try again.",
    };
  }
}

/**
 * Generate a professional summary based on resume content
 */
export async function generateSummary(
  userId: string,
  resumeData: {
    headline?: string;
    experience?: Array<{ company: string; position: string; description?: string }>;
    skills?: Array<{ category: string; skills: string[] }>;
  }
): Promise<{ success: boolean; summary?: string; error?: string }> {
  try {
    const accessCheck = await checkAIAccess(userId);
    if (!accessCheck.allowed) {
      return { success: false, error: accessCheck.reason };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `You are a professional resume writer. Write a compelling professional summary (2-3 sentences, maximum 80 words) based on the candidate's information below.

Headline: ${resumeData.headline || "Professional"}
Recent Experience: ${JSON.stringify(resumeData.experience?.slice(0, 2) || [])}
Key Skills: ${resumeData.skills?.map((s) => s.skills.join(", ")).join(", ") || ""}

CRITICAL REQUIREMENTS:
1. Use IMPLIED FIRST PERSON - Do NOT use "I", "I am", "I have", "my", or "me"
2. Start directly with adjectives or action words (e.g., "Experienced developer..." not "I am an experienced developer...")
3. Write ONLY the professional summary paragraph
4. Do NOT include: options, variations, instructions, tips, headings, or placeholders
5. Be specific, quantifiable, and impactful
6. Use active voice and strong descriptive words

GOOD EXAMPLE:
"Experienced software engineer with 8+ years developing scalable web applications. Proven track record of leading cross-functional teams and delivering high-impact solutions. Specialized in React, Node.js, and cloud architecture."

BAD EXAMPLE (uses "I"):
"I am an experienced software engineer with 8+ years. I have led teams and delivered solutions."

Professional Summary:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const summary = response.text().trim();

    // Log usage
    const tokensIn = prompt.length / 4;
    const tokensOut = summary.length / 4;
    await logAIUsage(userId, "generate_summary", Math.ceil(tokensIn), Math.ceil(tokensOut));

    return {
      success: true,
      summary,
    };
  } catch (error) {
    console.error("Error generating summary:", error);
    // Log more details
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return {
      success: false,
      error: "Failed to generate summary. Please try again.",
    };
  }
}

/**
 * Tailor resume content to match a job description
 */
export async function tailorToJob(
  userId: string,
  currentContent: string,
  jobDescription: string
): Promise<{ success: boolean; suggestions?: string; error?: string }> {
  try {
    const accessCheck = await checkAIAccess(userId);
    if (!accessCheck.allowed) {
      return { success: false, error: accessCheck.reason };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `You are a professional resume consultant. Analyze the job description and suggest how to tailor the following content to better match the role.

Job Description:
${jobDescription}

Current Content:
${currentContent}

Provide specific, actionable suggestions on:
1. Keywords to emphasize
2. Skills to highlight
3. Experience points to strengthen
4. What to add or remove

Keep suggestions concise and specific.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const suggestions = response.text().trim();

    // Log usage
    const tokensIn = prompt.length / 4;
    const tokensOut = suggestions.length / 4;
    await logAIUsage(userId, "tailor_resume", Math.ceil(tokensIn), Math.ceil(tokensOut));

    return {
      success: true,
      suggestions,
    };
  } catch (error) {
    console.error("Error tailoring to job:", error);
    return {
      success: false,
      error: "Failed to generate tailoring suggestions. Please try again.",
    };
  }
}

/**
 * Get user's AI usage stats
 */
export async function getAIUsageStats(userId: string): Promise<{
  todayCount: number;
  limit: number;
  remaining: number;
}> {
  try {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    const plan = subscription?.plan || "free";
    const limit = RATE_LIMITS[plan as keyof typeof RATE_LIMITS] || 0;

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const usageCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(aiUsage)
      .where(
        and(
          eq(aiUsage.userId, userId),
          gte(aiUsage.createdAt, twentyFourHoursAgo)
        )
      );

    const todayCount = Number(usageCount[0]?.count || 0);
    const remaining = Math.max(0, limit - todayCount);

    return {
      todayCount,
      limit,
      remaining,
    };
  } catch (error) {
    console.error("Error getting AI usage stats:", error);
    return {
      todayCount: 0,
      limit: 0,
      remaining: 0,
    };
  }
}

/**
 * Analyze a complete resume and provide improvement suggestions
 */
export async function analyzeResume(
  userId: string,
  content: any
): Promise<{ success: boolean; analysis?: string; error?: string }> {
  try {
    const accessCheck = await checkAIAccess(userId);
    if (!accessCheck.allowed) {
      return { success: false, error: accessCheck.reason };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // Prepare resume data for analysis
    const resumeText = JSON.stringify(content, null, 2);

    const prompt = `You are an expert resume consultant and career advisor. Analyze the following resume and provide actionable feedback to improve it.

RESUME DATA:
${resumeText}

Provide a comprehensive analysis covering:

1. OVERALL IMPRESSION:
   - What stands out positively
   - Overall professionalism and impact

2. STRENGTHS:
   - What's working well
   - Strong points to maintain

3. AREAS FOR IMPROVEMENT:
   - Content gaps or weaknesses
   - Missing information
   - Sections that need work

4. SPECIFIC RECOMMENDATIONS:
   - How to improve bullet points (be specific with examples)
   - Better ways to quantify achievements
   - Skills or keywords to add
   - Formatting or structure suggestions

5. ATS OPTIMIZATION:
   - Keywords that should be included
   - Industry-specific terms to add
   - Potential red flags for ATS systems

Keep the tone professional, encouraging, and actionable. Be specific with examples. Format your response with clear headings and bullet points.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const analysis = response.text().trim();

    // Log usage
    const tokensIn = prompt.length / 4;
    const tokensOut = analysis.length / 4;
    await logAIUsage(userId, "analyze_resume", Math.ceil(tokensIn), Math.ceil(tokensOut));

    return {
      success: true,
      analysis,
    };
  } catch (error) {
    console.error("Error analyzing resume:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    return {
      success: false,
      error: "Failed to analyze resume. Please try again.",
    };
  }
}
