import { ABOUT_SUBMENU } from "./aboutPages";

export type HelpMenuEntry =
  | { kind: "link"; to: string; label: string; end?: boolean }
  | { kind: "label"; label: string };

/**
 * Help dropdown — support channels, trader protection, then About.
 */
export const HELP_SUBMENU: HelpMenuEntry[] = [
  { kind: "label", label: "Support" },
  { kind: "link", to: "/live-chat", label: "Live Chat" },
  { kind: "link", to: "/support/tickets", label: "Support Tickets" },
  { kind: "link", to: "/support/contact", label: "Contact Us" },
  { kind: "link", to: "/support/advice", label: "Broker Advice" },
  { kind: "link", to: "/faqs", label: "FAQs" },
  { kind: "link", to: "/knowledge-base", label: "Knowledge Base" },

  { kind: "label", label: "Protection" },
  { kind: "link", to: "/complaints", label: "Complaints" },

  { kind: "label", label: "About LegendPips" },
  ...ABOUT_SUBMENU.map((item) => ({
    kind: "link" as const,
    to: item.to,
    label: item.label,
    end: "end" in item ? Boolean(item.end) : undefined,
  })),
];

export const HELP_NESTED_PATHS = new Set<string>([
  "/live-chat",
  "/support",
  "/support/contact",
  "/support/advice",
  "/support/tickets",
  "/faqs",
  "/knowledge-base",
  "/complaints",
  ...ABOUT_SUBMENU.map((item) => item.to),
]);
