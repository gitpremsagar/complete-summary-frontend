"use client";

import { Button } from "@/components/ui/button";
import { Exercise } from "@/components/summary/exercise";
import { useExerciseProgress } from "@/components/summary/progress-provider";
import { cn } from "@/lib/utils";

interface State {
  done: number[];
}
const INITIAL: State = { done: [] };

/** Tick-list exercise; progress is stored as the indexes of `items` that are done. */
export function ChecklistExercise({
  id = "action-checklist",
  title = "Your action checklist",
  items,
}: {
  id?: string;
  title?: string;
  items: string[];
}) {
  const [state, setState, reset] = useExerciseProgress<State>(id, INITIAL);
  const done = new Set(Array.isArray(state.done) ? state.done : []);

  function toggle(i: number, checked: boolean) {
    setState((prev) => {
      const next = new Set(prev.done);
      if (checked) next.add(i);
      else next.delete(i);
      return { done: [...next].sort((a, b) => a - b) };
    });
  }

  return (
    <Exercise id={id} title={title}>
      <p className="mt-0! text-[13px] text-muted-foreground">
        Tick items as you adopt them. Your progress is saved to your account.{" "}
        <b className="text-foreground">
          {done.size} / {items.length} done.
        </b>
      </p>
      <ul className="m-0! list-none! p-0!">
        {items.map((item, i) => (
          <li key={i} className="my-1.5!">
            <label
              className={cn(
                "flex cursor-pointer items-start gap-2.5 rounded-lg border bg-muted px-3 py-2",
                done.has(i) && "text-muted-foreground line-through",
              )}
            >
              <input
                type="checkbox"
                checked={done.has(i)}
                onChange={(e) => toggle(i, e.target.checked)}
                className="mt-1.5 size-4 shrink-0 accent-(--brand)"
              />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      <Button type="button" variant="outline" size="sm" className="mt-2" onClick={reset}>
        Reset checklist
      </Button>
    </Exercise>
  );
}
