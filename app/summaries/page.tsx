import type { Metadata } from "next";
import { SummaryCard } from "@/components/summary/summary-card";
import { summaries } from "@/lib/summaries";
import { getSummaryOutline } from "@/lib/summaries.server";

export const metadata: Metadata = {
  title: "All summaries",
  description: "Browse complete, section-by-section summaries of podcasts, audiobooks and YouTube videos.",
  alternates: { canonical: "/summaries" },
};

export default async function SummariesPage() {
  const all = [...summaries].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const outlines = await Promise.all(all.map((s) => getSummaryOutline(s.slug)));

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 md:py-14">
      <h1 className="text-3xl font-bold tracking-tight">All summaries</h1>
      <p className="mt-2 text-muted-foreground">
        {all.length} complete {all.length === 1 ? "summary" : "summaries"} so far. New ones are added regularly.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {all.map((summary, i) => (
          <SummaryCard key={summary.slug} summary={summary} readingMinutes={outlines[i].readingMinutes} />
        ))}
      </div>
    </main>
  );
}
