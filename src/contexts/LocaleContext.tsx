import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MESSAGES } from "../i18n/catalog";
import { PAGE_COPY } from "../i18n/pages";
import { PANEL_COPY } from "../i18n/panels";
import type { Messages } from "../i18n/en";
import {
  DEFAULT_LOCALE,
  detectBrowserLocale,
  isLocaleCode,
  localeMeta,
  LOCALE_STORAGE_KEY,
  ROUTE_NAV_KEY,
  type LocaleCode,
} from "../i18n/locales";

type NestedKey = string;

function readPath(obj: unknown, path: string): string | undefined {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === "string" ? cur : undefined;
}

type LocaleContextValue = {
  locale: LocaleCode;
  dir: "ltr" | "rtl";
  setLocale: (code: LocaleCode) => void;
  t: (key: NestedKey, vars?: Record<string, string | number>) => string;
  labelForPath: (path: string, fallback: string) => string;
  messages: Messages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function applyDocumentLocale(code: LocaleCode) {
  const meta = localeMeta(code);
  document.documentElement.lang = code;
  document.documentElement.dir = meta.dir;
}

function loadInitial(): LocaleCode {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY) || "";
    if (isLocaleCode(stored)) return stored;
  } catch {
    /* ignore */
  }
  return detectBrowserLocale();
}

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<LocaleCode>(loadInitial);

  useEffect(() => {
    applyDocumentLocale(locale);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
  }, [locale]);

  const setLocale = useCallback((code: LocaleCode) => {
    setLocaleState(code);
  }, []);

  const messages = MESSAGES[locale] || MESSAGES.en;

  const t = useCallback(
    (key: NestedKey, vars?: Record<string, string | number>) => {
      let str =
        readPath(messages, key) ||
        readPath(PAGE_COPY[locale], key) ||
        readPath({ panel: PANEL_COPY[locale] }, key) ||
        readPath(PAGE_COPY.en, key) ||
        readPath({ panel: PANEL_COPY.en }, key) ||
        readPath(MESSAGES.en, key) ||
        key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return str;
    },
    [messages, locale]
  );

  const labelForPath = useCallback(
    (path: string, fallback: string) => {
      const navKey = ROUTE_NAV_KEY[path];
      if (!navKey) return fallback;
      return t(`nav.${navKey}`);
    },
    [t]
  );

  const value = useMemo(
    () => ({
      locale,
      dir: localeMeta(locale).dir,
      setLocale,
      t,
      labelForPath,
      messages,
    }),
    [locale, setLocale, t, labelForPath, messages]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
