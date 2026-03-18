import type { Analysis, AnalysisResponse } from "../types/analysis.types";

// Fallback thumbnails (used when NEWS_API_KEY is not set and/or NewsAPI returns no images)
import fallbackThumb1 from "../assets/banner/hero-bg3.png";
import fallbackThumb2 from "../assets/Advertisement/image 4.png";
import fallbackThumb3 from "../assets/brokerbannergirl.jpg";

const NEWS_API_BASE_URL = "https://newsapi.org/v2";

// Must be set for Vite builds. This key will be visible to anyone who inspects the frontend bundle.
const NEWS_API_KEY: string | undefined = import.meta.env.VITE_NEWS_API_KEY;

interface NewsApiArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

// Keep this in sync with the backend category mapping.
const categoryMapping: Record<string, string[]> = {
  "Forex": ["forex", "currency", "FX", "EUR/USD", "GBP/USD"],
  "Gold": ["gold", "precious metals", "XAU"],
  "Crypto": ["bitcoin", "crypto", "cryptocurrency", "BTC", "ETH"],
  "Stock": ["stock market", "stocks", "equities", "S&P 500", "NASDAQ"],
  "Indices": ["stock index", "indices", "DAX", "FTSE", "Dow Jones"],
  "Market Outlook": ["market analysis", "market forecast", "trading", "financial markets"],
};

export const generateNewsArticleId = (url: string): string => {
  // Same algorithm style as the backend service (string hash -> base36).
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return `external_${Math.abs(hash).toString(36)}`;
};

const extractTags = (title: string, description: string): string[] => {
  const text = `${title} ${description}`.toLowerCase();
  const tags: string[] = [];

  const keywords = [
    "forex",
    "currency",
    "eur",
    "usd",
    "gbp",
    "jpy",
    "gold",
    "xau",
    "precious metals",
    "bitcoin",
    "btc",
    "ethereum",
    "eth",
    "crypto",
    "stock",
    "equity",
    "nasdaq",
    "s&p",
    "dow",
    "dax",
    "ftse",
    "index",
    "indices",
    "trading",
    "market",
    "analysis",
    "forecast",
  ];

  keywords.forEach((keyword) => {
    if (text.includes(keyword) && !tags.includes(keyword)) tags.push(keyword);
  });

  return tags.slice(0, 5);
};

