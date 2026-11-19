"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { ErrorBlock, LoadingBlock, PageBody, formatDateTime } from "@/components/admin/admin-ui";
import { StatusBadge } from "@/components/admin/content-view";
import { adminApi } from "@/lib/admin-api";
import type { SummaryStatus } from "@/lib/admin-types";

function countWords(text: string | null | undefined) {
  if (!text) return 0;
  return text.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}

/**
 * Shows the metadata as it is currently saved on disk. MDX is shown as source: rendering edited MDX
 * would need a module compiled at build time, so the live page is one click away instead.
 */
export function SummaryPreview({ slug }: { slug: string }) {
  const [data, setData] = useState<Awaited<ReturnType<typeof adminApi.summary>> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locale, setLocale] = useState<"en" | "hi">("en");

  useEffect(() => {
    let cancelled = false;
    adminApi
      .summary(slug)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load the preview");
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const localized = useMemo(() => {
    const meta = data?.summary?.meta;
    if (!meta) return null;
    return locale === "hi" && meta.hi ? { ...meta, ...meta.hi } : meta;
  }, [data, locale]);

  const body = data?.summary?.bodies[locale] ?? null;

  return (
    <>
      <AdminTopbar
        title="Preview"
        actions={
          <>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/admin/content/${slug}`}>
                <ArrowLeftIcon />
                Back to editor
              </Link>
            </Button>
            <Button asChild size="sm">
              <a href={`/summaries/${slug}`} target="_blank" rel="noreferrer">
                <ExternalLinkIcon />
                Open live page
              </a>
            </Button>
          </>
        }
      />
      <PageBody>
        {error ? (
          <ErrorBlock message={error} />
        ) : !data ? (
          <LoadingBlock label="Loading preview…" />
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>Saved metadata preview</span>
              <StatusBadge status={data.status as SummaryStatus} />
              {data.archivedAt && <span>Archived {formatDateTime(data.archivedAt)}</span>}
              <div className="ml-auto">
                <Select value={locale} onValueChange={(value) => setLocale(value as "en" | "hi")}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {localized ? (
              <Card>
                <CardContent className="flex flex-col gap-3 pt-4">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{localized.kind}</p>
                  <h1 className="text-2xl font-bold tracking-tight">{localized.title}</h1>
                  <p className="text-sm text-muted-foreground">{localized.description}</p>
                  <p className="text-sm">{localized.intro}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {localized.tags.map((tag) => (
                      <span key={tag} className="rounded-4xl border px-2 py-0.5 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {localized.stats.map((stat, index) => (
                      <div key={index} className="rounded-lg border p-3">
                        <p className="font-semibold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  {(localized.guest || localized.host || localized.show) && (
                    <p className="text-xs text-muted-foreground">
                      {[localized.guest, localized.host && `hosted by ${localized.host}`, localized.show, localized.episode]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <ErrorBlock message="No saved metadata for this summary yet." />
            )}

            <Card>
              <CardContent className="pt-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">
                    Saved MDX ({locale.toUpperCase()}) · {countWords(body).toLocaleString()} words
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Edited MDX appears here once saved. Use “Open live page” for the rendered version.
                  </p>
                </div>
                <pre className="max-h-[36rem] overflow-auto rounded-lg bg-muted p-4 text-[13px] leading-relaxed whitespace-pre-wrap">
                  {body || "This summary has no body file yet."}
                </pre>
              </CardContent>
            </Card>
          </>
        )}
      </PageBody>
    </>
  );
}
