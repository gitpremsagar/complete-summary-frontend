"use client";

import { Button } from "@/components/ui/button";
import { useLocalized } from "@/components/providers/locale-provider";
import { Exercise } from "@/components/summary/exercise";
import { useExerciseProgress } from "@/components/summary/progress-provider";

const GAME_IDS = ["breaths", "sunlight", "cold", "hard-sets", "gaze", "win", "harder", "off"] as const;

const TEXT = {
  en: {
    title: "Resilience reps this week",
    intro: "Every stressor is a rep. Tick the games you played each day, then clear the grid and start again next week.",
    reps: (done: number, total: number) => `${done} / ${total} reps.`,
    game: "Game",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    games: [
      "10 breaths before getting out of bed",
      "Morning sunlight, 5-10 min",
      "Cold shower: climb one more wall",
      "Made my work sets harder, not easier",
      "Dilated my gaze when overwhelmed",
      "Recalled something I survived or built",
      "Did the slightly harder thing",
      "Turned my mind off (NSDR, exhales, dim lights)",
    ],
    reset: "Start a new week",
  },
  hi: {
    title: "इस हफ़्ते के resilience reps",
    intro: "हर stressor एक rep है। हर दिन जो games खेले उन्हें tick करें, फिर grid खाली करके अगले हफ़्ते फिर शुरू करें।",
    reps: (done: number, total: number) => `${total} में से ${done} reps।`,
    game: "Game",
    days: ["सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि", "रवि"],
    games: [
      "बिस्तर से उठने से पहले 10 breaths",
      "Morning sunlight, 5-10 min",
      "Cold shower: एक और wall पार की",
      "Work sets आसान नहीं, मुश्किल किए",
      "Overwhelmed होने पर gaze फैलाई",
      "कुछ याद किया जिससे निकला या जो बनाया",
      "थोड़ा मुश्किल काम किया",
      "Mind off किया (NSDR, exhales, dim lights)",
    ],
    reset: "नया हफ़्ता शुरू करें",
  },
};

interface State {
  checked: string[];
}
const INITIAL: State = { checked: [] };

export function ResilienceWeek() {
  const t = useLocalized(TEXT);
  const [state, setState, reset] = useExerciseProgress<State>("resilience-week", INITIAL);
  const checked = new Set(Array.isArray(state.checked) ? state.checked : []);
  const total = GAME_IDS.length * t.days.length;

  function toggle(key: string) {
    setState((prev) => {
      const next = new Set(prev.checked);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return { checked: [...next] };
    });
  }

  return (
    <Exercise id="resilience-week" title={t.title}>
      <p className="mt-0! text-[13px] text-muted-foreground">
        {t.intro} <b className="text-foreground">{t.reps(checked.size, total)}</b>
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-y-1 text-sm">
          <thead>
            <tr>
              <th className="text-left font-medium text-muted-foreground">{t.game}</th>
              {t.days.map((d) => (
                <th key={d} className="w-10 text-center font-medium text-muted-foreground">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GAME_IDS.map((id, gi) => (
              <tr key={id}>
                <td className="rounded-l-lg bg-muted py-1.5 pr-2 pl-3">{t.games[gi]}</td>
                {t.days.map((day, di) => {
                  const key = `${id}:${di}`;
                  return (
                    <td key={day} className="bg-muted text-center last:rounded-r-lg">
                      <input
                        type="checkbox"
                        checked={checked.has(key)}
                        onChange={() => toggle(key)}
                        aria-label={`${t.games[gi]}, ${day}`}
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
        {t.reset}
      </Button>
    </Exercise>
  );
}
