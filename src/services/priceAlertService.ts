import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

export type PriceAlertRow = {
  id: string;
  symbolId: string;
  label: string;
  tvSymbol: string;
  targetPrice: number;
  condition: "above" | "below";
  active: boolean;
  triggeredAt?: string;
  lastPrice?: number;
  createdAt: string;
  updatedAt: string;
};

export async function fetchMyPriceAlerts(): Promise<PriceAlertRow[]> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/me/price-alerts`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load price alerts");
  return data.items as PriceAlertRow[];
}

export async function createPriceAlert(input: {
  symbolId: string;
  targetPrice: number;
  condition: "above" | "below";
}): Promise<PriceAlertRow> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/me/price-alerts`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create price alert");
  return data.item as PriceAlertRow;
}

export async function deletePriceAlert(id: string): Promise<void> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/me/price-alerts/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete price alert");
}

export async function togglePriceAlert(id: string, active: boolean): Promise<PriceAlertRow> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/me/price-alerts/${id}`, {
    method: "PATCH",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ active }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update price alert");
  return data.item as PriceAlertRow;
}
