"use client";

import { useState } from "react";
import { useLocalized } from "@/components/providers/locale-provider";
import { Widget } from "@/components/summary/exercise";
import { cn } from "@/lib/utils";

type Role = "ai" | "ml" | "research" | "swe";

const ROLE_LABEL: Record<Role, string> = {
  ai: "AI engineer",
  ml: "ML engineer",
  research: "AI researcher",
  swe: "Software engineer",
};

const ROLES: Role[] = ["ai", "ml", "research", "swe", "ai", "ml", "ai"];

const TEXT = {
  en: {
    title: "Whose job is it?",
    intro:
      "Guess whether each task belongs to an AI engineer, ML engineer, AI researcher or software engineer. Click to reveal.",
    items: [
      {
        title: "Build a chatbot that answers questions from internal company docs",
        answer: "A RAG system on top of an existing model like Claude, GPT or Gemini.",
      },
      { title: "Train a recommendation system for Netflix", answer: "Uses the company's own data to train a custom model." },
      {
        title: "Invent a new kind of model architecture",
        answer: "Neither AI nor ML engineers do this. It's a separate, usually PhD, career track.",
      },
      {
        title: "Build the web interface and back-end API around the model",
        answer: "Software engineers own the app around the model, nothing model-specific.",
      },
      {
        title: "Build an agent that searches the web and queries a database to finish a task",
        answer: "Tool calling and agents on top of a pre-trained LLM.",
      },
      { title: "Train a fraud detection model on transaction data", answer: "Another custom model trained from the company's data." },
      {
        title: "Set up evals and LLM-as-judge to measure whether a summarizer works",
        answer: 'Evaluation is a core AI engineering skill, well beyond "just calling an API."',
      },
    ],
  },
  hi: {
    title: "यह किसका काम है?",
    intro:
      "Guess करें कि हर task AI engineer, ML engineer, AI researcher या software engineer में से किसका है। Reveal करने के लिए click करें।",
    items: [
      {
        title: "एक chatbot बनाना जो company के internal docs से सवालों के जवाब दे",
        answer: "Claude, GPT या Gemini जैसे existing model पर बना एक RAG system।",
      },
      { title: "Netflix के लिए recommendation system train करना", answer: "Company के अपने data से custom model train करना।" },
      {
        title: "एक नए तरह का model architecture invent करना",
        answer: "न AI engineer यह करते हैं, न ML engineer। यह अलग career track है, आमतौर पर PhD वाला।",
      },
      {
        title: "Model के आसपास web interface और back-end API बनाना",
        answer: "Software engineers model के आसपास की app संभालते हैं, model से जुड़ा कुछ नहीं।",
      },
      {
        title: "एक agent बनाना जो task पूरा करने के लिए web search और database query करे",
        answer: "Pre-trained LLM पर tool calling और agents।",
      },
      { title: "Transaction data पर fraud detection model train करना", answer: "Company के data से train किया एक और custom model।" },
      {
        title: "Summarizer काम करता है या नहीं, यह measure करने के लिए evals और LLM-as-judge set up करना",
        answer: 'Evaluation एक core AI engineering skill है, "सिर्फ़ API call करने" से कहीं आगे।',
      },
    ],
  },
};

function QuizCard({ role, title, answer }: { role: Role; title: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      className={cn("rounded-xl border bg-card px-3 py-2.5 text-left transition-colors", open && "border-brand")}
    >
      <b>{title}</b>
      <span className={cn("mt-1.5 block text-[13.5px]", !open && "hidden")}>
        <b className="text-brand">{ROLE_LABEL[role]}.</b> {answer}
      </span>
    </button>
  );
}

export function RoleQuiz() {
  const t = useLocalized(TEXT);
  return (
    <Widget title={t.title}>
      <p className="mt-0! text-[13px] text-muted-foreground">{t.intro}</p>
      <div className="mt-2.5 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5">
        {t.items.map((item, i) => (
          <QuizCard key={item.title} role={ROLES[i]} {...item} />
        ))}
      </div>
    </Widget>
  );
}
