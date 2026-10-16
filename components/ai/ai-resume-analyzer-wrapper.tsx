"use client";

import { useState, useEffect } from "react";
import { AIResumeAnalyzer } from "./ai-resume-analyzer";
import { ResumeContent } from "@/types";

type AIResumeAnalyzerWrapperProps = {
  resumeId: string;
};

export function AIResumeAnalyzerWrapper({ resumeId }: AIResumeAnalyzerWrapperProps) {
  const [content, setContent] = useState<ResumeContent | null>(null);

  useEffect(() => {
    // Fetch resume content
    const fetchResume = async () => {
      try {
        const response = await fetch(`/api/resumes/${resumeId}`);
        if (response.ok) {
          const data = await response.json();
          setContent(data.content);
        }
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };

    fetchResume();
  }, [resumeId]);

  if (!content) {
    return null;
  }

  return <AIResumeAnalyzer content={content} />;
}
