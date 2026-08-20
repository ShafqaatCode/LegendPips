import React, { useEffect, useState } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import { translateText } from "../../services/translateService";

/** Translate a dynamic/API string into the active locale (cached). */
export function useDynText(text: string): string {
  const { locale } = useLocale();
  const [out, setOut] = useState(text);

  useEffect(() => {
    let cancelled = false;
    if (locale === "en" || !text) {
      setOut(text);
      return;
    }
    setOut(text);
    translateText(text, locale, "en").then((tr) => {
      if (!cancelled) setOut(tr);
    });
    return () => {
      cancelled = true;
    };
  }, [text, locale]);

  return out;
}

export const DynText: React.FC<{ children: string }> = ({ children }) => {
  const translated = useDynText(children);
  return <>{translated}</>;
};
