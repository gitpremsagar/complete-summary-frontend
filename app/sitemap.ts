import type { MetadataRoute } from "next";
import { LOCALES, localePath, type Locale } from "@/lib/i18n";
import { summaries, summaryPath } from "@/lib/summaries";
import { SITE_URL } from "@/lib/site";

function absolute(path: string, locale: Locale) {
  const localized = localePath(path, locale);
  return localized === "/" ? SITE_URL : `${SITE_URL}${localized}`;
}

function alternates(path: string) {
  return { languages: Object.fromEntries(LOCALES.map((locale) => [locale, absolute(path, locale)])) };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = summaries.reduce(
    (max, s) => ((s.updatedAt ?? s.publishedAt) > max ? (s.updatedAt ?? s.publishedAt) : max),
    "1970-01-01",
  );

  return LOCALES.flatMap((locale) => [
    {
      url: absolute("/", locale),
      lastModified: latest,
      changeFrequency: "weekly" as const,
      priority: 1,
      alternates: alternates("/"),
    },
    {
      url: absolute("/summaries", locale),
      lastModified: latest,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: alternates("/summaries"),
    },
    ...summaries.map((s) => ({
      url: absolute(summaryPath(s.slug), locale),
      lastModified: s.updatedAt ?? s.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: alternates(summaryPath(s.slug)),
    })),
  ]);
}
