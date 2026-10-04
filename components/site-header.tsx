"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitch } from "@/components/language-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale, useT } from "@/components/providers/locale-provider";
import { localePath } from "@/lib/i18n";

export function SiteHeader() {
  const { user, isLoading } = useAuth();
  const locale = useLocale();
  const t = useT();
  const pathname = usePathname();
  const home = localePath("/", locale);
  const next = pathname && pathname !== "/" ? `?next=${encodeURIComponent(pathname)}` : "";

  return (
    <header className="sticky top-0 z-50 h-14 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center gap-4 px-4">
        <Link href={home} className="flex items-center gap-2 font-semibold tracking-tight">
          <BookOpenTextIcon className="size-5 text-brand" />
          Complete Summary
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Button variant="ghost" size="sm" asChild>
            <Link href={localePath("/summaries", locale)}>{t.header.summaries}</Link>
          </Button>
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <LanguageSwitch />
          <ThemeToggle />
          {isLoading ? (
            <div className="h-9 w-20" />
          ) : user ? (
            <UserNav />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/login${next}`}>{t.header.login}</Link>
              </Button>
              <Button size="sm" asChild className="hidden sm:inline-flex">
                <Link href={`/register${next}`}>{t.header.signup}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
