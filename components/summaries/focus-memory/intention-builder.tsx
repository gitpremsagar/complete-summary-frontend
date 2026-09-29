"use client";

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

const INITIAL: State = { type: "add", when: "", where: "", then: "" };

const PLACEHOLDERS = {
  when: "my alarm goes off at 11 p.m. / I feel a craving to open Instagram",
  where: "in my bedroom, in pajamas, phone on the charger across the room",
  then: "brush my teeth, start my wind-down playlist, make herbal tea",
};

function build(state: State) {
  const when = orPlaceholder(state.when, PLACEHOLDERS.when);
  const where = orPlaceholder(state.where, PLACEHOLDERS.where);
  const then = orPlaceholder(state.then, PLACEHOLDERS.then);

  if (state.type === "add") {
    return `WHEN ${when},
and I'm ${where},
THEN I will ${then}.

Tips: keep the first step tiny (e.g. just brush your teeth at 11), and make the WHEN as clear as humanly possible.`;
  }
  return `WHEN ${when},
I take a cognitive pause and ask: "What am I feeling right now? Why do I want this?"
(I picture it: ${where}.)
THEN, instead, I will ${then}.

If after that I still want to do the old habit, I'm allowed to, but I always pause first. The old road gets thinner every time.`;
}

export function IntentionBuilder() {
  const [state, setState, reset] = useExerciseProgress<State>("implementation-intention", INITIAL);
  const output = build(state);
  const set = (patch: Partial<State>) => setState((prev) => ({ ...prev, ...patch }));

  return (
    <Exercise id="implementation-intention" title="Write your implementation intention (when-then)">
      <SelectField
        label="Type"
        value={state.type}
        onChange={(type) => set({ type: type as State["type"] })}
        options={[
          { value: "add", label: "Add a good habit" },
          { value: "cut", label: "Replace a bad habit" },
        ]}
      />
      <TextField
        label="WHEN (the exact situation or trigger, as clear as humanly possible)"
        placeholder={PLACEHOLDERS.when}
        value={state.when}
        onChange={(when) => set({ when })}
      />
      <TextField
        label="WHERE am I and what does it look like? (describe it like a movie)"
        placeholder={PLACEHOLDERS.where}
        value={state.where}
        onChange={(where) => set({ where })}
      />
      <TextAreaField
        label="THEN I will... (make the first step tiny and easy)"
        placeholder={PLACEHOLDERS.then}
        value={state.then}
        onChange={(then) => set({ then })}
      />
      <Output>{output}</Output>
      <div className="mt-2.5 flex flex-wrap gap-2">
        <CopyButton text={output} />
        <Button type="button" variant="ghost" size="sm" onClick={reset}>
          Clear
        </Button>
      </div>
    </Exercise>
  );
}
