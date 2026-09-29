"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Widget } from "@/components/summary/exercise";
import { Output } from "@/components/summary/widget-ui";

type Chrono = "am" | "bi" | "pm";
type Selection = Chrono | "all";

const CHRONOTYPES: Record<Chrono, { color: string; name: string; legend: string; points: [number, number][]; info: ReactNode }> = {
  am: {
    color: "#ffb86b",
    name: "AM-shifted",
    legend: "~1/4 of people",
    points: [[6, 0.72], [7, 0.95], [9, 0.9], [12, 0.75], [15, 0.55], [18, 0.35], [21, 0.2], [24, 0.1], [26, 0.05]],
    info: (
      <>
        <b>AM-shifted (about a quarter of people).</b> Wake naturally and hormonally early, and the body wakes them even
        after a late night. Energy <b>declines steadily</b> all day; by early evening they are struggling. Their brain is
        &quot;on fire&quot; at 5 a.m., so Dr Yousef advises AM-shifted CEOs <b>not</b> to spend that time working out;
        use it for their most important work.
      </>
    ),
  },
  bi: {
    color: "#7c9cff",
    name: "Biphasic",
    legend: "the majority",
    points: [
      [6, 0.3], [7, 0.5], [8.5, 0.8], [10.5, 0.95], [12, 0.8], [13.5, 0.45], [15, 0.33],
      [16.5, 0.55], [18.5, 0.8], [20, 0.7], [22, 0.4], [24, 0.2], [26, 0.1],
    ],
    info: (
      <>
        <b>Biphasic (the majority).</b> Two peaks. They need 45-60 minutes to ramp up, then hit a{" "}
        <b>mid-morning peak</b> (cortisol, epinephrine). Next comes a <b>&quot;super afternoon dip&quot;</b>, crashing
        harder than anyone. If they take a real break (rest, a workout) they get a <b>second wind</b> in the late
        afternoon or evening. Skip the midday break and the second peak is &quot;less peaky.&quot; The 9-to-5
        wasn&apos;t designed for this.
      </>
    ),
  },
  pm: {
    color: "#4fd1c5",
    name: "PM-shifted",
    legend: "~10-15%",
    points: [
      [6, 0.08], [8, 0.22], [10, 0.38], [12, 0.48], [13.5, 0.4], [15, 0.36],
      [17, 0.55], [19, 0.75], [21, 0.92], [23, 0.95], [25, 0.72], [26, 0.58],
    ],
    info: (
      <>
        <b>PM-shifted (about 10-15%): Raj and Dr Yousef.</b> Biologically prefer to sleep and wake later (left alone,
        she would sleep at 2-4 a.m.). Suggested day: <b>morning = creative work</b> (tired, less inhibited, DMN active:
        journal, brainstorm, read); <b>midday dip = admin</b> (emails, calls, messages, shopping){" "}
        <b>plus a workout</b>, which makes the peak peakier; <b>evening = peak</b> for focused, get-it-done work. Sundar
        Pichai does his best thinking around 10 p.m.
      </>
    ),
  },
};

const PM_WINDOWS: [number, number, string, string][] = [
  [6, 12.5, "Creative / wander", "#8e6cf0"],
  [12.5, 16.5, "Dip: admin + workout", "#ffb86b"],
  [18, 25, "PEAK: deep work", "#4fd1c5"],
];

const X = (h: number) => 50 + (h - 6) * (690 / 20);
const Y = (e: number) => 255 - e * 215;

function smooth(points: [number, number][]) {
  const p = points.map(([h, e]) => [X(h), Y(e)]);
  let d = `M${p[0][0]},${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  return d;
}

function hourLabel(h: number) {
  if (h === 12) return "12pm";
  if (h === 24) return "12am";
  if (h < 12) return `${h}am`;
  if (h < 24) return `${h - 12}pm`;
  return `${h - 24}am`;
}

const BUTTONS: { id: Selection; label: string }[] = [
  { id: "all", label: "All three" },
  { id: "am", label: "AM-shifted" },
  { id: "bi", label: "Biphasic" },
  { id: "pm", label: "PM-shifted (Raj and Dr Yousef)" },
];

export function ChronotypeExplorer() {
  const [selected, setSelected] = useState<Selection>("all");
  const muted = { fill: "var(--muted-foreground)", fontSize: 11 };

  return (
    <Widget title="Chronotype explorer">
      <div className="mb-2.5 flex flex-wrap gap-2">
        {BUTTONS.map((b) => (
          <Button
            key={b.id}
            type="button"
            size="sm"
            variant={selected === b.id ? "default" : "outline"}
            onClick={() => setSelected(b.id)}
            aria-pressed={selected === b.id}
          >
            {b.label}
          </Button>
        ))}
      </div>
      <svg viewBox="0 0 760 300" role="img" aria-label="Chronotype energy curves" className="h-auto w-full rounded-xl border bg-card">
        {selected === "pm" &&
          PM_WINDOWS.map(([a, b, text, color]) => (
            <g key={text}>
              <rect x={X(a)} y="30" width={X(b) - X(a)} height="225" fill={color} opacity=".13" />
              <text x={(X(a) + X(b)) / 2} y="46" textAnchor="middle" style={{ ...muted, fontWeight: 700 }}>
                {text}
              </text>
            </g>
          ))}
        {Array.from({ length: 11 }, (_, i) => 6 + i * 2).map((h) => (
          <g key={h}>
            <line x1={X(h)} y1="30" x2={X(h)} y2="255" style={{ stroke: "var(--border)" }} strokeWidth="1" />
            <text x={X(h)} y="272" textAnchor="middle" style={muted}>
              {hourLabel(h)}
            </text>
          </g>
        ))}
        <text x="16" y="140" transform="rotate(-90 16 140)" textAnchor="middle" style={muted}>
          Energy / alertness
        </text>
        {(Object.entries(CHRONOTYPES) as [Chrono, (typeof CHRONOTYPES)[Chrono]][]).map(([key, c]) => (
          <path
            key={key}
            d={smooth(c.points)}
            stroke={c.color}
            fill="none"
            style={{
              opacity: selected === "all" || selected === key ? 1 : 0.12,
              strokeWidth: selected === key ? 4.5 : 3,
              transition: "opacity .3s, stroke-width .3s",
            }}
          />
        ))}
        {(Object.values(CHRONOTYPES)).map((c, i) => (
          <g key={c.name}>
            <rect x={60 + i * 230} y="281" width="14" height="4" fill={c.color} />
            <text x={80 + i * 230} y="286" style={muted}>
              {c.name}: {c.legend}
            </text>
          </g>
        ))}
      </svg>
      <Output className="whitespace-normal" aria-live="polite">
        {selected === "all" ? (
          <>
            Three genetic chronotypes (the 2017 Nobel-winning circadian research, as she frames it). Everyone gets
            roughly <b>2-3 peak-performance hours a day</b>, at different times. The foundation for all types:{" "}
            <b>7+ hours of quality, unbroken sleep</b>. Click a type for details.
          </>
        ) : (
          CHRONOTYPES[selected].info
        )}
      </Output>
    </Widget>
  );
}
