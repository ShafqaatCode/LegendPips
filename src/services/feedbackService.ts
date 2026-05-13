import { API_CONFIG, getAuthToken } from "../utils/apiConfig";

export async function submitFeedback(body: {
  email: string;
  message: string;
  page?: string;
}): Promise<{ success: boolean; message?: string }> {
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
  return data as { success: boolean; message?: string };
}
