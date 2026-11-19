import type { Metadata } from "next";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminMobileNav, AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Complete Summary Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-svh bg-muted/30">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminMobileNav />
          <div className="flex flex-1 flex-col">{children}</div>
        </div>
      </div>
    </AdminGuard>
  );
}
