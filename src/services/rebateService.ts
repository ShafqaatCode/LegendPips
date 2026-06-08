import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

export type RebateCreditRow = {
  id: string;
  userId?: string;
  amountCents: number;
  brokerName?: string;
  notes?: string;
  rebateCategory?: "forex" | "crypto" | "prop";
  purchaseType?: "first" | "repeat";
  createdAt?: string;
  userLabel?: string;
  userEmail?: string;
};

type Paginated<T> = {
  success: boolean;
  items: T[];
  pagination: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export async function fetchMyRebateCredits(page = 1, limit = 20) {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  const res = await fetch(`${API_CONFIG.BASE_URL}/rebates/me?${qs}`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load rebates");
  return data as Paginated<RebateCreditRow> & { success: boolean; totalCents: number };
}

export async function fetchAdminRebateCredits(page = 1, limit = 30, userId?: string, userEmail?: string) {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (userId) qs.set("userId", userId);
  if (userEmail) qs.set("userEmail", userEmail);
  const res = await fetch(`${API_CONFIG.BASE_URL}/rebates/admin?${qs}`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load");
  return data as Paginated<RebateCreditRow>;
}

export async function grantRebateAdmin(body: {
  userId?: string;
  userEmail?: string;
  amountUsd?: number;
  amountCents?: number;
  brokerName?: string;
  notes?: string;
  rebateCategory?: "forex" | "crypto" | "prop";
  purchaseType?: "first" | "repeat";
}) {
  const res = await fetch(`${API_CONFIG.BASE_URL}/rebates/admin/grant`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to grant rebate");
  return data as { success: boolean; credit: RebateCreditRow };
}

export const formatUsd = (amountCents: number) =>
  `$${(amountCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
