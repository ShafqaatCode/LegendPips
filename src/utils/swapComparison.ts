import type { ApiBroker } from "../services/brokerService";
import { parseMoneyishNumber } from "./spreadComparison";

/** Parse overnight swap cost from admin text, e.g. "-1.2 pips", "$-2.50/lot". */
export function parseSwapPips(value?: string | null): number | null {
  const raw = String(value ?? "").trim();
  if (!raw || raw === "—" || raw === "-") return null;
  const lower = raw.toLowerCase();
  if (lower.includes("swap-free") || lower.includes("swap free") || lower === "free") return 0;
  const nums = (raw.match(/-?\d+(?:\.\d+)?/g) || [])
    .map((n) => Number(n))
    .filter((n) => Number.isFinite(n));
  if (!nums.length) return null;
  const abs = nums.map((n) => Math.abs(n));
  return Math.min(...abs);
}

export function brokerHasSwapFree(broker: ApiBroker): boolean {
  const hay = [
    broker.swapFrom,
    ...(broker.features || []),
    broker.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes("swap-free") || hay.includes("swap free") || hay.includes("islamic");
}

export function brokerBestSwapPips(broker: ApiBroker): number | null {
  if (brokerHasSwapFree(broker)) return 0;
  const fromField = parseSwapPips(broker.swapFrom);
  if (fromField !== null) return fromField;
  for (const f of broker.features || []) {
    const p = parseSwapPips(f);
    if (p !== null) return p;
  }
  return null;
}

export function formatSwapRank(swap: number | null, swapFree: boolean): string {
  if (swapFree || swap === 0) return "Swap-free";
  if (swap === null) return "—";
  return `${swap % 1 === 0 ? swap.toFixed(0) : swap.toFixed(1)} pips`;
}

export function brokerSwapCommission(broker: ApiBroker): number | null {
  return parseMoneyishNumber(broker.commission);
}
