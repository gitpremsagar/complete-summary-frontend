"use client";

import { Button } from "@/components/ui/button";
import { Exercise } from "@/components/summary/exercise";
import { useExerciseProgress } from "@/components/summary/progress-provider";
import { CopyButton, Output, TextField, orPlaceholder } from "@/components/summary/widget-ui";

const FIELDS = [
  { key: "topic", label: "What do you want to change? (e.g. sleep, fitness, focus)", placeholder: "sleep" },
  {
    key: "value",
    label: '1. Identity / value: "I prioritize ___ because ___"',
    placeholder: "my health because I know how important it is for my performance and my business",
  },
  { key: "data", label: "2. Data you know is true", placeholder: "I know the data on sleep and health" },
  {
    key: "benefit",
    label: "3. What gets better if you do it",
    placeholder: "I'd be smarter, happier, more focused and ask better questions",
  },
  {
    key: "habit",
    label: "4. New habit (write it as if it's already true)",
    placeholder: "makes sure I sleep at least 6 to 7 hours a night",
  },
  { key: "edge", label: "The edge it gives you", placeholder: "an edge in my business" },
] as const;

type Key = (typeof FIELDS)[number]["key"];
type State = Record<Key, string>;

const INITIAL: State = { topic: "", value: "", data: "", benefit: "", habit: "", edge: "" };

function build(state: State) {
  const v = (key: Key) => orPlaceholder(state[key], FIELDS.find((f) => f.key === key)!.placeholder);
  return `Identity: I prioritize ${v("value")}.
Data: ${v("data")}.
Benefit: If I do this, ${v("benefit")}.

My identity-based belief (${v("topic")}):
"I'm the type of person who ${v("habit")}, because I know what ${v("edge")} it's going to give me."

Don't worry that it isn't true yet. Review it every day. Fake it till you make it.`;
}

export function IdentityBuilder() {
  const [state, setState, reset] = useExerciseProgress<State>("identity-belief", INITIAL);
  const output = build(state);

  return (
    <Exercise id="identity-belief" title="Build your identity-based belief">
      {FIELDS.map((field) => (
        <TextField
          key={field.key}
          label={field.label}
          placeholder={field.placeholder}
          value={state[field.key]}
          onChange={(value) => setState((prev) => ({ ...prev, [field.key]: value }))}
        />
      ))}
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
