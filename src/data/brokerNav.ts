export type BrokerMenuEntry =
  | { kind: "link"; to: string; label: string; end?: boolean }
  | { kind: "label"; label: string };

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
  "/complaints",
]);

export const BROKER_SUBMENU: BrokerMenuEntry[] = [
  { kind: "link", to: "/brokers", label: "All Brokers", end: true },
  { kind: "link", to: "/account-types", label: "Account Types" },
  { kind: "link", to: "/rebates", label: "Rebates" },
  { kind: "link", to: "/prop-firms", label: "Prop Firms" },
  { kind: "link", to: "/compare", label: "Compare" },
  { kind: "link", to: "/complaints", label: "Complaints" },
  { kind: "label", label: "Find a broker" },
  { kind: "link", to: "/brokers/beginners", label: "Best for New Traders" },
  { kind: "link", to: "/find-broker", label: "Find My Broker" },
  { kind: "link", to: "/scam-broker-shield", label: "Scam Broker Shield" },
];
