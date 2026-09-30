import { ClockIcon } from "lucide-react";
import { YouTubeEmbed } from "@/components/summary/youtube-embed";
import type { SummaryMeta } from "@/lib/summaries";

export function SummaryHero({ summary, readingMinutes }: { summary: SummaryMeta; readingMinutes: number }) {
  return (
    <header className="mb-6 rounded-3xl border bg-linear-to-br from-brand/20 via-card to-brand-2/15 p-6 shadow-sm md:p-8">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        <span className="rounded-full bg-brand px-2.5 py-0.5 text-white">{summary.kind} summary</span>
        <span className="inline-flex items-center gap-1">
          <ClockIcon className="size-3.5" />
          {readingMinutes} min read
        </span>
      </div>
      <h1 className="text-3xl leading-tight font-bold tracking-tight md:text-4xl">{summary.title}</h1>
      <p className="mt-3 text-muted-foreground">
        {summary.guest && (
          <>
            <b className="text-foreground">Guest:</b> {summary.guest}
            {summary.guestBio && <>, {summary.guestBio}</>}
          </>
        )}
        {summary.host && (
          <>
            {" | "}
            <b className="text-foreground">Host:</b> {summary.host}
          </>
        )}
        {summary.show && (
          <>
            {" | "}
            <b className="text-foreground">Show:</b> {summary.show}
            {summary.episode && <>, episode {summary.episode}</>}
          </>
        )}
      </p>
      {summary.youtubeId && (
        <div className="mt-5">
          <YouTubeEmbed id={summary.youtubeId} title={summary.title} />
        </div>
      )}
      <p className="mt-2 text-muted-foreground">{summary.intro}</p>
      {summary.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Topics">
          {summary.tags.map((tag) => (
            <li key={tag} className="rounded-full border bg-muted px-2.5 py-1 text-xs">
              {tag}
            </li>
          ))}
        </ul>
      )}
      {summary.stats.length > 0 && (
        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {summary.stats.map((stat) => (
            <div key={stat.value} className="rounded-2xl border bg-card p-3">
              <dt className="text-lg leading-snug font-bold text-brand">{stat.value}</dt>
              <dd className="mt-1 text-xs text-muted-foreground">{stat.label}</dd>
            </div>
          ))}
        </dl>
      )}
    </header>
  );
}
