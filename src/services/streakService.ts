import { API_CONFIG, assertApiOk, getAuthHeaders, parseJsonResponse } from "../utils/apiConfig";

export type StreakUser = {
  id?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
};

export type TradingStreak = {
  id: string;
  userId?: string;
  displayName?: string;
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  lastCheckInAt?: string;
  lastCheckInDay?: string;
  visibility: "public" | "private";
  note?: string;
  checkedInToday?: boolean;
  isOwner?: boolean;
  user?: StreakUser;
  createdAt?: string;
  updatedAt?: string;
};

type Paginated<T> = {
  success: boolean;
  items: T[];
  pagination?: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
};

const json = async (res: Response) => {
  const data = await parseJsonResponse<{ message?: string }>(res);
  assertApiOk(res, data, `Streaks API failed (HTTP ${res.status})`);
  return data;
};

export async function fetchPublicStreaks(opts?: { page?: number; limit?: number; sort?: string }) {
  const qs = new URLSearchParams();
  qs.set("page", String(opts?.page ?? 1));
  qs.set("limit", String(opts?.limit ?? 24));
  if (opts?.sort) qs.set("sort", opts.sort);
  const res = await fetch(`${API_CONFIG.BASE_URL}/streaks?${qs}`, { headers: getAuthHeaders() });
  return json(res) as Promise<Paginated<TradingStreak>>;
}

export async function fetchMyStreak() {
  const res = await fetch(`${API_CONFIG.BASE_URL}/streaks/me`, { headers: getAuthHeaders() });
  const data = await json(res);
  return data.streak as TradingStreak;
}

export async function updateMyStreak(body: {
  displayName?: string;
  visibility?: "public" | "private";
  note?: string;
}) {
  const res = await fetch(`${API_CONFIG.BASE_URL}/streaks/me`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const data = await json(res);
  return data.streak as TradingStreak;
}

export async function checkInStreak(note?: string) {
  const res = await fetch(`${API_CONFIG.BASE_URL}/streaks/me/check-in`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(note ? { note } : {}),
  });
  const data = await json(res);
  return { streak: data.streak as TradingStreak, message: data.message as string | undefined };
}
