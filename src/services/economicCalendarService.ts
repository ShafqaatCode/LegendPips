import { API_CONFIG, assertApiOk, parseJsonResponse } from "../utils/apiConfig";

export type EconImpact = "high" | "medium" | "low" | "holiday" | "none";

export type EconEvent = {
  id: string;
  title: string;
  country: string;
  currency: string;
  datetime: string;
  impact: EconImpact;
  actual: string;
  forecast: string;
  previous: string;
};

export type EconomicCalendarResponse = {
  success: boolean;
  source?: string;
  cached?: boolean;
  fetchedAt?: string;
  count?: number;
  highUpcoming?: EconEvent[];
  events: EconEvent[];
  message?: string;
};

export async function fetchEconomicCalendar(params?: {
  impact?: string[];
  currency?: string[];
  from?: string;
  to?: string;
  refresh?: boolean;
}): Promise<EconomicCalendarResponse> {
  const qs = new URLSearchParams();
  if (params?.impact?.length) qs.set("impact", params.impact.join(","));
  if (params?.currency?.length) qs.set("currency", params.currency.join(","));
  if (params?.from) qs.set("from", params.from);
  if (params?.to) qs.set("to", params.to);
  if (params?.refresh) qs.set("refresh", "1");

  const url = `${API_CONFIG.BASE_URL}/market/economic-calendar${qs.toString() ? `?${qs}` : ""}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const data = await parseJsonResponse<EconomicCalendarResponse>(res);
  if (!res.ok || data.success === false) {
    assertApiOk(res, data, data.message || "Economic calendar failed to load");
  }
  return data;
}
