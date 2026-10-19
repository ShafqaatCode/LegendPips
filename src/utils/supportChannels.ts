/** Public support contact channels (WhatsApp / community / email). */
export const SUPPORT_EMAIL = "support@legendpips.com";
export const SUPPORT_EMAIL_URL = `mailto:${SUPPORT_EMAIL}`;

/** Optional Telegram / Discord community — set in env for production. */
export const DISCUSSION_GROUP_URL =
  (typeof import.meta !== "undefined" &&
    String((import.meta as ImportMeta).env?.VITE_DISCUSSION_GROUP_URL || "").trim()) ||
  "/forum";

export const DISCUSSION_GROUP_IS_EXTERNAL = /^https?:\/\//i.test(DISCUSSION_GROUP_URL);

/** Official Telegram support / announcements. Override with VITE_TELEGRAM_SUPPORT_URL. */
export const TELEGRAM_SUPPORT_URL =
  (typeof import.meta !== "undefined" &&
    String((import.meta as ImportMeta).env?.VITE_TELEGRAM_SUPPORT_URL || "").trim()) ||
  "https://t.me/legendpips";
