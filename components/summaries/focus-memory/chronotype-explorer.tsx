"use client";

import { useState, type ReactNode } from "react";
import { useLocalized } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Widget } from "@/components/summary/exercise";
import { Output } from "@/components/summary/widget-ui";

type Chrono = "am" | "bi" | "pm";
type Selection = Chrono | "all";

const CHRONOTYPES: Record<Chrono, { color: string; name: string; points: [number, number][] }> = {
  am: {
    color: "#ffb86b",
    name: "AM-shifted",
    points: [[6, 0.72], [7, 0.95], [9, 0.9], [12, 0.75], [15, 0.55], [18, 0.35], [21, 0.2], [24, 0.1], [26, 0.05]],
  },
  bi: {
    color: "#7c9cff",
    name: "Biphasic",
    points: [
      [6, 0.3], [7, 0.5], [8.5, 0.8], [10.5, 0.95], [12, 0.8], [13.5, 0.45], [15, 0.33],
      [16.5, 0.55], [18.5, 0.8], [20, 0.7], [22, 0.4], [24, 0.2], [26, 0.1],
    ],
  },
  pm: {
    color: "#4fd1c5",
    name: "PM-shifted",
    points: [
      [6, 0.08], [8, 0.22], [10, 0.38], [12, 0.48], [13.5, 0.4], [15, 0.36],
      [17, 0.55], [19, 0.75], [21, 0.92], [23, 0.95], [25, 0.72], [26, 0.58],
    ],
  },
};

const PM_WINDOWS: [number, number, string][] = [
  [6, 12.5, "#8e6cf0"],
  [12.5, 16.5, "#ffb86b"],
  [18, 25, "#4fd1c5"],
];

const TEXT: Record<
  "en" | "hi",
  {
    title: string;
    aria: string;
    axis: string;
    buttons: Record<Selection, string>;
    windows: [string, string, string];
    legend: Record<Chrono, string>;
    info: Record<Chrono, ReactNode>;
    overview: ReactNode;
  }
