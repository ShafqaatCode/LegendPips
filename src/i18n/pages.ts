import type { LocaleCode } from "./locales";

export type PageCopy = {
  home: {
    kicker: string;
    title: string;
    topBrokers: string;
    blurb: string;
    joinFree: string;
    compareBrokers: string;
  };
  webinars: {
    title: string;
    highlight: string;
    body: string;
    why: string;
    w1: string;
    w2: string;
    w3: string;
    w4: string;
    w5: string;
    all: string;
    upcoming: string;
    recorded: string;
    live: string;
    free: string;
    premium: string;
    joinLive: string;
    reserve: string;
    replay: string;
    dLive: string;
    dSize: string;
    t1: string;
    t2: string;
    t3: string;
    t4: string;
    t5: string;
    t6: string;
    t7: string;
    t8: string;
    t9: string;
    t10: string;
    t11: string;
    t12: string;
  };
  courses: { title: string; highlight1: string; highlight2: string; subtitle: string; body: string; cta: string };
  signals: { title: string; body: string; recent: string; tab1: string; tab2: string; tab3: string; tab4: string };
  analysis: { title: string; highlight: string; sub: string; body: string };
  videos: { kicker: string; title: string; highlight1: string; highlight2: string; body: string; cta: string };
  forum: { title: string; body: string; feed: string };
  brokers: { title: string; body1: string; subtitle: string; body2: string; report: string };
  rewards: { kicker: string; title: string; accent: string; body: string; cta: string };
  contests: { kicker: string; heading: string; body: string; view: string; pageHeading: string };
  prop: { title: string; body: string; s1t: string; s1d: string; s2t: string; s2d: string; s3t: string; s3d: string };
  compare: { title: string; body: string; add: string };
  complaints: { title: string; body: string; sub: string };
  about: { kicker: string; title: string; body: string; empty: string };
  faq: {
    kicker: string;
    title: string;
    body: string;
    contact: string;
    contactBtn: string;
    cat1: string;
    cat2: string;
    cat3: string;
    cat4: string;
    q1: string; a1: string; q2: string; a2: string; q3: string; a3: string; q4: string; a4: string;
    q5: string; a5: string; q6: string; a6: string; q7: string; a7: string; q8: string; a8: string; q9: string; a9: string;
    q10: string; a10: string; q11: string; a11: string;
  };
  why: {
    kicker: string; title: string; body: string; more: string; less: string;
    p1t: string; p1d: string; p2t: string; p2d: string; p3t: string; p3d: string;
    p4t: string; p4d: string; p5t: string; p5d: string; p6t: string; p6d: string;
    u1t: string; u1d: string; u2t: string; u2d: string; u3t: string; u3d: string;
    u4t: string; u4d: string; u5t: string; u5d: string; u6t: string; u6d: string;
  };
  how: {
    kicker: string; title: string; body: string;
    b1: string; b2: string; b3: string; b4: string; b5: string;
    c1t: string; c1d: string; c2t: string; c2d: string; c3t: string; c3d: string;
    ctaTitle: string; ctaSub: string; ctaBtn: string;
    bannerKicker: string; bannerTitle: string; bannerBody: string;
  };
  community: { kicker: string; title: string; body: string };
  traders: { title: string; body: string; copyTitle: string; copyBody: string };
  pips: {
    kicker: string; title: string; body: string;
    f1t: string; f1d: string; f2t: string; f2d: string; f3t: string; f3d: string; f4t: string; f4d: string;
    f5t: string; f5d: string; f6t: string; f6d: string; f7t: string; f7d: string; f8t: string; f8d: string;
  };
  slider: { f1: string; f2: string; f3: string; f4: string; f5: string };
  pay: { kicker: string; title: string; body: string };
  brokersHome: { kicker: string; title: string; body: string; empty: string; viewAll: string };
  testimonials: { title: string; body: string };
  common: { allInOne: string; joinNow: string };
};

