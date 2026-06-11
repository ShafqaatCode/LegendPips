import { API_CONFIG } from "../utils/apiConfig";

export interface NavItem {
  key: string;
  label: string;
  path: string;
  section: "main" | "tools";
  order: number;
  visible: boolean;
  end?: boolean;
}

export interface PageMetaEntry {
  route: string;
  title: string;
  description: string;
  ogImage?: string;
  noIndex?: boolean;
}

export interface PublicSiteConfig {
  siteName: string;
  siteTagline: string;
  siteLogoUrl: string | null;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  emailVerificationEnabled: boolean;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  defaultOgImageUrl: string | null;
  navItems: NavItem[];
  pageMeta: PageMetaEntry[];
}

export interface RegisterConfig {
  allowRegistrations: boolean;
  maintenanceMode: boolean;
  emailVerificationRequired: boolean;
  smtpConfigured: boolean;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  photoUrl?: string;
  linkedIn?: string;
  order: number;
  published: boolean;
}

export interface ClientReview {
  _id: string;
  name: string;
  role?: string;
  rating: number;
  body: string;
  avatarUrl?: string;
  featured: boolean;
  order: number;
  published: boolean;
}

const json = async (url: string, init?: RequestInit) => {
  const res = await fetch(url, init);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const fetchPublicSiteConfig = async (): Promise<PublicSiteConfig> => {
  const data = await json(`${API_CONFIG.BASE_URL}/site-config`);
  return data.config;
};

export const fetchRegisterConfig = async (): Promise<RegisterConfig> => {
  const data = await json(`${API_CONFIG.BASE_URL}/register/config`);
  return data.config;
};

export const fetchPublicTeamMembers = async (): Promise<TeamMember[]> => {
  const data = await json(`${API_CONFIG.BASE_URL}/team-members?published=true`);
  return data.members;
};

export const fetchPublicClientReviews = async (): Promise<ClientReview[]> => {
  const data = await json(`${API_CONFIG.BASE_URL}/client-reviews?published=true`);
  return data.reviews;
};
