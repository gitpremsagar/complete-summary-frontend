"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { useAuth } from "@/components/providers/auth-provider";

export function SiteHeader() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const next = pathname && pathname !== "/" ? `?next=${encodeURIComponent(pathname)}` : "";

  return (
    <header className="sticky top-0 z-50 h-14 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <BookOpenTextIcon className="size-5 text-brand" />
          Complete Summary
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/summaries">Summaries</Link>
          </Button>
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          {isLoading ? (
            <div className="h-9 w-20" />
          ) : user ? (
            <UserNav />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/login${next}`}>Log in</Link>
              </Button>
              <Button size="sm" asChild className="hidden sm:inline-flex">
                <Link href={`/register${next}`}>Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