const en: PageCopy = {
  home: {
    kicker: "ALL IN ONE TRADING PLATFORM",
    title: "Compare Brokers, Earn Cashback, Get Signals",
    topBrokers: "Our Top Brokers",
    blurb:
      "Whether you're buying or selling, we reward every move. No hidden fees, just real money back in your pocket, every single time you trade.",
    joinFree: "Join Free",
    compareBrokers: "Compare Brokers",
  },
  webinars: {
    title: "Live Trading",
    highlight: "Webinars",
    body: "Learn directly from experienced traders through live sessions and detailed market breakdowns. Watch real time analysis, understand trade planning, and see how professionals read price action. Ask questions, follow live explanations, and gain practical insights you can apply in your own trading.",
    why: "Why Join Our Live Trading Webinars",
    w1: "Live market analysis with full breakdowns of market structure, key levels, trends, and session behavior to help you understand price movement in real time.",
    w2: "Interactive Q and A sessions where you can ask detailed questions and receive clear, practical answers directly from experienced traders.",
    w3: "Real trade examples explained from start to finish, including entry reasoning, risk placement, trade management, and exit decisions.",
    w4: "Replay access available for every session, allowing you to review lessons, pause explanations, and learn again at your own pace.",
    w5: "Learn directly from professionals who share real market experience, practical insights and disciplined trading approaches used in live conditions.",
    all: "All Webinars",
    upcoming: "Upcoming",
    recorded: "Recorded",
    live: "Live",
    free: "Free",
    premium: "Premium",
    joinLive: "Join Live",
    reserve: "Reserve Seat",
    replay: "Watch Replay",
    dLive: "Live analysis of XAU/USD with trade planning.",
    dSize: "Learn position sizing and drawdown control.",
    t1: "Gold Market Breakdown",
    t2: "Smart Risk Management",
    t3: "Live Market Breakdown",
    t4: "Forex Trading Basics",
    t5: "Gold Market Insights",
    t6: "Trade Planning Workshop",
    t7: "Forex Risk Management Webinar",
    t8: "Price Action Explained",
    t9: "Advanced Trading Strategies",
    t10: "Market Structure Analysis",
    t11: "Position Sizing Masterclass",
    t12: "Trading Psychology Workshop",
  },
  courses: {
    title: "Understand",
    highlight1: "Markets,",
    highlight2: "Smarter",
    subtitle: "An All-in-One Trading Platform.",
    body: "Learn trading with expert guidance and hands-on practice. Build your knowledge, skills, and confidence to trade smarter and make informed decisions in the markets.",
    cta: "Access Now",
  },
  signals: {
    title: "LIVE SIGNALS",
    body: "Stay ahead of every move with accurate, live market signals across Forex, Gold, and Crypto — updated in real time to help you capture every trading opportunity with confidence and precision.",
    recent: "Recent Signal Performance",
    tab1: "Signals",
    tab2: "Rewards",
    tab3: "Stats",
    tab4: "Performance",
  },
  analysis: {
    title: "Market",
    highlight: "Analysis",
    sub: "Smart insights to help you make stronger trading decisions.",
    body: "Forex analysis helps you understand where a currency pair is likely to move next. By examining historical price movements, economic indicators, and market sentiment, traders can make more informed decisions about when to enter or exit positions.",
  },
  videos: {
    kicker: "ALL IN ONE TRADING PLATFORM",
    title: "Understand",
    highlight1: "Markets,",
    highlight2: "Smarter",
    body: "Learn trading with expert guidance and hands-on practice. Build your knowledge, skills, and confidence to trade smarter and make informed decisions in the markets.",
    cta: "Join Now",
  },
  forum: {
    title: "TRADER COMMUNITY",
    body: "Share market ideas, ask questions, and join live discussions across Forex, Gold, Crypto, Stocks, and Indices — post charts, leave comments, and learn with traders worldwide.",
    feed: "Community Feed",
  },
  brokers: {
    title: "Trusted Brokers",
    body1:
      "We partner only with regulated and reputable brokers who adhere to the highest industry standards. Our listed brokers are carefully vetted to ensure transparency, security, and fair trading conditions — giving you the confidence to trade in a safe and reliable environment.",
    subtitle: "Facing any issue with our recommended broker? Submit a report.",
    body2:
      "If you experience any problems or have concerns regarding a broker, we encourage you to submit a detailed report. Our dedicated support team will thoroughly review your submission, investigate the matter, and take the necessary steps to ensure your trading experience remains secure and fair.",
    report: "Submit a broker complaint →",
  },
  rewards: {
    kicker: "ALL IN ONE TRADING PLATFORM",
    title: "Gift Rewards",
    accent: "That Something More",
    body: "From cash prizes to exciting bonus rewards, we turn every trade into progress. Join the club and unlock deals designed to keep your momentum strong.",
    cta: "Join Now",
  },
  contests: {
    kicker: "All in one trading platform",
    heading: "Exciting trading Contest",
    body: "Join our exciting trading contest designed for both new and experienced traders. Make the most profit during the contest period and take home huge cash prizes! Track your rank live and beat the best in the game.",
    view: "View Details",
    pageHeading: "Elite Skills Contest on the Web We Never Ask for Real Money!",
  },
  prop: {
    title: "PROP FIRM HUB",
    body: "Compare evaluation cashback, discounts, and profit splits. Buy through LegendPips partner links and get credited after purchase verification.",
    s1t: "Pick a firm",
    s1d: "Compare programs, first-purchase cashback, and discounts.",
    s2t: "Buy via partner link",
    s2d: "Open the firm from LegendPips so we can match your purchase.",
    s3t: "Get cashback",
    s3d: "Credits appear on My Rebates after the team verifies the challenge.",
  },
  compare: {
    title: "BROKER COMPARISON",
    body: "Compare regulation, spreads, cashback, and reviews side by side. Pick 2–4 brokers and share the link with other traders.",
    add: "Add brokers",
  },
  complaints: {
    title: "BROKER COMPLAINT CENTER",
    body: "Report withdrawal delays, unfair trading conditions, or suspected scam brokers. Every case gets a ticket ID and is reviewed by the LegendPips team.",
    sub: "File a report · Track status · Public warning list",
  },
  about: {
    kicker: "BEHIND THE SCENES",
    title: "About LegendPips",
    body: "We help traders compare brokers, earn rebates, follow signals, and stay protected — with clear reviews, education, and human support.",
    empty: "More about LegendPips coming soon.",
  },
  faq: {
    kicker: "Frequently asked questions",
    title: "Get Answers",
    body: "We've answered common questions to help you understand how our platform works and what you can expect.",
    contact: "We've compiled a list of frequently asked questions to provide you with quick and helpful answers.",
    contactBtn: "Contact Us",
    cat1: "Forex & Stock Basics",
    cat2: "Trading Strategies",
    cat3: "Broker Comparisons",
    cat4: "Education and Tutorials",
    q1: "What is Forex trading?",
    a1: "Our platform provides realtime Forex signals based on expert analysis. You can access these signals directly through your LegendPips account. LegendPips partners with reliable brokers to ensure secure trading.",
    q2: "How do I start trading with LegendPips?",
    a2: "You can start trading by creating an account and following our guided onboarding process.",
    q3: "How do I get Forex signals?",
    a3: "Forex signals will be available directly on your dashboard after subscribing to a plan.",
    q4: "Do I need experience to start trading?",
    a4: "No, our platform provides tutorials and customer support to help beginners learn and grow.",
    q5: "What trading strategies do you support?",
    a5: "We support multiple strategies including scalping, swing trading, and day trading with detailed analysis.",
    q6: "Can I customize my trading strategy?",
    a6: "Yes, users can choose and adapt strategies based on their risk tolerance and goals.",
    q7: "Which brokers are supported?",
    a7: "We work with top brokers such as ICMarkets, Exness, and FBS, selected based on reliability and spreads.",
    q8: "How to compare brokers?",
    a8: "Open the Compare page, pick 2–4 brokers, and share the URL. You can also tap Add to compare on any broker card.",
    q9: "Where is the Prop Firm Hub?",
    a9: "Open /prop-firms to compare challenge cashback, evaluation types, and partnered prop firms. The Prop tab on Rebates lists the same firms.",
    q10: "Do you offer Forex tutorials?",
    a10: "Yes, we have a library of tutorials designed for all levels, from beginners to advanced traders.",
    q11: "Are the tutorials free?",
    a11: "Basic tutorials are free, while premium educational content is available with a subscription.",
  },
  why: {
    kicker: "All in one trading Platform",
    title: "Why Choose Us",
    body: "Discover why traders worldwide trust us as their top choice. With a focus on delivering consistent profits, exceptional service, cutting-edge technology.",
    more: "Read More",
    less: "Show Less",
    p1t: "Broker causing problems? Submit a complaint now.",
    p1d: "Facing issues like delayed withdrawals, trade manipulation, or poor support? We're here to help resolve it.",
    p2t: "AI-Powered Broker Finder",
    p2d: "Whether you trade in forex, crypto, or stocks our AI helps you find the perfect trading partner fast.",
    p3t: "Excellent customer service",
    p3d: "We prioritize your satisfaction and profit. Our professional customer service team is always here to help you.",
    p4t: "Top technical analysis",
    p4d: "We have a very robust trading system, AI intelligence, technical analysis, big data and strategic cooperation with the world's top trading analysts.",
    p5t: "Exciting Lucky Draws with Real Prizes",
    p5d: "Spend just $1 and get a chance to spin the wheel for exciting prizes! The more you spend, the more chances you get to win big.",
    p6t: "Delivering tools that elevate your trading game",
    p6d: "Gain access to a suite of powerful trading tools designed to enhance every aspect of your trading journey.",
    u1t: "Stay Informed with Daily Economic Insights",
    u1d: "Keep track of upcoming economic events, news releases, and data that can impact your trades.",
    u2t: "Become an Affiliate Partner & Start Earning",
    u2d: "Whether you're a content creator or a trading pro, our affiliate program offers unlimited earning potential.",
    u3t: "Education That Elevates Your Trading",
    u3d: "Unlock powerful insights with structured learning from beginner to expert featuring monthly webinars, psychology classes, and advanced trading lessons.",
    u4t: "Advanced Scam Detection and Prevention",
    u4d: "Our intelligent system verifies brokers using advanced AI checks and ensures fast, transparent complaint resolution.",
    u5t: "Copy Top Traders, Earn Like a Pro",
    u5d: "Choose from a list of verified expert traders and mirror their trades in real time for consistent results.",
    u6t: "Trading signal tracking is simple and reliable",
    u6d: "Our trading signals are pushed live to VIP customers through the system, social network and email. Real-time trading broadcasts provide better clarity.",
  },
  how: {
    kicker: "All in one trading Platform",
    title: "How it works",
    body: "Trade, earn, repeat. With rebates, expert tools, and a strong community, LegendPips makes every trade more rewarding.",
    b1: "Register for free and connect your existing trading account with one of our partnered brokers.",
    b2: "Keep trading as you normally do — we'll return a portion of the spread or commission on every trade.",
    b3: "Check your rewards in real-time — stay up to date with live statistics and see your cashback grow.",
    b4: "Take part in exciting competitions, leverage premium trading tools and signals, and benefit from daily market analysis.",
    b5: "Participate in our active forum — share tips, ask questions, and learn alongside other traders.",
    c1t: "Connect & Trade",
    c1d: "Link your account through Legend Pips. No changes to your broker or spreads.",
    c2t: "Earn Rebates",
    c2d: "Get cashback on every trade made with supported brokers through our platform.",
    c3t: "Grow Your Skills",
    c3d: "We pay you back — fast, simple, and with no hidden fees.",
    ctaTitle: "Don't have an account?",
    ctaSub: "Create your free LegendPips account and start earning rebates today.",
    ctaBtn: "Signup For Free",
    bannerKicker: "All in one trading platform",
    bannerTitle: "Earning from every trade has never been this simple.",
    bannerBody: "Legend Pips gives you cashback for your trades without changing your broker. Plus, you get tools, signals, and protection — built to help you grow.",
  },
  community: {
    kicker: "All in one trading platform",
    title: "Unlock success with our community",
    body: "Unlock your true trading potential by joining a community of experts, learners, and achievers. Share ideas, get support, and grow your skills every day",
  },
  traders: {
    title: "VERIFIED TRADERS",
    body: "Performance profiles reviewed by LegendPips. Stats are submitted by the trader and verified by our team, not live-synced from MT4/MT5.",
    copyTitle: "COPY TRADING",
    copyBody: "Request to follow verified traders. LegendPips matches you with the trader — it does not auto-copy trades on your broker account.",
  },
  pips: {
    kicker: "Why traders choose us",
    title: "Legend Pips Features",
    body: "Everything you need to trade smarter, earn rebates, and grow with a trusted community.",
    f1t: "Live Reporting",
    f1d: "See your cashback update instantly as you trade.",
    f2t: "Premium Rebate Offers",
    f2d: "Enjoy the most competitive rates in the industry.",
    f3t: "Handpicked Trusted Brokers",
    f3d: "Trade with only fully verified brokers.",
    f4t: "Join Our Community",
    f4d: "Chat, learn, and succeed with like-minded people.",
    f5t: "Signals & Expert Analysis",
    f5d: "Receive top-notch signals and timely insights.",
    f6t: "Exciting Trading Contests",
    f6d: "Compete for prizes and showcase your skills.",
    f7t: "Quick & Helpful Support",
    f7d: "Get fast, friendly help whenever you need it.",
    f8t: "Raise a Complaint",
    f8d: "Help us improve by reporting any concerns you have.",
  },
  slider: {
    f1: "Scam Broker Shield",
    f2: "Cashback Rebates",
    f3: "Verified Broker",
    f4: "Trading Signals",
    f5: "Contests & Rewards",
  },
  pay: {
    kicker: "Secure payouts & deposits",
    title: "Payment Methods",
    body: "Fund your account and withdraw rebates through trusted global payment providers.",
  },
  brokersHome: {
    kicker: "All in one Trading Platform",
    title: "Top Forex Brokers",
    body: "Find the best brokers carefully compared & reviewed for your trading needs. Trade confidently with secure platforms.",
    empty: "No rebate brokers are published yet.",
    viewAll: "View All Brokers",
  },
  testimonials: {
    title: "TESTIMONIALS",
    body: "Discover why traders worldwide trust us as their top choice, with a focus on delivering consistent profits, exceptional service, cutting-edge technology.",
  },
  common: { allInOne: "ALL IN ONE TRADING PLATFORM", joinNow: "Join Now" },
};

