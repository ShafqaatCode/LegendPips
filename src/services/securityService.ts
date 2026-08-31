import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

export type TotpStatus = {
  enabled: boolean;
  enabledAt?: string | null;
  hasPendingSetup?: boolean;
};

export type TotpSetup = {
  secret: string;
  otpauthUrl: string;
  qrDataUrl: string;
  enabled: boolean;
};

export type AuditLogRow = {
  id: string;
  actorId: string | null;
  actorEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  ip: string;
  userAgent: string;
  meta: Record<string, unknown>;
  createdAt: string;
};

export async function fetchTotpStatus(): Promise<TotpStatus> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/me/2fa`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load 2FA status");
  return data;
}

export async function setupTotp(): Promise<TotpSetup> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/me/2fa/setup`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to start 2FA setup");
  return data;
}

export async function enableTotp(code: string): Promise<{ enabled: boolean }> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/me/2fa/enable`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ code }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to enable 2FA");
  return data;
}

export async function disableTotp(code: string): Promise<{ enabled: boolean }> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/me/2fa/disable`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ code }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to disable 2FA");
  return data;
}

export async function fetchAdminAuditLogs(opts?: {
  page?: number;
  limit?: number;
  action?: string;
  actorEmail?: string;
}) {
  const qs = new URLSearchParams();
  qs.set("page", String(opts?.page || 1));
  qs.set("limit", String(opts?.limit || 30));
  if (opts?.action) qs.set("action", opts.action);
  if (opts?.actorEmail) qs.set("actorEmail", opts.actorEmail);
  const res = await fetch(`${API_CONFIG.BASE_URL}/admin/audit-logs?${qs}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load audit logs");
  return data as {
    success: boolean;
    items: AuditLogRow[];
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
