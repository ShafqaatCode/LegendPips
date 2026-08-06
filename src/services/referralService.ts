import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

export type ReferralTemplate = {
  id: string;
  title: string;
  shortDescription: string;
  subjectPreview: string;
  bodyPreview: string;
};

export type ReferralInviteRow = {
  id: string;
  toEmail: string;
  templateId: string;
  subject: string;
  friendName?: string;
  createdAt?: string;
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

export async function fetchReferralTemplates(): Promise<ReferralTemplate[]> {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/me/referrals/templates`);
  return data.templates || [];
}

export async function fetchMyReferralInvites(): Promise<ReferralInviteRow[]> {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/me/referrals`);
  return data.items || [];
}

export async function sendReferralInvite(payload: {
  toEmail: string;
  templateId: string;
  friendName?: string;
}): Promise<{ message: string; toEmail: string; subject: string }> {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/me/referrals/send`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return {
    message: data.message || "Invitation sent",
    toEmail: data.toEmail,
    subject: data.subject,
  };
}
