import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiPlus, FiZap } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import { fetchPublicStreaks, type TradingStreak } from "../../services/streakService";

const StreaksPage: React.FC = () => {
  const [items, setItems] = useState<TradingStreak[]>([]);
  const [sort, setSort] = useState("current");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchPublicStreaks({ sort, page: 1, limit: 40 })
      .then((r) => {
        setItems(r.items || []);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [sort]);

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <h1>Trading Streaks</h1>
          <p>
            Show up every day. Check in after you follow your plan — not after every win —
            and climb the discipline leaderboard with fellow traders.
          </p>
          <HeroActions>
            <Cta to="/user-panel/streak">
              <FiZap /> Start my streak
            </Cta>
            <Ghost to="/strategies">Browse strategies</Ghost>
          </HeroActions>
        </HeroInner>
      </Hero>
      <Page>
        <Toolbar>
          <h2>
            <FiZap /> Leaderboard
          </h2>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="current">Current streak</option>
            <option value="longest">Longest streak</option>
          </select>
        </Toolbar>
        {error && <Err>{error}</Err>}
        {loading && <Empty>Loading streaks…</Empty>}
        {!loading && items.length === 0 && (
          <Empty>
            No public streaks yet.{" "}
            <Link to="/user-panel/streak">
              <FiPlus /> Check in today
            </Link>
          </Empty>
        )}
        <List>
          {items.map((s, i) => (
            <Row key={s.id}>
              <Rank>#{i + 1}</Rank>
              <Avatar $img={s.user?.profileImage}>
                {!s.user?.profileImage && (s.displayName || "TR").slice(0, 2).toUpperCase()}
              </Avatar>
              <Info>
                <strong>{s.displayName || "Trader"}</strong>
                {s.note && <em>{s.note}</em>}
              </Info>
              <Nums>
                <span>
                  <b>{s.currentStreak}</b> current
                </span>
                <span>
                  <b>{s.longestStreak}</b> best
                </span>
                <span>
                  <b>{s.totalCheckIns}</b> total
                </span>
              </Nums>
            </Row>
          ))}
        </List>
      </Page>
    </>
  );
};

export default StreaksPage;

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
  max-width: 820px;
  margin: 0 auto 1rem;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  h2 {
    margin: 0;
    color: #132e58;
    font-size: 1.15rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  select {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.4rem 0.55rem;
    background: #fff;
    font: inherit;
  }
`;
const List = styled.div`
  max-width: 820px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;
const Row = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  gap: 0.75rem;
  align-items: center;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  @media (max-width: 640px) {
    grid-template-columns: auto auto 1fr;
    grid-template-rows: auto auto;
  }
`;
const Rank = styled.span`
  font-weight: 800;
  color: #f59e0b;
  min-width: 2rem;
`;
const Avatar = styled.div<{ $img?: string }>`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: ${({ $img }) => ($img ? `url(${$img}) center/cover` : "linear-gradient(145deg,#fbbf24,#f59e0b)")};
  color: #132e58;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
`;
const Info = styled.div`
  min-width: 0;
  strong {
    display: block;
    color: #132e58;
  }
  em {
    display: block;
    font-style: normal;
    font-size: 0.78rem;
    color: #64748b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
const Nums = styled.div`
  display: flex;
  gap: 0.85rem;
  font-size: 0.72rem;
  color: #64748b;
  b {
    display: block;
    color: #132e58;
    font-size: 1.05rem;
  }
  @media (max-width: 640px) {
    grid-column: 1 / -1;
  }
`;
const Empty = styled.p`
  max-width: 820px;
  margin: 1rem auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  color: #64748b;
  a {
    color: #132e58;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }
`;
const Err = styled(Empty)`
  color: #b91c1c;
`;
