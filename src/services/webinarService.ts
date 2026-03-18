const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  TIMEOUT: 30000,
};

// Helper function for fetch with timeout
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout: number = API_CONFIG.TIMEOUT
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
      `${API_CONFIG.BASE_URL}/api/webinars?${params.toString()}`,
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
      `${API_CONFIG.BASE_URL}/api/webinars/${id}`,
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
      `${API_CONFIG.BASE_URL}/api/webinars/reserve`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
      API_CONFIG.TIMEOUT
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
      `${API_CONFIG.BASE_URL}/api/webinars/join`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
      API_CONFIG.TIMEOUT
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
      `${API_CONFIG.BASE_URL}/api/webinars/watch`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
      API_CONFIG.TIMEOUT
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
