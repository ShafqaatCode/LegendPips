/**
 * Normalize broker logo URLs so pasted Brandfetch page links and bare CDN
 * links become embeddable image URLs that fit circular/square logo slots.
 */

import ICLogo from "../assets/icons/Ellipse 2.png";
import XtremeLogo from "../assets/TradeMarketBrands/Ellipse 2.png";
import XmLogo from "../assets/TradeMarketBrands/Ellipse 2-1.png";
import ExnessLogo from "../assets/TradeMarketBrands/Ellipse 2-2.png";
import FpLogo from "../assets/TradeMarketBrands/Ellipse 2-3.png";
import FocusLogo from "../assets/TradeMarketBrands/Ellipse 1.png";

/** Bundled circular-safe logos for well-known partner brokers. */
const BUNDLED_BY_KEY: Record<string, string> = {
  ic: ICLogo,
  xtreme: XtremeLogo,
  xtreame: XtremeLogo,
  xm: XmLogo,
  exness: ExnessLogo,
  fp: FpLogo,
  focus: FocusLogo,
};

export function bundledBrokerLogo(name?: string | null): string {
  const n = (name || "").toLowerCase().trim();
  if (!n) return "";
  if (/\bxm\b/.test(n) || n.startsWith("xm ")) return BUNDLED_BY_KEY.xm;
  if (n.includes("exness")) return BUNDLED_BY_KEY.exness;
  if (n.includes("ic market") || n.includes("icmarkets") || n === "ic") return BUNDLED_BY_KEY.ic;
  if (n.includes("fp market") || n.includes("fpmarkets")) return BUNDLED_BY_KEY.fp;
  if (n.includes("xtreme") || n.includes("xtreame")) return BUNDLED_BY_KEY.xtreme;
  if (n.includes("focus")) return BUNDLED_BY_KEY.focus;
  return "";
}

/** True when URL is an intentional remote/local asset (not Brandfetch auto-guess). */
function isManualLogoUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host.includes("brandfetch")) return false;
    return true;
  } catch {
    return !url.includes("brandfetch");
  }
}

export function normalizeBrokerLogoUrl(raw?: string | null): string {
  const input = (raw || "").trim();
  if (!input) return "";

  try {
    const url = new URL(input);
    const host = url.hostname.toLowerCase();

    if (host === "brandfetch.com" || host === "www.brandfetch.com") {
      const domain = url.pathname.replace(/^\/+/, "").split("/")[0]?.trim();
      if (domain && domain.includes(".")) {
        return brandfetchCdnIcon(domain);
      }
      return input;
    }

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
  return `https://cdn.brandfetch.io/${clean}/w/256/h/256/theme/light/fallback/lettermark/icon.png${search || ""}`;
}

export function brokerLogoInitials(name?: string): string {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

export function brokerDomainFromName(name?: string | null): string {
  const n = (name || "").toLowerCase();
  if (!n.trim()) return "";
  if (/\bxm\b/.test(n) || n.startsWith("xm ")) return "xm.com";
  if (n.includes("exness")) return "exness.com";
  if (n.includes("ic market")) return "icmarkets.com";
  if (n.includes("fp market")) return "fpmarkets.com";
  if (n.includes("xtreme") || n.includes("xtreame")) return "xtrememarkets.com";
  if (n.includes("focus")) return "focusmarkets.com";
  if (n.includes("pepperstone")) return "pepperstone.com";
  if (n.includes("oanda")) return "oanda.com";
  if (n.includes("fxpro")) return "fxpro.com";
  if (n.includes("hotforex") || n.includes("hf markets")) return "hotforex.com";
  return "";
}

export type ResolveBrokerLogoOptions = {
  /**
   * Prefer circular-safe bundled partner logos over Brandfetch.
   * Manual Cloudinary/admin URLs still win.
   * @default true
   */
  preferBundled?: boolean;
};

/**
 * Best URL for displaying a broker icon:
 * 1) Manual/admin URL (Cloudinary, etc.)
 * 2) Bundled partner logo (XM, Exness, …)
 * 3) Brandfetch by domain guess
 */
export function resolveBrokerLogoUrl(
  raw?: string | null,
  brokerName?: string | null,
  opts?: ResolveBrokerLogoOptions
): string {
  const preferBundled = opts?.preferBundled !== false;
  const normalized = normalizeBrokerLogoUrl(raw);
  const bundled = bundledBrokerLogo(brokerName);

  if (normalized) {
    if (isManualLogoUrl(normalized)) return normalized;
    if (preferBundled && bundled) return bundled;
    return normalized;
  }

  if (bundled) return bundled;

  const domain = brokerDomainFromName(brokerName);
  if (domain) return brandfetchCdnIcon(domain);
  return "";
}
