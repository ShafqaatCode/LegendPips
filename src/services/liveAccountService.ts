import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

export type LiveAccountStatus = "pending" | "in_progress" | "approved" | "rejected" | string;

export type LiveAccountRequestRow = {
  id: string;
  userEmail?: string;
  userName?: string;
  brokerId?: string;
  brokerName: string;
  accountNumber: string;
  termsAccepted?: boolean;
  status: LiveAccountStatus;
  adminNote?: string;
  createdAt?: string;
  updatedAt?: string;
  reviewedAt?: string;
  time?: string;
};

const fetchJson = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(options?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Request failed");
  return data;
};

export async function submitLiveAccountRequest(payload: {
  brokerId?: string;
  brokerName: string;
  accountNumber: string;
  termsAccepted: boolean;
}): Promise<{ message: string; item: LiveAccountRequestRow }> {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/me/live-accounts`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return {
    message: data.message || "Request submitted",
    item: data.item,
  };
}

export async function fetchMyLiveAccountRequests(): Promise<LiveAccountRequestRow[]> {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/me/live-accounts`);
  return data.items || [];
}

export function liveAccountStatusLabel(status: string): string {
  switch (status) {
    case "pending":
      return "Pending review";
    case "in_progress":
      return "Under review";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    default:
      return status;
  }
}
