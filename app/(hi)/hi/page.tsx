import type { Metadata } from "next";
import { HomeView } from "@/components/pages/home-view";

export const metadata: Metadata = {
  alternates: { canonical: "/hi", languages: { en: "/", hi: "/hi", "x-default": "/" } },
};

export default function HindiHome() {
  return <HomeView locale="hi" />;
}
