import Link from "next/link";
import { BookOpenTextIcon, ListChecksIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SummaryCard } from "@/components/summary/summary-card";
import { getDictionary } from "@/lib/dictionaries";
import { localePath, type Locale } from "@/lib/i18n";
import { localizeSummary, summaries } from "@/lib/summaries";
import { getSummaryOutline } from "@/lib/summaries.server";

const FEATURE_ICONS = [BookOpenTextIcon, ListChecksIcon, SearchIcon];

export async function HomeView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const latest = [...summaries].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const outlines = await Promise.all(latest.map((s) => getSummaryOutline(s.slug, locale)));
  const summariesHref = localePath("/summaries", locale);

  return (
    <main className="flex-1">
      <section className="border-b bg-linear-to-b from-brand/10 to-transparent">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-4 py-16 text-center md:py-24">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">{t.home.title}</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">{t.home.subtitle}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href={summariesHref}>{t.home.browse}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={locale === "en" ? "/register" : `/register?next=${encodeURIComponent(localePath("/", locale))}`}>
                {t.home.register}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {t.home.features.map(({ title, text }, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <div key={title} className="rounded-2xl border p-5">
                <Icon className="size-5 text-brand" />
                <h2 className="mt-3 font-semibold">{title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">{t.home.latest}</h2>
          <Link href={summariesHref} className="text-sm font-medium text-brand hover:underline">
            {t.home.viewAll}
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {latest.slice(0, 6).map((summary, i) => (
            <SummaryCard
              key={summary.slug}
              summary={localizeSummary(summary, locale)}
              readingMinutes={outlines[i].readingMinutes}
              locale={locale}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
