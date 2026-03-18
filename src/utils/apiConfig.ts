// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

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
