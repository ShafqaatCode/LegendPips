import { API_CONFIG, getAuthHeaders, getAuthHeadersMultipart } from "../utils/apiConfig";
import type { NavItem, PageMetaEntry } from "./siteConfigService";

export interface PlatformSettings {
  _id?: string;
  siteName: string;
  siteEmail: string;
  siteTagline?: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  emailVerificationEnabled: boolean;
  siteLogoUrl?: string;
  previousSiteLogoUrl?: string;
  siteLogoHeight?: number;
  siteLogoMaxWidth?: number;
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
  defaultOgImageUrl?: string;
  navItems: NavItem[];
  pageMeta: PageMetaEntry[];
  legendScoreWeights?: {
    regulation?: number;
    tradingConditions?: number;
    withdrawals?: number;
    userExperience?: number;
    complaints?: number;
    support?: number;
  };
}

const json = async (url: string, init?: RequestInit) => {
  const body = init?.body;
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const res = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(init?.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const fetchAdminPlatformSettings = async (): Promise<PlatformSettings> => {
  const data = await json(`${API_CONFIG.BASE_URL}/admin/platform-settings`, {
    headers: getAuthHeaders(),
  });
  return data.settings;
};

export const saveAdminPlatformSettings = async (
  patch: Partial<PlatformSettings>
): Promise<PlatformSettings> => {
  const data = await json(`${API_CONFIG.BASE_URL}/admin/platform-settings`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(patch),
  });
  return data.settings;
};

export const uploadSiteLogo = async (file: File): Promise<PlatformSettings> => {
  const fd = new FormData();
  fd.append("logo", file);
  const data = await json(`${API_CONFIG.BASE_URL}/admin/platform-settings/logo`, {
    method: "POST",
    headers: getAuthHeadersMultipart(),
    body: fd,
  });
  return data.settings;
};

export const removeSiteLogo = async (): Promise<PlatformSettings> => {
  const data = await json(`${API_CONFIG.BASE_URL}/admin/platform-settings/logo`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return data.settings;
};

export const restoreSiteLogo = async (target: "previous" | "default"): Promise<PlatformSettings> => {
  const data = await json(`${API_CONFIG.BASE_URL}/admin/platform-settings/logo/restore`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ target }),
  });
  return data.settings;
};

export const uploadOgImage = async (file: File): Promise<PlatformSettings> => {
  const fd = new FormData();
  fd.append("ogImage", file);
  const data = await json(`${API_CONFIG.BASE_URL}/admin/platform-settings/og-image`, {
    method: "POST",
    headers: getAuthHeadersMultipart(),
    body: fd,
  });
  return data.settings;
};

export const requestBackupNote = async (): Promise<string> => {
  const data = await json(`${API_CONFIG.BASE_URL}/admin/platform-settings/backup-note`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return data.message as string;
};

export const requestInvalidateCache = async (): Promise<string> => {
  const data = await json(`${API_CONFIG.BASE_URL}/admin/platform-settings/invalidate-cache`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return data.message as string;
};
