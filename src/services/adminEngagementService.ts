import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

const base = `${API_CONFIG.BASE_URL}/admin/engagement`;

export type EngagementSummary = {
  totalUsers: number;
  newFeedbackOpen: number;
  newFeedback24h: number;
  newFeedbackWeek: number;
  activity24h: number;
};

export type PlatformMetrics = {
  newUsers24h: number;
  newUsers7d: number;
  contestsTotal: number;
  contestParticipantsTotal: number;
  webinarsTotal: number;
  coursesPublished: number;
  brokersPublished: number;
  signalsPublished: number;
  forumThreads: number;
  forumComments: number;
  forumPostsTotal: number;
  feedbackTotal: number;
  rebateCents30d: number;
  rebateUsd30d: number;
  activityByTypeLast7d: Record<string, number>;
  activityLast7dTotal: number;
};

export async function fetchAdminFullMetrics() {
  const res = await fetch(`${base}/metrics`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed");
  return data as { success: boolean; summary: EngagementSummary; platform: PlatformMetrics };
}

export async function fetchEngagementSummary() {
  const res = await fetch(`${base}/summary`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed");
  return data as { success: boolean; summary: EngagementSummary };
}

export type AdminFeedbackRow = {
  _id: string;
  email: string;
  message: string;
  status: string;
  page?: string;
  userNameSnapshot?: string;
  createdAt: string;
  userId?: { firstName?: string; lastName?: string; email?: string } | null;
};

export async function fetchAdminFeedback(page = 1, limit = 20, status?: string) {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) qs.set("status", status);
  const res = await fetch(`${base}/feedback?${qs}`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed");
  return data as {
    success: boolean;
    items: AdminFeedbackRow[];
    pagination: {
      totalItems: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export async function patchFeedbackStatus(id: string, status: "new" | "read" | "archived") {
  const res = await fetch(`${base}/feedback/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed");
  return data;
}

export async function deleteFeedbackAdmin(id: string) {
  const res = await fetch(`${base}/feedback/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed");
  return data;
}

export type AdminActivityFeedRow = {
  id: string;
  userId?: string;
  userLabel: string;
  type: string;
  title: string;
  description: string;
  time: string;
  createdAt: string;
};

export async function fetchAdminActivityFeed(page = 1, limit = 50, userId?: string) {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (userId) qs.set("userId", userId);
  const res = await fetch(`${base}/activity?${qs}`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed");
  return data as {
    success: boolean;
    items: AdminActivityFeedRow[];
    pagination: {
      totalItems: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}
