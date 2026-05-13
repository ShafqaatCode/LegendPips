import type { ApiBroker } from '../services/brokerService';
import ICLogo from '../assets/icons/Ellipse 2.png';
import XtremeLogo from '../assets/TradeMarketBrands/Ellipse 2.png';
import XmLogo from '../assets/TradeMarketBrands/Ellipse 2-1.png';
import ExnessLogo from '../assets/TradeMarketBrands/Ellipse 2-2.png';
import FpLogo from '../assets/TradeMarketBrands/Ellipse 2-3.png';
import FocusLogo from '../assets/TradeMarketBrands/Ellipse 1.png';

/** When API `logoUrl` is empty, use the same bundled assets as legacy brokers_data.tsx */
export const REBATES_BROKER_FALLBACK_LOGOS: Record<string, string> = {
  'IC Market': ICLogo,
  'XTREAME Market': XtremeLogo,
  'XM Market': XmLogo,
  'EXNESS Market': ExnessLogo,
  'FP Market': FpLogo,
  'FOCUS Market': FocusLogo,
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
};

export function mapApiBrokerToRebateCardRow(b: ApiBroker): RebateBrokerCardRow {
  const logoSrc = (b.logoUrl && b.logoUrl.trim()) || REBATES_BROKER_FALLBACK_LOGOS[b.name] || ICLogo;
  const rating = b.rebatesStarRating ?? 4;
  const reviewsCount = b.rebatesReviewsLabel?.trim() || '—';
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
  };
}
