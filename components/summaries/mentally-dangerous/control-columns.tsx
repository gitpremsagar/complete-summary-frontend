"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeftRightIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Exercise } from "@/components/summary/exercise";
import { useExerciseProgress } from "@/components/summary/progress-provider";
import { cn } from "@/lib/utils";

type Column = "left" | "right";
type State = Record<Column, string[]>;

const INITIAL: State = { left: [], right: [] };
const MAX_ITEMS = 30;

const COLUMNS: { key: Column; title: string; hint: string; placeholder: string; tone: string }[] = [
  {
    key: "left",
    title: "Left column: what concerns me",
    hint: "Worries, what people think of me, outcomes, other people's behavior.",
    placeholder: "e.g. What if the launch flops?",
    tone: "border-bad/50",
  },
  {
    key: "right",
    title: "Right column: what I can control",
    hint: "Actions: sleep, exercise, hydrate, prepare, practice turning my mind off, call my mother.",
    placeholder: "e.g. Rehearse the demo twice tomorrow",
    tone: "border-good/50",
  },
];

function ColumnCard({
  column,
  items,
  onAdd,
  onRemove,
  onMove,
}: {
  column: (typeof COLUMNS)[number];
  items: string[];
  onAdd: (text: string) => void;
  onRemove: (index: number) => void;
  onMove: (index: number) => void;
}) {
  const [draft, setDraft] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || items.length >= MAX_ITEMS) return;
    onAdd(text.slice(0, 200));
    setDraft("");
  }

  return (
    <div className={cn("rounded-xl border-2 bg-muted p-3.5", column.tone)}>
      <h4 className="m-0! text-[15px]!">{column.title}</h4>
      <p className="mt-1! mb-2! text-[13px] text-muted-foreground">{column.hint}</p>
      <form onSubmit={submit} className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={column.placeholder}
          aria-label={`Add to ${column.title}`}
          className="bg-card"
        />
        <Button type="submit" size="sm" variant="outline" disabled={!draft.trim()}>
          Add
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
              title="Move to the other column"
              aria-label={`Move "${item}" to the other column`}
            >
              <ArrowLeftRightIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="text-muted-foreground hover:text-bad"
              aria-label={`Remove "${item}"`}
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
  const [state, setState, reset] = useExerciseProgress<State>("control-columns", INITIAL);
  const left = Array.isArray(state.left) ? state.left : [];
  const right = Array.isArray(state.right) ? state.right : [];
  const lists: State = { left, right };
  const total = left.length + right.length;

  const other = (c: Column): Column => (c === "left" ? "right" : "left");

  return (
    <Exercise id="control-columns" title="Left column, right column">
      <p className="mt-0! text-[13px] text-muted-foreground">
        Do this about once a month. Dump everything on your mind into the two columns, then spend the month noticing
        which column your thoughts are in.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {COLUMNS.map((column) => (
          <ColumnCard
            key={column.key}
            column={column}
            items={lists[column.key]}
            onAdd={(text) => setState((p) => ({ ...p, [column.key]: [...(p[column.key] ?? []), text] }))}
            onRemove={(index) =>
              setState((p) => ({ ...p, [column.key]: (p[column.key] ?? []).filter((_, i) => i !== index) }))
            }
            onMove={(index) =>
              setState((p) => {
                const from = p[column.key] ?? [];
                const to = other(column.key);
                return {
                  ...p,
                  [column.key]: from.filter((_, i) => i !== index),
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
            <b>{left.length}</b> of your {total} items are things you can&apos;t control.
            {left.length > right.length
              ? " Most of your mental energy is going to the left column. Pick one right-column action to do today."
              : " Good: most of your list is things you can act on."}
          </p>
          <Button type="button" variant="outline" size="sm" className="ml-auto" onClick={reset}>
            Clear both columns
          </Button>
        </div>
      )}
    </Exercise>
  );
}
