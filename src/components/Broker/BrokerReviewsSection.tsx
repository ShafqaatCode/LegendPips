import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { FaStar } from "react-icons/fa";
import { FiCheckCircle, FiShield, FiStar } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useAuthModal } from "../../contexts/AuthModalContext";
import { findContentSafetyIssue } from "../../utils/contentSafety";
import {
  fetchBrokerReviews,
  submitBrokerReview,
  type MyBrokerReview,
  type PublicBrokerReview,
  type ReviewStats,
} from "../../services/brokerReviewService";

const EMPTY_STATS: ReviewStats = {
  average: 0,
  count: 0,
  breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

type Props = {
  brokerId: string;
  brokerName: string;
};

const formatDate = (raw?: string) => {
  if (!raw) return "";
  try {
    return new Date(raw).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "TR";

const BrokerReviewsSection: React.FC<Props> = ({ brokerId, brokerName }) => {
  const { isAuthenticated } = useAuth();
  const { openSignIn } = useAuthModal();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<PublicBrokerReview[]>([]);
  const [editorial, setEditorial] = useState<PublicBrokerReview[]>([]);
  const [stats, setStats] = useState<ReviewStats>(EMPTY_STATS);
  const [myReview, setMyReview] = useState<MyBrokerReview | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formOk, setFormOk] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(
    async (p: number) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBrokerReviews(brokerId, { page: p, limit: 8 });
        setItems(data.items);
        setEditorial(p === 1 ? data.editorial : []);
        setStats(data.stats);
        setMyReview(data.myReview);
        setTotalPages(Math.max(1, data.pagination.totalPages || 1));
        if (data.myReview) {
          setRating(data.myReview.rating);
          setTitle(data.myReview.title || "");
          setComment(data.myReview.comment || "");
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Could not load reviews.");
      } finally {
        setLoading(false);
      }
    },
    [brokerId]
  );

  useEffect(() => {
    setPage(1);
    load(1);
  }, [brokerId, load]);

  useEffect(() => {
    if (window.location.hash === "#reviews") {
      document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [brokerId, loading]);

  const visible = useMemo(() => {
    if (page !== 1) return items;
    return [...editorial, ...items];
  }, [editorial, items, page]);

  const maxBar = Math.max(1, ...Object.values(stats.breakdown));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormOk(null);
    if (!isAuthenticated) {
      openSignIn({ returnTo: `${window.location.pathname}#reviews` });
      return;
    }
    const safety = findContentSafetyIssue(`${title}\n${comment}`);
    if (safety) {
      setFormError(safety);
      return;
    }
    if (comment.trim().length < 20) {
      setFormError("Please write at least 20 characters so other traders can understand your experience.");
      return;
    }
    setSaving(true);
    try {
      const res = await submitBrokerReview(brokerId, { rating, title: title.trim(), comment: comment.trim() });
      setMyReview(res.review);
      setFormOk(res.message);
      await load(page);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Could not submit review.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Wrap id="reviews">
      <Head>
        <div>
          <Eyebrow>
            <FiStar /> Trader reviews
          </Eyebrow>
          <Title>{brokerName} reviews</Title>
          <Sub>
            Honest trader feedback, moderated by LegendPips. KYC-verified members are marked so you can
            trust the source.
          </Sub>
        </div>
        <ScoreCard>
          <ScoreNum>{stats.count ? stats.average.toFixed(1) : "—"}</ScoreNum>
          <Stars>
            {[1, 2, 3, 4, 5].map((n) => (
              <FaStar key={n} color={n <= Math.round(stats.average) ? "#FBAF00" : "#d1d5db"} />
            ))}
          </Stars>
          <ScoreMeta>
            {stats.count ? `${stats.count} review${stats.count === 1 ? "" : "s"}` : "No reviews yet"}
          </ScoreMeta>
        </ScoreCard>
      </Head>

      {stats.count > 0 && (
        <Bars>
          {([5, 4, 3, 2, 1] as const).map((n) => (
            <BarRow key={n}>
              <span>{n} star</span>
              <BarTrack>
                <BarFill $pct={(stats.breakdown[n] / maxBar) * 100} />
              </BarTrack>
              <em>{stats.breakdown[n]}</em>
            </BarRow>
          ))}
        </Bars>
      )}

      <FormCard>
        <FormTitle>{myReview ? "Update your review" : `Write a review of ${brokerName}`}</FormTitle>
        {myReview?.status === "pending" && (
          <Notice>Your review is awaiting moderation. It will appear publicly after approval.</Notice>
        )}
        {myReview?.status === "approved" && (
          <Notice $ok>Your review is live. Editing it sends it back for a quick re-check.</Notice>
        )}
        {myReview?.status === "rejected" && (
          <Notice $warn>
            Previous submission was not published{myReview.adminNote ? `: ${myReview.adminNote}` : "."} You
            can edit and resubmit.
          </Notice>
        )}
        <form onSubmit={handleSubmit}>
          <StarPicker>
            {[1, 2, 3, 4, 5].map((n) => (
              <StarBtn
                key={n}
                type="button"
                aria-label={`${n} stars`}
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(n)}
              >
                <FaStar size={22} color={n <= (hoverRating || rating) ? "#FBAF00" : "#d1d5db"} />
              </StarBtn>
            ))}
            <span>{rating} / 5</span>
          </StarPicker>
          <Field
            placeholder="Headline (optional)"
            value={title}
            maxLength={80}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Area
            placeholder="Share spreads, withdrawals, support, or execution — at least 20 characters."
            value={comment}
            maxLength={2000}
            rows={5}
            onChange={(e) => setComment(e.target.value)}
          />
          {formError && <Err>{formError}</Err>}
          {formOk && <Ok>{formOk}</Ok>}
          <Submit type="submit" disabled={saving}>
            {saving ? "Sending…" : isAuthenticated ? "Submit review" : "Sign in to review"}
          </Submit>
        </form>
      </FormCard>

      {error && <Err>{error}</Err>}

      {loading ? (
        <Empty>Loading reviews…</Empty>
      ) : visible.length === 0 ? (
        <Empty>No published reviews yet. Be the first trader to share your experience.</Empty>
      ) : (
        <List>
          {visible.map((r) => (
            <Item key={r.id}>
              <Avatar aria-hidden>{initials(r.authorName)}</Avatar>
              <div>
                <ItemTop>
                  <strong>{r.authorName}</strong>
                  {r.kycVerified && (
                    <Badge>
                      <FiShield size={12} /> Verified trader
                    </Badge>
                  )}
                  {r.source === "editorial" && (
                    <Badge $gold>
                      <FiCheckCircle size={12} /> LegendPips
                    </Badge>
                  )}
                  <time>{formatDate(r.createdAt)}</time>
                </ItemTop>
                <Stars>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <FaStar key={n} size={12} color={n <= r.rating ? "#FBAF00" : "#d1d5db"} />
                  ))}
                </Stars>
                {r.title ? <ItemTitle>{r.title}</ItemTitle> : null}
                <ItemBody>{r.comment}</ItemBody>
              </div>
            </Item>
          ))}
        </List>
      )}

      {totalPages > 1 && (
        <Pager>
          <PageBtn type="button" disabled={page <= 1} onClick={() => { setPage(page - 1); load(page - 1); }}>
            Previous
          </PageBtn>
          <span>
            Page {page} of {totalPages}
          </span>
          <PageBtn type="button" disabled={page >= totalPages} onClick={() => { setPage(page + 1); load(page + 1); }}>
            Next
          </PageBtn>
        </Pager>
      )}
    </Wrap>
  );
};

