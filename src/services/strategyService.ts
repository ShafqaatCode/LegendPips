import { API_CONFIG, assertApiOk, getAuthHeaders, parseJsonResponse } from "../utils/apiConfig";

export type StrategyMarket = "forex" | "crypto" | "indices" | "commodities";
export type StrategyTimeframe = "scalp" | "intraday" | "swing" | "position";
export type StrategyRisk = "low" | "medium" | "high";
export type StrategyModerationStatus = "draft" | "pending" | "approved" | "rejected";

export type StrategyUser = {
  id?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
};

export type TradingStrategy = {
  id: string;
  userId?: string;
  title: string;
  summary?: string;
  content: string;
  entryRules?: string;
  exitRules?: string;
  riskRules?: string;
  markets: StrategyMarket[];
  timeframe: StrategyTimeframe;
  riskLevel: StrategyRisk;
  tags: string[];
  claimedWinRatePercent?: number;
  claimedRoiPercent?: number;
  published: boolean;
  moderationStatus: StrategyModerationStatus;
  adminNote?: string;
  reviewedAt?: string;
  likeCount: number;
  viewCount: number;
  createdAt?: string;
  updatedAt?: string;
  user?: StrategyUser;
  userEmail?: string;
  likedByMe?: boolean;
  isOwner?: boolean;
};

export type StrategyInput = {
  title: string;
  summary?: string;
  content: string;
  entryRules?: string;
  exitRules?: string;
  riskRules?: string;
  markets?: StrategyMarket[];
  timeframe?: StrategyTimeframe;
  riskLevel?: StrategyRisk;
  tags?: string[];
  claimedWinRatePercent?: number;
  claimedRoiPercent?: number;
  published?: boolean;
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

const json = async (res: Response): Promise<any> => {
  const data = await parseJsonResponse<{ message?: string }>(res);
  assertApiOk(res, data, `Strategies API failed (HTTP ${res.status})`);
  return data;
};

export async function fetchPublicStrategies(opts?: {
  search?: string;
  market?: string;
  timeframe?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  const qs = new URLSearchParams();
  if (opts?.search) qs.set("search", opts.search);
  if (opts?.market) qs.set("market", opts.market);
  if (opts?.timeframe) qs.set("timeframe", opts.timeframe);
  if (opts?.sort) qs.set("sort", opts.sort);
  qs.set("page", String(opts?.page ?? 1));
  qs.set("limit", String(opts?.limit ?? 12));
  const res = await fetch(`${API_CONFIG.BASE_URL}/strategies?${qs}`, { headers: getAuthHeaders() });
  return json(res) as Promise<Paginated<TradingStrategy>>;
}

export async function fetchPublicStrategy(id: string) {
  const res = await fetch(`${API_CONFIG.BASE_URL}/strategies/${id}`, { headers: getAuthHeaders() });
  const data = await json(res);
  return data.strategy as TradingStrategy;
}

export async function fetchMyStrategies() {
  const res = await fetch(`${API_CONFIG.BASE_URL}/strategies/me`, { headers: getAuthHeaders() });
  const data = await json(res);
  return (data.items || []) as TradingStrategy[];
}

export async function createStrategy(body: StrategyInput) {
  const res = await fetch(`${API_CONFIG.BASE_URL}/strategies/me`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const data = await json(res);
  return data.strategy as TradingStrategy;
}

export async function updateMyStrategy(id: string, body: Partial<StrategyInput>) {
  const res = await fetch(`${API_CONFIG.BASE_URL}/strategies/me/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const data = await json(res);
  return data.strategy as TradingStrategy;
}

export async function deleteMyStrategy(id: string) {
  const res = await fetch(`${API_CONFIG.BASE_URL}/strategies/me/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  await json(res);
}

export async function submitMyStrategy(id: string) {
  const res = await fetch(`${API_CONFIG.BASE_URL}/strategies/me/${id}/submit`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  const data = await json(res);
  return data.strategy as TradingStrategy;
}

export async function likeStrategy(id: string) {
  const res = await fetch(`${API_CONFIG.BASE_URL}/strategies/${id}/like`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  const data = await json(res);
  return data.strategy as TradingStrategy;
}

export async function adminFetchStrategies(page = 1, status?: string) {
  const qs = new URLSearchParams({ page: String(page), limit: "40" });
  if (status) qs.set("status", status);
  const res = await fetch(`${API_CONFIG.BASE_URL}/strategies/admin?${qs}`, { headers: getAuthHeaders() });
  return json(res) as Promise<Paginated<TradingStrategy>>;
}

export async function adminModerateStrategy(
  id: string,
  status: StrategyModerationStatus,
  adminNote?: string
) {
  const res = await fetch(`${API_CONFIG.BASE_URL}/strategies/admin/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, adminNote }),
  });
  return json(res);
}
