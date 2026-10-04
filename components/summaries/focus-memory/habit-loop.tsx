"use client";

import { useId, useState } from "react";
import { useLocalized } from "@/components/providers/locale-provider";
import { Widget } from "@/components/summary/exercise";
import { Output } from "@/components/summary/widget-ui";

const STATES = [
  { old: 18, fresh: 2, opacity: 0.15 },
  { old: 16, fresh: 5, opacity: 0.5 },
  { old: 12, fresh: 9, opacity: 0.8 },
  { old: 7, fresh: 13, opacity: 1 },
  { old: 3, fresh: 17, opacity: 1 },
];

const TEXT = {
  en: {
    title: "Habit loop: watch the old pathway weaken",
    aria: "Habit loop diagram",
    nodes: {
      feeling: ["Feeling", "overwhelm / stress / tired"],
      scrolling: ["Scrolling", "45 min of reels"],
      shame: ["Shame +", "still overwhelmed"],
      pause: ["Pause + 60s", "eyes closed / breathe"],
    },
    slider: "Time spent practicing the cognitive pause:",
    scale: "Day 0 · 1 week · 1 month · 3 months · 6 months",
    states: [
      {
        label: "Day 0 (old habit only)",
        text: 'The red loop is a deep, automatic road: feeling, then scrolling, then shame, then back to the feeling. "Raj is not driving this car."',
      },
      {
        label: "1 week of pausing",
        text: "You start taking a cognitive pause and closing your eyes for 60 seconds. Often you still scroll afterwards, and that's allowed. The energy now passes through the new node first.",
      },
      {
        label: "1 month",
        text: '"After one month of closing your eyes after the feeling instead of going immediately... it gets skinnier." Sometimes you choose something else entirely.',
      },
      {
        label: "3 months",
        text: '"After 3 months it\'s even skinnier." The replacement route is becoming the default. You are practicing emotional regulation.',
      },
      {
        label: "6 months",
        text: "The old pathway has been pruned and the new one is strong. This is how you kill bad habits and build new ones, one tiny pattern interrupt at a time.",
      },
    ],
  },
  hi: {
    title: "Habit loop: पुराने pathway को कमज़ोर होते देखें",
    aria: "Habit loop diagram",
    nodes: {
      feeling: ["Feeling", "overwhelm / stress / थकान"],
      scrolling: ["Scrolling", "45 min of reels"],
      shame: ["Shame +", "फिर भी overwhelmed"],
      pause: ["Pause + 60s", "आँखें बंद / साँस"],
    },
    slider: "Cognitive pause की practice का समय:",
    scale: "Day 0 · 1 हफ़्ता · 1 महीना · 3 महीने · 6 महीने",
    states: [
      {
        label: "Day 0 (सिर्फ़ पुरानी habit)",
        text: 'लाल loop एक गहरी, automatic सड़क है: feeling, फिर scrolling, फिर shame, फिर वापस feeling। "Raj is not driving this car."',
      },
      {
        label: "1 हफ़्ता pause करते हुए",
        text: "आप cognitive pause लेना और 60 seconds के लिए आँखें बंद करना शुरू करते हैं। अक्सर बाद में फिर भी scroll करते हैं, और इसकी छूट है। अब energy पहले नए node से होकर गुज़रती है।",
      },
      {
        label: "1 महीना",
        text: '"After one month of closing your eyes after the feeling instead of going immediately... it gets skinnier." कभी-कभी आप कुछ बिल्कुल अलग चुनते हैं।',
      },
      {
        label: "3 महीने",
        text: '"After 3 months it\'s even skinnier." Replacement route default बन रहा है। आप emotional regulation practice कर रहे हैं।',
      },
      {
        label: "6 महीने",
        text: "पुराना pathway prune हो चुका है और नया मज़बूत है। Bad habits ख़त्म करने और नई बनाने का यही तरीका है, एक-एक tiny pattern interrupt से।",
      },
    ],
  },
};

