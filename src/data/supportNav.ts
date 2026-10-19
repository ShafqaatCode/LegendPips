export const SUPPORT_SUBMENU = [
  { to: "/live-chat", label: "Live Chat" },
  { to: "/support/tickets", label: "Support Tickets" },
  { to: "/support/contact", label: "Contact Us" },
  { to: "/support/advice", label: "Broker Advice" },
  { to: "/complaints", label: "Complaints" },
  { to: "/faqs", label: "FAQs" },
  { to: "/knowledge-base", label: "Knowledge Base" },
  { to: "/about", label: "About Us / Why Trust Us", end: true },
] as const;

export const SUPPORT_NESTED_PATHS = new Set<string>([
  ...SUPPORT_SUBMENU.map((item) => item.to),
  "/support",
  "/user-panel/tickets",
]);
