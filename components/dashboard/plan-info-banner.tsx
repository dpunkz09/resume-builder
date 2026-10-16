"use client";

import Link from "next/link";
import { Sparkles, Crown, ArrowRight } from "lucide-react";

interface PlanInfoBannerProps {
  userPlan: "free" | "pro";
  resumeCount: number;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2";

export function PlanInfoBanner({ userPlan, resumeCount }: PlanInfoBannerProps) {
  if (userPlan === "pro") {
    return null; 
  }

  const isAtLimit = resumeCount >= 1;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-900/10 bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 shadow-xl">
      {/* Decorative elements */}
      <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
      
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-white/10 p-2">
              <Crown className="h-5 w-5 text-amber-400" />
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              Free Plan
            </span>
          </div>
          
          <h3 className="text-2xl font-bold text-white">
            {isAtLimit ? "You've reached your limit" : "Upgrade to unlock more"}
          </h3>
          
          <p className="text-base leading-relaxed text-zinc-300 max-w-2xl">
            {isAtLimit ? (
              <>
                Your free plan includes 1 resume. Upgrade to <span className="font-semibold text-white">Pro</span> for unlimited resumes, premium templates, AI-powered features, and watermark-free PDFs.
              </>
            ) : (
              <>
                You have <span className="font-semibold text-white">{1 - resumeCount}</span> resume{1 - resumeCount > 1 ? "s" : ""} remaining. Upgrade to <span className="font-semibold text-white">Pro</span> for unlimited resumes, all templates, and AI-powered features.
              </>
            )}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>AI-powered suggestions</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Premium templates</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>No watermarks</span>
            </div>
          </div>
        </div>
        
        <div className="shrink-0">
          <Link
            href="/pricing"
            className={`inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-zinc-900 shadow-lg transition-all hover:bg-zinc-50 hover:shadow-xl hover:scale-105 ${focusRing}`}
          >
            Upgrade to Pro
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}