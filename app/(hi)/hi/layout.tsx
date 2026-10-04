import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Devanagari } from "next/font/google";
import { RootShell } from "@/components/root-shell";
import { getDictionary } from "@/lib/dictionaries";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "../../globals.css";

const geistSans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const devanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const t = getDictionary("hi");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}: ${t.home.metaTitle}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: t.home.subtitle,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "hi_IN",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: t.home.subtitle,
    url: "/hi",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: t.home.subtitle,
  },
};

export default function HindiRootLayout({ children }: LayoutProps<"/hi">) {
  return (
    <html
      lang="hi"
      className={`${geistSans.variable} ${devanagari.variable} ${geistMono.variable} h-full antialiased`}
      style={{ "--font-sans": "var(--font-geist), var(--font-devanagari), sans-serif" } as CSSProperties}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <RootShell locale="hi">{children}</RootShell>
      </body>
    </html>
  );
}
