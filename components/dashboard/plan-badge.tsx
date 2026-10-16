import { Crown } from "lucide-react";

interface PlanBadgeProps {
  plan: "free" | "pro";
}

export function PlanBadge({ plan }: PlanBadgeProps) {
  if (plan === "pro") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
        <Crown className="h-3 w-3" />
        Pro Plan
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
      Free Plan
    </span>
  );
}