import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiArrowRight, FiInfo, FiChevronRight } from "react-icons/fi";
import { fetchBrokersPage, type ApiBroker } from "../../services/brokerService";
import { MATCHER_COUNTRIES } from "../../data/matcherCountries";

const Page = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 1.5rem ${({ theme }) => theme.typography.pageGutter} 3rem;

  @media (min-width: 1101px) {
    margin-top: 0.5rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(300px, 1.05fr);
  gap: 1.25rem;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.section`
  background: #fff;
  border: 1px solid #e8ebf0;
  border-radius: 16px;
  padding: 1.25rem 1.3rem 1.35rem;
  box-shadow: 0 12px 28px rgba(19, 46, 88, 0.06);
`;

const Progress = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.1rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
`;

const Track = styled.div`
  flex: 1;
  height: 6px;
  border-radius: 999px;
  background: #e8eef7;
  overflow: hidden;
`;

const Fill = styled.div`
  width: 16.66%;
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 999px;
`;

const StepEyebrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
`;

const StepTag = styled.span`
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
`;

const Why = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Question = styled.h1`
  margin: 0 0 1rem;
  font-size: 1.35rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.02em;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.45rem;
`;

const SelectWrap = styled.div`
  position: relative;
  margin-bottom: 1.15rem;
`;

const Select = styled.select`
  width: 100%;
  appearance: none;
  padding: 0.8rem 2.5rem 0.8rem 0.9rem;
  border-radius: 10px;
  border: 1.5px solid #dbe3ef;
  background: #fff;
  font-family: inherit;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const SelectFlag = styled.span`
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 1.1rem;
`;

const SelectWithFlag = styled(Select)<{ $hasFlag?: boolean }>`
  padding-left: ${({ $hasFlag }) => ($hasFlag ? "2.5rem" : "0.9rem")};
`;

const Chevron = styled.span`
  position: absolute;
  right: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #9ca3af;
  font-size: 0.75rem;
`;

const StartBtn = styled.button`
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.secondary};
  color: #fff;
  font-family: inherit;
  font-size: 0.9375rem;
  font-weight: 800;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.15s ease;

  &:hover:not(:disabled) {
    opacity: 0.94;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
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

const WhyBox = styled.p`
  margin: 0 0 1rem;
  padding: 0.7rem 0.8rem;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #eef2f7;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.muted};
`;

const ResultsTitle = styled.h2`
  margin: 0 0 0.85rem;
  font-size: 1.15rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.02em;
`;

const CountLine = styled.p`
  margin: -0.35rem 0 0.85rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.muted};
`;

const List = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Row = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.2rem;
  border-top: 1px solid #f1f3f6;
  text-decoration: none;
  color: inherit;

  &:first-child {
    border-top: none;
  }

  &:hover .name {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Rank = styled.span<{ $tone: number }>`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 800;
  flex-shrink: 0;
  background: ${({ $tone }) =>
    $tone === 1 ? "#fbbf24" : $tone === 2 ? "#fdba74" : $tone === 3 ? "#fde68a" : "#f3f4f6"};
  color: #111827;
`;

const Logo = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: contain;
  background: #f8fafc;
  border: 1px solid #eef2f7;
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
`;

const Empty = styled.div`
  padding: 1.25rem 0.5rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.875rem;
  line-height: 1.55;
`;

const Placeholder = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.875rem;
  line-height: 1.55;
`;

const TOP_N = 10;

const CountryBrokerMatcherPage: React.FC = () => {
  const [country, setCountry] = useState("Pakistan");
  const [matched, setMatched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brokers, setBrokers] = useState<ApiBroker[]>([]);
  const [totalMatched, setTotalMatched] = useState(0);
  const [showWhy, setShowWhy] = useState(false);

  const selectedMeta = useMemo(
    () => MATCHER_COUNTRIES.find((c) => c.name === country) || null,
    [country]
  );

  const runMatch = async () => {
    if (!country.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchBrokersPage({
        country: country.trim(),
        page: 1,
        limit: TOP_N,
      });
      setBrokers(result.items || []);
      setTotalMatched(result.pagination?.totalItems ?? result.items?.length ?? 0);
      setMatched(true);
    } catch (e: any) {
      setBrokers([]);
      setTotalMatched(0);
      setError(e.message || "Could not load brokers");
      setMatched(true);
    } finally {
      setLoading(false);
    }
  };

  const shown = brokers.slice(0, TOP_N);

  return (
    <Page>
      <Grid>
        <Panel>
          <Progress>
            <span>Basic Preferences (1/6)</span>
            <Track>
              <Fill />
            </Track>
            <span>Final result</span>
          </Progress>

          <StepEyebrow>
            <StepTag>Step 1</StepTag>
            <Why type="button" onClick={() => setShowWhy((v) => !v)}>
              <FiInfo size={14} /> Why it matters
            </Why>
          </StepEyebrow>

          <Question>Where do you live?</Question>

          {showWhy && (
            <WhyBox>
              Regulation, payment methods, and available brokers change by country. Matching on your location helps us
              show brokers more likely to accept clients from where you live.
            </WhyBox>
          )}

          <FieldLabel htmlFor="matcher-country">Please select your country</FieldLabel>
          <SelectWrap>
            {selectedMeta && <SelectFlag aria-hidden>{selectedMeta.flag}</SelectFlag>}
            <SelectWithFlag
              id="matcher-country"
              $hasFlag={!!selectedMeta}
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setMatched(false);
              }}
            >
              {MATCHER_COUNTRIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.flag} {c.name}
                </option>
              ))}
            </SelectWithFlag>
            <Chevron>▼</Chevron>
          </SelectWrap>

          <StartBtn type="button" onClick={runMatch} disabled={loading || !country}>
            {loading ? "Matching…" : "Start matching"} <FiArrowRight />
          </StartBtn>

          <TipBanner>Go ahead! Future you will be grateful for starting this tool!</TipBanner>
        </Panel>

        <Panel>
          {!matched ? (
            <Placeholder>
              Select your country and tap <strong>Start matching</strong> to see top brokers available for that market.
            </Placeholder>
          ) : (
            <>
              <ResultsTitle>
                Top {Math.min(TOP_N, Math.max(shown.length, 0))} brokers in {country}
              </ResultsTitle>
              <CountLine>
                {loading
                  ? "Finding matches…"
                  : totalMatched === 0
                    ? "No brokers tagged for this country yet."
                    : `${totalMatched} match${totalMatched === 1 ? "" : "es"} found${
                        totalMatched > TOP_N ? ` · showing top ${TOP_N}` : ""
                      }`}
              </CountLine>

              {error && <Empty>{error}</Empty>}

              {!loading && !error && shown.length === 0 && (
                <Empty>
                  Admins can tag brokers with this country under <strong>Country</strong> /{" "}
                  <strong>Served countries</strong> in Brokers management. Meanwhile, browse{" "}
                  <Link to="/brokers">all brokers</Link> or{" "}
                  <Link to="/brokers/beginners">new trader picks</Link>.
                </Empty>
              )}

              {!loading && shown.length > 0 && (
                <List>
                  {shown.map((b, i) => (
                    <li key={b._id}>
                      <Row to={`/rebates/broker/${b._id}`}>
                        <Rank $tone={i + 1}>{i + 1}</Rank>
                        {b.logoUrl ? (
                          <Logo src={b.logoUrl} alt="" />
                        ) : (
                          <LogoFallback>{b.name.slice(0, 2).toUpperCase()}</LogoFallback>
                        )}
                        <Name className="name">{b.name}</Name>
                        <FiChevronRight color="#9ca3af" />
                      </Row>
                    </li>
                  ))}
                </List>
              )}
            </>
          )}
        </Panel>
      </Grid>
    </Page>
  );
};

export default CountryBrokerMatcherPage;
