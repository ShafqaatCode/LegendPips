import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

export const COMPLAINT_CATEGORIES = [
  { id: "withdrawal", label: "Withdrawal delay or refusal" },
  { id: "deposit", label: "Deposit / funding issue" },
  { id: "spreads", label: "Spreads, slippage, or execution" },
  { id: "support", label: "Poor or no support" },
  { id: "account", label: "Account blocked or terms change" },
  { id: "scam", label: "Suspected scam or fraud" },
  { id: "other", label: "Other" },
] as const;

export type ComplaintStatus = "pending" | "investigating" | "resolved" | "dismissed";

export type BrokerComplaint = {
  id: string;
  ticketId: string;
  brokerId: string | null;
  brokerName: string;
  category: string;
  subject: string;
  details: string;
  accountRef?: string;
  status: ComplaintStatus;
  adminNote?: string;
  resolution?: string;
  authorName?: string;
  authorEmail?: string;
  publicWarning?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type BlacklistBroker = {
  id: string;
  name: string;
  logoUrl?: string;
  reason: string;
  since?: string | null;
  source: "catalog";
};

export type BlacklistWarning = {
  name: string;
  category: string;
  since?: string;
  source: "warning";
};

const fetchJson = async (url: string, options?: RequestInit) => {
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
};

export const fetchComplaintBlacklist = async (): Promise<{
  brokers: BlacklistBroker[];
  warnings: BlacklistWarning[];
}> => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/complaints/blacklist`);
  return { brokers: data.brokers || [], warnings: data.warnings || [] };
};

export const submitBrokerComplaint = async (payload: {
  brokerId?: string;
  brokerName?: string;
  category: string;
  subject: string;
  details: string;
  accountRef?: string;
}): Promise<{ complaint: BrokerComplaint; message: string }> => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/complaints`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return { complaint: data.complaint, message: data.message || "Complaint submitted." };
};

export const fetchMyComplaints = async (): Promise<BrokerComplaint[]> => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/complaints/me`, {
    headers: getAuthHeaders(),
  });
  return data.items || [];
};

export const adminFetchComplaints = async (opts?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const qs = new URLSearchParams();
  if (opts?.status) qs.set("status", opts.status);
  if (opts?.search?.trim()) qs.set("search", opts.search.trim());
  qs.set("page", String(opts?.page || 1));
  qs.set("limit", String(opts?.limit || 15));
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/complaints/admin?${qs.toString()}`, {
    headers: getAuthHeaders(),
  });
  return {
    items: (data.items || []) as BrokerComplaint[],
    pendingCount: data.pendingCount || 0,
    pagination: data.pagination,
  };
};

export const adminUpdateComplaint = async (
  id: string,
  patch: { status?: ComplaintStatus; adminNote?: string; resolution?: string; publicWarning?: boolean }
) => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/complaints/admin/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(patch),
  });
  return data.complaint as BrokerComplaint;
};

export const adminBlacklistFromComplaint = async (
  id: string,
  opts: { blacklisted: boolean; reason?: string }
) => {
  return fetchJson(`${API_CONFIG.BASE_URL}/complaints/admin/${id}/blacklist`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(opts),
  });
};

export const adminDeleteComplaint = async (id: string) => {
  await fetchJson(`${API_CONFIG.BASE_URL}/complaints/admin/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};
