import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { FiArrowLeft, FiEye, FiHeart, FiShield } from "react-icons/fi";
import {
  fetchPublicStrategy,
  likeStrategy,
  type TradingStrategy,
} from "../../services/strategyService";
import { useAuth } from "../../contexts/AuthContext";

const StrategyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [item, setItem] = useState<TradingStrategy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchPublicStrategy(id)
      .then(setItem)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [id]);

  const onLike = async () => {
    if (!id || !user) {
      window.location.href = `/login?redirect=/strategies/${id}`;
      return;
    }
    setLiking(true);
    try {
      setItem(await likeStrategy(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not like");
    } finally {
      setLiking(false);
    }
  };

  if (error && !item) {
    return (
      <Page>
        <Back to="/strategies">
          <FiArrowLeft /> All strategies
        </Back>
        <Err>{error}</Err>
      </Page>
    );
  }

  if (!item) {
    return (
      <Page>
        <Empty>Loading…</Empty>
      </Page>
    );
  }

  const author =
    item.user?.firstName || item.user?.lastName
      ? `${item.user.firstName || ""} ${item.user.lastName || ""}`.trim()
      : "Trader";

  return (
    <Page>
      <Back to="/strategies">
        <FiArrowLeft /> All strategies
      </Back>
      <Article>
        <Head>
          <Tags>
            <Pill $tone={item.riskLevel}>{item.riskLevel} risk</Pill>
            <Pill>{item.timeframe}</Pill>
            {(item.markets || []).map((m) => (
              <Pill key={m}>{m}</Pill>
            ))}
          </Tags>
          <h1>{item.title}</h1>
          {item.summary && <Lead>{item.summary}</Lead>}
          <Meta>
            By {author}
            <span>
              <FiHeart /> {item.likeCount}
            </span>
            <span>
              <FiEye /> {item.viewCount}
            </span>
          </Meta>
        </Head>

        <Stats>
          <div>
            <b>{item.claimedWinRatePercent != null ? `${item.claimedWinRatePercent}%` : "—"}</b>
            Claimed win rate
          </div>
          <div>
            <b>{item.claimedRoiPercent != null ? `${item.claimedRoiPercent}%` : "—"}</b>
            Claimed ROI
          </div>
        </Stats>

        <Section>
          <h2>How it works</h2>
          <p>{item.content}</p>
        </Section>
        {item.entryRules && (
          <Section>
            <h2>Entry rules</h2>
            <p>{item.entryRules}</p>
          </Section>
        )}
        {item.exitRules && (
          <Section>
            <h2>Exit rules</h2>
            <p>{item.exitRules}</p>
          </Section>
        )}
        {item.riskRules && (
          <Section>
            <h2>Risk management</h2>
            <p>{item.riskRules}</p>
          </Section>
        )}
        {item.tags?.length > 0 && (
          <Tags>
            {item.tags.map((t) => (
              <Pill key={t}>#{t}</Pill>
            ))}
          </Tags>
        )}

        <Actions>
          <LikeBtn type="button" onClick={onLike} disabled={liking} $on={!!item.likedByMe}>
            <FiHeart /> {item.likedByMe ? "Liked" : "Like strategy"}
          </LikeBtn>
          <Link to="/user-panel/strategies">Share your own →</Link>
        </Actions>

        <Hint>
          <FiShield /> Performance numbers are self-reported by the author. This is education, not financial advice.
        </Hint>
      </Article>
    </Page>
  );
};

export default StrategyDetailPage;

const Page = styled.main`
  background: #f4f6fa;
  min-height: 60vh;
  padding: 1.5rem 0 3rem;
`;
const Back = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  max-width: 820px;
  margin: 0 auto 1rem;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  color: #132e58;
  font-weight: 700;
  text-decoration: none;
  width: 100%;
  box-sizing: border-box;
`;
const Article = styled.article`
  max-width: 820px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
`;
const Head = styled.header`
  h1 {
    margin: 0.5rem 0;
    color: #132e58;
    font-size: clamp(1.5rem, 3vw, 2rem);
  }
`;
const Lead = styled.p`
  color: #475569;
  font-size: 1.05rem;
  line-height: 1.55;
  margin: 0 0 0.75rem;
`;
const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  color: #64748b;
  font-size: 0.85rem;
  span {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }
`;
const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.35rem;
`;
const Pill = styled.span<{ $tone?: string }>`
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: capitalize;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: #eef2ff;
  color: ${({ $tone }) => ($tone === "high" ? "#b91c1c" : $tone === "low" ? "#059669" : "#132e58")};
`;
const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 1.25rem 0;
  div {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 0.85rem 1rem;
    font-size: 0.8rem;
    color: #64748b;
  }
  b {
    display: block;
    color: #132e58;
    font-size: 1.35rem;
    margin-bottom: 0.15rem;
  }
`;
const Section = styled.section`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1rem 1.15rem;
  margin-bottom: 0.75rem;
  h2 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    color: #132e58;
  }
  p {
    margin: 0;
    white-space: pre-wrap;
    line-height: 1.65;
    color: #334155;
    font-size: 0.95rem;
  }
`;
const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin: 1.25rem 0;
  a {
    color: #132e58;
    font-weight: 700;
    font-size: 0.9rem;
  }
`;
const LikeBtn = styled.button<{ $on?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 0;
  border-radius: 10px;
  padding: 0.55rem 1rem;
  font-weight: 800;
  cursor: pointer;
  background: ${({ $on }) => ($on ? "#fbbf24" : "#132e58")};
  color: ${({ $on }) => ($on ? "#132e58" : "#fff")};
  &:disabled {
    opacity: 0.7;
  }
`;
const Hint = styled.p`
  color: #64748b;
  font-size: 0.8rem;
  display: flex;
  gap: 0.4rem;
  align-items: flex-start;
`;
const Empty = styled.p`
  text-align: center;
  color: #64748b;
  padding: 3rem;
`;
const Err = styled(Empty)`
  color: #b91c1c;
`;
