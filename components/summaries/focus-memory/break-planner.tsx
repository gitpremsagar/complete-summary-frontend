"use client";

import { Exercise } from "@/components/summary/exercise";
import { useExerciseProgress } from "@/components/summary/progress-provider";
import { TextField } from "@/components/summary/widget-ui";

type Key = "micro" | "meso" | "macro";
type State = Record<Key, string>;

const INITIAL: State = { micro: "", meso: "", macro: "" };

const BREAKS: { key: Key; name: string; when: string; length: string; label: string; placeholder: string }[] = [
  {
    key: "micro",
    name: "Micro",
    when: "Every day",
    length: "A few minutes: at least 10, ideally 15-20 (varies by person)",
    label: "My daily micro break:",
    placeholder: "e.g. 15 min juggling practice",
  },
  {
    key: "meso",
    name: "Meso",
    when: "Every week",
    length: "2-4 hours (focus on the 2 if 4 feels like too much)",
    label: "My weekly meso break:",
    placeholder: "e.g. Sunday: a new hiking trail",
  },
  {
    key: "macro",
    name: "Macro",
    when: "Every month",
    length: "Half a day to a full day (the half is fine)",
    label: "My monthly macro break:",
    placeholder: "e.g. a full-day cooking class",
  },
];

export function BreakPlanner() {
  const [state, setState] = useExerciseProgress<State>("3m-breaks", INITIAL);

  return (
    <Exercise id="3m-breaks" title="3M break planner">
      <div className="grid gap-3 md:grid-cols-3">
        {BREAKS.map((b) => (
          <div key={b.key} className="rounded-xl border bg-muted p-3.5 text-center">
            <div className="text-[26px] font-extrabold text-brand">{b.name}</div>
            <b>{b.when}</b>
            <div className="text-sm">{b.length}</div>
            <div className="text-left">
              <TextField
                label={b.label}
                placeholder={b.placeholder}
                value={state[b.key]}
                onChange={(value) => setState((prev) => ({ ...prev, [b.key]: value }))}
              />
            </div>
          </div>
        ))}
      </div>
    </Exercise>
  );
}
