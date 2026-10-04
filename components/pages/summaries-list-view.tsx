import { SummaryCard } from "@/components/summary/summary-card";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { localizeSummary, summaries } from "@/lib/summaries";
import { getSummaryOutline } from "@/lib/summaries.server";

export async function SummariesListView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const all = [...summaries].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const outlines = await Promise.all(all.map((s) => getSummaryOutline(s.slug, locale)));

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 md:py-14">
      <h1 className="text-3xl font-bold tracking-tight">{t.list.title}</h1>
      <p className="mt-2 text-muted-foreground">{t.list.count(all.length)}</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {all.map((summary, i) => (
          <SummaryCard
            key={summary.slug}
            summary={localizeSummary(summary, locale)}
            readingMinutes={outlines[i].readingMinutes}
            locale={locale}
          />
        ))}
      </div>
    </main>
  );
}
