"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { API_URL, api } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

type ProgressData = Record<string, unknown>;

interface ProgressContextValue {
  slug: string;
  /** True once the user is known to be logged in. */
  enabled: boolean;
  loaded: boolean;
  data: ProgressData;
  status: Record<string, SaveStatus>;
  update: (key: string, updater: (prev: unknown) => unknown) => void;
  reset: (key: string) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

const SAVE_DELAY_MS = 600;
const EMPTY: ProgressData = {};
const EMPTY_STATUS: Record<string, SaveStatus> = {};

function progressUrl(slug: string, key: string) {
  return `/api/progress/${encodeURIComponent(slug)}/${encodeURIComponent(key)}`;
}

export function ProgressProvider({ slug, children }: { slug: string; children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  // State is tagged with the user it belongs to, so switching accounts never shows stale answers.
  const [owner, setOwner] = useState<string | null>(null);
  const [rawData, setData] = useState<ProgressData>({});
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [rawStatus, setStatus] = useState<Record<string, SaveStatus>>({});
  const dataRef = useRef<ProgressData>({});
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const isOwner = owner === userId;
  const data = isOwner ? rawData : EMPTY;
  const status = isOwner ? rawStatus : EMPTY_STATUS;
  const loaded = userId !== null && loadedFor === userId;

  const setKeyStatus = useCallback((key: string, value: SaveStatus) => {
    setStatus((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const pending = timers.current;
    pending.forEach(clearTimeout);
    pending.clear();
    dataRef.current = {};
    if (!userId) return;

    api<{ progress: ProgressData }>(`/api/progress/${encodeURIComponent(slug)}`, { redirectOnUnauthorized: false })
      .then(({ progress }) => {
        if (cancelled) return;
        dataRef.current = { ...progress, ...dataRef.current };
        setOwner(userId);
        setData(dataRef.current);
        setStatus({});
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadedFor(userId);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, userId]);

  const save = useCallback(
    async (key: string) => {
      timers.current.delete(key);
      try {
        await api(progressUrl(slug, key), {
          method: "PUT",
          body: { data: dataRef.current[key] ?? null },
          redirectOnUnauthorized: false,
        });
        if (!timers.current.has(key)) setKeyStatus(key, "saved");
      } catch {
        setKeyStatus(key, "error");
      }
    },
    [slug, setKeyStatus],
  );

  // Flush unsaved edits when the tab is hidden or closed.
  useEffect(() => {
    if (!userId) return;
    const pending = timers.current;
    const flush = () => {
      pending.forEach((timer, key) => {
        clearTimeout(timer);
        void fetch(`${API_URL}${progressUrl(slug, key)}`, {
          method: "PUT",
          credentials: "include",
          keepalive: true,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: dataRef.current[key] ?? null }),
        }).catch(() => {});
      });
      pending.clear();
    };
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [slug, userId]);

  const update = useCallback(
    (key: string, updater: (prev: unknown) => unknown) => {
      dataRef.current = { ...dataRef.current, [key]: updater(dataRef.current[key]) };
      setOwner(userId);
      setData(dataRef.current);
      if (!userId) return;
      const existing = timers.current.get(key);
      if (existing) clearTimeout(existing);
      timers.current.set(
        key,
        setTimeout(() => void save(key), SAVE_DELAY_MS),
      );
      setKeyStatus(key, "saving");
    },
    [userId, save, setKeyStatus],
  );

  const reset = useCallback(
    (key: string) => {
      const existing = timers.current.get(key);
      if (existing) clearTimeout(existing);
      timers.current.delete(key);
      const rest = { ...dataRef.current };
      delete rest[key];
      dataRef.current = rest;
      setOwner(userId);
      setData(rest);
      if (!userId) return;
      setKeyStatus(key, "saving");
      api(progressUrl(slug, key), { method: "DELETE", redirectOnUnauthorized: false })
        .then(() => setKeyStatus(key, "saved"))
        .catch(() => setKeyStatus(key, "error"));
    },
    [slug, userId, setKeyStatus],
  );

  const value = useMemo(
    () => ({ slug, enabled: Boolean(userId), loaded, data, status, update, reset }),
    [slug, userId, loaded, data, status, update, reset],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgressContext() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("Exercises must be rendered inside a ProgressProvider");
  return ctx;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Per-exercise state that is saved to the user's account.
 * Stored objects are shallow-merged over `initial`, so new fields get defaults.
 */
export function useExerciseProgress<T>(key: string, initial: T) {
  const { data, update, reset, status } = useProgressContext();
  const stored = data[key];

  let value: T;
  if (stored === undefined) value = initial;
  else if (isPlainObject(initial) && isPlainObject(stored)) value = { ...initial, ...stored } as T;
  else value = stored as T;

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      update(key, (prev) => {
        let current: T;
        if (prev === undefined) current = initial;
        else if (isPlainObject(initial) && isPlainObject(prev)) current = { ...initial, ...prev } as T;
        else current = prev as T;
        return typeof next === "function" ? (next as (p: T) => T)(current) : next;
      });
    },
    [key, update, initial],
  );

  const resetValue = useCallback(() => reset(key), [key, reset]);

  return [value, setValue, resetValue, status[key] ?? "idle"] as const;
}
