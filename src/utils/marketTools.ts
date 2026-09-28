export type FxRateMap = Record<string, number>;

const FRANKFURTER = "https://api.frankfurter.app";

export const CONVERTER_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CHF",
  "AUD",
  "CAD",
  "NZD",
  "PKR",
  "AED",
  "SAR",
  "INR",
] as const;

export type ConverterCurrency = (typeof CONVERTER_CURRENCIES)[number];

export async function fetchFxRates(base: string): Promise<FxRateMap> {
  const res = await fetch(`${FRANKFURTER}/latest?from=${encodeURIComponent(base)}`);
  if (!res.ok) throw new Error("Could not load exchange rates");
  const data = (await res.json()) as { rates?: FxRateMap };
  return data.rates || {};
}

export function convertAmount(
  amount: number,
  from: string,
  to: string,
  ratesFromBase: FxRateMap,
  base: string
): number | null {
  if (!Number.isFinite(amount)) return null;
  if (from === to) return amount;
  if (from === base) {
    const rate = ratesFromBase[to];
    return rate ? amount * rate : null;
  }
  if (to === base) {
    const rate = ratesFromBase[from];
    return rate ? amount / rate : null;
  }
  const toBase = ratesFromBase[from];
  const fromBaseToTarget = ratesFromBase[to];
  if (!toBase || !fromBaseToTarget) return null;
  return (amount / toBase) * fromBaseToTarget;
}

/** Risk of ruin % with fixed fractional risk and reward:risk ratio. */
export function calcRiskOfRuin(winRatePct: number, riskPct: number, rewardRisk: number): {
  ok: true;
  percent: number;
  edge: number;
} | { ok: false; error: string } {
  const p = winRatePct / 100;
  const f = riskPct / 100;
  const rr = rewardRisk;
  if (p <= 0 || p >= 1) return { ok: false, error: "Win rate must be between 1 and 99%." };
  if (f <= 0 || f > 1) return { ok: false, error: "Risk per trade must be between 0 and 100%." };
  if (rr <= 0) return { ok: false, error: "Reward:Risk must be greater than 0." };
  const edge = p * rr - (1 - p);
  if (edge <= 0) return { ok: true, percent: 100, edge };
  const ratio = (1 - edge) / (1 + edge);
  const ruin = Math.pow(ratio, 1 / f) * 100;
  return { ok: true, percent: Math.min(100, Math.max(0, ruin)), edge };
}

export function calcCryptoExchangeFees(
  amountUsd: number,
  buyFeePct: number,
  sellFeePct: number
): { ok: true; buyFee: number; sellFee: number; total: number; netAfterRoundTrip: number } | {
  ok: false;
  error: string;
} {
  if (amountUsd <= 0) return { ok: false, error: "Trade amount must be greater than 0." };
  if (buyFeePct < 0 || sellFeePct < 0) return { ok: false, error: "Fees cannot be negative." };
  const buyFee = amountUsd * (buyFeePct / 100);
  const sellFee = amountUsd * (sellFeePct / 100);
  const total = buyFee + sellFee;
  return { ok: true, buyFee, sellFee, total, netAfterRoundTrip: amountUsd - total };
}
