"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Widget } from "@/components/summary/exercise";
import { cn } from "@/lib/utils";

const COLUMNS = [
  {
    title: "Long-form (films, long podcasts, long YouTube)",
    tone: "bg-good/10",
    items: [
      ["Story and narration", "Highs, lows and unexpected turns engage the DMN, which drives creativity."],
      ["Autobiographical planning", 'Rehearses "the story of you" and planning your future.'],
      ["Empathy", "Character building and personalization; a study found films increase empathy."],
      ["Memory = learning", "You remember long-form content, so you actually learn."],
      ["Connection", "Empathy lets you connect more, the opposite of loneliness."],
    ],
  },
  {
    title: "Short-form (reels, shorts, endless scroll)",
    tone: "bg-bad/10",
    items: [
      ["Pure novelty", 'Jumping from thing to thing, "just like crack," with nothing to hold onto.'],
      ["No memory, no learning", "Can you remember three reels ago? Without memory there's no learning."],
      ["More depressive symptoms", "Data links more short-form scrolling with sadness."],
      [
        "More anxiety",
        "It's the cuts and the shortness, not the content. Even funny reels do it; watch a 20-minute funny video instead.",
      ],
      [
        "More loneliness",
        "Like candy when you're hungry: it never meets the need for connection (see the loneliness section).",
      ],
    ],
  },
];

function Card({ title, detail }: { title: string; detail: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      className="my-2 block w-full rounded-lg border bg-card px-3 py-2.5 text-left transition-colors hover:border-brand"
    >
      <span className="flex items-center justify-between gap-2 font-semibold">
        {title}
        <ChevronDownIcon className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")} />
      </span>
      {/* Kept in the DOM (just hidden) so the text stays indexable. */}
      <span className={cn("mt-1 block text-sm text-muted-foreground", !open && "hidden")}>{detail}</span>
    </button>
  );
}

export function LongVsShort() {
  return (
    <Widget title="Long-form vs short-form: click each card for details">
      <div className="grid gap-3.5 md:grid-cols-2">
        {COLUMNS.map((col) => (
          <div key={col.title} className={cn("rounded-xl border p-3.5", col.tone)}>
            <b>{col.title}</b>
            {col.items.map(([title, detail]) => (
              <Card key={title} title={title} detail={detail} />
            ))}
          </div>
        ))}
      </div>
    </Widget>
  );
}
