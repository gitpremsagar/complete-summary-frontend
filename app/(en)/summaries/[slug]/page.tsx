import type { Metadata } from "next";
import { SummaryView, summaryMetadata } from "@/components/pages/summary-view";
import { summaries } from "@/lib/summaries";

export const dynamicParams = false;

export function generateStaticParams() {
  return summaries.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/summaries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return summaryMetadata(slug, "en");
}

export default async function SummaryPage({ params }: PageProps<"/summaries/[slug]">) {
  const { slug } = await params;
  return <SummaryView slug={slug} locale="en" />;
}
