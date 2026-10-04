"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeftRightIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalized } from "@/components/providers/locale-provider";
import { Exercise } from "@/components/summary/exercise";
import { useExerciseProgress } from "@/components/summary/progress-provider";
import { cn } from "@/lib/utils";

type Column = "left" | "right";
type State = Record<Column, string[]>;

const INITIAL: State = { left: [], right: [] };
const MAX_ITEMS = 30;

interface ColumnText {
  title: string;
  hint: string;
  placeholder: string;
}

const TONE: Record<Column, string> = { left: "border-bad/50", right: "border-good/50" };

const TEXT = {
  en: {
    title: "Left column, right column",
    intro:
      "Do this about once a month. Dump everything on your mind into the two columns, then spend the month noticing which column your thoughts are in.",
    columns: {
      left: {
        title: "Left column: what concerns me",
        hint: "Worries, what people think of me, outcomes, other people's behavior.",
        placeholder: "e.g. What if the launch flops?",
      },
      right: {
        title: "Right column: what I can control",
        hint: "Actions: sleep, exercise, hydrate, prepare, practice turning my mind off, call my mother.",
        placeholder: "e.g. Rehearse the demo twice tomorrow",
      },
    } as Record<Column, ColumnText>,
    add: "Add",
    addTo: (title: string) => `Add to ${title}`,
    move: "Move to the other column",
    moveItem: (item: string) => `Move "${item}" to the other column`,
    remove: (item: string) => `Remove "${item}"`,
    summary: (left: number, total: number) => `${left} of your ${total} items are things you can't control.`,
    mostlyLeft: " Most of your mental energy is going to the left column. Pick one right-column action to do today.",
    mostlyRight: " Good: most of your list is things you can act on.",
    clear: "Clear both columns",
  },
  hi: {
    title: "Left column, right column",
    intro:
      "इसे लगभग महीने में एक बार करें। जो कुछ भी दिमाग़ में है उसे दोनों columns में डाल दें, फिर पूरे महीने notice करें कि आपके thoughts किस column में हैं।",
    columns: {
      left: {
        title: "Left column: जो मुझे परेशान करता है",
        hint: "चिंताएँ, लोग मेरे बारे में क्या सोचते हैं, outcomes, दूसरों का behavior।",
        placeholder: "जैसे: अगर launch flop हो गया तो?",
      },
      right: {
        title: "Right column: जो मैं control कर सकता हूँ",
        hint: "Actions: नींद, exercise, पानी, तैयारी, mind off करने की practice, mom को call।",
        placeholder: "जैसे: कल demo दो बार rehearse करना",
      },
    } as Record<Column, ColumnText>,
    add: "जोड़ें",
    addTo: (title: string) => `${title} में जोड़ें`,
    move: "दूसरे column में ले जाएँ",
    moveItem: (item: string) => `"${item}" को दूसरे column में ले जाएँ`,
    remove: (item: string) => `"${item}" हटाएँ`,
    summary: (left: number, total: number) =>
      `आपके ${total} items में से ${left} ऐसी चीज़ें हैं जिन्हें आप control नहीं कर सकते।`,
    mostlyLeft: " आपकी ज़्यादातर mental energy left column में जा रही है। आज करने के लिए right column का एक action चुनें।",
    mostlyRight: " बढ़िया: आपकी list की ज़्यादातर चीज़ों पर आप action ले सकते हैं।",
    clear: "दोनों columns खाली करें",
  },
};

type Text = (typeof TEXT)["en"];

function ColumnCard({
  column,
  text,
  t,
  items,
  onAdd,
  onRemove,
  onMove,
}: {
  column: Column;
  text: ColumnText;
  t: Text;
  items: string[];
  onAdd: (text: string) => void;
  onRemove: (index: number) => void;
  onMove: (index: number) => void;
}) {
  const [draft, setDraft] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = draft.trim();
    if (!value || items.length >= MAX_ITEMS) return;
    onAdd(value.slice(0, 200));
    setDraft("");
  }

  return (
    <div className={cn("rounded-xl border-2 bg-muted p-3.5", TONE[column])}>
      <h4 className="m-0! text-[15px]!">{text.title}</h4>
      <p className="mt-1! mb-2! text-[13px] text-muted-foreground">{text.hint}</p>
      <form onSubmit={submit} className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={text.placeholder}
          aria-label={t.addTo(text.title)}
          className="bg-card"
        />
        <Button type="submit" size="sm" variant="outline" disabled={!draft.trim()}>
          {t.add}
        </Button>
      </form>
      <ul className="m-0! mt-2! list-none! space-y-1.5 p-0!">
        {items.map((item, i) => (
          <li key={`${i}-${item}`} className="my-0! flex items-start gap-2 rounded-lg border bg-card px-2.5 py-1.5 text-sm">
            <span className="flex-1 break-words">{item}</span>
            <button
              type="button"
              onClick={() => onMove(i)}
              className="text-muted-foreground hover:text-foreground"
              title={t.move}
              aria-label={t.moveItem(item)}
            >
              <ArrowLeftRightIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="text-muted-foreground hover:text-bad"
              aria-label={t.remove(item)}
            >
              <XIcon className="size-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ControlColumns() {
  const t = useLocalized(TEXT);
  const [state, setState, reset] = useExerciseProgress<State>("control-columns", INITIAL);
  const left = Array.isArray(state.left) ? state.left : [];
  const right = Array.isArray(state.right) ? state.right : [];
  const lists: State = { left, right };
  const total = left.length + right.length;

  const other = (c: Column): Column => (c === "left" ? "right" : "left");

  return (
    <Exercise id="control-columns" title={t.title}>
      <p className="mt-0! text-[13px] text-muted-foreground">{t.intro}</p>
      <div className="grid gap-3 md:grid-cols-2">
        {(["left", "right"] as const).map((column) => (
          <ColumnCard
            key={column}
            column={column}
            text={t.columns[column]}
            t={t}
            items={lists[column]}
            onAdd={(text) => setState((p) => ({ ...p, [column]: [...(p[column] ?? []), text] }))}
            onRemove={(index) => setState((p) => ({ ...p, [column]: (p[column] ?? []).filter((_, i) => i !== index) }))}
            onMove={(index) =>
              setState((p) => {
                const from = p[column] ?? [];
                const to = other(column);
                return {
                  ...p,
                  [column]: from.filter((_, i) => i !== index),
                  [to]: [...(p[to] ?? []), from[index]],
                };
              })
            }
          />
        ))}
      </div>
      {total > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="m-0! text-sm">
            {t.summary(left.length, total)}
            {left.length > right.length ? t.mostlyLeft : t.mostlyRight}
          </p>
          <Button type="button" variant="outline" size="sm" className="ml-auto" onClick={reset}>
            {t.clear}
          </Button>
        </div>
      )}
    </Exercise>
  );
}
