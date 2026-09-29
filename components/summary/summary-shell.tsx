"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { ArrowUpIcon, ListIcon, SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SummarySection } from "@/lib/summaries";

const HIGHLIGHT = "cs-search";
const SPY_OFFSET = 140;

function sectionsIn(root: HTMLElement | null) {
  return root ? Array.from(root.querySelectorAll<HTMLElement>("[data-section]")) : [];
}

function setCollapsed(section: HTMLElement, collapsed: boolean) {
  section.toggleAttribute("data-collapsed", collapsed);
  section.querySelector("[data-section-toggle]")?.setAttribute("aria-expanded", String(!collapsed));
}

function isSearchable(node: Node) {
  const parent = node.parentElement;
  if (!parent || parent.closest("svg,script,style,textarea,option,[data-search-ignore]")) return false;
  const button = parent.closest("button");
  return !button || button.hasAttribute("data-section-toggle");
}

interface SearchResult {
  total: number;
  sections: Set<string>;
}

export function SummaryShell({
  sections,
  hero,
  searchExamples,
  children,
}: {
  sections: SummarySection[];
  hero: ReactNode;
  searchExamples: string[];
  children: ReactNode;
}) {
  const articleRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<HTMLElement>(null);
  const firstMatchRef = useRef<Range | null>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const [showTop, setShowTop] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
      }
      setShowTop(window.scrollY > 800);
      let active: string | null = null;
      for (const section of sectionsIn(articleRef.current)) {
        if (section.hasAttribute("data-search-hidden")) continue;
        if (section.getBoundingClientRect().top < SPY_OFFSET) active = section.id;
      }
      setCurrent(active);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const toc = tocRef.current;
    const link = current ? toc?.querySelector<HTMLElement>(`[data-target="${current}"]`) : null;
    if (!toc || !link) return;
    const linkBox = link.getBoundingClientRect();
    const tocBox = toc.getBoundingClientRect();
    if (linkBox.top < tocBox.top + 40 || linkBox.bottom > tocBox.bottom - 20) {
      toc.scrollTop += linkBox.top - tocBox.top - tocBox.height / 2;
    }
  }, [current]);

  const runSearch = useCallback((raw: string) => {
    const q = raw.trim().toLowerCase();
    const all = sectionsIn(articleRef.current);
    CSS.highlights?.delete(HIGHLIGHT);
    firstMatchRef.current = null;

    if (q.length < 2) {
      all.forEach((s) => s.removeAttribute("data-search-hidden"));
      setResult(null);
      return;
    }

    const ranges: Range[] = [];
    const matched = new Set<string>();
    for (const section of all) {
      const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
      let count = 0;
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (!isSearchable(node)) continue;
        const text = node.nodeValue?.toLowerCase() ?? "";
        for (let i = text.indexOf(q); i !== -1; i = text.indexOf(q, i + q.length)) {
          const range = new Range();
          range.setStart(node, i);
          range.setEnd(node, i + q.length);
          ranges.push(range);
          count++;
        }
      }
      section.toggleAttribute("data-search-hidden", count === 0);
      if (count > 0) {
        matched.add(section.id);
        setCollapsed(section, false);
      }
    }

    firstMatchRef.current = ranges[0] ?? null;
    if (ranges.length && typeof Highlight !== "undefined") {
      CSS.highlights?.set(HIGHLIGHT, new Highlight(...ranges));
    }
    setResult({ total: ranges.length, sections: matched });
  }, []);

  useEffect(() => {
    const id = setTimeout(() => runSearch(query), 250);
    return () => clearTimeout(id);
  }, [query, runSearch]);

  useEffect(() => () => void CSS.highlights?.delete(HIGHLIGHT), []);

  function onArticleClick(event: MouseEvent<HTMLDivElement>) {
    const toggle = (event.target as Element).closest("[data-section-toggle]");
    const section = toggle?.closest<HTMLElement>("[data-section]");
    if (section) setCollapsed(section, !section.hasAttribute("data-collapsed"));
  }

  function setAll(collapsed: boolean) {
    sectionsIn(articleRef.current).forEach((s) => setCollapsed(s, collapsed));
  }

  function openSection(id: string) {
    const section = document.getElementById(id);
    if (section) setCollapsed(section, false);
    setTocOpen(false);
  }

  function scrollToFirstMatch() {
    firstMatchRef.current?.startContainer.parentElement?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const hasChecklist = sections.some((s) => s.id === "checklist");

  return (
    <>
      {/* Turbopack's CSS parser doesn't support ::highlight() yet, so this rule can't live in summary.css. */}
      <style href="cs-search-highlight" precedence="default">
        {`::highlight(${HIGHLIGHT}){background-color:var(--mark);color:#111}`}
      </style>
      <div
        ref={progressRef}
        className="fixed top-0 left-0 z-100 h-1 w-0 bg-linear-to-r from-brand to-brand-2 transition-[width] duration-100"
        aria-hidden="true"
      />

      <div className="lg:grid lg:grid-cols-[300px_1fr]">
        {tocOpen && (
          <div className="fixed inset-0 z-60 bg-black/40 lg:hidden" onClick={() => setTocOpen(false)} aria-hidden="true" />
        )}
        <nav
          ref={tocRef}
          aria-label="Contents"
          className={cn(
            "cs-no-print fixed top-14 bottom-0 left-0 z-70 w-[290px] -translate-x-full overflow-y-auto border-r bg-background px-3.5 pt-4 pb-10 transition-transform duration-200",
            "lg:sticky lg:z-auto lg:h-[calc(100vh-3.5rem)] lg:w-auto lg:translate-x-0",
            tocOpen && "translate-x-0 shadow-xl",
          )}
        >
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Contents</h2>
            <Button variant="ghost" size="icon" className="size-7 lg:hidden" onClick={() => setTocOpen(false)}>
              <XIcon />
              <span className="sr-only">Close contents</span>
            </Button>
          </div>
          <ol className="flex flex-col gap-0.5">
            {sections.map((section, i) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  data-target={section.id}
                  onClick={() => openSection(section.id)}
                  className={cn(
                    "flex gap-2 rounded-lg px-2.5 py-1.5 text-sm leading-snug text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    current === section.id && "bg-brand/15 text-foreground",
                    result && !result.sections.has(section.id) && "opacity-30",
                  )}
                >
                  <span className="min-w-[22px] font-semibold text-brand">
                    {section.id === "checklist" ? "\u2713" : String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{section.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mx-auto w-full max-w-[980px] min-w-0 px-3.5 pt-6 pb-28 md:px-10">
          {hero}
          <div className="cs-no-print sticky top-14 z-40 -mx-3.5 mb-5 flex flex-wrap items-center gap-2 border-b bg-background/90 px-3.5 py-2.5 backdrop-blur md:-mx-10 md:px-10">
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setTocOpen(true)}>
              <ListIcon />
              Contents
            </Button>
            <div className="relative min-w-[200px] flex-1">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") scrollToFirstMatch();
                  if (e.key === "Escape") setQuery("");
                }}
                placeholder={`Search this summary (e.g. ${searchExamples.join(", ")})...`}
                aria-label="Search this summary"
                className="pl-8"
              />
            </div>
            {result && (
              <span className="text-xs whitespace-nowrap text-muted-foreground" aria-live="polite">
                {result.total
                  ? `${result.total} match${result.total > 1 ? "es" : ""} in ${result.sections.size} section${result.sections.size > 1 ? "s" : ""}`
                  : "No matches"}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={() => setAll(false)}>
              Expand all
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAll(true)}>
              Collapse all
            </Button>
            {hasChecklist && (
              <Button variant="outline" size="sm" asChild>
                <a href="#checklist" onClick={() => openSection("checklist")}>
                  Action checklist
                </a>
              </Button>
            )}
          </div>

          <div ref={articleRef} className="cs-article" onClick={onArticleClick}>
            {children}
          </div>
        </div>
      </div>

      {showTop && (
        <Button
          className="cs-no-print fixed right-5 bottom-5 z-60 shadow-lg"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUpIcon />
          Top
        </Button>
      )}
    </>
  );
}