function fill(p: DeepPartial<PageCopy>): PageCopy {
  return {
    home: { ...en.home, ...p.home },
    webinars: { ...en.webinars, ...p.webinars },
    courses: { ...en.courses, ...p.courses },
    signals: { ...en.signals, ...p.signals },
    analysis: { ...en.analysis, ...p.analysis },
    videos: { ...en.videos, ...p.videos },
    forum: { ...en.forum, ...p.forum },
    brokers: { ...en.brokers, ...p.brokers },
    rewards: { ...en.rewards, ...p.rewards },
    contests: { ...en.contests, ...p.contests },
    prop: { ...en.prop, ...p.prop },
    compare: { ...en.compare, ...p.compare },
    complaints: { ...en.complaints, ...p.complaints },
    about: { ...en.about, ...p.about },
    faq: { ...en.faq, ...p.faq },
    why: { ...en.why, ...p.why },
    how: { ...en.how, ...p.how },
    community: { ...en.community, ...p.community },
    traders: { ...en.traders, ...p.traders },
    pips: { ...en.pips, ...p.pips },
    slider: { ...en.slider, ...p.slider },
    pay: { ...en.pay, ...p.pay },
    brokersHome: { ...en.brokersHome, ...p.brokersHome },
    testimonials: { ...en.testimonials, ...p.testimonials },
    common: { ...en.common, ...p.common },
  };
}

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

