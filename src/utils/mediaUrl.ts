/** Normalize media URLs for <img src> (https upgrade, trim). */
export function resolveMediaUrl(url?: string | null): string {
  const raw = String(url || "").trim();
  if (!raw) return "";
  if (raw.startsWith("//")) return `https:${raw}`;
  if (/^http:\/\//i.test(raw)) return raw.replace(/^http:\/\//i, "https://");
  return raw;
}
