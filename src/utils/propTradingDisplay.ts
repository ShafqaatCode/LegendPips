import type { PropCashbackOffer, PropPromoCode } from "../services/brokerService";

/** Format one prop offer tier like PaybackFX cards. */
export function formatPropOfferLines(offer: PropCashbackOffer): string[] {
  const first = offer.firstPurchaseCashback?.trim();
  const repeat = offer.repeatPurchaseCashback?.trim();
  const discount = offer.discountPercent?.trim();

  if (first && discount && !repeat) {
    return [`${first} Cashback +${discount} Discount`];
  }
  if (first && repeat) {
    const lines: string[] = [`First Purchase ${first} cashback`, `Repeat purchase ${repeat} cashback`];
    if (discount) lines.push(`${discount} Discount`);
    return lines;
  }
  if (first) return [`First Purchase ${first} cashback`];
  if (discount) return [`${discount} Discount`];
  if (repeat) return [`Repeat purchase ${repeat} cashback`];
  return [];
}

/** Single-line summary for prop list cards (e.g. "7% Cashback +15% Discount"). */
export function formatPropCardSummary(offers: PropCashbackOffer[]): string {
  if (!offers?.length) return "See details for cashback rates";
  const lines = formatPropOfferLines(offers[0]);
  if (lines.length === 1) return lines[0];
  return lines.join(" · ");
}

export function formatPropRatingLabel(rating: number, reviewsLabel: string): string {
  const count = reviewsLabel.replace(/[^\d]/g, "") || reviewsLabel;
  const suffix = reviewsLabel.toLowerCase().includes("trader") ? reviewsLabel : `${count} traders`;
  return `Rated ${rating}/5 by ${suffix}`;
}

function cashbackNum(v?: string) {
  const n = parseFloat(String(v || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : -1;
}

/** Prefer the offer with the strongest first-purchase cashback. */
export function pickBestPropOffer(offers?: PropCashbackOffer[]): PropCashbackOffer | undefined {
  if (!offers?.length) return undefined;
  const best = offers.reduce((m, o) => Math.max(m, cashbackNum(o.firstPurchaseCashback)), -1);
  return offers.find((o) => cashbackNum(o.firstPurchaseCashback) === best) || offers[0];
}

export type ResolvedPropDiscount = {
  firstPurchase?: string;
  repeatPurchase?: string;
  discountPercent?: string;
  code?: string;
  codeLabel?: string;
};

/** Resolve cashback + discount % + promo code from offers and firm-level promo codes. */
export function resolvePropDiscount(
  offers?: PropCashbackOffer[],
  promoCodes?: PropPromoCode[]
): ResolvedPropDiscount {
  const top = pickBestPropOffer(offers);
  const activePromo = (promoCodes || []).find((p) => p.active !== false && p.code?.trim());
  const code = top?.discountCode?.trim() || activePromo?.code?.trim() || undefined;
  const discountPercent =
    top?.discountPercent?.trim() ||
    activePromo?.percent?.trim() ||
    undefined;
  return {
    firstPurchase: top?.firstPurchaseCashback?.trim() || undefined,
    repeatPurchase: top?.repeatPurchaseCashback?.trim() || undefined,
    discountPercent,
    code,
    codeLabel: activePromo?.label?.trim() || top?.label || undefined,
  };
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}
