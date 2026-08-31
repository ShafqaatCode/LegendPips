import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

export type AffiliateDashboard = {
  enabled: boolean;
  referralCode: string;
  inviteLink: string;
  tier: string;
  tierConfig: {
    l1SignupCents: number;
    l2SignupCents: number;
    l1RebateSharePct: number;
    l2RebateSharePct: number;
    minDirectReferrals: number;
  };
  network: { l1: number; l2: number };
  earnings: {
    totalCents: number;
    totalUsd: number;
    signupCents: number;
    rebateShareCents: number;
    count: number;
  };
  recentEarnings: {
    id: string;
    level: number;
    type: string;
    amountCents: number;
    amountUsd: number;
    notes: string;
    createdAt: string;
  }[];
  allTiers: Array<{
    tier: string;
    l1SignupCents: number;
    l2SignupCents: number;
    l1RebateSharePct: number;
    l2RebateSharePct: number;
    minDirectReferrals: number;
  }>;
};

export async function fetchMyAffiliateDashboard(): Promise<AffiliateDashboard> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/me/affiliate`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load affiliate dashboard");
  return data;
}

export async function fetchMyAffiliateNetwork(page = 1, limit = 30) {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  const res = await fetch(`${API_CONFIG.BASE_URL}/me/affiliate/network?${qs}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load network");
  return data as {
    items: {
      id: string;
      name: string;
      email: string;
      joinedAt: string;
      tier: string;
      theirDirectReferrals: number;
      level: number;
    }[];
    pagination: { totalItems: number; totalPages: number; currentPage: number };
  };
}

export async function fetchAdminAffiliateOverview() {
  const res = await fetch(`${API_CONFIG.BASE_URL}/admin/engagement/affiliate/overview`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed");
  return data;
}

export async function fetchAdminAffiliateMembers(page = 1, limit = 30, q?: string) {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (q) qs.set("q", q);
  const res = await fetch(`${API_CONFIG.BASE_URL}/admin/engagement/affiliate/members?${qs}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed");
  return data;
}

export async function fetchAdminAffiliateSettings() {
  const res = await fetch(`${API_CONFIG.BASE_URL}/admin/engagement/affiliate/settings`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed");
  return data as { success: boolean; enabled: boolean; tiers: Record<string, any> };
}

export async function saveAdminAffiliateSettings(body: { enabled?: boolean; tiers?: Record<string, any> }) {
  const res = await fetch(`${API_CONFIG.BASE_URL}/admin/engagement/affiliate/settings`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to save");
  return data;
}

export async function patchAdminAffiliateTier(userId: string, tier: string) {
  const res = await fetch(`${API_CONFIG.BASE_URL}/admin/engagement/affiliate/members/${userId}/tier`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ tier }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed");
  return data;
}
