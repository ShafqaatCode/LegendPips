import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiArrowUpRight } from "react-icons/fi";
import { fetchBeginnerBrokers, type ApiBroker } from "../../services/brokerService";
import { normalizeBrokerLogoUrl } from "../../utils/brokerLogoUrl";

type Props = {
  limit?: number;
  variant?: "card" | "page" | "home";
  className?: string;
};

function brokerMeta(b: ApiBroker): string {
  const bits: string[] = [];
  const reg = (b.regulation || "").trim();
  if (reg && reg !== "—" && reg !== "-") bits.push(reg.split(/[,|/]/)[0].trim());
  if (typeof b.minDeposit === "number" && b.minDeposit >= 0) {
    bits.push(`Min $${b.minDeposit}`);
  }
  if (b.forBeginners) bits.push("Beginner-friendly");
  return bits.slice(0, 2).join(" · ") || "Curated for new traders";
}

const TopBeginnerBrokersWidget: React.FC<Props> = ({ limit = 5, variant = "card", className }) => {
  const navigate = useNavigate();
  const [brokers, setBrokers] = useState<ApiBroker[]>([]);
  const [broken, setBroken] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
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

  const ranked = useMemo(() => brokers.slice(0, limit), [brokers, limit]);
  const goFindBroker = () => navigate("/find-broker");

  if (isHome) {
    return (
      <HomeSection className={className}>
        <HomeInner>
          <IntroCol>
            <Eyebrow>For new traders</Eyebrow>
            <HomeTitle>Start with brokers that are easier to learn on</HomeTitle>
            <HomeLead>
              Clearer regulation signals and simpler onboarding — ranked for beginners, then refine
              with Find my broker when you want a personal match.
            </HomeLead>
            <IntroActions>
              <PrimaryBtn type="button" onClick={goFindBroker}>
                Find my broker
              </PrimaryBtn>
              <TextLink to="/brokers/beginners">
                Full beginner guide <FiArrowUpRight />
              </TextLink>
            </IntroActions>
          </IntroCol>

          <ListCol>
            <ListHeader>
              <span>Top picks</span>
              <ListHeaderHint>Ranked for beginners</ListHeaderHint>
            </ListHeader>
            {loading ? (
              <Status>Loading curated picks…</Status>
            ) : ranked.length === 0 ? (
              <Status>
                No beginner brokers published yet. Mark brokers as “Best for new traders” in admin.
              </Status>
            ) : (
              <RankList>
                {ranked.map((b, i) => {
                  const src = normalizeBrokerLogoUrl(b.logoUrl);
                  const reg = (b.regulation || "").trim().split(/[,|/]/)[0].trim();
                  const hasMin = typeof b.minDeposit === "number" && b.minDeposit >= 0;
                  return (
                    <RankItem key={b._id} to={`/rebates/broker/${b._id}`} $top={i === 0}>
                      <Num $top={i === 0}>{String(i + 1).padStart(2, "0")}</Num>
                      <LogoWrap>
                        {src && !broken[b._id] ? (
                          <img
                            src={src}
                            alt=""
                            onError={() => setBroken((p) => ({ ...p, [b._id]: true }))}
                          />
                        ) : (
                          <LogoFb>{b.name.slice(0, 2).toUpperCase()}</LogoFb>
                        )}
                      </LogoWrap>
                      <Copy>
                        <NameRow>
                          <BrokerName>{b.name}</BrokerName>
                          {i === 0 && <TopBadge>Top pick</TopBadge>}
                        </NameRow>
                        <ChipRow>
                          {reg && reg !== "—" && reg !== "-" && <Chip>{reg}</Chip>}
                          {hasMin && <Chip>Min ${b.minDeposit}</Chip>}
                          {!reg && !hasMin && <Meta>{brokerMeta(b)}</Meta>}
                        </ChipRow>
                      </Copy>
                      <Go className="go" aria-hidden>
                        <FiArrowUpRight />
                      </Go>
                    </RankItem>
                  );
                })}
              </RankList>
            )}
            {ranked.length > 0 && (
              <ListFoot to="/brokers/beginners">
                See all beginner brokers <FiArrowUpRight />
              </ListFoot>
            )}
          </ListCol>
        </HomeInner>
      </HomeSection>
    );
  }

  return (
    <CompactShell $wide={variant === "page"} className={className}>
      <CompactTitle>Top brokers for new traders</CompactTitle>
      {loading ? (
        <Status>Loading…</Status>
      ) : ranked.length === 0 ? (
        <Status>No curated brokers yet.</Status>
      ) : (
        <CompactList>
          {ranked.map((b, i) => {
            const src = normalizeBrokerLogoUrl(b.logoUrl);
            return (
              <CompactRow key={b._id} to={`/rebates/broker/${b._id}`}>
                <CompactNum>{i + 1}</CompactNum>
                <LogoWrap $sm>
                  {src && !broken[b._id] ? (
                    <img
                      src={src}
                      alt=""
                      onError={() => setBroken((p) => ({ ...p, [b._id]: true }))}
                    />
                  ) : (
                    <LogoFb>{b.name.slice(0, 2).toUpperCase()}</LogoFb>
                  )}
                </LogoWrap>
                <span>{b.name}</span>
              </CompactRow>
            );
          })}
        </CompactList>
      )}
      <CompactCta type="button" onClick={goFindBroker}>
        Find my broker
      </CompactCta>
      <CompactLink to="/brokers/beginners">View all →</CompactLink>
    </CompactShell>
  );
};

