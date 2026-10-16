"use client";

import { useState } from "react";
import { AIButton } from "@/components/ai/ai-button";
import { AISuggestionDialog } from "@/components/ai/ai-suggestion-dialog";
import { ResumeContent } from "@/types";

type SummaryEditorProps = {
  summary: string;
  onChange: (summary: string) => void;
  resumeContent?: ResumeContent;
};

export function SummaryEditor({ summary, onChange, resumeContent }: SummaryEditorProps) {
  const [aiDialog, setAiDialog] = useState<{
    open: boolean;
    original: string;
    suggestions: string[];
    loading: boolean;
  }>({
    open: false,
    original: "",
    suggestions: [],
    loading: false,
  });

  const handleGenerateSummary = async () => {
    if (!resumeContent) return;

    setAiDialog({
      open: true,
      original: summary,
      suggestions: [],
      loading: true,
    });

    try {
      // Prepare data from resume content
      const experienceSection = resumeContent.sections.find((s) => s.type === "experience");
      const skillsSection = resumeContent.sections.find((s) => s.type === "skills");

      const response = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: resumeContent.basics.headline,
          experience: experienceSection?.items || [],
          skills: skillsSection?.items || [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to generate summary");
        setAiDialog((prev) => ({ ...prev, open: false, loading: false }));
        return;
      }

      setAiDialog((prev) => ({
        ...prev,
        suggestions: data.summary ? [data.summary] : [],
        loading: false,
      }));
    } catch (error) {
      console.error("Generate summary error:", error);
      alert("Failed to generate summary. Please try again.");
      setAiDialog((prev) => ({ ...prev, open: false, loading: false }));
    }
  };

  const handleAcceptSuggestion = (suggestion: string) => {
    onChange(suggestion);
  };

  const hasContent =
    resumeContent &&
    (resumeContent.basics.headline || resumeContent.sections.some((s) => s.items.length > 0));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
        {hasContent && (
          <AIButton onClick={handleGenerateSummary} loading={aiDialog.loading}>
            {aiDialog.loading ? "Generating..." : "Generate with AI"}
          </AIButton>
        )}
      </div>

      <textarea
        value={summary}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Write a brief professional summary highlighting your experience, skills, and career goals..."
      />
      <p className="mt-1 text-xs text-gray-500">{summary.length} characters</p>

      {/* AI Suggestion Dialog */}
      <AISuggestionDialog
        isOpen={aiDialog.open}
        onClose={() => setAiDialog((prev) => ({ ...prev, open: false }))}
        title="AI-Generated Summary"
        original={aiDialog.original || "No summary yet"}
        suggestions={aiDialog.suggestions}
        onAccept={handleAcceptSuggestion}
        loading={aiDialog.loading}
      />
    </div>
  );
}
