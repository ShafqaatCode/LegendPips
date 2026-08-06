import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

export type IbChangeRequestRow = {
  id: string;
  userEmail?: string;
  userName?: string;
  currentBroker: string;
  currentAccountNumber?: string;
  requestedBroker: string;
  requestedAccountNumber?: string;
  notes?: string;
  status: "new" | "in_progress" | "completed" | "rejected" | string;
  adminNote?: string;
  createdAt?: string;
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

export async function submitIbChangeRequest(payload: {
  currentBroker: string;
  currentAccountNumber?: string;
  requestedBroker: string;
  requestedAccountNumber?: string;
  notes?: string;
}): Promise<{ message: string; item: IbChangeRequestRow }> {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/me/ib-change`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return {
    message: data.message || "Request submitted",
    item: data.item,
  };
}

export async function fetchMyIbChangeRequests(): Promise<IbChangeRequestRow[]> {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/me/ib-change`);
  return data.items || [];
}
