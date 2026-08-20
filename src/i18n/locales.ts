export const LOCALES = [
  { code: "en", name: "English", native: "English", dir: "ltr" as const },
  { code: "ar", name: "Arabic", native: "العربية", dir: "rtl" as const },
  { code: "es", name: "Spanish", native: "Español", dir: "ltr" as const },
  { code: "pt", name: "Portuguese", native: "Português", dir: "ltr" as const },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia", dir: "ltr" as const },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt", dir: "ltr" as const },
  { code: "fr", name: "French", native: "Français", dir: "ltr" as const },
  { code: "tr", name: "Turkish", native: "Türkçe", dir: "ltr" as const },
  { code: "ur", name: "Urdu", native: "اردو", dir: "rtl" as const },
] as const;

export type LocaleCode = (typeof LOCALES)[number]["code"];

export const DEFAULT_LOCALE: LocaleCode = "en";
export const LOCALE_STORAGE_KEY = "lp-lang";

export function isLocaleCode(v: string): v is LocaleCode {
  return LOCALES.some((l) => l.code === v);
}

export function localeMeta(code: LocaleCode) {
  return LOCALES.find((l) => l.code === code) || LOCALES[0];
}

export function detectBrowserLocale(): LocaleCode {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const raw = (navigator.languages?.[0] || navigator.language || "en").toLowerCase();
  const short = raw.slice(0, 2);
  if (short === "pt") return "pt";
  if (isLocaleCode(short)) return short;
  return DEFAULT_LOCALE;
}

/** Map public routes to translation keys under `nav`. */
export const ROUTE_NAV_KEY: Record<string, string> = {
  "/": "home",
  "/how-it-works": "howItWorks",
  "/rebates": "rebates",
  "/prop-firms": "propFirms",
  "/contests": "contests",
  "/brokers": "brokers",
  "/compare": "compare",
  "/complaints": "complaints",
  "/signals": "signals",
  "/rewards": "rewards",
  "/analysis": "analysis",
  "/forum": "forum",
  "/traders": "traders",
  "/copy-trading": "copyTrading",
  "/courses": "courses",
  "/trading-videos": "tradingVideos",
  "/webinars": "webinars",
  "/calculators": "allCalculators",
  "/tools": "allCalculators",
  "/pip-calculator": "pip",
  "/position-size-calculator": "positionSize",
  "/margin-calculator": "margin",
  "/rebate-calculator": "rebate",
  "/pivot-point-calculator": "pivot",
  "/fibonacci-calculator": "fibonacci",
  "/profit-calculator": "profit",
  "/lot-calculator": "lot",
  "/risk-reward-calculator": "riskReward",
  "/drawdown-calculator": "drawdown",
  "/compound-calculator": "compound",
  "/crypto-profit-calculator": "cryptoProfit",
};
