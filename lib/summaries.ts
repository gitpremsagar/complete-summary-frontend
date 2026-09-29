export type SummaryKind = "Podcast" | "Audiobook" | "Video";

export interface SummaryStat {
  value: string;
  label: string;
}

export interface SummarySection {
  id: string;
  title: string;
}

export interface SummaryMeta {
  slug: string;
  kind: SummaryKind;
  title: string;
  /** Short plain-text description used for SEO and cards. */
  description: string;
  /** Longer intro shown in the hero. */
  intro: string;
  guest?: string;
  guestBio?: string;
  host?: string;
  show?: string;
  episode?: string;
  sourceUrl?: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  stats: SummaryStat[];
  /** Example terms shown in the search box placeholder; defaults to the first tags. */
  searchExamples?: string[];
}

export const summaries: SummaryMeta[] = [
  {
    slug: "huberman-become-mentally-dangerous-daily-habits",
    kind: "Podcast",
    title: "Become Mentally Dangerous With These Daily Habits",
    description:
      "A to-the-point summary of Andrew Huberman on Figuring Out with Raj Shamani (FO556): high morning and low nighttime cortisol, learning to turn your mind off, yoga nidra, the years 1-3/4-6/7+ career arc, courage, clutch states and daily resilience games, with interactive exercises.",
    intro:
      "Raj asks Huberman how to make a 25-year-old \"mentally dangerous\" in 10 years. This summary is organized by topic and kept to the point: the cortisol rhythm and exact morning and evening protocols, the off switch, the left-column/right-column exercise, yoga nidra and a sleep trick, the 10-year career arc, his weekly training template, supplements, the neuroscience of choking, clutch states, resilience games, and his personal story.",
    guest: "Andrew Huberman",
    guestBio: "Neuroscientist, tenured professor at Stanford School of Medicine, host of Huberman Lab",
    host: "Raj Shamani",
    show: "Figuring Out",
    episode: "FO556",
    publishedAt: "2026-09-29",
    tags: [
      "Cortisol rhythm",
      "Morning sunlight",
      "Sleep",
      "Yoga nidra / NSDR",
      "HRV and breathing",
      "Resilience",
      "Clutch states",
      "Neuroplasticity",
      "Training",
    ],
    stats: [
      { value: "Up to 50%", label: "Boost to your morning cortisol peak from 5-10 minutes of sunlight in the first hour" },
      { value: "8 hours", label: "No caffeine in the final 8 hours before sleep" },
      { value: "1-3 · 4-6 · 7+", label: "Years of gas pedal, then learning to regulate, then pro" },
      { value: "5 exhales", label: "Extended exhales a day to raise HRV and lower cortisol" },
    ],
    searchExamples: ["cortisol", "sunlight", "nidra", "cold shower"],
  },
  {
    slug: "neuroscientists-guide-10x-focus-memory-sahar-yousef",
    kind: "Podcast",
    title: "Neuroscientist's Guide To 10X Your Focus & Memory",
    description:
      "A complete, section-by-section summary of Dr Sahar Yousef on Figuring Out with Raj Shamani (FO559): belief and identity, breaking habits, phones and IQ, multitasking, boredom and ideas, chronotypes, burnout and the 3M break framework, with interactive exercises.",
    intro:
      'A complete, section-by-section summary of the full conversation in the order it happened. It covers belief and identity, habits and addiction, phones and IQ, multitasking, boredom and ideas, short vs long-form media, loneliness, the "brain as a city" map, chronotypes and sleep, burnout and the 3M break framework, an unpublished 9-week Berkeley study, and the guest\'s personal story.',
    guest: "Dr Sahar Yousef",
    guestBio: 'Cognitive neuroscientist (UC Berkeley, "Becoming Superhuman" lab)',
    host: "Raj Shamani",
    show: "Figuring Out",
    episode: "FO559",
    publishedAt: "2026-09-29",
    tags: [
      "Neuroplasticity",
      "Default Mode Network",
      "Implementation intentions",
      "Digital hygiene",
      "Task switching",
      "Bloom scrolling",
      "Chronotypes",
      "Stress cycles",
      "3M breaks",
    ],
    stats: [
      {
        value: "17.72s → 41.35s",
        label: "Raj's time on the multitasking test (more than double, with many mistakes)",
      },
      {
        value: "Phone visible = lower IQ",
        label: "UT Austin study: a dead, face-down phone still lowered attention and fluid intelligence",
      },
      { value: "~10-15%", label: "of people are PM-shifted (night owls); the majority are biphasic" },
      {
        value: "9 weeks, 450 students",
        label: "Less lonely, depressed and anxious; better attention and working memory",
      },
    ],
    searchExamples: ["dopamine", "5 AM", "phone", "burnout"],
  },
];

export function getSummary(slug: string): SummaryMeta | undefined {
  return summaries.find((s) => s.slug === slug);
}

export function summaryPath(slug: string) {
  return `/summaries/${slug}`;
}
