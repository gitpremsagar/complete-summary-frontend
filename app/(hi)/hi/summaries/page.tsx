import type { Metadata } from "next";
import { SummariesListView } from "@/components/pages/summaries-list-view";
import { getDictionary } from "@/lib/dictionaries";

const t = getDictionary("hi");

export const metadata: Metadata = {
  title: t.list.metaTitle,
  description: t.list.metaDescription,
  alternates: {
    canonical: "/hi/summaries",
    languages: { en: "/summaries", hi: "/hi/summaries", "x-default": "/summaries" },
  },
};

export default function HindiSummariesPage() {
  return <SummariesListView locale="hi" />;
}
