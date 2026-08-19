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

export type RebatePayoutMethod = "paypal" | "skrill" | "wise" | "usdt_trc20" | "usdt_bep20" | "bank";
export type RebateWithdrawalStatus = "pending" | "approved" | "rejected" | "paid";

export const REBATE_PAYOUT_LABELS: Record<RebatePayoutMethod, string> = {
  paypal: "PayPal",
  skrill: "Skrill",
  wise: "Wise",
  usdt_trc20: "USDT TRC20",
  usdt_bep20: "USDT BEP20",
  bank: "Bank transfer",
};

export type RebateSummary = {
  lifetimeCents: number;
  thisMonthCents: number;
  availableCents: number;
  pendingWithdrawalsCents: number;
  approvedWithdrawalsCents: number;
  paidWithdrawalsCents: number;
  minWithdrawCents: number;
  byBroker: { name: string; totalCents: number }[];
  byCategory: { category: string; totalCents: number }[];
};

export type RebateWithdrawalRow = {
  id: string;
  userId?: string;
  amountCents: number;
  method: RebatePayoutMethod;
  payoutDetails: string;
  status: RebateWithdrawalStatus;
  adminNote?: string;
  createdAt?: string;
  processedAt?: string;
  userLabel?: string;
  userEmail?: string;
};

export async function fetchMyRebateSummary() {
  const res = await fetch(`${API_CONFIG.BASE_URL}/rebates/me/summary`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load rebate summary");
  return data.summary as RebateSummary;
}

export async function fetchMyWithdrawals(page = 1, limit = 20) {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  const res = await fetch(`${API_CONFIG.BASE_URL}/rebates/me/withdrawals?${qs}`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load withdrawals");
  return data as Paginated<RebateWithdrawalRow>;
}

export async function requestRebateWithdrawal(body: {
  amountUsd: number;
  method: RebatePayoutMethod;
  payoutDetails: string;
}) {
  const res = await fetch(`${API_CONFIG.BASE_URL}/rebates/withdraw`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Withdrawal request failed");
  return data as { success: boolean; withdrawal: RebateWithdrawalRow };
}

export async function fetchAdminWithdrawals(page = 1, limit = 30, status?: RebateWithdrawalStatus | "") {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) qs.set("status", status);
  const res = await fetch(`${API_CONFIG.BASE_URL}/rebates/admin/withdrawals?${qs}`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load withdrawals");
  return data as Paginated<RebateWithdrawalRow>;
}

export async function patchAdminWithdrawal(
  id: string,
  status: "approved" | "rejected" | "paid",
  adminNote?: string
) {
  const res = await fetch(`${API_CONFIG.BASE_URL}/rebates/admin/withdrawals/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, adminNote }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Update failed");
  return data as { success: boolean; withdrawal: RebateWithdrawalRow };
}
