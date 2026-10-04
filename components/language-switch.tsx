"use client";

import { usePathname } from "next/navigation";
import { LanguagesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, useT } from "@/components/providers/locale-provider";
import { isTranslatablePath, localePath } from "@/lib/i18n";

export function LanguageSwitch() {
  const locale = useLocale();
  const t = useT();
  const pathname = usePathname() ?? "/";
  const target = locale === "hi" ? "en" : "hi";
  const href = isTranslatablePath(pathname) ? localePath(pathname, target) : localePath("/", target);

  return (
    <Button variant="ghost" size="sm" asChild>
      {/* A plain <a> forces a full load, since each language has its own root layout. */}
      <a href={href} hrefLang={target} lang={target} aria-label={t.header.switchLabel}>
        <LanguagesIcon />
        {t.header.switchTo}
      </a>
    </Button>
  );
}
