import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

export type ApiSignal = {
  id: string;
  pair: string;
  direction: "buy" | "sell";
  entry: string;
  tp: string;
  sl: string;
  status: "active" | "closed" | "pending";
  premium: boolean;
  assetClass?: string;
  notes?: string;
  createdAt?: string;
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

export async function fetchPublicSignals(params?: {
  page?: number;
  limit?: number;
  assetClass?: string;
  tradeStatus?: string;
}): Promise<Paginated<ApiSignal>> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.assetClass) qs.set("assetClass", params.assetClass);
  if (params?.tradeStatus) qs.set("tradeStatus", params.tradeStatus);
  const res = await fetch(`${API_CONFIG.BASE_URL}/signals?${qs.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load signals");
  return data;
}

export async function fetchPublicSignalById(id: string): Promise<ApiSignal> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/signals/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Signal not found");
  return data.signal;
}

export async function trackSignalView(id: string): Promise<void> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/signals/${id}/track-view`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Failed to record view");
}

export async function fetchAdminSignals(page = 1, limit = 50): Promise<Paginated<ApiSignal>> {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  const res = await fetch(`${API_CONFIG.BASE_URL}/signals/admin?${qs}`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load signals");
  return data;
}

export async function createAdminSignal(body: {
  pair: string;
  type: "buy" | "sell";
  entry: string;
  tp: string;
  sl: string;
  status: "active" | "closed" | "pending";
  premium: boolean;
  assetClass?: string;
}): Promise<ApiSignal> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/signals/admin`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      pair: body.pair,
      type: body.type,
      entry: body.entry,
      tp: body.tp,
      sl: body.sl,
      status: body.status,
      isPremium: body.premium,
      assetClass: body.assetClass || "forex",
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create");
  return data.signal;
}

export async function updateAdminSignal(
  id: string,
  body: {
    pair: string;
    type: "buy" | "sell";
    entry: string;
    tp: string;
    sl: string;
    status: "active" | "closed" | "pending";
    premium: boolean;
    assetClass?: string;
  }
): Promise<ApiSignal> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/signals/admin/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      pair: body.pair,
      type: body.type,
      entry: body.entry,
      tp: body.tp,
      sl: body.sl,
      status: body.status,
      isPremium: body.premium,
      assetClass: body.assetClass || "forex",
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update");
  return data.signal;
}

export async function deleteAdminSignal(id: string): Promise<void> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/signals/admin/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Failed to delete");
}

export function toSignalListRow(s: ApiSignal): {
  id?: string;
  pair: string;
  entry: string;
  tp: string;
  sl: string;
  status: "buy" | "sell";
} {
  return {
    id: s.id,
    pair: s.pair,
    entry: s.entry,
    tp: s.tp,
    sl: s.sl,
    status: s.direction,
  };
}
