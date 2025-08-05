// src/api/mockLeaderboard.ts
export interface LeaderboardEntry {
  id: number;
  name: string;
  account: string;
  accountBalance: number;
  profitPercent: number;
  trades: number;
}

export const leaderboardData: LeaderboardEntry[] = [
  { id: 1, name: "Via", account: "Contest Account 352819", accountBalance: 18830.3, profitPercent: 2117.9, trades: 28 },
  { id: 2, name: "Mohmi", account: "Contest Account 353810", accountBalance: 20230.3, profitPercent: 1927.8, trades: 19 },
  { id: 3, name: "Taj Wali Khan", account: "Contest Account 342816", accountBalance: 17830.3, profitPercent: 1784.55, trades: 32 },
  // ... add more mock data
];

export const fetchLeaderboard = (): Promise<LeaderboardEntry[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(leaderboardData), 1000); // Simulate API delay
  });
};
