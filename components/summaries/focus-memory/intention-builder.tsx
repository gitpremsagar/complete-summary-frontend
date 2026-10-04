"use client";

import { useLocalized, useT } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Exercise } from "@/components/summary/exercise";
import { useExerciseProgress } from "@/components/summary/progress-provider";
import {
  CopyButton,
  Output,
  SelectField,
  TextAreaField,
  TextField,
  orPlaceholder,
} from "@/components/summary/widget-ui";

interface State {
  type: "add" | "cut";
  when: string;
  where: string;
  then: string;
}

type Parts = Pick<State, "when" | "where" | "then">;

const INITIAL: State = { type: "add", when: "", where: "", then: "" };

const TEXT: Record<
  "en" | "hi",
  {
    title: string;
    type: string;
    add: string;
    cut: string;
    labels: Parts;
    placeholders: Parts;
    buildAdd: (p: Parts) => string;
    buildCut: (p: Parts) => string;
  }
> = {
  en: {
    title: "Write your implementation intention (when-then)",
    type: "Type",
    add: "Add a good habit",
    cut: "Replace a bad habit",
    labels: {
      when: "WHEN (the exact situation or trigger, as clear as humanly possible)",
      where: "WHERE am I and what does it look like? (describe it like a movie)",
      then: "THEN I will... (make the first step tiny and easy)",
    },
    placeholders: {
      when: "my alarm goes off at 11 p.m. / I feel a craving to open Instagram",
      where: "in my bedroom, in pajamas, phone on the charger across the room",
      then: "brush my teeth, start my wind-down playlist, make herbal tea",
    },
    buildAdd: ({ when, where, then }) => `WHEN ${when},
and I'm ${where},
THEN I will ${then}.

Tips: keep the first step tiny (e.g. just brush your teeth at 11), and make the WHEN as clear as humanly possible.`,
    buildCut: ({ when, where, then }) => `WHEN ${when},
I take a cognitive pause and ask: "What am I feeling right now? Why do I want this?"
(I picture it: ${where}.)
THEN, instead, I will ${then}.

If after that I still want to do the old habit, I'm allowed to, but I always pause first. The old road gets thinner every time.`,
  },
  hi: {
    title: "अपना implementation intention लिखें (when-then)",
    type: "Type",
    add: "अच्छी habit जोड़ें",
    cut: "बुरी habit बदलें",
    labels: {
      when: "WHEN (exact situation या trigger, जितना हो सके उतना साफ़)",
      where: "मैं WHERE हूँ और वो कैसा दिखता है? (movie की तरह describe करें)",
      then: "THEN मैं... (पहला step tiny और आसान रखें)",
    },
    placeholders: {
      when: "रात 11 बजे मेरा alarm बजता है / मुझे Instagram खोलने की craving होती है",
      where: "अपने bedroom में, pajamas में, phone कमरे के दूसरी तरफ़ charger पर",
      then: "brush करूँगा, wind-down playlist चलाऊँगा, herbal tea बनाऊँगा",
    },
    buildAdd: ({ when, where, then }) => `WHEN ${when},
और मैं ${where} हूँ,
THEN मैं ${then}।

Tips: पहला step tiny रखें (जैसे 11 बजे बस brush करना), और WHEN को जितना हो सके उतना साफ़ बनाएँ।`,
    buildCut: ({ when, where, then }) => `WHEN ${when},
मैं cognitive pause लेकर पूछता हूँ: "मैं अभी क्या feel कर रहा हूँ? मुझे यह क्यों चाहिए?"
(मैं इसे imagine करता हूँ: ${where}।)
THEN, इसकी जगह मैं ${then}।

अगर उसके बाद भी पुरानी habit का मन हो, तो छूट है, लेकिन pause हमेशा पहले। हर बार पुरानी सड़क और पतली होती जाती है।`,
  },
};

export function IntentionBuilder() {
  const t = useLocalized(TEXT);
  const common = useT();
  const [state, setState, reset] = useExerciseProgress<State>("implementation-intention", INITIAL);
  const parts: Parts = {
    when: orPlaceholder(state.when, t.placeholders.when),
    where: orPlaceholder(state.where, t.placeholders.where),
    then: orPlaceholder(state.then, t.placeholders.then),
  };
  const output = state.type === "add" ? t.buildAdd(parts) : t.buildCut(parts);
  const set = (patch: Partial<State>) => setState((prev) => ({ ...prev, ...patch }));

  return (
    <Exercise id="implementation-intention" title={t.title}>
      <SelectField
        label={t.type}
        value={state.type}
        onChange={(type) => set({ type: type as State["type"] })}
        options={[
          { value: "add", label: t.add },
          { value: "cut", label: t.cut },
        ]}
      />
      <TextField
        label={t.labels.when}
        placeholder={t.placeholders.when}
        value={state.when}
        onChange={(when) => set({ when })}
      />
      <TextField
        label={t.labels.where}
        placeholder={t.placeholders.where}
        value={state.where}
        onChange={(where) => set({ where })}
      />
      <TextAreaField
        label={t.labels.then}
        placeholder={t.placeholders.then}
        value={state.then}
        onChange={(then) => set({ then })}
      />
      <Output>{output}</Output>
      <div className="mt-2.5 flex flex-wrap gap-2">
        <CopyButton text={output} />
        <Button type="button" variant="ghost" size="sm" onClick={reset}>
          {common.widget.clear}
        </Button>
      </div>
    </Exercise>
  );
}
