import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { summaryPath, type SummaryMeta } from "@/lib/summaries";

export function SummaryCard({
  summary,
  readingMinutes,
  locale = "en",
}: {
  summary: SummaryMeta;
  readingMinutes: number;
  locale?: Locale;
}) {
  const t = getDictionary(locale);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      {summary.youtubeId && (
        <div className="relative aspect-video overflow-hidden border-b bg-muted">
          <Image
            src={`https://i.ytimg.com/vi/${summary.youtubeId}/hqdefault.jpg`}
            alt={`${t.card.thumbnail}: ${summary.title}`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-brand/15 px-2 py-0.5 font-medium text-brand">
            {t.kind[summary.kind] ?? summary.kind}
          </span>
          {summary.show && (
            <span>
              {summary.show}
              {summary.episode && ` · ${summary.episode}`}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <ClockIcon className="size-3" />
            {readingMinutes} {t.card.min}
          </span>
        </div>
        <h3 className="text-lg leading-snug font-semibold">
          <Link href={summaryPath(summary.slug, locale)} className="after:absolute after:inset-0">
            {summary.title}
          </Link>
        </h3>
        {summary.guest && (
          <p className="mt-1 text-sm text-muted-foreground">
            {locale === "hi" ? `${summary.guest} ${t.card.with}` : `${t.card.with} ${summary.guest}`}
          </p>
        )}
        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{summary.description}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {summary.tags.slice(0, 5).map((tag) => (
            <li key={tag} className="rounded-full border px-2 py-0.5 text-xs">
              {tag}
            </li>
          ))}
        </ul>
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-brand">
          {t.card.read}
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
