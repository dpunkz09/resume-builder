"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertCircle, Check, Copy, RefreshCw, Sparkles, X } from "lucide-react";
import { AIButton } from "./ai-button";
import { ResumeContent } from "@/types";

type AIResumeAnalyzerProps = {
  content: ResumeContent;
};

/** Styling for each markdown element the AI may return. */
const markdownComponents: Components = {
  h1: ({ children }) => (
    <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3 first:mt-0">{children}</h2>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3 pb-2 border-b border-gray-200 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-gray-900 mt-5 mb-2">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-sm font-semibold text-gray-900 mt-4 mb-1.5">{children}</h4>
  ),
  p: ({ children }) => <p className="mb-3 text-gray-700 leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-purple-600 underline hover:text-purple-800"
    >
      {children}
    </a>
  ),
  ul: ({ className, children }) => (
    <ul
      className={
        className?.includes("contains-task-list")
          ? "mb-3 space-y-1.5"
          : "mb-3 ml-5 list-disc space-y-1.5 text-gray-700 marker:text-purple-400"
      }
    >
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 ml-5 list-decimal space-y-1.5 text-gray-700 marker:text-purple-500 marker:font-medium">
      {children}
    </ol>
  ),
  li: ({ className, children }) => (
    <li
      className={
        className?.includes("task-list-item")
          ? "flex items-start gap-2 text-gray-700"
          : "pl-1 text-gray-700 leading-relaxed [&>ul]:mt-1.5 [&>ol]:mt-1.5 [&>p]:mb-1"
      }
    >
      {children}
    </li>
  ),
  input: ({ type, checked }) =>
    type === "checkbox" ? (
      <input
        type="checkbox"
        checked={checked}
        readOnly
        disabled
        className="mt-1 accent-purple-600"
      />
    ) : null,
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-4 border-purple-300 bg-purple-50/60 px-4 py-2 text-gray-700 rounded-r-md [&>p]:mb-0">
      {children}
    </blockquote>
  ),
  code: ({ className, children }) =>
    className ? (
      <code className={`${className} text-sm`}>{children}</code>
    ) : (
      <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[0.85em] font-mono text-purple-700">
        {children}
      </code>
    ),
  pre: ({ children }) => (
    <pre className="my-3 overflow-x-auto rounded-lg bg-gray-900 p-4 text-gray-100">{children}</pre>
  ),
  hr: () => <hr className="my-6 border-gray-200" />,
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-gray-100">{children}</tbody>,
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-semibold text-gray-900">{children}</th>
  ),
  td: ({ children }) => <td className="px-3 py-2 text-gray-700 align-top">{children}</td>,
};

export function AIResumeAnalyzer({ content }: AIResumeAnalyzerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const runAnalysis = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setAnalysis("");
    setCopied(false);

    try {
      const response = await fetch("/api/ai/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Failed to analyze resume");
        return;
      }

      setAnalysis(data.analysis || "");
      if (!data.analysis) setError("No analysis available");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      console.error("Analysis error:", err);
      setError("Failed to analyze resume. Please try again.");
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }, [content]);

  const handleOpen = () => {
    setIsOpen(true);
    runAnalysis();
  };

  const handleClose = useCallback(() => {
    abortRef.current?.abort();
    setIsOpen(false);
    setLoading(false);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  // Close on Escape + lock background scroll while the dialog is open
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, handleClose]);

  // Cancel any in-flight request on unmount
  useEffect(() => () => abortRef.current?.abort(), []);

  if (!isOpen) {
    return (
      <AIButton onClick={handleOpen} className="text-sm">
        Analyze Resume
      </AIButton>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-analysis-title"
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 id="ai-analysis-title" className="text-lg font-semibold text-gray-900">
              AI Resume Analysis
            </h2>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
              <p className="text-gray-600">Analyzing your resume...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
              <AlertCircle className="w-10 h-10 text-red-500" />
              <p className="text-gray-700 max-w-md">{error}</p>
              <button
                onClick={runAnalysis}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
              >
                <RefreshCw className="w-4 h-4" />
                Try again
              </button>
            </div>
          ) : (
            <>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-5">
                <p className="text-sm text-purple-900 m-0">
                  <strong>AI Analysis:</strong> Review the suggestions below to improve your
                  resume&apos;s impact and effectiveness.
                </p>
              </div>

              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {analysis}
              </ReactMarkdown>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={loading || !analysis}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={runAnalysis}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Re-analyze
            </button>
          </div>
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
