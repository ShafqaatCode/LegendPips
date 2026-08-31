import CashIcon from "../assets/icons/cashback.svg";
import GiftIcon from "../assets/icons/badge2.svg";
import Flag3 from "../assets/FlagIcons/Rectangle 34625471-2.png";
import Flag4 from "../assets/FlagIcons/Rectangle 34625472-2.png";

export type RewardId = "cash" | "gift" | "international" | "national";

export type RewardDetail = {
  id: RewardId;
  title: string;
  shortTitle: string;
  iconSrc: string;
  teaser: string;
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  highlights: { label: string; value: string }[];
  howItWorks: { step: string; title: string; body: string }[];
  benefits: string[];
  eligibility: string[];
  examples: { title: string; body: string }[];
  faq: { q: string; a: string }[];
  ctaLine: string;
};

export const REWARD_DETAILS: Record<RewardId, RewardDetail> = {
  cash: {
    id: "cash",
    title: "Cash Rewards",
    shortTitle: "Cash",
    iconSrc: CashIcon,
    teaser:
      "Earn cash rewards on your everyday trades with supported brokers. Enjoy transparent earnings with no hidden fees—just real rewards that grow with every move you make.",
    heroKicker: "Exclusive Rewards",
    heroTitle: "Turn every trade into cash back",
    heroSubtitle:
      "Link your account through LegendPips, trade normally, and watch cash rewards stack with every eligible lot—clear tracking, fair rates, and payouts you can actually use.",
    highlights: [
      { label: "Payout style", value: "Cash / rebate credit" },
      { label: "Tracking", value: "Live lot tracking" },
      { label: "Fees", value: "No hidden cuts" },
      { label: "Best for", value: "Active day traders" },
    ],
    howItWorks: [
      {
        step: "01",
        title: "Connect via our IB",
        body: "Open or switch your trading account through the LegendPips introducing broker so every lot is attributed correctly.",
      },
      {
        step: "02",
        title: "Trade as usual",
        body: "Keep your strategy. Eligible closed lots on supported brokers automatically count toward your cash reward balance.",
      },
      {
        step: "03",
        title: "Watch rewards grow",
        body: "Your dashboard shows accumulated cash rewards in near real time so you always know where you stand.",
      },
      {
        step: "04",
        title: "Claim or withdraw",
        body: "Once you hit the minimum threshold and pass verification, request a payout or apply credit toward platform perks.",
      },
    ],
    benefits: [
      "Transparent cash rates published per broker and instrument class",
      "No need to change your trading style—rewards follow eligible volume",
      "Combined with LegendPips points for double upside on the same lots",
      "Monthly summary emails so you never miss a credit",
      "Priority support for payout and IB linkage questions",
    ],
    eligibility: [
      "Account must be linked through the LegendPips IB path",
      "Member profile verified (KYC complete where required)",
      "Only live accounts on supported brokers count—demo volume is excluded",
      "Hedging or abusive trading patterns may void reward eligibility",
    ],
    examples: [
      {
        title: "Steady scalper",
        body: "A member trading 8–12 lots/week on majors can build meaningful cash credits each month without changing risk rules.",
      },
      {
        title: "Swing trader",
        body: "Lower frequency, larger size—still earns cash on closed eligible lots while stacking toward gift and tour milestones.",
      },
    ],
    faq: [
      {
        q: "When do cash rewards appear?",
        a: "Most brokers report volume within 24–48 hours. Credits show once lots are confirmed closed and eligible.",
      },
      {
        q: "Can I combine cash with other rewards?",
        a: "Yes. Cash rewards run alongside gift drops, tour invites, and LegendPips points when you meet each program’s rules.",
      },
      {
        q: "Is there a minimum withdrawal?",
        a: "A small minimum applies (shown in your rewards wallet) to keep payouts efficient. You can keep accruing until you hit it.",
      },
    ],
    ctaLine: "Start trading and earn cash on every eligible lot.",
  },
  gift: {
    id: "gift",
    title: "Gift Rewards",
    shortTitle: "Gifts",
    iconSrc: GiftIcon,
    teaser:
      "Unlock bonus gift rewards and exclusive offers designed to upgrade your trading experience. Expect special drops and tailored bonuses that keep momentum high.",
    heroKicker: "Exclusive Rewards",
    heroTitle: "Unlock gifts that level up your trading",
    heroSubtitle:
      "Hit lot milestones and seasonal campaigns to claim curated gifts—signal packs, education access, gear, and partner bonuses built for active LegendPips members.",
    highlights: [
      { label: "Unlock at", value: "100+ lots milestone" },
      { label: "Drops", value: "Seasonal + surprise" },
      { label: "Catalog", value: "Rotating offers" },
      { label: "Best for", value: "Milestone grinders" },
    ],
    howItWorks: [
      {
        step: "01",
        title: "Join the rewards club",
        body: "Activate your member profile and link your IB account so progress toward gift tiers is tracked automatically.",
      },
      {
        step: "02",
        title: "Hit the milestone",
        body: "Accumulate eligible lots. The core gift unlock starts at 100 lots, with higher tiers for bigger catalogs.",
      },
      {
        step: "03",
        title: "Pick from the drop",
        body: "When you qualify, choose from the current gift catalog—signals, courses, merch, or partner vouchers.",
      },
      {
        step: "04",
        title: "Claim & enjoy",
        body: "Confirm delivery details in your dashboard. Digital gifts unlock instantly; physical gifts ship after verification.",
      },
    ],
    benefits: [
      "Curated gifts that actually help traders—not random clutter",
      "Seasonal limited drops to reward consistent activity",
      "Tier upgrades unlock better catalog options",
      "Referral boosts can accelerate gift eligibility",
      "Combine with cash rewards so volume works twice as hard",
    ],
    eligibility: [
      "Verified LegendPips member with linked IB trading account",
      "Minimum lot milestone reached within the active campaign window",
      "One gift claim per milestone tier unless stated otherwise",
      "Shipping available in supported regions for physical gifts",
    ],
    examples: [
      {
        title: "Signals booster pack",
        body: "After 100 lots, claim a limited premium signals window to sharpen entries while you keep grinding higher tiers.",
      },
      {
        title: "Education voucher",
        body: "Redeem toward academy modules or a live webinar seat reserved for reward members only.",
      },
    ],
    faq: [
      {
        q: "Do unused gifts expire?",
        a: "Digital gifts usually have a claim window shown in the catalog. Claim early so you don’t miss limited drops.",
      },
      {
        q: "Can I gift my reward to someone else?",
        a: "Most rewards are non-transferable and tied to your verified account for fairness.",
      },
      {
        q: "What if my preferred gift is out of stock?",
        a: "You’ll see alternates in the same tier. Catalogs refresh regularly with new partner offers.",
      },
    ],
    ctaLine: "Trade to 100 lots and unlock your first gift drop.",
  },
  international: {
    id: "international",
    title: "International Tours",
    shortTitle: "International",
    iconSrc: Flag3,
    teaser:
      "Explore international promotions and event-driven reward drops. Discover new opportunities and participate in global experiences designed to celebrate great trading.",
    heroKicker: "Exclusive Rewards",
    heroTitle: "Earn your seat on global trading tours",
    heroSubtitle:
      "Top performers and campaign winners join LegendPips international experiences—networking events, market meetups, and destination rewards that celebrate serious trading.",
    highlights: [
      { label: "Format", value: "Invite + contest" },
      { label: "Frequency", value: "Seasonal campaigns" },
      { label: "Coverage", value: "Travel package*" },
      { label: "Best for", value: "Top performers" },
    ],
    howItWorks: [
      {
        step: "01",
        title: "Enter the campaign",
        body: "International tour seasons open with clear lot targets, ranking rules, and registration deadlines on the rewards hub.",
      },
      {
        step: "02",
        title: "Compete fairly",
        body: "Eligible live volume, consistency scores, and fair-play checks determine shortlists. No demo or abusive volume.",
      },
      {
        step: "03",
        title: "Get selected",
        body: "Finalists are announced publicly. Winners complete passport, visa, and compliance steps with our events team.",
      },
      {
        step: "04",
        title: "Travel & connect",
        body: "Join the tour itinerary—market sessions, broker partners, and LegendPips community nights abroad.",
      },
    ],
    benefits: [
      "Once-in-a-season experiences you can’t buy in the regular catalog",
      "Network with top traders and LegendPips partners internationally",
      "Package typically includes core travel components for winners*",
      "Media features and community recognition for standout members",
      "Motivates long-term volume goals beyond monthly cash rewards",
    ],
    eligibility: [
      "Active verified member in good standing",
      "Meet campaign lot / ranking thresholds published each season",
      "Valid travel documents and ability to attend on scheduled dates",
      "Fair-play review passed; violations void invitations",
    ],
    examples: [
      {
        title: "Regional finance hub meetup",
        body: "A compact tour focused on broker partners, live market panels, and exclusive member dinners in a major trading city.",
      },
      {
        title: "Destination celebration",
        body: "High-tier winners join a multi-day itinerary combining education workshops with curated sightseeing rewards.",
      },
    ],
    faq: [
      {
        q: "Who pays for flights and hotels?",
        a: "Each campaign lists covered items. Core packages for winners are sponsored; optional upgrades may be self-paid.",
      },
      {
        q: "Can guests join?",
        a: "Guest policies vary by trip. If allowed, guest costs and deadlines appear in the winner briefing.",
      },
      {
        q: "What if I can’t travel that dates?",
        a: "You may be offered a substitute reward of comparable value when the campaign rules allow it.",
      },
    ],
    ctaLine: "Push your ranking this season—international seats are limited.",
  },
  national: {
    id: "national",
    title: "National Tours",
    shortTitle: "National",
    iconSrc: Flag4,
    teaser:
      "Rewards designed for local engagement—join community events, unlock exciting bonuses, and be part of trading experiences crafted for your region.",
    heroKicker: "Exclusive Rewards",
    heroTitle: "Win local tours built for your region",
    heroSubtitle:
      "National tours bring LegendPips experiences closer to home—city meetups, regional competitions, and community celebrations for members who trade and engage locally.",
    highlights: [
      { label: "Format", value: "Regional events" },
      { label: "Access", value: "Easier entry vs intl" },
      { label: "Focus", value: "Community + bonuses" },
      { label: "Best for", value: "Local champions" },
    ],
    howItWorks: [
      {
        step: "01",
        title: "Follow your region’s calendar",
        body: "National tour windows and city stops are posted on the rewards page and in member notifications.",
      },
      {
        step: "02",
        title: "Qualify locally",
        body: "Hit region-specific lot goals or win local contests. Thresholds are designed to be more accessible than international tours.",
      },
      {
        step: "03",
        title: "Confirm your seat",
        body: "Accepted members RSVP, complete verification, and receive venue details and agenda packs.",
      },
      {
        step: "04",
        title: "Show up & level up",
        body: "Attend workshops, live trade reviews, partner booths, and exclusive local reward giveaways.",
      },
    ],
    benefits: [
      "Lower travel burden—events near major cities in your country",
      "Face-to-face learning with LegendPips educators and peers",
      "On-site bonus drops and partner gift tables",
      "Pathway to international shortlists for standout attendees",
      "Strengthen your local trading network",
    ],
    eligibility: [
      "Residence or trading base in the campaign’s target country/region",
      "Verified member with linked IB account",
      "Meet published lot or contest criteria for that national season",
      "Agree to community code of conduct at events",
    ],
    examples: [
      {
        title: "Capital city trader day",
        body: "A full-day agenda: market outlook, live analysis, broker desks, and evening networking for qualified members.",
      },
      {
        title: "Coastal weekend meetup",
        body: "Compact regional reward trip combining education sessions with a community celebration for top local volume.",
      },
    ],
    faq: [
      {
        q: "Are national tours free?",
        a: "Qualified seats are complimentary for winners/invitees. Optional add-ons may carry a fee if listed.",
      },
      {
        q: "Do national lots count toward international tours?",
        a: "Yes—eligible volume generally stacks across programs, though each tour has its own ranking cutoffs.",
      },
      {
        q: "How do I know my region is active?",
        a: "Check the rewards hub calendar or enable notifications—new cities are announced ahead of each season.",
      },
    ],
    ctaLine: "Qualify for your next national meetup and meet traders near you.",
  },
};

export const REWARD_LIST = Object.values(REWARD_DETAILS);

export function getRewardDetail(id: string | undefined): RewardDetail | null {
  if (!id) return null;
  return REWARD_DETAILS[id as RewardId] ?? null;
}
