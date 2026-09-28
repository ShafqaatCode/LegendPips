import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiArrowRight, FiRefreshCw, FiRepeat } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import CompareToggle from "../../components/Broker/CompareToggle";
import { fetchBrokersPage, type ApiBroker } from "../../services/brokerService";
import {
  brokerBestSwapPips,
  brokerHasSwapFree,
  formatSwapRank,
} from "../../utils/swapComparison";
import { normalizeBrokerLogoUrl } from "../../utils/brokerLogoUrl";

type Category = "" | "forex" | "crypto" | "prop" | "binary" | "ewallet";
type SortKey = "swap" | "name";

const SwapsComparisonPage: React.FC = () => {
  const [brokers, setBrokers] = useState<ApiBroker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("");
  const [sort, setSort] = useState<SortKey>("swap");

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
      swap: brokerBestSwapPips(b),
      swapFree: brokerHasSwapFree(b),
    }));

    return rows.sort((a, b) => {
      if (sort === "name") return a.broker.name.localeCompare(b.broker.name);
      const as = a.swapFree ? -1 : a.swap ?? Infinity;
      const bs = b.swapFree ? -1 : b.swap ?? Infinity;
      if (as !== bs) return as - bs;
      return a.broker.name.localeCompare(b.broker.name);
    });
  }, [brokers, sort]);

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <Eyebrow>
            <FiRepeat aria-hidden /> Tools
          </Eyebrow>
          <Title>Swaps comparison</Title>
          <Lead>
            Compare overnight swap profiles across LegendPips brokers — swap-free and low-swap accounts ranked
            first. Confirm live rollover rates on the broker before holding positions overnight.
          </Lead>
          <HeroLinks>
            <HeroLink to="/spread-comparison">
              Spread comparison <FiArrowRight />
            </HeroLink>
            <HeroLink to="/compare">Full broker compare</HeroLink>
          </HeroLinks>
        </HeroInner>
      </Hero>

      <Page>
        <Toolbar>
          <SearchWrap>
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
            <option value="swap">Lowest swap / swap-free</option>
            <option value="name">Name A–Z</option>
          </select>
        </Toolbar>

        {error && <Notice $error>{error}</Notice>}
        {loading ? (
          <Notice>Loading swaps table…</Notice>
        ) : ranked.length === 0 ? (
          <Notice>No brokers match your filters.</Notice>
        ) : (
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Broker</th>
                  <th>Swap profile</th>
                  <th>Listed swap</th>
                  <th>Commission</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map(({ broker, swap, swapFree }, i) => (
                  <tr key={broker._id} className={swapFree ? "best" : undefined}>
                    <td className="rank">{i + 1}</td>
                    <td className="broker">
                      <Link to={`/rebates/broker/${broker._id}`}>
                        {normalizeBrokerLogoUrl(broker.logoUrl) ? (
                          <img src={normalizeBrokerLogoUrl(broker.logoUrl)} alt="" />
                        ) : (
                          <LogoFallback>{broker.name.slice(0, 2)}</LogoFallback>
                        )}
                        <span>{broker.name}</span>
                      </Link>
                    </td>
                    <td>
                      <strong>{formatSwapRank(swap, swapFree)}</strong>
                    </td>
                    <td>{broker.swapFrom || "—"}</td>
                    <td>{broker.commission || "—"}</td>
                    <td className="actions">
                      <CompareToggle brokerId={broker._id} />
                      <TextLink to={`/rebates/broker/${broker._id}`}>Details</TextLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
        )}

        <Footnote>
          Swap data comes from broker listings (admin &quot;Overnight swap&quot; field and features). Live swap rates
          vary by pair, direction, and day — always verify on the broker platform.
        </Footnote>
      </Page>
    </>
  );
};

export default SwapsComparisonPage;

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
  background: #f4f6fa;
  padding: 1.25rem ${({ theme }) => theme.typography.pageGutter} 3rem;
`;

const Toolbar = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  select {
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 0.65rem 0.75rem;
    font-family: inherit;
    font-size: 0.875rem;
    background: #fff;
  }
`;

const SearchWrap = styled.label`
  flex: 1;
  min-width: 200px;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  input {
    border: none;
    outline: none;
    width: 100%;
    font-family: inherit;
    font-size: 0.875rem;
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
`;

const TableWrap = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  overflow: auto;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #fff;
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
  }
  th {
    background: #f8fafc;
    font-size: 0.7rem;
    text-transform: uppercase;
    color: #64748b;
  }
  tr.best td {
    background: rgba(251, 191, 36, 0.08);
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
    }
  }
  .actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const LogoFallback = styled.span`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #132e58;
  color: #fbbf24;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
`;

const TextLink = styled(Link)`
  font-size: 0.75rem;
  font-weight: 700;
  color: #132e58;
`;

const Footnote = styled.p`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 1rem auto 0;
  font-size: 0.8125rem;
  color: #64748b;
  line-height: 1.5;
`;
