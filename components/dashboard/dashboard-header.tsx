"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { PlanBadge } from "./plan-badge";
import { BillingButton } from "./billing-button";
import { AIUsageBadge } from "@/components/ai/ai-usage-badge";
import { BRAND } from "@/components/landing/brand";
import Link from "next/link";
import { FileText, User, Menu, X } from "lucide-react";
import { useState } from "react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 md:gap-8">
          <Link
            href="/"
            className={`flex items-center gap-2 md:gap-2.5 rounded-lg transition-opacity hover:opacity-70 ${focusRing}`}
          >
            <div className="rounded-lg bg-zinc-900 p-1.5 md:p-2">
              <FileText className="h-4 w-4 md:h-5 md:w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base md:text-lg font-bold text-zinc-900 hidden xs:inline">{BRAND.shortName || BRAND.name}</span>
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
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors ${focusRing}`}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white">
          <div className="px-4 py-4 space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
                <User className="h-5 w-5 text-zinc-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900 truncate">{userName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <PlanBadge plan={userPlan} />
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors ${focusRing} rounded-md px-3 py-2 hover:bg-zinc-50`}
              >
                Resumes
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors ${focusRing} rounded-md px-3 py-2 hover:bg-zinc-50`}
              >
                Pricing
              </Link>
            </nav>

            {/* Actions */}
            <div className="pt-3 border-t border-zinc-100 space-y-2">
              <div className="mb-2">
                <AIUsageBadge />
              </div>
              <BillingButton userPlan={userPlan} />
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
                className={`w-full rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors text-left ${focusRing}`}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}