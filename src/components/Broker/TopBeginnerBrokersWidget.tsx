import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiChevronRight, FiX } from "react-icons/fi";
import { fetchBeginnerBrokers, type ApiBroker } from "../../services/brokerService";

type Props = {
  /** Max ranked rows to show */
  limit?: number;
  /** Compact = card only; page = slightly wider */
  variant?: "card" | "page";
  className?: string;
};

const Shell = styled.section<{ $variant: "card" | "page" }>`
  width: 100%;
  max-width: ${({ $variant }) => ($variant === "page" ? "420px" : "380px")};
  margin: 0 auto;
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
  color: #111827;
  letter-spacing: -0.02em;
`;

const List = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const RowLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.15rem;
  text-decoration: none;
  color: inherit;
  border-top: 1px solid #f1f3f6;

  &:first-child {
    border-top: none;
    padding-top: 0.15rem;
  }

  &:hover .name {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:hover .chev {
    color: ${({ theme }) => theme.colors.primary};
    transform: translateX(2px);
  }
`;

const Rank = styled.span`
  width: 1.25rem;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
  flex-shrink: 0;
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
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s ease;
`;

const Chev = styled.span`
  color: #9ca3af;
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

const Empty = styled.p`
  margin: 0.35rem 0 0.5rem;
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.5;
`;

const SeeAll = styled(Link)`
  display: inline-block;
  margin-top: 0.65rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
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
  color: #111827;
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
      { value: "any", label: "Show me all beginner picks" },
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

  return (
    <Shell $variant={variant} className={className}>
      <Card>
        <Title>Top brokers for new traders</Title>

        {loading ? (
          <Empty>Loading toplist…</Empty>
        ) : ranked.length === 0 ? (
          <Empty>
            No curated brokers published yet. Mark brokers as “Best for new traders” in the admin panel.
          </Empty>
        ) : (
          <List>
            {ranked.map((b, i) => (
              <li key={b._id}>
                <RowLink to={`/rebates/broker/${b._id}`}>
                  <Rank>{i + 1}</Rank>
                  {b.logoUrl ? (
                    <Logo src={b.logoUrl} alt="" />
                  ) : (
                    <LogoFallback>{b.name.slice(0, 2).toUpperCase()}</LogoFallback>
                  )}
                  <Name className="name">{b.name}</Name>
                  <Chev className="chev">
                    <FiChevronRight size={18} />
                  </Chev>
                </RowLink>
              </li>
            ))}
          </List>
        )}

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

      {finderOpen && (
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
      )}
    </Shell>
  );
};

export default TopBeginnerBrokersWidget;
