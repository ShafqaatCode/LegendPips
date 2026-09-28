declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: (momentListener?: (notification: GooglePromptNotification) => void) => void;
          renderButton: (parent: HTMLElement, config: Record<string, unknown>) => void;
          cancel: () => void;
        };
      };
    };
  }
}

type GooglePromptNotification = {
  isNotDisplayed?: () => boolean;
  isSkippedMoment?: () => boolean;
  isDismissedMoment?: () => boolean;
};

const GIS_SRC = "https://accounts.google.com/gsi/client";

export const getGoogleClientId = (): string =>
  String(import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim();

export const isGoogleSignInConfigured = (): boolean => Boolean(getGoogleClientId());

let scriptPromise: Promise<void> | null = null;

export const loadGoogleIdentityScript = (): Promise<void> => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Sign-In is only available in the browser."));
  }
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GIS_SRC}"]`) as HTMLScriptElement | null;
    if (existing) {
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => {
          scriptPromise = null;
          reject(new Error("Failed to load Google Sign-In"));
        },
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load Google Sign-In"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
};

/**
 * Opens Google Identity Services (popup / One Tap) and returns an ID token (JWT).
 */
export const requestGoogleIdToken = async (): Promise<string> => {
  const clientId = getGoogleClientId();
  if (!clientId) {
    throw new Error(
      "Google Sign-In is not configured. Add VITE_GOOGLE_CLIENT_ID to your environment."
    );
  }

  await loadGoogleIdentityScript();
  if (!window.google?.accounts?.id) {
    throw new Error("Google Sign-In failed to initialize.");
  }

  return new Promise<string>((resolve, reject) => {
    let settled = false;
    const container = document.createElement("div");
    container.setAttribute("aria-hidden", "true");
    container.style.cssText =
      "position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;";
    document.body.appendChild(container);

    const finish = (err: Error | null, token?: string) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      try {
        window.google?.accounts.id.cancel();
      } catch {
        /* ignore */
      }
      try {
        container.remove();
      } catch {
        /* ignore */
      }
      if (err) reject(err);
      else resolve(token as string);
    };

    const timeoutId = window.setTimeout(() => {
      finish(new Error("Google Sign-In timed out. Please try again."));
    }, 120_000);

    window.google!.accounts.id.initialize({
      client_id: clientId,
      callback: (response: { credential?: string }) => {
        if (response?.credential) finish(null, response.credential);
        else finish(new Error("Google did not return a credential."));
      },
      auto_select: false,
      cancel_on_tap_outside: true,
      context: "signin",
      ux_mode: "popup",
    });

    window.google!.accounts.id.renderButton(container, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      width: 280,
    });

    requestAnimationFrame(() => {
      const btn = container.querySelector('div[role="button"]') as HTMLElement | null;
      if (btn) {
        btn.click();
        return;
      }

      window.google!.accounts.id.prompt((notification) => {
        if (
          notification?.isNotDisplayed?.() ||
          notification?.isSkippedMoment?.() ||
          notification?.isDismissedMoment?.()
        ) {
          finish(
            new Error(
              "Google Sign-In was cancelled or blocked. Allow popups and ensure this site origin is listed in Google Cloud Console."
            )
          );
        }
      });
    });
  });
};
