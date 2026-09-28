import { API_CONFIG, assertApiOk, getAuthHeaders, parseJsonResponse } from "../utils/apiConfig";

export type PublicAnnouncement = {
  id: string;
  title: string;
  body: string;
  link: string;
  audience: string;
  recipientCount: number;
  createdAt: string;
  time: string;
};

export async function fetchPublicAnnouncements(page = 1, limit = 20) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const res = await fetch(`${API_CONFIG.BASE_URL}/announcements?${params}`);
  const data = await parseJsonResponse<{ success?: boolean; message?: string; items?: PublicAnnouncement[]; pagination?: { hasNextPage: boolean; currentPage: number } }>(res);
  assertApiOk(res, data, "Failed to load announcements");
  return data as {
    success: boolean;
    items: PublicAnnouncement[];
    pagination: {
      hasNextPage: boolean;
      currentPage: number;
    };
  };
}

export async function pushAdminAlert(input: {
  title: string;
  body: string;
  link?: string;
  audience?: "all" | "active";
  publishPublic?: boolean;
}) {
  const res = await fetch(`${API_CONFIG.BASE_URL}/announcements/admin/push`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await parseJsonResponse<{ success?: boolean; message?: string; recipientCount?: number }>(res);
  assertApiOk(res, data, "Failed to push alert");
  return data as { success: boolean; message: string; recipientCount: number };
}

export async function fetchAdminAnnouncements(page = 1, limit = 30) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const res = await fetch(`${API_CONFIG.BASE_URL}/announcements/admin?${params}`, {
    headers: getAuthHeaders(),
  });
  const data = await parseJsonResponse<{ success?: boolean; message?: string; items?: PublicAnnouncement[]; pagination?: { hasNextPage: boolean; currentPage: number } }>(res);
  assertApiOk(res, data, "Failed to load history");
  return data as {
    success: boolean;
    items: PublicAnnouncement[];
    pagination: { hasNextPage: boolean; currentPage: number };
  };
}
