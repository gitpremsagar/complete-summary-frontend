import type { Metadata } from "next";
import { SummaryEditor } from "@/components/admin/summary-editor";

export const metadata: Metadata = { title: "Edit summary" };

export default async function EditSummaryPage({ params }: PageProps<"/admin/content/[slug]">) {
  const { slug } = await params;
  return <SummaryEditor mode="edit" slug={slug} />;
}
