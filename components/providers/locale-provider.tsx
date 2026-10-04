"use client";

import { createContext, useContext, type ReactNode } from "react";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

const LocaleContext = createContext<Locale>("en");

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function useT() {
  return getDictionary(useLocale());
}

/** Picks the content for the current locale from an `{ en, hi }` object. */
export function useLocalized<T>(content: Record<Locale, T>) {
  return content[useLocale()];
}
