export type AboutPageKey =
  | "about"
  | "team"
  | "methodology"
  | "careers"
  | "partners"
  | "journalists";

export type AboutSection = {
  heading: string;
  body: string[];
};

export type AboutPageContent = {
  key: AboutPageKey;
  path: string;
  navLabel: string;
  kicker: string;
  title: string;
  lead: string;
  sections: AboutSection[];
  cta?: { label: string; to: string };
};

export const ABOUT_SUBMENU = [
  { to: "/about", label: "About us", end: true },
  { to: "/about/team", label: "The team" },
  { to: "/about/methodology", label: "Our methodology" },
  { to: "/about/careers", label: "Careers" },
  { to: "/about/partners", label: "For partners" },
  { to: "/about/journalists", label: "For journalists" },
] as const;

export const ABOUT_NESTED_PATHS = new Set<string>(ABOUT_SUBMENU.map((i) => i.to));

export const ABOUT_PAGES: Record<Exclude<AboutPageKey, "team">, AboutPageContent> = {
  about: {
    key: "about",
    path: "/about",
    navLabel: "About us",
    kicker: "Behind the scenes",
    title: "About LegendPips",
    lead:
      "LegendPips helps traders compare brokers, earn rebates, follow signals, and stay protected — with clear reviews, education, and human support.",
    sections: [
      {
        heading: "What we do",
        body: [
          "We publish broker comparisons, rebate programs, scam warnings, contests, and learning tools so traders can make clearer decisions before they deposit.",
          "Our product mixes public research pages with a member panel for rebates, complaints, referrals, and account requests.",
        ],
      },
      {
        heading: "How we stay useful",
        body: [
          "We focus on practical detail: regulation signals, cashback terms, complaint patterns, and beginner-friendly broker picks — not hype.",
          "When something looks wrong, we document it. When a partner relationship exists, we disclose it.",
        ],
      },
      {
        heading: "Who we serve",
        body: [
          "New traders looking for safer starting points, active traders hunting rebates and signals, and partners who want transparent IB / affiliate collaboration.",
        ],
      },
    ],
    cta: { label: "Meet the team", to: "/about/team" },
  },
  methodology: {
    key: "methodology",
    path: "/about/methodology",
    navLabel: "Our methodology",
    kicker: "Behind the scenes",
    title: "Our methodology",
    lead:
      "How LegendPips evaluates brokers, ranks beginner-friendly options, and decides what belongs on Scam Broker Shield.",
    sections: [
      {
        heading: "Broker coverage",
        body: [
          "We review regulation mentions, account types, min deposit, platforms, and public complaint history where available.",
          "Rankings and “best for new traders” lists are editorial. They are not paid placements unless clearly labelled as advertising.",
        ],
      },
      {
        heading: "Rebates & partner links",
        body: [
          "Some broker pages include partner / IB links. Opening an account through those links may generate rebate credits for you and commission for LegendPips.",
          "Cashback amounts depend on broker terms and our verification process. We do not invent live MT4/MT5 lot sync unless a feed is connected.",
        ],
      },
      {
        heading: "Scam Broker Shield",
        body: [
          "Brokers can be flagged after complaint patterns, withdrawal issues, fake licensing claims, or other red flags reviewed by the team.",
          "Shield status is a warning tool — always do your own due diligence before funding any account.",
        ],
      },
      {
        heading: "Updates",
        body: [
          "Broker data and rankings change as markets, regulation, and partner terms change. If you spot an error, contact support with sources.",
        ],
      },
    ],
    cta: { label: "Browse brokers", to: "/brokers" },
  },
  careers: {
    key: "careers",
    path: "/about/careers",
    navLabel: "Careers",
    kicker: "Behind the scenes",
    title: "Careers at LegendPips",
    lead:
      "We’re building tools for traders worldwide. If you care about clear product writing, broker research, or support that actually helps — we’d like to hear from you.",
    sections: [
      {
        heading: "Roles we often need",
        body: [
          "Broker research & content, community / forum moderation, trader support, and frontend / backend engineering.",
          "We value people who can explain risk honestly and ship small improvements quickly.",
        ],
      },
      {
        heading: "How to apply",
        body: [
          "Email careers@legendpips.com with a short intro, links to your work, and the role you’re interested in.",
          "There is no fixed open-roles board yet — strong applications are still reviewed.",
        ],
      },
    ],
    cta: { label: "Contact support", to: "/complaints" },
  },
  partners: {
    key: "partners",
    path: "/about/partners",
    navLabel: "For partners",
    kicker: "Behind the scenes",
    title: "For partners",
    lead:
      "Brokers, prop firms, educators, and affiliates who want transparent distribution with LegendPips.",
    sections: [
      {
        heading: "What partnership can include",
        body: [
          "IB / rebate programs, co-branded onboarding, signup bonuses featured on our Tools pages, and educational collaborations.",
          "We expect clear commercial terms, accurate product claims, and responsive support for shared clients.",
        ],
      },
      {
        heading: "What we won’t do",
        body: [
          "We won’t hide paid relationships as pure editorial, invent performance numbers, or list products that fail basic trust checks.",
        ],
      },
      {
        heading: "Get in touch",
        body: [
          "Reach partners@legendpips.com with your company name, product, target markets, and proposed commercial model.",
        ],
      },
    ],
    cta: { label: "View rebate brokers", to: "/rebates" },
  },
  journalists: {
    key: "journalists",
    path: "/about/journalists",
    navLabel: "For journalists",
    kicker: "Behind the scenes",
    title: "For journalists",
    lead:
      "Press and research requests about LegendPips, broker rebates, trader complaints, and market education.",
    sections: [
      {
        heading: "Media contact",
        body: [
          "Email press@legendpips.com with your outlet, deadline, and questions. We aim to reply within two business days.",
        ],
      },
      {
        heading: "What we can help with",
        body: [
          "Background on how rebate / IB models work, how we review brokers, and public complaint themes traders report to us.",
          "We can share product screenshots and high-level methodology. We cannot share private user data.",
        ],
      },
      {
        heading: "Attribution",
        body: [
          "Please cite LegendPips and link to the relevant public page when using our rankings or shield warnings.",
        ],
      },
    ],
    cta: { label: "Read our methodology", to: "/about/methodology" },
  },
};
