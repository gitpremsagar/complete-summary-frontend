"use client";

import { useLocalized, useT } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Exercise } from "@/components/summary/exercise";
import { useExerciseProgress } from "@/components/summary/progress-provider";
import { CopyButton, Output, TextField, orPlaceholder } from "@/components/summary/widget-ui";

const KEYS = ["topic", "value", "data", "benefit", "habit", "edge"] as const;

type Key = (typeof KEYS)[number];
type State = Record<Key, string>;
type Field = { label: string; placeholder: string };

const INITIAL: State = { topic: "", value: "", data: "", benefit: "", habit: "", edge: "" };

const TEXT: Record<"en" | "hi", { title: string; fields: Record<Key, Field>; build: (v: (key: Key) => string) => string }> = {
  en: {
    title: "Build your identity-based belief",
    fields: {
      topic: { label: "What do you want to change? (e.g. sleep, fitness, focus)", placeholder: "sleep" },
      value: {
        label: '1. Identity / value: "I prioritize ___ because ___"',
        placeholder: "my health because I know how important it is for my performance and my business",
      },
      data: { label: "2. Data you know is true", placeholder: "I know the data on sleep and health" },
      benefit: {
        label: "3. What gets better if you do it",
        placeholder: "I'd be smarter, happier, more focused and ask better questions",
      },
      habit: {
        label: "4. New habit (write it as if it's already true)",
        placeholder: "makes sure I sleep at least 6 to 7 hours a night",
      },
      edge: { label: "The edge it gives you", placeholder: "an edge in my business" },
    },
    build: (v) => `Identity: I prioritize ${v("value")}.
Data: ${v("data")}.
Benefit: If I do this, ${v("benefit")}.

My identity-based belief (${v("topic")}):
"I'm the type of person who ${v("habit")}, because I know what ${v("edge")} it's going to give me."

Don't worry that it isn't true yet. Review it every day. Fake it till you make it.`,
  },
  hi: {
    title: "अपना identity-based belief बनाएँ",
    fields: {
      topic: { label: "आप क्या बदलना चाहते हैं? (जैसे sleep, fitness, focus)", placeholder: "sleep" },
      value: {
        label: '1. Identity / value: "मैं ___ को priority देता हूँ क्योंकि ___"',
        placeholder: "अपनी health को, क्योंकि मुझे पता है यह मेरी performance और business के लिए कितनी ज़रूरी है",
      },
      data: { label: "2. Data जो आप जानते हैं कि सच है", placeholder: "मुझे sleep और health का data पता है" },
      benefit: {
        label: "3. ऐसा करने से क्या बेहतर होगा",
        placeholder: "मैं ज़्यादा smart, ख़ुश और focused रहूँगा और बेहतर सवाल पूछूँगा",
      },
      habit: {
        label: "4. नई habit (ऐसे लिखें जैसे यह पहले से सच है)",
        placeholder: "हर रात कम से कम 6 से 7 घंटे सोना पक्का करता है",
      },
      edge: { label: "इससे मिलने वाला edge", placeholder: "मेरे business में edge" },
    },
    build: (v) => `Identity: मैं ${v("value")} priority देता हूँ।
Data: ${v("data")}।
Benefit: अगर मैं यह करूँ, तो ${v("benefit")}।

मेरा identity-based belief (${v("topic")}):
"मैं ऐसा इंसान हूँ जो ${v("habit")}, क्योंकि मुझे पता है इससे मुझे ${v("edge")} मिलेगा।"

चिंता न करें कि यह अभी सच नहीं है। इसे रोज़ review करें। Fake it till you make it.`,
  },
};

export function IdentityBuilder() {
  const t = useLocalized(TEXT);
  const common = useT();
  const [state, setState, reset] = useExerciseProgress<State>("identity-belief", INITIAL);
  const output = t.build((key) => orPlaceholder(state[key], t.fields[key].placeholder));

  return (
    <Exercise id="identity-belief" title={t.title}>
      {KEYS.map((key) => (
        <TextField
          key={key}
          label={t.fields[key].label}
          placeholder={t.fields[key].placeholder}
          value={state[key]}
          onChange={(value) => setState((prev) => ({ ...prev, [key]: value }))}
        />
      ))}
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
