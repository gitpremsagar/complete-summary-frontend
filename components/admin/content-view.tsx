"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangleIcon, ArchiveIcon, EyeIcon, FilePlus2Icon, PencilIcon, RotateCcwIcon, SearchIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { EmptyBlock, ErrorBlock, LoadingBlock, PageBody, PageHeader, Pagination, formatDate } from "@/components/admin/admin-ui";
import { adminApi } from "@/lib/admin-api";
import type { AdminSummaryRow, SummaryStatus } from "@/lib/admin-types";

export function StatusBadge({ status }: { status: SummaryStatus }) {
  if (status === "DRAFT") return <Badge variant="outline">Draft</Badge>;
  if (status === "ARCHIVED") return <Badge variant="destructive">Archived</Badge>;
  return <Badge variant="secondary">Published</Badge>;
}

export function ContentView() {
  const [rows, setRows] = useState<AdminSummaryRow[] | null>(null);
  const [counts, setCounts] = useState<Record<SummaryStatus, number>>({ PUBLISHED: 0, DRAFT: 0, ARCHIVED: 0 });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<SummaryStatus>("PUBLISHED");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    adminApi
      .summaries({ status, q: query, page, limit: 20 })
      .then((data) => {
        setRows(data.summaries);
        setTotal(data.total);
        setCounts(data.statusCounts);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not load content"));
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

  async function archive(row: AdminSummaryRow) {
    try {
      const result = await adminApi.archiveSummary(row.slug);
      toast.success(`Archived ${row.slug}`, {
        description: result.revalidation.revalidated
          ? "The public site was updated."
          : (result.revalidation.message ?? "It will disappear from the site on the next deploy."),
      });
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not archive the summary");
    }
  }

  async function restore(row: AdminSummaryRow) {
    try {
      await adminApi.restoreSummary(row.slug);
      toast.success(`Restored ${row.slug}`);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not restore the summary");
    }
  }

  return (
    <>
      <AdminTopbar
        title="Content"
        actions={
          <Button asChild size="sm">
            <Link href="/admin/content/new">
              <FilePlus2Icon />
              New summary
            </Link>
          </Button>
        }
      />
      <PageBody>
        <PageHeader
          title="Content"
          description="Summary metadata and MDX bodies live in the repository. Edits here write the files and revalidate the site."
        />

        <div className="flex flex-wrap items-center gap-2">
          <Tabs
            value={status}
            onValueChange={(value) => {
              setStatus(value as SummaryStatus);
              setPage(1);
            }}
          >
            <TabsList>
              <TabsTrigger value="PUBLISHED">Published ({counts.PUBLISHED})</TabsTrigger>
              <TabsTrigger value="DRAFT">Drafts ({counts.DRAFT})</TabsTrigger>
              <TabsTrigger value="ARCHIVED">Archived ({counts.ARCHIVED})</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-full max-w-xs">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              className="pl-8"
              placeholder="Search slug, title or description"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardContent className="pt-4">
            {error ? (
              <ErrorBlock message={error} onRetry={load} />
            ) : !rows ? (
              <LoadingBlock />
            ) : rows.length === 0 ? (
              <EmptyBlock
                title={status === "ARCHIVED" ? "Nothing archived" : "No summaries here"}
                description={status === "PUBLISHED" && !query ? "Create your first summary." : "Try a different search."}
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Kind</TableHead>
                    <TableHead>Languages</TableHead>
                    <TableHead className="text-right">Words</TableHead>
                    <TableHead>{status === "PUBLISHED" ? "Published" : status === "ARCHIVED" ? "Archived" : "Updated"}</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.slug}>
                      <TableCell className="max-w-[22rem]">
                        <p className="truncate font-medium">{row.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{row.slug}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{row.kind}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Badge variant={row.hasBody ? "secondary" : "destructive"}>EN</Badge>
                          {row.hasHindi ? (
                            <Badge variant={row.hasHindiBody ? "secondary" : "outline"}>HI</Badge>
                          ) : (
                            <Badge variant="ghost">No HI</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{row.wordCount.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(row.status === "ARCHIVED" ? row.archivedAt : row.publishedAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          {status === "ARCHIVED" ? (
                            <Button variant="outline" size="xs" onClick={() => void restore(row)}>
                              <RotateCcwIcon />
                              Restore
                            </Button>
                          ) : (
                            <>
                              <Button asChild variant="ghost" size="icon-sm" aria-label="Preview" title="Open on the public site">
                                <a href={`/summaries/${row.slug}`} target="_blank" rel="noreferrer">
                                  <EyeIcon />
                                </a>
                              </Button>
                              <Button asChild variant="ghost" size="icon-sm" aria-label="Edit" title="Edit">
                                <Link href={`/admin/content/${row.slug}`}>
                                  <PencilIcon />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Archive"
                                title="Archive"
                                onClick={() => void archive(row)}
                              >
                                <ArchiveIcon />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {rows && total > 0 && (
              <div className="mt-4">
                <Pagination page={page} limit={20} total={total} onPage={setPage} />
              </div>
            )}
          </CardContent>
        </Card>

        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <AlertTriangleIcon className="mt-0.5 size-3.5 shrink-0" />
          Archiving hides a summary from the site without deleting its MDX. Restore returns it to the list.
        </p>
      </PageBody>
    </>
  );
}
