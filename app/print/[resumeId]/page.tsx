import { db } from "@/db";
import { resumes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getTemplateComponent } from "@/lib/templates";
import { ResumeContent, Theme } from "@/types";

type PrintPageProps = {
  params: Promise<{ resumeId: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function PrintPage({ params, searchParams }: PrintPageProps) {
  const { resumeId } = await params;
  const { token } = await searchParams;

  // Simple token validation
  if (!token || token !== "print") {
    notFound();
  }

  // Fetch resume
  const [resume] = await db.select().from(resumes).where(eq(resumes.id, resumeId)).limit(1);

  if (!resume) {
    notFound();
  }

  const content = resume.content as ResumeContent;
  const theme = resume.theme as Theme;
  const TemplateComponent = getTemplateComponent(resume.templateId);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{resume.title} - Resume</title>

        {/* Tailwind CDN - must load synchronously for Playwright */}
        <script src="https://cdn.tailwindcss.com"></script>

        <style
          dangerouslySetInnerHTML={{
            __html: `
              @page {
                size: ${theme.pageSize === "a4" ? "A4" : theme.pageSize === "folio" ? "8.5in 13in" : "letter"};
                margin: ${
                  theme.margins === "narrow"
                    ? "0.5in"
                    : theme.margins === "wide"
                      ? "1.25in"
                      : "0.75in"
                };
              }
              
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              html, body {
                margin: 0;
                padding: 0;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              
              /* Preserve colors in PDF */
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              
              /* Prevent page breaks inside important elements */}
              .break-inside-avoid,
              .break-inside-avoid-page {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              
              /* Ensure backgrounds are printed */
              div, section, header, footer {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              /* List styling */
              ul {
                list-style-position: outside;
              }
              
              li {
                page-break-inside: avoid;
              }
              
              /* Remove container padding since @page margins handle spacing */
              .resume-container {
                padding: 0;
              }
            `,
          }}
        />
      </head>
      <body>
        <div className="resume-container">
          <TemplateComponent content={content} theme={theme} />
        </div>
      </body>
    </html>
  );
}