const transformNewsToAnalysis = (article: NewsApiArticle, category: Analysis["category"]): Analysis => {
  const author = article.author || article.source.name || "Financial Analyst";

  const content = article.content
    ? article.content.replace(/\[\+.*?\]/g, "").trim()
    : article.description || "";

  const subtitle = article.description?.trim() || "";
  const excerpt = subtitle ? `${subtitle.substring(0, 200)}...` : "";

  const articleId = generateNewsArticleId(article.url);

  // If urlToImage is missing, use the article site's favicon as a real thumbnail fallback.
  const favicon = (() => {
    try {
      const hostname = new URL(article.url).hostname;
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=256`;
    } catch {
      return "";
    }
  })();

  return {
    _id: articleId,
    title: article.title,
    subtitle,
    category,
    author,
    content: content || subtitle || "No content available.",
    featuredImage: article.urlToImage || favicon,
    isFeatured: false,
    publishedAt: article.publishedAt,
    excerpt,
    tags: extractTags(article.title, article.description || ""),
    url: article.url,
    sourceUrl: article.url,
    isExternal: true,
  };
};

const getFallbackAnalysis = (category: Analysis["category"], count: number = 10): Analysis[] => {
  const now = new Date();

  const base: Array<Pick<Analysis, "title" | "subtitle" | "author" | "content" | "featuredImage" | "excerpt">> = [
    {
      title: "Swiss Franc Forecast: USD/CHF Defends Critical Support— Bears on Notice",
      subtitle:
        "The Swiss Franc is showing resilience as USD/CHF defends critical support levels. Technical analysis suggests potential bullish momentum ahead.",
      author: "Michael Boutros",
      content:
        "The Swiss Franc has been showing remarkable strength against the US Dollar, with USD/CHF defending critical support at key psychological levels. Technical indicators suggest a potential bullish reversal. Key resistance levels include the 200-day moving average and previous swing highs.",
      featuredImage: fallbackThumb1,
      excerpt: "Swiss Franc outlook with key support and resistance levels.",
    },
    {
      title: "Euro Technical Forecast: EUR/USD Bulls Emerge at Trend Support",
      subtitle:
        "EUR/USD is finding support at key trend levels as bulls step in. The pair may be setting up for a significant move higher.",
      author: "Michael Boutros",
      content:
        "EUR/USD is consolidating above critical support. Technical analysis indicates bullish emergence as buyers defend key levels. Watch the 1.0850 support zone and potential resistance around 1.1000.",
      featuredImage: fallbackThumb2,
      excerpt: "EUR/USD technical outlook and trend support levels.",
    },
    {
      title: "US Dollar Short-term Outlook: USD Rejected at Resistance— Key Test Ahead",
      subtitle:
        "The US Dollar faces a critical test after being rejected at key resistance levels. Market participants are watching for the next directional move.",
      author: "Michael Boutros",
      content:
        "The US Dollar Index (DXY) faced rejection near resistance levels. Mixed signals suggest a critical test ahead. Key support zones to monitor include 104.00 and 103.50, with a focus on upcoming sessions.",
      featuredImage: fallbackThumb3,
      excerpt: "DXY outlook with nearby support levels to watch.",
    },
  ];

  const items: Analysis[] = [];
  for (let i = 0; i < count; i++) {
    const b = base[i % base.length];
    const publishedAt = new Date(now.getTime() - i * 3600_000).toISOString(); // step back by hours

    const title = count <= base.length ? b.title : `${b.title} (Update ${i + 1})`;

    items.push({
      _id: `external_demo_${title.replace(/\s+/g, "_").toLowerCase()}`,
      title,
      subtitle: b.subtitle,
      category,
      author: b.author,
      content: b.content,
      featuredImage: b.featuredImage,
      isFeatured: false,
      publishedAt,
      excerpt: b.excerpt,
      tags: [],
      url: "",
      sourceUrl: "",
      isExternal: true,
    });
  }

  return items;
};

const safeFetch = async (url: string, options: RequestInit, timeoutMs: number): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) => setTimeout(() => reject(new Error("Request timeout")), timeoutMs)),
  ]);
};

export const fetchNewsArticlesClient = async (args: {
  category?: Analysis["category"];
  page?: number;
  limit?: number;
  search?: string;
}): Promise<AnalysisResponse> => {
  const page = args.page ?? 1;
  const limit = args.limit ?? 10;
  const category = args.category ?? "Market Outlook";
  const search = args.search?.trim();

  // If key isn't set, we still show something useful for the demo.
  if (!NEWS_API_KEY) {
    return {
      success: true,
      items: getFallbackAnalysis(category, limit),
      totalItems: limit,
      totalPages: 1,
      currentPage: page,
      hasNextPage: false,
      hasPrevPage: page > 1,
    };
  }

  const keywords = categoryMapping[category] || categoryMapping["Market Outlook"];
  const categoryQuery = keywords.join(" OR ");
  const q = search ? `(${categoryQuery}) AND "${search}"` : categoryQuery;

  const url = new URL(`${NEWS_API_BASE_URL}/everything`);
  url.searchParams.set("q", q);
  url.searchParams.set("language", "en");
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("page", String(page));
  url.searchParams.set("pageSize", String(limit));
  url.searchParams.set("apiKey", NEWS_API_KEY);

  try {
    const response = await safeFetch(
      url.toString(),
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
      10000
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = (await response.json()) as NewsApiResponse;

    const totalItems = data.totalResults || 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const items = (data.articles || [])
      .filter((a) => a.title && (a.description || a.content))
      .map((a) => transformNewsToAnalysis(a, category));

    return {
      success: true,
      items,
      totalItems,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  } catch (err) {
    console.warn("Frontend NewsAPI request failed, using fallback data.", err);
    const fallback = getFallbackAnalysis(category, limit);
    return {
      success: true,
      items: fallback,
      totalItems: fallback.length,
      totalPages: 1,
      currentPage: page,
      hasNextPage: false,
      hasPrevPage: page > 1,
    };
  }
};

