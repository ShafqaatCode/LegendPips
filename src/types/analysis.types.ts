export interface Analysis {
  _id: string;
  title: string;
  subtitle?: string;
  category: "Market Outlook" | "Forex" | "Gold" | "Crypto" | "Indices" | "Stock";
  author: string;
  authorImage?: string;
  content: string;
  featuredImage?: string;
  chartImage?: string;
  chartTitle?: string;
  isFeatured: boolean;
  publishedAt: string | Date;
  views?: number;
  tags?: string[];
  excerpt?: string;
  createdAt?: string;
  updatedAt?: string;
  url?: string;
  sourceUrl?: string;
  isExternal?: boolean;
}

export interface AnalysisResponse {
  success: boolean;
  items: Analysis[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
