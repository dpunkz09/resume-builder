"use client";

import { templates, TemplateId } from "@/lib/templates";
import { Check, Lock, Sparkles } from "lucide-react";

type TemplateSelectorProps = {
  templateId: string;
  userPlan: "free" | "pro";
  onSelect: (templateId: string) => void;
};

// Free plan templates
const FREE_TEMPLATES = ["professional", "classic", "ats"];

export function TemplateSelector({ templateId, userPlan, onSelect }: TemplateSelectorProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-900">Choose Template</h2>
        {userPlan === "pro" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">
            <Sparkles className="h-3 w-3" />
            Pro
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        {Object.values(templates).map((template) => {
          const canAccess = userPlan === "pro" || FREE_TEMPLATES.includes(template.id);
          const isSelected = templateId === template.id;

          return (
            <button
              key={template.id}
              onClick={() => canAccess && onSelect(template.id)}
              disabled={!canAccess}
              className={`relative w-full rounded-lg border-2 p-4 text-left transition-all ${
                isSelected
                  ? "border-zinc-900 bg-zinc-50 shadow-sm"
                  : canAccess
                    ? "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                    : "border-zinc-200 bg-zinc-50/50 opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-zinc-900 text-sm">{template.name}</span>
                    {template.isPro && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                        <Sparkles className="h-2.5 w-2.5" />
                        Pro
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">{template.description}</p>
                </div>
                
                {isSelected && canAccess && (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-900">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
                
                {!canAccess && (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                    <Lock className="h-4 w-4 text-zinc-400" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {userPlan === "free" && (
        <div className="mt-4 rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-800 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-white/10 p-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white mb-1">Unlock All Templates</p>
              <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                Upgrade to Pro to access Modern and Minimal templates with advanced styling options.
              </p>
              <a
                href="/pricing"
                className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors"
              >
                Upgrade Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
