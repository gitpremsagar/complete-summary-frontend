import { api, ApiError } from "@/lib/api";
import type {
  AdminActivityAction,
  AdminComment,
  AdminStats,
  AdminSummaryDetail,
  AdminSummaryRow,
  AdminUser,
  AdminUserDetail,
  AdminRole,
  RevalidationResult,
  SummaryMeta,
  SummaryStatus,
} from "@/lib/admin-types";

export { ApiError };

function query(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : "";
}

export const adminApi = {
  stats: () => api<AdminStats>(`/api/admin/stats`, { cache: "no-store" }),

  activity: (limit = 50) =>
    api<{ actions: AdminActivityAction[]; total: number }>(`/api/admin/stats/activity${query({ limit })}`, {
      cache: "no-store",
    }),

  logAction: (action: string, target: string, targetId?: string) =>
    api<void>("/api/admin/activity", {
      method: "POST",
      body: targetId === undefined ? { action, target } : { action, target, targetId },
    }),

  users: (params: { q?: string; role?: AdminRole; status?: "active" | "suspended" | "all"; page?: number; limit?: number }) =>
    api<{ users: AdminUser[]; total: number; page: number; limit: number }>(
      `/api/admin/users${query(params)}`,
      { cache: "no-store" },
    ),

  user: (id: string) => api<AdminUserDetail>(`/api/admin/users/${id}`, { cache: "no-store" }),

  updateUser: (id: string, body: { role?: AdminRole; name?: string }) =>
    api<{ user: AdminUser }>(`/api/admin/users/${id}`, { method: "PATCH", body }),

  resetPassword: (id: string, password: string) =>
    api<{ ok: true }>(`/api/admin/users/${id}/reset-password`, { method: "POST", body: { password } }),

  revokeSessions: (id: string) =>
    api<{ revoked: number }>(`/api/admin/users/${id}/revoke-sessions`, { method: "POST" }),

  suspendUser: (id: string) => api<{ user: AdminUser }>(`/api/admin/users/${id}/suspend`, { method: "POST" }),

  restoreUser: (id: string) => api<{ user: AdminUser }>(`/api/admin/users/${id}/restore`, { method: "POST" }),

  comments: (params: { q?: string; slug?: string; status?: "active" | "deleted" | "all"; page?: number; limit?: number }) =>
    api<{ comments: AdminComment[]; total: number; page: number; limit: number }>(
      `/api/admin/comments${query(params)}`,
      { cache: "no-store" },
    ),

  deleteComment: (id: string) => api<{ ok: true }>(`/api/admin/comments/${id}/delete`, { method: "POST" }),

  restoreComment: (id: string) => api<{ ok: true }>(`/api/admin/comments/${id}/restore`, { method: "POST" }),

  summaries: (params: { q?: string; status?: SummaryStatus; page?: number; limit?: number }) =>
    api<{ summaries: AdminSummaryRow[]; total: number; page: number; limit: number; statusCounts: Record<SummaryStatus, number> }>(
      `/api/admin/summaries${query(params)}`,
      { cache: "no-store" },
    ),

  summary: (slug: string) =>
    api<{ summary: AdminSummaryDetail | null; status: SummaryStatus; archivedAt: string | null }>(
      `/api/admin/summaries/${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    ),

  createSummary: (body: { meta: SummaryMeta; bodies: { en?: string; hi?: string } }) =>
    api<{ summary: AdminSummaryDetail; revalidation: RevalidationResult }>("/api/admin/summaries", {
      method: "POST",
      body,
    }),

  updateSummary: (slug: string, body: { meta: SummaryMeta; bodies: { en?: string; hi?: string } }) =>
    api<{ summary: AdminSummaryDetail; revalidation: RevalidationResult }>(
      `/api/admin/summaries/${encodeURIComponent(slug)}`,
      { method: "PUT", body },
    ),

  setSummaryStatus: (slug: string, status: SummaryStatus) =>
    api<{ ok: true; revalidation: RevalidationResult }>(`/api/admin/summaries/${encodeURIComponent(slug)}`, {
      method: "PATCH",
      body: { status },
    }),

  archiveSummary: (slug: string) =>
    api<{ ok: true; revalidation: RevalidationResult }>(`/api/admin/summaries/${encodeURIComponent(slug)}/archive`, {
      method: "POST",
    }),

  restoreSummary: (slug: string) =>
    api<{ ok: true; revalidation?: RevalidationResult }>(`/api/admin/summaries/${encodeURIComponent(slug)}/restore`, {
      method: "POST",
    }),
};
