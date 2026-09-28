import { API_CONFIG, getAuthHeaders, getAuthToken } from "../utils/apiConfig";

export type SupportTicket = {
  id: string;
  ticketId: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  adminReply?: string;
  repliedAt?: string | null;
  page?: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function submitFeedback(body: {
  email: string;
  message: string;
  subject?: string;
  category?: string;
  page?: string;
}): Promise<{ success: boolean; message?: string; ticketId?: string }> {
  const token = getAuthToken();
  const res = await fetch(`${API_CONFIG.BASE_URL}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message || "Failed to send feedback");
  }
  return data as { success: boolean; message?: string; ticketId?: string };
}

export async function fetchMyTickets(page = 1, limit = 20): Promise<{
  items: SupportTicket[];
  pagination: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}> {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  const res = await fetch(`${API_CONFIG.BASE_URL}/me/tickets?${qs}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load tickets");
  return data;
}
