export type DepositCurrency = "USD" | "EUR" | "GBP";

export type PipInstrument =
  | "EUR/USD"
  | "GBP/USD"
  | "AUD/USD"
  | "USD/JPY"
  | "USD/CHF"
  | "XAU/USD";

type InstrumentConfig = {
  pipSize: number;
  unitsPerLot: number;
  quoteCurrency: "USD" | "JPY" | "CHF";
};

/** Static reference rates for quote → account currency conversion (approximate). */
const REFERENCE_RATES = {
  "USD/JPY": 150,
  "USD/CHF": 0.88,
  USD_PER_EUR: 1.08,
  USD_PER_GBP: 1.27,
} as const;

const INSTRUMENTS: Record<PipInstrument, InstrumentConfig> = {
  "EUR/USD": { pipSize: 0.0001, unitsPerLot: 100_000, quoteCurrency: "USD" },
  "GBP/USD": { pipSize: 0.0001, unitsPerLot: 100_000, quoteCurrency: "USD" },
  "AUD/USD": { pipSize: 0.0001, unitsPerLot: 100_000, quoteCurrency: "USD" },
  "USD/JPY": { pipSize: 0.01, unitsPerLot: 100_000, quoteCurrency: "JPY" },
  "USD/CHF": { pipSize: 0.0001, unitsPerLot: 100_000, quoteCurrency: "CHF" },
  "XAU/USD": { pipSize: 0.01, unitsPerLot: 100, quoteCurrency: "USD" },
};

export const PIP_INSTRUMENT_OPTIONS: PipInstrument[] = Object.keys(INSTRUMENTS) as PipInstrument[];

function quoteAmountToUsd(amount: number, quote: InstrumentConfig["quoteCurrency"]): number {
  if (quote === "USD") return amount;
  if (quote === "JPY") return amount / REFERENCE_RATES["USD/JPY"];
  return amount / REFERENCE_RATES["USD/CHF"];
}

function usdToDepositCurrency(usd: number, deposit: DepositCurrency): number {
  if (deposit === "USD") return usd;
  if (deposit === "EUR") return usd / REFERENCE_RATES.USD_PER_EUR;
  return usd / REFERENCE_RATES.USD_PER_GBP;
}

/** Total monetary value for the given pip move, in the selected deposit currency. */
export function calculatePipValue(params: {
  instrument: PipInstrument;
  lots: number;
  pips: number;
  depositCurrency: DepositCurrency;
}): number {
  const { instrument, lots, pips, depositCurrency } = params;
  if (!Number.isFinite(lots) || !Number.isFinite(pips) || lots <= 0 || pips <= 0) {
    return 0;
  }

  const cfg = INSTRUMENTS[instrument];
  const valueInQuote = cfg.pipSize * cfg.unitsPerLot * lots * pips;
  const valueInUsd = quoteAmountToUsd(valueInQuote, cfg.quoteCurrency);
  return usdToDepositCurrency(valueInUsd, depositCurrency);
}

export function formatPipValue(amount: number, depositCurrency: DepositCurrency): string {
  const symbols: Record<DepositCurrency, string> = { USD: "$", EUR: "€", GBP: "£" };
  return `${symbols[depositCurrency]}${amount.toFixed(2)}`;
}