const ur = fill({
  home: {
    kicker: "سب کچھ ایک ٹریڈنگ پلیٹ فارم",
    title: "بروکرز کا موازنہ کریں، کیش بیک کمائیں، سگنلز حاصل کریں",
    topBrokers: "ہمارے ٹاپ بروکرز",
    blurb: "خریدیں یا بیچیں، ہر ٹریڈ پر انعام۔ پوشیدہ فیس نہیں، ہر بار حقیقی رقم واپس۔",
    joinFree: "مفت شامل ہوں",
    compareBrokers: "بروکرز کا موازنہ",
  },
  webinars: {
    title: "لائیو ٹریڈنگ",
    highlight: "ویبینارز",
    body: "تجربہ کار ٹریڈرز سے لائیو سیشنز اور تفصیلی مارکیٹ بریک ڈاؤن کے ذریعے سیکھیں۔ حقیقی وقت کا تجزیہ دیکھیں، ٹریڈ پلاننگ سمجھیں، اور دیکھیں پیشہ ور قیمت کی حرکت کیسے پڑھتے ہیں۔ سوال پوچھیں، لائیو وضاحتیں فالو کریں، اور عملی بصیرت حاصل کریں جو آپ اپنی ٹریڈنگ میں لا سکتے ہیں۔",
    why: "ہمارے لائیو ٹریڈنگ ویبینارز میں کیوں شامل ہوں",
    w1: "لائیو مارکیٹ تجزیہ — مارکیٹ سٹرکچر، کلیدی لیولز، ٹرینڈز اور سیشن رویے کی مکمل وضاحت تاکہ قیمت کی حرکت حقیقی وقت میں سمجھ آئے۔",
    w2: "انٹرایکٹو سوال و جواب جہاں آپ تفصیلی سوال پوچھیں اور تجربہ کار ٹریڈرز سے واضح عملی جواب حاصل کریں۔",
    w3: "حقیقی ٹریڈ کی مثالیں شروع سے آخر تک — انٹری کی وجہ، رسک پلیسمنٹ، ٹریڈ مینجمنٹ اور ایگزٹ فیصلے۔",
    w4: "ہر سیشن کا ریپلے دستیاب ہے تاکہ اسباق دوبارہ دیکھیں، وضاحت روکیں، اور اپنی رفتار سے سیکھیں۔",
    w5: "ماہرین سے سیکھیں جو لائیو حالات میں استعمال ہونے والا حقیقی تجربہ اور نظم و ضبط شیئر کرتے ہیں۔",
    all: "تمام ویبینارز",
    upcoming: "آنے والے",
    recorded: "ریکارڈ شدہ",
    live: "لائیو",
    free: "مفت",
    premium: "پریمیم",
    joinLive: "لائیو شامل ہوں",
    reserve: "سیٹ محفوظ کریں",
    replay: "ریپلے دیکھیں",
    dLive: "XAU/USD کا لائیو تجزیہ اور ٹریڈ پلاننگ۔",
    dSize: "پوزیشن سائزنگ اور ڈرا ڈاؤن کنٹرول سیکھیں۔",
    t1: "گولڈ مارکیٹ بریک ڈاؤن",
    t2: "سمارٹ رسک مینجمنٹ",
    t3: "لائیو مارکیٹ بریک ڈاؤن",
    t4: "فاریکس ٹریڈنگ کی بنیادی باتیں",
    t5: "گولڈ مارکیٹ بصیرت",
    t6: "ٹریڈ پلاننگ ورکشاپ",
    t7: "فاریکس رسک مینجمنٹ ویبینار",
    t8: "پرائس ایکشن کی وضاحت",
    t9: "ایڈوانسڈ ٹریڈنگ حکمت عملیاں",
    t10: "مارکیٹ سٹرکچر تجزیہ",
    t11: "پوزیشن سائزنگ ماسٹر کلاس",
    t12: "ٹریڈنگ سائیکالوجی ورکشاپ",
  },
  courses: {
    title: "مارکیٹس",
    highlight1: "سمجھیں،",
    highlight2: "ہوشیار",
    subtitle: "ایک مکمل ٹریڈنگ پلیٹ فارم۔",
    body: "ماہر رہنمائی اور عملی مشق کے ساتھ ٹریڈنگ سیکھیں۔ علم، مہارت اور اعتماد بنائیں تاکہ ہوشیار ٹریڈ کریں۔",
    cta: "اب رسائی حاصل کریں",
  },
  signals: {
    title: "لائیو سگنلز",
    body: "فاریکس، گولڈ اور کرپٹو پر درست لائیو سگنلز کے ساتھ ہر حرکت سے آگے رہیں — حقیقی وقت میں اپ ڈیٹ۔",
    recent: "حالیہ سگنل کارکردگی",
    tab1: "سگنلز",
    tab2: "انعامات",
    tab3: "اعداد و شمار",
    tab4: "کارکردگی",
  },
  analysis: {
    title: "مارکیٹ",
    highlight: "تجزیہ",
    sub: "مضبوط ٹریڈنگ فیصلوں کے لیے ہوشیار بصیرت۔",
    body: "فاریکس تجزیہ بتاتا ہے کہ کرنسی جوڑی اگلے کہاں جا سکتی ہے۔ تاریخی قیمت، معاشی اشارے اور مارکیٹ جذبات دیکھ کر بہتر فیصلے کریں۔",
  },
  videos: {
    kicker: "سب کچھ ایک ٹریڈنگ پلیٹ فارم",
    title: "مارکیٹس",
    highlight1: "سمجھیں،",
    highlight2: "ہوشیار",
    body: "ماہر رہنمائی اور عملی مشق کے ساتھ ٹریڈنگ سیکھیں۔",
    cta: "اب شامل ہوں",
  },
  forum: {
    title: "ٹریڈر کمیونٹی",
    body: "مارکیٹ آئیڈیاز شیئر کریں، سوال پوچھیں، اور فاریکس، گولڈ، کرپٹو، اسٹاکس اور انڈیسز پر لائیو گفتگو میں شامل ہوں۔",
    feed: "کمیونٹی فیڈ",
  },
  brokers: {
    title: "قابل اعتماد بروکرز",
    body1: "ہم صرف ریگولیٹڈ اور معروف بروکرز کے ساتھ پارٹنر ہیں۔ شفافیت، سیکیورٹی اور منصفانہ شرائط کے لیے انہیں جانچا جاتا ہے۔",
    subtitle: "تجویز کردہ بروکر سے مسئلہ؟ رپورٹ جمع کرائیں۔",
    body2: "اگر بروکر سے مسئلہ ہو تو تفصیلی رپورٹ بھیجیں۔ ہماری ٹیم جائزہ لے گی تاکہ آپ کا تجربہ محفوظ رہے۔",
    report: "بروکر شکایت جمع کرائیں →",
  },
  rewards: {
    kicker: "سب کچھ ایک ٹریڈنگ پلیٹ فارم",
    title: "گفٹ انعامات",
    accent: "کچھ زیادہ",
    body: "نقد انعامات سے بونس تک، ہر ٹریڈ کو پیش رفت بنائیں۔ کلب میں شامل ہوں۔",
    cta: "اب شامل ہوں",
  },
  contests: {
    kicker: "سب کچھ ایک ٹریڈنگ پلیٹ فارم",
    heading: "دلچسپ ٹریڈنگ مقابلہ",
    body: "نئے اور تجربہ کار ٹریڈرز کے لیے مقابلہ۔ مدت کے دوران زیادہ سے زیادہ منافع کمائیں اور نقد انعامات جیتیں۔ رینک لائیو ٹریک کریں۔",
    view: "تفصیل دیکھیں",
    pageHeading: "ویب پر ایلیٹ اسکلز مقابلہ — ہم حقیقی رقم نہیں مانگتے!",
  },
  prop: {
    title: "پراپ فرم ہب",
    body: "ایویلیوایشن کیش بیک، ڈسکاؤنٹ اور پرافٹ سپلٹ کا موازنہ کریں۔ پارٹنر لنک سے خریدیں اور تصدیق کے بعد کریڈٹ حاصل کریں۔",
    s1t: "فرم منتخب کریں",
    s1d: "پروگرامز، پہلی خریداری کیش بیک اور ڈسکاؤنٹ دیکھیں۔",
    s2t: "پارٹنر لنک سے خریدیں",
    s2d: "LegendPips سے فرم کھولیں تاکہ خریداری میچ ہو۔",
    s3t: "کیش بیک حاصل کریں",
    s3d: "ٹیم تصدیق کے بعد My Rebates پر کریڈٹ نظر آتے ہیں۔",
  },
  compare: {
    title: "بروکر موازنہ",
    body: "ریگولیشن، اسپریڈ، کیش بیک اور ریویوز ساتھ ساتھ دیکھیں۔ 2–4 بروکرز چنیں اور لنک شیئر کریں۔",
    add: "بروکر شامل کریں",
  },
  complaints: {
    title: "بروکر شکایت سینٹر",
    body: "ولڈرال تاخیر، غیر منصفانہ شرائط یا مشتبہ فراڈ کی اطلاع دیں۔ ہر کیس کو ٹکٹ آئی ڈی ملتی ہے۔",
    sub: "رپورٹ فائل کریں · سٹیٹس ٹریک کریں · وارننگ لسٹ",
  },
  about: {
    kicker: "ہمارے بارے میں",
    title: "ہماری ٹیم",
    body: "LegendPips کے پیچھے لوگ — تجربہ کار ٹریڈرز، تجزیہ کار اور آپ کی کامیابی کے لیے آپریٹرز۔",
    empty: "ٹیم کی معلومات جلد آرہی ہے۔",
  },
  faq: {
    kicker: "اکثر پوچھے گئے سوالات",
    title: "جواب حاصل کریں",
    body: "عام سوالات کے جوابات تاکہ پلیٹ فارم سمجھ آئے۔",
    contact: "ہم نے فوری مدد کے لیے اکثر پوچھے گئے سوالات اکٹھے کیے ہیں۔",
    contactBtn: "رابطہ کریں",
    cat1: "فاریکس اور اسٹاک بنیادی باتیں",
    cat2: "ٹریڈنگ حکمت عملیاں",
    cat3: "بروکر موازنہ",
    cat4: "تعلیم اور ٹیوٹوریلز",
    q1: "فاریکس ٹریڈنگ کیا ہے؟",
    a1: "ہمارا پلیٹ فارم ماہر تجزیے پر مبنی ریئل ٹائم فاریکس سگنلز دیتا ہے۔ آپ انہیں اپنے LegendPips اکاؤنٹ سے حاصل کر سکتے ہیں۔ ہم قابل اعتماد بروکرز کے ساتھ پارٹنر ہیں۔",
    q2: "LegendPips کے ساتھ ٹریڈنگ کیسے شروع کروں؟",
    a2: "اکاؤنٹ بنائیں اور ہماری گائیڈڈ آن بورڈنگ فالو کریں۔",
    q3: "فاریکس سگنلز کیسے ملیں گے؟",
    a3: "پلان سبسکرائب کرنے کے بعد سگنلز آپ کے ڈیش بورڈ پر دستیاب ہوں گے۔",
    q4: "کیا شروع کرنے کے لیے تجربہ ضروری ہے؟",
    a4: "نہیں، ٹیوٹوریلز اور سپورٹ ابتدائیوں کی مدد کرتے ہیں۔",
    q5: "آپ کون سی ٹریڈنگ حکمت عملیاں سپورٹ کرتے ہیں؟",
    a5: "اسکیپنگ، سوئنگ اور ڈے ٹریڈنگ سمیت متعدد حکمت عملیاں تفصیلی تجزیے کے ساتھ۔",
    q6: "کیا میں اپنی حکمت عملی اپنی مرضی سے بنا سکتا ہوں؟",
    a6: "ہاں، رسک اور اہداف کے مطابق حکمت عملی منتخب اور ڈھال سکتے ہیں۔",
    q7: "کون سے بروکرز سپورٹڈ ہیں؟",
    a7: "ہم ICMarkets، Exness اور FBS جیسے قابل اعتماد بروکرز کے ساتھ کام کرتے ہیں۔",
    q8: "بروکر کا موازنہ کیسے کریں؟",
    a8: "Compare صفحہ کھولیں، 2–4 بروکرز چنیں، اور لنک شیئر کریں۔ کارڈ پر Add to compare بھی استعمال کر سکتے ہیں۔",
    q9: "پراپ فرم ہب کہاں ہے؟",
    a9: "/prop-firms پر چیلنج کیش بیک اور پارٹنر فرمز کا موازنہ کریں۔ Rebates کا Prop ٹیب بھی یہی فرمز دکھاتا ہے۔",
    q10: "کیا فاریکس ٹیوٹوریلز ہیں؟",
    a10: "ہاں، ابتدائی سے ماہر تک ٹیوٹوریلز کی لائبریری موجود ہے۔",
    q11: "کیا ٹیوٹوریلز مفت ہیں؟",
    a11: "بنیادی ٹیوٹوریلز مفت ہیں، پریمیم مواد سبسکرپشن کے ساتھ ہے۔",
  },
  why: {
    kicker: "سب کچھ ایک ٹریڈنگ پلیٹ فارم",
    title: "ہمیں کیوں چنیں",
    body: "دنیا بھر کے ٹریڈرز ہم پر کیوں بھروسہ کرتے ہیں — سروس، ٹیکنالوجی اور نتائج۔",
    more: "مزید پڑھیں",
    less: "کم دکھائیں",
    p1t: "بروکر مسئلہ؟ ابھی شکایت جمع کرائیں۔",
    p1d: "ولڈرال تاخیر، ٹریڈ ہیرا پھیری یا کمزور سپورٹ؟ ہم حل میں مدد کرتے ہیں۔",
    p2t: "AI سے بروکر تلاش",
    p2d: "فاریکس، کرپٹو یا اسٹاک — AI تیزی سے موزوں پارٹنر ڈھونڈتا ہے۔",
    p3t: "بہترین کسٹمر سروس",
    p3d: "آپ کی اطمینان اور منافع ہماری ترجیح ہے۔ پیشہ ور ٹیم ہمیشہ مدد کے لیے حاضر ہے۔",
    p4t: "اعلیٰ تکنیکی تجزیہ",
    p4d: "مضبوط سسٹم، AI، تکنیکی تجزیہ، بگ ڈیٹا اور دنیا کے ٹاپ اینالسٹس کے ساتھ تعاون۔",
    p5t: "اصل انعامات کے ساتھ لککی ڈراز",
    p5d: "صرف $1 خرچ کرکے وہیل گھمائیں۔ جتنا زیادہ خرچ، جیتنے کے اتنے زیادہ مواقع۔",
    p6t: "ٹولز جو آپ کی ٹریڈنگ بہتر بنائیں",
    p6d: "طاقتور ٹریڈنگ ٹولز تک رسائی جو سفر کے ہر حصے کو بہتر بناتے ہیں۔",
    u1t: "روزانہ اقتصادی بصیرت سے باخبر رہیں",
    u1d: "آنے والے ایونٹس، خبریں اور ڈیٹا جو آپ کی ٹریڈز پر اثر ڈال سکتا ہے۔",
    u2t: "افیلیئٹ پارٹنر بنیں اور کمائیں",
    u2d: "کنٹینٹ کریئٹر ہوں یا ٹریڈر، افیلیئٹ پروگرام لامحدود کمائی کا موقع دیتا ہے۔",
    u3t: "تعلیم جو ٹریڈنگ بلند کرے",
    u3d: "شروعاتی سے ماہر تک منظم سیکھنا — ماہانہ ویبینارز، سائیکالوجی کلاسز اور ایڈوانسڈ اسباق۔",
    u4t: "ایڈوانسڈ اسکیم کا پتہ اور روک تھام",
    u4d: "AI چیکس سے بروکرز کی تصدیق اور شفاف شکایت کا حل۔",
    u5t: "ٹاپ ٹریڈرز کاپی کریں، پروفیشنل کی طرح کمائیں",
    u5d: "تصدیق شدہ ماہر ٹریڈرز کی فہرست سے منتخب کریں اور نتائج کے لیے ان کی ٹریڈز دیکھیں۔",
    u6t: "سگنل ٹریکنگ آسان اور قابل اعتماد",
    u6d: "VIP صارفین کو سسٹم، سوشل اور ای میل پر لائیو سگنلز۔ ریئل ٹائم براڈکاسٹ سے وضاحت ملتی ہے۔",
  },
  how: {
    kicker: "سب کچھ ایک ٹریڈنگ پلیٹ فارم",
    title: "کیسے کام کرتا ہے",
    body: "ٹریڈ کریں، کمائیں، دہرائیں۔ ریبیٹس، ٹولز اور کمیونٹی کے ساتھ ہر ٹریڈ زیادہ فائدہ مند۔",
    b1: "مفت رجسٹر ہوں اور اپنے موجودہ ٹریڈنگ اکاؤنٹ کو ہمارے پارٹنر بروکر سے جوڑیں۔",
    b2: "جیسے پہلے ٹریڈ کرتے رہیں — ہم ہر ٹریڈ پر اسپریڈ یا کمیشن کا حصہ واپس کریں گے۔",
    b3: "ریئل ٹائم میں انعامات چیک کریں — لائیو اعداد و شمار سے کیش بیک بڑھتا دیکھیں۔",
    b4: "مقابلوں میں حصہ لیں، پریمیم ٹولز اور سگنلز استعمال کریں، اور روزانہ مارکیٹ تجزیے سے فائدہ اٹھائیں۔",
    b5: "فعال فورم میں شامل ہوں — ٹپس شیئر کریں، سوال پوچھیں، اور دوسرے ٹریڈرز کے ساتھ سیکھیں۔",
    c1t: "جوڑیں اور ٹریڈ کریں",
    c1d: "Legend Pips کے ذریعے اکاؤنٹ لنک کریں۔ بروکر یا اسپریڈ نہیں بدلتے۔",
    c2t: "ریبیٹس کمائیں",
    c2d: "سپورٹڈ بروکرز پر ہر ٹریڈ پر کیش بیک حاصل کریں۔",
    c3t: "مہارت بڑھائیں",
    c3d: "ہم واپس ادائیگی کرتے ہیں — تیز، آسان، بغیر پوشیدہ فیس۔",
    ctaTitle: "اکاؤنٹ نہیں ہے؟",
    ctaSub: "مفت LegendPips اکاؤنٹ بنائیں اور آج ہی ریبیٹس کمانا شروع کریں۔",
    ctaBtn: "مفت سائن اپ",
    bannerKicker: "سب کچھ ایک ٹریڈنگ پلیٹ فارم",
    bannerTitle: "ہر ٹریڈ سے کمائی کبھی اتنی آسان نہیں رہی۔",
    bannerBody: "Legend Pips آپ کے بروکر بدلے بغیر ٹریڈز پر کیش بیک دیتا ہے۔ ساتھ ٹولز، سگنلز اور تحفظ۔",
  },
  community: {
    kicker: "سب کچھ ایک ٹریڈنگ پلیٹ فارم",
    title: "کمیونٹی کے ساتھ کامیابی",
    body: "ماہرین، سیکھنے والوں اور کامیاب ٹریڈرز کی کمیونٹی میں شامل ہوں۔",
  },
  pips: {
    kicker: "ٹریڈرز ہمیں کیوں چنتے ہیں",
    title: "Legend Pips کی خصوصیات",
    body: "سمارٹ ٹریڈ، ریبیٹس، اور قابل اعتماد کمیونٹی کے ساتھ بڑھنے کے لیے سب کچھ۔",
    f1t: "لائیو رپورٹنگ",
    f1d: "ٹریڈ کرتے ہی کیش بیک فوراً اپڈیٹ دیکھیں۔",
    f2t: "پریمیم ریبیٹ آفرز",
    f2d: "انڈسٹری کے مسابقتی ریٹس سے فائدہ اٹھائیں۔",
    f3t: "منتخب قابل اعتماد بروکرز",
    f3d: "صرف مکمل تصدیق شدہ بروکرز کے ساتھ ٹریڈ کریں۔",
    f4t: "کمیونٹی میں شامل ہوں",
    f4d: "بات کریں، سیکھیں، اور ہم خیال لوگوں کے ساتھ کامیاب ہوں۔",
    f5t: "سگنلز اور ماہر تجزیہ",
    f5d: "بہترین سگنلز اور بروقت بصیرت حاصل کریں۔",
    f6t: "دلچسپ ٹریڈنگ مقابلے",
    f6d: "انعامات کے لیے مقابلہ کریں اور مہارت دکھائیں۔",
    f7t: "تیز اور مددگار سپورٹ",
    f7d: "جب ضرورت ہو فوری دوستانہ مدد۔",
    f8t: "شکایت درج کریں",
    f8d: "مسائل رپورٹ کر کے ہمیں بہتر بنانے میں مدد کریں۔",
  },
  slider: {
    f1: "اسکیم سے تحفظ",
    f2: "کیش بیک ریبیٹس",
    f3: "تصدیق شدہ بروکر",
    f4: "ٹریڈنگ سگنلز",
    f5: "مقابلے اور انعامات",
  },
  pay: {
    kicker: "محفوظ ادائیگیاں اور ڈپازٹس",
    title: "ادائیگی کے طریقے",
    body: "قابل اعتماد عالمی پرووائیڈرز سے اکاؤنٹ فنڈ کریں اور ریبیٹس نکالیں۔",
  },
  brokersHome: {
    kicker: "سب کچھ ایک ٹریڈنگ پلیٹ فارم",
    title: "ٹاپ فاریکس بروکرز",
    body: "اپنی ضرورت کے مطابق موازنہ اور ریویو شدہ بہترین بروکرز تلاش کریں۔ محفوظ پلیٹ فارمز پر اعتماد سے ٹریڈ کریں۔",
    empty: "ابھی کوئی ریبیٹ بروکر شائع نہیں ہوا۔",
    viewAll: "تمام بروکرز دیکھیں",
  },
  testimonials: { title: "رائے", body: "دنیا بھر کے ٹریڈرز ہم پر کیوں بھروسہ کرتے ہیں — مسلسل نتائج، سروس اور جدید ٹیکنالوجی۔" },
  common: { allInOne: "سب کچھ ایک ٹریڈنگ پلیٹ فارم", joinNow: "اب شامل ہوں" },
});

