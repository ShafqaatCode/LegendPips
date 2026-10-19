import { API_CONFIG, getAuthHeaders, getAuthHeadersMultipart } from "../utils/apiConfig";
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

  if (category) {
    params.append("category", category);
  } else {
    params.append("category", "All");
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

export type AnalysisWritePayload = {
  title: string;
  subtitle?: string;
  category: Analysis["category"];
  author: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  chartImage?: string;
  chartTitle?: string;
  isFeatured?: boolean;
  publishedAt?: string;
  tags?: string[];
  featuredImageFile?: File | null;
  chartImageFile?: File | null;
};

function buildAnalysisFormData(body: Partial<AnalysisWritePayload>): FormData {
  const fd = new FormData();
  const skip = new Set(["featuredImageFile", "chartImageFile"]);
  Object.entries(body).forEach(([key, value]) => {
    if (skip.has(key) || value === undefined || value === null) return;
    if (typeof value === "boolean") {
      fd.append(key, value ? "true" : "false");
      return;
    }
    if (Array.isArray(value)) {
      fd.append(key, JSON.stringify(value));
      return;
    }
    fd.append(key, String(value));
  });
  if (body.featuredImageFile) fd.append("featuredImage", body.featuredImageFile);
  if (body.chartImageFile) fd.append("chartImage", body.chartImageFile);
  return fd;
}

export async function createAnalysisAdmin(body: AnalysisWritePayload): Promise<Analysis> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/analysis`, {
    method: "POST",
    headers: getAuthHeadersMultipart(),
    body: buildAnalysisFormData(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create analysis");
  return data.analysis as Analysis;
}

export async function updateAnalysisAdmin(id: string, body: Partial<AnalysisWritePayload>): Promise<Analysis> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/analysis/${id}`, {
    method: "PUT",
    headers: getAuthHeadersMultipart(),
    body: buildAnalysisFormData(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update analysis");
  return data.analysis as Analysis;
}

export async function deleteAnalysisAdmin(id: string): Promise<void> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/analysis/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Failed to delete analysis");
}

