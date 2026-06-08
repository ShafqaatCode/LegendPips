import type { AccountType, Broker, Review } from "../components/AccountSetup2/BrokerListingPage";
import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

export interface RebateCashbackRow {
  accountType: string;
  instrument: string;
  perLot: string;
}

export interface RebateInfoItem {
  label: string;
  value: string;
}

export interface RebateInfoSection {
  title: string;
  items: RebateInfoItem[];
}

export interface RebateContentSection {
  title: string;
  paragraphs: string[];
}

export interface PropCashbackOffer {
  label: string;
  firstPurchaseCashback?: string;
  repeatPurchaseCashback?: string;
  discountPercent?: string;
}

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
  rebateRows?: RebateCashbackRow[];
  rebateInfoSections?: RebateInfoSection[];
  rebateContentSections?: RebateContentSection[];
  rebateNotes?: string;
  rebateScheduleUrl?: string;
  setupUrl?: string;
  rebateCategory?: "forex" | "crypto" | "prop" | "both";
  propOffers?: PropCashbackOffer[];
}

export type RebateTabCategory = "forex" | "crypto" | "prop";

export interface BrokersPagination {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BrokersPageResult {
  items: ApiBroker[];
  pagination: BrokersPagination;
}

const BROKERS_PAGE_SIZE = 10;

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
  const result = await fetchBrokersPage({ search, page: 1, limit: 50 });
  return result.items;
};

/** Paginated brokers from backend (`page` + `limit` required for list pages). */
export const fetchBrokersPage = async (opts: {
  rebatesPage?: boolean;
  category?: RebateTabCategory;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<BrokersPageResult> => {
  const qs = new URLSearchParams();
  if (opts.rebatesPage) qs.set("rebatesPage", "1");
  if (opts.category) qs.set("category", opts.category);
  if (opts.search?.trim()) qs.set("search", opts.search.trim());
  qs.set("page", String(opts.page ?? 1));
  qs.set("limit", String(opts.limit ?? BROKERS_PAGE_SIZE));
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/brokers?${qs.toString()}`);
  const items = data.items || [];
  const limit = opts.limit ?? BROKERS_PAGE_SIZE;
  const page = opts.page ?? 1;

  let pagination = data.pagination;
  if (!pagination) {
    // Legacy API (no server pagination): show one page; deploy updated backend for real paging.
    const totalItems = items.length;
    pagination = {
      totalItems,
      itemsPerPage: limit,
      totalPages: Math.max(1, Math.ceil(totalItems / limit)),
      currentPage: page,
      hasNextPage: false,
      hasPreviousPage: page > 1,
    };
  }

  return { items, pagination };
};

/** Brokers for /rebates list (paginated) or home strip preview (`limit` only, no page). */
export const fetchRebatesPageBrokers = async (opts?: {
  limit?: number;
  search?: string;
  category?: RebateTabCategory;
  page?: number;
}): Promise<ApiBroker[] | BrokersPageResult> => {
  if (opts?.page !== undefined) {
    return fetchBrokersPage({
      rebatesPage: true,
      category: opts.category,
      search: opts.search,
      page: opts.page,
      limit: opts.limit ?? BROKERS_PAGE_SIZE,
    });
  }
  const qs = new URLSearchParams();
  qs.set("rebatesPage", "1");
  if (opts?.limit !== undefined) qs.set("limit", String(opts.limit));
  if (opts?.search?.trim()) qs.set("search", opts.search.trim());
  if (opts?.category) qs.set("category", opts.category);
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
