import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

export interface Competition {
  _id?: string;
  id?: string | number;
  title: string;
  subtitle?: string;
  type: string;
  event?: string;
  status: "Upcoming" | "Ongoing" | "Ended";
  participants: number;
  entry: string;
  ends?: string;
  endDate?: string;
  logo?: string;
  sponsorUrl?: string;
  sponsorText?: string;
}

export interface ContestResponse {
  success: boolean;
  message: string;
  items?: Competition[];
  contest?: Competition;
  pagination?: any;
}

// Helper function to add timeout to fetch
const fetchWithTimeout = (url: string, options: RequestInit = {}, timeout: number = 10000): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout - server is not responding")), timeout)
    ),
  ]);
};

// Get all competitions
export const fetchCompetitions = async (
  status?: string,
  page: number = 1,
  limit: number = 100
): Promise<Competition[]> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status && status !== "All") {
      params.append("status", status);
    }

    const response = await fetchWithTimeout(
      `${API_CONFIG.BASE_URL}/getAllContests?${params.toString()}`,
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

    const data: ContestResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch competitions");
    }

    // Transform backend data to match frontend Competition interface
    const competitions = (data.items || []).map((contest) => ({
      id: contest._id || contest.id,
      title: contest.title,
      subtitle: contest.subtitle,
      type: contest.type,
      event: contest.event || "",
      status: contest.status,
      participants: contest.participants || 0,
      entry: contest.entry,
      ends: contest.endDate || contest.ends || "",
      logo: contest.logo || "",
      sponsorUrl: contest.sponsorUrl,
      sponsorText: contest.sponsorText,
    }));

    return competitions;
  } catch (error: any) {
    console.error("Error fetching competitions:", error);
    // Throw error so component can handle it properly
    throw new Error(error.message || "Failed to load competitions. Please check if the backend server is running.");
  }
};

// Get competition by ID
export const fetchCompetitionById = async (id: string | number): Promise<Competition | null> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/getContestById/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: ContestResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch competition");
    }

    if (data.contest) {
      const contest = data.contest;
      return {
        id: contest._id || contest.id,
        title: contest.title,
        subtitle: contest.subtitle,
        type: contest.type,
        event: contest.event || "",
        status: contest.status,
        participants: contest.participants || 0,
        entry: contest.entry,
        ends: contest.endDate || contest.ends || "",
        logo: contest.logo || "",
        sponsorUrl: contest.sponsorUrl,
        sponsorText: contest.sponsorText,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching competition:", error);
    return null;
  }
};
