"use server";

import { chromium } from "playwright";
import { db } from "@/db";
import { resumes } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";

export async function exportResumeToPDF(
  resumeId: string,
  addWatermark: boolean = false
): Promise<{ success?: boolean; error?: string; pdf?: Buffer }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Verify resume belongs to user
    const [resume] = await db
      .select()
      .from(resumes)
      .where(and(eq(resumes.id, resumeId), eq(resumes.userId, session.user.id)))
      .limit(1);

    if (!resume) {
      return { error: "Resume not found or unauthorized" };
    }

    // Get the base URL from environment or construct it
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const printUrl = `${baseUrl}/print/${resumeId}?token=print`;

    // Launch browser and generate PDF
    const browser = await chromium.launch({
      headless: true,
    });

    try {
      const context = await browser.newContext();
      const page = await context.newPage();

      // Navigate to print page
      await page.goto(printUrl, {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      // Wait for Tailwind CDN to load and process all classes
      await page.waitForFunction(
        () => {
          // Check if Tailwind is loaded by checking if the script exists
          const tailwindScript = document.querySelector('script[src*="tailwindcss"]');
          if (!tailwindScript) return false;
          
          // Check if styles are applied by checking a known Tailwind class
          const testDiv = document.createElement('div');
          testDiv.className = 'text-sm';
          document.body.appendChild(testDiv);
          const computed = window.getComputedStyle(testDiv);
          const hasStyles = computed.fontSize === '14px' || computed.fontSize === '0.875rem';
          document.body.removeChild(testDiv);
          
          return hasStyles;
        },
        { timeout: 10000 }
      );

      // Additional wait for Tailwind to process all classes
      await page.waitForTimeout(3000);

      // Wait for fonts to load
      await page.evaluate(() => document.fonts.ready);

      // Add watermark for free tier users
      if (addWatermark) {
        await page.evaluate(() => {
          const watermarkDiv = document.createElement("div");
          watermarkDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.05);
            color: rgba(0, 0, 0, 0.4);
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 12px;
            font-family: system-ui, -apple-system, sans-serif;
            z-index: 9999;
            pointer-events: none;
          `;
          watermarkDiv.textContent = "Created with JPAWORX Resume Builder - Upgrade to remove";
          document.body.appendChild(watermarkDiv);
        });

        // Wait a bit for watermark to render
        await page.waitForTimeout(200);
      }

      // Generate PDF
      const theme = resume.theme as { pageSize?: "a4" | "letter" | "folio"; margins?: string };

      // For standard sizes, use format. For Folio, let CSS @page handle it
      const pdfOptions: any = {
        printBackground: true,
        preferCSSPageSize: true, // Respect @page CSS rules
      };

      // Set format for standard sizes (optional, CSS @page takes precedence)
      if (theme.pageSize === "letter") {
        pdfOptions.format = "Letter";
      } else if (theme.pageSize === "a4") {
        pdfOptions.format = "A4";
      }
      // For folio, CSS @page handles the custom size (8.5in x 13in)

      const pdf = await page.pdf(pdfOptions);

      await context.close();

      return { success: true, pdf: Buffer.from(pdf) };
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error("PDF generation error:", error);
    return { error: "Failed to generate PDF" };
  }
}
