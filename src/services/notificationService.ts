import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

export type NotificationRow = {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  link: string;
  refType: string;
  refId: string;
  createdAt: string;
  time: string;
};

export type NotificationPreferences = {
  email: boolean;
  push: boolean;
  signals: boolean;
  contests: boolean;
  webinars: boolean;
  priceAlerts: boolean;
};

export async function fetchMyNotifications(page = 1, limit = 20, unreadOnly = false) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(unreadOnly ? { unread: "1" } : {}),
  });
  const res = await fetch(`${API_CONFIG.BASE_URL}/me/notifications?${params}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load notifications");
  return data as {
    success: boolean;
    items: NotificationRow[];
    pagination: {
      totalItems: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export async function fetchUnreadNotificationCount(): Promise<number> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/me/notifications/unread-count`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load unread count");
  return Number(data.count) || 0;
}

export async function markNotificationRead(id: string): Promise<void> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/me/notifications/${id}/read`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to mark notification read");
}

export async function markAllNotificationsRead(): Promise<void> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/me/notifications/read-all`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to mark all read");
}

export async function fetchNotificationPreferences(): Promise<NotificationPreferences> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/me/notification-preferences`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load preferences");
  return data.preferences as NotificationPreferences;
}

export async function updateNotificationPreferences(
  patch: Partial<NotificationPreferences>
): Promise<NotificationPreferences> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/me/notification-preferences`, {
    method: "PATCH",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update preferences");
  return data.preferences as NotificationPreferences;
}
