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
  screenshot?: File | null;
}): Promise<{ success: boolean; message?: string; ticketId?: string }> {
  const token = getAuthToken();
  const hasFile = !!body.screenshot;

  let res: Response;
  if (hasFile) {
    const fd = new FormData();
    fd.append("email", body.email);
    fd.append("message", body.message);
    if (body.subject) fd.append("subject", body.subject);
    if (body.category) fd.append("category", body.category);
    if (body.page) fd.append("page", body.page);
    fd.append("screenshot", body.screenshot as File);
    res = await fetch(`${API_CONFIG.BASE_URL}/feedback`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: fd,
    });
  } else {
    res = await fetch(`${API_CONFIG.BASE_URL}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        email: body.email,
        message: body.message,
        subject: body.subject,
        category: body.category,
        page: body.page,
      }),
    });
  }

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
