"use client";

import { EyeIcon, MessageCircleIcon, ThumbsDownIcon, ThumbsUpIcon, type LucideIcon } from "lucide-react";
import { useLocale, useT } from "@/components/providers/locale-provider";
import { useSummaryStats } from "@/components/summary/engagement-stats-provider";
import { formatCount } from "@/lib/engagement";
import { cn } from "@/lib/utils";

export function CardStats({ slug }: { slug: string }) {
  const t = useT().engagement;
  const locale = useLocale();
  const stats = useSummaryStats(slug);

  const items: { icon: LucideIcon; label: string; value: number | undefined }[] = [
    { icon: EyeIcon, label: t.reads, value: stats?.views },
    { icon: ThumbsUpIcon, label: t.likes, value: stats?.likes },
    { icon: ThumbsDownIcon, label: t.dislikes, value: stats?.dislikes },
    { icon: MessageCircleIcon, label: t.comments, value: stats?.comments },
  ];

  return (
    <ul className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
      {items.map(({ icon: Icon, label, value }) => (
        <li key={label} className="inline-flex items-center gap-1" title={label}>
          <Icon className="size-3.5" aria-hidden="true" />
          <span className={cn("tabular-nums", value === undefined && "animate-pulse")}>
            {value === undefined ? "–" : formatCount(value, locale)}
          </span>
          <span className="sr-only">{label}</span>
        </li>
      ))}
    </ul>
  );
}
