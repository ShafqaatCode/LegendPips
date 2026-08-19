const KEY = "lp-compare-ids";
const MAX = 4;
const EVENT = "lp-compare-change";

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(arr)) return [];
    return [...new Set(arr.map((x) => String(x)).filter(Boolean))].slice(0, MAX);
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids.slice(0, MAX)));
  window.dispatchEvent(new CustomEvent(EVENT, { detail: ids }));
}

export function getCompareIds(): string[] {
  return read();
}

export function isInCompare(id: string): boolean {
  return read().includes(id);
}

export function toggleCompareId(id: string): { ids: string[]; added: boolean; error?: string } {
  const ids = read();
  if (ids.includes(id)) {
    const next = ids.filter((x) => x !== id);
    write(next);
    return { ids: next, added: false };
  }
  if (ids.length >= MAX) {
    return { ids, added: false, error: `You can compare up to ${MAX} brokers.` };
  }
  const next = [...ids, id];
  write(next);
  return { ids: next, added: true };
}

export function setCompareIds(next: string[]) {
  write([...new Set(next.map((x) => String(x).trim()).filter(Boolean))].slice(0, MAX));
}

export function clearCompareIds() {
  write([]);
}

export function comparePath(ids = read()): string {
  return ids.length ? `/compare?ids=${ids.join(",")}` : "/compare";
}

export function subscribeCompare(cb: (ids: string[]) => void) {
  const handler = () => cb(read());
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
