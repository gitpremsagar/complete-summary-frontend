"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CheckIcon, CloudAlertIcon, Loader2Icon, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { useT } from "@/components/providers/locale-provider";
import { useProgressContext, type SaveStatus } from "@/components/summary/progress-provider";
import { cn } from "@/lib/utils";

function WidgetTitle({ label, title, aside }: { label: string; title: string; aside?: ReactNode }) {
  return (
    <div className="mb-2 flex flex-wrap items-center gap-2">
      <span className="rounded-[5px] bg-brand px-1.5 py-0.5 text-[10px] font-semibold tracking-widest text-white uppercase">
        {label}
      </span>
      <h3 className="m-0! text-[15px]! font-bold text-brand!">{title}</h3>
      {aside && <div className="ml-auto">{aside}</div>}
    </div>
  );
}

/** Public interactive visual that is part of the content (no login needed). */
export function Widget({ title, children }: { title: string; children: ReactNode }) {
  const t = useT().widget;
  return (
    <div className="cs-widget">
      <WidgetTitle label={t.interactive} title={title} />
      {children}
    </div>
  );
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  const t = useT().widget;
  if (status === "saving")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Loader2Icon className="size-3 animate-spin" /> {t.saving}
      </span>
    );
  if (status === "saved")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-good">
        <CheckIcon className="size-3" /> {t.saved}
      </span>
    );
  if (status === "error")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-bad">
        <CloudAlertIcon className="size-3" /> {t.saveError}
      </span>
    );
  return null;
}

/**
 * Personal exercise. Guests see a locked preview; logged-in users can use it and
 * their answers are saved to their account under `id`.
 */
export function Exercise({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const t = useT().widget;
  const { loaded, status } = useProgressContext();
  const pathname = usePathname();
  const next = encodeURIComponent(`${pathname}#exercise-${id}`);
  const unlocked = Boolean(user) && loaded;

  return (
    <div id={`exercise-${id}`} className="cs-widget scroll-mt-32">
      <WidgetTitle
        label={t.exercise}
        title={title}
        aside={user ? <SaveIndicator status={status[id] ?? "idle"} /> : null}
      />
      {unlocked ? (
        children
      ) : (
        <div className="relative min-h-64">
          <div inert className={cn("select-none", !isLoading && !user && "opacity-50 blur-[1.5px]")}>
            {children}
          </div>
          <div className="absolute inset-x-0 top-4 flex justify-center px-2">
            <div className="flex max-w-sm flex-col items-center gap-3 rounded-2xl border bg-card/95 p-5 text-center shadow-lg backdrop-blur">
              {isLoading || user ? (
                <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <span className="grid size-10 place-items-center rounded-full bg-brand/15 text-brand">
                    <LockIcon className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold">{t.lockTitle}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t.lockText}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" asChild>
                      <Link href={`/login?next=${next}`}>{t.login}</Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/register?next=${next}`}>{t.register}</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
