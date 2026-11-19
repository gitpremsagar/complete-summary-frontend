import type { SummaryKind, SummaryMeta, SummaryStat, SummaryTranslation } from "@/lib/summaries";

export type SummaryStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type AdminRole = "USER" | "ADMIN";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
  commentCount: number;
  status: "ACTIVE" | "SUSPENDED";
}

export interface AdminUserDetail {
  user: AdminUser;
  progressEntries: number;
  recentComments: {
    id: string;
    summarySlug: string;
    body: string;
    createdAt: string;
    deletedAt: string | null;
  }[];
}

export interface AdminComment {
  id: string;
  body: string;
  summarySlug: string;
  createdAt: string;
  deletedAt: string | null;
  author: { id: string; name: string; email: string; suspended: boolean };
}

export interface AdminSummaryRow {
  slug: string;
  kind: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string | null;
  tags: string[];
  hasHindi: boolean;
  wordCount: number;
  status: SummaryStatus;
  archivedAt: string | null;
  hasBody: boolean;
  hasHindiBody: boolean;
}

export interface AdminSummaryDetail {
  meta: SummaryMeta | null;
  status: SummaryStatus;
  archivedAt: string | null;
  bodies: { en: string | null; hi: string | null };
  wordCount?: number;
}

export interface RevalidationResult {
  revalidated: boolean;
  message?: string;
}

export interface AdminStats {
  totals: {
    users: number;
    newUsers7d: number;
    admins: number;
    suspendedUsers: number;
    comments: number;
    deletedComments: number;
    comments7d: number;
    views: number;
    likes: number;
    dislikes: number;
  };
  trend: { date: string; users: number; comments: number }[];
  topSummaries: { slug: string; views: number; likes: number; dislikes: number; comments: number }[];
}

export interface AdminActivityAction {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  target: string;
  targetId: string | null;
  details?: Record<string, unknown> | null;
  createdAt: string;
}

export type { SummaryKind, SummaryMeta, SummaryStat, SummaryTranslation };
