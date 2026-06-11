import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";
import type { ClientReview } from "./siteConfigService";

const authJson = async (url: string, init?: RequestInit) => {
  const isForm = init?.body instanceof FormData;
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...getAuthHeaders(),
      ...(init?.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const fetchAdminClientReviews = async (): Promise<ClientReview[]> => {
  const data = await authJson(`${API_CONFIG.BASE_URL}/admin/client-reviews`);
  return data.reviews;
};

export const createClientReview = async (
  payload: Partial<ClientReview> & { name: string; body: string },
  avatar?: File
): Promise<ClientReview> => {
  const fd = new FormData();
  fd.append("name", payload.name);
  fd.append("body", payload.body);
  if (payload.role) fd.append("role", payload.role);
  if (payload.rating !== undefined) fd.append("rating", String(payload.rating));
  if (payload.featured !== undefined) fd.append("featured", String(payload.featured));
  if (payload.published !== undefined) fd.append("published", String(payload.published));
  if (avatar) fd.append("avatar", avatar);
  const data = await authJson(`${API_CONFIG.BASE_URL}/admin/client-reviews`, { method: "POST", body: fd });
  return data.review;
};

export const updateClientReview = async (
  id: string,
  payload: Partial<ClientReview>,
  avatar?: File
): Promise<ClientReview> => {
  const fd = new FormData();
  if (payload.name) fd.append("name", payload.name);
  if (payload.role !== undefined) fd.append("role", payload.role);
  if (payload.body) fd.append("body", payload.body);
  if (payload.rating !== undefined) fd.append("rating", String(payload.rating));
  if (payload.featured !== undefined) fd.append("featured", String(payload.featured));
  if (payload.published !== undefined) fd.append("published", String(payload.published));
  if (avatar) fd.append("avatar", avatar);
  const data = await authJson(`${API_CONFIG.BASE_URL}/admin/client-reviews/${id}`, { method: "PUT", body: fd });
  return data.review;
};

export const deleteClientReview = async (id: string): Promise<void> => {
  await authJson(`${API_CONFIG.BASE_URL}/admin/client-reviews/${id}`, { method: "DELETE" });
};

export const reorderClientReviews = async (orderedIds: string[]): Promise<ClientReview[]> => {
  const data = await authJson(`${API_CONFIG.BASE_URL}/admin/client-reviews/reorder`, {
    method: "POST",
    body: JSON.stringify({ orderedIds }),
  });
  return data.reviews;
};
