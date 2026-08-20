export function slugifyBrokerName(name: string) {
  return (
    String(name || "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "broker"
  );
}

export function comparePairPath(brokers: { slug?: string; name: string }[]) {
  return `/compare/${brokers.map((b) => b.slug || slugifyBrokerName(b.name)).join("-vs-")}`;
}

export function parseComparePairSlug(pair: string) {
  return String(pair || "")
    .split(/-vs-/i)
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 4);
}
