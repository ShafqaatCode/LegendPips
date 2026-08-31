import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiChevronRight, FiX } from "react-icons/fi";
import { fetchBeginnerBrokers, type ApiBroker } from "../../services/brokerService";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";
import ButtonBase from "../SharedComponents/Button";
import ArrowIcon from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg";

type Props = {
  /** Max ranked rows to show */
  limit?: number;
  /** Compact card, page column, or full homepage section */
  variant?: "card" | "page" | "home";
  className?: string;
};

const Shell = styled.section<{ $variant: "card" | "page" | "home" }>`
  width: 100%;
  max-width: ${({ $variant }) =>
    $variant === "home" ? "none" : $variant === "page" ? "420px" : "380px"};
  margin: ${({ $variant }) => ($variant === "home" ? "0" : "0 auto")};
`;

const HomeBand = styled.div`
  padding: 2.75rem ${({ theme }) => theme.typography.pageGutter} 3rem;
  background:
    radial-gradient(ellipse 80% 60% at 10% 0%, rgba(251, 191, 36, 0.12), transparent 55%),
    linear-gradient(165deg, #0f2448 0%, #132e58 48%, #0c1f3d 100%);
  color: #fff;
`;

const HomeInner = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(260px, 0.85fr);
  gap: 1.5rem 2rem;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }

  /* SectionHeadingSet is dark-text by default — invert for navy band */
  & > :first-child {
    grid-column: 1 / -1;
    margin-bottom: 0.35rem;

    h2,
    h3,
    p,
    span {
      color: #fff !important;
    }
    img {
      filter: brightness(0) invert(1);
      opacity: 0.9;
    }
  }
`;

const HomeListPanel = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(251, 191, 36, 0.22);
  border-radius: 16px;
  padding: 0.35rem 0.85rem 0.5rem;
  backdrop-filter: blur(6px);
`;

const HomeAside = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 1.35rem 1.25rem 1.4rem;
  color: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 18px 40px rgba(8, 20, 40, 0.28);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const AsideTitle = styled.h3`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.02em;
`;

const AsideText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.muted};
`;

const AsideLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-top: 0.15rem;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e8ebf0;
  border-radius: 14px;
  padding: 1.15rem 1.15rem 1.25rem;
  box-shadow: 0 10px 28px rgba(19, 46, 88, 0.06);
`;

const Title = styled.h2`
  margin: 0 0 0.85rem;
  font-size: 1.125rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.02em;
`;

const List = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const RowLink = styled(Link)<{ $home?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: ${({ $home }) => ($home ? "0.85rem 0.35rem" : "0.7rem 0.15rem")};
  text-decoration: none;
  color: inherit;
  border-top: 1px solid ${({ $home }) => ($home ? "rgba(255,255,255,0.1)" : "#f1f3f6")};

  &:first-child {
    border-top: none;
    padding-top: ${({ $home }) => ($home ? "0.75rem" : "0.15rem")};
  }

  &:hover .name {
    color: ${({ $home, theme }) => ($home ? theme.colors.gold : theme.colors.primary)};
  }

  &:hover .chev {
    color: ${({ $home, theme }) => ($home ? theme.colors.gold : theme.colors.primary)};
    transform: translateX(2px);
  }
`;

const Rank = styled.span<{ $home?: boolean; $n: number }>`
  width: 1.65rem;
  height: 1.65rem;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 800;
  flex-shrink: 0;
  color: ${({ $home, $n }) => {
    if ($home) {
      if ($n <= 3) return "#132E58";
      return "rgba(255,255,255,0.92)";
    }
    return "#132E58";
  }};
  background: ${({ $home, $n }) => {
    if ($n === 1) return "linear-gradient(135deg, #FAFC15 0%, #FBBF24 100%)";
    if ($n === 2) return "rgba(251, 191, 36, 0.55)";
    if ($n === 3) return "rgba(251, 191, 36, 0.32)";
    return $home ? "rgba(255,255,255,0.12)" : "#f3f4f7";
  }};
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

const LogoFallback = styled.div<{ $home?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${({ $home, theme }) => ($home ? "rgba(255,255,255,0.12)" : theme.colors.primary)};
  color: ${({ theme }) => theme.colors.gold};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 800;
  flex-shrink: 0;
  border: ${({ $home }) => ($home ? "1px solid rgba(251,191,36,0.25)" : "none")};
`;

const Name = styled.span<{ $home?: boolean }>`
  flex: 1;
  min-width: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${({ $home, theme }) => ($home ? "rgba(255,255,255,0.95)" : theme.colors.primary)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s ease;
`;

const Chev = styled.span<{ $home?: boolean }>`
  color: ${({ $home }) => ($home ? "rgba(255,255,255,0.45)" : "#9ca3af")};
  display: inline-flex;
  transition: color 0.15s ease, transform 0.15s ease;
`;

const Personalize = styled.div`
  margin-top: 1rem;
  padding-top: 0.85rem;
  border-top: 1px solid #f1f3f6;
`;

const PersonalizeLabel = styled.p`
  margin: 0 0 0.65rem;
  font-size: 0.8125rem;
  color: #6b7280;
`;

const FindBtn = styled.button`
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.colors.secondary};
  background: #fff;
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.font.family};
  font-size: 0.8125rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    color: #fff;
  }
