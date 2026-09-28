// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : "https://legendpips.com/api");

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 10000,
};

export const SESSION_EXPIRED_EVENT = "auth:session-expired";

/** Auth endpoints that may return 401 for bad credentials — do not treat as session expiry. */
const AUTH_EXEMPT_SUFFIXES = [
  "/login/2fa",
  "/login/google",
  "/login",
  "/register/send-otp",
  "/register",
  "/forgot-password",
  "/reset-password",
];

let sessionLogoutInProgress = false;

// Helper function to get auth token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem("token", token);
};

// Helper function to remove auth token
export const removeAuthToken = (): void => {
  localStorage.removeItem("token");
};

/** Clear local session and hard-navigate home so protected UI cannot linger. */
export function forceSessionLogout(redirectTo: string = "/"): void {
  if (sessionLogoutInProgress) return;
  sessionLogoutInProgress = true;

  // If admin was viewing as a user, restore admin instead of a full logout.
  const adminToken = localStorage.getItem("adminSessionToken");
  const adminUser = localStorage.getItem("adminSessionUser");
  if (adminToken && adminUser) {
    localStorage.setItem("token", adminToken);
    localStorage.setItem("user", adminUser);
    localStorage.removeItem("adminSessionToken");
    localStorage.removeItem("adminSessionUser");
    window.location.replace("/admin-panel");
    return;
  }

  removeAuthToken();
  localStorage.removeItem("user");
  localStorage.removeItem("adminSessionToken");
  localStorage.removeItem("adminSessionUser");

  try {
    window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
  } catch {
    // ignore
  }

  const path = window.location.pathname;
  const alreadyPublic =
    path === "/" ||
    path === "/signin" ||
    path === "/login" ||
    path === "/register" ||
    path === "/signup";

  if (!alreadyPublic) {
    window.location.replace(redirectTo);
  } else {
    sessionLogoutInProgress = false;
  }
}

function resolveRequestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  if (typeof Request !== "undefined" && input instanceof Request) return input.url;
  return String(input);
}

function isOurApiUrl(url: string): boolean {
  const base = API_CONFIG.BASE_URL.replace(/\/$/, "");
  return url.startsWith(base) || url.includes(base);
}

function isAuthExemptUrl(url: string): boolean {
  return AUTH_EXEMPT_SUFFIXES.some((suffix) => {
    const i = url.indexOf(suffix);
    if (i === -1) return false;
    const next = url[i + suffix.length];
    return next === undefined || next === "?" || next === "#" || next === "/";
  });
}

function shouldForceLogoutFromStatus(status: number, message?: string): boolean {
  if (status === 401) return true;
  if (status !== 403) return false;
  const msg = (message || "").toLowerCase();
  return (
    msg === "no token provided" ||
    msg.includes("invalid or expired token") ||
    msg.includes("your account has been blocked")
  );
}

/**
 * Intercept fetch so any expired/invalid API session clears auth and leaves protected pages.
 * Call once at app startup (before React render).
 */
export function installApiAuthInterceptor(): void {
  const w = window as Window & { __lpAuthFetchInstalled?: boolean };
  if (w.__lpAuthFetchInstalled) return;
  w.__lpAuthFetchInstalled = true;

  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const res = await nativeFetch(input, init);
    try {
      const url = resolveRequestUrl(input);
      if (!isOurApiUrl(url) || isAuthExemptUrl(url)) return res;

      if (res.status === 401) {
        forceSessionLogout("/");
        return res;
      }

      if (res.status === 403) {
        const data = (await res.clone().json().catch(() => null)) as { message?: string } | null;
        if (shouldForceLogoutFromStatus(403, data?.message)) {
          forceSessionLogout("/");
        }
      }
    } catch {
      // never break the original response
    }
    return res;
  };
}

/** Throw with API message; on 401/session errors, clears session and redirects home. */
export function assertApiOk(
  response: Response,
  data?: { message?: string },
  fallback = "Request failed"
): void {
  if (shouldForceLogoutFromStatus(response.status, data?.message)) {
    forceSessionLogout("/");
    throw new Error("Session expired");
  }
  if (!response.ok) {
    throw new Error(apiFailureMessage(response, data, fallback));
  }
}

// Helper function to get auth headers
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const getAuthHeadersMultipart = (): HeadersInit => {
  const token = getAuthToken();
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/** Parse API JSON safely; surfaces HTML/error pages as readable errors. */
export async function parseJsonResponse<T = Record<string, unknown>>(
  response: Response
): Promise<T> {
  const text = await response.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    if (response.status === 413) {
      throw new Error(
        "Upload is too large for the server. Your photos were compressed automatically — if this persists, the server nginx limit must be raised (client_max_body_size 25m) and the backend restarted."
      );
    }
    if (response.status === 502 || response.status === 504) {
      throw new Error(
        "The server timed out while uploading your documents. Try again with smaller photos or ask support to increase the proxy timeout."
      );
    }
    if (text.trimStart().startsWith("<!DOCTYPE") || text.trimStart().startsWith("<html")) {
      const hint =
        response.status === 404
          ? "The API route may be missing on the server — pull latest backend, run npm run build, and restart PM2."
          : "If you were uploading KYC documents, the server upload limit is likely too low (nginx client_max_body_size).";
      throw new Error(
        `Server returned an error page instead of JSON (HTTP ${response.status}). ${hint} API base: ${API_CONFIG.BASE_URL}`
      );
    }
    throw new Error("Invalid response from server");
  }
}

/** Prefer this when status has no JSON body (common for nginx/Express empty 404s). */
export function apiFailureMessage(
  response: Response,
  data?: { message?: string },
  fallback = "Request failed"
): string {
  if (data?.message) return data.message;
  if (response.status === 404) {
    return `API route not found (HTTP 404). Production backend needs a redeploy (git pull + npm run build + pm2 restart). API base: ${API_CONFIG.BASE_URL}`;
  }
  if (response.status === 502 || response.status === 504) {
    return "The API server is unreachable or restarting. Try again in a moment.";
  }
  return `${fallback} (HTTP ${response.status})`;
}
