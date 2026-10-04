import type { Metadata } from "next";
import { SummaryView, summaryMetadata } from "@/components/pages/summary-view";
import { summaries } from "@/lib/summaries";

export const dynamicParams = false;

export function generateStaticParams() {
  return summaries.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/hi/summaries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return summaryMetadata(slug, "hi");
}

export default async function HindiSummaryPage({ params }: PageProps<"/hi/summaries/[slug]">) {
  const { slug } = await params;
  return <SummaryView slug={slug} locale="hi" />;
}
