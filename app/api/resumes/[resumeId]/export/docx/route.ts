import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { resumes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateResumeDocx } from '@/lib/docx-generator';
import { Packer } from 'docx';
import { ResumeContent, Theme } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  try {
    const { resumeId } = await params;

    // Fetch resume from database
    const [resume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, resumeId))
      .limit(1);

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    // Parse resume data
    const content = resume.content as ResumeContent;
    const theme = resume.theme as Theme;
    const templateId = resume.templateId;

    // Generate DOCX document
    const doc = generateResumeDocx({ content, theme, templateId });

    // Convert to buffer
    const buffer = await Packer.toBuffer(doc);

    // Create filename from resume title or basics name
    const title = resume.title || content.basics?.fullName || 'resume';
    const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`;

    // Return as downloadable file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating DOCX:', error);
    return NextResponse.json(
      { error: 'Failed to generate DOCX', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
