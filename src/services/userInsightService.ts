import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

export type DashboardStat = {
  key: string;
  label: string;
  value: string;
  changeText: string;
  positive: boolean;
  color: string;
};

export type UserDashboardResponse = {
  success: boolean;
  stats: DashboardStat[];
  activitySummary: {
    thisMonth: number;
    changeText: string;
    positive: boolean;
  };
};

export async function fetchMyDashboard(): Promise<UserDashboardResponse> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/me/dashboard`, {
    headers: getAuthHeaders(),
  });
  const data = (await res.json()) as UserDashboardResponse & { message?: string };
  if (!res.ok) throw new Error(data.message || "Failed to load dashboard");
  return data;
}

export type ActivityRow = {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
};

export async function fetchMyActivity(page = 1, limit = 30) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const res = await fetch(`${API_CONFIG.BASE_URL}/me/activity?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load activity");
  return data as {
    success: boolean;
    items: ActivityRow[];
    pagination: {
      totalItems: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}
