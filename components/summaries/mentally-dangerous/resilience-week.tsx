"use client";

import { Button } from "@/components/ui/button";
import { Exercise } from "@/components/summary/exercise";
import { useExerciseProgress } from "@/components/summary/progress-provider";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const GAMES = [
  { id: "breaths", name: "10 breaths before getting out of bed" },
  { id: "sunlight", name: "Morning sunlight, 5-10 min" },
  { id: "cold", name: "Cold shower: climb one more wall" },
  { id: "hard-sets", name: "Made my work sets harder, not easier" },
  { id: "gaze", name: "Dilated my gaze when overwhelmed" },
  { id: "win", name: "Recalled something I survived or built" },
  { id: "harder", name: "Did the slightly harder thing" },
  { id: "off", name: "Turned my mind off (NSDR, exhales, dim lights)" },
];

interface State {
  checked: string[];
}
const INITIAL: State = { checked: [] };

export function ResilienceWeek() {
  const [state, setState, reset] = useExerciseProgress<State>("resilience-week", INITIAL);
  const checked = new Set(Array.isArray(state.checked) ? state.checked : []);
  const total = GAMES.length * DAYS.length;

  function toggle(key: string) {
    setState((prev) => {
      const next = new Set(prev.checked);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return { checked: [...next] };
    });
  }

  return (
    <Exercise id="resilience-week" title="Resilience reps this week">
      <p className="mt-0! text-[13px] text-muted-foreground">
        Every stressor is a rep. Tick the games you played each day, then clear the grid and start again next week.{" "}
        <b className="text-foreground">
          {checked.size} / {total} reps.
        </b>
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-y-1 text-sm">
          <thead>
            <tr>
              <th className="text-left font-medium text-muted-foreground">Game</th>
              {DAYS.map((d) => (
                <th key={d} className="w-10 text-center font-medium text-muted-foreground">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GAMES.map((game) => (
              <tr key={game.id}>
                <td className="rounded-l-lg bg-muted py-1.5 pr-2 pl-3">{game.name}</td>
                {DAYS.map((day, di) => {
                  const key = `${game.id}:${di}`;
                  return (
                    <td key={day} className="bg-muted text-center last:rounded-r-lg">
                      <input
                        type="checkbox"
                        checked={checked.has(key)}
                        onChange={() => toggle(key)}
                        aria-label={`${game.name}, ${day}`}
                        className="size-4 accent-(--brand)"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button type="button" variant="outline" size="sm" className="mt-2" onClick={reset}>
        Start a new week
      </Button>
    </Exercise>
  );
}
