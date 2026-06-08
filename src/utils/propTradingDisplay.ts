import type { PropCashbackOffer } from "../services/brokerService";

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
