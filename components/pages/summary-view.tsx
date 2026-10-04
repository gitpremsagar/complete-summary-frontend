import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgressProvider } from "@/components/summary/progress-provider";
import { SummaryHero } from "@/components/summary/summary-hero";
import { SummaryShell } from "@/components/summary/summary-shell";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { getSummary, localizeSummary, summaryPath } from "@/lib/summaries";
import { getSummaryOutline } from "@/lib/summaries.server";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "@/components/summary/summary.css";

export function summaryMetadata(slug: string, locale: Locale): Metadata {
  const base = getSummary(slug);
  if (!base) return {};
  const summary = localizeSummary(base, locale);

  const title = `${summary.title}: ${getDictionary(locale).hero.metaSuffix}`;
  const url = summaryPath(slug, locale);
  return {
    title,
    description: summary.description,
    keywords: summary.tags,
    alternates: {
      canonical: url,
      languages: { en: summaryPath(slug, "en"), hi: summaryPath(slug, "hi"), "x-default": summaryPath(slug, "en") },
    },
    authors: [{ name: SITE_NAME }],
    openGraph: {
      type: "article",
      url,
      title,
      description: summary.description,
      siteName: SITE_NAME,
      locale: locale === "hi" ? "hi_IN" : "en_US",
      publishedTime: summary.publishedAt,
      modifiedTime: summary.updatedAt ?? summary.publishedAt,
      tags: summary.tags,
    },
    twitter: { card: "summary_large_image", title, description: summary.description },
  };
}

export async function SummaryView({ slug, locale }: { slug: string; locale: Locale }) {
  const base = getSummary(slug);
  if (!base) notFound();
  const summary = localizeSummary(base, locale);

  const [{ default: Content }, outline] = await Promise.all([
    locale === "hi" ? import(`@/content/summaries/hi/${slug}.mdx`) : import(`@/content/summaries/${slug}.mdx`),
    getSummaryOutline(slug, locale),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: summary.title,
    description: summary.description,
    inLanguage: locale,
    url: `${SITE_URL}${summaryPath(slug, locale)}`,
    datePublished: summary.publishedAt,
    dateModified: summary.updatedAt ?? summary.publishedAt,
    keywords: summary.tags.join(", "),
    wordCount: outline.wordCount,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    about: [
      summary.guest && { "@type": "Person", name: summary.guest },
      summary.show && {
        "@type": summary.kind === "Podcast" ? "PodcastEpisode" : "CreativeWork",
        name: summary.title,
        ...(summary.episode ? { episodeNumber: summary.episode } : {}),
        ...(summary.sourceUrl ? { url: summary.sourceUrl } : {}),
        ...(summary.show ? { partOfSeries: { "@type": "CreativeWorkSeries", name: summary.show } } : {}),
      },
    ].filter(Boolean),
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ProgressProvider slug={slug}>
        <SummaryShell
          sections={outline.sections}
          searchExamples={summary.searchExamples ?? summary.tags.slice(0, 3)}
          hero={<SummaryHero summary={summary} readingMinutes={outline.readingMinutes} locale={locale} />}
        >
          <Content />
        </SummaryShell>
      </ProgressProvider>
    </main>
  );
}
