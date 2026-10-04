"use client";

import { useLocalized } from "@/components/providers/locale-provider";
import { Exercise } from "@/components/summary/exercise";
import { useExerciseProgress } from "@/components/summary/progress-provider";
import { TextField } from "@/components/summary/widget-ui";

type Key = "micro" | "meso" | "macro";
type State = Record<Key, string>;

const INITIAL: State = { micro: "", meso: "", macro: "" };

const KEYS: Key[] = ["micro", "meso", "macro"];

const TEXT = {
  en: {
    title: "3M break planner",
    breaks: [
      {
        name: "Micro",
        when: "Every day",
        length: "A few minutes: at least 10, ideally 15-20 (varies by person)",
        label: "My daily micro break:",
        placeholder: "e.g. 15 min juggling practice",
      },
      {
        name: "Meso",
        when: "Every week",
        length: "2-4 hours (focus on the 2 if 4 feels like too much)",
        label: "My weekly meso break:",
        placeholder: "e.g. Sunday: a new hiking trail",
      },
      {
        name: "Macro",
        when: "Every month",
        length: "Half a day to a full day (the half is fine)",
        label: "My monthly macro break:",
        placeholder: "e.g. a full-day cooking class",
      },
    ],
  },
  hi: {
    title: "3M break planner",
    breaks: [
      {
        name: "Micro",
        when: "हर दिन",
        length: "कुछ minutes: कम से कम 10, ideally 15-20 (हर व्यक्ति के लिए अलग)",
        label: "मेरा daily micro break:",
        placeholder: "जैसे 15 min juggling practice",
      },
      {
        name: "Meso",
        when: "हर हफ़्ते",
        length: "2-4 घंटे (4 ज़्यादा लगे तो 2 पर focus करें)",
        label: "मेरा weekly meso break:",
        placeholder: "जैसे Sunday: नया hiking trail",
      },
      {
        name: "Macro",
        when: "हर महीने",
        length: "आधे दिन से पूरा दिन (आधा भी ठीक है)",
        label: "मेरा monthly macro break:",
        placeholder: "जैसे पूरे दिन की cooking class",
      },
    ],
  },
};

export function BreakPlanner() {
  const t = useLocalized(TEXT);
  const [state, setState] = useExerciseProgress<State>("3m-breaks", INITIAL);

  return (
    <Exercise id="3m-breaks" title={t.title}>
      <div className="grid gap-3 md:grid-cols-3">
        {t.breaks.map((b, i) => {
          const key = KEYS[i];
          return (
            <div key={key} className="rounded-xl border bg-muted p-3.5 text-center">
              <div className="text-[26px] font-extrabold text-brand">{b.name}</div>
              <b>{b.when}</b>
              <div className="text-sm">{b.length}</div>
              <div className="text-left">
                <TextField
                  label={b.label}
                  placeholder={b.placeholder}
                  value={state[key]}
                  onChange={(value) => setState((prev) => ({ ...prev, [key]: value }))}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Exercise>
  );
}
