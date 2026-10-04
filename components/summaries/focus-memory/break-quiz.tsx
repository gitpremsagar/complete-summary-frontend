"use client";

import { useState, type ReactNode } from "react";
import { useLocalized } from "@/components/providers/locale-provider";
import { Widget } from "@/components/summary/exercise";
import { cn } from "@/lib/utils";

type Verdict = "yes" | "no" | "meh";

const VERDICTS: Verdict[] = ["no", "yes", "meh", "yes", "meh", "yes", "no", "yes"];

const TEXT: Record<"en" | "hi", { title: string; intro: string; items: { title: string; answer: ReactNode }[] }> = {
  en: {
    title: "Is it a real break?",
    intro: 'Test your ideas: is it a real "complete psychological detachment" break? Click each card.',
    items: [
      {
        title: "Scrolling Instagram or TikTok",
        answer: (
          <>
            No. The 2024 <i>Nature</i> study found scrolling is about the same as taking no break.
          </>
        ),
      },
      { title: "A walk outside in nature", answer: "Yes. It actually restores you, unlike scrolling." },
      {
        title: "The same run on the same route every day",
        answer: "Not ideal. You go on autopilot and your mind drifts back to your worries. Change it up and make it novel.",
      },
      {
        title: "Cooking a brand-new, complicated recipe",
        answer: 'Yes. You have to focus: "put the baggage down... my watchtower needs to be right here."',
      },
      {
        title: "Cooking a recipe you've made 100 times",
        answer: "Weak. You can chop vegetables while still worrying and thinking.",
      },
      {
        title: "Learning guitar, harmonica or juggling",
        answer: "Yes. A new, challenging skill demands all your energy and attention.",
      },
      {
        title: 'Lying on the couch "resting" while mulling over deadlines',
        answer:
          "No. Resting is ideal in theory, but most people end up thinking about their stuff, so there's no detachment.",
      },
      {
        title: "Something so engaging you're in flow (like Raj hosting)",
        answer: "Oddly, yes. If it fully absorbs you and you truly stop worrying, flow can count.",
      },
    ],
  },
  hi: {
    title: "क्या यह real break है?",
    intro: 'अपने ideas test करें: क्या यह सच में "complete psychological detachment" वाला break है? हर card पर click करें।',
    items: [
      {
        title: "Instagram या TikTok scroll करना",
        answer: (
          <>
            नहीं। 2024 की <i>Nature</i> study के अनुसार scrolling लगभग break न लेने जैसा ही है।
          </>
        ),
      },
      { title: "बाहर nature में walk", answer: "हाँ। यह scrolling के उलट सच में आपको restore करता है।" },
      {
        title: "रोज़ एक ही route पर वही run",
        answer: "Ideal नहीं। आप autopilot पर चले जाते हैं और दिमाग़ फिर worries पर लौट आता है। बदलाव करें, कुछ नया रखें।",
      },
      {
        title: "बिल्कुल नई, complicated recipe बनाना",
        answer: 'हाँ। आपको focus करना पड़ता है: "put the baggage down... my watchtower needs to be right here."',
      },
      {
        title: "वो recipe बनाना जो 100 बार बना चुके हैं",
        answer: "कमज़ोर। आप सब्ज़ी काटते हुए भी worry और सोच-विचार करते रह सकते हैं।",
      },
      {
        title: "Guitar, harmonica या juggling सीखना",
        answer: "हाँ। नई, challenging skill आपकी पूरी energy और attention माँगती है।",
      },
      {
        title: 'Deadlines के बारे में सोचते हुए couch पर "rest" करना',
        answer:
          "नहीं। Theory में rest ideal है, लेकिन ज़्यादातर लोग अपनी चीज़ों के बारे में सोचते रहते हैं, तो detachment नहीं होता।",
      },
      {
        title: "कुछ इतना engaging कि आप flow में हों (जैसे Raj का hosting)",
        answer: "अजीब है, पर हाँ। अगर यह आपको पूरी तरह absorb कर ले और worry सच में रुक जाए, तो flow भी गिना जा सकता है।",
      },
    ],
  },
};

const BORDER: Record<Verdict, string> = { yes: "border-good", no: "border-bad", meh: "border-warn" };

function QuizCard({ verdict, title, answer }: { verdict: Verdict; title: string; answer: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      className={cn("rounded-xl border bg-card px-3 py-2.5 text-left transition-colors", open && BORDER[verdict])}
    >
      <b>{title}</b>
      <span className={cn("mt-1.5 block text-[13.5px]", !open && "hidden")}>{answer}</span>
    </button>
  );
}

export function BreakQuiz() {
  const t = useLocalized(TEXT);
  return (
    <Widget title={t.title}>
      <p className="mt-0! text-[13px] text-muted-foreground">{t.intro}</p>
      <div className="mt-2.5 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5">
        {t.items.map((item, i) => (
          <QuizCard key={item.title} verdict={VERDICTS[i]} {...item} />
        ))}
      </div>
    </Widget>
  );
}
