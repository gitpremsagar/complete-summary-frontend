"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2Icon, MessageCircleIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale, useT } from "@/components/providers/locale-provider";
import { useEngagement } from "@/components/summary/engagement-provider";
import {
  MAX_COMMENT_LENGTH,
  deleteComment,
  fetchComments,
  formatCount,
  postComment,
  type CommentItem,
} from "@/lib/engagement";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "hi" ? "hi-IN" : "en", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(iso),
  );
}

export function CommentsSection() {
  const t = useT().engagement;
  const locale = useLocale();
  const pathname = usePathname();
  const { user, isLoading: authLoading } = useAuth();
  const { slug, stats, loaded, adjustComments } = useEngagement();
  const userId = user?.id ?? null;

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const viewerKey = `${slug}:${userId ?? ""}`;
  const loading = loadedFor !== viewerKey;
  const [loadingMore, setLoadingMore] = useState(false);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Reload when the viewer changes so `canDelete` reflects the current account.
  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    fetchComments(slug)
      .then((res) => {
        if (cancelled) return;
        setComments(res.comments);
        setNextCursor(res.nextCursor);
      })
      .catch(() => {
        if (!cancelled) toast.error(t.loadError);
      })
      .finally(() => {
        if (!cancelled) setLoadedFor(viewerKey);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, viewerKey, authLoading, t.loadError]);

  async function loadMore() {
    if (!nextCursor) return;
    setLoadingMore(true);
    try {
      const res = await fetchComments(slug, nextCursor);
      setComments((prev) => {
        const seen = new Set(prev.map((c) => c.id));
        return [...prev, ...res.comments.filter((c) => !seen.has(c.id))];
      });
      setNextCursor(res.nextCursor);
    } catch {
      toast.error(t.loadError);
    } finally {
      setLoadingMore(false);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const text = body.trim();
    if (!text || posting) return;
    setPosting(true);
    try {
      const { comment } = await postComment(slug, text);
      setComments((prev) => [comment, ...prev]);
      adjustComments(1);
      setBody("");
    } catch {
      toast.error(t.postError);
    } finally {
      setPosting(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm(t.deleteConfirm)) return;
    setDeleting(id);
    try {
      await deleteComment(slug, id);
      setComments((prev) => prev.filter((c) => c.id !== id));
      adjustComments(-1);
    } catch {
      toast.error(t.deleteError);
    } finally {
      setDeleting(null);
    }
  }

  const next = encodeURIComponent(`${pathname}#comments`);
  const remaining = MAX_COMMENT_LENGTH - body.length;

  return (
    <section id="comments" data-search-ignore className="cs-no-print mt-10 scroll-mt-32 rounded-3xl border bg-card p-5 md:p-7">
      <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
        <MessageCircleIcon className="size-5 text-brand" />
        {t.commentsTitle}
        {loaded && <span className="text-base font-normal text-muted-foreground">({formatCount(stats.comments, locale)})</span>}
      </h2>

      {user ? (
        <form onSubmit={onSubmit} className="mt-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={MAX_COMMENT_LENGTH}
            placeholder={t.commentPlaceholder}
            aria-label={t.commentPlaceholder}
            className="min-h-24 w-full min-w-0 resize-y rounded-md border border-input bg-background px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className={cn("text-xs text-muted-foreground tabular-nums", remaining < 100 && "text-destructive")}>
              {remaining}
            </span>
            <Button type="submit" size="sm" disabled={posting || !body.trim()}>
              {posting && <Loader2Icon className="animate-spin" />}
              {posting ? t.posting : t.post}
            </Button>
          </div>
        </form>
      ) : (
        !authLoading && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed p-4">
            <p className="text-sm text-muted-foreground">{t.loginToComment}</p>
            <div className="flex gap-2">
              <Button size="sm" asChild>
                <Link href={`/login?next=${next}`}>{t.login}</Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/register?next=${next}`}>{t.register}</Link>
              </Button>
            </div>
          </div>
        )
      )}

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">{t.noComments}</p>
        ) : (
          <ul className="flex flex-col divide-y">
            {comments.map((comment) => (
              <li key={comment.id} className="flex gap-3 py-4">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">{initials(comment.author.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-sm font-semibold">{comment.author.name}</span>
                    <time dateTime={comment.createdAt} className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt, locale)}
                    </time>
                    {comment.canDelete && (
                      <Button
                        variant="ghost"
                        size="xs"
                        className="ml-auto text-muted-foreground hover:text-destructive"
                        disabled={deleting === comment.id}
                        onClick={() => void onDelete(comment.id)}
                      >
                        {deleting === comment.id ? <Loader2Icon className="animate-spin" /> : <Trash2Icon />}
                        {t.delete}
                      </Button>
                    )}
                  </div>
                  <p className="mt-1 text-sm break-words whitespace-pre-wrap">{comment.body}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        {nextCursor && !loading && (
          <div className="mt-2 flex justify-center">
            <Button variant="outline" size="sm" onClick={() => void loadMore()} disabled={loadingMore}>
              {loadingMore && <Loader2Icon className="animate-spin" />}
              {t.loadMore}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