const ar = fill({
  home: {
    kicker: "منصة تداول شاملة",
    title: "قارن الوسطاء، اكسب الكاش باك، احصل على الإشارات",
    topBrokers: "أفضل الوسطاء لدينا",
    blurb: "سواء تشتري أو تبيع، نكافئ كل صفقة. بلا رسوم خفية، مال حقيقي يعود إليك.",
    joinFree: "انضم مجانًا",
    compareBrokers: "قارن الوسطاء",
  },
  webinars: {
    title: "تداول مباشر",
    highlight: "ندوات",
    body: "تعلّم مباشرة من متداولين ذوي خبرة عبر جلسات حية وتحليلات مفصلة للسوق. شاهد التحليل اللحظي، افهم تخطيط الصفقات، واطرح الأسئلة واكتسب رؤى عملية.",
  },
  courses: {
    title: "افهم",
    highlight1: "الأسواق،",
    highlight2: "أذكى",
    subtitle: "منصة تداول متكاملة.",
    body: "تعلّم التداول بإرشاد الخبراء والتطبيق العملي لبناء المعرفة والثقة.",
    cta: "ادخل الآن",
  },
  signals: {
    title: "إشارات مباشرة",
    body: "ابقَ سابقًا مع إشارات حية دقيقة عبر الفوركس والذهب والعملات الرقمية.",
    recent: "أداء الإشارات الأخير",
  },
  analysis: {
    title: "تحليل",
    highlight: "السوق",
    sub: "رؤى ذكية لقرارات تداول أقوى.",
    body: "يساعدك تحليل الفوركس على فهم الاتجاه المحتمل للزوج من خلال السعر والمؤشرات والسيكولوجية.",
  },
  videos: {
    kicker: "منصة تداول شاملة",
    title: "افهم",
    highlight1: "الأسواق،",
    highlight2: "أذكى",
    body: "تعلّم التداول بإرشاد الخبراء والتطبيق العملي.",
    cta: "انضم الآن",
  },
  forum: {
    title: "مجتمع المتداولين",
    body: "شارك الأفكار واسأل وانضم للنقاشات حول الفوركس والذهب والكربتو والأسهم.",
    feed: "تغذية المجتمع",
  },
  brokers: {
    title: "وسطاء موثوقون",
    body1: "نتعاون فقط مع وسطاء منظمين وذوي سمعة وفق أعلى المعايير.",
    subtitle: "مشكلة مع وسيط موصى به؟ قدّم بلاغًا.",
    body2: "إذا واجهت مشكلة مع وسيط، أرسل تقريرًا وسنراجعه.",
    report: "قدّم شكوى وسيط ←",
  },
  rewards: {
    kicker: "منصة تداول شاملة",
    title: "مكافآت الهدايا",
    accent: "شيء إضافي",
    body: "من الجوائز النقدية إلى المكافآت، نحوّل كل صفقة إلى تقدم.",
    cta: "انضم الآن",
  },
  contests: { heading: "مسابقة المهارات على الويب — لا نطلب أموالًا حقيقية!" },
  prop: {
    title: "مركز شركات التمويل",
    body: "قارن كاش باك التقييم والخصومات وتقسيم الأرباح.",
    s1t: "اختر شركة",
    s1d: "قارن البرامج والكاش باك والخصومات.",
    s2t: "اشترِ عبر رابط الشريك",
    s2d: "افتح الشركة من LegendPips لمطابقة الشراء.",
    s3t: "احصل على الكاش باك",
    s3d: "تظهر الأرصدة في My Rebates بعد التحقق.",
  },
  compare: {
    title: "مقارنة الوسطاء",
    body: "قارن التنظيم والفروقات والكاش باك والمراجعات جنبًا إلى جنب.",
    add: "أضف وسطاء",
  },
  complaints: {
    title: "مركز شكاوى الوسطاء",
    body: "أبلغ عن تأخير السحب أو شروط غير عادلة أو اشتباه احتيال.",
    sub: "قدّم بلاغًا · تتبّع الحالة · قائمة التحذير",
  },
  about: {
    kicker: "من نحن",
    title: "فريقنا",
    body: "تعرّف على فريق LegendPips من المتداولين والمحللين.",
    empty: "معلومات الفريق قريبًا.",
  },
  faq: { kicker: "أسئلة شائعة", title: "احصل على إجابات", body: "أسئلة شائعة لفهم المنصة." },
  why: { kicker: "منصة تداول شاملة", title: "لماذا نحن", body: "لماذا يثق بنا المتداولون حول العالم." },
  how: {
    kicker: "منصة تداول شاملة",
    title: "كيف يعمل",
    body: "تداول، اربح، كرّر مع الريبيتس والأدوات والمجتمع.",
    b1: "سجّل مجانًا واربط حساب التداول الحالي بأحد الوسطاء الشركاء.",
    b2: "استمر في التداول كالمعتاد — نعيد جزءًا من السبريد أو العمولة على كل صفقة.",
    b3: "تابع مكافآتك لحظيًا وشاهد الكاش باك ينمو.",
    b4: "شارك في المسابقات واستفد من الأدوات والإشارات والتحليل اليومي.",
    b5: "شارك في المنتدى: نصائح وأسئلة وتعلم مع متداولين آخرين.",
    c1t: "اربط وتداول",
    c1d: "اربط حسابك عبر Legend Pips دون تغيير الوسيط أو السبريد.",
    c2t: "اكسب الريبيتس",
    c2d: "احصل على كاش باك على كل صفقة مع الوسطاء المدعومين.",
    c3t: "طوّر مهاراتك",
    c3d: "ندفع لك بسرعة وببساطة وبدون رسوم خفية.",
    ctaTitle: "ليس لديك حساب؟",
    ctaSub: "أنشئ حساب LegendPips مجانًا وابدأ كسب الريبيتس اليوم.",
    ctaBtn: "سجّل مجانًا",
    bannerKicker: "منصة تداول شاملة",
    bannerTitle: "الكسب من كل صفقة لم يكن أسهل من ذلك.",
    bannerBody: "Legend Pips يعيد لك كاش باك دون تغيير وسيطك، مع أدوات وإشارات وحماية.",
  },
  community: { kicker: "منصة تداول شاملة", title: "نجاح مع مجتمعنا", body: "انضم لمجتمع الخبراء والمتعلمين." },
  common: { allInOne: "منصة تداول شاملة", joinNow: "انضم الآن" },
});

