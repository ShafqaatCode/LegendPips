import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

export interface PlatformSettings {
  _id?: string;
  siteName: string;
  siteEmail: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
}

const json = async (url: string, init?: RequestInit) => {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
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
