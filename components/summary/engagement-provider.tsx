"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import {
  EMPTY_STATS,
  fetchEngagement,
  recordView,
  setReaction,
  type EngagementStats,
  type Reaction,
} from "@/lib/engagement";

interface EngagementContextValue {
  slug: string;
  loaded: boolean;
  stats: EngagementStats;
  myReaction: Reaction | null;
  /** Toggles the given reaction. Resolves to false if saving failed. */
  react: (type: Reaction) => Promise<boolean>;
  adjustComments: (delta: number) => void;
}

const EngagementContext = createContext<EngagementContextValue | null>(null);

function applyReaction(stats: EngagementStats, from: Reaction | null, to: Reaction | null): EngagementStats {
  const next = { ...stats };
  if (from === "LIKE") next.likes--;
  if (from === "DISLIKE") next.dislikes--;
  if (to === "LIKE") next.likes++;
  if (to === "DISLIKE") next.dislikes++;
  return next;
}

export function EngagementProvider({ slug, children }: { slug: string; children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const userId = user?.id ?? null;
  const [stats, setStats] = useState<EngagementStats>(EMPTY_STATS);
  const [myReaction, setMyReaction] = useState<Reaction | null>(null);
  const [loaded, setLoaded] = useState(false);
  const viewRef = useRef<{ slug: string; done: Promise<unknown> } | null>(null);
  const reactionRef = useRef<Reaction | null>(null);

  useEffect(() => {
    if (viewRef.current?.slug === slug) return;
    viewRef.current = { slug, done: recordView(slug).catch(() => {}) };
  }, [slug]);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    void (viewRef.current?.done ?? Promise.resolve())
      .then(() => fetchEngagement(slug))
      .then((res) => {
        if (cancelled) return;
        setStats(res.stats);
        setMyReaction(res.myReaction);
        reactionRef.current = res.myReaction;
        setLoaded(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug, userId, authLoading]);

  const react = useCallback(
    async (type: Reaction) => {
      const previous = reactionRef.current;
      const next = previous === type ? null : type;
      reactionRef.current = next;
      setMyReaction(next);
      setStats((s) => applyReaction(s, previous, next));
      try {
        const res = await setReaction(slug, next);
        if (reactionRef.current === next) {
          setStats(res.stats);
          setMyReaction(res.myReaction);
        }
        return true;
      } catch {
        if (reactionRef.current === next) {
          reactionRef.current = previous;
          setMyReaction(previous);
          setStats((s) => applyReaction(s, next, previous));
        }
        return false;
      }
    },
    [slug],
  );

  const adjustComments = useCallback((delta: number) => {
    setStats((s) => ({ ...s, comments: Math.max(0, s.comments + delta) }));
  }, []);

  const value = useMemo(
    () => ({ slug, loaded, stats, myReaction, react, adjustComments }),
    [slug, loaded, stats, myReaction, react, adjustComments],
  );

  return <EngagementContext.Provider value={value}>{children}</EngagementContext.Provider>;
}

export function useEngagement() {
  const ctx = useContext(EngagementContext);
  if (!ctx) throw new Error("useEngagement must be used within an EngagementProvider");
  return ctx;
}
