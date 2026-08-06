import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";
import type { AdminPermission } from "../utils/adminPermissions";
import { ADMIN_PERMISSION_META } from "../utils/adminPermissions";

export type AdminStaffMember = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: string;
  role: string;
  isFullAdmin: boolean;
  adminPermissions: string[];
  createdAt?: string;
};

const base = `${API_CONFIG.BASE_URL}/admin/staff`;

async function fetchJson(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(options?.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export async function fetchAdminStaff() {
  const data = await fetchJson(base);
  return {
    items: (data.items || []) as AdminStaffMember[],
    permissionCatalog: (data.permissionCatalog || ADMIN_PERMISSION_META) as typeof ADMIN_PERMISSION_META,
  };
}

export async function createAdminStaff(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  permissions: AdminPermission[];
}) {
  const data = await fetchJson(base, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.member as AdminStaffMember;
}

export async function updateAdminStaff(
  id: string,
  payload: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    status?: "active" | "blocked";
    permissions?: AdminPermission[];
    password?: string;
  }
) {
  const data = await fetchJson(`${base}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.member as AdminStaffMember;
}

export async function deleteAdminStaff(id: string) {
  await fetchJson(`${base}/${id}`, { method: "DELETE" });
}
