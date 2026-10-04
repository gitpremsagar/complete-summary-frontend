import { localePath, type Locale } from "@/lib/i18n";

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
  /** YouTube video ID of the original, embedded at the top of the summary. */
  youtubeId?: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  stats: SummaryStat[];
  /** Example terms shown in the search box placeholder; defaults to the first tags. */
  searchExamples?: string[];
  /** Hindi overrides for the text fields. */
  hi?: SummaryTranslation;
}

export type SummaryTranslation = Pick<SummaryMeta, "title" | "description" | "intro" | "tags" | "stats"> &
  Partial<Pick<SummaryMeta, "guestBio" | "searchExamples">>;

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
    sourceUrl: "https://www.youtube.com/watch?v=Y566_T-YlNQ",
    youtubeId: "Y566_T-YlNQ",
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
    hi: {
      title: "इन Daily Habits से बनें Mentally Dangerous",
      description:
        "Figuring Out with Raj Shamani (FO556) पर Andrew Huberman की to-the-point summary: सुबह high और रात को low cortisol, mind को off करना सीखना, yoga nidra, years 1-3/4-6/7+ का career arc, courage, clutch states और daily resilience games, interactive exercises के साथ।",
      intro:
        "Raj, Huberman से पूछते हैं कि एक 25 साल के इंसान को 10 साल में \"mentally dangerous\" कैसे बनाया जाए। यह summary topic के हिसाब से organized और to-the-point है: cortisol rhythm और सुबह-शाम के exact protocols, off switch, left-column/right-column exercise, yoga nidra और एक sleep trick, 10 साल का career arc, उनका weekly training template, supplements, choking की neuroscience, clutch states, resilience games और उनकी personal story।",
      guestBio: "Neuroscientist, Stanford School of Medicine में tenured professor, Huberman Lab के host",
      tags: [
        "Cortisol rhythm",
        "Morning sunlight",
        "Sleep",
        "Yoga nidra / NSDR",
        "HRV और breathing",
        "Resilience",
        "Clutch states",
        "Neuroplasticity",
        "Training",
      ],
      stats: [
        { value: "50% तक", label: "सुबह के पहले घंटे में 5-10 minutes की sunlight से morning cortisol peak में बढ़त" },
        { value: "8 घंटे", label: "सोने से पहले के आख़िरी 8 घंटों में caffeine नहीं" },
        { value: "1-3 · 4-6 · 7+", label: "Years: पहले gas pedal, फिर regulate करना सीखना, फिर pro" },
        { value: "5 exhales", label: "HRV बढ़ाने और cortisol घटाने के लिए दिन में extended exhales" },
      ],
    },
  },
  {
    slug: "neuroscientists-guide-10x-focus-memory-sahar-yousef",
    kind: "Podcast",
    title: "Neuroscientist's Guide To 10X Your Focus & Memory",
    description:
      "A to-the-point summary of Dr Sahar Yousef on Figuring Out with Raj Shamani (FO559): belief and identity, breaking habits, phones and IQ, multitasking, boredom and ideas, chronotypes, burnout and the 3M break framework, with interactive exercises.",
    intro:
      'Raj asks a Berkeley neuroscientist how to train focus, memory and motivation. This summary is organized by topic and kept to the point: belief and the identity template, when-then plans, breaking habits, phones and IQ, multitasking, boredom and ideas, short vs long-form media and loneliness, the "brain as a city" map, chronotypes and sleep, burnout and the 3M break framework, an unpublished 9-week Berkeley study, and her personal story.',
    guest: "Dr Sahar Yousef",
    guestBio: 'Cognitive neuroscientist (UC Berkeley, "Becoming Superhuman" lab)',
    host: "Raj Shamani",
    show: "Figuring Out",
    episode: "FO559",
    sourceUrl: "https://www.youtube.com/watch?v=4Vz6L8B73i4",
    youtubeId: "4Vz6L8B73i4",
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
    hi: {
      title: "Neuroscientist की Guide: अपना Focus और Memory 10X करें",
      description:
        "Figuring Out with Raj Shamani (FO559) पर Dr Sahar Yousef की to-the-point summary: belief और identity, bad habits तोड़ना, phone और IQ, multitasking, boredom और ideas, chronotypes, burnout और 3M break framework, interactive exercises के साथ।",
      intro:
        'Raj एक Berkeley neuroscientist से पूछते हैं कि focus, memory और motivation को कैसे train करें। यह summary topic के हिसाब से organized और to-the-point है: belief और identity template, when-then plans, habits तोड़ना, phone और IQ, multitasking, boredom और ideas, short vs long-form media और loneliness, "brain as a city" map, chronotypes और sleep, burnout और 3M break framework, Berkeley की एक unpublished 9-week study, और उनकी personal story।',
      guestBio: 'Cognitive neuroscientist (UC Berkeley, "Becoming Superhuman" lab)',
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
          label: "Multitasking test पर Raj का time (दोगुने से ज़्यादा, बहुत सारी mistakes के साथ)",
        },
        {
          value: "Phone दिखा = IQ कम",
          label: "UT Austin study: बंद, उल्टा रखा phone भी attention और fluid intelligence कम कर देता है",
        },
        { value: "~10-15%", label: "लोग PM-shifted (night owls) होते हैं; ज़्यादातर biphasic होते हैं" },
        {
          value: "9 weeks, 450 students",
          label: "कम loneliness, depression और anxiety; बेहतर attention और working memory",
        },
      ],
    },
  },
  {
    slug: "how-to-become-ai-engineer-2026-marina-wyss",
    kind: "Video",
    title: "How I'd Become an AI Engineer in 2026 (Even with No CS Degree)",
    description:
      "A to-the-point summary of Marina Wyss's roadmap for becoming an AI engineer without a CS degree: what the role is, the 7 skill buckets, free resources, what to build, getting real experience and networking past resume screeners, with interactive exercises.",
    intro:
      "A senior applied scientist at Twitch with politics degrees explains how she'd become an AI engineer starting from zero. This summary is organized by topic and kept to the point: AI vs ML vs software engineers, the 7 skill buckets, how to learn without tutorial hell, the best free resources, your first and second projects, solving someone else's problem, and getting hired when screeners filter you out.",
    guest: "Marina Wyss",
    guestBio: "Senior Applied Scientist at Twitch; politics degrees; has coached hundreds into AI/ML roles",
    show: "Marina Wyss - AI & Machine Learning",
    sourceUrl: "https://www.youtube.com/watch?v=8c8Rrhd2oxo",
    youtubeId: "8c8Rrhd2oxo",
    publishedAt: "2026-09-02",
    tags: [
      "AI engineering",
      "Python",
      "LLMs",
      "Prompt engineering",
      "Context engineering",
      "RAG",
      "Evals",
      "AI agents",
      "MCP",
      "Production",
      "Interviews",
      "Networking",
    ],
    stats: [
      { value: "7 skill buckets", label: "Python, math, ML, AI engineering, agents, production and interview prep" },
      { value: "Build first", label: "Learn just enough to start, then go back when a project gets you stuck" },
      { value: "Mostly free", label: "Scrimba, 3Blue1Brown, Google's ML Crash Course, DeepLearning.AI, Hugging Face" },
      { value: "8 weeks", label: "Her application-only cohort for building a production-ready AI project" },
    ],
    searchExamples: ["RAG", "agents", "evals", "networking"],
    hi: {
      title: "2026 में AI Engineer कैसे बनूँगी (बिना CS Degree के भी)",
      description:
        "बिना CS degree के AI engineer बनने के Marina Wyss के roadmap की to-the-point summary: role क्या है, 7 skill buckets, free resources, क्या build करें, real experience कैसे पाएँ और resume screeners के बावजूद networking कैसे करें, interactive exercises के साथ।",
      intro:
        "Twitch की एक senior applied scientist, जिनकी degrees politics में हैं, बताती हैं कि अगर वो zero से शुरू करतीं तो AI engineer कैसे बनतीं। यह summary topic के हिसाब से organized और to-the-point है: AI vs ML vs software engineers, 7 skill buckets, tutorial hell में फँसे बिना कैसे सीखें, best free resources, आपका पहला और दूसरा project, किसी और की problem solve करना, और screeners filter कर दें तब भी job कैसे पाएँ।",
      guestBio: "Twitch में Senior Applied Scientist; politics में degrees; सैकड़ों लोगों को AI/ML roles में coach कर चुकी हैं",
      tags: [
        "AI engineering",
        "Python",
        "LLMs",
        "Prompt engineering",
        "Context engineering",
        "RAG",
        "Evals",
        "AI agents",
        "MCP",
        "Production",
        "Interviews",
        "Networking",
      ],
      stats: [
        { value: "7 skill buckets", label: "Python, math, ML, AI engineering, agents, production और interview prep" },
        { value: "पहले build करें", label: "शुरू करने लायक सीखें, फिर project में अटकें तो वापस जाकर गहराई से सीखें" },
        { value: "ज़्यादातर free", label: "Scrimba, 3Blue1Brown, Google का ML Crash Course, DeepLearning.AI, Hugging Face" },
        { value: "8 weeks", label: "Production-ready AI project बनाने के लिए उनका application-only cohort" },
      ],
    },
  },
];

export function getSummary(slug: string): SummaryMeta | undefined {
  return summaries.find((s) => s.slug === slug);
}

export function localizeSummary(summary: SummaryMeta, locale: Locale): SummaryMeta {
  if (locale === "en" || !summary.hi) return summary;
  return { ...summary, ...summary.hi };
}

export function summaryPath(slug: string, locale: Locale = "en") {
  return localePath(`/summaries/${slug}`, locale);
}
