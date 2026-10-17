"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Resume } from "@/db/schema";
import { ResumeContent, ResumeContentSchema, Theme, ThemeSchema } from "@/types";
import { updateResumeContent, updateResumeTemplate } from "@/app/actions/resume-actions";
import { EditorSidebar } from "./editor-sidebar";
import { ResumePreview } from "@/components/preview/resume-preview";
import { useDebounce } from "@/hooks/use-debounce";
import { ArrowLeft, Check, AlertCircle, Loader2, Eye, PanelLeftClose, PanelLeft, GripVertical, Edit3, Smartphone } from "lucide-react";
import Link from "next/link";
import { AIResumeAnalyzer } from "@/components/ai/ai-resume-analyzer";
import { ExportButton } from "./export-button";

type ResumeEditorProps = {
  resume: Resume;
  userPlan: "free" | "pro";
  onContentChange?: (content: ResumeContent) => void;
  currentContent?: ResumeContent;
};

export function ResumeEditor({ resume, userPlan, onContentChange, currentContent: initialCurrentContent }: ResumeEditorProps) {
  const [content, setContent] = useState<ResumeContent>(resume.content as ResumeContent);
  const [theme, setTheme] = useState<Theme>(resume.theme as Theme);
  const [templateId, setTemplateId] = useState<string>(resume.templateId);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(450); // Initial width in pixels
  const [isResizing, setIsResizing] = useState(false);
  
  // Mobile view state: 'edit' or 'preview'
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  // Debounce content changes for autosave
  const debouncedContent = useDebounce(content, 800);
  const debouncedTheme = useDebounce(theme, 800);
  const debouncedTemplateId = useDebounce(templateId, 800);

  // Autosave effect for content
  useEffect(() => {
    const saveContent = async () => {
      if (!debouncedContent) return;

      setIsSaving(true);
      setError(null);

      try {
        const validated = ResumeContentSchema.parse(debouncedContent);
        const result = await updateResumeContent(resume.id, validated);

        if (result.error) {
          setError(result.error);
        } else {
          setLastSaved(new Date());
          setTimeout(() => setLastSaved(null), 3000);
        }
      } catch (_err) {
        setError("Invalid resume data");
      } finally {
        setIsSaving(false);
      }
    };

    saveContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContent, resume.id]);

  // Autosave effect for theme and template
  useEffect(() => {
    const saveTemplate = async () => {
      if (!debouncedTheme || !debouncedTemplateId) return;

      try {
        const validatedTheme = ThemeSchema.parse(debouncedTheme);
        await updateResumeTemplate(resume.id, debouncedTemplateId, validatedTheme);
      } catch (_err) {
        // Silent fail for theme updates
      }
    };

    saveTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTheme, debouncedTemplateId, resume.id]);

  const updateContent = useCallback((updates: Partial<ResumeContent>) => {
    setContent((prev) => ({ ...prev, ...updates }));
  }, []);

  // Notify parent of content changes as a side effect
  useEffect(() => {
    if (onContentChange) {
      onContentChange(content);
    }
  }, [content, onContentChange]);

  const updateTheme = useCallback((updates: Partial<Theme>) => {
    setTheme((prev) => ({ ...prev, ...updates }));
  }, []);

  // Resizable panel handlers - optimized version
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = sidebarWidth;
  }, [sidebarWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current || !sidebarRef.current) return;
      
      // Calculate the new width based on mouse movement
      const deltaX = e.clientX - startXRef.current;
      const newWidth = startWidthRef.current + deltaX;
      
      // Set min and max width constraints
      const containerRect = containerRef.current.getBoundingClientRect();
      const minWidth = 300;
      const maxWidth = containerRect.width - 400;
      
      // Clamp the width
      const clampedWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
      
      // Apply width directly to the sidebar element for smooth dragging
      sidebarRef.current.style.width = `${clampedWidth}px`;
    };

    const handleMouseUp = () => {
      if (isResizing && sidebarRef.current) {
        // Update state with final width on mouse up
        const finalWidth = parseInt(sidebarRef.current.style.width);
        setSidebarWidth(finalWidth);
      }
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  return (
    <div className="flex h-screen flex-col bg-zinc-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-200 bg-white px-3 sm:px-6 py-3 sm:py-4 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 sm:gap-2 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Back</span>
          </Link>
          
          <div className="h-4 sm:h-6 w-px bg-zinc-300 hidden xs:block" />
          
          <h1 className="text-sm sm:text-lg font-semibold text-zinc-900 truncate min-w-0">
            {resume.title}
          </h1>
        </div>

        <div className="flex items-center gap-1 sm:gap-4">
          {/* Save Status - Desktop Only */}
          <div className="hidden lg:flex items-center gap-2 text-sm">
            {isSaving && (
              <span className="flex items-center gap-2 text-zinc-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            )}
            {lastSaved && !isSaving && (
              <span className="flex items-center gap-2 text-emerald-600">
                <Check className="h-4 w-4" />
                Saved
              </span>
            )}
            {error && (
              <span className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                {error}
              </span>
            )}
          </div>

          {/* AI Analyzer - Hidden on small mobile */}
          <div className="hidden sm:block">
            <AIResumeAnalyzer content={content} />
          </div>

          {/* Export Button */}
          <ExportButton resumeId={resume.id} />

          {/* Toggle Sidebar Button - Desktop Only */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex rounded-lg p-2 text-zinc-700 hover:bg-zinc-100 transition-colors"
            title={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
          >
            {sidebarCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Save Status - Mobile (below header) */}
      <div className="lg:hidden px-3 py-2 bg-zinc-50 border-b border-zinc-100 text-xs">
        {isSaving && (
          <span className="flex items-center gap-2 text-zinc-600">
            <Loader2 className="h-3 w-3 animate-spin" />
            Saving...
          </span>
        )}
        {lastSaved && !isSaving && (
          <span className="flex items-center gap-2 text-emerald-600">
            <Check className="h-3 w-3" />
            Saved just now
          </span>
        )}
        {error && (
          <span className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-3 w-3" />
            {error}
          </span>
        )}
      </div>

      {/* Main Content Area */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden relative">
        {/* Left: Editor Sidebar - Desktop */}
        <aside
          ref={sidebarRef}
          style={{ width: `${sidebarWidth}px` }}
          className={`${
            sidebarCollapsed ? 'w-0' : ''
          } overflow-hidden bg-white flex-shrink-0 ${sidebarCollapsed ? 'transition-all duration-300' : ''} hidden lg:block`}
        >
          <div className="h-full overflow-y-auto">
            <EditorSidebar
              content={content}
              theme={theme}
              templateId={templateId}
              resumeId={resume.id}
              userId={resume.userId}
              userPlan={userPlan}
              onUpdateContent={updateContent}
              onUpdateTheme={updateTheme}
              onUpdateTemplate={setTemplateId}
              isSaving={isSaving}
              lastSaved={lastSaved}
              error={error}
            />
          </div>
        </aside>

        {/* Resizable Divider - Desktop Only */}
        {!sidebarCollapsed && (
          <div
            onMouseDown={handleMouseDown}
            className="group relative w-1 cursor-col-resize bg-zinc-200 hover:bg-zinc-400 transition-colors items-center justify-center flex-shrink-0 hidden lg:flex"
          >
            <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
              <div className="rounded-full bg-zinc-300 p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                <GripVertical className="h-4 w-4 text-zinc-600" />
              </div>
            </div>
          </div>
        )}

        {/* Mobile: Conditional View */}
        <div className="lg:hidden flex-1 overflow-hidden bg-zinc-50 flex flex-col">
          {mobileView === 'edit' ? (
            <div className="flex-1 overflow-y-auto pb-16">
              <EditorSidebar
                content={content}
                theme={theme}
                templateId={templateId}
                resumeId={resume.id}
                userId={resume.userId}
                userPlan={userPlan}
                onUpdateContent={updateContent}
                onUpdateTheme={updateTheme}
                onUpdateTemplate={setTemplateId}
                isSaving={isSaving}
                lastSaved={lastSaved}
                error={error}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pb-16 bg-zinc-100">
              <div className="w-full max-w-4xl mx-auto p-4">
                {/* Mobile preview container with proper scaling */}
                <div className="bg-white shadow-lg mx-auto" style={{ 
                  width: '100%',
                  maxWidth: '210mm', // A4 width
                  aspectRatio: '210 / 297' // A4 ratio
                }}>
                  <div className="w-full h-full scale-[0.95] origin-top-left">
                    <ResumePreview content={content} theme={theme} templateId={templateId} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Mobile View Toggle Tabs - Fixed at Bottom */}
          <div className="fixed bottom-0 left-0 right-0 flex border-t border-zinc-200 bg-white shadow-lg z-50">
            <button
              onClick={() => setMobileView('edit')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
                mobileView === 'edit'
                  ? 'text-zinc-900 border-t-2 border-zinc-900'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Edit3 className="h-5 w-5" />
              Edit
            </button>
            <button
              onClick={() => setMobileView('preview')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
                mobileView === 'preview'
                  ? 'text-zinc-900 border-t-2 border-zinc-900'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Eye className="h-5 w-5" />
              Preview
            </button>
          </div>
        </div>

        {/* Right: Preview Panel - Desktop Only */}
        <main className="hidden lg:block flex-1 overflow-hidden bg-zinc-100 min-w-0">
          <div className="flex h-full flex-col">
            {/* Preview Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                <Eye className="h-4 w-4" />
                Preview
              </div>
              <div className="text-xs text-zinc-500">
                Live preview • Updates automatically
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <ResumePreview content={content} theme={theme} templateId={templateId} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
