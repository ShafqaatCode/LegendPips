import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

export type BrokerReviewStatus = "pending" | "approved" | "rejected";

export type ReviewStats = {
  average: number;
  count: number;
  breakdown: Record<1 | 2 | 3 | 4 | 5, number>;
};

export type PublicBrokerReview = {
  id: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  reviewKind?: "general" | "payout";
  payoutSpeedDays?: number;
  payoutReceived?: boolean;
  kycVerified: boolean;
  createdAt?: string;
  source: "member" | "editorial";
  brokerId?: string;
  brokerName?: string;
  brokerLogoUrl?: string;
};

export type MyBrokerReview = {
  id: string;
  brokerId: string;
  brokerName?: string;
  brokerLogoUrl?: string;
  rating: number;
  title: string;
  comment: string;
  reviewKind?: "general" | "payout";
  payoutSpeedDays?: number;
  payoutReceived?: boolean;
  status: BrokerReviewStatus;
  adminNote?: string;
  kycVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type BrokerReviewsPage = {
  items: PublicBrokerReview[];
  editorial: PublicBrokerReview[];
  stats: ReviewStats;
  myReview: MyBrokerReview | null;
  pagination: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

const fetchJson = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Request failed");
  return data;
};

export const fetchBrokerReviews = async (
  brokerId: string,
  opts?: { page?: number; limit?: number; kind?: "general" | "payout" }
): Promise<BrokerReviewsPage> => {
  const qs = new URLSearchParams();
  qs.set("page", String(opts?.page || 1));
  qs.set("limit", String(opts?.limit || 8));
  if (opts?.kind) qs.set("kind", opts.kind);
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/brokers/${brokerId}/reviews?${qs.toString()}`, {
    headers: getAuthHeaders(),
  });
  return {
    items: data.items || [],
    editorial: data.editorial || [],
    stats: data.stats || { average: 0, count: 0, breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
    myReview: data.myReview || null,
    pagination: data.pagination || {
      totalItems: 0,
      itemsPerPage: 8,
      totalPages: 1,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
};

export const fetchRecentPayoutReviews = async (limit = 8): Promise<PublicBrokerReview[]> => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/brokers/reviews/payout-recent?limit=${limit}`);
  return data.items || [];
};

export const submitBrokerReview = async (
  brokerId: string,
  payload: {
    rating: number;
    title?: string;
    comment: string;
    reviewKind?: "general" | "payout";
    payoutSpeedDays?: number;
    payoutReceived?: boolean;
  }
): Promise<{ review: MyBrokerReview; message: string }> => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/brokers/${brokerId}/reviews`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return { review: data.review, message: data.message || "Review submitted." };
};

export const fetchMyBrokerReviews = async (): Promise<MyBrokerReview[]> => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/brokers/reviews/me`, {
    headers: getAuthHeaders(),
  });
  return data.items || [];
};

export const deleteMyBrokerReview = async (reviewId: string): Promise<void> => {
  await fetchJson(`${API_CONFIG.BASE_URL}/brokers/reviews/${reviewId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

export type AdminBrokerReviewRow = MyBrokerReview & {
  userId: string;
  authorName: string;
  flagged?: boolean;
  flagReason?: string;
};

export const adminFetchBrokerReviews = async (opts?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  items: AdminBrokerReviewRow[];
  pendingCount: number;
  pagination: BrokerReviewsPage["pagination"];
}> => {
  const qs = new URLSearchParams();
  if (opts?.status) qs.set("status", opts.status);
  if (opts?.search?.trim()) qs.set("search", opts.search.trim());
  qs.set("page", String(opts?.page || 1));
  qs.set("limit", String(opts?.limit || 15));
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/brokers/admin/reviews?${qs.toString()}`, {
    headers: getAuthHeaders(),
  });
  return {
    items: data.items || [],
    pendingCount: data.pendingCount || 0,
    pagination: data.pagination,
  };
};

export const adminModerateBrokerReview = async (
  id: string,
  action: "approve" | "reject",
  adminNote?: string
): Promise<void> => {
  await fetchJson(`${API_CONFIG.BASE_URL}/brokers/admin/reviews/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ action, adminNote }),
  });
};

export const adminDeleteBrokerReview = async (id: string): Promise<void> => {
  await fetchJson(`${API_CONFIG.BASE_URL}/brokers/admin/reviews/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};
