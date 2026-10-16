"use client";

import { useState } from "react";
import { createCheckoutSession } from "@/app/actions/billing-actions";
import { Check, Minus } from "lucide-react";

type PricingCardsProps = {
  currentPlan: string;
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2";

export function PricingCards({ currentPlan }: PricingCardsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const handleUpgrade = async (priceId: "monthly" | "yearly") => {
    setIsLoading(true);
    try {
      const result = await createCheckoutSession(priceId);

      if (result.error) {
        alert(result.error);
      } else if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      alert("Failed to start checkout");
    } finally {
      setIsLoading(false);
    }
  };

  const isPro = currentPlan === "pro";

  return (
    <div className="space-y-12">
      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-1">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              billingCycle === "monthly"
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:text-zinc-900"
            } ${focusRing}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              billingCycle === "yearly"
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:text-zinc-900"
            } ${focusRing}`}
          >
            Yearly <span className="ml-1 opacity-80">(Save 17%)</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-8 sm:grid-cols-2">
        {/* Free Plan */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-8">
          <h3 className="text-xl font-semibold tracking-tight text-zinc-900">Free</h3>
          <p className="mt-2 text-zinc-600">Perfect to get started</p>
          <div className="mt-6 flex items-baseline gap-1">
            <span className="text-5xl font-semibold tracking-tight text-zinc-900">$0</span>
            <span className="text-zinc-500">/month</span>
          </div>

          <ul className="mt-8 space-y-4">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 shrink-0 text-zinc-400" aria-hidden="true" />
              <span className="text-zinc-600">1 resume</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 shrink-0 text-zinc-400" aria-hidden="true" />
              <span className="text-zinc-600">2 templates (Classic, ATS)</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 shrink-0 text-zinc-400" aria-hidden="true" />
              <span className="text-zinc-600">PDF export with watermark</span>
            </li>
            <li className="flex items-start gap-3">
              <Minus className="h-5 w-5 shrink-0 text-zinc-300" aria-hidden="true" />
              <span className="text-zinc-400">No AI features</span>
            </li>
          </ul>

          <button
            disabled={currentPlan === "free"}
            className={`mt-8 w-full rounded-lg border border-zinc-300 bg-white px-6 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-50 disabled:opacity-50 ${focusRing}`}
          >
            {currentPlan === "free" ? "Current plan" : "Downgrade"}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="rounded-2xl border-2 border-zinc-900 bg-white p-8">
          <h3 className="text-xl font-semibold tracking-tight text-zinc-900">Pro</h3>
          <p className="mt-2 text-zinc-600">For serious job seekers</p>
          <div className="mt-6 flex items-baseline gap-1">
            <span className="text-5xl font-semibold tracking-tight text-zinc-900">
              ${billingCycle === "monthly" ? "9.99" : "99.99"}
            </span>
            <span className="text-zinc-500">
              /{billingCycle === "monthly" ? "month" : "year"}
            </span>
          </div>
          {billingCycle === "yearly" && (
            <p className="mt-1 text-sm text-zinc-500">Billed annually ($20 saved)</p>
          )}

          <ul className="mt-8 space-y-4">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 shrink-0 text-indigo-600" aria-hidden="true" />
              <span className="text-zinc-900">Unlimited resumes</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 shrink-0 text-indigo-600" aria-hidden="true" />
              <span className="text-zinc-900">All templates (Modern, Minimal + more)</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 shrink-0 text-indigo-600" aria-hidden="true" />
              <span className="text-zinc-900">No watermark on PDFs</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 shrink-0 text-indigo-600" aria-hidden="true" />
              <span className="text-zinc-900">AI features (coming soon)</span>
            </li>
          </ul>

          <button
            onClick={() => handleUpgrade(billingCycle)}
            disabled={isLoading || isPro}
            className={`mt-8 w-full rounded-lg bg-zinc-900 px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 ${focusRing}`}
          >
            {isLoading
              ? "Loading..."
              : isPro
                ? "Current plan"
                : `Upgrade to Pro`}
          </button>
        </div>
      </div>
    </div>
  );
}