"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Widget } from "@/components/summary/exercise";
import { Output } from "@/components/summary/widget-ui";

type DistrictId = "dmn" | "cen" | "dan" | "amy" | "sal" | "hip";

const DISTRICTS: Record<DistrictId, { name: string; real: string; description: string }> = {
  dmn: {
    name: "Story Studios",
    real: "Default Mode Network (DMN)",
    description:
      '"The story-making machine." The brain\'s storyteller and narrator: autobiographical narration, identity, daydreaming, mind wandering, and ideas. It holds your story ("I want to be the number one podcaster") and sends it to City Hall, which is where meaning comes from. Rewrite your stories here and review them daily to prime what you notice. It activates when you are bored.',
  },
  cen: {
    name: "City Hall",
    real: "Central Executive Network (CEN), frontoparietal",
    description:
      'The CEO, operator or project manager at the very front of the brain. It sets the goal ("Raj wants to be the number one podcast in the world"), directs goal-directed attention and handles inhibition, quieting distractions and even ideas while you get stuff done. It is the opposite of the DMN.',
  },
  dan: {
    name: "The Watchtower",
    real: "Dorsal Attention Network (DAN)",
    description:
      "Like the Eye of Sauron: a spotlight or flashlight of attention pointed wherever it is told. City Hall wants it on your work, but the Alarm Tower and the Dispatch Center can redirect it at any time. When you are in flow, it stays locked on the task.",
  },
  amy: {
    name: "Alarm Tower",
    real: "Amygdala",
    description:
      'A walnut-sized area deep in the center of the brain: "the brain\'s alarm system." In an emergency it overrides everything: "Stop focusing on your Google Doc, go look at this." It is the seat of fear, anxiety and negative affect, and sits close to the hippocampus, which is why scary things are so memorable.',
  },
  sal: {
    name: "Dispatch Center",
    real: "Salience Network",
    description:
      'Emergency calls and a satellite system: "Something\'s happening, I don\'t know what it is." Every notification, open tab or nearby chat pings it, and it tells the Watchtower to look. It is the external distraction system. You cannot shut it down because it keeps you alive, so clean and control your environment instead.',
  },
  hip: {
    name: "Library & Archive",
    real: "Hippocampus",
    description:
      "Your memories. Emotion strengthens memory: negative and scary things are more memorable, and even being afraid of forgetting helps you remember. To improve memory, sharpen attention. You can only remember what you attended to, because attention is the funnel into memory.",
  },
};

const WORK = { x: 645, y: 80, label: "Work" };

interface Info {
  title: string;
  subtitle?: string;
  body: ReactNode;
}

const INTRO: Info = {
  title: "Click a district",
  body: "Story Studios sends meaning to City Hall, which tells the Watchtower where to point its spotlight. The Alarm Tower and Dispatch Center can hijack that spotlight.",
};

function District({
  id,
  selected,
  onSelect,
  children,
}: {
  id: DistrictId;
  selected: boolean;
  onSelect: (id: DistrictId) => void;
  children: ReactNode;
}) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={DISTRICTS[id].name}
      aria-pressed={selected}
      onClick={() => onSelect(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(id);
        }
      }}
      className="cursor-pointer outline-none transition-[filter] hover:brightness-125 focus-visible:brightness-125"
      stroke={selected ? "#fff" : undefined}
      strokeWidth={selected ? 4 : undefined}
    >
      {children}
    </g>
  );
}