`;

const Empty = styled.p<{ $home?: boolean }>`
  margin: 0.75rem 0.35rem 1rem;
  font-size: 0.875rem;
  color: ${({ $home }) => ($home ? "rgba(255,255,255,0.72)" : "#6b7280")};
  line-height: 1.55;
`;

const SeeAll = styled(Link)`
  display: inline-block;
  margin-top: 0.35rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const HomeSeeAll = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0.35rem 0.35rem 0.85rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gold};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 4000;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Modal = styled.div`
  width: min(100%, 420px);
  background: #fff;
  border-radius: 16px;
  padding: 1.25rem 1.25rem 1.35rem;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.2);
`;

const ModalHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const CloseBtn = styled.button`
  border: none;
  background: #f3f4f6;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #374151;
`;

const StepLabel = styled.p`
  margin: 0 0 0.65rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OptionBtn = styled.button<{ $active?: boolean }>`
  text-align: left;
  padding: 0.7rem 0.85rem;
  border-radius: 10px;
  border: 1.5px solid ${({ $active, theme }) => ($active ? theme.colors.secondary : "#e5e7eb")};
  background: ${({ $active }) => ($active ? "rgba(29, 78, 216, 0.06)" : "#fff")};
  color: ${({ theme }) => theme.colors.primary};
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.1rem;
`;

const Primary = styled.button`
  flex: 1;
  border: none;
  border-radius: 999px;
  padding: 0.65rem 1rem;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 700;
  font-size: 0.8125rem;
  font-family: inherit;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Ghost = styled.button`
  flex: 1;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 0.65rem 1rem;
  background: #fff;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  font-size: 0.8125rem;
  font-family: inherit;
  cursor: pointer;
`;

type Answers = {
  deposit?: "low" | "mid" | "any";
  focus?: "forex" | "crypto" | "any";
  regulation?: "strict" | "any";
};

const STEPS: {
  key: keyof Answers;
  question: string;
  options: { value: NonNullable<Answers[keyof Answers]>; label: string }[];
}[] = [
  {
    key: "deposit",
    question: "What minimum deposit feels comfortable?",
    options: [
      { value: "low", label: "Under $100" },
      { value: "mid", label: "$100 – $500" },
      { value: "any", label: "No preference" },
    ],
  },
  {
    key: "focus",
    question: "What do you want to trade first?",
    options: [
      { value: "forex", label: "Forex / CFDs" },
      { value: "crypto", label: "Crypto" },
      { value: "any", label: "Not sure yet" },
    ],
  },
  {
    key: "regulation",
    question: "How important is strong regulation?",
    options: [
      { value: "strict", label: "Very — show clearer regulators first" },
      { value: "any", label: "Show me all curated picks" },
    ],
  },
];

