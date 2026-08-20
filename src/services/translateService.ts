import { API_CONFIG } from "../utils/apiConfig";
import type { LocaleCode } from "../i18n/locales";

const CACHE_KEY = "lp-tx-cache-v2";
const memory = new Map<string, string>();

function loadDisk(): void {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw) as Record<string, string>;
    for (const [k, v] of Object.entries(obj)) memory.set(k, v);
  } catch {
    /* ignore */
  }
}

let diskLoaded = false;
function ensureDisk() {
  if (diskLoaded) return;
  diskLoaded = true;
  loadDisk();
}

function persistDisk() {
  try {
    const obj: Record<string, string> = {};
    let n = 0;
    for (const [k, v] of memory) {
      obj[k] = v;
      if (++n >= 800) break;
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
  } catch {
    /* ignore quota */
  }
}

function ck(source: string, target: string, text: string) {
  return `${source}|${target}|${text}`;
}

/** Latin-heavy strings are candidates for auto-translate (skip already-localized Arabic/Urdu UI). */
export function looksLikeSourceEnglish(text: string): boolean {
  const t = text.trim();
  if (t.length < 2) return false;
  if (/^https?:\/\//i.test(t)) return false;
  if (/^[\d\s.,:%$€£+\-/@#]+$/.test(t)) return false;
  if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(t)) return false;
  const latin = (t.match(/[A-Za-z]/g) || []).length;
  const arabic = (t.match(/[\u0600-\u06FF]/g) || []).length;
  const cjk = (t.match(/[\u3040-\u30ff\u3400-\u9fff]/g) || []).length;
  if (arabic + cjk > latin) return false;
  return latin >= 3;
}

export async function translateBatch(
  texts: string[],
  target: LocaleCode,
  source: LocaleCode = "en"
): Promise<string[]> {
  ensureDisk();
  if (target === source || !texts.length) return texts;

  const out = texts.slice();
  const missingIdx: number[] = [];
  const missingTexts: string[] = [];

  texts.forEach((text, i) => {
    if (!looksLikeSourceEnglish(text)) return;
    const hit = memory.get(ck(source, target, text.trim()));
    if (hit != null) {
      out[i] = hit;
      return;
    }
    missingIdx.push(i);
    missingTexts.push(text);
  });

  if (!missingTexts.length) return out;

  const CHUNK = 35;
  for (let offset = 0; offset < missingTexts.length; offset += CHUNK) {
    const slice = missingTexts.slice(offset, offset + CHUNK);
    const idxSlice = missingIdx.slice(offset, offset + CHUNK);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/i18n/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ texts: slice, target, source }),
      });
      if (!res.ok) continue;
      const data = (await res.json()) as { translations?: string[] };
      const translations = data.translations || [];
      translations.forEach((tr, j) => {
        const original = slice[j];
        const i = idxSlice[j];
        if (typeof tr === "string" && tr.length) {
          out[i] = tr;
          memory.set(ck(source, target, original.trim()), tr);
        }
      });
    } catch {
      /* keep originals */
    }
  }

  persistDisk();
  return out;
}

export async function translateText(
  text: string,
  target: LocaleCode,
  source: LocaleCode = "en"
): Promise<string> {
  const [one] = await translateBatch([text], target, source);
  return one;
}
