"use client";

import { Resume } from "@/db/schema";
import { ResumeEditor } from "./resume-editor";
import { ResumeContent } from "@/types";
import { useState } from "react";

type ResumeEditorWithAnalyzerProps = {
  resume: Resume;
  userPlan: "free" | "pro";
};

export function ResumeEditorWithAnalyzer({ resume, userPlan }: ResumeEditorWithAnalyzerProps) {
  // Store the current content state from the editor
  const [currentContent, setCurrentContent] = useState<ResumeContent>(
    resume.content as ResumeContent
  );

  return (
    <ResumeEditor
      resume={resume}
      userPlan={userPlan}
      onContentChange={setCurrentContent}
      currentContent={currentContent}
    />
  );
}
