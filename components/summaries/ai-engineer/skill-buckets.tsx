"use client";

import { useState } from "react";
import { useLocalized } from "@/components/providers/locale-provider";
import { Widget } from "@/components/summary/exercise";
import { cn } from "@/lib/utils";

const TEXT = {
  en: {
    title: "The 7 skill buckets",
    label: "Skill buckets",
    learn: "Learn:",
    start: "Start with:",
    enough: "You know enough when:",
    buckets: [
      {
        name: "Python",
        topics:
          "Functions, classes, data structures, error handling, APIs, libraries. Plus Git, virtual environments, config files, tests and the command line.",
        resource: "Scrimba's Learn Python (free to start, interactive)",
        enough: "You can structure a small project, call an API and write a test without a tutorial open.",
      },
      {
        name: "Math",
        topics: "Linear algebra, probability, statistics and calculus, as intuition rather than hand calculation.",
        resource: "3Blue1Brown: Essence of Linear Algebra and Essence of Calculus (free on YouTube)",
        enough: "You recognize these ideas when they show up in the systems you work with.",
      },
      {
        name: "ML basics",
        topics:
          "Supervised vs unsupervised, train and test sets, overfitting and underfitting, precision and recall, neural networks and transformers at a high level.",
        resource: "Google's Machine Learning Crash Course (free, fairly short)",
        enough: "You can tell models apart and pick the right one for your use case.",
      },
      {
        name: "AI eng",
        topics:
          "Choosing LLMs (performance, cost, speed, licensing), prompt engineering, context engineering, RAG (embeddings, chunking, vector DBs, retrieval) and evals.",
        resource: "DeepLearning.AI short courses; Hugging Face LLM course; Chip Huyen's AI Engineering",
        enough: "You can measure whether a change to your prompt or retrieval actually made things better.",
      },
      {
        name: "Agents",
        topics:
          "Tool calling, giving agents access to external systems, evaluating task completion, MCP and multi-agent systems.",
        resource: "DeepLearning.AI courses on agents and MCP; the Hitchhiker's Guide to AI Engineering",
        enough: "You can give an LLM tools and check whether it really finishes the task correctly.",
      },
      {
        name: "Production",
        topics: "APIs, cloud platforms, Docker, basic CI/CD, monitoring and logging.",
        resource: "Learn it by deploying your own project for real users",
        enough: "Your app runs somewhere people can use it, and you can tell what went wrong when it breaks.",
      },
      {
        name: "Interviews",
        topics:
          "Data structures and algorithms (LeetCode-style in Python) and gen AI system design, such as designing a RAG system or a support agent at scale.",
        resource: "Practice in parallel with everything else, not at the end",
        enough: "You can talk through designing an LLM application end to end.",
      },
    ],
  },
  hi: {
    title: "7 skill buckets",
    label: "Skill buckets",
    learn: "सीखें:",
    start: "शुरुआत:",
    enough: "काफ़ी सीख लिया जब:",
    buckets: [
      {
        name: "Python",
        topics:
          "Functions, classes, data structures, error handling, APIs, libraries। साथ में Git, virtual environments, config files, tests और command line।",
        resource: "Scrimba का Learn Python (शुरू करना free, interactive)",
        enough: "आप बिना tutorial खोले एक छोटा project structure कर सकें, API call कर सकें और test लिख सकें।",
      },
      {
        name: "Math",
        topics: "Linear algebra, probability, statistics और calculus, हाथ से calculation नहीं बल्कि intuition के रूप में।",
        resource: "3Blue1Brown: Essence of Linear Algebra और Essence of Calculus (YouTube पर free)",
        enough: "जिन systems पर आप काम करते हैं उनमें ये ideas आएँ तो आप पहचान लें।",
      },
      {
        name: "ML basics",
        topics:
          "Supervised vs unsupervised, train और test sets, overfitting और underfitting, precision और recall, high level पर neural networks और transformers।",
        resource: "Google का Machine Learning Crash Course (free, छोटा)",
        enough: "आप models में फ़र्क कर सकें और अपने use case के लिए सही चुन सकें।",
      },
      {
        name: "AI eng",
        topics:
          "LLMs चुनना (performance, cost, speed, licensing), prompt engineering, context engineering, RAG (embeddings, chunking, vector DBs, retrieval) और evals।",
        resource: "DeepLearning.AI के short courses; Hugging Face LLM course; Chip Huyen की AI Engineering",
        enough: "आप measure कर सकें कि prompt या retrieval में बदलाव से सच में फ़ायदा हुआ या नहीं।",
      },
      {
        name: "Agents",
        topics:
          "Tool calling, agents को external systems का access देना, task completion evaluate करना, MCP और multi-agent systems।",
        resource: "Agents और MCP पर DeepLearning.AI courses; the Hitchhiker's Guide to AI Engineering",
        enough: "आप किसी LLM को tools दे सकें और check कर सकें कि वो task सच में सही से पूरा करता है।",
      },
      {
        name: "Production",
        topics: "APIs, cloud platforms, Docker, basic CI/CD, monitoring और logging।",
        resource: "अपना project real users के लिए deploy करके सीखें",
        enough: "आपकी app ऐसी जगह चलती हो जहाँ लोग use कर सकें, और टूटने पर आप बता सकें कि क्या ग़लत हुआ।",
      },
      {
        name: "Interviews",
        topics:
          "Data structures और algorithms (Python में LeetCode-style) और gen AI system design, जैसे scale पर एक RAG system या support agent design करना।",
        resource: "बाकी सबके साथ-साथ practice करें, आख़िर में नहीं",
        enough: "आप एक LLM application को end to end design करने के बारे में बात कर सकें।",
      },
    ],
  },
};

export function SkillBuckets() {
  const t = useLocalized(TEXT);
  const [active, setActive] = useState(0);
  const bucket = t.buckets[active];

  return (
    <Widget title={t.title}>
      <div role="tablist" aria-label={t.label} className="grid grid-cols-[repeat(auto-fit,minmax(90px,1fr))] gap-2">
        {t.buckets.map((b, i) => (
          <button
            key={b.name}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={cn(
              "rounded-xl border px-2 py-2.5 text-center transition-colors",
              active === i ? "border-brand bg-brand/10" : "bg-card hover:bg-muted",
            )}
          >
            <div className="text-xs text-muted-foreground">{i + 1}</div>
            <div className="font-bold text-brand">{b.name}</div>
          </button>
        ))}
      </div>
      <ul role="tabpanel" className="mt-3! mb-0!">
        <li>
          <b>{t.learn}</b> {bucket.topics}
        </li>
        <li>
          <b>{t.start}</b> {bucket.resource}
        </li>
        <li>
          <b>{t.enough}</b> {bucket.enough}
        </li>
      </ul>
    </Widget>
  );
}
