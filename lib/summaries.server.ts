import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { SummarySection } from "@/lib/summaries";

export interface SummaryOutline {
  sections: SummarySection[];
  wordCount: number;
  readingMinutes: number;
}

const WORDS_PER_MINUTE = 230;

function decodeEntities(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&rarr;/g, "→")
    .replace(/&nbsp;/g, " ");
}

/** Reads the MDX source at build time to derive the table of contents and reading time. */
export const getSummaryOutline = cache(async (slug: string): Promise<SummaryOutline> => {
  const file = path.join(process.cwd(), "content", "summaries", `${slug}.mdx`);
  const source = await readFile(file, "utf8");

  const sections = [...source.matchAll(/<Section\s+id="([^"]+)"\s+title="([^"]+)"/g)].map((m) => ({
    id: m[1],
    title: decodeEntities(m[2]),
  }));

  const text = source
    .replace(/^import .*$/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ");
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  return { sections, wordCount, readingMinutes: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)) };
});
