import React, { useEffect, useRef } from "react";
import { useLocale } from "../../contexts/LocaleContext";
import { looksLikeSourceEnglish, translateBatch } from "../../services/translateService";
import type { LocaleCode } from "../../i18n/locales";

const originals = new WeakMap<Text, string>();

function shouldSkipElement(el: Element | null): boolean {
  if (!el) return true;
  if (el.closest(".notranslate, [data-no-auto-translate], script, style, noscript, code, pre, textarea, input, select, option, [contenteditable='true']")) {
    return true;
  }
  return false;
}

function collectTextNodes(root: HTMLElement): Text[] {
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = (node as Text).parentElement;
      if (shouldSkipElement(parent)) return NodeFilter.FILTER_REJECT;
      const value = node.textContent || "";
      if (!value.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let current: Node | null;
  while ((current = walker.nextNode())) {
    nodes.push(current as Text);
  }
  return nodes;
}

function restoreEnglish(root: HTMLElement) {
  const nodes = collectTextNodes(root);
  for (const node of nodes) {
    const orig = originals.get(node);
    if (orig != null && node.textContent !== orig) {
      node.textContent = orig;
    }
  }
}

async function applyLocale(root: HTMLElement, locale: LocaleCode, cancelled: () => boolean) {
  if (locale === "en") {
    restoreEnglish(root);
    return;
  }

  const nodes = collectTextNodes(root);
  const payloads: { node: Text; source: string }[] = [];

  for (const node of nodes) {
    if (!originals.has(node)) {
      originals.set(node, node.textContent || "");
    }
    const source = originals.get(node) || node.textContent || "";
    if (!looksLikeSourceEnglish(source)) continue;
    payloads.push({ node, source });
  }

  if (!payloads.length || cancelled()) return;

  const CHUNK = 30;
  for (let i = 0; i < payloads.length; i += CHUNK) {
    if (cancelled()) return;
    const slice = payloads.slice(i, i + CHUNK);
    const translated = await translateBatch(
      slice.map((p) => p.source),
      locale,
      "en"
    );
    if (cancelled()) return;
    slice.forEach((p, j) => {
      // Only update if DOM text still matches expected source or current translation attempt
      const live = p.node.textContent || "";
      const expected = originals.get(p.node) || p.source;
      if (live === expected || live === p.source || !looksLikeSourceEnglish(live)) {
        if (translated[j] && translated[j] !== live) {
          p.node.textContent = translated[j];
        }
      }
    });
  }
}

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Dynamically translates leftover English (UI + API/CMS text) inside this subtree
 * when the active locale is not English. Skips `.notranslate` regions (header/footer chrome).
 */
const AutoTranslateRoot: React.FC<Props> = ({ children, className }) => {
  const { locale } = useLocale();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runId = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    const myRun = ++runId.current;

    const schedule = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (cancelled || myRun !== runId.current) return;
        void applyLocale(root, locale, () => cancelled || myRun !== runId.current);
      }, 350);
    };

    schedule();

    // childList covers React remounts; characterData covers text-only updates from API/CMS.
    // Debounced applyLocale skips already-translated nodes (non-Latin), so MO feedback stays cheap.
    const mo = new MutationObserver(() => schedule());
    mo.observe(root, { childList: true, subtree: true, characterData: true });

    return () => {
      cancelled = true;
      mo.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [locale]);

  return (
    <div ref={rootRef} className={className} data-lp-auto-translate="">
      {children}
    </div>
  );
};

export default AutoTranslateRoot;
