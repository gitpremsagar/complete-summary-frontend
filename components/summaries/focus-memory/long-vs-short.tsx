"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { useLocalized } from "@/components/providers/locale-provider";
import { Widget } from "@/components/summary/exercise";
import { cn } from "@/lib/utils";

const TONES = ["bg-good/10", "bg-bad/10"];

const TEXT = {
  en: {
    title: "Long-form vs short-form: click each card for details",
    columns: [
      {
        title: "Long-form (films, long podcasts, long YouTube)",
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
    ],
  },
  hi: {
    title: "Long-form vs short-form: details के लिए हर card पर click करें",
    columns: [
      {
        title: "Long-form (films, लंबे podcasts, लंबे YouTube videos)",
        items: [
          ["Story और narration", "उतार-चढ़ाव और unexpected turns DMN को engage करते हैं, जो creativity चलाता है।"],
          ["Autobiographical planning", '"आपकी story" और future planning की rehearsal करवाता है।'],
          ["Empathy", "Character building और personalization; एक study में films से empathy बढ़ी।"],
          ["Memory = learning", "Long-form content याद रहता है, इसलिए आप सच में सीखते हैं।"],
          ["Connection", "Empathy से आप ज़्यादा connect करते हैं, जो loneliness का उल्टा है।"],
        ],
      },
      {
        title: "Short-form (reels, shorts, endless scroll)",
        items: [
          ["Pure novelty", 'एक चीज़ से दूसरी पर कूदना, "just like crack," पकड़ने को कुछ नहीं।'],
          ["No memory, no learning", "तीन reels पहले क्या देखा था, याद है? Memory के बिना learning नहीं होती।"],
          ["ज़्यादा depressive symptoms", "Data के अनुसार ज़्यादा short-form scrolling का संबंध उदासी से है।"],
          [
            "ज़्यादा anxiety",
            "वजह cuts और छोटापन है, content नहीं। Funny reels भी यही करती हैं; उसकी जगह 20 minute का funny video देखें।",
          ],
          [
            "ज़्यादा loneliness",
            "भूख में candy जैसा: connection की ज़रूरत कभी पूरी नहीं करता (loneliness वाला section देखें)।",
          ],
        ],
      },
    ],
  },
};

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
  const t = useLocalized(TEXT);
  return (
    <Widget title={t.title}>
      <div className="grid gap-3.5 md:grid-cols-2">
        {t.columns.map((col, i) => (
          <div key={col.title} className={cn("rounded-xl border p-3.5", TONES[i])}>
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
