import type { Metadata } from "next";
import { HomeView } from "@/components/pages/home-view";

export const metadata: Metadata = {
  alternates: { canonical: "/", languages: { en: "/", hi: "/hi", "x-default": "/" } },
};

export default function Home() {
  return <HomeView locale="en" />;
}
