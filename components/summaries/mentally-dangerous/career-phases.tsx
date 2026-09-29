"use client";

import { useState } from "react";
import { Widget } from "@/components/summary/exercise";
import { cn } from "@/lib/utils";

const PHASES = [
  {
    years: "Years 1-3",
    name: "Gas pedal",
    points: [
      "Go all in: work, learn, repeat. Reset only as much as you need to keep coming back.",
      "Find your edge: how little sleep, how many hours, before you break? Then stay back from it.",
      "The only rule: don't die. No crazy risks with your health.",
      "You can't know what something could become until you've given it about three years of near-extreme effort.",
    ],
  },
  {
    years: "Years 4-6",
    name: "Dynamically regulate",
    points: [
      "This is when people who never learned to switch off start breaking: hair loss, skin issues, autoimmune problems, chronic fatigue.",
      "The cause: nighttime cortisol stays too high, so the nervous, endocrine and immune systems never reset.",
      "Driven, \"electric\" people don't crash. They keep going while their baseline quietly drops.",
      "Learn to bring balance in. The unit of time is the day: what can I do today, knowing I'm coming back tomorrow?",
    ],
  },
  {
    years: "Years 7+",
    name: "Pro",
    points: [
      "You know when you're stressed, when you need yoga nidra, and when to get off your phone.",
      "Now you can fine-tune, savor what you built, and guide your team.",
      "The top layer: ultra-disciplined and super-focused, but playful, because they're secure.",
    ],
  },
];

export function CareerPhases() {
  const [active, setActive] = useState(0);
  const phase = PHASES[active];

  return (
    <Widget title="The 10-year arc">
      <div role="tablist" aria-label="Career phases" className="grid grid-cols-3 gap-2">
        {PHASES.map((p, i) => (
          <button
            key={p.years}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={cn(
              "rounded-xl border px-2 py-2.5 text-center transition-colors",
              active === i ? "border-brand bg-brand/10" : "bg-card hover:bg-muted",
            )}
          >
            <div className="text-xs text-muted-foreground">{p.years}</div>
            <div className="font-bold text-brand">{p.name}</div>
          </button>
        ))}
      </div>
      <ul role="tabpanel" className="mt-3! mb-0!">
        {phase.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </Widget>
  );
}
