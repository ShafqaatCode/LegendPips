import { API_CONFIG, assertApiOk, getAuthHeaders, parseJsonResponse } from "../utils/apiConfig";

export type CornerPromoSide = "left" | "right";

export type CornerPromo = {
  id: string;
  side: CornerPromoSide;
  name: string;
  logoUrl?: string;
  headline?: string;
  body: string;
  discountCode?: string;
  discountPercent?: string;
  ctaLabel: string;
  ctaUrl: string;
  active: boolean;
  sortOrder: number;
  startsAt?: string | null;
  endsAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CornerPromoInput = {
  side: CornerPromoSide;
  name: string;
  logoUrl?: string;
  headline?: string;
  body: string;
  discountCode?: string;
  discountPercent?: string;
  ctaLabel?: string;
  ctaUrl: string;
  active?: boolean;
  sortOrder?: number;
  startsAt?: string | null;
  endsAt?: string | null;
};

const fetchJson = async (url: string, options?: RequestInit): Promise<any> => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(options?.headers || {}),
    },
  });
  const data = await parseJsonResponse<{ message?: string }>(res);
  assertApiOk(res, data, `Corner promos API failed (HTTP ${res.status})`);
  return data;
};

export async function fetchActiveCornerPromos(): Promise<{
  left: CornerPromo[];
  right: CornerPromo[];
}> {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/corner-promos/active`);
  return {
    left: data.left || [],
    right: data.right || [],
  };
}

export async function fetchAdminCornerPromos(side?: CornerPromoSide): Promise<CornerPromo[]> {
  const qs = side ? `?side=${side}` : "";
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/corner-promos/admin/list${qs}`);
  return data.items || [];
}

export async function createCornerPromo(body: CornerPromoInput): Promise<CornerPromo> {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/corner-promos/admin`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return data.item;
}

export async function updateCornerPromo(
  id: string,
  body: Partial<CornerPromoInput>
): Promise<CornerPromo> {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/corner-promos/admin/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return data.item;
}

export async function deleteCornerPromo(id: string): Promise<void> {
  await fetchJson(`${API_CONFIG.BASE_URL}/corner-promos/admin/${id}`, { method: "DELETE" });
}