export default TopBeginnerBrokersWidget;

/* ——— Home (editorial, light) ——— */

const HomeSection = styled.section`
  padding: clamp(2.5rem, 5vw, 3.75rem) ${({ theme }) => theme.typography.pageGutter};
  background: #f7f8fb;
  border-top: 1px solid #e8ecf2;
  border-bottom: 1px solid #e8ecf2;
`;

const HomeInner = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(240px, 0.85fr) minmax(0, 1.2fr);
  gap: clamp(1.5rem, 4vw, 3.25rem);
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const IntroCol = styled.div`
  padding-top: 0.25rem;
`;

const Eyebrow = styled.p`
  margin: 0 0 0.65rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
`;

const HomeTitle = styled.h2`
  margin: 0 0 0.75rem;
  font-size: clamp(1.45rem, 2.2vw, 1.85rem);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.primary};
  max-width: 16ch;
`;

const HomeLead = styled.p`
  margin: 0 0 1.35rem;
  font-size: 0.92rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.muted};
  max-width: 34ch;
`;

const IntroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem 1.1rem;
`;

const PrimaryBtn = styled.button`
  appearance: none;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.7rem 1.15rem;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #1a4a7a;
  }
`;

const TextLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const ListCol = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(19, 46, 88, 0.06);
`;

const ListHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 1.15rem;
  background: linear-gradient(135deg, #132e58 0%, #1a3d6e 100%);
  color: #fff;

  span:first-child {
    font-size: 0.82rem;
    font-weight: 800;
    letter-spacing: 0.02em;
  }
`;

const ListHeaderHint = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.72);
`;

const RankList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0.35rem 0;
`;

const RankItem = styled(Link)<{ $top?: boolean }>`
  display: grid;
  grid-template-columns: 2.6rem 48px minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.85rem;
  margin: 0 0.55rem;
  padding: 0.8rem 0.75rem;
  text-decoration: none;
  color: inherit;
  border-radius: 12px;
  border: 1px solid transparent;
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease,
    box-shadow 0.18s ease;
  background: ${({ $top }) => ($top ? "linear-gradient(90deg, #fffbeb 0%, #fff 55%)" : "transparent")};

  &:hover {
    background: #f8fafc;
    border-color: rgba(251, 191, 36, 0.45);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(19, 46, 88, 0.06);
  }

  &:hover .go {
    color: #fff;
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

const Num = styled.span<{ $top?: boolean }>`
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
  color: ${({ $top }) => ($top ? "#132e58" : "#64748b")};
  background: ${({ $top }) => ($top ? "#fbbf24" : "#f1f5f9")};
`;

const LogoWrap = styled.div<{ $sm?: boolean }>`
  width: ${({ $sm }) => ($sm ? "36px" : "48px")};
  height: ${({ $sm }) => ($sm ? "36px" : "48px")};
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e8ecf1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 6px;
    box-sizing: border-box;
  }
`;

const LogoFb = styled.span`
  font-size: 0.7rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const Copy = styled.div`
  min-width: 0;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
`;

const BrokerName = styled.div`
  font-size: 0.95rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TopBadge = styled.span`
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #132e58;
  background: #fbbf24;
  border-radius: 999px;
  padding: 0.12rem 0.45rem;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.3rem;
`;

const Chip = styled.span`
  font-size: 0.68rem;
  font-weight: 650;
  color: #475569;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 0.12rem 0.45rem;
`;

const Meta = styled.div`
  margin-top: 0.15rem;
  font-size: 0.72rem;
  font-weight: 500;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Go = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  background: #f1f5f9;
  transition: color 0.15s ease, background 0.15s ease;
`;

const ListFoot = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.9rem 1.1rem;
  border-top: 1px solid #eef1f5;
  font-size: 0.8125rem;
  font-weight: 750;
  color: ${({ theme }) => theme.colors.secondary};
  text-decoration: none;
  background: linear-gradient(180deg, #fafbfc 0%, #f4f6fa 100%);

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Status = styled.p`
  margin: 0;
  padding: 1.25rem 1.1rem;
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.muted};
`;

/* ——— Compact (card / page) ——— */

const CompactShell = styled.div<{ $wide?: boolean }>`
  width: 100%;
  max-width: ${({ $wide }) => ($wide ? "420px" : "380px")};
  margin: 0 auto;
  background: #fff;
  border: 1px solid #e8ebf0;
  border-radius: 10px;
  padding: 1.1rem 1.1rem 1.2rem;
`;

const CompactTitle = styled.h2`
  margin: 0 0 0.85rem;
  font-size: 1.05rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const CompactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin-bottom: 0.85rem;
`;

const CompactRow = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.45rem 0;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 700;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

const CompactNum = styled.span`
  width: 1.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
`;

const CompactCta = styled.button`
  width: 100%;
  appearance: none;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.65rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 0.45rem;
`;

const CompactLink = styled(Link)`
  display: block;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
