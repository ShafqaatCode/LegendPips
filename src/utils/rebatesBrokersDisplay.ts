import type { ApiBroker } from '../services/brokerService';
import { bundledBrokerLogo, normalizeBrokerLogoUrl, resolveBrokerLogoUrl } from './brokerLogoUrl';

/** When API `logoUrl` is empty, use the same bundled assets as legacy brokers_data.tsx */
export const REBATES_BROKER_FALLBACK_LOGOS: Record<string, string> = {
  'IC Market': bundledBrokerLogo('IC Market'),
  'XTREAME Market': bundledBrokerLogo('XTREAME Market'),
  'XM Market': bundledBrokerLogo('XM Market'),
  'EXNESS Market': bundledBrokerLogo('EXNESS Market'),
  'FP Market': bundledBrokerLogo('FP Market'),
  'FOCUS Market': bundledBrokerLogo('FOCUS Market'),
};

export type RebateBrokerCardRow = {
  key: string;
  index: number;
  featured?: boolean;
  title: string;
  description?: string;
  logoSrc: string;
  rating: number;
  reviewsCount: string;
  accountTypes?: ApiBroker['accountTypes'];
  rebateCategory?: ApiBroker['rebateCategory'];
  propOffers?: ApiBroker['propOffers'];
  propPromoCodes?: ApiBroker['propPromoCodes'];
  setupUrl?: string;
  temporarilyDisabled?: boolean;
};

function fallbackLogoAsset(name?: string): string | undefined {
  return bundledBrokerLogo(name) || undefined;
}

export function mapApiBrokerToRebateCardRow(b: ApiBroker): RebateBrokerCardRow {
  const logoSrc =
    resolveBrokerLogoUrl(b.logoUrl, b.name, { preferBundled: true }) ||
    fallbackLogoAsset(b.name) ||
    normalizeBrokerLogoUrl(b.logoUrl) ||
    bundledBrokerLogo('IC Market');
  const liveCount = b.reviewStats?.count || 0;
  const rating = liveCount
    ? Math.round(b.reviewStats?.average || 0)
    : b.rebatesStarRating ?? 4;
  const reviewsCount = liveCount
    ? `${liveCount}`
    : b.rebatesReviewsLabel?.trim() || '—';
  const index = b.rebatesListOrder ?? b.sortOrder ?? 1;
  return {
    key: b._id,
    index,
    featured: b.rebatesFeatured ?? !!b.topCashback,
    title: b.name,
    description: b.description,
    logoSrc,
    rating,
    reviewsCount,
    accountTypes: b.accountTypes?.length ? b.accountTypes : undefined,
    rebateCategory: b.rebateCategory,
    propOffers: b.propOffers,
    propPromoCodes: b.propPromoCodes,
    setupUrl: b.setupUrl,
    temporarilyDisabled: !!b.temporarilyDisabled,
  };
}

/** Featured / top-cashback brokers first, then list order. */
export function sortBrokersFeaturedFirst<T extends { featured?: boolean; index?: number; title?: string }>(
  rows: T[]
): T[] {
  return [...rows].sort((a, b) => {
    const af = a.featured ? 1 : 0;
    const bf = b.featured ? 1 : 0;
    if (bf !== af) return bf - af;
    const ai = a.index ?? 0;
    const bi = b.index ?? 0;
    if (ai !== bi) return ai - bi;
    return String(a.title || "").localeCompare(String(b.title || ""));
  });
}

export function sortApiBrokersFeaturedFirst(items: ApiBroker[]): ApiBroker[] {
  return [...items].sort((a, b) => {
    const af = a.rebatesFeatured || a.topCashback ? 1 : 0;
    const bf = b.rebatesFeatured || b.topCashback ? 1 : 0;
    if (bf !== af) return bf - af;
    const ao = a.rebatesListOrder ?? a.sortOrder ?? 0;
    const bo = b.rebatesListOrder ?? b.sortOrder ?? 0;
    if (ao !== bo) return ao - bo;
    return String(a.name || "").localeCompare(String(b.name || ""));
  });
}
