import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgressProvider } from "@/components/summary/progress-provider";
import { SummaryHero } from "@/components/summary/summary-hero";
import { SummaryShell } from "@/components/summary/summary-shell";
import { getSummary, summaries, summaryPath } from "@/lib/summaries";
import { getSummaryOutline } from "@/lib/summaries.server";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "@/components/summary/summary.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return summaries.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/summaries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const summary = getSummary(slug);
  if (!summary) return {};

  const title = `${summary.title}: complete summary`;
  const url = summaryPath(slug);
  return {
    title,
    description: summary.description,
    keywords: summary.tags,
    alternates: { canonical: url },
    authors: [{ name: SITE_NAME }],
    openGraph: {
      type: "article",
      url,
      title,
      description: summary.description,
      siteName: SITE_NAME,
      publishedTime: summary.publishedAt,
      modifiedTime: summary.updatedAt ?? summary.publishedAt,
      tags: summary.tags,
    },
    twitter: { card: "summary_large_image", title, description: summary.description },
  };
}

export default async function SummaryPage({ params }: PageProps<"/summaries/[slug]">) {
  const { slug } = await params;
  const summary = getSummary(slug);
  if (!summary) notFound();

  const [{ default: Content }, outline] = await Promise.all([
    import(`@/content/summaries/${slug}.mdx`),
    getSummaryOutline(slug),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: summary.title,
    description: summary.description,
    url: `${SITE_URL}${summaryPath(slug)}`,
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
          hero={<SummaryHero summary={summary} readingMinutes={outline.readingMinutes} />}
        >
          <Content />
        </SummaryShell>
      </ProgressProvider>
    </main>
  );
}
