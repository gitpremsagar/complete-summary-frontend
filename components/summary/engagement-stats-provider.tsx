"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchStats, type EngagementStats } from "@/lib/engagement";

const StatsContext = createContext<Record<string, EngagementStats> | null>(null);

/** Fetches engagement counts for a list of summaries in a single request. */
export function EngagementStatsProvider({ slugs, children }: { slugs: string[]; children: ReactNode }) {
  const [stats, setStats] = useState<Record<string, EngagementStats> | null>(null);
  const key = slugs.join(",");

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    fetchStats(key.split(","))
      .then((res) => {
        if (!cancelled) setStats(res.stats);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [key]);

  return <StatsContext.Provider value={stats}>{children}</StatsContext.Provider>;
}

/** Returns `undefined` while loading or when rendered outside a provider. */
export function useSummaryStats(slug: string) {
  return useContext(StatsContext)?.[slug];
}
