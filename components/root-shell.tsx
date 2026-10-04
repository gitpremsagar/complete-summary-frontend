import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import type { Locale } from "@/lib/i18n";

export function RootShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LocaleProvider locale={locale}>
        <AuthProvider>
          <SiteHeader />
          {children}
        </AuthProvider>
      </LocaleProvider>
      <Toaster richColors position="top-center" />
    </ThemeProvider>
  );
}
