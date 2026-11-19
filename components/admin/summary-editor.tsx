"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ExternalLinkIcon, Loader2Icon, SaveIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { DangerConfirmDialog, ErrorBlock, LoadingBlock, PageBody, formatDateTime } from "@/components/admin/admin-ui";
import { StatusBadge } from "@/components/admin/content-view";
import { adminApi } from "@/lib/admin-api";
import type { SummaryKind, SummaryMeta, SummaryStat, SummaryStatus, SummaryTranslation } from "@/lib/admin-types";

const BLANK_MDX = `import { Section, KeyPoint } from "@/components/summary/blocks";

<Section id="overview" title="Overview">

Write the opening section here.

<KeyPoint><b>Takeaway</b> One sentence that sums up the point.</KeyPoint>

</Section>
`;

const BLANK_HI_MDX = `import { Section, KeyPoint } from "@/components/summary/blocks";

<Section id="overview" title="Overview">

यहाँ शुरुआती सेक्शन लिखें।

<KeyPoint><b>मुख्य बात</b> एक वाक्य में बात का सार।</KeyPoint>

</Section>
`;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function blankMeta(slug = ""): SummaryMeta {
  return {
    slug,
    kind: "Podcast",
    title: "",
    description: "",
    intro: "",
    publishedAt: todayISO(),
    tags: [],
    stats: [],
  };
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/** Blank lines are not valid input for optional fields, so they are dropped. */
function optional(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function statsToText(stats: SummaryStat[]) {
  return stats.map((stat) => `${stat.value} | ${stat.label}`).join("\n");
}

function textToStats(text: string): SummaryStat[] {
  return text
    .split("\n")
    .map((line) => {
      const [value, ...rest] = line.split("|");
      return { value: (value ?? "").trim(), label: rest.join("|").trim() };
    })
    .filter((stat) => stat.value || stat.label);
}

interface EditorProps {
  mode: "create" | "edit";
  slug?: string;
}

export function SummaryEditor({ mode, slug }: EditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(mode === "edit");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [status, setStatus] = useState<SummaryStatus>("PUBLISHED");
  const [archivedAt, setArchivedAt] = useState<string | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);

  const [meta, setMeta] = useState<SummaryMeta>(() => blankMeta());
  const [enBody, setEnBody] = useState(mode === "create" ? BLANK_MDX : "");
  const [hiBody, setHiBody] = useState(mode === "create" ? BLANK_HI_MDX : "");
  const [hiEnabled, setHiEnabled] = useState(mode === "create");

  const load = useCallback(() => {
    if (mode !== "edit" || !slug) return;
    setLoading(true);
    setError(null);
    adminApi
      .summary(slug)
      .then((data) => {
        if (!data.summary?.meta) {
          setError("This summary exists only as an archive. Restore it from the content list first.");
          return;
        }
        setMeta(data.summary.meta);
        setEnBody(data.summary.bodies.en ?? "");
        setHiBody(data.summary.bodies.hi ?? "");
        setHiEnabled(Boolean(data.summary.meta.hi) || data.summary.bodies.hi !== null);
        setStatus(data.status);
        setArchivedAt(data.archivedAt);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not load the summary"))
      .finally(() => setLoading(false));
  }, [mode, slug]);

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);

  function patch(next: Partial<SummaryMeta>) {
    setMeta((current) => ({ ...current, ...next }));
  }

  function patchHi(next: Partial<SummaryTranslation>) {
    setMeta((current) => {
      const base: SummaryTranslation = current.hi ?? {
        title: current.title,
        description: current.description,
        intro: current.intro,
        tags: current.tags,
        stats: current.stats,
      };
      return { ...current, hi: { ...base, ...next } };
    });
  }

  async function save() {
    setSaving(true);
    setFieldErrors({});
    try {
      const cleanMeta: SummaryMeta = {
        ...meta,
        slug: meta.slug.trim(),
        guest: optional(meta.guest ?? ""),
        guestBio: optional(meta.guestBio ?? ""),
        host: optional(meta.host ?? ""),
        show: optional(meta.show ?? ""),
        episode: optional(meta.episode ?? ""),
        sourceUrl: optional(meta.sourceUrl ?? ""),
        youtubeId: optional(meta.youtubeId ?? ""),
        updatedAt: mode === "edit" ? todayISO() : optional(meta.updatedAt ?? ""),
        ...(hiEnabled && meta.hi ? {} : { hi: undefined }),
      };
      for (const key of Object.keys(cleanMeta) as (keyof SummaryMeta)[]) {
        if (cleanMeta[key] === undefined) delete cleanMeta[key];
      }

      const bodies: { en: string; hi?: string } = hiEnabled ? { en: enBody, hi: hiBody } : { en: enBody };

      if (mode === "create") {
        const result = await adminApi.createSummary({ meta: cleanMeta, bodies });
        toast.success(`Created ${cleanMeta.slug}`, {
          description: result.revalidation.revalidated ? "The public site was updated." : result.revalidation.message,
        });
        router.push(`/admin/content/${cleanMeta.slug}`);
        router.refresh();
      } else {
        const result = await adminApi.updateSummary(slug!, { meta: cleanMeta, bodies });
        setMeta(result.summary.meta ?? cleanMeta);
        toast.success("Saved", {
          description: result.revalidation.revalidated ? "The public site was updated." : result.revalidation.message,
        });
        load();
      }
    } catch (err) {
      const apiError = err as { message?: string; errors?: Record<string, string[]> };
      if (apiError.errors && Object.keys(apiError.errors).length > 0) {
        setFieldErrors(apiError.errors);
        const first = Object.entries(apiError.errors)[0];
        toast.error(`Fix ${Object.keys(apiError.errors).length} field${Object.keys(apiError.errors).length === 1 ? "" : "s"}`, {
          description: first ? `${first[0]}: ${first[1][0]}` : "Check the highlighted fields.",
        });
      } else {
        toast.error(apiError.message ?? "Could not save the summary");
      }
    } finally {
      setSaving(false);
    }
  }

  async function setPublishedStatus(next: SummaryStatus) {
    if (!slug) return;
    try {
      await adminApi.setSummaryStatus(slug, next);
      setStatus(next);
      toast.success(next === "DRAFT" ? "Moved to drafts" : "Published");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change the status");
    }
  }

  async function archive() {
    if (!slug) return;
    try {
      await adminApi.archiveSummary(slug);
      toast.success("Archived. It can be restored from the content list.");
      router.push("/admin/content");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not archive the summary");
    }
  }

  function fieldError(name: string) {
    const messages = fieldErrors[name] ?? fieldErrors[`meta.${name}`];
    return messages?.[0];
  }

  const hiValue: SummaryTranslation = meta.hi ?? {
    title: meta.title,
    description: meta.description,
    intro: meta.intro,
    tags: meta.tags,
    stats: meta.stats,
    guestBio: meta.guestBio,
    searchExamples: meta.searchExamples,
  };

  if (loading) {
    return (
      <>
        <AdminTopbar title="Content" />
        <PageBody>
          <LoadingBlock label="Loading summary…" />
        </PageBody>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AdminTopbar title="Content" />
        <PageBody>
          <ErrorBlock message={error} onRetry={load} />
          <Button asChild variant="outline" className="w-fit">
            <Link href="/admin/content">
              <ArrowLeftIcon />
              Back to content
            </Link>
          </Button>
        </PageBody>
      </>
    );
  }

  return (
    <>
      <AdminTopbar
        title="Content"
        actions={
          <>
            {mode === "edit" && slug && (
              <Button asChild variant="ghost" size="sm">
                <a href={`/summaries/${slug}`} target="_blank" rel="noreferrer">
                  <ExternalLinkIcon />
                  View live
                </a>
              </Button>
            )}
            <Button size="sm" onClick={() => void save()} disabled={saving}>
              {saving ? <Loader2Icon className="animate-spin" /> : <SaveIcon />}
              {mode === "create" ? "Create summary" : "Save changes"}
            </Button>
          </>
        }
      />
      <PageBody>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">{mode === "create" ? "New summary" : meta.title || slug}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "create" ? "Creates an entry in summaries.ts and an MDX file." : `Editing ${slug}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={status} />
            {mode === "edit" && (
              <>
                {status !== "DRAFT" ? (
                  <Button variant="outline" size="sm" onClick={() => void setPublishedStatus("DRAFT")}>
                    Move to drafts
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => void setPublishedStatus("PUBLISHED")}>
                    Publish
                  </Button>
                )}
                <Button variant="destructive" size="sm" onClick={() => setArchiveOpen(true)}>
                  <Trash2Icon />
                  Archive
                </Button>
              </>
            )}
          </div>
        </div>

        {archivedAt && status === "ARCHIVED" && (
          <p className="text-sm text-destructive">Archived on {formatDateTime(archivedAt)}.</p>
        )}

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Tabs defaultValue="en">
              <TabsList>
                <TabsTrigger value="en">English MDX</TabsTrigger>
                <TabsTrigger value="hi">Hindi MDX</TabsTrigger>
              </TabsList>
              <TabsContent value="en">
                <Card>
                  <CardHeader className="flex-row items-center justify-between">
                    <div>
                      <CardTitle>Body</CardTitle>
                      <CardDescription>content/summaries/{slug ?? (meta.slug || "<slug>")}.mdx</CardDescription>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <a href={`/admin/content/${encodeURIComponent(slug || meta.slug)}/preview?locale=en`} target="_blank" rel="noreferrer">
                        <ExternalLinkIcon />
                        Preview saved version
                      </a>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={enBody}
                      onChange={(event) => setEnBody(event.target.value)}
                      spellCheck={false}
                      className="min-h-[28rem] font-mono text-[13px] leading-relaxed"
                      placeholder="MDX body"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="hi">
                <Card>
                  <CardHeader className="flex-row items-center justify-between">
                    <div>
                      <CardTitle>Hindi body</CardTitle>
                      <CardDescription>content/summaries/hi/{slug ?? (meta.slug || "<slug>")}.mdx</CardDescription>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={hiEnabled} onChange={(event) => setHiEnabled(event.target.checked)} />
                      Enable Hindi
                    </label>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={hiBody}
                      disabled={!hiEnabled}
                      onChange={(event) => setHiBody(event.target.value)}
                      spellCheck={false}
                      className="min-h-[28rem] font-mono text-[13px] leading-relaxed"
                      placeholder="Hindi MDX body"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>English metadata</CardTitle>
                <CardDescription>Shown in the hero, cards and search results.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="contents">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={meta.slug}
                        disabled={mode === "edit"}
                        onChange={(event) => patch({ slug: event.target.value.toLowerCase() })}
                        placeholder="topic-with-hyphens"
                        aria-invalid={Boolean(fieldError("slug"))}
                      />
                      <FieldHint error={fieldError("slug")} hint="Lowercase letters, numbers and dashes." />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="kind">Kind</Label>
                      <Select value={meta.kind} onValueChange={(value) => patch({ kind: value as SummaryKind })}>
                        <SelectTrigger id="kind">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Podcast">Podcast</SelectItem>
                          <SelectItem value="Video">Video</SelectItem>
                          <SelectItem value="Audiobook">Audiobook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={meta.title} onChange={(event) => patch({ title: event.target.value })} aria-invalid={Boolean(fieldError("title"))} />
                  <FieldHint error={fieldError("title")} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={meta.description}
                    onChange={(event) => patch({ description: event.target.value })}
                    aria-invalid={Boolean(fieldError("description"))}
                    className="min-h-24"
                  />
                  <FieldHint error={fieldError("description")} hint="Used for SEO and the summary cards." />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="intro">Intro</Label>
                  <Textarea id="intro" value={meta.intro} onChange={(event) => patch({ intro: event.target.value })} aria-invalid={Boolean(fieldError("intro"))} />
                  <FieldHint error={fieldError("intro")} hint="Longer text shown in the hero." />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Guest" value={meta.guest} onChange={(value) => patch({ guest: value })} />
                  <TextField label="Host" value={meta.host} onChange={(value) => patch({ host: value })} />
                  <TextField label="Show" value={meta.show} onChange={(value) => patch({ show: value })} />
                  <TextField label="Episode" value={meta.episode} onChange={(value) => patch({ episode: value })} placeholder="FO556" />
                </div>

                <TextField label="Guest bio" value={meta.guestBio} onChange={(value) => patch({ guestBio: value })} placeholder="Neuroscientist, Stanford" />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="sourceUrl">Source URL</Label>
                    <Input
                      id="sourceUrl"
                      type="url"
                      value={meta.sourceUrl ?? ""}
                      onChange={(event) => patch({ sourceUrl: event.target.value })}
                      placeholder="https://www.youtube.com/watch?v=…"
                      aria-invalid={Boolean(fieldError("sourceUrl"))}
                    />
                    <FieldHint error={fieldError("sourceUrl")} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="youtubeId">YouTube ID</Label>
                    <Input
                      id="youtubeId"
                      value={meta.youtubeId ?? ""}
                      onChange={(event) => patch({ youtubeId: event.target.value })}
                      placeholder="Y566_T-YlNQ"
                      aria-invalid={Boolean(fieldError("youtubeId"))}
                    />
                    <FieldHint error={fieldError("youtubeId")} hint="The part after v= in the video URL." />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="publishedAt">Published</Label>
                    <Input
                      id="publishedAt"
                      type="date"
                      value={meta.publishedAt}
                      onChange={(event) => patch({ publishedAt: event.target.value })}
                      aria-invalid={Boolean(fieldError("publishedAt"))}
                    />
                    <FieldHint error={fieldError("publishedAt")} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="updatedAt">Updated</Label>
                    <Input
                      id="updatedAt"
                      type="date"
                      value={meta.updatedAt ?? ""}
                      onChange={(event) => patch({ updatedAt: event.target.value })}
                      aria-invalid={Boolean(fieldError("updatedAt"))}
                    />
                    <FieldHint error={fieldError("updatedAt")} hint="Optional; set automatically on save." />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={meta.tags.join(", ")}
                    onChange={(event) => patch({ tags: splitList(event.target.value) })}
                    placeholder="Cortisol rhythm, Sleep, Resilience"
                    aria-invalid={Boolean(fieldError("tags"))}
                  />
                  <FieldHint error={fieldError("tags")} hint="Comma separated." />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="stats">Stat cards</Label>
                  <Textarea
                    id="stats"
                    value={statsToText(meta.stats)}
                    onChange={(event) => patch({ stats: textToStats(event.target.value) })}
                    className="min-h-24 font-mono text-[13px]"
                    placeholder={"Up to 50% | Boost to your morning cortisol peak\n8 hours | No caffeine before bed"}
                    aria-invalid={Boolean(fieldError("stats"))}
                  />
                  <FieldHint error={fieldError("stats")} hint="One per line: value | label" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="searchExamples">Search examples</Label>
                  <Input
                    id="searchExamples"
                    value={(meta.searchExamples ?? []).join(", ")}
                    onChange={(event) => patch({ searchExamples: splitList(event.target.value) })}
                    placeholder="cortisol, sunlight, nidra"
                  />
                  <FieldHint hint="Optional. Comma separated." />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Hindi metadata</CardTitle>
                  <CardDescription>Overrides for the Hindi site. Leave off to reuse English text.</CardDescription>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={hiEnabled}
                    onChange={(event) => {
                      setHiEnabled(event.target.checked);
                      if (event.target.checked && !meta.hi) patchHi({});
                    }}
                  />
                  Enable Hindi
                </label>
              </CardHeader>
              {hiEnabled && (
                <CardContent className="grid gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="hi-title">Title</Label>
                    <Input id="hi-title" value={hiValue.title} onChange={(event) => patchHi({ title: event.target.value })} aria-invalid={Boolean(fieldError("hi.title"))} />
                    <FieldHint error={fieldError("hi.title")} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="hi-description">Description</Label>
                    <Textarea id="hi-description" value={hiValue.description} onChange={(event) => patchHi({ description: event.target.value })} aria-invalid={Boolean(fieldError("hi.description"))} className="min-h-20" />
                    <FieldHint error={fieldError("hi.description")} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="hi-intro">Intro</Label>
                    <Textarea id="hi-intro" value={hiValue.intro} onChange={(event) => patchHi({ intro: event.target.value })} aria-invalid={Boolean(fieldError("hi.intro"))} />
                    <FieldHint error={fieldError("hi.intro")} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="hi-guestBio">Guest bio</Label>
                    <Input id="hi-guestBio" value={hiValue.guestBio ?? ""} onChange={(event) => patchHi({ guestBio: event.target.value })} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="hi-tags">Tags</Label>
                    <Input id="hi-tags" value={hiValue.tags.join(", ")} onChange={(event) => patchHi({ tags: splitList(event.target.value) })} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="hi-stats">Stat cards</Label>
                    <Textarea
                      id="hi-stats"
                      value={statsToText(hiValue.stats)}
                      onChange={(event) => patchHi({ stats: textToStats(event.target.value) })}
                      className="min-h-20 font-mono text-[13px]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="hi-searchExamples">Search examples</Label>
                    <Input
                      id="hi-searchExamples"
                      value={(hiValue.searchExamples ?? []).join(", ")}
                      onChange={(event) => patchHi({ searchExamples: splitList(event.target.value) })}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
                <CardDescription>How this summary appears on the public site.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <Row label="Status" value={<StatusBadge status={status} />} />
                <Row label="English body" value={<Badge variant={enBody.trim() ? "secondary" : "destructive"}>{enBody.trim() ? "Present" : "Empty"}</Badge>} />
                <Row
                  label="Hindi body"
                  value={<Badge variant={hiEnabled ? (hiBody.trim() ? "secondary" : "destructive") : "ghost"}>{hiEnabled ? (hiBody.trim() ? "Present" : "Empty") : "Off"}</Badge>}
                />
                <Row label="Words (EN)" value={enBody.trim() ? enBody.trim().split(/\s+/).length.toLocaleString() : "0"} />
                <p className="text-xs text-muted-foreground">
                  Saving writes the metadata into <code>lib/summaries.ts</code> and the body files, keeps a backup under
                  <code> .admin-backups/</code>, and asks the site to revalidate the affected pages.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>MDX cheat sheet</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-xs text-muted-foreground">
                <p>
                  <code>{"<Section id=\"overview\" title=\"Overview\">…</Section>"}</code> creates a section in the table of
                  contents.
                </p>
                <p>
                  <code>{"<KeyPoint>…</KeyPoint>"}</code>, <code>{"<Warn>"}</code>, <code>{"<Quote cite=\"…\">"}</code>,
                  <code> {"<Study>"}</code>, <code>{"<Grid>"}</code>, <code>{"<Box>"}</code> and <code>{"<SimpleTable>"}</code> are
                  available globally.
                </p>
                <p>Interactive exercises are imported from <code>@/components/summaries/&lt;slug&gt;</code>.</p>
              </CardContent>
            </Card>

            <Button variant="outline" size="sm" onClick={() => void save()} disabled={saving} className="w-fit">
              {saving ? <Loader2Icon className="animate-spin" /> : <SaveIcon />}
              {mode === "create" ? "Create summary" : "Save changes"}
            </Button>
          </div>
        </div>
      </PageBody>

      <DangerConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title="Archive this summary?"
        description={`${meta.title || slug} will be removed from lib/summaries.ts and its MDX files moved to content/archive/. It disappears from the public site. You can restore it from the content list.`}
        confirmWord={slug ?? ""}
        confirmLabel="Archive summary"
        onConfirm={archive}
      />
    </>
  );
}

function FieldHint({ error, hint }: { error?: string; hint?: string }) {
  if (error) return <p className="text-xs text-destructive">{error}</p>;
  if (hint) return <p className="text-xs text-muted-foreground">{hint}</p>;
  return null;
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value ?? ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
