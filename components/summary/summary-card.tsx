import Link from "next/link";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import { summaryPath, type SummaryMeta } from "@/lib/summaries";

export function SummaryCard({ summary, readingMinutes }: { summary: SummaryMeta; readingMinutes: number }) {
  return (
    <article className="group relative flex flex-col rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-full bg-brand/15 px-2 py-0.5 font-medium text-brand">{summary.kind}</span>
        {summary.show && (
          <span>
            {summary.show}
            {summary.episode && ` · ${summary.episode}`}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <ClockIcon className="size-3" />
          {readingMinutes} min
        </span>
      </div>
      <h3 className="text-lg leading-snug font-semibold">
        <Link href={summaryPath(summary.slug)} className="after:absolute after:inset-0">
          {summary.title}
        </Link>
      </h3>
      {summary.guest && <p className="mt-1 text-sm text-muted-foreground">with {summary.guest}</p>}
      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{summary.description}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {summary.tags.slice(0, 5).map((tag) => (
          <li key={tag} className="rounded-full border px-2 py-0.5 text-xs">
            {tag}
          </li>
        ))}
      </ul>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
        Read the summary
        <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </article>
  );
}
