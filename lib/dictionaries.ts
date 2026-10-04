import type { Locale } from "@/lib/i18n";

const en = {
  header: {
    summaries: "Summaries",
    login: "Log in",
    signup: "Sign up",
    switchTo: "हिंदी",
    switchLabel: "Read this site in Hindi",
  },
  home: {
    metaTitle: "Complete summaries of podcasts, audiobooks and videos",
    title: "Complete summaries of the podcasts, audiobooks and videos worth your time",
    subtitle:
      "Not a few bullet points. A complete, to-the-point summary of the whole thing, with interactive exercises so you can actually apply what you learn.",
    browse: "Browse summaries",
    register: "Create a free account",
    features: [
      {
        title: "Everything that matters",
        text: "Organized by topic and kept to the point. Nothing important is left out.",
      },
      {
        title: "Exercises you can do",
        text: "Builders, tests and checklists that turn ideas into action. Log in to save your progress.",
      },
      {
        title: "Easy to scan and search",
        text: "Table of contents, key takeaways, studies and instant in-page search.",
      },
    ],
    latest: "Latest summaries",
    viewAll: "View all",
  },
  list: {
    metaTitle: "All summaries",
    metaDescription: "Browse complete, to-the-point summaries of podcasts, audiobooks and YouTube videos.",
    title: "All summaries",
    count: (n: number) => `${n} complete ${n === 1 ? "summary" : "summaries"} so far. New ones are added regularly.`,
  },
  kind: { Podcast: "Podcast", Audiobook: "Audiobook", Video: "Video" } as Record<string, string>,
  card: {
    min: "min",
    with: "with",
    read: "Read the summary",
    thumbnail: "Video thumbnail",
  },
  hero: {
    summary: "summary",
    minRead: "min read",
    guest: "Guest",
    host: "Host",
    show: "Show",
    episode: "episode",
    topics: "Topics",
    metaSuffix: "complete summary",
  },
  shell: {
    contents: "Contents",
    closeContents: "Close contents",
    search: "Search this summary",
    searchPlaceholder: (examples: string) => `Search this summary (e.g. ${examples})...`,
    matches: (total: number, sections: number) =>
      `${total} match${total > 1 ? "es" : ""} in ${sections} section${sections > 1 ? "s" : ""}`,
    noMatches: "No matches",
    expandAll: "Expand all",
    collapseAll: "Collapse all",
    checklist: "Action checklist",
    top: "Top",
  },
  widget: {
    interactive: "Interactive",
    exercise: "Exercise",
    copy: "Copy",
    copied: "Copied!",
    clear: "Clear",
    saving: "Saving",
    saved: "Saved to your account",
    saveError: "Couldn't save",
    lockTitle: "Log in to follow along",
    lockText:
      "Create a free account to do this exercise. Your answers are saved to your account, so you can pick up where you left off on any device.",
    login: "Log in",
    register: "Create account",
  },
  checklist: {
    title: "Your action checklist",
    intro: "Tick items as you adopt them. Your progress is saved to your account.",
    done: (done: number, total: number) => `${done} / ${total} done.`,
    reset: "Reset checklist",
  },
};

export type Dictionary = typeof en;

const hi: Dictionary = {
  header: {
    summaries: "Summaries",
    login: "Log in",
    signup: "Sign up",
    switchTo: "English",
    switchLabel: "Read this site in English",
  },
  home: {
    metaTitle: "Podcasts, audiobooks और videos की complete summaries",
    title: "उन podcasts, audiobooks और videos की complete summaries जो आपके समय के लायक हैं",
    subtitle:
      "सिर्फ़ कुछ bullet points नहीं। पूरी बात की complete और to-the-point summary, साथ में interactive exercises ताकि आप जो सीखें उसे सच में apply कर सकें।",
    browse: "Summaries देखें",
    register: "Free account बनाएँ",
    features: [
      {
        title: "हर ज़रूरी बात",
        text: "Topic के हिसाब से organized और to-the-point। कोई भी important बात छूटती नहीं।",
      },
      {
        title: "Exercises जो आप कर सकें",
        text: "Builders, tests और checklists जो ideas को action में बदलते हैं। Progress save करने के लिए Log in करें।",
      },
      {
        title: "Scan और search करना आसान",
        text: "Table of contents, key takeaways, studies और page के अंदर instant search।",
      },
    ],
    latest: "Latest summaries",
    viewAll: "सभी देखें",
  },
  list: {
    metaTitle: "सभी summaries",
    metaDescription: "Podcasts, audiobooks और YouTube videos की complete, to-the-point summaries देखें।",
    title: "सभी summaries",
    count: (n: number) => `अब तक ${n} complete summaries। नई summaries regularly जोड़ी जाती हैं।`,
  },
  kind: { Podcast: "Podcast", Audiobook: "Audiobook", Video: "Video" },
  card: {
    min: "min",
    with: "के साथ",
    read: "Summary पढ़ें",
    thumbnail: "Video thumbnail",
  },
  hero: {
    summary: "summary",
    minRead: "min read",
    guest: "Guest",
    host: "Host",
    show: "Show",
    episode: "episode",
    topics: "Topics",
    metaSuffix: "complete summary",
  },
  shell: {
    contents: "Contents",
    closeContents: "Contents बंद करें",
    search: "इस summary में search करें",
    searchPlaceholder: (examples: string) => `इस summary में search करें (जैसे ${examples})...`,
    matches: (total: number, sections: number) => `${sections} sections में ${total} matches`,
    noMatches: "कोई match नहीं",
    expandAll: "सब खोलें",
    collapseAll: "सब बंद करें",
    checklist: "Action checklist",
    top: "ऊपर",
  },
  widget: {
    interactive: "Interactive",
    exercise: "Exercise",
    copy: "Copy",
    copied: "Copied!",
    clear: "Clear",
    saving: "Save हो रहा है",
    saved: "आपके account में saved",
    saveError: "Save नहीं हो पाया",
    lockTitle: "साथ-साथ करने के लिए Log in करें",
    lockText:
      "यह exercise करने के लिए free account बनाएँ। आपके answers आपके account में save होते हैं, ताकि आप किसी भी device पर वहीं से शुरू कर सकें जहाँ छोड़ा था।",
    login: "Log in",
    register: "Account बनाएँ",
  },
  checklist: {
    title: "आपकी action checklist",
    intro: "जो चीज़ें आप अपनाते जाएँ उन्हें tick करें। आपका progress आपके account में save होता है।",
    done: (done: number, total: number) => `${total} में से ${done} done।`,
    reset: "Checklist reset करें",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, hi };

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
