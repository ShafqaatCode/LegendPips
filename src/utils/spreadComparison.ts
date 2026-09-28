import type { ApiBroker } from "../services/brokerService";

/** Extract the lowest pip value from strings like "0.0 pips", "From 0.6 pips", "~0.6-0.8 pips". */
export function parseSpreadPips(value?: string | null): number | null {
  const raw = String(value ?? "").trim();
  if (!raw || raw === "—" || raw === "-") return null;
  const nums = (raw.match(/\d+(?:\.\d+)?/g) || [])
    .map((n) => Number(n))
    .filter((n) => Number.isFinite(n));
  if (!nums.length) return null;
  return Math.min(...nums);
}

export function brokerBestSpreadPips(broker: ApiBroker): number | null {
  const candidates = [
    broker.spreadFrom,
    ...(broker.accountTypes || []).map((a) => a.spreadFrom),
  ];
  const parsed = candidates.map(parseSpreadPips).filter((n): n is number => n !== null);
  return parsed.length ? Math.min(...parsed) : null;
}

export function formatSpreadRank(spread: number | null): string {
  if (spread === null) return "—";
  return `${spread % 1 === 0 ? spread.toFixed(0) : spread.toFixed(1)} pips`;
}

/** Lowest numeric value from fee strings like "$3.5 / lot". */
export function parseMoneyishNumber(value?: string | null): number | null {
  const nums = (String(value ?? "").match(/\d+(?:\.\d+)?/g) || [])
    .map((n) => Number(n))
    .filter((n) => Number.isFinite(n));
  return nums.length ? Math.min(...nums) : null;
}
