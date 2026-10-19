export type BrokerMenuEntry =
  | { kind: "link"; to: string; label: string; end?: boolean }
  | { kind: "label"; label: string };

/** Paths owned by the Brokers dropdown (kept out of top-level nav duplicates). */
export const BROKER_NESTED_PATHS = new Set([
  "/brokers",
  "/brokers/beginners",
  "/find-broker",
  "/brokers/match",
  "/scam-broker-shield",
  "/rebates",
  "/account-types",
  "/select-account-type",
  "/prop-firms",
  "/compare",
]);

/**
 * Brokers dropdown — browse listings, find/match tools, then safety.
 * Complaints live under Help (not here).
 */
export const BROKER_SUBMENU: BrokerMenuEntry[] = [
  { kind: "label", label: "Browse" },
  { kind: "link", to: "/brokers", label: "All Brokers", end: true },
  { kind: "link", to: "/rebates", label: "Rebate Brokers" },
  { kind: "link", to: "/prop-firms", label: "Prop Firms" },
  { kind: "link", to: "/account-types", label: "Account Types" },

  { kind: "label", label: "Find & compare" },
  { kind: "link", to: "/find-broker", label: "Find My Broker" },
  { kind: "link", to: "/brokers/beginners", label: "Best for New Traders" },
  { kind: "link", to: "/compare", label: "Compare Brokers" },

  { kind: "label", label: "Safety" },
  { kind: "link", to: "/scam-broker-shield", label: "Scam Broker Shield" },
];
