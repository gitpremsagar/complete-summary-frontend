import type { Metadata } from "next";
import { SummaryEditor } from "@/components/admin/summary-editor";

export const metadata: Metadata = { title: "New summary" };

export default function NewSummaryPage() {
  return <SummaryEditor mode="create" />;
}
