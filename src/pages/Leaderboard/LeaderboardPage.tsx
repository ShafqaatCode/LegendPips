import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiAward, FiChevronRight, FiZap } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import { fetchPublicStreaks, type TradingStreak } from "../../services/streakService";
import { fetchCompetitions, type Competition } from "../../services/contestService";

const LeaderboardPage: React.FC = () => {
  const [streaks, setStreaks] = useState<TradingStreak[]>([]);
  const [contests, setContests] = useState<Competition[]>([]);
  const [sort, setSort] = useState("current");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchPublicStreaks({ sort, page: 1, limit: 20 }),
      fetchCompetitions("Ongoing", 1, 12).catch(() => ({ items: [] as Competition[] })),
    ])
      .then(([streakRes, contestRes]) => {
        if (cancelled) return;
        setStreaks(streakRes.items || []);
        const list = contestRes.items || [];
        setContests(
          list
            .filter((c) => {
              const status = String(c.status || "").toLowerCase();
              return !status || status === "ongoing" || status === "active" || status === "live";
            })
            .slice(0, 6)
        );
        setError(null);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load leaderboard");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sort]);

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <Eyebrow>Compete · Climb · Win</Eyebrow>
          <h1>Leaderboard</h1>
          <p>
            Track streak discipline and live contest rankings in one place — then jump into rewards when you
            hit your next milestone.
          </p>
          <HeroActions>
            <Cta to="/user-panel/rewards#trading-streak">
              <FiZap /> Start my streak
            </Cta>
            <Ghost to="/rewards">Explore rewards</Ghost>
            <Ghost to="/contests">All contests</Ghost>
          </HeroActions>
        </HeroInner>
      </Hero>

      <Page>
        {error && <Err>{error}</Err>}

        <Section>
          <SectionHead>
            <h2>
              <FiZap /> Streak leaderboard
            </h2>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort streaks">
              <option value="current">Current streak</option>
              <option value="longest">Longest streak</option>
            </select>
          </SectionHead>

          {loading && <Empty>Loading rankings…</Empty>}
          {!loading && streaks.length === 0 && (
            <Empty>
              No public streaks yet.{" "}
              <Link to="/user-panel/streak">Check in today</Link>
            </Empty>
          )}

          <List>
            {streaks.map((s, i) => (
              <Row key={s.id}>
                <Rank>#{i + 1}</Rank>
                <Avatar $img={s.user?.profileImage}>
                  {!s.user?.profileImage && (s.displayName || "TR").slice(0, 2).toUpperCase()}
                </Avatar>
                <Info>
                  <strong>{s.displayName || "Trader"}</strong>
                  {s.note ? <em>{s.note}</em> : null}
                </Info>
                <Nums>
                  <span>
                    <b>{s.currentStreak}</b> current
                  </span>
                  <span>
                    <b>{s.longestStreak}</b> best
                  </span>
                </Nums>
              </Row>
            ))}
          </List>

          <MoreRow>
            <Link to="/streaks">
              Full streaks board <FiChevronRight />
            </Link>
          </MoreRow>
        </Section>

        <Section>
          <SectionHead>
            <h2>
              <FiAward /> Contest leaderboards
            </h2>
          </SectionHead>
          {contests.length === 0 && !loading ? (
            <Empty>
              No active contests right now.{" "}
              <Link to="/contests">Browse contests</Link>
            </Empty>
          ) : (
            <ContestGrid>
              {contests.map((c) => (
                <ContestCard key={String(c.id || (c as any)._id)} to={`/contests/${c.id || (c as any)._id}`}>
                  <strong>{c.title || (c as any).name || "Contest"}</strong>
                  <span>View live leaderboard</span>
                  <FiChevronRight aria-hidden />
                </ContestCard>
              ))}
            </ContestGrid>
          )}
        </Section>

        <RewardsCta to="/rewards">
          <div>
            <strong>Gift & cash rewards</strong>
            <p>Link your account, hit lot milestones, and unlock LegendPips rewards.</p>
          </div>
          <span>
            Open rewards <FiChevronRight />
          </span>
        </RewardsCta>
      </Page>
    </>
  );
};

export default LeaderboardPage;

