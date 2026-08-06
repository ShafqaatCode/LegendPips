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
  newUsers24h?: number;
  newUsers7d: number;
  contestsTotal: number;
  contestParticipantsTotal: number;
  contestsOngoing?: number;
  webinarsTotal: number;
  coursesPublished: number;
  brokersPublished: number;
  signalsPublished: number;
  signalsActive?: number;
  forumThreads?: number;
  forumComments?: number;
  forumPostsTotal?: number;
  feedbackTotal?: number;
  activeUsers?: number;
  blockedUsers?: number;
  kycPending?: number;
  kycApproved?: number;
  kycRejected?: number;
  kycIncomplete?: number;
  rebateCredits30dCount?: number;
  rebateCents30d: number;
  rebateUsd30d: number;
  rebateCentsAllTime?: number;
  rebateUsdAllTime?: number;
  activityByTypeLast7d: Record<string, number>;
  activityLast7dTotal: number;
  userSignupsLast7d: { date: string; label: string; count: number }[];
  activityDailyLast7d: { date: string; label: string; count: number }[];
  kycStatusBreakdown: Record<string, number>;
  referralInvitesTotal?: number;
  referralInvites24h?: number;
  referralInvites7d?: number;
  ibChangeTotal?: number;
  ibChange24h?: number;
  ibChangeOpen?: number;
};

export type DashboardPreviews = {
  recentUsers: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    kycStatus?: string;
    status?: string;
    createdAt?: string;
  }[];
  recentContests: {
    id: string;
    title: string;
    status: string;
    participants: number;
    entry?: string;
    createdAt?: string;
  }[];
  pendingKyc: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    submittedAt?: string;
  }[];
  recentFeedback: {
    id: string;
    email: string;
    status: string;
    preview: string;
    name?: string;
    createdAt?: string;
  }[];
  recentActivity: {
    id: string;
    userLabel: string;
    type: string;
    title: string;
    time: string;
  }[];
  recentReferrals?: {
    id: string;
    toEmail: string;
    friendName?: string;
    templateTitle: string;
    inviterName: string;
    inviterEmail: string;
    fromUserId?: string;
    createdAt?: string;
    time?: string;
  }[];
  recentIbChanges?: {
    id: string;
    userName: string;
    userEmail: string;
    currentBroker: string;
    requestedBroker: string;
    status: string;
    createdAt?: string;
    time?: string;
  }[];
};

export async function fetchAdminDashboardCharts() {
  const res = await fetch(`${base}/dashboard/charts`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed");
  return data as { success: boolean; platform: Pick<
    PlatformMetrics,
    | "activityByTypeLast7d"
    | "activityLast7dTotal"
    | "userSignupsLast7d"
    | "activityDailyLast7d"
    | "kycStatusBreakdown"
  > };
}

export async function fetchAdminDashboard() {
  const res = await fetch(`${base}/dashboard`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed");
  return data as {
    success: boolean;
    summary: EngagementSummary;
    platform: PlatformMetrics;
    previews: DashboardPreviews;
  };
}

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

export type AdminReferralRow = {
  id: string;
  toEmail: string;
  friendName?: string;
  templateId: string;
  templateTitle: string;
  subject: string;
  fromUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    name: string;
  };
  createdAt?: string;
  time?: string;
};

export type AdminReferralStats = {
  total: number;
  last24h: number;
  last7d: number;
  uniqueInviters: number;
};

export async function fetchAdminReferrals(page = 1, limit = 25, q?: string) {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (q?.trim()) qs.set("q", q.trim());
  const res = await fetch(`${base}/referrals?${qs}`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed");
  return data as {
    success: boolean;
    items: AdminReferralRow[];
    stats: AdminReferralStats;
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

export type AdminIbChangeRow = {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  currentBroker: string;
  currentAccountNumber?: string;
  requestedBroker: string;
  requestedAccountNumber?: string;
  notes?: string;
  status: string;
  adminNote?: string;
  createdAt?: string;
  time?: string;
};

export type AdminIbChangeStats = {
  total: number;
  new: number;
  inProgress: number;
  last24h: number;
};

export async function fetchAdminIbChangeRequests(
  page = 1,
  limit = 25,
  q?: string,
  status?: string
) {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (q?.trim()) qs.set("q", q.trim());
  if (status?.trim()) qs.set("status", status.trim());
  const res = await fetch(`${base}/ib-change?${qs}`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed");
  return data as {
    success: boolean;
    items: AdminIbChangeRow[];
    stats: AdminIbChangeStats;
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

export async function patchAdminIbChangeRequest(
  id: string,
  body: { status?: string; adminNote?: string }
) {
  const res = await fetch(`${base}/ib-change/${id}`, {
    method: "PATCH",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed");
  return data;
}
