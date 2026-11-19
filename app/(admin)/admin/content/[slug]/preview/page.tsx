import type { Metadata } from "next";
import { SummaryPreview } from "@/components/admin/summary-preview";

export const metadata: Metadata = { title: "Preview summary" };

export default async function SummaryPreviewPage({ params }: PageProps<"/admin/content/[slug]/preview">) {
  const { slug } = await params;
  return <SummaryPreview slug={slug} />;
}
