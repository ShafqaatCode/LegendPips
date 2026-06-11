// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : "https://legendpips.com/api");

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 10000,
};

// Helper function to get auth token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem("token", token);
};

// Helper function to remove auth token
export const removeAuthToken = (): void => {
  localStorage.removeItem("token");
};

// Helper function to get auth headers
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const getAuthHeadersMultipart = (): HeadersInit => {
  const token = getAuthToken();
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/** Parse API JSON safely; surfaces HTML/error pages as readable errors. */
export async function parseJsonResponse<T = Record<string, unknown>>(
  response: Response
): Promise<T> {
  const text = await response.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    if (text.trimStart().startsWith("<!DOCTYPE") || text.trimStart().startsWith("<html")) {
      throw new Error(
        `API returned HTML instead of JSON. Check VITE_API_BASE_URL (currently ${API_CONFIG.BASE_URL}). ` +
          "For local dev use http://localhost:5000/api and ensure the backend is running."
      );
    }
    throw new Error("Invalid response from server");
  }
}
