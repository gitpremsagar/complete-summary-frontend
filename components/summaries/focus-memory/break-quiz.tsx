"use client";

import { useState, type ReactNode } from "react";
import { Widget } from "@/components/summary/exercise";
import { cn } from "@/lib/utils";

type Verdict = "yes" | "no" | "meh";

const ITEMS: { verdict: Verdict; title: string; answer: ReactNode }[] = [
  {
    verdict: "no",
    title: "Scrolling Instagram or TikTok",
    answer: (
      <>
        No. The 2024 <i>Nature</i> study found scrolling is about the same as taking no break.
      </>
    ),
  },
  { verdict: "yes", title: "A walk outside in nature", answer: "Yes. It actually restores you, unlike scrolling." },
  {
    verdict: "meh",
    title: "The same run on the same route every day",
    answer: "Not ideal. You go on autopilot and your mind drifts back to your worries. Change it up and make it novel.",
  },
  {
    verdict: "yes",
    title: "Cooking a brand-new, complicated recipe",
    answer: 'Yes. You have to focus: "put the baggage down... my watchtower needs to be right here."',
  },
  {
    verdict: "meh",
    title: "Cooking a recipe you've made 100 times",
    answer: "Weak. You can chop vegetables while still worrying and thinking.",
  },
  {
    verdict: "yes",
    title: "Learning guitar, harmonica or juggling",
    answer: "Yes. A new, challenging skill demands all your energy and attention.",
  },
  {
    verdict: "no",
    title: 'Lying on the couch "resting" while mulling over deadlines',
    answer:
      "No. Resting is ideal in theory, but most people end up thinking about their stuff, so there's no detachment.",
  },
  {
    verdict: "yes",
    title: "Something so engaging you're in flow (like Raj hosting)",
    answer: "Oddly, yes. If it fully absorbs you and you truly stop worrying, flow can count.",
  },
];

const BORDER: Record<Verdict, string> = { yes: "border-good", no: "border-bad", meh: "border-warn" };

function QuizCard({ verdict, title, answer }: (typeof ITEMS)[number]) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      className={cn("rounded-xl border bg-card px-3 py-2.5 text-left transition-colors", open && BORDER[verdict])}
    >
      <b>{title}</b>
      <span className={cn("mt-1.5 block text-[13.5px]", !open && "hidden")}>{answer}</span>
    </button>
  );
}

export function BreakQuiz() {
  return (
    <Widget title="Is it a real break?">
      <p className="mt-0! text-[13px] text-muted-foreground">
        Test your ideas: is it a real &quot;complete psychological detachment&quot; break? Click each card.
      </p>
      <div className="mt-2.5 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5">
        {ITEMS.map((item) => (
          <QuizCard key={item.title} {...item} />
        ))}
      </div>
    </Widget>
  );
}