const es = fill({
  home: {
    kicker: "PLATAFORMA DE TRADING TODO EN UNO",
    title: "Compara brokers, gana cashback, recibe señales",
    topBrokers: "Nuestros mejores brokers",
    blurb: "Compra o venda: premiamos cada movimiento. Sin comisiones ocultas.",
    joinFree: "Únete gratis",
    compareBrokers: "Comparar brokers",
  },
  webinars: {
    title: "Trading en vivo",
    highlight: "Webinars",
    body: "Aprende de traders experimentados con sesiones en vivo y análisis de mercado. Pregunta, sigue explicaciones y aplica lo aprendido.",
  },
  courses: {
    title: "Entiende",
    highlight1: "los mercados,",
    highlight2: "mejor",
    subtitle: "Una plataforma de trading integral.",
    body: "Aprende a operar con guía experta y práctica.",
    cta: "Acceder ahora",
  },
  signals: {
    title: "SEÑALES EN VIVO",
    body: "Anticípate con señales precisas de Forex, Oro y Cripto en tiempo real.",
    recent: "Rendimiento reciente de señales",
  },
  analysis: {
    title: "Análisis",
    highlight: "de mercado",
    sub: "Ideas para decisiones de trading más sólidas.",
    body: "El análisis forex ayuda a estimar el siguiente movimiento del par.",
  },
  videos: {
    kicker: "PLATAFORMA DE TRADING TODO EN UNO",
    title: "Entiende",
    highlight1: "los mercados,",
    highlight2: "mejor",
    body: "Aprende trading con guía experta y práctica.",
    cta: "Únete ahora",
  },
  forum: {
    title: "COMUNIDAD DE TRADERS",
    body: "Comparte ideas, pregunta y debate Forex, Oro, Cripto, acciones e índices.",
    feed: "Feed de la comunidad",
  },
  brokers: {
    title: "Brokers de confianza",
    body1: "Solo colaboramos con brokers regulados y reputados.",
    subtitle: "¿Problema con un broker recomendado? Envía un informe.",
    body2: "Si tienes un problema, envía un informe detallado y lo revisaremos.",
    report: "Enviar queja de broker →",
  },
  rewards: {
    kicker: "PLATAFORMA DE TRADING TODO EN UNO",
    title: "Recompensas",
    accent: "algo más",
    body: "De premios en efectivo a bonos: cada operación suma.",
    cta: "Únete ahora",
  },
  contests: { heading: "Concurso de habilidades en la web — ¡nunca pedimos dinero real!" },
  prop: {
    title: "HUB DE PROP FIRMS",
    body: "Compara cashback de evaluaciones, descuentos y splits.",
    s1t: "Elige una firma",
    s1d: "Compara programas y cashback.",
    s2t: "Compra con enlace partner",
    s2d: "Ábrela desde LegendPips para vincular la compra.",
    s3t: "Recibe cashback",
    s3d: "Los créditos aparecen en My Rebates tras verificación.",
  },
  compare: {
    title: "COMPARACIÓN DE BROKERS",
    body: "Compara regulación, spreads, cashback y reseñas.",
    add: "Añadir brokers",
  },
  complaints: {
    title: "CENTRO DE QUEJAS",
    body: "Reporta retrasos de retiro, condiciones injustas o posibles estafas.",
    sub: "Enviar informe · Seguir estado · Lista de alerta",
  },
  about: {
    kicker: "SOBRE NOSOTROS",
    title: "Nuestro equipo",
    body: "Conoce al equipo de LegendPips.",
    empty: "Información del equipo pronto.",
  },
  faq: { kicker: "Preguntas frecuentes", title: "Obtén respuestas", body: "Preguntas comunes sobre la plataforma." },
  why: { kicker: "Plataforma todo en uno", title: "Por qué elegirnos", body: "Por qué traders de todo el mundo confían en nosotros." },
  how: { kicker: "Plataforma todo en uno", title: "Cómo funciona", body: "Opera, gana y repite con rebates y comunidad." },
  community: { kicker: "Plataforma todo en uno", title: "Éxito con la comunidad", body: "Únete a expertos y aprendices." },
  common: { allInOne: "PLATAFORMA DE TRADING TODO EN UNO", joinNow: "Únete ahora" },
});

