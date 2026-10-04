"use client";

import { useEffect, useRef, useState } from "react";
import { useLocalized } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Exercise } from "@/components/summary/exercise";
import { useExerciseProgress } from "@/components/summary/progress-provider";
import { cn } from "@/lib/utils";

const LETTERS = "IAMAGREATMULTITASKER".split("");
const NUMBERS = Array.from({ length: 20 }, (_, i) => String(i + 1));
const ROUNDS: Record<1 | 2, string[]> = {
  1: [...LETTERS, ...NUMBERS],
  2: LETTERS.flatMap((letter, i) => [letter, NUMBERS[i]]),
};
const RAJ = { r1: 17.72, r2: 41.35 };

interface RoundResult {
  t: number;
  e: number;
}
interface Results {
  r1?: RoundResult;
  r2?: RoundResult;
}
const INITIAL: Results = {};

interface Game {
  round: 0 | 1 | 2;
  idx: number;
  errors: number;
  start: number | null;
  done: boolean;
}
const IDLE: Game = { round: 0, idx: 0, errors: 0, start: null, done: false };

const TEXT = {
  en: {
    title: "Try the multitasking test yourself (keyboard version)",
    intro:
      'Type each highlighted item (letter or number) in the box. It advances automatically when correct; wrong keys count as mistakes. Round 1 is sequential; round 2 alternates letter, number, letter, number. "IAMAGREATMULTITASKER" has exactly 20 letters, one for each number.',
    start1: "Start Round 1 (sequential)",
    start2: "Start Round 2 (alternating)",
    reset: "Reset",
    placeholder: "type here",
    inputLabel: "Type the highlighted item",
    rows: ["Raj: sequential", "Raj: alternating", "You: sequential", "You: alternating"],
    notYet: "not yet",
    mistakes: (r1: number | string, r2: number | string) => `Your mistakes: round 1 = ${r1}, round 2 = ${r2}`,
    idle: "Press a start button.",
    round1: "Round 1: type the letters, then the numbers. The timer starts on your first key.",
    round2: "Round 2: alternate letter, number, letter, number... The timer starts on your first key.",
    done: (round: number, time: string, errors: number) =>
      `Round ${round} done in ${time}s with ${errors} mistake${errors === 1 ? "" : "s"}.`,
    cost: (ratio: string) => ` Switching cost you ${ratio}x the time (Raj: 2.33x).`,
    next: " Now try Round 2.",
  },
  hi: {
    title: "Multitasking test ख़ुद आज़माएँ (keyboard version)",
    intro:
      'हर highlighted item (letter या number) box में type करें। सही होने पर यह अपने आप आगे बढ़ता है; ग़लत keys mistakes गिनी जाती हैं। Round 1 sequential है; round 2 में letter, number, letter, number बारी-बारी से आते हैं। "IAMAGREATMULTITASKER" में ठीक 20 letters हैं, हर number के लिए एक।',
    start1: "Round 1 शुरू करें (sequential)",
    start2: "Round 2 शुरू करें (alternating)",
    reset: "Reset",
    placeholder: "यहाँ type करें",
    inputLabel: "Highlighted item type करें",
    rows: ["Raj: sequential", "Raj: alternating", "आप: sequential", "आप: alternating"],
    notYet: "अभी नहीं",
    mistakes: (r1: number | string, r2: number | string) => `आपकी mistakes: round 1 = ${r1}, round 2 = ${r2}`,
    idle: "कोई start button दबाएँ।",
    round1: "Round 1: पहले letters, फिर numbers type करें। Timer आपकी पहली key से शुरू होगा।",
    round2: "Round 2: letter, number, letter, number बारी-बारी से... Timer आपकी पहली key से शुरू होगा।",
    done: (round: number, time: string, errors: number) => `Round ${round}, ${time}s में ${errors} mistakes के साथ पूरा।`,
    cost: (ratio: string) => ` Switching से आपको ${ratio}x समय लगा (Raj: 2.33x)।`,
    next: " अब Round 2 आज़माएँ।",
  },
};

function Bars({ results }: { results: Results }) {
  const t = useLocalized(TEXT);
  const rows: [string, number | undefined, boolean][] = [
    [t.rows[0], RAJ.r1, false],
    [t.rows[1], RAJ.r2, true],
    [t.rows[2], results.r1?.t, false],
    [t.rows[3], results.r2?.t, true],
  ];
  const max = Math.max(...rows.map((r) => r[1] ?? 0));
  return (
    <div className="mt-3">
      {rows.map(([label, value, alt]) => (
        <div key={label} className="my-1.5 flex items-center gap-2.5 text-sm">
          <div className="w-36 shrink-0 text-muted-foreground sm:w-44">{label}</div>
          {value ? (
            <div
              className={cn(
                "flex h-[22px] min-w-0.5 items-center justify-end rounded-md pr-1.5 text-xs font-bold text-white transition-[width] duration-500",
                alt ? "bg-warn" : "bg-brand",
              )}
              style={{ width: `${(value / max) * 70}%` }}
            >
              {value}s
            </div>
          ) : (
            <span className="text-[13px] text-muted-foreground">{t.notYet}</span>
          )}
        </div>
      ))}
      {(results.r1 || results.r2) && (
        <div className="text-[13px] text-muted-foreground">{t.mistakes(results.r1?.e ?? "-", results.r2?.e ?? "-")}</div>
      )}
    </div>
  );
}

