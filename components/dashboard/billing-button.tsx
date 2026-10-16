"use client";

import { useState } from "react";
import { createCustomerPortalSession } from "@/app/actions/billing-actions";
import { useRouter } from "next/navigation";

interface BillingButtonProps {
  userPlan: "free" | "pro";
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2";

export function BillingButton({ userPlan }: BillingButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBillingClick = async () => {
    if (userPlan === "free") {
      router.push("/pricing");
      return;
    }

    setLoading(true);
    try {
      const result = await createCustomerPortalSession();
      if (result.error) {
        alert(result.error);
      } else if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      alert("Failed to open billing portal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBillingClick}
      disabled={loading}
      className={`rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`}
    >
      {loading ? "Loading..." : userPlan === "free" ? "Upgrade" : "Billing"}
    </button>
  );
}