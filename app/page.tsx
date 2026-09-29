import Link from "next/link";
import { BookOpenTextIcon, ListChecksIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SummaryCard } from "@/components/summary/summary-card";
import { summaries } from "@/lib/summaries";
import { getSummaryOutline } from "@/lib/summaries.server";

const FEATURES = [
  {
    icon: BookOpenTextIcon,
    title: "The whole conversation",
    text: "Every section, in the order it happened. Nothing important is left out.",
  },
  {
    icon: ListChecksIcon,
    title: "Exercises you can do",
    text: "Builders, tests and checklists that turn ideas into action. Log in to save your progress.",
  },
  {
    icon: SearchIcon,
    title: "Easy to scan and search",
    text: "Table of contents, key takeaways, studies and instant in-page search.",
  },
];

export default async function Home() {
  const latest = [...summaries].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const outlines = await Promise.all(latest.map((s) => getSummaryOutline(s.slug)));

  return (
    <main className="flex-1">
      <section className="border-b bg-linear-to-b from-brand/10 to-transparent">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-4 py-16 text-center md:py-24">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Complete summaries of the podcasts, audiobooks and videos worth your time
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Not a few bullet points. A complete, section-by-section summary of the whole thing, with interactive
            exercises so you can actually apply what you learn.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/summaries">Browse summaries</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/register">Create a free account</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border p-5">
              <Icon className="size-5 text-brand" />
              <h2 className="mt-3 font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Latest summaries</h2>
          <Link href="/summaries" className="text-sm font-medium text-brand hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {latest.slice(0, 6).map((summary, i) => (
            <SummaryCard key={summary.slug} summary={summary} readingMinutes={outlines[i].readingMinutes} />
          ))}
        </div>
      </section>
    </main>
  );
}
