"use client";

import { Sparkles } from "lucide-react";

type AIButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function AIButton({
  onClick,
  disabled = false,
  loading = false,
  className = "",
  children = "Improve with AI",
}: AIButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
      {children}
    </button>
  );
}
