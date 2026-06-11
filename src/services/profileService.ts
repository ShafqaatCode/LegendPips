import { API_CONFIG, getAuthHeaders, getAuthHeadersMultipart } from "../utils/apiConfig";
import type { User } from "./authService";

export async function updateMyProfile(data: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
}): Promise<User> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/me/profile`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update profile");
  return json.user as User;
}

export async function uploadProfileAvatar(file: File): Promise<User> {
  const formData = new FormData();
  formData.append("avatar", file);
  const res = await fetch(`${API_CONFIG.BASE_URL}/me/profile/avatar`, {
    method: "POST",
    headers: getAuthHeadersMultipart(),
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to upload photo");
  return json.user as User;
}

export function persistUser(user: User) {
  localStorage.setItem("user", JSON.stringify(user));
}
