import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";
import type { KycStatus } from "./kycService";

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  status?: string;
  phone?: string;
  kycStatus?: KycStatus;
  kycSubmittedAt?: string;
  kycDocumentCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedUsers {
  success: boolean;
  items: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

const fetchWithTimeout = (url: string, options: RequestInit = {}, timeout = API_CONFIG.TIMEOUT) =>
  Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout)
    ),
  ]);

export const getAllUsers = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  kycStatus?: string;
  status?: string;
  role?: string;
  emailVerified?: string;
  kycScope?: string;
  sortBy?: string;
}): Promise<PaginatedUsers> => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.kycStatus) query.set("kycStatus", params.kycStatus);
  if (params.status) query.set("status", params.status);
  if (params.role) query.set("role", params.role);
  if (params.emailVerified) query.set("emailVerified", params.emailVerified);
  if (params.kycScope) query.set("kycScope", params.kycScope);
  if (params.sortBy) query.set("sortBy", params.sortBy);

  const response = await fetchWithTimeout(
    `${API_CONFIG.BASE_URL}/getAllUsers?${query.toString()}`,
    { headers: getAuthHeaders() }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to load users");
  return data;
};

export const blockOrUnblockUser = async (userId: string, action: "block" | "unblock") => {
  const response = await fetchWithTimeout(
    `${API_CONFIG.BASE_URL}/blockOrUnblockUser/${userId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ action }),
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to update user status");
  return data;
};

export const deleteUser = async (userId: string) => {
  const response = await fetchWithTimeout(
    `${API_CONFIG.BASE_URL}/deleteUserById/${userId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to delete user");
  return data;
};

export const impersonateUser = async (userId: string) => {
  const response = await fetchWithTimeout(
    `${API_CONFIG.BASE_URL}/admin/users/${userId}/impersonate`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to sign in as user");
  return data as { success: boolean; message: string; user: AdminUser; token: string };
};

export type BulkEmailAudience =
  | "all"
  | "kyc-verified"
  | "email-verified"
  | "active"
  | "banned";

export const sendBulkEmail = async (payload: {
  audience: BulkEmailAudience;
  subject: string;
  message: string;
}) => {
  const response = await fetchWithTimeout(
    `${API_CONFIG.BASE_URL}/admin/users/bulk-email`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    },
    120000
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to send bulk email");
  return data;
};
