import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchPublicSiteConfig,
  type PublicSiteConfig,
  type NavItem,
} from "../services/siteConfigService";

interface SiteConfigContextValue {
  config: PublicSiteConfig | null;
  loading: boolean;
  mainNav: NavItem[];
  toolsNav: NavItem[];
  refresh: () => Promise<void>;
}

const defaultConfig: PublicSiteConfig = {
  siteName: "LegendPips",
  siteTagline: "",
  siteLogoUrl: null,
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
});

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<PublicSiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await fetchPublicSiteConfig();
      setConfig(data);
    } catch {
      setConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const mainNav = useMemo(
    () => (config?.navItems || []).filter((n) => n.section === "main"),
    [config]
  );
  const toolsNav = useMemo(
    () => (config?.navItems || []).filter((n) => n.section === "tools"),
    [config]
  );

  return (
    <SiteConfigContext.Provider value={{ config, loading, mainNav, toolsNav, refresh: load }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => useContext(SiteConfigContext);

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
  }, [config, pathname]);
};
