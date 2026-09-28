import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBookmark,
  FiCheck,
  FiChevronDown,
  FiChevronRight,
  FiInfo,
} from "react-icons/fi";
import { fetchBrokersPage, type ApiBroker } from "../../services/brokerService";
import { filterMatcherCountries, MATCHER_COUNTRIES } from "../../data/matcherCountries";
import { normalizeBrokerLogoUrl } from "../../utils/brokerLogoUrl";

const TOTAL_STEPS = 6;
const TOP_N = 12;
const POOL_LIMIT = 100;
const SAVE_KEY = "legendpips_broker_toplist";

type AssetId =
  | "stocks"
  | "forex"
  | "options"
  | "futures"
  | "funds"
  | "bonds"
  | "cfds"
  | "cryptos"
  | "unknown";

type ExperienceId = "first" | "simple" | "experienced" | "pro";
type CostId = "services" | "lowfees" | "zero" | "unknown";
type FrequencyId = "daily" | "weekly" | "monthly" | "yearly" | "unknown";
type DepositId =
  | "lt50"
  | "51_200"
  | "201_500"
  | "501_1000"
  | "1001_2000"
  | "2001_50k"
  | "50k_300k"
  | "300k_500k"
  | "gt500k"
  | "unknown";

type Answers = {
  country: string;
  assets: AssetId[];
  experience?: ExperienceId;
  cost?: CostId;
  frequency?: FrequencyId;
  deposit?: DepositId;
};

const ASSET_OPTIONS: { id: AssetId; label: string; hint: string }[] = [
  { id: "stocks", label: "Stocks and ETFs", hint: "e.g. Apple or Tesla shares" },
  { id: "forex", label: "Forex", hint: "e.g. EURUSD or GBPUSD" },
  { id: "options", label: "Options", hint: "e.g. Apple call option" },
  { id: "futures", label: "Futures", hint: "e.g. e-mini S&P 500 futures" },
  { id: "funds", label: "Funds", hint: "e.g. equity dividend funds" },
  { id: "bonds", label: "Bonds", hint: "e.g. US treasuries" },
  { id: "cfds", label: "CFDs", hint: "e.g. Apple share CFD" },
  { id: "cryptos", label: "Cryptos", hint: "e.g. Bitcoin or Ethereum" },
  { id: "unknown", label: "I don't know", hint: "" },
];

