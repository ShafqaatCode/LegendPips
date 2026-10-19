import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiArrowRight, FiBarChart2, FiSearch } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import CompareToggle from "../../components/Broker/CompareToggle";
import LiveForexSpreadsDesk from "../../components/MarketCharts/LiveForexSpreadsDesk";
import { fetchBrokersPage, type ApiBroker } from "../../services/brokerService";
import { brokerBestSpreadPips, formatSpreadRank, parseMoneyishNumber, parseSpreadPips } from "../../utils/spreadComparison";
import { normalizeBrokerLogoUrl } from "../../utils/brokerLogoUrl";

type Category = "" | "forex" | "crypto" | "prop" | "binary" | "ewallet";
type SortKey = "spread" | "commission" | "name";

const SpreadComparisonPage: React.FC = () => {
  const [brokers, setBrokers] = useState<ApiBroker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("");
  const [sort, setSort] = useState<SortKey>("spread");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchBrokersPage({ page: 1, limit: 50, search: search || undefined, category: category || undefined })
      .then((r) => {
        if (!cancelled) {
          setBrokers(r.items || []);
          setError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setBrokers([]);
          setError(e instanceof Error ? e.message : "Failed to load brokers");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [search, category]);

  const ranked = useMemo(() => {
    const rows = brokers.map((b) => ({
      broker: b,
      spread: brokerBestSpreadPips(b),
    }));

    return rows.sort((a, b) => {
      if (sort === "name") return a.broker.name.localeCompare(b.broker.name);
      if (sort === "commission") {
        const ac = parseMoneyishNumber(a.broker.commission) ?? Infinity;
        const bc = parseMoneyishNumber(b.broker.commission) ?? Infinity;
        return ac - bc;
      }
      const as = a.spread ?? Infinity;
      const bs = b.spread ?? Infinity;
      if (as !== bs) return as - bs;
      return a.broker.name.localeCompare(b.broker.name);
    });
  }, [brokers, sort]);

  const bestSpread = useMemo(() => {
    const vals = ranked.map((r) => r.spread).filter((n): n is number => n !== null);
    return vals.length ? Math.min(...vals) : null;
  }, [ranked]);

  const maxBarSpread = useMemo(() => {
    const vals = ranked.map((r) => r.spread).filter((n): n is number => n !== null);
    return vals.length ? Math.max(...vals) : 1;
  }, [ranked]);

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <Eyebrow>
            <FiBarChart2 aria-hidden /> Tools
          </Eyebrow>
          <Title>Spread comparison</Title>
          <Lead>
            Live forex spreads across major brokers, plus LegendPips advertised spreads — compare real-time
            quotes and partner listings side by side.
          </Lead>
          <HeroLinks>
            <HeroLink to="/compare">
              Full broker compare <FiArrowRight />
            </HeroLink>
            <HeroLink to="/rebates">Rebate brokers</HeroLink>
            <HeroLink to="/live-charts">Live charts</HeroLink>
          </HeroLinks>
        </HeroInner>
      </Hero>

      <Page>
        <WidgetSection>
          <LiveForexSpreadsDesk height={760} defaultMode="all" />
        </WidgetSection>

        <SectionHeading>
          <h2>LegendPips broker spreads</h2>
          <p>Advertised spreads and commissions from brokers listed on LegendPips.</p>
        </SectionHeading>

        <Toolbar>
          <SearchWrap>
            <FiSearch aria-hidden />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search broker name…"
              aria-label="Search brokers"
            />
          </SearchWrap>
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)} aria-label="Broker type">
            <option value="">All types</option>
            <option value="forex">Forex / CFD</option>
            <option value="crypto">Crypto</option>
            <option value="prop">Prop firms</option>
            <option value="binary">Binary brokers</option>
            <option value="ewallet">E-wallet</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort by">
            <option value="spread">Lowest spread</option>
            <option value="commission">Lowest commission</option>
            <option value="name">Name A–Z</option>
          </select>
        </Toolbar>

        {error && <Notice $error>{error}</Notice>}
        {loading ? (
          <Notice>Loading spread table…</Notice>
        ) : ranked.length === 0 ? (
          <Notice>No brokers match your filters.</Notice>
        ) : (
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Broker</th>
                  <th>Spread from</th>
                  <th>Visual</th>
                  <th>Commission</th>
                  <th>Min deposit</th>
                  <th>Cashback</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map(({ broker, spread }, i) => {
                  const isBest = spread !== null && spread === bestSpread;
                  const barPct =
                    spread !== null && maxBarSpread > 0
                      ? Math.max(8, Math.round((spread / maxBarSpread) * 100))
                      : 0;
                  return (
                    <tr key={broker._id} className={isBest ? "best" : undefined}>
                      <td className="rank">{i + 1}</td>
                      <td className="broker">
                        <Link to={`/rebates/broker/${broker._id}`}>
                          {normalizeBrokerLogoUrl(broker.logoUrl) ? <img src={normalizeBrokerLogoUrl(broker.logoUrl)} alt="" /> : <LogoFallback>{broker.name.slice(0, 2)}</LogoFallback>}
                          <span>{broker.name}</span>
                        </Link>
                      </td>
                      <td className="spread">
                        <strong>{broker.spreadFrom || "—"}</strong>
                        {spread !== null && broker.spreadFrom && parseSpreadPips(broker.spreadFrom) !== spread && (
                          <small>Best: {formatSpreadRank(spread)}</small>
                        )}
                      </td>
                      <td className="bar">
                        {spread !== null ? (
                          <BarTrack>
                            <BarFill $pct={barPct} $best={isBest} />
                          </BarTrack>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>{broker.commission || "—"}</td>
                      <td>{broker.minDeposit ? `$${broker.minDeposit}` : "—"}</td>
                      <td>{broker.cashbackRate || "—"}</td>
                      <td className="actions">
                        <CompareToggle brokerId={broker._id} />
                        <TextLink to={`/rebates/broker/${broker._id}`}>Details</TextLink>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </TableWrap>
        )}

        <Footnote>
          Spreads are taken from broker listings and account-type rows in admin. Always confirm live quotes and total
          cost (spread + commission + swap) on the broker&apos;s site before trading.
        </Footnote>
      </Page>
    </>
  );
};

export default SpreadComparisonPage;

const Hero = styled.section`
  position: relative;
  min-height: clamp(260px, 34vh, 340px);
  display: flex;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, #0b1b38 0%, #132e58 100%);
  padding: clamp(3rem, 7vw, 4.5rem) ${({ theme }) => theme.typography.pageGutter} 2rem;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.15;
  background-image: url(${bannerBg});
  background-size: cover;
  filter: blur(2px);
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(11, 27, 56, 0.8), rgba(19, 46, 88, 0.8));
  }
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 2;
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
  color: #fff;
`;

const Eyebrow = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gold};
`;

const Title = styled.h1`
  margin: 0 0 0.75rem;
  font-size: clamp(1.6rem, 2.5vw, 2.15rem);
`;

const Lead = styled.p`
  margin: 0;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.9);
`;

const HeroLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.65rem 1rem;
  margin-top: 1.1rem;
`;

const HeroLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: ${({ theme }) => theme.colors.gold};
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Page = styled.main`
  max-width: 100%;
  margin: 0 auto;
  background: #f4f6fa;
  padding: 1.25rem ${({ theme }) => theme.typography.pageGutter} 3rem;
  box-sizing: border-box;
`;

const WidgetSection = styled.section`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto clamp(1.75rem, 4vw, 2.5rem);
`;

const SectionHeading = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto 1rem;

  h2 {
    margin: 0 0 0.35rem;
    font-size: clamp(1.15rem, 2vw, 1.35rem);
    color: #0f172a;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.55;
    color: #64748b;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const Toolbar = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  align-items: center;

  select {
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 0.65rem 0.75rem;
    font-family: inherit;
    font-size: 0.875rem;
    background: #fff;
    color: #132e58;
  }
`;

const SearchWrap = styled.label`
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.85rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #64748b;

  input {
    border: none;
    outline: none;
    width: 100%;
    font-family: inherit;
    font-size: 0.875rem;
    color: #132e58;
  }
`;

const Notice = styled.p<{ $error?: boolean }>`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto 1rem;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  background: ${({ $error }) => ($error ? "#fef2f2" : "#fff")};
  border: 1px solid ${({ $error }) => ($error ? "#fecaca" : "#e2e8f0")};
  color: ${({ $error }) => ($error ? "#b91c1c" : "#475569")};
  font-size: 0.9rem;
`;

const TableWrap = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  overflow: auto;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #fff;
  box-shadow: 0 10px 28px rgba(19, 46, 88, 0.06);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;

  th,
  td {
    padding: 0.85rem 0.9rem;
    border-bottom: 1px solid #f1f5f9;
    text-align: left;
    vertical-align: middle;
  }

  th {
    background: #f8fafc;
    color: #64748b;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  tr.best td {
    background: rgba(251, 191, 36, 0.08);
  }

  .rank {
    width: 2.5rem;
    font-weight: 800;
    color: #132e58;
  }

  .broker a {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    text-decoration: none;
    color: #132e58;
    font-weight: 700;

    img {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      object-fit: contain;
      background: #f8fafc;
      border: 1px solid #eef2f7;
    }
  }

  .spread strong {
    display: block;
    color: #132e58;
  }

  .spread small {
    display: block;
    margin-top: 0.15rem;
    color: #64748b;
    font-size: 0.75rem;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    align-items: flex-start;
  }
`;

const LogoFallback = styled.span`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #132e58;
  color: #fbbf24;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 800;
`;

const BarTrack = styled.div`
  width: min(140px, 100%);
  height: 8px;
  border-radius: 999px;
  background: #e8eef7;
  overflow: hidden;
`;

const BarFill = styled.div<{ $pct: number; $best: boolean }>`
  width: ${({ $pct }) => $pct}%;
  height: 100%;
  border-radius: 999px;
  background: ${({ $best, theme }) =>
    $best ? "linear-gradient(90deg, #FAFC15 0%, #FBBF24 100%)" : theme.colors.secondary};
`;

const TextLink = styled(Link)`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Footnote = styled.p`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 1rem auto 0;
  font-size: 0.8rem;
  line-height: 1.55;
  color: #64748b;
`;
