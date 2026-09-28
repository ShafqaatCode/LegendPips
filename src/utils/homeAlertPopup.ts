const STORAGE_KEY = "lp_home_alert_dismissed";
const POPUP_WINDOW_MS = 24 * 60 * 60 * 1000;

export function isWithinPopupWindow(createdAt: string | Date): boolean {
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) return false;
  return Date.now() - created < POPUP_WINDOW_MS;
}

function readDismissedIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function wasAnnouncementDismissed(id: string): boolean {
  return readDismissedIds().includes(id);
}

export function dismissHomeAnnouncement(id: string): void {
  const ids = readDismissedIds();
  if (ids.includes(id)) return;
  const next = [id, ...ids].slice(0, 30);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function shouldShowHomeAlertPopup(id: string, createdAt: string | Date): boolean {
  if (!id || !isWithinPopupWindow(createdAt)) return false;
  return !wasAnnouncementDismissed(id);
}
