"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLinkIcon, RotateCcwIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import {
  DangerConfirmDialog,
  EmptyBlock,
  ErrorBlock,
  LoadingBlock,
  PageBody,
  PageHeader,
  Pagination,
  formatDateTime,
} from "@/components/admin/admin-ui";
import { adminApi } from "@/lib/admin-api";
import type { AdminComment } from "@/lib/admin-types";

const LIMIT = 20;

type Status = "active" | "deleted";

export function CommentsView() {
  const [comments, setComments] = useState<AdminComment[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<Status>("active");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminComment | null>(null);

  const load = useCallback(() => {
    setError(null);
    adminApi
      .comments({ status, q: query, page, limit: LIMIT })
      .then((data) => {
        setComments(data.comments);
        setTotal(data.total);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not load comments"));
  }, [status, query, page]);

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  async function restore(comment: AdminComment) {
    try {
      await adminApi.restoreComment(comment.id);
      toast.success("Comment restored");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not restore the comment");
    }
  }

  return (
    <>
      <AdminTopbar title="Comments" />
      <PageBody>
        <PageHeader title="Comments" description="Moderate discussion across every summary. Deleted comments are hidden, not erased." />

        <div className="flex flex-wrap items-center gap-2">
          <Tabs
            value={status}
            onValueChange={(value) => {
              setStatus(value as Status);
              setPage(1);
            }}
          >
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="deleted">Deleted</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-full max-w-sm">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              className="pl-8"
              placeholder="Search comment text or author email"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardContent className="pt-4">
            {error ? (
              <ErrorBlock message={error} onRetry={load} />
            ) : !comments ? (
              <LoadingBlock />
            ) : comments.length === 0 ? (
              <EmptyBlock title={status === "deleted" ? "No deleted comments" : "No comments yet"} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[45%]">Comment</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>{status === "deleted" ? "Deleted" : "Posted"}</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.map((comment) => (
                    <TableRow key={comment.id}>
                      <TableCell className="max-w-md">
                        <p className="line-clamp-3 whitespace-pre-wrap">{comment.body}</p>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/content/${comment.summarySlug}`}
                          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                        >
                          {comment.summarySlug}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium">{comment.author.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{comment.author.email}</p>
                        {comment.author.suspended && (
                          <Badge variant="outline" className="mt-1">
                            Suspended
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateTime(status === "deleted" ? comment.deletedAt : comment.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          {status === "deleted" ? (
                            <Button variant="outline" size="xs" onClick={() => void restore(comment)}>
                              <RotateCcwIcon />
                              Restore
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Delete comment"
                              title="Delete comment"
                              onClick={() => setDeleteTarget(comment)}
                            >
                              <Trash2Icon />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {comments && total > 0 && (
              <div className="mt-4">
                <Pagination page={page} limit={LIMIT} total={total} onPage={setPage} />
              </div>
            )}
          </CardContent>
        </Card>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ExternalLinkIcon className="size-3.5" />
          Users can still delete their own comments; this page covers everything else.
        </p>
      </PageBody>

      <DangerConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this comment?"
        description={
          <>
            The comment by <strong>{deleteTarget?.author.name}</strong> on {deleteTarget?.summarySlug} will disappear from
            the site. It stays in the Deleted tab so you can restore it.
          </>
        }
        confirmWord="delete"
        confirmLabel="Delete comment"
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            await adminApi.deleteComment(deleteTarget.id);
            toast.success("Comment deleted");
            setDeleteTarget(null);
            load();
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not delete the comment");
          }
        }}
      />
    </>
  );
}
