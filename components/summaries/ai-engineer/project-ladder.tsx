"use client";

import { useState } from "react";
import { useLocalized } from "@/components/providers/locale-provider";
import { Widget } from "@/components/summary/exercise";
import { cn } from "@/lib/utils";

const TEXT = {
  en: {
    title: "Project ladder",
    label: "Project steps",
    steps: [
      {
        step: "Step 1",
        name: "Simple personal project",
        points: [
          "Pick a small problem you care about: a bot over your family recipes, or a daily news brief.",
          "Get a first version working fast. It doesn't need to impress anyone.",
          "Code by hand and struggle a bit; use AI to explain new concepts, not to write it for you.",
          "Proves to you what you actually understand, and what to go back and review.",
        ],
      },
      {
        step: "Step 2",
        name: "Production-ready",
        points: [
          "Add proper evals so you can measure whether it works.",
          "Experiment with context engineering and RAG; add tools and make it an agent if the problem calls for it.",
          "Deploy it where people can use it, with monitoring and logging.",
          "Think about cost, speed, security and users behaving in ways you didn't expect.",
          "Proves you can take an AI system from idea to something reliable.",
        ],
      },
      {
        step: "Step 3",
        name: "Someone else's problem",
        points: [
          "Volunteer for a nonprofit, build for a hobby group, automate something for a friend's small business, or contribute to open source.",
          "Work with requirements you didn't make up, constraints you didn't choose and real users.",
          "Proves you can solve problems for others, and can count as experience on your resume.",
        ],
      },
    ],
  },
  hi: {
    title: "Project ladder",
    label: "Project steps",
    steps: [
      {
        step: "Step 1",
        name: "Simple personal project",
        points: [
          "कोई छोटी problem चुनें जिसकी आपको परवाह हो: family recipes पर एक bot, या daily news brief।",
          "पहला version जल्दी चला दें। इसे किसी को impress करने की ज़रूरत नहीं।",
          "हाथ से code करें और थोड़ा struggle करें; AI से नए concepts समझें, उससे लिखवाएँ नहीं।",
          "आपको दिखाता है कि आप असल में क्या समझते हैं, और किसे वापस जाकर review करना है।",
        ],
      },
      {
        step: "Step 2",
        name: "Production-ready",
        points: [
          "Proper evals जोड़ें ताकि measure कर सकें कि यह काम करता है।",
          "Context engineering और RAG के साथ experiment करें; problem में fit हो तो tools जोड़कर agent बनाएँ।",
          "Monitoring और logging के साथ ऐसी जगह deploy करें जहाँ लोग use कर सकें।",
          "Cost, speed, security और users के अनपेक्षित behavior के बारे में सोचें।",
          "साबित करता है कि आप AI system को idea से reliable चीज़ तक ले जा सकते हैं।",
        ],
      },
      {
        step: "Step 3",
        name: "किसी और की problem",
        points: [
          "किसी nonprofit के लिए volunteer करें, hobby group के लिए बनाएँ, दोस्त के small business का कुछ automate करें, या open source में contribute करें।",
          "ऐसी requirements के साथ काम करें जो आपने नहीं बनाईं, ऐसी constraints जो आपने नहीं चुनीं, और real users के साथ।",
          "साबित करता है कि आप दूसरों की problems solve कर सकते हैं, और resume पर experience के रूप में गिना जा सकता है।",
        ],
      },
    ],
  },
};

export function ProjectLadder() {
  const t = useLocalized(TEXT);
  const [active, setActive] = useState(0);
  const step = t.steps[active];

  return (
    <Widget title={t.title}>
      <div role="tablist" aria-label={t.label} className="grid grid-cols-3 gap-2">
        {t.steps.map((s, i) => (
          <button
            key={s.step}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={cn(
              "rounded-xl border px-2 py-2.5 text-center transition-colors",
              active === i ? "border-brand bg-brand/10" : "bg-card hover:bg-muted",
            )}
          >
            <div className="text-xs text-muted-foreground">{s.step}</div>
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
