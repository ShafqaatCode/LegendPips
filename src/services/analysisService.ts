import { API_CONFIG } from "../utils/apiConfig";
import type { Analysis, AnalysisResponse } from "../types/analysis.types";
import { fetchNewsArticlesClient } from "./newsApiClient";

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

// Re-export types for convenience
export type { Analysis, AnalysisResponse };

// Get all analysis with pagination and filters
export const fetchAnalysis = async (
  category?: string,
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<AnalysisResponse> => {
  try {
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

    // Transform response to match expected format
    return {
      success: data.success,
      items: data.items || [],
      totalItems: data.totalItems || 0,
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || 1,
      hasNextPage: data.hasNextPage || false,
      hasPrevPage: data.hasPrevPage || false,
    };
  } catch (error: any) {
    console.error("Error fetching analysis:", error);

    // Demo mode: if backend isn't deployed, show analysis from NewsAPI directly on the frontend.
    const fallbackCategory = ((category && category !== "All" ? category : "Market Outlook") ||
      "Market Outlook") as any;

    return fetchNewsArticlesClient({
      category: fallbackCategory,
      page,
      limit,
      search,
    });
  }
};

// Get analysis by ID
export const fetchAnalysisById = async (id: string, category?: string): Promise<Analysis> => {
  try {
    // If it's an external article, use the external endpoint
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch external analysis");
      }

      return data.analysis;
    }

    // Regular database article
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch analysis");
    }

    return data.analysis;
  } catch (error: any) {
    console.error("Error fetching analysis:", error);

    // Demo mode: resolve external articles from cached click data (preferred),
    // otherwise fetch a batch from NewsAPI and match by generated id.
    if (id.startsWith("external_")) {
      try {
        const cacheKey = `legendpips_analysis_external_${id}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          return JSON.parse(cached) as Analysis;
        }
      } catch {
        // Ignore cache parse errors.
      }

      const fallbackCategory = ((category && category !== "All" ? category : "Market Outlook") ||
        "Market Outlook") as any;

      const batch = await fetchNewsArticlesClient({
        category: fallbackCategory,
        page: 1,
        limit: 50,
      });

      const found = batch.items.find((item) => item._id === id);
      if (found) return found;
    }

    // If we can't find the article, return a safe placeholder for the UI.
    const fallbackCategory = ((category && category !== "All" ? category : "Market Outlook") ||
      "Market Outlook") as any;

    return {
      _id: id,
      title: "Article unavailable",
      subtitle: "",
      category: fallbackCategory,
      author: "LegendPips",
      content: "This content is not available in demo mode.",
      featuredImage: "",
      isFeatured: false,
      publishedAt: new Date().toISOString(),
      excerpt: "",
      tags: [],
      url: "",
      sourceUrl: "",
      isExternal: id.startsWith("external_"),
    };
  }
};

// Get featured analysis
export const fetchFeaturedAnalysis = async (limit: number = 1): Promise<Analysis[]> => {
  try {
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
  } catch (error: any) {
    console.error("Error fetching featured analysis:", error);

    const response = await fetchNewsArticlesClient({
      category: "Market Outlook",
      page: 1,
      limit,
    });

    return response.items;
  }
};

// Get latest analysis
export const fetchLatestAnalysis = async (limit: number = 6): Promise<Analysis[]> => {
  try {
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
  } catch (error: any) {
    console.error("Error fetching latest analysis:", error);

    const response = await fetchNewsArticlesClient({
      category: "Market Outlook",
      page: 1,
      limit,
    });

    return response.items;
  }
};
