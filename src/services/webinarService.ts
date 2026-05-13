import { API_CONFIG } from "../utils/apiConfig";

const TIMEOUT_MS = 30000;

const authHeaders = (): HeadersInit => {
  if (typeof localStorage === "undefined") {
    return { "Content-Type": "application/json" };
  }
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Helper function for fetch with timeout
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout: number = TIMEOUT_MS
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw error;
  }
};

export interface Webinar {
  _id: string;
  title: string;
  instructor: string;
  description: string;
  date?: string;
  time?: string;
  status: "live" | "upcoming" | "recorded";
  premium: boolean;
  price?: number;
  thumbnail?: string;
  videoUrl?: string;
  replayUrl?: string;
  liveUrl?: string;
  duration?: string;
  category?: string;
  tags?: string[];
  maxParticipants?: number;
  currentParticipants?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WebinarResponse {
  success: boolean;
  items: Webinar[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ReserveSeatRequest {
  webinarId: string;
  name: string;
  email: string;
  phone?: string;
  questions?: string;
}

export interface JoinLiveRequest {
  webinarId: string;
  name: string;
  email: string;
}

export interface WatchReplayRequest {
  webinarId: string;
  name: string;
  email: string;
  paymentMethod?: string;
}

// Get all webinars with filters
export const fetchWebinars = async (
  status?: string,
  premium?: boolean,
  category?: string,
  page: number = 1,
  limit: number = 12
): Promise<WebinarResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status && status !== "All") {
      params.append("status", status);
    }
    if (premium !== undefined) {
      params.append("premium", premium.toString());
    }
    if (category) {
      params.append("category", category);
    }

    const response = await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}/webinars?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      TIMEOUT_MS
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch webinars");
    }

    return {
      success: data.success,
      items: data.items,
      totalItems: data.totalItems,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
      hasNextPage: data.hasNextPage,
      hasPrevPage: data.hasPrevPage,
    };
  } catch (error: any) {
    console.error("Error fetching webinars:", error);
    throw new Error(error.message || "Failed to load webinars.");
  }
};

// Get webinar by ID
export const fetchWebinarById = async (id: string): Promise<Webinar> => {
  try {
    const response = await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}/webinars/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      TIMEOUT_MS
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch webinar");
    }

    return data.webinar;
  } catch (error: any) {
    console.error("Error fetching webinar:", error);
    throw new Error(error.message || "Failed to load webinar.");
  }
};

// Reserve seat for upcoming webinar
export const reserveWebinarSeat = async (
  data: ReserveSeatRequest
): Promise<any> => {
  try {
    const response = await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}/webinars/reserve`,
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
      },
      TIMEOUT_MS
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to reserve seat");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to reserve seat");
    }

    return result.reservation;
  } catch (error: any) {
    console.error("Error reserving seat:", error);
    throw new Error(error.message || "Failed to reserve seat.");
  }
};

// Join live webinar
export const joinLiveWebinar = async (data: JoinLiveRequest): Promise<any> => {
  try {
    const response = await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}/webinars/join`,
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
      },
      TIMEOUT_MS
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to join webinar");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to join webinar");
    }

    return result;
  } catch (error: any) {
    console.error("Error joining webinar:", error);
    throw new Error(error.message || "Failed to join webinar.");
  }
};

// Watch webinar replay
export const watchWebinarReplay = async (
  data: WatchReplayRequest
): Promise<any> => {
  try {
    const response = await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}/webinars/watch`,
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
      },
      TIMEOUT_MS
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to access replay");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to access replay");
    }

    return result;
  } catch (error: any) {
    console.error("Error accessing replay:", error);
    throw new Error(error.message || "Failed to access replay.");
  }
};
