/**
 * Client-side mirror of backend contentSafety — block emails / phone numbers before submit.
 */

const EMAIL_RE =
  /(?:[a-z0-9](?:[a-z0-9._%+-]*[a-z0-9])?)@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}/i;

const PHONE_RE =
  /(?:(?:\+|00)\d{1,3}[\s./-]*)?(?:\(?\d{2,4}\)?[\s./-]*){2,}\d{2,4}(?:\s*(?:ext|x|extension)\.?\s*\d{1,6})?/i;

const DIGIT_RUN_RE = /(?:\d[\s().-]*){7,}\d/;

const OBFUSCATED_EMAIL_RE =
  /[a-z0-9._%+-]+\s*(?:\[|\()\s*at\s*(?:\]|\))\s*[a-z0-9.-]+\s*(?:\[|\()\s*dot\s*(?:\]|\))\s*[a-z]{2,}/i;

const WHATSAPP_LINK_RE =
  /(?:wa\.me|whatsapp\.com|api\.whatsapp\.com)\/\+?\d{7,}/i;

const TEL_LINK_RE = /tel:\+?\d[\d\s().-]{6,}\d/i;

export type ContentSafetyResult =
  | { ok: true }
  | { ok: false; reason: string; code: "email" | "phone" };

export function assertSafeCommunityText(raw: string): ContentSafetyResult {
  const text = String(raw || "");
  if (!text.trim()) return { ok: true };

  if (EMAIL_RE.test(text) || OBFUSCATED_EMAIL_RE.test(text)) {
    return {
      ok: false,
      code: "email",
      reason:
        "Sharing email addresses is not allowed in the community. Remove any email and try again.",
    };
  }

  if (WHATSAPP_LINK_RE.test(text) || TEL_LINK_RE.test(text)) {
    return {
      ok: false,
      code: "phone",
      reason:
        "Sharing phone or WhatsApp contact links is not allowed. Remove contact details and try again.",
    };
  }

  if (PHONE_RE.test(text) || DIGIT_RUN_RE.test(text)) {
    const digitCount = (text.match(/\d/g) || []).length;
    if (digitCount >= 7) {
      return {
        ok: false,
        code: "phone",
        reason:
          "Sharing phone numbers is not allowed in the community. Remove any phone number and try again.",
      };
    }
  }

  return { ok: true };
}

export function findContentSafetyIssue(raw: string): string | null {
  const r = assertSafeCommunityText(raw);
  return r.ok ? null : r.reason;
}

export function getThreadShareUrl(threadId: string): string {
  if (typeof window === "undefined") return `/forum/thread/${threadId}`;
  return `${window.location.origin}/forum/thread/${threadId}`;
}

export function getSharePayload(title: string, threadId: string) {
  const url = getThreadShareUrl(threadId);
  const text = `${title}\n\n${url}`;
  return { url, text, title };
}

export function openWhatsAppShare(title: string, threadId: string) {
  const { text } = getSharePayload(title, threadId);
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
}

export function openFacebookShare(threadId: string) {
  const url = getThreadShareUrl(threadId);
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    "_blank",
    "noopener,noreferrer"
  );
}

export function openXShare(title: string, threadId: string) {
  const { url, title: t } = getSharePayload(title, threadId);
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(url)}`,
    "_blank",
    "noopener,noreferrer"
  );
}

export function openTelegramShare(title: string, threadId: string) {
  const { url, text } = getSharePayload(title, threadId);
  window.open(
    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener,noreferrer"
  );
}

/** Prefer native share sheet (mobile); falls back to false so UI can show menu. */
export async function nativeSharePost(title: string, threadId: string): Promise<boolean> {
  const { url, text } = getSharePayload(title, threadId);
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export async function copyShareLink(threadId: string): Promise<boolean> {
  const url = getThreadShareUrl(threadId);
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}
