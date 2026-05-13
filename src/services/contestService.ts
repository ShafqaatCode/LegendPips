import { API_CONFIG } from "../utils/apiConfig";

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
  pagination?: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CompetitionsPageResult {
  items: Competition[];
  totalPages: number;
  totalItems: number;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  account: string;
  accountNumber: string;
  balance: string;
  profit: string;
  trades: number;
  joinedAt?: string;
}

const fetchWithTimeout = (url: string, options: RequestInit = {}, timeout: number = 10000): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout - server is not responding")), timeout)
    ),
  ]);
};

export const fetchCompetitions = async (
  status?: string,
  page: number = 1,
  limit: number = 100
): Promise<CompetitionsPageResult> => {
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

  const items = data.items || [];
  const competitions: Competition[] = items.map((contest: any) => ({
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

  const pagination = data.pagination;
  return {
    items: competitions,
    totalPages: pagination?.totalPages ?? 1,
    totalItems: pagination?.totalItems ?? competitions.length,
  };
};

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
      throw new Error((data as any).message || "Failed to fetch competition");
    }

    if (data.contest) {
      const contest: any = data.contest;
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

export const joinCompetition = async (id: string | number): Promise<{ success: boolean; message: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_CONFIG.BASE_URL}/contests/${id}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to join contest");
  return data;
};

export const fetchLeaderboard = async (id: string | number): Promise<LeaderboardEntry[]> => {
  const response = await fetch(`${API_CONFIG.BASE_URL}/contests/${id}/leaderboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to load leaderboard");
  return data.items || [];
};

export const fetchMyContests = async (): Promise<any[]> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_CONFIG.BASE_URL}/my-contests`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to load my contests");
  return data.items || [];
};
