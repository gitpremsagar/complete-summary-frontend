import type { MetadataRoute } from "next";
import { summaries, summaryPath } from "@/lib/summaries";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = summaries.reduce(
    (max, s) => ((s.updatedAt ?? s.publishedAt) > max ? (s.updatedAt ?? s.publishedAt) : max),
    "1970-01-01",
  );

  return [
    { url: SITE_URL, lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/summaries`, lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
    ...summaries.map((s) => ({
      url: `${SITE_URL}${summaryPath(s.slug)}`,
      lastModified: s.updatedAt ?? s.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
