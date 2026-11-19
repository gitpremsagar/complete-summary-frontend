"use client";

import type { ReactNode } from "react";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { ThemeToggle } from "@/components/theme-toggle";

export function AdminTopbar({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-8">
      <AdminBreadcrumb fallback={title} />
      <div className="ml-auto flex items-center gap-2">
        {actions}
        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