const pt = fill({
  home: {
    kicker: "PLATAFORMA DE TRADING COMPLETA",
    title: "Compare corretoras, ganhe cashback, receba sinais",
    topBrokers: "Nossas melhores corretoras",
    blurb: "Compre ou venda: recompensamos cada movimento. Sem taxas ocultas.",
    joinFree: "Entrar grátis",
    compareBrokers: "Comparar corretoras",
  },
  webinars: {
    title: "Trading ao vivo",
    highlight: "Webinars",
    body: "Aprenda com traders experientes em sessões ao vivo e análises de mercado. Pergunte e aplique no seu trading.",
  },
  courses: {
    title: "Entenda",
    highlight1: "os mercados,",
    highlight2: "melhor",
    subtitle: "Uma plataforma completa de trading.",
    body: "Aprenda a operar com orientação e prática.",
    cta: "Aceder agora",
  },
  signals: {
    title: "SINAIS AO VIVO",
    body: "Fique à frente com sinais precisos de Forex, Ouro e Cripto em tempo real.",
    recent: "Desempenho recente dos sinais",
  },
  analysis: {
    title: "Análise",
    highlight: "de mercado",
    sub: "Insights para decisões mais fortes.",
    body: "A análise forex ajuda a entender o próximo movimento do par.",
  },
  videos: {
    kicker: "PLATAFORMA DE TRADING COMPLETA",
    title: "Entenda",
    highlight1: "os mercados,",
    highlight2: "melhor",
    body: "Aprenda trading com orientação e prática.",
    cta: "Entrar agora",
  },
  forum: {
    title: "COMUNIDADE DE TRADERS",
    body: "Partilhe ideias e discuta Forex, Ouro, Cripto, ações e índices.",
    feed: "Feed da comunidade",
  },
  brokers: {
    title: "Corretoras de confiança",
    body1: "Parceria apenas com corretoras reguladas e reputadas.",
    subtitle: "Problema com uma corretora? Envie um relatório.",
    body2: "Envie um relatório detalhado e a nossa equipa analisa.",
    report: "Enviar reclamação →",
  },
  rewards: {
    kicker: "PLATAFORMA DE TRADING COMPLETA",
    title: "Recompensas",
    accent: "algo a mais",
    body: "De prémios em dinheiro a bónus: cada operação conta.",
    cta: "Entrar agora",
  },
  contests: { heading: "Concurso de competências na web — nunca pedimos dinheiro real!" },
  prop: {
    title: "HUB DE PROP FIRMS",
    body: "Compare cashback de avaliações, descontos e splits.",
    s1t: "Escolha uma firma",
    s1d: "Compare programas e cashback.",
    s2t: "Compre pelo link parceiro",
    s2d: "Abra pela LegendPips para associar a compra.",
    s3t: "Receba cashback",
    s3d: "Os créditos aparecem em My Rebates após verificação.",
  },
  compare: {
    title: "COMPARAÇÃO DE CORRETORAS",
    body: "Compare regulação, spreads, cashback e avaliações.",
    add: "Adicionar corretoras",
  },
  complaints: {
    title: "CENTRO DE RECLAMAÇÕES",
    body: "Reporte atrasos de levantamento, condições injustas ou possível fraude.",
    sub: "Enviar relatório · Acompanhar · Lista de alerta",
  },
  about: {
    kicker: "SOBRE NÓS",
    title: "A nossa equipa",
    body: "Conheça a equipa da LegendPips.",
    empty: "Informação da equipa em breve.",
  },
  faq: { kicker: "Perguntas frequentes", title: "Obtenha respostas", body: "Perguntas comuns sobre a plataforma." },
  why: { kicker: "Plataforma completa", title: "Porquê nós", body: "Porque traders em todo o mundo confiam em nós." },
  how: { kicker: "Plataforma completa", title: "Como funciona", body: "Opere, ganhe e repita com rebates e comunidade." },
  community: { kicker: "Plataforma completa", title: "Sucesso com a comunidade", body: "Junte-se a especialistas e aprendizes." },
  common: { allInOne: "PLATAFORMA DE TRADING COMPLETA", joinNow: "Entrar agora" },
});

