"use client";

import { useLocalized, useT } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Exercise } from "@/components/summary/exercise";
import { useExerciseProgress } from "@/components/summary/progress-provider";
import { CopyButton, Output, TextAreaField, TextField, orPlaceholder } from "@/components/summary/widget-ui";

interface State {
  name: string;
  goal: string;
  steps: string;
  example: string;
}

const INITIAL: State = { name: "", goal: "", steps: "", example: "" };

const PLACEHOLDERS: State = {
  name: "add-logging",
  goal: "Add structured logging to the referenced file",
  steps:
    "Import the logging library\nCreate a logger object for the module\nLog at the start of every function with relevant context\nLog errors in every exception block",
  example: 'logger = logging.getLogger(__name__)\nlogger.info("create_task", extra={"user_id": user_id})',
};

const TEXT = {
  en: {
    title: "Build your first slash command",
    intro:
      "Any prompt you've written more than twice is a command. Fill this in, save the output as a markdown file and commit it so your whole team gets it.",
    labels: {
      name: "Command name (you'll type /name)",
      goal: "What it does, in one line",
      steps: "Exact instructions, one per line",
      example: "Reference snippet (optional)",
    },
    saveAs: "Save as",
    usage: (name: string) => `Use it: open a new chat, type /${name} and @ the file you want it applied to.`,
  },
  hi: {
    title: "अपनी पहली slash command बनाएँ",
    intro:
      "जो prompt आपने दो बार से ज़्यादा लिखा है, वो command होना चाहिए। इसे भरें, output को markdown file के रूप में save करें और commit करें ताकि पूरी team को मिले।",
    labels: {
      name: "Command का नाम (आप /name type करेंगे)",
      goal: "यह क्या करती है, एक line में",
      steps: "Exact instructions, हर line पर एक",
      example: "Reference snippet (optional)",
    },
    saveAs: "Save करें",
    usage: (name: string) => `Use करें: नई chat खोलें, /${name} type करें और जिस file पर लगाना है उसे @ करें।`,
  },
};

function build(state: State) {
  const name = orPlaceholder(state.name, PLACEHOLDERS.name).replace(/^\/+/, "").replace(/\s+/g, "-");
  const goal = orPlaceholder(state.goal, PLACEHOLDERS.goal);
  const steps = (state.steps.trim() || PLACEHOLDERS.steps)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => `${i + 1}. ${line}`)
    .join("\n");
  const example = state.example.trim() || (state.name.trim() ? "" : PLACEHOLDERS.example);

  let file = `# ${name}\n\n${goal}.\n\n## Steps\n\n${steps}\n`;
  if (example) file += `\n## Reference\n\n\`\`\`\n${example}\n\`\`\`\n`;
  return { name, file };
}

export function CommandBuilder() {
  const t = useLocalized(TEXT);
  const common = useT();
  const [state, setState, reset] = useExerciseProgress<State>("cursor-command", INITIAL);
  const { name, file } = build(state);
  const set = (patch: Partial<State>) => setState((prev) => ({ ...prev, ...patch }));

  return (
    <Exercise id="cursor-command" title={t.title}>
      <p className="mt-0! text-[13px] text-muted-foreground">{t.intro}</p>
      <TextField label={t.labels.name} placeholder={PLACEHOLDERS.name} value={state.name} onChange={(v) => set({ name: v })} />
      <TextField label={t.labels.goal} placeholder={PLACEHOLDERS.goal} value={state.goal} onChange={(v) => set({ goal: v })} />
      <TextAreaField
        label={t.labels.steps}
        placeholder={PLACEHOLDERS.steps}
        value={state.steps}
        onChange={(v) => set({ steps: v })}
      />
      <TextAreaField
        label={t.labels.example}
        placeholder={PLACEHOLDERS.example}
        value={state.example}
        onChange={(v) => set({ example: v })}
      />
      <p className="mt-3! mb-1! text-[13px] text-muted-foreground">
        {t.saveAs} <code>.cursor/commands/{name}.md</code>
      </p>
      <Output className="mt-0!">{file}</Output>
      <p className="mt-2! mb-0! text-[13px] text-muted-foreground">{t.usage(name)}</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        <CopyButton text={file} />
        <Button type="button" variant="ghost" size="sm" onClick={reset}>
          {common.widget.clear}
        </Button>
      </div>
    </Exercise>
  );
}
