import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";
import type { TeamMember } from "./siteConfigService";

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

export const fetchAdminTeamMembers = async (): Promise<TeamMember[]> => {
  const data = await authJson(`${API_CONFIG.BASE_URL}/admin/team-members`);
  return data.members;
};

export const createTeamMember = async (
  payload: Partial<TeamMember> & { name: string; role: string },
  photo?: File
): Promise<TeamMember> => {
  const fd = new FormData();
  fd.append("name", payload.name);
  fd.append("role", payload.role);
  if (payload.bio) fd.append("bio", payload.bio);
  if (payload.linkedIn) fd.append("linkedIn", payload.linkedIn);
  if (payload.published !== undefined) fd.append("published", String(payload.published));
  if (photo) fd.append("photo", photo);
  const data = await authJson(`${API_CONFIG.BASE_URL}/admin/team-members`, { method: "POST", body: fd });
  return data.member;
};

export const updateTeamMember = async (
  id: string,
  payload: Partial<TeamMember>,
  photo?: File
): Promise<TeamMember> => {
  const fd = new FormData();
  if (payload.name) fd.append("name", payload.name);
  if (payload.role) fd.append("role", payload.role);
  if (payload.bio !== undefined) fd.append("bio", payload.bio);
  if (payload.linkedIn !== undefined) fd.append("linkedIn", payload.linkedIn);
  if (payload.published !== undefined) fd.append("published", String(payload.published));
  if (payload.order !== undefined) fd.append("order", String(payload.order));
  if (photo) fd.append("photo", photo);
  const data = await authJson(`${API_CONFIG.BASE_URL}/admin/team-members/${id}`, { method: "PUT", body: fd });
  return data.member;
};

export const deleteTeamMember = async (id: string): Promise<void> => {
  await authJson(`${API_CONFIG.BASE_URL}/admin/team-members/${id}`, { method: "DELETE" });
};

export const reorderTeamMembers = async (orderedIds: string[]): Promise<TeamMember[]> => {
  const data = await authJson(`${API_CONFIG.BASE_URL}/admin/team-members/reorder`, {
    method: "POST",
    body: JSON.stringify({ orderedIds }),
  });
  return data.members;
};
