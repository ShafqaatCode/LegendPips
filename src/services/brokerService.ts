import type { AccountType, Broker, Review } from "../components/AccountSetup2/BrokerListingPage";
import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

export interface ApiBroker {
  _id: string;
  name: string;
  logoUrl?: string;
  minDeposit: number;
  regulation: string;
  spreadFrom: string;
  crypto: string;
  topCashback: boolean;
  verified: boolean;
  description: string;
  features: string[];
  accountTypes: AccountType[];
  reviews: Review[];
  fundingMethods: string[];
  cashbackRate?: string;
  published?: boolean;
  sortOrder?: number;
  /** Public /rebates list: brokers with rebatesListOrder >= 1 */
  rebatesListOrder?: number;
  rebatesStarRating?: number;
  rebatesReviewsLabel?: string;
  rebatesFeatured?: boolean;
}

export const mapApiBrokerToBroker = (b: ApiBroker, defaultLogo: string): Broker => ({
  id: b._id,
  name: b.name,
  logo: b.logoUrl || defaultLogo,
  minDeposit: b.minDeposit,
  regulation: b.regulation,
  spreadFrom: b.spreadFrom,
  crypto: b.crypto,
  topCashback: b.topCashback,
  verified: b.verified,
  description: b.description,
  features: b.features || [],
  accountTypes: b.accountTypes || [],
  reviews: b.reviews || [],
  fundingMethods: b.fundingMethods || [],
  cashbackRate: b.cashbackRate,
});

const fetchJson = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const fetchPublicBrokers = async (search?: string): Promise<ApiBroker[]> => {
  const qs = new URLSearchParams();
  if (search?.trim()) qs.set("search", search.trim());
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/brokers?${qs.toString()}`);
  return data.items || [];
};

/** Brokers for /rebates and home broker strip (same CMS list, optional limit & search). */
export const fetchRebatesPageBrokers = async (opts?: { limit?: number; search?: string }): Promise<ApiBroker[]> => {
  const qs = new URLSearchParams();
  qs.set("rebatesPage", "1");
  if (opts?.limit !== undefined) qs.set("limit", String(opts.limit));
  if (opts?.search?.trim()) qs.set("search", opts.search.trim());
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/brokers?${qs.toString()}`);
  return data.items || [];
};

export const fetchPublicBrokerById = async (id: string): Promise<ApiBroker> => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/brokers/${id}`);
  return data.broker;
};

export const adminFetchBrokers = async (): Promise<ApiBroker[]> => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/brokers/admin`, { headers: getAuthHeaders() });
  return data.items || [];
};

export const adminCreateBroker = async (payload: Record<string, unknown>): Promise<ApiBroker> => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/brokers/admin`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return data.broker;
};

export const adminUpdateBroker = async (id: string, payload: Partial<ApiBroker>): Promise<ApiBroker> => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/brokers/admin/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return data.broker;
};

export const adminDeleteBroker = async (id: string): Promise<void> => {
  await fetchJson(`${API_CONFIG.BASE_URL}/brokers/admin/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

export const adminGetBroker = async (id: string): Promise<ApiBroker> => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/brokers/admin/${id}`, { headers: getAuthHeaders() });
  return data.broker;
};