function scoreBroker(b: ApiBroker, a: Answers): number {
  let score = 0;
  const deposit = Number(b.minDeposit) || 0;
  if (a.deposit === "low") score += deposit <= 100 ? 3 : deposit <= 250 ? 1 : -1;
  if (a.deposit === "mid") score += deposit >= 100 && deposit <= 500 ? 3 : deposit < 100 ? 2 : 0;
  const cat = (b.rebateCategory || "").toLowerCase();
  const cryptoYes = (b.crypto || "").toLowerCase() === "yes" || cat.includes("crypto");
  if (a.focus === "forex") score += !cryptoYes || cat.includes("forex") || cat === "both" || !cat ? 2 : 0;
  if (a.focus === "crypto") score += cryptoYes ? 3 : 0;
  if (a.regulation === "strict") {
    const reg = (b.regulation || "").toLowerCase();
    if (/fca|asic|cysec|nfa|cftc|bafin|fsa|mas/.test(reg)) score += 3;
    else if (reg && reg !== "—" && reg !== "-") score += 1;
  }
  score += Math.max(0, 10 - (b.beginnerSortOrder ?? 0));
  return score;
}

const TopBeginnerBrokersWidget: React.FC<Props> = ({ limit = 5, variant = "card", className }) => {
  const navigate = useNavigate();
  const [brokers, setBrokers] = useState<ApiBroker[]>([]);
  const [loading, setLoading] = useState(true);
  const [finderOpen, setFinderOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [personalized, setPersonalized] = useState<ApiBroker[] | null>(null);
  const isHome = variant === "home";

  useEffect(() => {
    let cancelled = false;
    fetchBeginnerBrokers({ page: 1, limit: 40 })
      .then((r) => {
        if (!cancelled) setBrokers(r.items || []);
      })
      .catch(() => {
        if (!cancelled) setBrokers([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const ranked = useMemo(() => {
    const source = personalized ?? brokers;
    return source.slice(0, limit);
  }, [brokers, personalized, limit]);

  const openFinder = () => {
    setStep(0);
    setAnswers({});
    setFinderOpen(true);
  };

  const current = STEPS[step];
  const selected = answers[current.key];

  const finishFinder = (finalAnswers: Answers) => {
    const sorted = [...brokers].sort((a, b) => scoreBroker(b, finalAnswers) - scoreBroker(a, finalAnswers));
    setPersonalized(sorted);
    setFinderOpen(false);
  };

  const nextStep = () => {
    if (!selected) return;
    if (step >= STEPS.length - 1) {
      finishFinder(answers);
      return;
    }
    setStep((s) => s + 1);
  };

  const listBlock = (
    <>
      {loading ? (
        <Empty $home={isHome}>Loading toplist…</Empty>
      ) : ranked.length === 0 ? (
        <Empty $home={isHome}>
          No curated brokers published yet. Mark brokers as “Best for new traders” in the admin panel.
        </Empty>
      ) : (
        <List>
          {ranked.map((b, i) => (
            <li key={b._id}>
              <RowLink to={`/rebates/broker/${b._id}`} $home={isHome}>
                <Rank $home={isHome} $n={i + 1}>
                  {i + 1}
                </Rank>
                {b.logoUrl ? (
                  <Logo src={b.logoUrl} alt="" />
                ) : (
                  <LogoFallback $home={isHome}>{b.name.slice(0, 2).toUpperCase()}</LogoFallback>
                )}
                <Name className="name" $home={isHome}>
                  {b.name}
                </Name>
                <Chev className="chev" $home={isHome}>
                  <FiChevronRight size={18} />
                </Chev>
              </RowLink>
            </li>
          ))}
        </List>
      )}
    </>
  );

  const finderModal = finderOpen && (
    <Backdrop
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) setFinderOpen(false);
      }}
    >
      <Modal role="dialog" aria-modal="true" aria-labelledby="find-broker-title">
        <ModalHead>
          <div>
            <ModalTitle id="find-broker-title">Find my broker</ModalTitle>
            <PersonalizeLabel style={{ margin: "0.35rem 0 0" }}>
              Step {step + 1} of {STEPS.length}
            </PersonalizeLabel>
          </div>
          <CloseBtn type="button" aria-label="Close" onClick={() => setFinderOpen(false)}>
            <FiX size={16} />
          </CloseBtn>
        </ModalHead>

        <StepLabel>{current.question}</StepLabel>
        <Options>
          {current.options.map((opt) => (
            <OptionBtn
              key={opt.value}
              type="button"
              $active={selected === opt.value}
              onClick={() => setAnswers((prev) => ({ ...prev, [current.key]: opt.value }))}
            >
              {opt.label}
            </OptionBtn>
          ))}
        </Options>

        <ModalActions>
          <Ghost
            type="button"
            onClick={() => {
              if (step === 0) setFinderOpen(false);
              else setStep((s) => s - 1);
            }}
          >
            {step === 0 ? "Cancel" : "Back"}
          </Ghost>
          <Primary type="button" disabled={!selected} onClick={nextStep}>
            {step >= STEPS.length - 1 ? "Show my toplist" : "Continue"}
          </Primary>
        </ModalActions>
      </Modal>
    </Backdrop>
  );

  if (isHome) {
    return (
      <Shell $variant="home" className={className}>
        <HomeBand>
          <HomeInner>
            <SectionHeadingSet
              upperText="NEW TRADERS"
              mainHeading="Top brokers for new traders"
              subText="Curated picks with clearer regulation signals and easier onboarding — then refine by country or preference."
            />
            <HomeListPanel>
              {listBlock}
              {ranked.length > 0 && (
                <HomeSeeAll to="/brokers/beginners">View all for new traders →</HomeSeeAll>
              )}
            </HomeListPanel>
            <HomeAside>
              <AsideTitle>
                {personalized ? "Your personalized toplist is ready" : "Get your personalized toplist"}
              </AsideTitle>
              <AsideText>
                Answer a few quick questions, or match brokers by the country you trade from.
              </AsideText>
              <ButtonBase fontSize="15px" onClick={openFinder}>
                Find my broker
                <img width="22px" src={ArrowIcon} alt="" />
              </ButtonBase>
              <AsideLinks>
                <SeeAll to="/find-broker">Country-based matching →</SeeAll>
                <SeeAll to="/brokers/beginners">Full new trader guide →</SeeAll>
              </AsideLinks>
            </HomeAside>
          </HomeInner>
        </HomeBand>
        {finderModal}
      </Shell>
    );
  }

  return (
    <Shell $variant={variant === "page" ? "page" : "card"} className={className}>
      <Card>
        <Title>Top brokers for new traders</Title>
        {listBlock}
        <Personalize>
          <PersonalizeLabel>
            {personalized ? "Your personalized toplist is ready." : "Get your personalized toplist:"}
          </PersonalizeLabel>
          <FindBtn type="button" onClick={openFinder}>
            Find my broker
          </FindBtn>
          <SeeAll to="/find-broker">Country-based matching →</SeeAll>
          {personalized && (
            <SeeAll
              to="/brokers/beginners"
              onClick={(e) => {
                e.preventDefault();
                navigate("/brokers/beginners");
              }}
            >
              See full new trader guide →
            </SeeAll>
          )}
          {!personalized && ranked.length > 0 && (
            <SeeAll to="/brokers/beginners">View all for new traders →</SeeAll>
          )}
        </Personalize>
      </Card>
      {finderModal}
    </Shell>
  );
};

export default TopBeginnerBrokersWidget;