export default BrokerReviewsSection;

const Wrap = styled.section`
  margin-top: 1.5rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.35rem 1.25rem 1.5rem;
  scroll-margin-top: 5.5rem;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.25rem;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #b45309;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 0.35rem;
`;

const Title = styled.h2`
  margin: 0 0 0.35rem;
  font-size: 1.35rem;
  color: #132e58;
`;

const Sub = styled.p`
  margin: 0;
  max-width: 36rem;
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.55;
`;

const ScoreCard = styled.div`
  min-width: 140px;
  text-align: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.85rem 1rem;
`;

const ScoreNum = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #132e58;
  line-height: 1;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.15rem;
  justify-content: center;
  margin: 0.35rem 0 0.2rem;
`;

const ScoreMeta = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
`;

const Bars = styled.div`
  margin: 1.1rem 0 0.4rem;
  display: grid;
  gap: 0.35rem;
  max-width: 420px;
`;

const BarRow = styled.div`
  display: grid;
  grid-template-columns: 52px 1fr 28px;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.72rem;
  color: #475569;
  em {
    font-style: normal;
    text-align: right;
    font-weight: 600;
  }
`;

const BarTrack = styled.div`
  height: 7px;
  background: #e2e8f0;
  border-radius: 99px;
  overflow: hidden;
`;

const BarFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => `${$pct}%`};
  background: #fbbf24;
`;

const FormCard = styled.div`
  margin: 1.25rem 0 1.5rem;
  padding: 1rem 1.05rem 1.1rem;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  background: #fafbfc;
`;

const FormTitle = styled.h3`
  margin: 0 0 0.65rem;
  font-size: 1rem;
  color: #132e58;
`;

const Notice = styled.p<{ $ok?: boolean; $warn?: boolean }>`
  margin: 0 0 0.75rem;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: ${({ $ok, $warn }) => ($warn ? "#9a3412" : $ok ? "#166534" : "#1e3a8a")};
`;

const StarPicker = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  margin-bottom: 0.65rem;
  span {
    margin-left: 0.5rem;
    font-size: 0.8rem;
    font-weight: 700;
    color: #132e58;
  }
`;

const StarBtn = styled.button`
  background: none;
  border: 0;
  padding: 0.1rem;
  cursor: pointer;
`;

const Field = styled.input`
  width: 100%;
  margin-bottom: 0.55rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font: inherit;
  box-sizing: border-box;
`;

const Area = styled.textarea`
  width: 100%;
  margin-bottom: 0.55rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font: inherit;
  resize: vertical;
  box-sizing: border-box;
`;

const Submit = styled.button`
  background: #132e58;
  color: #fff;
  border: 0;
  border-radius: 8px;
  padding: 0.6rem 1.15rem;
  font-weight: 700;
  font: inherit;
  cursor: pointer;
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: #1a3d6e;
  }
`;

const Err = styled.p`
  color: #b91c1c;
  font-size: 0.8125rem;
  margin: 0 0 0.55rem;
`;

const Ok = styled.p`
  color: #166534;
  font-size: 0.8125rem;
  margin: 0 0 0.55rem;
`;

const Empty = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  margin: 0.5rem 0 0;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Item = styled.article`
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eef2f7;
  &:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }
`;

const Avatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #132e58;
  color: #fbbf24;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
`;

const ItemTop = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 0.55rem;
  strong {
    color: #132e58;
    font-size: 0.95rem;
  }
  time {
    margin-left: auto;
    font-size: 0.75rem;
    color: #94a3b8;
  }
`;

const Badge = styled.span<{ $gold?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.15rem 0.4rem;
  border-radius: 99px;
  background: ${({ $gold }) => ($gold ? "#fef3c7" : "#ecfdf5")};
  color: ${({ $gold }) => ($gold ? "#92400e" : "#047857")};
`;

const ItemTitle = styled.div`
  margin-top: 0.25rem;
  font-weight: 700;
  color: #132e58;
  font-size: 0.9rem;
`;

const ItemBody = styled.p`
  margin: 0.3rem 0 0;
  color: #334155;
  font-size: 0.875rem;
  line-height: 1.55;
`;

const Pager = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #64748b;
`;

const PageBtn = styled.button`
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 8px;
  padding: 0.35rem 0.7rem;
  cursor: pointer;
  font: inherit;
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
