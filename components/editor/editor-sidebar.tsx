"use client";

import { ResumeContent, Theme } from "@/types";
import { BasicsEditor } from "./sections/basics-editor";
import { SummaryEditor } from "./sections/summary-editor";
import { SectionsManager } from "./sections/sections-manager";
import { ThemeCustomizer } from "./theme-customizer";
import { TemplateSelector } from "./template-selector";
import { Palette, FileText, User, Briefcase } from "lucide-react";
import { useState } from "react";

type EditorSidebarProps = {
  content: ResumeContent;
  theme: Theme;
  templateId: string;
  resumeId: string;
  userId: string;
  userPlan: "free" | "pro";
  onUpdateContent: (updates: Partial<ResumeContent>) => void;
  onUpdateTheme: (updates: Partial<Theme>) => void;
  onUpdateTemplate: (templateId: string) => void;
  isSaving: boolean;
  lastSaved: Date | null;
  error: string | null;
};

type TabId = 'content' | 'design';

export function EditorSidebar({
  content,
  theme,
  templateId,
  resumeId,
  userId,
  userPlan,
  onUpdateContent,
  onUpdateTheme,
  onUpdateTemplate,
}: EditorSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabId>('content');

  return (
    <div className="flex h-full flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === 'content'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
          >
            <FileText className="h-4 w-4" />
            Content
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === 'design'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
          >
            <Palette className="h-4 w-4" />
            Design
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto bg-zinc-50 p-6">
        {activeTab === 'content' ? (
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-zinc-100 p-2">
                  <User className="h-4 w-4 text-zinc-700" />
                </div>
                <h2 className="text-base font-semibold text-zinc-900">Personal Information</h2>
              </div>
              <BasicsEditor 
                basics={content.basics} 
                onChange={(basics) => onUpdateContent({ basics })} 
                userId={userId}
                resumeId={resumeId}
              />
            </div>

            {/* Professional Summary */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-zinc-100 p-2">
                  <Briefcase className="h-4 w-4 text-zinc-700" />
                </div>
                <h2 className="text-base font-semibold text-zinc-900">Professional Summary</h2>
              </div>
              <SummaryEditor
                summary={content.summary}
                onChange={(summary) => onUpdateContent({ summary })}
                resumeContent={content}
              />
            </div>

            {/* Sections (Experience, Education, Skills, etc.) */}
            <SectionsManager
              sections={content.sections}
              onChange={(sections) => onUpdateContent({ sections })}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Template Selector */}
            <TemplateSelector 
              templateId={templateId} 
              userPlan={userPlan} 
              onSelect={onUpdateTemplate} 
            />

            {/* Theme Customizer */}
            <ThemeCustomizer theme={theme} onUpdate={onUpdateTheme} />
          </div>
        )}
      </div>
    </div>
  );
}
