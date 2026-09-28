export type NewsSection = {
  slug: string;
  label: string;
  /** Category sent to the analysis API (NewsAPI + DB filter). */
  apiCategory: string;
};

export const NEWS_SECTIONS: NewsSection[] = [
  { slug: "", label: "All", apiCategory: "All" },
  { slug: "market-news", label: "Market News", apiCategory: "Market News" },
  { slug: "market-analysis", label: "Market Analysis", apiCategory: "Market Analysis" },
  { slug: "prop-firm-news", label: "Prop Firm News", apiCategory: "Prop Firm News" },
  { slug: "gold", label: "Gold", apiCategory: "Gold" },
  { slug: "crypto", label: "Crypto", apiCategory: "Crypto" },
  { slug: "industry-news", label: "Industry News", apiCategory: "Industry News" },
  { slug: "press-releases", label: "Press Releases", apiCategory: "Press Releases" },
];

export const NEWS_SUBMENU = NEWS_SECTIONS.map((section) => ({
  to: section.slug ? `/news/${section.slug}` : "/news",
  label: section.label,
  end: section.slug === "",
}));

export const NEWS_NESTED_PATHS = new Set<string>([
  ...NEWS_SUBMENU.map((item) => item.to),
  "/analysis",
]);

const slugToSection = new Map(NEWS_SECTIONS.map((s) => [s.slug, s]));

export function newsApiCategoryFromSlug(slug?: string): string {
  if (!slug) return "All";
  return slugToSection.get(slug)?.apiCategory ?? "All";
}

export function newsSlugFromPath(pathname: string): string {
  if (pathname === "/news" || pathname === "/analysis") return "";
  const match = pathname.match(/^\/news\/([^/]+)/);
  return match?.[1] ?? "";
}
