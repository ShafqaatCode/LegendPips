/**
 * Normalize broker logo URLs so pasted Brandfetch page links and bare CDN
 * links become embeddable image URLs that fit circular/square logo slots.
 */
export function normalizeBrokerLogoUrl(raw?: string | null): string {
  const input = (raw || "").trim();
  if (!input) return "";

  try {
    const url = new URL(input);
    const host = url.hostname.toLowerCase();

    // Webpage: https://brandfetch.com/exness.com → CDN icon PNG
    if (host === "brandfetch.com" || host === "www.brandfetch.com") {
      const domain = url.pathname.replace(/^\/+/, "").split("/")[0]?.trim();
      if (domain && domain.includes(".")) {
        return brandfetchCdnIcon(domain);
      }
      return input;
    }

    // CDN: ensure sized icon when only domain is provided
    if (host === "cdn.brandfetch.io") {
      const parts = url.pathname.replace(/^\/+/, "").split("/").filter(Boolean);
      if (!parts.length) return input;

      const hasDomainPrefix = parts[0] === "domain";
      const domain = hasDomainPrefix ? parts[1] : parts[0];
      if (!domain || !domain.includes(".")) return input;

      const rest = hasDomainPrefix ? parts.slice(2) : parts.slice(1);
      const alreadySized =
        rest.includes("w") ||
        rest.includes("h") ||
        rest.some((p) => /^(icon|logo|symbol)(\.|$)/i.test(p)) ||
        rest.includes("type");

      if (!alreadySized) {
        return brandfetchCdnIcon(domain, url.search);
      }

      // Prefer PNG over default webp for broader img compatibility
      const joined = rest.join("/");
      if (!/\.(png|jpe?g|svg|webp)(\?|$)/i.test(joined) && !url.pathname.includes(".")) {
        const withPng = rest.map((p) =>
          /^(icon|logo|symbol)$/i.test(p) ? `${p}.png` : p
        );
        const base = hasDomainPrefix
          ? `https://cdn.brandfetch.io/domain/${domain}/${withPng.join("/")}`
          : `https://cdn.brandfetch.io/${domain}/${withPng.join("/")}`;
        return `${base}${url.search || ""}`;
      }
    }

    return input;
  } catch {
    return input;
  }
}

function brandfetchCdnIcon(domain: string, search = ""): string {
  const clean = domain.toLowerCase().replace(/^www\./, "");
  // Sized square icon + lettermark fallback so empty brands still render
  return `https://cdn.brandfetch.io/${clean}/w/256/h/256/theme/light/fallback/lettermark/icon.png${search || ""}`;
}

export function brokerLogoInitials(name?: string): string {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}