const OLD_PATHS = [
  "M150,165 C260,60 380,60 470,90",
  "M560,120 C640,190 600,280 470,285",
  "M330,285 C220,285 160,250 140,205",
];

export function HabitLoop() {
  const t = useLocalized(TEXT);
  const [step, setStep] = useState(0);
  const s = STATES[step];
  const n = t.nodes;
  const sliderId = useId();
  const marker = `habit-arrow-${sliderId.replace(/[^\w-]/g, "")}`;
  const pathStyle = { transition: "stroke-width .5s, opacity .5s" };

  return (
    <Widget title={t.title}>
      <svg
        viewBox="0 0 760 330"
        role="img"
        aria-label={t.aria}
        className="h-auto w-full rounded-xl border bg-card"
        style={{ fontSize: 13, fontWeight: 600 }}
      >
        <defs>
          <marker
            id={marker}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#888" />
          </marker>
        </defs>
        {OLD_PATHS.map((d) => (
          <path
            key={d}
            d={d}
            stroke="#ff6b81"
            fill="none"
            strokeWidth={s.old}
            markerEnd={`url(#${marker})`}
            style={{ ...pathStyle, opacity: 0.35 + s.old / 28 }}
          />
        ))}
        <path
          d="M150,165 C220,200 260,200 300,200"
          stroke="#5ee6a0"
          fill="none"
          strokeWidth={s.fresh}
          markerEnd={`url(#${marker})`}
          style={{ ...pathStyle, opacity: s.opacity }}
        />
        <path
          d="M420,200 C470,190 490,150 500,125"
          stroke="#5ee6a0"
          fill="none"
          strokeWidth={Math.max(2, s.old * 0.5)}
          strokeDasharray="6 6"
          markerEnd={`url(#${marker})`}
          style={{ ...pathStyle, opacity: s.opacity }}
        />
        <circle cx="100" cy="165" r="58" fill="#7c9cff" />
        <text x="100" y="160" textAnchor="middle" fill="#fff">
          {n.feeling[0]}
        </text>
        <text x="100" y="178" textAnchor="middle" fill="#fff" fontSize="10.5">
          {n.feeling[1]}
        </text>
        <circle cx="520" cy="95" r="52" fill="#ff6b81" />
        <text x="520" y="92" textAnchor="middle" fill="#fff">
          {n.scrolling[0]}
        </text>
        <text x="520" y="109" textAnchor="middle" fill="#fff" fontSize="10.5">
          {n.scrolling[1]}
        </text>
        <circle cx="400" cy="285" r="44" fill="#ffb86b" />
        <text x="400" y="282" textAnchor="middle" fill="#222">
          {n.shame[0]}
        </text>
        <text x="400" y="298" textAnchor="middle" fill="#222" fontSize="10.5">
          {n.shame[1]}
        </text>
        <g style={{ opacity: s.opacity, transition: "opacity .5s" }}>
          <rect x="300" y="175" width="120" height="50" rx="14" fill="#5ee6a0" />
          <text x="360" y="197" textAnchor="middle" fill="#0b3">
            {n.pause[0]}
          </text>
          <text x="360" y="214" textAnchor="middle" fill="#063" fontSize="10.5">
            {n.pause[1]}
          </text>
        </g>
      </svg>
      <label htmlFor={sliderId} className="mt-3 mb-1 block text-[13px] text-muted-foreground">
        {t.slider} <b className="text-foreground">{t.states[step].label}</b>
      </label>
      <input
        id={sliderId}
        type="range"
        min={0}
        max={STATES.length - 1}
        step={1}
        value={step}
        onChange={(e) => setStep(Number(e.target.value))}
        className="w-full accent-(--brand)"
      />
      <div className="text-[13px] text-muted-foreground">{t.scale}</div>
      <Output>{t.states[step].text}</Output>
    </Widget>
  );
}