const Hero = styled.section`
  position: relative;
  min-height: 280px;
  display: flex;
  align-items: flex-end;
  background: url(${bannerBg}) center/cover no-repeat;
  color: #fff;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(11, 24, 48, 0.92), rgba(19, 46, 88, 0.78));
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1120px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 2rem;
  width: 100%;

  h1 {
    margin: 0.35rem 0 0.55rem;
    font-size: clamp(1.75rem, 3.5vw, 2.4rem);
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  p {
    margin: 0;
    max-width: 40rem;
    font-size: 0.95rem;
    line-height: 1.55;
    color: rgba(255, 255, 255, 0.85);
  }
`;

const Eyebrow = styled.div`
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fbc113;
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 1.15rem;
`;

const Cta = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.7rem 1rem;
  border-radius: 11px;
  background: #fbc113;
  color: #132e58;
  font-weight: 800;
  font-size: 0.85rem;
  text-decoration: none;
`;

const Ghost = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0.7rem 1rem;
  border-radius: 11px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: none;
`;

const Page = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 3rem;
`;

const Section = styled.section`
  margin-bottom: 1.5rem;
  padding: 1.15rem 1.15rem 1.05rem;
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.04);
`;

const SectionHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.9rem;
  flex-wrap: wrap;

  h2 {
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 1rem;
    font-weight: 800;
    color: #132e58;
  }

  select {
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 0.45rem 0.65rem;
    font-family: inherit;
    font-size: 0.8rem;
    color: #132e58;
    background: #f8fafc;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem 0.85rem;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #eef2f7;

  @media (max-width: 640px) {
    grid-template-columns: auto 1fr;
    .nums {
      grid-column: 1 / -1;
    }
  }
`;

const Rank = styled.span`
  font-size: 0.78rem;
  font-weight: 800;
  color: #94a3b8;
  min-width: 2rem;
`;

const Avatar = styled.div<{ $img?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $img }) =>
    $img ? `url(${$img}) center/cover` : "linear-gradient(145deg, #132e58, #1a3d6e)"};
  color: #fbc113;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 800;
`;

const Info = styled.div`
  min-width: 0;
  strong {
    display: block;
    font-size: 0.88rem;
    color: #132e58;
  }
  em {
    display: block;
    margin-top: 0.15rem;
    font-style: normal;
    font-size: 0.72rem;
    color: #64748b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Nums = styled.div.attrs({ className: "nums" })`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  span {
    font-size: 0.72rem;
    color: #64748b;
  }
  b {
    color: #132e58;
    font-weight: 800;
  }
`;

const Empty = styled.p`
  margin: 0.5rem 0;
  font-size: 0.88rem;
  color: #64748b;
  a {
    color: #132e58;
    font-weight: 700;
  }
`;

const Err = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.85rem;
  font-weight: 600;
`;

const MoreRow = styled.div`
  margin-top: 0.85rem;
  display: flex;
  justify-content: flex-end;
  a {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    font-size: 0.82rem;
    font-weight: 700;
    color: #132e58;
    text-decoration: none;
  }
`;

const ContestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
`;

const ContestCard = styled(Link)`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  gap: 0.2rem 0.5rem;
  padding: 0.95rem 1rem;
  border-radius: 12px;
  border: 1px solid #e8ecf1;
  background: #fff;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s ease, transform 0.15s ease;

  &:hover {
    border-color: rgba(251, 193, 19, 0.55);
    transform: translateY(-2px);
  }

  strong {
    grid-column: 1;
    font-size: 0.9rem;
    color: #132e58;
  }

  span {
    grid-column: 1;
    font-size: 0.75rem;
    color: #64748b;
  }

  svg {
    grid-row: 1 / span 2;
    align-self: center;
    color: #94a3b8;
  }
`;

const RewardsCta = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
  padding: 1.15rem 1.25rem;
  border-radius: 16px;
  text-decoration: none;
  background: linear-gradient(135deg, #0b1830 0%, #132e58 55%, #1a3d6e 100%);
  border: 1px solid rgba(251, 193, 19, 0.3);
  color: #fff;

  strong {
    display: block;
    font-size: 1.05rem;
    margin-bottom: 0.25rem;
  }

  p {
    margin: 0;
    font-size: 0.82rem;
    color: rgba(255, 255, 255, 0.75);
  }

  > span {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.65rem 0.95rem;
    border-radius: 10px;
    background: #fbc113;
    color: #132e58;
    font-weight: 800;
    font-size: 0.84rem;
  }
`;
