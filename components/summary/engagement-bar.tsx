"use client";

import { usePathname, useRouter } from "next/navigation";
import { EyeIcon, MessageCircleIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale, useT } from "@/components/providers/locale-provider";
import { useEngagement } from "@/components/summary/engagement-provider";
import { formatCount, type Reaction } from "@/lib/engagement";
import { cn } from "@/lib/utils";

export function EngagementBar() {
  const t = useT().engagement;
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { loaded, stats, myReaction, react } = useEngagement();

  const count = (n: number) => (loaded ? formatCount(n, locale) : "–");

  async function onReact(type: Reaction) {
    if (!user) {
      toast(t.loginToReact, {
        action: { label: t.login, onClick: () => router.push(`/login?next=${encodeURIComponent(pathname)}`) },
      });
      return;
    }
    if (!(await react(type))) toast.error(t.reactError);
  }

  return (
    <div className="cs-no-print mt-4 flex flex-wrap items-center gap-2" data-search-ignore>
      <span className="inline-flex h-7 items-center gap-1.5 rounded-lg border bg-card px-2.5 text-[0.8rem] text-muted-foreground" title={t.reads}>
        <EyeIcon className="size-3.5" aria-hidden="true" />
        <span className="tabular-nums">{count(stats.views)}</span>
        <span className="sr-only">{t.reads}</span>
      </span>
      <Button
        variant="outline"
        size="sm"
        aria-pressed={myReaction === "LIKE"}
        onClick={() => void onReact("LIKE")}
        className={cn(myReaction === "LIKE" && "border-brand bg-brand/15 text-brand hover:bg-brand/20 hover:text-brand")}
        title={t.like}
      >
        <ThumbsUpIcon className={cn(myReaction === "LIKE" && "fill-current")} />
        <span className="tabular-nums">{count(stats.likes)}</span>
        <span className="sr-only">{t.like}</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        aria-pressed={myReaction === "DISLIKE"}
        onClick={() => void onReact("DISLIKE")}
        className={cn(
          myReaction === "DISLIKE" && "border-destructive/60 bg-destructive/10 text-destructive hover:bg-destructive/15 hover:text-destructive",
        )}
        title={t.dislike}
      >
        <ThumbsDownIcon className={cn(myReaction === "DISLIKE" && "fill-current")} />
        <span className="tabular-nums">{count(stats.dislikes)}</span>
        <span className="sr-only">{t.dislike}</span>
      </Button>
      <Button variant="outline" size="sm" asChild title={t.comments}>
        <a href="#comments">
          <MessageCircleIcon />
          <span className="tabular-nums">{count(stats.comments)}</span>
          <span className="sr-only">{t.comments}</span>
        </a>
      </Button>
    </div>
  );
}
