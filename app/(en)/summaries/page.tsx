import type { Metadata } from "next";
import { SummariesListView } from "@/components/pages/summaries-list-view";
import { getDictionary } from "@/lib/dictionaries";

const t = getDictionary("en");

export const metadata: Metadata = {
  title: t.list.metaTitle,
  description: t.list.metaDescription,
  alternates: {
    canonical: "/summaries",
    languages: { en: "/summaries", hi: "/hi/summaries", "x-default": "/summaries" },
  },
};

export default function SummariesPage() {
  return <SummariesListView locale="en" />;
}
