"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

type AIUsageStats = {
  todayCount: number;
  limit: number;
  remaining: number;
};

export function AIUsageBadge() {
  const [stats, setStats] = useState<AIUsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/ai/usage");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching AI usage:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats || stats.limit === 0) {
    return null;
  }

  const percentage = (stats.remaining / stats.limit) * 100;
  const isLow = percentage < 20;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
        isLow
          ? "bg-orange-50 text-orange-700 border border-orange-200"
          : "bg-purple-50 text-purple-700 border border-purple-200"
      }`}
    >
      <Sparkles className="w-3.5 h-3.5" />
      <span>
        {stats.remaining} / {stats.limit} AI credits today
      </span>
    </div>
  );
}
