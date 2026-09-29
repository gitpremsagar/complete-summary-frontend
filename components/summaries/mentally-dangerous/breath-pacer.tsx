"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Widget } from "@/components/summary/exercise";
import { cn } from "@/lib/utils";

const INHALE_MS = 4000;
const EXHALE_MS = 8000;
const BREATHS = 5;

type Phase = "idle" | "inhale" | "exhale" | "done";

export function BreathPacer() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [breath, setBreath] = useState(0);

  useEffect(() => {
    if (phase === "inhale") {
      const t = setTimeout(() => setPhase("exhale"), INHALE_MS);
      return () => clearTimeout(t);
    }
    if (phase === "exhale") {
      const t = setTimeout(() => {
        if (breath + 1 >= BREATHS) {
          setBreath(BREATHS);
          setPhase("done");
        } else {
          setBreath(breath + 1);
          setPhase("inhale");
        }
      }, EXHALE_MS);
      return () => clearTimeout(t);
    }
  }, [phase, breath]);

  const running = phase === "inhale" || phase === "exhale";
  const expanded = phase === "inhale";

  function start() {
    setBreath(0);
    setPhase("inhale");
  }

  return (
    <Widget title="Five long exhales">
      <p className="mt-0! text-[13px] text-muted-foreground">
        Inhale for 4 seconds, then make the exhale twice as long. Every long exhale tells your vagus nerve to slow your
        heart down. Five of these a day raises your HRV.
      </p>
      <div className="flex flex-col items-center gap-4 py-3 sm:flex-row sm:justify-center sm:gap-8">
        <div className="grid size-40 place-items-center">
          <div
            className={cn(
              "grid place-items-center rounded-full bg-brand/20 ring-2 ring-brand/60 ease-in-out motion-reduce:transition-none",
              expanded ? "size-40" : "size-20",
            )}
            style={{ transitionProperty: "width, height", transitionDuration: `${expanded ? INHALE_MS : EXHALE_MS}ms` }}
          >
            <span className="text-sm font-semibold text-brand" aria-live="polite">
              {phase === "inhale" && "Inhale"}
              {phase === "exhale" && "Exhale slowly"}
              {phase === "done" && "Done"}
              {phase === "idle" && "Ready"}
            </span>
          </div>
        </div>
        <div className="text-center sm:text-left">
          <div className="text-3xl font-extrabold tabular-nums">
            {Math.min(breath + (running ? 1 : 0), BREATHS)} / {BREATHS}
          </div>
          <div className="mb-3 text-[13px] text-muted-foreground">breaths</div>
          {running ? (
            <Button type="button" variant="outline" size="sm" onClick={() => setPhase("idle")}>
              Stop
            </Button>
          ) : (
            <Button type="button" size="sm" onClick={start}>
              {phase === "done" ? "Go again" : "Start"}
            </Button>
          )}
        </div>
      </div>
    </Widget>
  );
}
