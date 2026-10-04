"use client";

import { useLocalized } from "@/components/providers/locale-provider";
import { ChecklistExercise } from "@/components/summary/checklist-exercise";

const ITEMS = {
  en: [
    "Get comfortable with Python fundamentals: functions, classes, data structures, error handling, APIs and libraries",
    "Learn the software engineering basics: project structure, Git, virtual environments, config files, tests and the command line",
    "Build math intuition with 3Blue1Brown instead of doing math by hand",
    "Work through Google's Machine Learning Crash Course for the core ML concepts",
    "Learn to choose between LLMs on performance, cost, speed and licensing",
    "Practice prompt engineering properly: few-shot, structured outputs, defensive prompting and systematic testing",
    "Learn context engineering and RAG: embeddings, chunking, vector databases and retrieval",
    "Set up evals for anything I build: test sets, metrics, LLM-as-judge and human review",
    "Learn tool calling, agents and MCP",
    "Learn to deploy: APIs, cloud, Docker, basic CI/CD, monitoring and logging",
    "Start LeetCode-style practice in Python and gen AI system design now, in parallel",
    "Pick one resource per topic, learn just enough, then build instead of finishing every course",
    "Build a simple personal AI project and get a first version working fast",
    "Code the first project by hand, using AI only to explain new concepts",
    "Upgrade it: evals, RAG or tools if they fit, then deploy it with monitoring",
    "Solve someone else's problem: a nonprofit, a hobby group, a small business or an open source project",
    "Pick a handful of target companies and engage genuinely with engineers' public work there",
    "Build relationships before asking for referrals, instead of mass-applying on LinkedIn",
  ],
  hi: [
    "Python fundamentals में comfortable होना: functions, classes, data structures, error handling, APIs और libraries",
    "Software engineering basics सीखना: project structure, Git, virtual environments, config files, tests और command line",
    "हाथ से math करने की जगह 3Blue1Brown से math intuition बनाना",
    "Core ML concepts के लिए Google का Machine Learning Crash Course करना",
    "Performance, cost, speed और licensing के आधार पर LLMs में से चुनना सीखना",
    "Prompt engineering सही तरीके से practice करना: few-shot, structured outputs, defensive prompting और systematic testing",
    "Context engineering और RAG सीखना: embeddings, chunking, vector databases और retrieval",
    "जो भी बनाऊँ उसके लिए evals set up करना: test sets, metrics, LLM-as-judge और human review",
    "Tool calling, agents और MCP सीखना",
    "Deploy करना सीखना: APIs, cloud, Docker, basic CI/CD, monitoring और logging",
    "Python में LeetCode-style practice और gen AI system design अभी से, साथ-साथ शुरू करना",
    "हर topic के लिए एक resource चुनना, शुरू करने लायक सीखना, फिर हर course ख़त्म करने की जगह build करना",
    "एक simple personal AI project बनाना और पहला version जल्दी चलाना",
    "पहला project हाथ से code करना, AI सिर्फ़ नए concepts समझने के लिए",
    "उसे upgrade करना: fit हों तो evals, RAG या tools, फिर monitoring के साथ deploy करना",
    "किसी और की problem solve करना: nonprofit, hobby group, small business या open source project",
    "कुछ target companies चुनना और वहाँ के engineers के public work से genuinely engage करना",
    "LinkedIn पर mass-apply करने की जगह, referral माँगने से पहले relationships बनाना",
  ],
};

export function ActionChecklist() {
  return <ChecklistExercise items={useLocalized(ITEMS)} />;
}
