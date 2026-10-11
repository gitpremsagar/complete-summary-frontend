"use client";

import { useState } from "react";
import { useLocalized } from "@/components/providers/locale-provider";
import { Widget } from "@/components/summary/exercise";
import { cn } from "@/lib/utils";

const TEXT = {
  en: {
    title: "Which tool would you reach for?",
    intro: "Guess the right Cursor feature for each situation, then click to reveal.",
    items: [
      {
        title: "You finished a line and the next three lines are obvious",
        tool: "Tab",
        answer: "Accept, then press Tab again: it predicts the next logical edit. Most people stop at one.",
      },
      {
        title: "Add error handling to every function in the file you have open",
        tool: "Command K",
        answer: "Highlight, instruct, review the diff. Targeted, one file, nothing else changes.",
      },
      {
        title: "You can't remember the git command to show the last five commits",
        tool: "Command K in the terminal",
        answer: "Describe it in plain English and it writes the shell command.",
      },
      {
        title: "A service fails silently and the error is sitting in your terminal",
        tool: "Chat with @terminal + @file",
        answer: "Give it the error output and just the relevant file. Relevance beats volume.",
      },
      {
        title: "Add a task labels feature: front end, back end and a database migration",
        tool: "Plan mode, then Build",
        answer: "Multi-file and non-trivial, so review and edit the plan before any code is written.",
      },
      {
        title: "Pagination, unit tests and an unrelated bug fix, all today",
        tool: "Parallel agents",
        answer: "Independent tasks, each in its own git worktree. A sequential afternoon becomes about an hour.",
      },
      {
        title: "A well-defined task you want done while your laptop is closed",
        tool: "Background agent",
        answer: "Runs in the cloud and comes back as a merge-ready PR. Write it like a proper ticket.",
      },
      {
        title: "The same structured-logging pattern in three services",
        tool: "A slash command",
        answer: "Write the prompt once in .cursor/commands/add-logging.md and run /add-logging on each file.",
      },
      {
        title: "The agent keeps ignoring your team's async database conventions",
        tool: "Project rules",
        answer: "Persistent instructions read before every interaction, committed so the whole team gets them.",
      },
      {
        title: "A framework had a big release after the model's training cutoff",
        tool: "Context7 MCP",
        answer: "Fetches current docs before writing framework code, so you stop getting deprecated patterns.",
      },
    ],
  },
  hi: {
    title: "आप कौन-सा tool use करेंगे?",
    intro: "हर situation के लिए सही Cursor feature guess करें, फिर reveal करने के लिए click करें।",
    items: [
      {
        title: "एक line पूरी हुई और अगली तीन lines obvious हैं",
        tool: "Tab",
        answer: "Accept करें, फिर दोबारा Tab दबाएँ: यह अगला logical edit predict करता है। ज़्यादातर लोग एक पर रुक जाते हैं।",
      },
      {
        title: "खुली हुई file के हर function में error handling जोड़नी है",
        tool: "Command K",
        answer: "Highlight, instruct, diff review। Targeted, एक file, बाकी कुछ नहीं बदलता।",
      },
      {
        title: "Last five commits दिखाने वाली git command याद नहीं आ रही",
        tool: "Terminal में Command K",
        answer: "सादी English में बताएँ और यह shell command लिख देता है।",
      },
      {
        title: "एक service चुपचाप fail हो रही है और error आपके terminal में है",
        tool: "@terminal + @file के साथ Chat",
        answer: "Error output और सिर्फ़ relevant file दें। Relevance, volume से बेहतर है।",
      },
      {
        title: "Task labels feature जोड़ना है: front end, back end और database migration",
        tool: "Plan mode, फिर Build",
        answer: "Multi-file और non-trivial है, इसलिए code लिखे जाने से पहले plan review और edit करें।",
      },
      {
        title: "Pagination, unit tests और एक अलग bug fix, सब आज",
        tool: "Parallel agents",
        answer: "Independent tasks, हर एक अपने git worktree में। Sequential दोपहर लगभग एक घंटे की हो जाती है।",
      },
      {
        title: "एक well-defined task जो laptop बंद रहते हुए पूरा हो जाए",
        tool: "Background agent",
        answer: "Cloud में चलता है और merge-ready PR के रूप में लौटता है। इसे proper ticket की तरह लिखें।",
      },
      {
        title: "तीन services में एक ही structured-logging pattern",
        tool: "Slash command",
        answer: "Prompt एक बार .cursor/commands/add-logging.md में लिखें और हर file पर /add-logging चलाएँ।",
      },
      {
        title: "Agent आपकी team की async database conventions बार-बार ignore करता है",
        tool: "Project rules",
        answer: "हर interaction से पहले पढ़े जाने वाले persistent instructions, commit किए हुए ताकि पूरी team को मिलें।",
      },
      {
        title: "Model के training cutoff के बाद किसी framework का बड़ा release आया",
        tool: "Context7 MCP",
        answer: "Framework code लिखने से पहले current docs लाता है, ताकि deprecated patterns न मिलें।",
      },
    ],
  },
};

function QuizCard({ title, tool, answer }: { title: string; tool: string; answer: string }) {
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
        <b className="text-brand">{tool}.</b> {answer}
      </span>
    </button>
  );
}

export function ToolPicker() {
  const t = useLocalized(TEXT);
  return (
    <Widget title={t.title}>
      <p className="mt-0! text-[13px] text-muted-foreground">{t.intro}</p>
      <div className="mt-2.5 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5">
        {t.items.map((item) => (
          <QuizCard key={item.title} {...item} />
        ))}
      </div>
    </Widget>
  );
}
