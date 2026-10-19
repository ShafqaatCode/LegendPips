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
  legendPoints?: number;
  lifetimePoints?: number;
  claimedMilestones?: number[];
  shields?: number;
  nextMilestone?: { days: number; lp: number; title: string; daysLeft: number } | null;
  claimableMilestones?: { days: number; lp: number; title: string }[];
  progressToNext?: { current: number; target: number };
  checkedInToday?: boolean;
  isOwner?: boolean;
  user?: StreakUser;
  createdAt?: string;
  updatedAt?: string;
};

export type RewardsDashboard = {
  currency: string;
  currencyLabel: string;
  streak: TradingStreak;
  wallet: { availableLp: number; lifetimeLp: number };
  unlockPath: {
    headline: string;
    body: string;
    unlockedCount: number;
    totalTiers: number;
    next: { tier: number; label: string; lpRequired: number; rewardLabel: string; eligible: number; remaining: number } | null;
    tiers: {
      tier: number;
      label: string;
      lpRequired: number;
      rewardLabel: string;
      eligible: number;
      unlocked: boolean;
      remaining: number;
      status: string;
    }[];
  };
  traderLevels: {
    current: { id: string; level: number; name: string; minLp: number; perk: string };
    next: { id: string; level: number; name: string; minLp: number; perk: string } | null;
    levels: { id: string; level: number; name: string; minLp: number; perk: string; unlocked: boolean; current: boolean }[];
    progressToNext: { current: number; target: number; remaining: number } | null;
  };
  earnTasks: { id: string; title: string; lp: number; done: boolean; href: string }[];
  streakBoard: {
    milestones: {
      days: number;
      lp: number;
      title: string;
      blurb: string;
      claimed: boolean;
      reached: boolean;
      status: string;
    }[];
    graceHours: number;
    checkInLp: number;
    shieldEveryDays: number;
  };
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

const json = async (res: Response): Promise<any> => {
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

export async function fetchMyRewardsDashboard() {
  const res = await fetch(`${API_CONFIG.BASE_URL}/streaks/me/rewards`, { headers: getAuthHeaders() });
  const data = await json(res);
  return data as RewardsDashboard & { success: boolean };
}

export async function claimStreakMilestone(days: number) {
  const res = await fetch(`${API_CONFIG.BASE_URL}/streaks/me/milestones/claim`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ days }),
  });
  const data = await json(res);
  return { streak: data.streak as TradingStreak, message: data.message as string | undefined };
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
