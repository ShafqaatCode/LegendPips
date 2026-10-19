/** Accurate, educational forex helpers (standard lot = 100,000 units; gold = 100 oz). */

export type FxPair =
  | "EUR/USD"
  | "GBP/USD"
  | "AUD/USD"
  | "USD/JPY"
  | "USD/CHF"
  | "USD/CAD"
  | "XAU/USD";

type PairCfg = {
  /** Price move of one pip */
  pipSize: number;
  /** Units in 1.00 lot */
  unitsPerLot: number;
  /** Typical mid for margin examples */
  defaultPrice: number;
  /** Quote currency of the pair */
  quote: "USD" | "JPY" | "CHF" | "CAD";
};

export const FX_PAIRS: Record<FxPair, PairCfg> = {
  "EUR/USD": { pipSize: 0.0001, unitsPerLot: 100_000, defaultPrice: 1.085, quote: "USD" },
  "GBP/USD": { pipSize: 0.0001, unitsPerLot: 100_000, defaultPrice: 1.27, quote: "USD" },
  "AUD/USD": { pipSize: 0.0001, unitsPerLot: 100_000, defaultPrice: 0.66, quote: "USD" },
  "USD/JPY": { pipSize: 0.01, unitsPerLot: 100_000, defaultPrice: 150, quote: "JPY" },
  "USD/CHF": { pipSize: 0.0001, unitsPerLot: 100_000, defaultPrice: 0.88, quote: "CHF" },
  "USD/CAD": { pipSize: 0.0001, unitsPerLot: 100_000, defaultPrice: 1.36, quote: "CAD" },
  "XAU/USD": { pipSize: 0.01, unitsPerLot: 100, defaultPrice: 2350, quote: "USD" },
};

export const FX_PAIR_OPTIONS = Object.keys(FX_PAIRS) as FxPair[];

/** Approximate quote→USD for educational calcs (not live rates). */
const TO_USD: Record<PairCfg["quote"], number> = {
  USD: 1,
  JPY: 1 / 150,
  CHF: 1 / 0.88,
  CAD: 1 / 1.36,
};

/** Pip value in USD for 1.00 lot at the given (or default) price. */
export function pipValueUsdPerLot(pair: FxPair, price?: number): number {
  const cfg = FX_PAIRS[pair];
  const px = price && price > 0 ? price : cfg.defaultPrice;
  // Value of 1 pip move on 1 lot, in quote currency
  const inQuote = cfg.pipSize * cfg.unitsPerLot;
  if (cfg.quote === "USD") return inQuote;
  // For USD/XXX, pip value in USD ≈ (pipSize * units) / price
  if (pair.startsWith("USD/")) return inQuote / px;
  return inQuote * TO_USD[cfg.quote];
}

export function calculatePositionSize(params: {
  pair: FxPair;
  accountBalance: number;
  riskPercent: number;
  stopLossPips: number;
  price?: number;
}): { ok: true; riskMoney: number; pipValue: number; lots: number; units: number } | { ok: false; error: string } {
  const { pair, accountBalance, riskPercent, stopLossPips, price } = params;
  if (!(accountBalance > 0)) return { ok: false, error: "Account balance must be greater than 0." };
  if (!(riskPercent > 0 && riskPercent <= 100)) return { ok: false, error: "Risk % must be between 0 and 100." };
  if (!(stopLossPips > 0)) return { ok: false, error: "Stop-loss (pips) must be greater than 0." };

  const riskMoney = (accountBalance * riskPercent) / 100;
  const pipValue = pipValueUsdPerLot(pair, price);
  if (!(pipValue > 0)) return { ok: false, error: "Could not compute pip value for this pair." };

  const lots = riskMoney / (stopLossPips * pipValue);
  const units = lots * FX_PAIRS[pair].unitsPerLot;
  return { ok: true, riskMoney, pipValue, lots, units };
}

export function calculateRequiredMargin(params: {
  pair: FxPair;
  lots: number;
  leverage: number;
  price?: number;
}): { ok: true; notionalUsd: number; marginUsd: number } | { ok: false; error: string } {
  const { pair, lots, leverage, price } = params;
  if (!(lots > 0)) return { ok: false, error: "Lots must be greater than 0." };
  if (!(leverage > 0)) return { ok: false, error: "Leverage must be greater than 0." };

  const cfg = FX_PAIRS[pair];
  const px = price && price > 0 ? price : cfg.defaultPrice;
  const notionalInQuote = px * cfg.unitsPerLot * lots;

  let notionalUsd: number;
  if (cfg.quote === "USD") notionalUsd = notionalInQuote;
  else if (pair.startsWith("USD/")) notionalUsd = cfg.unitsPerLot * lots; // base is USD
  else notionalUsd = notionalInQuote * TO_USD[cfg.quote];

  const marginUsd = notionalUsd / leverage;
  return { ok: true, notionalUsd, marginUsd };
}

export function formatMoney(n: number, currency = "USD"): string {
  const sym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";
  return `${sym}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