const EXPERIENCE_OPTIONS: { id: ExperienceId; label: React.ReactNode }[] = [
  { id: "first", label: <>I am a <strong>first-timer</strong> with no experience</> },
  { id: "simple", label: <>I've already made a few <strong>simple transactions</strong></> },
  { id: "experienced", label: <>I <strong>have experience</strong> with various products and strategies</> },
  { id: "pro", label: <>I am a <strong>professional</strong> and fully confident</> },
];

const COST_OPTIONS: { id: CostId; label: React.ReactNode }[] = [
  { id: "services", label: <>I'm fine with reasonable fees if the <strong>services are exceptional</strong></> },
  { id: "lowfees", label: <>I want to <strong>pay as little as possible</strong> in fees</> },
  { id: "zero", label: <>I want a <strong>zero-commission</strong> broker</> },
  { id: "unknown", label: <>I don't know</> },
];

const FREQUENCY_OPTIONS: { id: FrequencyId; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
  { id: "unknown", label: "I don't know" },
];

const DEPOSIT_OPTIONS: { id: DepositId; label: string; max?: number }[] = [
  { id: "lt50", label: "Less than $50", max: 50 },
  { id: "51_200", label: "$51 – $200", max: 200 },
  { id: "201_500", label: "$201 – $500", max: 500 },
  { id: "501_1000", label: "$501 – $1,000", max: 1000 },
  { id: "1001_2000", label: "$1,001 – $2,000", max: 2000 },
  { id: "2001_50k", label: "$2,001 – $50,000", max: 50000 },
  { id: "50k_300k", label: "$50,001 – $300,000", max: 300000 },
  { id: "300k_500k", label: "$300,001 – $500,000", max: 500000 },
  { id: "gt500k", label: "More than $500,000" },
  { id: "unknown", label: "I don't know" },
];

const WHY: Record<number, string> = {
  1: "Regulation, payment methods, and available brokers change by country. Matching on your location helps us show brokers more likely to accept clients from where you live.",
  2: "Asset coverage varies widely. Knowing what you want to trade helps us prioritise brokers that actually support those markets.",
  3: "Beginners usually need clearer education and lower barriers; experienced traders may prefer advanced platforms and instruments.",
  4: "Fees, spreads, and commissions affect long-term results. Your cost preference reshapes which brokers rank highest.",
  5: "Active traders benefit from tighter spreads and fast execution; occasional investors may prefer simpler products.",
  6: "Minimum deposit requirements differ. We boost brokers that fit the amount you plan to fund with.",
};

function countryMatches(b: ApiBroker, country: string): boolean {
  if (!country.trim()) return false;
  const rx = new RegExp(country.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  const hay = [b.country, ...(b.servedCountries || [])].filter(Boolean).join(" ");
  return rx.test(hay);
}

function scoreBroker(b: ApiBroker, a: Answers): number {
  let score = 0;
  if (a.country && countryMatches(b, a.country)) score += 12;
  else if (a.country) score += 1;

  const blob = [
    b.name,
    b.description,
    b.rebateCategory,
    b.crypto,
    ...(b.features || []),
    ...(b.accountTypes || []).map((t) => `${t.name} ${t.platform || ""}`),
  ]
    .join(" ")
    .toLowerCase();

  const assets = a.assets.filter((x) => x !== "unknown");
  if (assets.length) {
    for (const asset of assets) {
      if (asset === "forex" && (/forex|fx|currency/.test(blob) || b.rebateCategory === "forex" || b.rebateCategory === "both"))
        score += 4;
      if (asset === "cryptos" && (/crypto|bitcoin|ethereum|btc|eth/.test(blob) || b.crypto?.toLowerCase() === "yes" || b.rebateCategory === "crypto" || b.rebateCategory === "both"))
        score += 4;
      if (asset === "cfds" && /cfd/.test(blob)) score += 3;
      if (asset === "stocks" && /stock|etf|share|equity/.test(blob)) score += 3;
      if (asset === "options" && /option/.test(blob)) score += 3;
      if (asset === "futures" && /future/.test(blob)) score += 3;
      if (asset === "funds" && /fund|mutual/.test(blob)) score += 2;
      if (asset === "bonds" && /bond|treasury/.test(blob)) score += 2;
    }
  }

  if (a.experience === "first" || a.experience === "simple") {
    if (b.forBeginners) score += 5;
    score += Math.max(0, 4 - (Number(b.minDeposit) || 0) / 100);
  }
  if (a.experience === "experienced" || a.experience === "pro") {
    if (!b.forBeginners) score += 2;
    if (/mt5|ctrader|pro|raw/.test(blob)) score += 2;
  }

  const cash = (b.cashbackRate || "").toLowerCase();
  const commission = (b.commission || "").toLowerCase();
  if (a.cost === "lowfees" || a.cost === "zero") {
    if (/0|zero|free|no commission/.test(commission) || /high|best|top/.test(cash)) score += 4;
    score += Math.max(0, 3 - (Number(b.minDeposit) || 0) / 200);
  }
  if (a.cost === "services") {
    if (b.verified || b.rebatesFeatured || b.topCashback) score += 3;
    if ((b.reviewStats?.average || b.rebatesStarRating || 0) >= 4) score += 2;
  }

  if (a.frequency === "daily" || a.frequency === "weekly") {
    if (/raw|ecn|spread|scalp|mt4|mt5/.test(blob)) score += 3;
  }
  if (a.frequency === "monthly" || a.frequency === "yearly") {
    if (b.forBeginners) score += 2;
  }

  const deposit = Number(b.minDeposit) || 0;
  const depOpt = DEPOSIT_OPTIONS.find((d) => d.id === a.deposit);
  if (depOpt?.max != null) {
    if (deposit <= depOpt.max) score += 6;
    else if (deposit <= depOpt.max * 1.5) score += 2;
    else score -= 2;
  } else if (a.deposit === "gt500k") {
    score += 2;
  }

  score += b.rebatesFeatured || b.topCashback ? 2 : 0;
  score += b.verified ? 1 : 0;
  score += Math.min(3, b.reviewStats?.count || 0) * 0.15;
  return score;
}

function rankBrokers(pool: ApiBroker[], answers: Answers): ApiBroker[] {
  return [...pool]
    .map((b) => ({ b, s: scoreBroker(b, answers) }))
    .sort((a, c) => c.s - a.s || String(a.b.name).localeCompare(String(c.b.name)))
    .map((x) => x.b);
}

/* ——— styles (LegendPips theme) ——— */

const Page = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 1.25rem ${({ theme }) => theme.typography.pageGutter} 3rem;
`;

const ProgressHead = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem 1rem;
  margin-bottom: 1.1rem;
`;

const ProgressLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
  white-space: nowrap;
`;

const Segments = styled.div`
  display: grid;
  grid-template-columns: repeat(${TOTAL_STEPS + 1}, 1fr);
  gap: 0.35rem;
`;

const Segment = styled.div<{ $state: "done" | "active" | "todo" | "final" }>`
  height: 7px;
  border-radius: 999px;
  background: ${({ $state, theme }) =>
    $state === "done" || $state === "active"
      ? theme.colors.primary
      : $state === "final"
        ? "#22c55e"
        : "#e2e8f0"};
  opacity: ${({ $state }) => ($state === "active" ? 1 : $state === "done" || $state === "final" ? 0.95 : 1)};
`;

const Grid = styled.div<{ $twoCol?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $twoCol }) => ($twoCol ? "minmax(0, 1.15fr) minmax(260px, 0.85fr)" : "1fr")};
  gap: 1.15rem;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.section<{ $accent?: "green" | "none" }>`
  background: #fff;
  border: 1px solid ${({ $accent }) => ($accent === "green" ? "#86efac" : "#e8ebf0")};
  border-radius: 16px;
  padding: 1.25rem 1.3rem 1.35rem;
  box-shadow: 0 12px 28px rgba(19, 46, 88, 0.06);
`;

const StepEyebrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.55rem;
`;

const StepTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const FinalTag = styled(StepTag)`
  background: #16a34a;
`;

const WhyBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-family: inherit;

  &:hover {
    text-decoration: underline;
  }
`;

const Question = styled.h1`
  margin: 0 0 1rem;
  font-size: clamp(1.2rem, 1.5vw + 0.85rem, 1.55rem);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.02em;
  line-height: 1.3;
`;

const WhyBox = styled.p`
  margin: 0 0 1rem;
  padding: 0.7rem 0.8rem;
  border-radius: 10px;
  background: #f0f5ff;
  border: 1px solid #dbe4f5;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.muted};
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.45rem;
`;

const ComboboxWrap = styled.div`
  position: relative;
  margin-bottom: 1.15rem;
`;

const CountryInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.85rem 2.5rem 0.85rem 0.95rem;
  border-radius: 10px;
  border: 1.5px solid #dbe3ef;
  background: #fff;
  font-family: inherit;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.12);
  }
`;

const InputChevron = styled.span`
  position: absolute;
  right: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
  display: flex;
`;

const SuggestList = styled.ul`
  position: absolute;
  z-index: 20;
  left: 0;
  right: 0;
  top: calc(100% + 4px);
  margin: 0;
  padding: 0.35rem;
  list-style: none;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
  max-height: 240px;
  overflow: auto;
`;

const SuggestItem = styled.li`
  button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.55rem;
    border: none;
    background: transparent;
    text-align: left;
    padding: 0.55rem 0.65rem;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;

    &:hover,
    &[data-active="true"] {
      background: #f0f5ff;
    }
  }
`;

const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1.25rem;
`;

const OptionRow = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  width: 100%;
  text-align: left;
  border: 1.5px solid ${({ $active, theme }) => ($active ? theme.colors.secondary : "#e8ebf0")};
  background: ${({ $active }) => ($active ? "#f0f5ff" : "#fff")};
  border-radius: 12px;
  padding: 0.75rem 0.85rem;
  cursor: pointer;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.primary};
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary};
  }

  strong {
    font-weight: 800;
  }
`;

const RadioDot = styled.span<{ $active?: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${({ $active, theme }) => ($active ? theme.colors.secondary : "#cbd5e1")};
  flex-shrink: 0;
  margin-top: 1px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $active, theme }) => ($active ? theme.colors.secondary : "transparent")};
  }
`;

const CheckBox = styled.span<{ $active?: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 2px solid ${({ $active, theme }) => ($active ? theme.colors.secondary : "#cbd5e1")};
  background: ${({ $active, theme }) => ($active ? theme.colors.secondary : "#fff")};
  color: #fff;
  flex-shrink: 0;
  margin-top: 1px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
`;

const OptionText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.35;

  small {
    font-size: 0.75rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const NavRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.25rem;
`;

const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.muted};
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0.5rem 0;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const PrimaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.8rem 1.25rem;
  border: none;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(19, 46, 88, 0.22);
  transition: opacity 0.15s ease, transform 0.15s ease;

  &:hover:not(:disabled) {
    opacity: 0.94;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #cbd5e1;
    box-shadow: none;
    cursor: not-allowed;
    color: #64748b;
  }
`;

const TipBanner = styled.div`
  margin-top: 1.15rem;
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  background: #eef4ff;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.8125rem;
  line-height: 1.45;
  font-weight: 600;
`;

const ResultsHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const ResultsTitle = styled.h2`
  margin: 0;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
`;

const SaveMini = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border: 1px solid #dbe3ef;
  background: #fff;
  border-radius: 8px;
  padding: 0.35rem 0.55rem;
  font-family: inherit;
  font-size: 0.7rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const List = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Row = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.65rem 0.15rem;
  border-top: 1px solid #f1f3f6;
  text-decoration: none;
  color: inherit;

  &:first-child {
    border-top: none;
  }

  &:hover .name {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const Rank = styled.span<{ $n: number }>`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 800;
  flex-shrink: 0;
  background: ${({ $n }) =>
    $n === 1 ? "#fbbf24" : $n === 2 ? "#fdba74" : $n === 3 ? "#fde68a" : "#f1f5f9"};
  color: #0f172a;
`;

const Logo = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: contain;
  background: #f8fafc;
  border: 1px solid #eef2f7;
  flex-shrink: 0;
`;

const LogoFallback = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.gold};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 800;
  flex-shrink: 0;
`;

const Name = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Empty = styled.div`
  padding: 1rem 0.25rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.8125rem;
  line-height: 1.55;
`;

const DoneWrap = styled.div`
  text-align: center;
  padding: 1.5rem 0.5rem 0.5rem;
`;

const Confetti = styled.div`
  width: 88px;
  height: 88px;
  margin: 0 auto 1rem;
  border-radius: 24px;
  background: linear-gradient(145deg, #132e58 0%, #1d4ed8 55%, #38bdf8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.25rem;
  box-shadow: 0 16px 32px rgba(19, 46, 88, 0.25);
`;

const DoneTitle = styled.h2`
  margin: 0 0 0.45rem;
  font-size: 1.65rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const DoneSub = styled.p`
  margin: 0 auto 1.35rem;
  max-width: 28rem;
  font-size: 0.9rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.muted};
`;

const SavedToast = styled.div`
  margin-top: 0.75rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #16a34a;
`;

const CountryBrokerMatcherPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [answers, setAnswers] = useState<Answers>({ country: "", assets: [] });
  const [countryQuery, setCountryQuery] = useState("");
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [activeSuggest, setActiveSuggest] = useState(0);
  const [pool, setPool] = useState<ApiBroker[]>([]);
  const [loadingPool, setLoadingPool] = useState(false);
  const [poolError, setPoolError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const comboboxRef = useRef<HTMLDivElement | null>(null);

  const suggestions = useMemo(
    () => filterMatcherCountries(countryQuery, 10),
    [countryQuery]
  );

  const selectedCountryMeta = useMemo(
    () => MATCHER_COUNTRIES.find((c) => c.name.toLowerCase() === answers.country.toLowerCase()) || null,
    [answers.country]
  );

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!comboboxRef.current?.contains(e.target as Node)) setSuggestOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (step < 2 && !done) return;
    let cancelled = false;
    (async () => {
      setLoadingPool(true);
      setPoolError(null);
      try {
        // Prefer country-tagged matches; fall back to full published pool so results aren't stuck at 7–8.
        const country = answers.country.trim();
        const primary = await fetchBrokersPage({
          country: country || undefined,
          page: 1,
          limit: POOL_LIMIT,
        });
        let items = primary.items || [];
        if (items.length < 8) {
          const all = await fetchBrokersPage({ page: 1, limit: POOL_LIMIT });
          const seen = new Set(items.map((b) => b._id));
          for (const b of all.items || []) {
            if (!seen.has(b._id)) items.push(b);
          }
        }
        if (!cancelled) setPool(items);
      } catch (e: unknown) {
        if (!cancelled) {
          setPool([]);
          setPoolError(e instanceof Error ? e.message : "Could not load brokers");
        }
      } finally {
        if (!cancelled) setLoadingPool(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [step, done, answers.country]);

  const ranked = useMemo(() => rankBrokers(pool, answers).slice(0, TOP_N), [pool, answers]);

  const canNext = useMemo(() => {
    if (step === 1) return Boolean(answers.country.trim());
    if (step === 2) return answers.assets.length > 0;
    if (step === 3) return Boolean(answers.experience);
    if (step === 4) return Boolean(answers.cost);
    if (step === 5) return Boolean(answers.frequency);
    if (step === 6) return Boolean(answers.deposit);
    return false;
  }, [step, answers]);

  const pickCountry = (name: string) => {
    setAnswers((prev) => ({ ...prev, country: name }));
    setCountryQuery(name);
    setSuggestOpen(false);
  };

  const toggleAsset = (id: AssetId) => {
    setAnswers((prev) => {
      if (id === "unknown") return { ...prev, assets: ["unknown"] };
      const withoutUnknown = prev.assets.filter((a) => a !== "unknown");
      const next = withoutUnknown.includes(id)
        ? withoutUnknown.filter((a) => a !== id)
        : [...withoutUnknown, id];
      return { ...prev, assets: next };
    });
  };

  const goNext = () => {
    if (!canNext) return;
    if (step >= TOTAL_STEPS) {
      setDone(true);
      return;
    }
    setShowWhy(false);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setSaved(false);
    if (done) {
      setDone(false);
      return;
    }
    if (step <= 1) return;
    setShowWhy(false);
    setStep((s) => s - 1);
  };

  const saveToplist = () => {
    try {
      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify({
          savedAt: new Date().toISOString(),
          answers,
          ids: ranked.map((b) => b._id),
          names: ranked.map((b) => b.name),
        })
      );
      setSaved(true);
    } catch {
      setSaved(false);
    }
  };

  const showSidebar = step >= 2 || done;

  const progressSegments = Array.from({ length: TOTAL_STEPS + 1 }, (_, i) => {
    const n = i + 1;
    if (done) return n <= TOTAL_STEPS ? "done" : "final";
    if (n === TOTAL_STEPS + 1) return "todo";
    if (n < step) return "done";
    if (n === step) return "active";
    return "todo";
  }) as Array<"done" | "active" | "todo" | "final">;

  const renderBrokerList = (final?: boolean) => (
    <>
      <ResultsHead>
        {final ? (
          <FinalTag>Final result</FinalTag>
        ) : (
          <ResultsTitle>
            Your result <FiInfo size={13} />
          </ResultsTitle>
        )}
        {(done || step >= 2) && ranked.length > 0 && (
          <SaveMini type="button" onClick={saveToplist}>
            <FiBookmark size={12} /> Save
          </SaveMini>
        )}
      </ResultsHead>

      {loadingPool && <Empty>Finding brokers that fit your answers…</Empty>}
      {poolError && <Empty>{poolError}</Empty>}
      {!loadingPool && !poolError && ranked.length === 0 && (
        <Empty>
          No strong matches yet. Keep answering — or browse{" "}
          <Link to="/rebates">all rebate brokers</Link>.
        </Empty>
      )}
      {!loadingPool && ranked.length > 0 && (
        <List>
          {ranked.map((b, i) => (
            <li key={b._id}>
              <Row to={`/rebates/broker/${b._id}`}>
                <Rank $n={i + 1}>{i + 1}</Rank>
                {normalizeBrokerLogoUrl(b.logoUrl) ? (
                  <Logo src={normalizeBrokerLogoUrl(b.logoUrl)!} alt="" />
                ) : (
                  <LogoFallback>{b.name.slice(0, 2).toUpperCase()}</LogoFallback>
                )}
                <Name className="name">{b.name}</Name>
                <FiChevronRight color="#94a3b8" />
              </Row>
            </li>
          ))}
        </List>
      )}
    </>
  );

  return (
    <Page>
      <ProgressHead>
        <ProgressLabel>
          Basic Preferences ({done ? TOTAL_STEPS : step}/{TOTAL_STEPS})
        </ProgressLabel>
        <Segments aria-hidden>
          {progressSegments.map((state, i) => (
            <Segment key={i} $state={state} />
          ))}
        </Segments>
        <ProgressLabel>Final result</ProgressLabel>
      </ProgressHead>

      <Grid $twoCol={showSidebar}>
        <Panel $accent={done ? "green" : "none"}>
          {done ? (
            <DoneWrap>
              <Confetti aria-hidden>🎉</Confetti>
              <DoneTitle>You're All Set!</DoneTitle>
              <DoneSub>
                Click on a broker now to learn more or open an account, or save your list for later.
              </DoneSub>
              <NavRow>
                <BackLink type="button" onClick={goBack}>
                  <FiArrowLeft /> Back
                </BackLink>
                <PrimaryBtn type="button" onClick={saveToplist}>
                  <FiBookmark /> Save my toplist
                </PrimaryBtn>
              </NavRow>
              {saved && <SavedToast>Toplist saved on this device.</SavedToast>}
            </DoneWrap>
          ) : (
            <>
              <StepEyebrow>
                <StepTag>Step {step}</StepTag>
                <WhyBtn type="button" onClick={() => setShowWhy((v) => !v)}>
                  <FiInfo size={14} /> Why it matters
                </WhyBtn>
              </StepEyebrow>

              {showWhy && <WhyBox>{WHY[step]}</WhyBox>}

              {step === 1 && (
                <>
                  <Question>Where do you live?</Question>
                  <FieldLabel htmlFor="matcher-country">Please select your country</FieldLabel>
                  <ComboboxWrap ref={comboboxRef}>
                    <CountryInput
                      id="matcher-country"
                      role="combobox"
                      aria-expanded={suggestOpen}
                      aria-autocomplete="list"
                      aria-controls="country-suggestions"
                      autoComplete="off"
                      placeholder="Start typing your country…"
                      value={countryQuery}
                      onChange={(e) => {
                        const v = e.target.value;
                        setCountryQuery(v);
                        setSuggestOpen(true);
                        setActiveSuggest(0);
                        const exact = MATCHER_COUNTRIES.find(
                          (c) => c.name.toLowerCase() === v.trim().toLowerCase()
                        );
                        setAnswers((prev) => ({ ...prev, country: exact ? exact.name : "" }));
                      }}
                      onFocus={() => setSuggestOpen(true)}
                      onKeyDown={(e) => {
                        if (!suggestOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
                          setSuggestOpen(true);
                          return;
                        }
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          setActiveSuggest((i) => Math.min(i + 1, suggestions.length - 1));
                        } else if (e.key === "ArrowUp") {
                          e.preventDefault();
                          setActiveSuggest((i) => Math.max(i - 1, 0));
                        } else if (e.key === "Enter" && suggestions[activeSuggest]) {
                          e.preventDefault();
                          pickCountry(suggestions[activeSuggest].name);
                        } else if (e.key === "Escape") {
                          setSuggestOpen(false);
                        }
                      }}
                    />
                    <InputChevron>
                      <FiChevronDown size={16} />
                    </InputChevron>
                    {suggestOpen && suggestions.length > 0 && (
                      <SuggestList id="country-suggestions" role="listbox">
                        {suggestions.map((c, i) => (
                          <SuggestItem key={c.code} role="option" aria-selected={i === activeSuggest}>
                            <button
                              type="button"
                              data-active={i === activeSuggest}
                              onMouseEnter={() => setActiveSuggest(i)}
                              onClick={() => pickCountry(c.name)}
                            >
                              <span aria-hidden>{c.flag}</span>
                              {c.name}
                            </button>
                          </SuggestItem>
                        ))}
                      </SuggestList>
                    )}
                  </ComboboxWrap>
                  {selectedCountryMeta && (
                    <TipBanner>
                      Matching for {selectedCountryMeta.flag} {selectedCountryMeta.name}. Future you will be
                      grateful for starting this tool!
                    </TipBanner>
                  )}
                  <NavRow style={{ marginTop: "1.15rem", justifyContent: "flex-start" }}>
                    <PrimaryBtn type="button" disabled={!canNext} onClick={goNext}>
                      Start matching <FiArrowRight />
                    </PrimaryBtn>
                  </NavRow>
                </>
              )}

              {step === 2 && (
                <>
                  <Question>Choose the most important assets for you!</Question>
                  <OptionList>
                    {ASSET_OPTIONS.map((opt) => {
                      const active = answers.assets.includes(opt.id);
                      return (
                        <OptionRow
                          key={opt.id}
                          type="button"
                          $active={active}
                          onClick={() => toggleAsset(opt.id)}
                        >
                          <CheckBox $active={active}>{active ? <FiCheck /> : null}</CheckBox>
                          <OptionText>
                            {opt.label}
                            {opt.hint ? <small>{opt.hint}</small> : null}
                          </OptionText>
                        </OptionRow>
                      );
                    })}
                  </OptionList>
                </>
              )}

              {step === 3 && (
                <>
                  <Question>How familiar are you with trading and investing?</Question>
                  <OptionList>
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <OptionRow
                        key={opt.id}
                        type="button"
                        $active={answers.experience === opt.id}
                        onClick={() => setAnswers((p) => ({ ...p, experience: opt.id }))}
                      >
                        <RadioDot $active={answers.experience === opt.id} />
                        <OptionText>{opt.label}</OptionText>
                      </OptionRow>
                    ))}
                  </OptionList>
                </>
              )}

              {step === 4 && (
                <>
                  <Question>Brokers charge fees, not just for trading. How cost conscious are you?</Question>
                  <OptionList>
                    {COST_OPTIONS.map((opt) => (
                      <OptionRow
                        key={opt.id}
                        type="button"
                        $active={answers.cost === opt.id}
                        onClick={() => setAnswers((p) => ({ ...p, cost: opt.id }))}
                      >
                        <RadioDot $active={answers.cost === opt.id} />
                        <OptionText>{opt.label}</OptionText>
                      </OptionRow>
                    ))}
                  </OptionList>
                </>
              )}

              {step === 5 && (
                <>
                  <Question>How often do you want to deal with your investments and trades?</Question>
                  <OptionList>
                    {FREQUENCY_OPTIONS.map((opt) => (
                      <OptionRow
                        key={opt.id}
                        type="button"
                        $active={answers.frequency === opt.id}
                        onClick={() => setAnswers((p) => ({ ...p, frequency: opt.id }))}
                      >
                        <RadioDot $active={answers.frequency === opt.id} />
                        <OptionText>{opt.label}</OptionText>
                      </OptionRow>
                    ))}
                  </OptionList>
                </>
              )}

              {step === 6 && (
                <>
                  <Question>How much money would you like to deposit?</Question>
                  <OptionList>
                    {DEPOSIT_OPTIONS.map((opt) => (
                      <OptionRow
                        key={opt.id}
                        type="button"
                        $active={answers.deposit === opt.id}
                        onClick={() => setAnswers((p) => ({ ...p, deposit: opt.id }))}
                      >
                        <RadioDot $active={answers.deposit === opt.id} />
                        <OptionText>{opt.label}</OptionText>
                      </OptionRow>
                    ))}
                  </OptionList>
                </>
              )}

              {step >= 2 && (
                <NavRow>
                  <BackLink type="button" onClick={goBack}>
                    <FiArrowLeft /> Back
                  </BackLink>
                  <PrimaryBtn type="button" disabled={!canNext} onClick={goNext}>
                    Next <FiArrowRight />
                  </PrimaryBtn>
                </NavRow>
              )}
            </>
          )}
        </Panel>

        {showSidebar && (
          <Panel $accent={done ? "green" : "none"}>{renderBrokerList(done)}</Panel>
        )}
      </Grid>
    </Page>
  );
};

export default CountryBrokerMatcherPage;
