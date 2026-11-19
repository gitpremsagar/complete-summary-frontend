"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRightIcon,
  BookOpenTextIcon,
  ExternalLinkIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MessageSquareTextIcon,
  UsersIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "cn";

const NAV: { href: string; label: string; icon: typeof LayoutDashboardIcon; exact?: boolean }[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboardIcon, exact: true },
  { href: "/admin/users", label: "Users", icon: UsersIcon },
  { href: "/admin/content", label: "Content", icon: BookOpenTextIcon },
  { href: "/admin/comments", label: "Comments", icon: MessageSquareTextIcon },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold tracking-tight">
          <BookOpenTextIcon className="size-5 text-brand" />
          Complete Summary
        </Link>
        <span className="ml-auto rounded-4xl border px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
          Admin
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className={cn("size-4", active && "text-brand")} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 p-3">
        <Link
          href="/"
          className="flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        >
          <ArrowUpRightIcon className="size-4" />
          View public site
        </Link>
        <Separator className="my-2" />
        {user && (
          <div className="flex items-center gap-2 px-1.5">
            <Avatar className="size-7">
              <AvatarFallback>{initials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <ThemeToggle />
            <Button variant="ghost" size="icon-sm" onClick={() => void logout()} aria-label="Sign out" title="Sign out">
              <LogOutIcon />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 flex items-center gap-1 overflow-x-auto border-b bg-background/95 px-2 py-2 backdrop-blur md:hidden">
      <Link href="/admin" className="mr-1 ml-1 flex shrink-0 items-center gap-1.5 text-sm font-semibold">
        <BookOpenTextIcon className="size-4 text-brand" />
        Admin
      </Link>
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Button key={href} asChild variant={active ? "secondary" : "ghost"} size="sm" className="shrink-0">
            <Link href={href}>
              <Icon />
              {label}
            </Link>
          </Button>
        );
      })}
      <Button asChild variant="ghost" size="icon-sm">
        <Link href="/" aria-label="Public site">
          <ExternalLinkIcon />
        </Link>
      </Button>
    </header>
  );
}
