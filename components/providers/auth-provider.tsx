"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";
import type { LoginInput, RegisterInput } from "@/lib/validations/auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => Promise<void>;
  reload: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchCurrentUser(): Promise<User | null> {
  try {
    const data = await api<{ user: User }>("/api/auth/me", { redirectOnUnauthorized: false });
    return data.user;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    setUser(await fetchCurrentUser());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchCurrentUser().then((current) => {
      if (cancelled) return;
      setUser(current);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const data = await api<{ user: User }>("/api/auth/login", { method: "POST", body: input });
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async ({ name, email, password }: RegisterInput) => {
    const data = await api<{ user: User }>("/api/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      router.replace("/login");
      router.refresh();
    }
  }, [router]);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout, reload }),
    [user, isLoading, login, register, logout, reload],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
