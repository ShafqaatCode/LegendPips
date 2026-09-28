import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiEye, FiHeart, FiPlus, FiSearch, FiShield, FiZap } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import { fetchPublicStrategies, type TradingStrategy } from "../../services/strategyService";

const StrategiesPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest");
  const [market, setMarket] = useState("");
  const [items, setItems] = useState<TradingStrategy[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPublicStrategies({ search: q, market: market || undefined, sort, page: 1, limit: 24 })
      .then((r) => {
        setItems(r.items || []);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [q, sort, market]);

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <h1>Trading Strategies</h1>
          <p>
            Traders share what actually works for them — entries, exits, risk rules, and results.
            Study setups from the community and keep your own trading streak alive.
          </p>
          <HeroActions>
            <Cta to="/user-panel/strategies">
              <FiPlus /> Share your strategy
            </Cta>
            <Ghost to="/streaks">
              <FiZap /> Trading streaks
            </Ghost>
          </HeroActions>
        </HeroInner>
      </Hero>
      <Page>
        <Toolbar>
          <Search>
            <FiSearch />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setQ(search.trim())}
              placeholder="Search strategies, tags…"
            />
            <button type="button" onClick={() => setQ(search.trim())}>
              Search
            </button>
          </Search>
          <Filters>
            <select value={market} onChange={(e) => setMarket(e.target.value)}>
              <option value="">All markets</option>
              <option value="forex">Forex</option>
              <option value="crypto">Crypto</option>
              <option value="indices">Indices</option>
              <option value="commodities">Commodities</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="popular">Most liked</option>
            </select>
          </Filters>
        </Toolbar>
        {error && <Err>{error}</Err>}
        {loading && <Empty>Loading strategies…</Empty>}
        {!loading && items.length === 0 && (
          <Empty>No published strategies yet. Be the first to share a profitable setup from your member panel.</Empty>
        )}
        <Grid>
          {items.map((s) => (
            <Card key={s.id} to={`/strategies/${s.id}`}>
              <Top>
                <Risk $level={s.riskLevel}>{s.riskLevel} risk</Risk>
                <span>{s.timeframe}</span>
              </Top>
              <strong>{s.title}</strong>
              <p>{s.summary || s.content}</p>
              <Stats>
                <span>
                  <b>{s.claimedWinRatePercent != null ? `${s.claimedWinRatePercent}%` : "—"}</b> Win
                </span>
                <span>
                  <b>{s.claimedRoiPercent != null ? `${s.claimedRoiPercent}%` : "—"}</b> ROI
                </span>
                <span>
                  <FiHeart /> {s.likeCount}
                </span>
                <span>
                  <FiEye /> {s.viewCount}
                </span>
              </Stats>
              <Meta>
                {(s.markets || []).join(" · ") || "Markets n/a"}
                {s.user?.firstName ? ` · ${s.user.firstName}` : ""}
              </Meta>
            </Card>
          ))}
        </Grid>
        <Hint>
          <FiShield /> Shared performance claims are self-reported. Always manage your own risk.
        </Hint>
      </Page>
    </>
  );
};

export default StrategiesPage;

const Hero = styled.section`
  position: relative;
  min-height: clamp(220px, 28vh, 300px);
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
    background: linear-gradient(135deg, rgba(11, 27, 56, 0.85), rgba(19, 46, 88, 0.85));
  }
`;
const HeroInner = styled.div`
  position: relative;
  z-index: 2;
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
  color: #fff;
  h1 {
    margin: 0 0 0.75rem;
    font-size: ${({ theme }) => theme.typography.heroTitle};
  }
  p {
    margin: 0 0 1.25rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
  }
`;
const HeroActions = styled.div`
  display: flex;
  gap: 0.65rem;
  justify-content: center;
  flex-wrap: wrap;
`;
const Cta = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #fbbf24;
  color: #132e58;
  font-weight: 800;
  padding: 0.55rem 1rem;
  border-radius: 10px;
  text-decoration: none;
`;
const Ghost = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-weight: 700;
  padding: 0.55rem 1rem;
  border-radius: 10px;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.25);
`;
const Page = styled.main`
  background: #f4f6fa;
  padding: 1.25rem 0 3rem;
`;
const Toolbar = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto 1rem;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;
const Search = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.35rem 0.5rem 0.35rem 0.7rem;
  input {
    border: 0;
    outline: none;
    font: inherit;
    min-width: 180px;
  }
  button {
    background: #132e58;
    color: #fff;
    border: 0;
    border-radius: 8px;
    padding: 0.35rem 0.7rem;
    font-weight: 700;
    cursor: pointer;
  }
`;
const Filters = styled.div`
  display: flex;
  gap: 0.5rem;
  select {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.4rem 0.55rem;
    background: #fff;
    font: inherit;
  }
`;
const Grid = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 0.85rem;
`;
const Card = styled(Link)`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  strong {
    color: #132e58;
    font-size: 1.05rem;
  }
  p {
    margin: 0;
    font-size: 0.82rem;
    color: #475569;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  &:hover {
    border-color: #fbbf24;
  }
`;
const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.72rem;
  color: #64748b;
  text-transform: capitalize;
`;
const Risk = styled.span<{ $level: string }>`
  font-weight: 700;
  text-transform: capitalize;
  color: ${({ $level }) => ($level === "high" ? "#b91c1c" : $level === "low" ? "#059669" : "#b45309")};
`;
const Stats = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  font-size: 0.75rem;
  color: #64748b;
  b {
    color: #132e58;
    display: block;
    font-size: 0.95rem;
  }
  span {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  span:nth-child(n + 3) {
    flex-direction: row;
    align-items: center;
    gap: 0.25rem;
    b {
      display: none;
    }
  }
`;
const Meta = styled.div`
  font-size: 0.72rem;
  color: #94a3b8;
  text-transform: capitalize;
`;
const Empty = styled.p`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 1rem auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  color: #64748b;
`;
const Err = styled(Empty)`
  color: #b91c1c;
`;
const Hint = styled.p`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 1.25rem auto 0;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  color: #64748b;
  font-size: 0.8rem;
  display: flex;
  gap: 0.4rem;
  align-items: center;
`;
