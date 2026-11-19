import type { Metadata } from "next";
import { CommentsView } from "@/components/admin/comments-view";

export const metadata: Metadata = { title: "Comments" };

export default function AdminCommentsPage() {
  return <CommentsView />;
}
