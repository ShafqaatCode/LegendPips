import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";
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
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
  defaultOgImageUrl?: string;
  navItems: NavItem[];
  pageMeta: PageMetaEntry[];
}

const json = async (url: string, init?: RequestInit) => {
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
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
    headers: getAuthHeaders(),
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

export const uploadOgImage = async (file: File): Promise<PlatformSettings> => {
  const fd = new FormData();
  fd.append("ogImage", file);
  const data = await json(`${API_CONFIG.BASE_URL}/admin/platform-settings/og-image`, {
    method: "POST",
    headers: getAuthHeaders(),
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
