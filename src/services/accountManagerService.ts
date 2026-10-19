import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

export type AccountManager = {
  id: string;
  name: string;
  email?: string;
  telegram?: string;
  whatsapp?: string;
  avatarUrl?: string;
  online?: boolean;
  active?: boolean;
  sortOrder?: number;
  notes?: string;
};

export type RecommendedBroker = {
  id: string;
  name: string;
  logoUrl?: string;
  cashbackRate?: string;
  topCashback?: boolean;
  verified?: boolean;
  rebateCategory?: string;
  description?: string;
  minDeposit?: number;
  spreadFrom?: string;
  setupUrl?: string;
};

export type AccountCare = {
  assignedManagerId: string | null;
  recommendedBrokerId: string | null;
  manager: AccountManager | null;
  recommendedBroker: RecommendedBroker | null;
};

const fetchJson = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: { ...getAuthHeaders(), ...(options?.headers || {}) },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data as T;
};

export const fetchMyAccountCare = async (): Promise<AccountCare> => {
  const data = await fetchJson<AccountCare & { success: boolean }>(
    `${API_CONFIG.BASE_URL}/me/account-care`
  );
  return {
    assignedManagerId: data.assignedManagerId ?? null,
    recommendedBrokerId: data.recommendedBrokerId ?? null,
    manager: data.manager ?? null,
    recommendedBroker: data.recommendedBroker ?? null,
  };
};

export const adminListAccountManagers = async (activeOnly = false) => {
  const q = activeOnly ? "?active=1" : "";
  const data = await fetchJson<{ items: AccountManager[] }>(
    `${API_CONFIG.BASE_URL}/admin/account-managers${q}`
  );
  return data.items || [];
};

export const adminCreateAccountManager = async (
  payload: Partial<AccountManager> & { name: string }
) => {
  const data = await fetchJson<{ item: AccountManager }>(
    `${API_CONFIG.BASE_URL}/admin/account-managers`,
    { method: "POST", body: JSON.stringify(payload) }
  );
  return data.item;
};

export const adminUpdateAccountManager = async (
  id: string,
  payload: Partial<AccountManager>
) => {
  const data = await fetchJson<{ item: AccountManager }>(
    `${API_CONFIG.BASE_URL}/admin/account-managers/${id}`,
    { method: "PUT", body: JSON.stringify(payload) }
  );
  return data.item;
};

export const adminDeleteAccountManager = async (id: string) => {
  await fetchJson(`${API_CONFIG.BASE_URL}/admin/account-managers/${id}`, {
    method: "DELETE",
  });
};

export const adminAssignUserCare = async (
  userId: string,
  payload: {
    assignedManagerId?: string | null;
    recommendedBrokerId?: string | null;
    premiumSignalsAccess?: boolean;
  }
) => {
  return fetchJson<{ success: boolean; user: unknown; message?: string }>(
    `${API_CONFIG.BASE_URL}/admin/users/${userId}/care`,
    { method: "PATCH", body: JSON.stringify(payload) }
  );
};
