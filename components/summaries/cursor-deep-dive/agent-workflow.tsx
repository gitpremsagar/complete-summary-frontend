"use client";

import { useState } from "react";
import { useLocalized } from "@/components/providers/locale-provider";
import { Widget } from "@/components/summary/exercise";
import { cn } from "@/lib/utils";

const TEXT = {
  en: {
    title: "The plan-then-agent workflow",
    label: "Workflow steps",
    steps: [
      {
        name: "Plan",
        points: [
          "Switch the chat to plan mode and describe the feature. No code is written yet.",
          "You get an architecture overview, the schema changes and a checklist of every step.",
          "Have a requirements doc or PR? Bring it in with @file so the plan is built from it and you skip the clarifying questions.",
        ],
      },
      {
        name: "Edit",
        points: [
          "The plan is yours: add a to-do, remove anything out of scope, adjust the approach.",
          "Vague instructions in agent mode lead to vague output. A clear plan saves multiple correction cycles.",
        ],
      },
      {
        name: "Commit",
        points: [
          "Make a git commit before you hit Build. Not after, before.",
          "If the agent touches 15 files and goes the wrong way, you have a clean revert point.",
        ],
      },
      {
        name: "Build",
        points: [
          "Hit Build and Cursor switches into agent mode and works through the checklist.",
          "Migration, model, API endpoints, front end, ticking off each item. You mostly watch and occasionally review.",
        ],
      },
      {
        name: "Test",
        points: [
          "The code is already on disk as the agent writes it.",
          "Run the app and check the behavior before you hit Keep All, because the Undo All window closes as you keep building.",
        ],
      },
      {
        name: "Review",
        points: [
          "Ask a second model to review the changes before you accept them.",
          "It catches things the first model missed, with no extra tools.",
        ],
      },
      {
        name: "Keep",
        points: [
          "Accept once it's tested and reviewed. If something went wrong, Undo All or revert to your commit.",
          "Understand the changes before you accept them: the code you ship is your responsibility.",
        ],
      },
    ],
  },
  hi: {
    title: "पहले plan, फिर agent वाला workflow",
    label: "Workflow steps",
    steps: [
      {
        name: "Plan",
        points: [
          "Chat को plan mode में करें और feature describe करें। अभी कोई code नहीं लिखा जाता।",
          "आपको architecture overview, schema changes और हर step की checklist मिलती है।",
          "Requirements doc या PR है? उसे @file से लाएँ ताकि plan उसी से बने और clarifying questions skip हो जाएँ।",
        ],
      },
      {
        name: "Edit",
        points: [
          "Plan आपका है: to-do जोड़ें, scope से बाहर की चीज़ हटाएँ, approach बदलें।",
          "Agent mode में vague instructions से vague output मिलता है। साफ़ plan कई correction cycles बचाता है।",
        ],
      },
      {
        name: "Commit",
        points: [
          "Build दबाने से पहले git commit करें। बाद में नहीं, पहले।",
          "अगर agent 15 files छूकर ग़लत दिशा में चला जाए, तो आपके पास साफ़ revert point है।",
        ],
      },
      {
        name: "Build",
        points: [
          "Build दबाते ही Cursor agent mode में चला जाता है और checklist पर काम करता है।",
          "Migration, model, API endpoints, front end, हर item tick करते हुए। आप ज़्यादातर देखते हैं और बीच-बीच में review करते हैं।",
        ],
      },
      {
        name: "Test",
        points: [
          "Agent जैसे-जैसे लिखता है, code उसी समय disk पर होता है।",
          "Keep All से पहले app चलाकर behavior check करें, क्योंकि आगे build करते रहने पर Undo All का मौका निकल जाता है।",
        ],
      },
      {
        name: "Review",
        points: [
          "Accept करने से पहले किसी दूसरे model से changes review करवाएँ।",
          "पहले model से जो छूटा वो पकड़ लेता है, बिना किसी extra tool के।",
        ],
      },
      {
        name: "Keep",
        points: [
          "Test और review के बाद accept करें। कुछ ग़लत हुआ तो Undo All या अपने commit पर revert करें।",
          "Accept करने से पहले changes समझें: जो code आप ship करते हैं उसकी ज़िम्मेदारी आपकी है।",
        ],
      },
    ],
  },
};

export function AgentWorkflow() {
  const t = useLocalized(TEXT);
  const [active, setActive] = useState(0);
  const step = t.steps[active];

  return (
    <Widget title={t.title}>
      <div role="tablist" aria-label={t.label} className="grid grid-cols-[repeat(auto-fit,minmax(78px,1fr))] gap-2">
        {t.steps.map((s, i) => (
          <button
            key={s.name}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={cn(
              "rounded-xl border px-2 py-2.5 text-center transition-colors",
              active === i ? "border-brand bg-brand/10" : "bg-card hover:bg-muted",
            )}
          >
            <div className="text-xs text-muted-foreground">{i + 1}</div>
            <div className="font-bold text-brand">{s.name}</div>
          </button>
        ))}
      </div>
      <ul role="tabpanel" className="mt-3! mb-0!">
        {step.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </Widget>
  );
}
