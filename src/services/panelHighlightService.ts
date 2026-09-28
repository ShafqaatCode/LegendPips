import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

export type HighlightPlacement = "top" | "bottom";
export type HighlightTheme = "lavender" | "navy" | "gold" | "mint" | "rose" | "slate";
export type HighlightIconStyle = "initials" | "bell" | "alert" | "star";

export type PanelHighlight = {
  id: string;
  title: string;
  eyebrow?: string;
  ctaLabel: string;
  content: string;
  initials: string;
  theme: HighlightTheme;
  iconStyle: HighlightIconStyle;
  placement: HighlightPlacement;
  active: boolean;
  priority: number;
  startsAt?: string | null;
  endsAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type PanelHighlightInput = {
  title: string;
  eyebrow?: string;
  ctaLabel?: string;
  content: string;
  initials?: string;
  theme?: HighlightTheme;
  iconStyle?: HighlightIconStyle;
  placement?: HighlightPlacement;
  active?: boolean;
  priority?: number;
  startsAt?: string | null;
  endsAt?: string | null;
};

const fetchJson = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(options?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Request failed");
  return data;
};

export async function fetchActivePanelHighlights(): Promise<PanelHighlight[]> {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/panel-highlights/active`);
  return data.items || [];
}

export async function fetchPanelHighlight(id: string): Promise<PanelHighlight> {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/panel-highlights/${id}`);
  return data.item;
}

export async function fetchAdminPanelHighlights(): Promise<PanelHighlight[]> {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/panel-highlights/admin/list`);
  return data.items || [];
}

export async function createPanelHighlight(body: PanelHighlightInput): Promise<PanelHighlight> {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/panel-highlights/admin`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return data.item;
}

export async function updatePanelHighlight(
  id: string,
  body: Partial<PanelHighlightInput>
): Promise<PanelHighlight> {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/panel-highlights/admin/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return data.item;
}

export async function deletePanelHighlight(id: string): Promise<void> {
  await fetchJson(`${API_CONFIG.BASE_URL}/panel-highlights/admin/${id}`, {
    method: "DELETE",
  });
}

export type ThemeTokens = {
  key: HighlightTheme;
  label: string;
  bannerBg: string;
  text: string;
  muted: string;
  accent: string;
  ctaBg: string;
  ctaText: string;
  detailHero: string;
  detailAccent: string;
};

export const HIGHLIGHT_THEMES: ThemeTokens[] = [
  {
    key: "lavender",
    label: "Lavender",
    bannerBg: "#ede9fe",
    text: "#1e1b4b",
    muted: "#5b5678",
    accent: "#4f46e5",
    ctaBg: "#0f172a",
    ctaText: "#fff",
    detailHero: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #a78bfa 100%)",
    detailAccent: "#4f46e5",
  },
  {
    key: "navy",
    label: "Legend navy",
    bannerBg: "#e8eef6",
    text: "#132E58",
    muted: "#64748b",
    accent: "#132E58",
    ctaBg: "#132E58",
    ctaText: "#fff",
    detailHero: "linear-gradient(135deg, #0c1f3d 0%, #132E58 50%, #1a4a7a 100%)",
    detailAccent: "#132E58",
  },
  {
    key: "gold",
    label: "Gold notice",
    bannerBg: "#fffbeb",
    text: "#78350f",
    muted: "#92400e",
    accent: "#d97706",
    ctaBg: "#0f172a",
    ctaText: "#fff",
    detailHero: "linear-gradient(135deg, #92400e 0%, #d97706 50%, #fbbf24 100%)",
    detailAccent: "#d97706",
  },
  {
    key: "mint",
    label: "Mint",
    bannerBg: "#ecfdf5",
    text: "#064e3b",
    muted: "#047857",
    accent: "#059669",
    ctaBg: "#064e3b",
    ctaText: "#fff",
    detailHero: "linear-gradient(135deg, #064e3b 0%, #059669 55%, #34d399 100%)",
    detailAccent: "#059669",
  },
  {
    key: "rose",
    label: "Rose alert",
    bannerBg: "#fff1f2",
    text: "#881337",
    muted: "#9f1239",
    accent: "#e11d48",
    ctaBg: "#0f172a",
    ctaText: "#fff",
    detailHero: "linear-gradient(135deg, #9f1239 0%, #e11d48 55%, #fb7185 100%)",
    detailAccent: "#e11d48",
  },
  {
    key: "slate",
    label: "Slate",
    bannerBg: "#f1f5f9",
    text: "#0f172a",
    muted: "#475569",
    accent: "#475569",
    ctaBg: "#0f172a",
    ctaText: "#fff",
    detailHero: "linear-gradient(135deg, #0f172a 0%, #334155 55%, #64748b 100%)",
    detailAccent: "#334155",
  },
];

export function getHighlightTheme(theme?: string): ThemeTokens {
  return HIGHLIGHT_THEMES.find((t) => t.key === theme) || HIGHLIGHT_THEMES[0];
}

const dismissKey = (id: string) => `lp_panel_highlight_dismissed_${id}`;

export function isHighlightDismissed(id: string): boolean {
  try {
    return localStorage.getItem(dismissKey(id)) === "1";
  } catch {
    return false;
  }
}

export function dismissHighlight(id: string): void {
  try {
    localStorage.setItem(dismissKey(id), "1");
  } catch {
    /* ignore */
  }
}

export function contentToParagraphs(content: string): string[] {
  return String(content || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}
