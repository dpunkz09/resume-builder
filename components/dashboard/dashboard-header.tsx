"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { PlanBadge } from "./plan-badge";
import { BillingButton } from "./billing-button";
import { AIUsageBadge } from "@/components/ai/ai-usage-badge";
import { BRAND } from "@/components/landing/brand";
import Link from "next/link";
import { FileText, User } from "lucide-react";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2";

export function DashboardHeader({
  userName,
  userPlan = "free",
}: {
  userName: string;
  userPlan?: "free" | "pro";
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className={`flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-70 ${focusRing}`}
          >
            <div className="rounded-lg bg-zinc-900 p-2">
              <FileText className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold text-zinc-900">{BRAND.name}</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors ${focusRing} rounded-md px-1`}
            >
              Resumes
            </Link>
            <Link
              href="/pricing"
              className={`text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors ${focusRing} rounded-md px-1`}
            >
              Pricing
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3 mr-2">
             <PlanBadge plan={userPlan} />
             <AIUsageBadge />
          </div>
          
          <BillingButton userPlan={userPlan} />
          
          <div className="h-8 w-px bg-zinc-200" />
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-700">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100">
                <User className="h-4 w-4 text-zinc-600" />
              </div>
              <span className="font-medium">{userName}</span>
            </div>
            <button
              onClick={handleSignOut}
              className={`rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors ${focusRing}`}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}