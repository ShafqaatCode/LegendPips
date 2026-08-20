export type LegalDoc = {
  slug: string;
  aliases?: string[];
  title: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
};

export const LEGAL_DISCLAIMER =
  "These pages are informational templates for LegendPips.com. They are not legal advice. Have a qualified lawyer review them before you treat them as binding.";

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "terms",
    aliases: ["/terms"],
    title: "Terms & Conditions",
    updated: "August 2026",
    sections: [
      {
        heading: "Agreement",
        body: [
          "By using LegendPips you agree to these terms. LegendPips is a trader information, cashback matching, education, and community platform. We are not a broker, bank, or investment advisor.",
        ],
      },
      {
        heading: "Accounts",
        body: [
          "You must provide accurate registration details and keep your login secure. We may suspend accounts that abuse reviews, complaints, referrals, or cashback matching.",
        ],
      },
      {
        heading: "Trading risk",
        body: [
          "Forex, crypto, and CFD trading involves substantial risk of loss. Past performance is not a guarantee of future results. You trade with third-party brokers and prop firms, not with LegendPips.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    aliases: ["/privacy"],
    title: "Privacy Policy",
    updated: "August 2026",
    sections: [
      {
        heading: "What we collect",
        body: [
          "Account details, KYC documents you upload, support messages, reviews, complaints, and basic device/IP data used for security and fraud checks.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "To operate the site, verify identity, pay cashback after manual verification, moderate community content, and improve the platform. We do not sell personal data.",
        ],
      },
    ],
  },
  {
    slug: "risk-disclosure",
    title: "Risk Disclosure",
    updated: "August 2026",
    sections: [
      {
        heading: "Loss of capital",
        body: [
          "You can lose some or all of the money you deposit with a broker or pay for a prop challenge. Leverage increases both gains and losses.",
        ],
      },
      {
        heading: "No advice",
        body: [
          "Signals, analysis, calculators, trader profiles, and education are informational. They are not personal recommendations.",
        ],
      },
    ],
  },
  {
    slug: "affiliate-disclosure",
    title: "Affiliate Disclosure",
    updated: "August 2026",
    sections: [
      {
        heading: "Partner links",
        body: [
          "LegendPips may earn IB, affiliate, or advertising revenue when you open an account through our partner links. Cashback we credit to you is separate from that commercial relationship.",
        ],
      },
      {
        heading: "Sponsored listings",
        body: [
          "Paid or featured placements will be marked. Rankings and LegendScore are not sold as a guaranteed #1 position.",
        ],
      },
    ],
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    updated: "August 2026",
    sections: [
      {
        heading: "Cookies we use",
        body: [
          "Essential cookies keep you signed in and remember compare selections. Analytics cookies help us understand traffic if enabled. You can block non-essential cookies in your browser.",
        ],
      },
    ],
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    updated: "August 2026",
    sections: [
      {
        heading: "Platform fees",
        body: [
          "Broker deposits, prop challenge fees, and third-party charges are billed by those providers. LegendPips cannot refund them.",
        ],
      },
      {
        heading: "LegendPips products",
        body: [
          "Paid education or premium signals follow the terms shown at checkout. Contact support if a charge was made in error.",
        ],
      },
    ],
  },
  {
    slug: "cashback-terms",
    title: "Cashback Terms",
    updated: "August 2026",
    sections: [
      {
        heading: "How cashback works",
        body: [
          "Open or fund an account through a LegendPips partner link, then submit verification (live account request). Credits are added after the team confirms the relationship. Lots are not tracked automatically from MT4/MT5 unless a broker feed is later connected.",
        ],
      },
      {
        heading: "Withdrawals",
        body: [
          "Available balance can be requested from My Rebates. Processing times depend on payment method and compliance checks. Churning, hedging abuse, or inverted IB links may void cashback.",
        ],
      },
    ],
  },
  {
    slug: "broker-review-policy",
    title: "Broker Review Policy",
    updated: "August 2026",
    sections: [
      {
        heading: "Moderation",
        body: [
          "Member reviews appear after admin approval. Verified labels are based on KYC status. Duplicate, abusive, or incentivized reviews may be rejected or flagged.",
        ],
      },
    ],
  },
  {
    slug: "complaint-policy",
    title: "Complaint Policy",
    updated: "August 2026",
    sections: [
      {
        heading: "Process",
        body: [
          "Submit a ticket with broker, category, amount, date, and evidence. Status moves from submitted to investigation, broker contacted, broker responded, then resolved or unresolved. Admin may add a public warning or blacklist a catalog broker.",
        ],
      },
    ],
  },
  {
    slug: "content-disclaimer",
    title: "Content Disclaimer",
    updated: "August 2026",
    sections: [
      {
        heading: "User and third-party content",
        body: [
          "Forum posts, reviews, complaints, trader stats, and partner copy are the responsibility of their authors. LegendPips may remove content that breaks community rules.",
        ],
      },
    ],
  },
  {
    slug: "community-rules",
    title: "Community Rules",
    updated: "August 2026",
    sections: [
      {
        heading: "Be fair",
        body: [
          "No scams, guaranteed-profit claims, doxxing, or hate speech. Do not manipulate reviews, complaints, or leaderboards. Repeat abuse can lead to a ban.",
        ],
      },
    ],
  },
];

export function legalDocByParam(param: string) {
  const key = String(param || "").replace(/^\//, "").toLowerCase();
  return (
    LEGAL_DOCS.find((d) => d.slug === key) ||
    LEGAL_DOCS.find((d) => (d.aliases || []).some((a) => a.replace(/^\//, "") === key)) ||
    null
  );
}
