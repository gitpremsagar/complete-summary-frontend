"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon } from "lucide-react";

const LABELS: Record<string, string> = {
  admin: "Admin",
  users: "Users",
  content: "Content",
  comments: "Comments",
  new: "New summary",
};

export function AdminBreadcrumb({ fallback }: { fallback: string }) {
  const pathname = usePathname() ?? "/admin";
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((segment, index) => ({
    href: `/${segments.slice(0, index + 1).join("/")}`,
    label: LABELS[segment] ?? segment,
    last: index === segments.length - 1,
  }));

  if (crumbs.length <= 1) return <span className="text-sm font-medium">{fallback}</span>;

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-sm">
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex min-w-0 items-center gap-1">
          {crumb.last ? (
            <span className="truncate font-medium">{crumb.label}</span>
          ) : (
            <>
              <Link href={crumb.href} className="truncate text-muted-foreground transition-colors hover:text-foreground">
                {crumb.label}
              </Link>
              <ChevronRightIcon className="size-3.5 shrink-0 text-muted-foreground" />
            </>
          )}
        </span>
      ))}
    </nav>
  );
}
