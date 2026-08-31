import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

export type SignupBonusType = "deposit" | "no_deposit" | "welcome" | "cashback" | "other";

export type SignupBonus = {
  _id: string;
  title: string;
  brokerName: string;
  brokerId?: string;
  logoUrl?: string;
  bonusType: SignupBonusType;
  bonusLabel: string;
  description: string;
  terms?: string;
  ctaUrl?: string;
  featured?: boolean;
  published?: boolean;
  showNewBadge?: boolean;
  sortOrder?: number;
  expiresAt?: string | null;
};

export type PerformingStock = {
  _id: string;
  symbol: string;
  name: string;
  exchange?: string;
  sector?: string;
  price: number;
  changePercent: number;
  changeValue?: number;
  currency?: string;
  note?: string;
  logoUrl?: string;
  published?: boolean;
  showNewBadge?: boolean;
  sortOrder?: number;
  asOf?: string | null;
};

async function fetchJson(url: string, options?: RequestInit) {
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
}

export const fetchSignupBonuses = async (search = ""): Promise<SignupBonus[]> => {
  const qs = new URLSearchParams();
  if (search.trim()) qs.set("search", search.trim());
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/market/signup-bonuses?${qs}`);
  return data.items || [];
};

export const fetchPerformingStocks = async (search = ""): Promise<PerformingStock[]> => {
  const qs = new URLSearchParams();
  if (search.trim()) qs.set("search", search.trim());
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/market/performing-stocks?${qs}`);
  return data.items || [];
};

export const adminFetchSignupBonuses = async (): Promise<SignupBonus[]> => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/market/admin/signup-bonuses`, {
    headers: getAuthHeaders(),
  });
  return data.items || [];
};

export const adminCreateSignupBonus = async (payload: Partial<SignupBonus>) => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/market/admin/signup-bonuses`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return data.item as SignupBonus;
};

export const adminUpdateSignupBonus = async (id: string, payload: Partial<SignupBonus>) => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/market/admin/signup-bonuses/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return data.item as SignupBonus;
};

export const adminDeleteSignupBonus = async (id: string) => {
  await fetchJson(`${API_CONFIG.BASE_URL}/market/admin/signup-bonuses/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

export const adminFetchPerformingStocks = async (): Promise<PerformingStock[]> => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/market/admin/performing-stocks`, {
    headers: getAuthHeaders(),
  });
  return data.items || [];
};

export const adminCreatePerformingStock = async (payload: Partial<PerformingStock>) => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/market/admin/performing-stocks`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return data.item as PerformingStock;
};

export const adminUpdatePerformingStock = async (id: string, payload: Partial<PerformingStock>) => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/market/admin/performing-stocks/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return data.item as PerformingStock;
};

export const adminDeletePerformingStock = async (id: string) => {
  await fetchJson(`${API_CONFIG.BASE_URL}/market/admin/performing-stocks/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};
