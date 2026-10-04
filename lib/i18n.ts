export const LOCALES = ["en", "hi"] as const;
export type Locale = (typeof LOCALES)[number];

const HI_PREFIX = "/hi";

/** Strips the `/hi` prefix, returning the English path. */
export function stripLocale(path: string) {
  if (path === HI_PREFIX) return "/";
  return path.startsWith(`${HI_PREFIX}/`) ? path.slice(HI_PREFIX.length) : path;
}

export function localeFromPath(path: string): Locale {
  return path === HI_PREFIX || path.startsWith(`${HI_PREFIX}/`) ? "hi" : "en";
}

export function localePath(path: string, locale: Locale) {
  const base = stripLocale(path);
  if (locale === "en") return base;
  return base === "/" ? HI_PREFIX : `${HI_PREFIX}${base}`;
}

/** Paths that have a Hindi version. Auth, dashboard and admin pages are English-only. */
export function isTranslatablePath(path: string) {
  const base = stripLocale(path);
  return base === "/" || base === "/summaries" || base.startsWith("/summaries/");
}
