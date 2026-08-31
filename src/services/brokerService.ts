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
  discountCode?: string;
  evaluationType?: "1-step" | "2-step" | "instant" | "funded";
  profitSplit?: string;
  accountSize?: string;
  challengeFee?: string;
  profitTarget?: string;
  dailyDrawdown?: string;
  maxDrawdown?: string;
  minTradingDays?: string;
  payoutCycle?: string;
  scalingPlan?: string;
  rulesUrl?: string;
}

export interface PropPromoCode {
  code: string;
  label?: string;
  percent?: string;
  expiresAt?: string;
  active?: boolean;
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
  reviewStats?: { average: number; count: number };
  blacklisted?: boolean;
  blacklistReason?: string;
  blacklistedAt?: string;
  forBeginners?: boolean;
  beginnerBlurb?: string;
  beginnerSortOrder?: number;
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
  propPromoCodes?: PropPromoCode[];
  country?: string;
  servedCountries?: string[];
  leverage?: string;
  platforms?: string;
  commission?: string;
  slug?: string;
  legendScore?: number;
  legendScoreParts?: {
    regulation?: number;
    tradingConditions?: number;
    withdrawals?: number;
    userExperience?: number;
    complaints?: number;
    support?: number;
  };
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
  reviewStats: b.reviewStats,
  fundingMethods: b.fundingMethods || [],
  cashbackRate: b.cashbackRate,
  country: b.country,
  leverage: b.leverage,
  platforms: b.platforms,
  commission: b.commission,
  legendScore: b.legendScore,
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
  country?: string;
  regulation?: string;
  platform?: string;
  maxMinDeposit?: number;
  minScore?: number;
  forBeginners?: boolean;
  scamShield?: boolean;
}): Promise<BrokersPageResult> => {
  const qs = new URLSearchParams();
  if (opts.rebatesPage) qs.set("rebatesPage", "1");
  if (opts.category) qs.set("category", opts.category);
  if (opts.search?.trim()) qs.set("search", opts.search.trim());
  if (opts.country?.trim()) qs.set("country", opts.country.trim());
  if (opts.regulation?.trim()) qs.set("regulation", opts.regulation.trim());
  if (opts.platform?.trim()) qs.set("platform", opts.platform.trim());
  if (typeof opts.maxMinDeposit === "number") qs.set("maxMinDeposit", String(opts.maxMinDeposit));
  if (typeof opts.minScore === "number") qs.set("minScore", String(opts.minScore));
  if (opts.forBeginners) qs.set("forBeginners", "1");
  if (opts.scamShield) qs.set("scamShield", "1");
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

/** Curated beginner-friendly brokers (excludes scam-shield list). */
export const fetchBeginnerBrokers = async (opts?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<BrokersPageResult> =>
  fetchBrokersPage({
    forBeginners: true,
    search: opts?.search,
    page: opts?.page ?? 1,
    limit: opts?.limit ?? 24,
  });

/** Brokers flagged on Scam Broker Shield. */
export const fetchScamShieldBrokers = async (opts?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<BrokersPageResult> =>
  fetchBrokersPage({
    scamShield: true,
    search: opts?.search,
    page: opts?.page ?? 1,
    limit: opts?.limit ?? 50,
  });

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

/** Side-by-side compare: 2–4 published brokers, order preserved. */
export const fetchCompareBrokers = async (ids: string[]): Promise<ApiBroker[]> => {
  const unique = [...new Set(ids.map((id) => String(id).trim()).filter(Boolean))].slice(0, 4);
  if (unique.length < 2) return [];
  const qs = new URLSearchParams({ ids: unique.join(",") });
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/brokers/compare?${qs.toString()}`);
  return data.items || [];
};

export const fetchCompareBrokersBySlugs = async (slugs: string[]): Promise<ApiBroker[]> => {
  const unique = [...new Set(slugs.map((s) => String(s).trim().toLowerCase()).filter(Boolean))].slice(0, 4);
  if (unique.length < 2) return [];
  const qs = new URLSearchParams({ slugs: unique.join(",") });
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/brokers/compare?${qs.toString()}`);
  return data.items || [];
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