> = {
  en: {
    title: "Chronotype explorer",
    aria: "Chronotype energy curves",
    axis: "Energy / alertness",
    buttons: { all: "All three", am: "AM-shifted", bi: "Biphasic", pm: "PM-shifted (Raj and Dr Yousef)" },
    windows: ["Creative / wander", "Dip: admin + workout", "PEAK: deep work"],
    legend: { am: "~1/4 of people", bi: "the majority", pm: "~10-15%" },
    info: {
      am: (
        <>
          <b>AM-shifted (about a quarter of people).</b> Wake naturally and hormonally early, and the body wakes them
          even after a late night. Energy <b>declines steadily</b> all day; by early evening they are struggling. Their
          brain is &quot;on fire&quot; at 5 a.m., so Dr Yousef advises AM-shifted CEOs <b>not</b> to spend that time
          working out; use it for their most important work.
        </>
      ),
      bi: (
        <>
          <b>Biphasic (the majority).</b> Two peaks. They need 45-60 minutes to ramp up, then hit a{" "}
          <b>mid-morning peak</b> (cortisol, epinephrine). Next comes a <b>&quot;super afternoon dip&quot;</b>, crashing
          harder than anyone. If they take a real break (rest, a workout) they get a <b>second wind</b> in the late
          afternoon or evening. Skip the midday break and the second peak is &quot;less peaky.&quot; The 9-to-5
          wasn&apos;t designed for this.
        </>
      ),
      pm: (
        <>
          <b>PM-shifted (about 10-15%): Raj and Dr Yousef.</b> Biologically prefer to sleep and wake later (left alone,
          she would sleep at 2-4 a.m.). Suggested day: <b>morning = creative work</b> (tired, less inhibited, DMN
          active: journal, brainstorm, read); <b>midday dip = admin</b> (emails, calls, messages, shopping){" "}
          <b>plus a workout</b>, which makes the peak peakier; <b>evening = peak</b> for focused, get-it-done work.
          Sundar Pichai does his best thinking around 10 p.m.
        </>
      ),
    },
    overview: (
      <>
        Three genetic chronotypes (the 2017 Nobel-winning circadian research, as she frames it). Everyone gets roughly{" "}
        <b>2-3 peak-performance hours a day</b>, at different times. The foundation for all types:{" "}
        <b>7+ hours of quality, unbroken sleep</b>. Click a type for details.
      </>
    ),
  },
  hi: {
    title: "Chronotype explorer",
    aria: "Chronotype energy curves",
    axis: "Energy / alertness",
    buttons: { all: "तीनों", am: "AM-shifted", bi: "Biphasic", pm: "PM-shifted (Raj और Dr Yousef)" },
    windows: ["Creative / wander", "Dip: admin + workout", "PEAK: deep work"],
    legend: { am: "~1/4 लोग", bi: "ज़्यादातर लोग", pm: "~10-15%" },
    info: {
      am: (
        <>
          <b>AM-shifted (लगभग एक चौथाई लोग).</b> Naturally और hormonally जल्दी उठते हैं, और देर रात के बाद भी शरीर
          उन्हें जगा देता है। Energy पूरे दिन <b>लगातार गिरती</b> है; शाम तक वो struggle करने लगते हैं। सुबह 5 बजे उनका
          दिमाग़ &quot;on fire&quot; होता है, इसलिए Dr Yousef AM-shifted CEOs को सलाह देती हैं कि उस समय workout{" "}
          <b>न</b> करें; उसे अपने सबसे important काम के लिए रखें।
        </>
      ),
      bi: (
        <>
          <b>Biphasic (ज़्यादातर लोग).</b> दो peaks। Ramp up होने में 45-60 minute लगते हैं, फिर{" "}
          <b>mid-morning peak</b> आता है (cortisol, epinephrine)। उसके बाद <b>&quot;super afternoon dip&quot;</b>, जिसमें
          ये सबसे ज़्यादा crash करते हैं। अगर real break लें (rest, workout) तो देर दोपहर या शाम को{" "}
          <b>second wind</b> मिलती है। Midday break छोड़ दें तो दूसरा peak &quot;कम peaky&quot; रहता है। 9-to-5 इसके लिए
          design नहीं हुआ था।
        </>
      ),
      pm: (
        <>
          <b>PM-shifted (लगभग 10-15%): Raj और Dr Yousef.</b> Biologically देर से सोना और उठना पसंद करते हैं (अपनी मर्ज़ी
          पर वो रात 2-4 बजे सोएँगी)। Suggested day: <b>सुबह = creative work</b> (थके हुए, कम inhibited, DMN active:
          journal, brainstorm, पढ़ना); <b>midday dip = admin</b> (emails, calls, messages, shopping){" "}
          <b>plus workout</b>, जो peak को और peaky बनाता है; <b>शाम = peak</b>, focused और get-it-done काम के लिए। Sundar
          Pichai अपनी best thinking रात लगभग 10 बजे करते हैं।
        </>
      ),
    },
    overview: (
      <>
        तीन genetic chronotypes (उनके अनुसार 2017 की Nobel-winning circadian research)। हर किसी को रोज़ लगभग{" "}
        <b>2-3 peak-performance घंटे</b> मिलते हैं, बस अलग-अलग समय पर। सभी types की नींव:{" "}
        <b>7+ घंटे की quality, बिना टूटी नींद</b>। Details के लिए किसी type पर click करें।
      </>
    ),
  },
};

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

const SELECTIONS: Selection[] = ["all", "am", "bi", "pm"];

export function ChronotypeExplorer() {
  const t = useLocalized(TEXT);
  const [selected, setSelected] = useState<Selection>("all");
  const muted = { fill: "var(--muted-foreground)", fontSize: 11 };

  return (
    <Widget title={t.title}>
      <div className="mb-2.5 flex flex-wrap gap-2">
        {SELECTIONS.map((id) => (
          <Button
            key={id}
            type="button"
            size="sm"
            variant={selected === id ? "default" : "outline"}
            onClick={() => setSelected(id)}
            aria-pressed={selected === id}
          >
            {t.buttons[id]}
          </Button>
        ))}
      </div>
      <svg viewBox="0 0 760 300" role="img" aria-label={t.aria} className="h-auto w-full rounded-xl border bg-card">
        {selected === "pm" &&
          PM_WINDOWS.map(([a, b, color], i) => (
            <g key={color}>
              <rect x={X(a)} y="30" width={X(b) - X(a)} height="225" fill={color} opacity=".13" />
              <text x={(X(a) + X(b)) / 2} y="46" textAnchor="middle" style={{ ...muted, fontWeight: 700 }}>
                {t.windows[i]}
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
          {t.axis}
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
        {(Object.entries(CHRONOTYPES) as [Chrono, (typeof CHRONOTYPES)[Chrono]][]).map(([key, c], i) => (
          <g key={key}>
            <rect x={60 + i * 230} y="281" width="14" height="4" fill={c.color} />
            <text x={80 + i * 230} y="286" style={muted}>
              {c.name}: {t.legend[key]}
            </text>
          </g>
        ))}
      </svg>
      <Output className="whitespace-normal" aria-live="polite">
        {selected === "all" ? t.overview : t.info[selected]}
      </Output>
    </Widget>
  );
}
