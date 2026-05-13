import { API_CONFIG } from "../utils/apiConfig";
import type { Analysis, AnalysisResponse } from "../types/analysis.types";

const fetchWithTimeout = (
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout)
    ),
  ]) as Promise<Response>;
};

export type { Analysis, AnalysisResponse };

export const fetchAnalysis = async (
  category?: string,
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<AnalysisResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (category && category !== "All") {
    params.append("category", category);
  }

  if (search) {
    params.append("search", search);
  }

  const response = await fetchWithTimeout(
    `${API_CONFIG.BASE_URL}/analysis?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
    API_CONFIG.TIMEOUT
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error("Failed to fetch analysis");
  }

  return {
    success: data.success,
    items: data.items || [],
    totalItems: data.totalItems || 0,
    totalPages: data.totalPages || 1,
    currentPage: data.currentPage || 1,
    hasNextPage: data.hasNextPage || false,
    hasPrevPage: data.hasPrevPage || false,
  };
};

export const fetchAnalysisById = async (id: string, category?: string): Promise<Analysis> => {
  if (id.startsWith("external_") && category) {
    const params = new URLSearchParams({
      id: id,
      category: category,
    });

    const response = await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}/analysis/external?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      API_CONFIG.TIMEOUT
    );

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error((errBody as any).message || "Failed to fetch external analysis");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch external analysis");
    }

    return data.analysis;
  }

  const response = await fetchWithTimeout(
    `${API_CONFIG.BASE_URL}/analysis/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
    API_CONFIG.TIMEOUT
  );

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error((errBody as any).message || "Failed to fetch analysis");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch analysis");
  }

  return data.analysis;
};

export const fetchFeaturedAnalysis = async (limit: number = 1): Promise<Analysis[]> => {
  const response = await fetchWithTimeout(
    `${API_CONFIG.BASE_URL}/analysis/featured?limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
    API_CONFIG.TIMEOUT
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error("Failed to fetch featured analysis");
  }

  return data.analysis || [];
};

export const fetchLatestAnalysis = async (limit: number = 6): Promise<Analysis[]> => {
  const response = await fetchWithTimeout(
    `${API_CONFIG.BASE_URL}/analysis/latest?limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
    API_CONFIG.TIMEOUT
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error("Failed to fetch latest analysis");
  }

  return data.analysis || [];
};
