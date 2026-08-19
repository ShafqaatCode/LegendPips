import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

export type TraderMarket = "forex" | "crypto" | "indices" | "commodities";
export type TraderVerificationStatus = "draft" | "pending" | "verified" | "rejected";
export type CopyRequestStatus = "pending" | "accepted" | "declined" | "cancelled" | "paused";

export type TraderUser = {
  id?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  kycStatus?: string;
};

export type TraderProfile = {
  id: string;
  userId?: string;
  displayName: string;
  bio?: string;
  markets: TraderMarket[];
  strategy?: string;
  roiPercent?: number;
  winRatePercent?: number;
  maxDrawdownPercent?: number;
  monthsActive?: number;
  proofUrl?: string;
  verificationStatus: TraderVerificationStatus;
  adminNote?: string;
  copyEnabled: boolean;
  copyFeePercent?: number;
  minCopyUsd?: number;
  maxCopiers?: number;
  copyTerms?: string;
  createdAt?: string;
  followerCount?: number;
  copying?: boolean;
  user?: TraderUser;
  userEmail?: string;
};

export type CopyRequestRow = {
  id: string;
  followerId?: string;
  traderUserId?: string;
  traderProfileId?: string;
  amountUsd: number;
  note?: string;
  status: CopyRequestStatus;
  createdAt?: string;
  follower?: TraderUser;
  trader?: TraderUser;
  profile?: { id: string; displayName: string };
  followerEmail?: string;
  traderEmail?: string;
};

type Paginated<T> = {
  success: boolean;
  items: T[];
  pagination?: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

const json = async (res: Response) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Request failed");
  return data;
};

export async function fetchPublicTraders(opts?: { search?: string; copyOnly?: boolean; page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (opts?.search) qs.set("search", opts.search);
  if (opts?.copyOnly) qs.set("copy", "1");
  qs.set("page", String(opts?.page ?? 1));
  qs.set("limit", String(opts?.limit ?? 12));
  const res = await fetch(`${API_CONFIG.BASE_URL}/traders?${qs}`, { headers: getAuthHeaders() });
  return json(res) as Promise<Paginated<TraderProfile>>;
}

export async function fetchPublicTrader(id: string) {
  const res = await fetch(`${API_CONFIG.BASE_URL}/traders/${id}`, { headers: getAuthHeaders() });
  const data = await json(res);
  return data.trader as TraderProfile;
}

export async function fetchMyTraderProfile() {
  const res = await fetch(`${API_CONFIG.BASE_URL}/traders/me`, { headers: getAuthHeaders() });
  const data = await json(res);
  return (data.trader || null) as TraderProfile | null;
}

export async function saveMyTraderProfile(body: Partial<TraderProfile> & { displayName?: string }) {
  const res = await fetch(`${API_CONFIG.BASE_URL}/traders/me`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const data = await json(res);
  return data.trader as TraderProfile;
}

export async function submitMyTraderProfile() {
  const res = await fetch(`${API_CONFIG.BASE_URL}/traders/me/submit`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  const data = await json(res);
  return data.trader as TraderProfile;
}

export async function requestCopyTrader(id: string, body: { amountUsd: number; note?: string }) {
  const res = await fetch(`${API_CONFIG.BASE_URL}/traders/${id}/copy`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  return json(res) as Promise<{ success: boolean; copy: CopyRequestRow; message?: string }>;
}

export async function fetchMyCopying() {
  const res = await fetch(`${API_CONFIG.BASE_URL}/traders/me/copying`, { headers: getAuthHeaders() });
  const data = await json(res);
  return (data.items || []) as CopyRequestRow[];
}

export async function fetchMyFollowers() {
  const res = await fetch(`${API_CONFIG.BASE_URL}/traders/me/followers`, { headers: getAuthHeaders() });
  const data = await json(res);
  return (data.items || []) as CopyRequestRow[];
}

export async function patchCopyRequest(id: string, status: CopyRequestStatus) {
  const res = await fetch(`${API_CONFIG.BASE_URL}/traders/copy-requests/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  const data = await json(res);
  return data.copy as CopyRequestRow;
}

export async function adminFetchTraders(page = 1, status?: string) {
  const qs = new URLSearchParams({ page: String(page), limit: "40" });
  if (status) qs.set("status", status);
  const res = await fetch(`${API_CONFIG.BASE_URL}/traders/admin?${qs}`, { headers: getAuthHeaders() });
  return json(res) as Promise<Paginated<TraderProfile>>;
}

export async function adminModerateTrader(id: string, status: TraderVerificationStatus, adminNote?: string) {
  const res = await fetch(`${API_CONFIG.BASE_URL}/traders/admin/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, adminNote }),
  });
  return json(res);
}

export async function adminFetchCopyRequests(page = 1, status?: string) {
  const qs = new URLSearchParams({ page: String(page), limit: "40" });
  if (status) qs.set("status", status);
  const res = await fetch(`${API_CONFIG.BASE_URL}/traders/admin/copy-requests?${qs}`, { headers: getAuthHeaders() });
  return json(res) as Promise<Paginated<CopyRequestRow>>;
}