export function BrainCityMap() {
  const [selected, setSelected] = useState<DistrictId | null>(null);
  const [info, setInfo] = useState<Info>(INTRO);
  const [spot, setSpot] = useState(WORK);
  const [flashLine, setFlashLine] = useState<"alarm" | "dispatch" | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function select(id: DistrictId) {
    const d = DISTRICTS[id];
    setSelected(id);
    setInfo({ title: d.name, subtitle: d.real, body: d.description });
  }

  function flash(line: "alarm" | "dispatch") {
    setFlashLine(line);
    setTimeout(() => setFlashLine(null), 900);
  }

  function notification() {
    clearTimeout(timer.current);
    flash("dispatch");
    setSpot({ x: 505, y: 270, label: "Ping!" });
    setInfo({
      title: "Notification!",
      body: (
        <>
          The Dispatch Center (salience network) says &quot;Hey, look over here!&quot; and the Watchtower swings its
          spotlight away from your work. Each switch costs you <b>time and energy</b>.
        </>
      ),
    });
    timer.current = setTimeout(() => {
      setSpot(WORK);
      setInfo({
        title: "Back to work...",
        body: "The spotlight returns, but you paid a switching cost. Multiply that by every ping in a day.",
      });
    }, 2200);
  }

  function emergency() {
    clearTimeout(timer.current);
    flash("alarm");
    setSpot({ x: 240, y: 225, label: "Threat!" });
    setInfo({
      title: "Emergency!",
      body: 'The Alarm Tower (amygdala) fires: "Raj, stop focusing on your Google Doc. There are emergencies happening, go look at this." Threat always wins the spotlight, which is exactly what rage-bait news exploits.',
    });
    timer.current = setTimeout(() => setSpot(WORK), 2400);
  }

  function focus() {
    clearTimeout(timer.current);
    setSpot(WORK);
    setInfo({
      title: "Clean environment",
      body: "Phone in another room, notifications off, one tab. Story Studios gives meaning, City Hall sets the goal, and the Watchtower keeps its spotlight on the work, with nothing hijacking it. You can't shut the salience network down, but you can control what reaches it.",
    });
  }

  const label = { fill: "#fff", fontSize: 13, fontWeight: 700, pointerEvents: "none" as const, stroke: "none" };
  const sub = { ...label, fontSize: 10.5, fontWeight: 500, opacity: 0.9 };
  const spotMotion = { transition: "cx .6s, cy .6s, x .6s, y .6s" };

  return (
    <Widget title="Brain City Map: click a district">
      <svg viewBox="0 0 760 420" role="img" aria-label="Brain city map" className="h-auto w-full rounded-xl border bg-card">
        <defs>
          <marker id="city-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#9aa3b8" />
          </marker>
        </defs>
        <path d="M190,110 L300,110" stroke="#9aa3b8" strokeWidth="3" markerEnd="url(#city-arrow)" fill="none" />
        <path d="M460,110 L560,160" stroke="#9aa3b8" strokeWidth="3" markerEnd="url(#city-arrow)" fill="none" />
        <path
          d="M300,300 L560,210"
          stroke="#ff6b81"
          strokeWidth={flashLine === "alarm" ? 7 : 3}
          strokeDasharray="7 6"
          markerEnd="url(#city-arrow)"
          fill="none"
        />
        <path
          d="M520,330 L600,235"
          stroke="#ffb86b"
          strokeWidth={flashLine === "dispatch" ? 7 : 3}
          strokeDasharray="7 6"
          markerEnd="url(#city-arrow)"
          fill="none"
        />
        <District id="dmn" selected={selected === "dmn"} onSelect={select}>
          <rect x="30" y="60" width="160" height="100" rx="16" fill="#8e6cf0" />
          <text x="110" y="102" textAnchor="middle" style={label}>
            Story Studios
          </text>
          <text x="110" y="122" textAnchor="middle" style={sub}>
            Default Mode Network
          </text>
        </District>
        <District id="cen" selected={selected === "cen"} onSelect={select}>
          <rect x="300" y="60" width="160" height="100" rx="16" fill="#3d7bfd" />
          <text x="380" y="102" textAnchor="middle" style={label}>
            City Hall
          </text>
          <text x="380" y="122" textAnchor="middle" style={sub}>
            Central Executive Network
          </text>
        </District>
        <District id="dan" selected={selected === "dan"} onSelect={select}>
          <rect x="560" y="140" width="170" height="100" rx="16" fill="#12a594" />
          <text x="645" y="182" textAnchor="middle" style={label}>
            The Watchtower
          </text>
          <text x="645" y="202" textAnchor="middle" style={sub}>
            Dorsal Attention Network
          </text>
        </District>
        <District id="amy" selected={selected === "amy"} onSelect={select}>
          <circle cx="240" cy="310" r="62" fill="#e0445e" />
          <text x="240" y="305" textAnchor="middle" style={label}>
            Alarm Tower
          </text>
          <text x="240" y="324" textAnchor="middle" style={sub}>
            Amygdala
          </text>
        </District>
        <District id="sal" selected={selected === "sal"} onSelect={select}>
          <rect x="420" y="300" width="170" height="90" rx="16" fill="#e08a1e" />
          <text x="505" y="338" textAnchor="middle" style={label}>
            Dispatch Center
          </text>
          <text x="505" y="358" textAnchor="middle" style={sub}>
            Salience Network
          </text>
        </District>
        <District id="hip" selected={selected === "hip"} onSelect={select}>
          <rect x="30" y="220" width="130" height="80" rx="16" fill="#5a6b8c" />
          <text x="95" y="255" textAnchor="middle" style={label}>
            Library &amp;
          </text>
          <text x="95" y="272" textAnchor="middle" style={label}>
            Archive
          </text>
          <text x="95" y="290" textAnchor="middle" style={sub}>
            Hippocampus
          </text>
        </District>
        <circle cx={spot.x} cy={spot.y} r="26" fill="#fff59d" opacity=".85" style={spotMotion} />
        <text x="645" y="46" textAnchor="middle" style={{ fill: "var(--muted-foreground)", fontSize: 11 }}>
          spotlight
        </text>
        <text x={spot.x} y={spot.y + 4} textAnchor="middle" style={{ fill: "#333", fontSize: 10, ...spotMotion }}>
          {spot.label}
        </text>
      </svg>
      <div className="mt-2.5 flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={notification}>
          Simulate a notification
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={emergency}>
          Simulate an emergency
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={focus}>
          Clean environment (focus)
        </Button>
      </div>
      <Output className="whitespace-normal" aria-live="polite">
        <h4 className="mb-1! text-lg font-semibold">{info.title}</h4>
        {info.subtitle && <div className="text-sm font-semibold text-brand-2">{info.subtitle}</div>}
        <p className="mt-1.5! mb-0!">{info.body}</p>
      </Output>
    </Widget>
  );
}