const id = fill({
  webinars: {
    title: "Trading langsung",
    highlight: "Webinar",
    body: "Belajar dari trader berpengalaman lewat sesi langsung dan breakdown pasar. Tanya, ikuti penjelasan, dan terapkan di trading Anda.",
  },
  home: {
    kicker: "PLATFORM TRADING SERBA ADA",
    title: "Bandingkan broker, dapatkan cashback, terima sinyal",
    topBrokers: "Broker teratas kami",
    blurb: "Beli atau jual, setiap pergerakan dihargai. Tanpa biaya tersembunyi.",
    joinFree: "Gabung gratis",
    compareBrokers: "Bandingkan broker",
  },
});

const vi = fill({
  webinars: {
    title: "Giao dịch trực tiếp",
    highlight: "Webinar",
    body: "Học từ trader giàu kinh nghiệm qua buổi trực tiếp và phân tích thị trường. Đặt câu hỏi và áp dụng vào giao dịch của bạn.",
  },
  home: {
    kicker: "NỀN TẢNG GIAO DỊCH TẤT CẢ TRONG MỘT",
    title: "So sánh sàn, nhận cashback, nhận tín hiệu",
    topBrokers: "Sàn hàng đầu",
    blurb: "Mua hay bán, mỗi lệnh đều được thưởng. Không phí ẩn.",
    joinFree: "Tham gia miễn phí",
    compareBrokers: "So sánh sàn",
  },
});

const fr = fill({
  webinars: {
    title: "Trading en direct",
    highlight: "Webinaires",
    body: "Apprenez auprès de traders expérimentés lors de sessions live et d’analyses de marché. Posez des questions et appliquez ces insights.",
  },
  home: {
    kicker: "PLATEFORME DE TRADING TOUT-EN-UN",
    title: "Comparez les courtiers, gagnez du cashback, recevez des signaux",
    topBrokers: "Nos meilleurs courtiers",
    blurb: "Achat ou vente : chaque mouvement est récompensé. Sans frais cachés.",
    joinFree: "Rejoindre gratuitement",
    compareBrokers: "Comparer les courtiers",
  },
});

const tr = fill({
  webinars: {
    title: "Canlı işlem",
    highlight: "Webinarlar",
    body: "Deneyimli traderlardan canlı oturumlar ve piyasa analizleriyle öğrenin. Sorun sorun ve kendi işleminize uygulayın.",
  },
  home: {
    kicker: "HEPSİ BİR ARADA İŞLEM PLATFORMU",
    title: "Broker karşılaştır, cashback kazan, sinyal al",
    topBrokers: "En iyi brokerlarımız",
    blurb: "Alın veya satın: her işlem ödüllendirilir. Gizli ücret yok.",
    joinFree: "Ücretsiz katıl",
    compareBrokers: "Broker karşılaştır",
  },
});

export const PAGE_COPY: Record<LocaleCode, PageCopy> = {
  en,
  ar,
  es,
  pt,
  id,
  vi,
  fr,
  tr,
  ur,
};
