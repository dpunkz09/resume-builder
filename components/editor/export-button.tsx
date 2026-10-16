"use client";

import { useState } from "react";
import { Download, FileText, FileDown, ChevronDown } from "lucide-react";

type ExportButtonProps = {
  resumeId: string;
};

type ExportFormat = "pdf" | "docx";

export function ExportButton({ resumeId }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    setError(null);
    setShowDropdown(false);

    try {
      const endpoint = format === "pdf" 
        ? `/api/resumes/${resumeId}/export`
        : `/api/resumes/${resumeId}/export/docx`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Export failed' }));
        throw new Error(errorData.error || errorData.details || "Export failed");
      }

      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `resume-${Date.now()}.${format}`; // fallback
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(`Failed to export ${format.toUpperCase()}. Please try again.`);
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-1">
        {/* Main Export Button - PDF by default */}
        <button
          onClick={() => handleExport("pdf")}
          disabled={isExporting}
          className="flex items-center gap-2 rounded-l-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isExporting ? (
            <>
              <Download className="h-4 w-4 animate-bounce" />
              Exporting...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              Export PDF
            </>
          )}
        </button>

        {/* Dropdown Toggle */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={isExporting}
          className="rounded-r-lg bg-blue-600 px-2 py-2 text-white hover:bg-blue-700 disabled:opacity-50 border-l border-blue-500 transition-colors"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-zinc-200 overflow-hidden z-20">
            <button
              onClick={() => handleExport("pdf")}
              disabled={isExporting}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-colors"
            >
              <FileText className="h-4 w-4 text-zinc-500" />
              <div className="text-left">
                <div className="font-medium">Export as PDF</div>
                <div className="text-xs text-zinc-500">High quality document</div>
              </div>
            </button>
            <button
              onClick={() => handleExport("docx")}
              disabled={isExporting}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-colors border-t border-zinc-100"
            >
              <FileDown className="h-4 w-4 text-zinc-500" />
              <div className="text-left">
                <div className="font-medium">Export as DOCX</div>
                <div className="text-xs text-zinc-500">Editable Word document</div>
              </div>
            </button>
          </div>
        </>
      )}

      {error && (
        <p className="absolute top-full mt-2 text-sm text-red-600 whitespace-nowrap">
          {error}
        </p>
      )}
    </div>
  );
}
