"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { getSummary, summaryPath } from "@/lib/summaries";

interface ProgressSummary {
  slug: string;
  exercises: string[];
  updatedAt: string;
}

export function ContinueReading() {
  const [items, setItems] = useState<ProgressSummary[] | null>(null);

  useEffect(() => {
    api<{ summaries: ProgressSummary[] }>("/api/progress")
      .then((data) => setItems(data.summaries))
      .catch(() => setItems([]));
  }, []);

  const known = (items ?? []).flatMap((item) => {
    const summary = getSummary(item.slug);
    return summary ? [{ ...item, summary }] : [];
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Continue following along</CardTitle>
        <CardDescription>Summaries where you&apos;ve started the exercises.</CardDescription>
      </CardHeader>
      <CardContent>
        {items === null ? (
          <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
        ) : known.length === 0 ? (
          <div className="flex flex-col items-start gap-3 text-sm text-muted-foreground">
            You haven&apos;t started any exercises yet.
            <Button asChild size="sm">
              <Link href="/summaries">Browse summaries</Link>
            </Button>
          </div>
        ) : (
          <ul className="divide-y">
            {known.map(({ slug, summary, exercises, updatedAt }) => (
              <li key={slug} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{summary.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {exercises.length} exercise{exercises.length === 1 ? "" : "s"} started · last activity{" "}
                    {new Date(updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={summaryPath(slug)}>
                    Continue
                    <ArrowRightIcon />
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
