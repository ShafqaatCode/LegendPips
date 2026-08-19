import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { FiCheckCircle, FiShield } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import { useAuth } from "../../contexts/AuthContext";
import { useAuthModal } from "../../contexts/AuthModalContext";
import { fetchPublicTrader, requestCopyTrader, type TraderProfile } from "../../services/traderService";

const TraderDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { openSignIn } = useAuthModal();
  const [trader, setTrader] = useState<TraderProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState("500");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchPublicTrader(id)
      .then(setTrader)
      .catch((e) => setError(e instanceof Error ? e.message : "Not found"));
  }, [id]);

  const onCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(null);
    if (!id) return;
    if (!isAuthenticated) {
      openSignIn({ returnTo: `/traders/${id}` });
      return;
    }
    const usd = parseFloat(amount);
    if (!Number.isFinite(usd) || usd <= 0) {
      setError("Enter a positive allocation amount.");
      return;
    }
    setSaving(true);
    try {
      const res = await requestCopyTrader(id, { amountUsd: usd, note: note.trim() || undefined });
      setOk(res.message || "Request sent.");
      setTrader((t) => (t ? { ...t, copying: true } : t));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setSaving(false);
    }
  };

  if (error && !trader) {
    return (
      <Page>
        <Empty>{error}</Empty>
        <Empty><Link to="/traders">Back to traders</Link></Empty>
      </Page>
    );
  }
  if (!trader) return <Empty>Loading…</Empty>;

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <h1>{trader.displayName}</h1>
          <p>
            <FiCheckCircle /> Verified performance profile
            {trader.strategy ? ` · ${trader.strategy}` : ""}
          </p>
        </HeroInner>
      </Hero>
      <Page>
        <Layout>
          <Main>
            <Card>
              <h2>About</h2>
              <p>{trader.bio || "No bio published."}</p>
              <Meta>Markets: {(trader.markets || []).join(", ") || "—"}</Meta>
              {trader.proofUrl && (
                <p>
                  Proof / track record:{" "}
                  <a href={trader.proofUrl} target="_blank" rel="noopener noreferrer">
                    Open link
                  </a>
                </p>
              )}
            </Card>
            <Card>
              <h2>Self-reported stats (reviewed)</h2>
              <Stats>
                <div><b>{trader.roiPercent != null ? `${trader.roiPercent}%` : "—"}</b><span>ROI</span></div>
                <div><b>{trader.winRatePercent != null ? `${trader.winRatePercent}%` : "—"}</b><span>Win rate</span></div>
                <div><b>{trader.maxDrawdownPercent != null ? `${trader.maxDrawdownPercent}%` : "—"}</b><span>Max drawdown</span></div>
                <div><b>{trader.monthsActive != null ? trader.monthsActive : "—"}</b><span>Months</span></div>
                <div><b>{trader.followerCount || 0}</b><span>Copiers</span></div>
              </Stats>
              <Hint>
                <FiShield /> LegendPips reviews submissions. These figures are not live-synced from a broker terminal.
              </Hint>
            </Card>
          </Main>
          <Aside>
            <Card>
              <h2>Copy this trader</h2>
              {!trader.copyEnabled && <p>This trader is not accepting copy requests right now.</p>}
              {trader.copyEnabled && (
                <>
                  <Meta>
                    Fee {trader.copyFeePercent != null ? `${trader.copyFeePercent}%` : "n/a"} · Min $
                    {trader.minCopyUsd ?? 0}
                    {trader.maxCopiers ? ` · Max ${trader.maxCopiers} copiers` : ""}
                  </Meta>
                  {trader.copyTerms && <p>{trader.copyTerms}</p>}
                  {trader.copying ? (
                    <p>
                      You already have a request. Manage it in{" "}
                      <button type="button" onClick={() => navigate("/user-panel/copy-trading")}>
                        your copy trading panel
                      </button>
                      .
                    </p>
                  ) : (
                    <form onSubmit={onCopy}>
                      <label>
                        Allocation (USD)
                        <input value={amount} onChange={(e) => setAmount(e.target.value)} />
                      </label>
                      <label>
                        Note (optional)
                        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
                      </label>
                      {error && <Err>{error}</Err>}
                      {ok && <Ok>{ok}</Ok>}
                      <Go type="submit" disabled={saving}>{saving ? "Sending…" : "Request to copy"}</Go>
                    </form>
                  )}
                </>
              )}
            </Card>
            <Link to="/traders">← All traders</Link>
          </Aside>
        </Layout>
      </Page>
    </>
  );
};

export default TraderDetailPage;

const Hero = styled.section`
  position: relative;
  min-height: clamp(220px, 30vh, 300px);
  display: flex; align-items: center; overflow: hidden;
  background: linear-gradient(135deg, #0b1b38 0%, #132e58 100%);
  padding: clamp(3rem, 7vw, 4.5rem) ${({ theme }) => theme.typography.pageGutter} 2rem;
`;
const Overlay = styled.div`
  position: absolute; inset: 0; opacity: 0.15;
  background-image: url(${bannerBg}); background-size: cover; filter: blur(2px);
  &::after { content: ""; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(11,27,56,.8), rgba(19,46,88,.8)); }
`;
const HeroInner = styled.div`
  position: relative; z-index: 2; max-width: 800px; margin: 0 auto; text-align: center; color: #fff;
  h1 { margin: 0 0 0.5rem; }
  p { margin: 0; display: flex; gap: 0.4rem; justify-content: center; align-items: center; color: #86efac; }
`;
const Page = styled.main` background: #f4f6fa; padding: 1.25rem 0 3rem; `;
const Layout = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(260px, 0.7fr);
  gap: 1rem;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`;
const Main = styled.div` display: flex; flex-direction: column; gap: 1rem; `;
const Aside = styled.aside`
  display: flex; flex-direction: column; gap: 0.75rem;
  a, button { color: #132e58; font-weight: 700; background: none; border: 0; cursor: pointer; font: inherit; }
`;
const Card = styled.section`
  background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1.1rem 1.2rem;
  h2 { margin: 0 0 0.65rem; color: #132e58; font-size: 1.05rem; }
  p { margin: 0 0 0.6rem; color: #475569; font-size: 0.9rem; line-height: 1.55; }
  form { display: flex; flex-direction: column; gap: 0.55rem; }
  label { font-size: 0.75rem; font-weight: 700; color: #132e58; display: flex; flex-direction: column; gap: 0.3rem; }
  input, textarea { font: inherit; padding: 0.5rem 0.65rem; border: 1px solid #e2e8f0; border-radius: 8px; }
`;
const Stats = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 0.65rem;
  b { display: block; font-size: 1.2rem; color: #132e58; }
  span { font-size: 0.72rem; color: #64748b; }
`;
const Meta = styled.p` font-size: 0.8rem !important; color: #64748b !important; text-transform: capitalize; `;
const Hint = styled.p` font-size: 0.78rem !important; display: flex; gap: 0.35rem; align-items: flex-start; `;
const Empty = styled.p` text-align: center; color: #64748b; padding: 3rem 1rem; `;
const Err = styled.div` color: #b91c1c; font-size: 0.8rem; `;
const Ok = styled.div` color: #047857; font-size: 0.8rem; `;
const Go = styled.button`
  background: #fbbf24; color: #132e58; border: 0; border-radius: 10px;
  padding: 0.6rem 0.9rem; font-weight: 800; cursor: pointer;
  &:disabled { opacity: 0.6; }
`;