export function MultitaskTest() {
  const text = useLocalized(TEXT);
  const [results, setResults, resetResults] = useExerciseProgress<Results>("multitask-test", INITIAL);
  const [game, setGame] = useState<Game>(IDLE);
  const [input, setInput] = useState("");
  const [flash, setFlash] = useState(false);
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const tokens = game.round ? ROUNDS[game.round] : [];
  const running = game.start !== null && !game.done;

  useEffect(() => {
    if (!running || game.start === null) return;
    const start = game.start;
    let frame = requestAnimationFrame(function tick() {
      if (timerRef.current) timerRef.current.textContent = `${((performance.now() - start) / 1000).toFixed(2)}s`;
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [running, game.start]);

  useEffect(() => {
    if (game.round && game.idx === 0 && !game.done) inputRef.current?.focus();
  }, [game.round, game.idx, game.done]);

  function startRound(round: 1 | 2) {
    setGame({ ...IDLE, round });
    setInput("");
    setFinalTime(null);
    if (timerRef.current) timerRef.current.textContent = "0.00s";
  }

  function onType(raw: string) {
    if (!game.round || game.done) return;
    const start = game.start ?? performance.now();
    const value = raw.toUpperCase().replace(/\s/g, "");
    const target = tokens[game.idx];

    if (value === target) {
      const idx = game.idx + 1;
      setInput("");
      if (idx >= tokens.length) {
        const t = +((performance.now() - start) / 1000).toFixed(2);
        setGame({ ...game, idx, start, done: true });
        setFinalTime(t);
        if (timerRef.current) timerRef.current.textContent = `${t.toFixed(2)}s`;
        setResults((prev) => ({ ...prev, [`r${game.round}`]: { t, e: game.errors } }));
      } else {
        setGame({ ...game, idx, start });
      }
    } else if (!target.startsWith(value)) {
      setGame({ ...game, errors: game.errors + 1, start });
      setInput("");
      setFlash(true);
      setTimeout(() => setFlash(false), 250);
    } else {
      setGame({ ...game, start });
      setInput(raw);
    }
  }

  function reset() {
    resetResults();
    setGame(IDLE);
    setInput("");
    setFinalTime(null);
    if (timerRef.current) timerRef.current.textContent = "0.00s";
  }

  let status = text.idle;
  if (game.round && !game.done) {
    status = game.round === 1 ? text.round1 : text.round2;
  } else if (game.done && finalTime !== null) {
    status = text.done(game.round, finalTime.toFixed(2), game.errors);
    const r1 = game.round === 1 ? finalTime : results.r1?.t;
    const r2 = game.round === 2 ? finalTime : results.r2?.t;
    if (r1 && r2) status += text.cost((r2 / r1).toFixed(2));
    else if (game.round === 1) status += text.next;
  }

  return (
    <Exercise id="multitask-test" title={text.title}>
      <p className="mt-0! text-[13px] text-muted-foreground">{text.intro}</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        <Button type="button" onClick={() => startRound(1)}>
          {text.start1}
        </Button>
        <Button type="button" variant="outline" onClick={() => startRound(2)}>
          {text.start2}
        </Button>
        <Button type="button" variant="ghost" onClick={reset}>
          {text.reset}
        </Button>
      </div>
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
        <div ref={timerRef} className="text-[34px] font-extrabold text-brand-2 tabular-nums">
          0.00s
        </div>
        <div className="text-[13px] text-muted-foreground" aria-live="polite">
          {status}
        </div>
      </div>
      {game.round > 0 && (
        <div className="rounded-xl border bg-card px-3.5 py-2.5 font-mono text-xl leading-[2.1] tracking-[2px] break-all">
          {tokens.map((token, i) => (
            <span key={i}>
              <span
                className={cn(
                  "rounded px-0.5",
                  i < game.idx && "text-good",
                  i === game.idx && !game.done && "bg-brand text-white",
                )}
              >
                {token}
              </span>{" "}
              {game.round === 1 && i === 19 && <br />}
            </span>
          ))}
        </div>
      )}
      <Input
        ref={inputRef}
        value={input}
        onChange={(e) => onType(e.target.value)}
        disabled={!game.round || game.done}
        autoComplete="off"
        autoCapitalize="characters"
        placeholder={text.placeholder}
        aria-label={text.inputLabel}
        className={cn(
          "mt-2.5 h-12 bg-card text-center text-[22px]! tracking-[3px]",
          flash && "border-bad bg-bad/20",
        )}
      />
      <Bars results={results} />
    </Exercise>
  );
}
