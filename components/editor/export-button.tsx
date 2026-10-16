"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

type ExportButtonProps = {
  resumeId: string;
};

export function ExportButton({ resumeId }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      const endpoint = `/api/resumes/${resumeId}/export`;
      const response = await fetch(endpoint);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Export failed' }));
        throw new Error(errorData.error || errorData.details || "Export failed");
      }

      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `resume-${Date.now()}.pdf`; // fallback
      
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
      setError("Failed to export PDF. Please try again.");
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isExporting ? (
          <>
            <FileText className="h-4 w-4 animate-pulse" />
            Exporting...
          </>
        ) : (
          <>
            <FileText className="h-4 w-4" />
            Export PDF
          </>
        )}
      </button>

      {error && (
        <p className="absolute top-full mt-2 text-sm text-red-600 whitespace-nowrap">
          {error}
        </p>
      )}
    </div>
  );
}
