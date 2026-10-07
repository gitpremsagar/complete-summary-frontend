import { api } from "@/lib/api";

export type Reaction = "LIKE" | "DISLIKE";

export interface EngagementStats {
  views: number;
  likes: number;
  dislikes: number;
  comments: number;
}

export interface CommentItem {
  id: string;
  body: string;
  createdAt: string;
  author: { id: string; name: string };
  canDelete: boolean;
}

export interface EngagementState {
  stats: EngagementStats;
  myReaction: Reaction | null;
}

export const MAX_COMMENT_LENGTH = 2000;

export const EMPTY_STATS: EngagementStats = { views: 0, likes: 0, dislikes: 0, comments: 0 };

const base = (slug: string) => `/api/summaries/${encodeURIComponent(slug)}`;
const quiet = { redirectOnUnauthorized: false } as const;

export function fetchStats(slugs: string[]) {
  const query = slugs.map(encodeURIComponent).join(",");
  return api<{ stats: Record<string, EngagementStats> }>(`/api/summaries/stats?slugs=${query}`, quiet);
}

export function fetchEngagement(slug: string) {
  return api<EngagementState>(`${base(slug)}/engagement`, quiet);
}

export function recordView(slug: string) {
  return api<{ views: number }>(`${base(slug)}/view`, { ...quiet, method: "POST" });
}

export function setReaction(slug: string, type: Reaction | null) {
  return api<EngagementState>(`${base(slug)}/reaction`, { ...quiet, method: "PUT", body: { type } });
}

export function fetchComments(slug: string, cursor?: string | null) {
  const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
  return api<{ comments: CommentItem[]; nextCursor: string | null }>(`${base(slug)}/comments${query}`, quiet);
}

export function postComment(slug: string, body: string) {
  return api<{ comment: CommentItem }>(`${base(slug)}/comments`, { ...quiet, method: "POST", body: { body } });
}

export function deleteComment(slug: string, id: string) {
  return api<void>(`${base(slug)}/comments/${encodeURIComponent(id)}`, { ...quiet, method: "DELETE" });
}

export function formatCount(n: number, locale: string) {
  return new Intl.NumberFormat(locale === "hi" ? "en-IN" : "en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}
