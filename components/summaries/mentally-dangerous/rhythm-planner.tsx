"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Exercise } from "@/components/summary/exercise";
import { useExerciseProgress } from "@/components/summary/progress-provider";
import { Output } from "@/components/summary/widget-ui";
import { cn } from "@/lib/utils";

interface State {
  wake: string;
  bed: string;
}
const INITIAL: State = { wake: "07:00", bed: "23:00" };

const DAY = 24 * 60;

function toMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h > 23 || m > 59) return null;
  return h * 60 + m;
}

function formatTime(minutes: number) {
  const m = ((Math.round(minutes) % DAY) + DAY) % DAY;
  const h24 = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, "0");
  const suffix = h24 < 12 ? "a.m." : "p.m.";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${mm} ${suffix}`;
}

function formatHours(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

function TimeField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-[13px] text-muted-foreground">
        {label}
      </label>
      <Input id={id} type="time" value={value} onChange={(e) => onChange(e.target.value)} className="bg-card" />
    </div>
  );
}

interface Band {
  label: string;
  start: number;
  end: number;
  className: string;
}

export function RhythmPlanner() {
  const [state, setState] = useExerciseProgress<State>("daily-rhythm", INITIAL);
  const wake = toMinutes(state.wake);
  const bedRaw = toMinutes(state.bed);

  let plan: { awake: number; sleep: number; rows: [string, string][]; bands: Band[] } | null = null;
  if (wake !== null && bedRaw !== null) {
    const bed = bedRaw <= wake ? bedRaw + DAY : bedRaw;
    const awake = bed - wake;
    const caffeineCutoff = bed - 8 * 60;
    const dimLights = bed - 60;
    const midday = wake + awake / 2;
    plan = {
      awake,
      sleep: DAY - awake,
      rows: [
        [
          `${formatTime(wake)} to ${formatTime(wake + 60)}`,
          "Get outside: 5-10 minutes of sunlight in your eyes (no sunglasses), or a 10,000 lux light. Hydrate, have your tea or coffee, move a little. No phone in bed.",
        ],
        [`${formatTime(wake)} to ${formatTime(midday)}`, "Best window for exercise (the first half of your day)."],
        [
          caffeineCutoff > wake ? `Until ${formatTime(caffeineCutoff)}` : "Skip it",
          caffeineCutoff > wake
            ? "Caffeine is fine. After this, stop: no caffeine in the 8 hours before sleep."
            : "Your day is shorter than 8 hours, so there's no safe caffeine window.",
        ],
        [
          `${formatTime(dimLights)} to ${formatTime(bed)}`,
          "Final hour: dim the lights, cool down, a few long exhales. Learn to turn your mind off.",
        ],
      ],
      bands: [
        { label: "Sunlight", start: wake, end: wake + 60, className: "bg-warn" },
        { label: "Exercise", start: wake, end: midday, className: "bg-good/70" },
        { label: "Caffeine OK", start: wake, end: Math.max(wake, caffeineCutoff), className: "bg-brand/70" },
        { label: "Dim lights", start: dimLights, end: bed, className: "bg-foreground/70" },
      ],
    };
  }

  return (
    <Exercise id="daily-rhythm" title="Plan your cortisol day">
      <p className="mt-0! text-[13px] text-muted-foreground">
        &quot;Morning&quot; means the first hour or two after <i>you</i> wake up, not a clock time. Enter your natural
        schedule and get your personal plan.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <TimeField label="I usually wake up at" value={state.wake} onChange={(wake) => setState((p) => ({ ...p, wake }))} />
        <TimeField label="I usually go to sleep at" value={state.bed} onChange={(bed) => setState((p) => ({ ...p, bed }))} />
      </div>

      {plan ? (
        <>
          <div className="mt-4 space-y-1.5" aria-hidden="true">
            {plan.bands.map((band) => {
              const left = ((band.start - (wake ?? 0)) / plan.awake) * 100;
              const width = ((band.end - band.start) / plan.awake) * 100;
              return (
                <div key={band.label} className="flex items-center gap-2 text-xs">
                  <span className="w-20 shrink-0 text-muted-foreground">{band.label}</span>
                  <div className="relative h-3 flex-1 rounded-full bg-muted">
                    <div
                      className={cn("absolute inset-y-0 rounded-full", band.className)}
                      style={{ left: `${left}%`, width: `${Math.max(width, 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="flex justify-between pl-22 text-[11px] text-muted-foreground">
              <span>Wake {formatTime(wake ?? 0)}</span>
              <span>Sleep {formatTime((wake ?? 0) + plan.awake)}</span>
            </div>
          </div>
          <Output>
            <ul className="m-0! space-y-2 pl-4!">
              {plan.rows.map(([when, what]) => (
                <li key={when + what} className="my-0!">
                  <b>{when}:</b> {what}
                </li>
              ))}
            </ul>
            <p className={cn("mt-3! mb-0! text-[13px]", plan.sleep < 6 * 60 ? "text-bad" : "text-muted-foreground")}>
              That&apos;s {formatHours(plan.sleep)} in bed.
              {plan.sleep < 6 * 60 && " Huberman's baseline assumes 6 to 8 hours."}
            </p>
          </Output>
        </>
      ) : (
        <Output>Enter both times to see your plan.</Output>
      )}
    </Exercise>
  );
}
