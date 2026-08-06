import type { RebateTabCategory } from "../services/brokerService";

/** Primary broker kinds managed in admin & shown on the website */
export type BrokerKind = "forex" | "crypto" | "prop";

export type BrokerCategoryValue = BrokerKind | "both";

export const BROKER_KIND_LABELS: Record<BrokerKind, string> = {
  forex: "Forex Brokers",
  crypto: "Crypto Exchanges",
  prop: "Prop Firms",
};

export const BROKER_KIND_SHORT: Record<BrokerKind, string> = {
  forex: "Forex",
  crypto: "Crypto",
  prop: "Prop",
};

export const BROKER_KIND_DESCRIPTIONS: Record<BrokerKind, string> = {
  forex: "Regulated forex & CFD brokers with trading rebates",
  crypto: "Crypto exchanges and platforms with cashback",
  prop: "Prop trading firms with challenge cashback",
};

export const BROKER_KIND_COLORS: Record<
  BrokerKind,
  { bg: string; color: string; soft: string; border: string }
> = {
  forex: { bg: "#dbeafe", color: "#1d4ed8", soft: "#eff6ff", border: "#93c5fd" },
  crypto: { bg: "#ede9fe", color: "#6d28d9", soft: "#f5f3ff", border: "#c4b5fd" },
  prop: { bg: "#fef3c7", color: "#b45309", soft: "#fffbeb", border: "#fcd34d" },
};

export const BROKER_KIND_ORDER: BrokerKind[] = ["forex", "prop", "crypto"];

export function normalizeBrokerKind(
  cat?: string | null
): BrokerKind {
  if (cat === "crypto" || cat === "prop" || cat === "forex") return cat;
  if (cat === "both") return "forex";
  return "forex";
}

export function brokerKindLabel(cat?: string | null): string {
  if (cat === "both") return "Forex + Crypto";
  if (cat === "crypto" || cat === "prop" || cat === "forex") {
    return BROKER_KIND_LABELS[cat];
  }
  return BROKER_KIND_LABELS.forex;
}

export function matchesBrokerKind(
  rebateCategory: string | undefined | null,
  kind: BrokerKind
): boolean {
  const c = rebateCategory || "forex";
  if (kind === "forex") return c === "forex" || c === "both";
  if (kind === "crypto") return c === "crypto" || c === "both";
  return c === "prop";
}

export const REBATE_TAB_LABELS: Record<RebateTabCategory, string> = {
  forex: BROKER_KIND_LABELS.forex,
  prop: BROKER_KIND_LABELS.prop,
  crypto: BROKER_KIND_LABELS.crypto,
};
