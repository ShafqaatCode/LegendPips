import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchPublicSiteConfig,
  type PublicSiteConfig,
  type NavItem,
} from "../services/siteConfigService";
import defaultLogo from "../assets/icons/image 2.svg";

interface SiteConfigContextValue {
  config: PublicSiteConfig | null;
  loading: boolean;
  mainNav: NavItem[];
  toolsNav: NavItem[];
  refresh: () => Promise<void>;
  /** Immediately apply branding fields (e.g. after admin logo upload) without waiting on refetch. */
  applyBranding: (patch: Partial<PublicSiteConfig>) => void;
}

const defaultConfig: PublicSiteConfig = {
  siteName: "LegendPips",
  siteTagline: "",
  siteLogoUrl: null,
  siteLogoHeight: 40,
  siteLogoMaxWidth: 160,
  maintenanceMode: false,
  allowRegistrations: true,
  emailVerificationEnabled: true,
  defaultMetaTitle: "LegendPips",
  defaultMetaDescription: "",
  defaultOgImageUrl: null,
  navItems: [],
  pageMeta: [],
};

const SiteConfigContext = createContext<SiteConfigContextValue>({
  config: null,
  loading: true,
  mainNav: [],
  toolsNav: [],
  refresh: async () => {},
  applyBranding: () => {},
});

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<PublicSiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchPublicSiteConfig();
      setConfig(data);
    } catch {
      // Keep last known config so a transient error does not wipe a custom logo.
      setConfig((prev) => prev ?? defaultConfig);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyBranding = useCallback((patch: Partial<PublicSiteConfig>) => {
    setConfig((prev) => {
      const base = prev || defaultConfig;
      return {
        ...base,
        ...patch,
        siteLogoUrl:
          patch.siteLogoUrl !== undefined
            ? patch.siteLogoUrl?.trim() || null
            : base.siteLogoUrl,
      };
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const mainNav = useMemo(
    () => (config?.navItems || []).filter((n) => n.section === "main"),
    [config]
  );
  const toolsNav = useMemo(
    () => (config?.navItems || []).filter((n) => n.section === "tools"),
    [config]
  );

  return (
    <SiteConfigContext.Provider
      value={{ config, loading, mainNav, toolsNav, refresh: load, applyBranding }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => useContext(SiteConfigContext);

/** Admin-uploaded site logo, with bundled fallback when none is set. */
export const useSiteLogo = (_variant: "default" | "light" = "default") => {
  const { config } = useSiteConfig();
  const custom = config?.siteLogoUrl?.trim() || "";
  const siteName = config?.siteName || "LegendPips";
  const height = Math.min(80, Math.max(24, Number(config?.siteLogoHeight) || 40));
  const maxWidth = Math.min(280, Math.max(80, Number(config?.siteLogoMaxWidth) || 160));
  // Same custom URL everywhere (navbar, footer, sidebars). Fallback is the brand SVG.
  return {
    src: custom || defaultLogo,
    alt: `${siteName} Logo`,
    siteName,
    isCustom: Boolean(custom),
    height,
    maxWidth,
  };
};

export const usePageMeta = () => {
  const { config } = useSiteConfig();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!config) return;

    const page = config.pageMeta.find((p) => p.route === pathname);
    const title = page?.title || config.defaultMetaTitle || config.siteName;
    const description = page?.description || config.defaultMetaDescription || "";
    const ogImage = page?.ogImage || config.defaultOgImageUrl || "";

    document.title = title;

    const setMeta = (name: string, content: string, prop = false) => {
      if (!content) return;
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("description", description);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    if (ogImage) setMeta("og:image", ogImage, true);

    const faviconHref = config.siteLogoUrl || "/favicon.ico";
    let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconHref;
  }, [config, pathname]);
};
