"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

type UpgradePromptProps = {
  title: string;
  description: string;
  feature: string;
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2";

export function UpgradePrompt({ title, description, feature }: UpgradePromptProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-2">
             <Sparkles className="h-5 w-5 text-indigo-600" aria-hidden="true" />
             <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
          </div>
          <p className="mt-2 leading-relaxed text-zinc-600">{description}</p>
          <p className="mt-4 text-sm text-zinc-500">
             <span className="font-medium text-zinc-900">Pro feature:</span> {feature}
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href="/pricing"
            className={`inline-flex w-full justify-center rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 sm:w-auto ${focusRing}`}
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </div>
  );
}