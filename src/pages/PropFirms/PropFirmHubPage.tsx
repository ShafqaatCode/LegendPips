import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiAward, FiCheckCircle, FiCopy, FiSearch, FiAlertTriangle, FiStar } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import CompareToggle from "../../components/Broker/CompareToggle";
import PropFirmCard from "../../components/Broker/PropFirmCard";
import { fetchBrokersPage, type ApiBroker, type PropCashbackOffer } from "../../services/brokerService";
import { fetchRecentPayoutReviews, type PublicBrokerReview } from "../../services/brokerReviewService";
import { fetchComplaintBlacklist, type BlacklistBroker } from "../../services/complaintService";
import { formatPropCardSummary } from "../../utils/propTradingDisplay";
import { mapApiBrokerToRebateCardRow } from "../../utils/rebatesBrokersDisplay";
import { comparePath, getCompareIds } from "../../utils/compareBrokers";
import { useLocale } from "../../contexts/LocaleContext";

function cashbackNum(v?: string) {
  const n = parseFloat(String(v || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : -1;
}

function bestOffer(offers: PropCashbackOffer[]) {
  const best = offers.reduce((m, o) => Math.max(m, cashbackNum(o.firstPurchaseCashback)), -1);
  return offers.find((o) => cashbackNum(o.firstPurchaseCashback) === best) || offers[0];
}

function collectCodes(b: ApiBroker) {
  const fromOffers = (b.propOffers || [])
    .filter((o) => o.discountCode)
    .map((o) => ({
      code: o.discountCode!,
      label: o.label,
      percent: o.discountPercent || "",
      firm: b.name,
      brokerId: b._id,
    }));
  const fromPromo = (b.propPromoCodes || [])
    .filter((p) => p.active !== false && p.code)
    .map((p) => ({
      code: p.code,
      label: p.label || b.name,
      percent: p.percent || "",
      firm: b.name,
      brokerId: b._id,
    }));
  return [...fromPromo, ...fromOffers];
}

const PropFirmHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ApiBroker[]>([]);
  const [search, setSearch] = useState("");
  const [evalFilter, setEvalFilter] = useState("");
  const [sort, setSort] = useState<"cashback" | "name">("cashback");
  const [error, setError] = useState<string | null>(null);
  const [payoutReviews, setPayoutReviews] = useState<PublicBrokerReview[]>([]);
  const [propWarnings, setPropWarnings] = useState<BlacklistBroker[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const { t } = useLocale();

  useEffect(() => {
    fetchBrokersPage({ rebatesPage: true, category: "prop", page: 1, limit: 50 })
      .then((r) => setItems(r.items || []))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
    fetchRecentPayoutReviews(8)
      .then(setPayoutReviews)
      .catch(() => setPayoutReviews([]));
    fetchComplaintBlacklist()
      .then((r) => setPropWarnings((r.brokers || []).filter((b) => b.rebateCategory === "prop")))
      .catch(() => setPropWarnings([]));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = items.filter((b) => {
      if (
        q &&
        !`${b.name} ${b.description} ${(b.propOffers || []).map((o) => o.label).join(" ")}`.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (evalFilter && !(b.propOffers || []).some((o) => o.evaluationType === evalFilter)) return false;
      return true;
    });
    if (sort === "name") rows = [...rows].sort((a, b) => a.name.localeCompare(b.name));
    else {
      rows = [...rows].sort((a, b) => {
        const aa = Math.max(-1, ...(a.propOffers || []).map((o) => cashbackNum(o.firstPurchaseCashback)));
        const bb = Math.max(-1, ...(b.propOffers || []).map((o) => cashbackNum(o.firstPurchaseCashback)));
        return bb - aa;
      });
    }
    return rows;
  }, [items, search, evalFilter, sort]);

  const discountCodes = useMemo(() => filtered.flatMap(collectCodes), [filtered]);

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* ignore */
    }
  };

  const openPropCompare = () => {
    const selected = getCompareIds().filter((id) => items.some((b) => b._id === id));
    if (selected.length >= 2) {
      navigate(`${comparePath(selected)}?category=prop`);
      return;
    }
    navigate("/compare?category=prop");
  };

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <h1>{t("prop.title")}</h1>
          <p>{t("prop.body")}</p>
          <HeroLinks>
            <Link to="/compare?category=prop">Compare prop firms</Link>
            <Link to="/complaints">File a complaint</Link>
          </HeroLinks>
        </HeroInner>
      </Hero>

      <Page>
        <Steps>
          {[
            { n: "1", t: t("prop.s1t"), d: t("prop.s1d") },
            { n: "2", t: t("prop.s2t"), d: t("prop.s2d") },
            { n: "3", t: t("prop.s3t"), d: t("prop.s3d") },
          ].map((s) => (
            <Step key={s.n}>
              <b>{s.n}</b>
              <div>
                <strong>{s.t}</strong>
                <p>{s.d}</p>
              </div>
            </Step>
          ))}
        </Steps>

        <Toolbar>
          <Search>
            <FiSearch />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search firms" />
          </Search>
          <select value={evalFilter} onChange={(e) => setEvalFilter(e.target.value)}>
            <option value="">All evaluations</option>
            <option value="1-step">1-step</option>
            <option value="2-step">2-step</option>
            <option value="instant">Instant</option>
            <option value="funded">Funded</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as "cashback" | "name")}>
            <option value="cashback">Sort: highest cashback</option>
            <option value="name">Sort: name</option>
          </select>
          <button type="button" onClick={openPropCompare}>
            Compare side by side →
          </button>
        </Toolbar>

        {error && <Empty>{error}</Empty>}

        <TableWrap>
          <table>
            <thead>
              <tr>
                <th>Firm</th>
                <th>Cashback</th>
                <th>Discount / code</th>
                <th>Fee</th>
                <th>Target / DD</th>
                <th>Payout</th>
                <th>Eval / split</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const offers = b.propOffers || [];
                const top = bestOffer(offers);
                const code =
                  top?.discountCode ||
                  (b.propPromoCodes || []).find((p) => p.active !== false)?.code ||
                  "";
                return (
                  <tr key={b._id}>
                    <td>
                      <strong>{b.name}</strong>
                      {b.verified !== false && (
                        <Verified>
                          <FiCheckCircle /> Verified
                        </Verified>
                      )}
                    </td>
                    <td>
                      {top?.firstPurchaseCashback || "—"}
                      {top?.repeatPurchaseCashback ? (
                        <small> / {top.repeatPurchaseCashback} repeat</small>
                      ) : null}
                    </td>
                    <td>
                      {top?.discountPercent || "—"}
                      {code ? (
                        <CodeBtn type="button" onClick={() => copyCode(code)} title="Copy code">
                          <FiCopy /> {code}
                        </CodeBtn>
                      ) : null}
                    </td>
                    <td>{top?.challengeFee || "—"}</td>
                    <td>
                      {[top?.profitTarget, top?.dailyDrawdown && `Daily ${top.dailyDrawdown}`, top?.maxDrawdown && `Max ${top.maxDrawdown}`]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </td>
                    <td>{top?.payoutCycle || "—"}</td>
                    <td>
                      {[top?.evaluationType, top?.profitSplit, top?.accountSize].filter(Boolean).join(" · ") ||
                        formatPropCardSummary(offers)}
                    </td>
                    <td>
                      <RowActions>
                        <Link to={`/rebates/broker/${b._id}`}>Details</Link>
                        <Link to={`/rebates/broker/${b._id}#reviews`}>Payout reviews</Link>
                        <Link to={`/complaints?broker=${b._id}`}>Complaint</Link>
                        <CompareToggle brokerId={b._id} />
                      </RowActions>
                    </td>
                  </tr>
                );
              })}
              {!error && filtered.length === 0 && (
                <tr>
                  <td colSpan={8}>No prop firms match these filters yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </TableWrap>

        {discountCodes.length > 0 && (
          <Section>
            <h2>Discount codes</h2>
            <p>Copy a partner code before you buy a challenge through LegendPips links.</p>
            <CodeGrid>
              {discountCodes.map((c) => (
                <CodeCard key={`${c.brokerId}-${c.code}-${c.label}`}>
                  <strong>{c.firm}</strong>
                  <span>{c.label}{c.percent ? ` · ${c.percent}` : ""}</span>
                  <button type="button" onClick={() => copyCode(c.code)}>
                    <FiCopy /> {copied === c.code ? "Copied" : c.code}
                  </button>
                </CodeCard>
              ))}
            </CodeGrid>
          </Section>
        )}

        <Section>
          <h2>
            <FiStar /> Recent payout reviews
          </h2>
          <p>Trader reports on how long prop firm payouts actually took.</p>
          {payoutReviews.length === 0 ? (
            <Muted>No payout reviews yet. Be the first on a firm detail page.</Muted>
          ) : (
            <ReviewGrid>
              {payoutReviews.map((r) => (
                <ReviewCard key={r.id}>
                  <header>
                    <strong>{r.brokerName || "Prop firm"}</strong>
                    <em>{r.rating}/5</em>
                  </header>
                  {r.payoutSpeedDays != null && (
                    <span className="speed">{r.payoutSpeedDays} days to payout</span>
                  )}
                  <p>{r.comment}</p>
                  {r.brokerId && (
                    <Link to={`/rebates/broker/${r.brokerId}#reviews`}>View firm →</Link>
                  )}
                </ReviewCard>
              ))}
            </ReviewGrid>
          )}
        </Section>

        <Section>
          <h2>
            <FiAlertTriangle /> Complaints & warnings
          </h2>
          <p>
            Report payout, challenge-rule, or support issues. Screenshots help our team investigate faster.
          </p>
          <ComplaintBar>
            <Link to="/complaints">Open complaint center</Link>
            {filtered[0] && <Link to={`/complaints?broker=${filtered[0]._id}`}>File against a listed firm</Link>}
          </ComplaintBar>
          {propWarnings.length > 0 && (
            <WarnList>
              {propWarnings.map((b) => (
                <li key={b.id}>
                  <strong>{b.name}</strong>
                  <span>{b.reason}</span>
                </li>
              ))}
            </WarnList>
          )}
        </Section>

        <ListHead>
          <h2>
            <FiAward /> Partnered prop firms
          </h2>
          <p>Same firms as the Prop tab on Rebates, with challenge cashback cards.</p>
        </ListHead>
        <CardList>
          {filtered.map((b) => {
            const row = mapApiBrokerToRebateCardRow(b);
            return (
              <PropFirmCard
                key={row.key}
                title={row.title}
                brokerId={row.key}
                logoSrc={row.logoSrc}
                rating={row.rating}
                reviewsCount={row.reviewsCount}
                propOffers={row.propOffers || []}
                setupUrl={row.setupUrl}
              />
            );
          })}
        </CardList>

        <Faq>
          <h2>Prop hub FAQ</h2>
          <details open>
            <summary>Is this automated funded-account trading?</summary>
            <p>No. LegendPips is a cashback partner hub. You still buy and trade with the prop firm directly.</p>
          </details>
          <details>
            <summary>When is cashback paid?</summary>
            <p>After purchase verification. Credits show on My Rebates; you can request a withdrawal from there.</p>
          </details>
          <details>
            <summary>Can I compare firms?</summary>
            <p>
              Add firms with Compare, then open the matrix — prop rows include fee, drawdown, payout cycle, and discount codes.
            </p>
          </details>
        </Faq>
      </Page>
    </>
  );
};

export default PropFirmHubPage;

const Hero = styled.section`
  position: relative;
  min-height: clamp(240px, 34vh, 340px);
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
  h1 { margin: 0 0 0.75rem; font-size: ${({ theme }) => theme.typography.heroTitle}; }
  p { margin: 0; line-height: 1.6; color: rgba(255,255,255,0.9); }
`;
const HeroLinks = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
  a {
    color: #fbbf24;
    font-weight: 700;
    font-size: 0.9rem;
  }
`;
const Page = styled.main`
  background: #f4f6fa;
  padding: 1.25rem 0 3rem;
`;
const Steps = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto 1.25rem;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  @media (max-width: 800px) { grid-template-columns: 1fr; }
`;
const Step = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  display: flex;
  gap: 0.7rem;
  b {
    width: 28px; height: 28px; border-radius: 8px;
    background: #fbbf24; color: #132e58;
    display: flex; align-items: center; justify-content: center;
  }
  strong { color: #132e58; display: block; margin-bottom: 0.2rem; }
  p { margin: 0; font-size: 0.82rem; color: #64748b; }
`;
const Toolbar = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto 0.85rem;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  select, button {
    padding: 0.45rem 0.65rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    font: inherit;
    background: #fff;
  }
  button {
    margin-left: auto;
    color: #132e58;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
  }
`;
const Search = styled.label`
  display: flex; align-items: center; gap: 0.4rem;
  background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.35rem 0.7rem;
  input { border: 0; outline: none; font: inherit; min-width: 160px; }
`;
const TableWrap = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto 1.5rem;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  overflow-x: auto;
  table { width: 100%; border-collapse: collapse; background: #fff; min-width: 920px; }
  th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #eef2f7; font-size: 0.85rem; vertical-align: top; }
  th { background: #f8fafc; color: #132e58; }
  small { color: #64748b; display: block; margin-top: 0.15rem; }
`;
const Verified = styled.span`
  display: inline-flex; gap: 0.25rem; align-items: center;
  margin-left: 0.4rem; color: #059669; font-size: 0.7rem; font-weight: 700;
`;
const CodeBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
  border: 1px dashed #cbd5e1;
  background: #f8fafc;
  border-radius: 6px;
  padding: 0.2rem 0.45rem;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  color: #132e58;
  cursor: pointer;
`;
const RowActions = styled.div`
  display: flex; flex-direction: column; gap: 0.35rem; align-items: flex-start;
  a { color: #132e58; font-weight: 700; font-size: 0.8rem; }
`;
const Section = styled.section`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto 1.5rem;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  h2 {
    margin: 0;
    color: #132e58;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 1.1rem;
  }
  > p { margin: 0.35rem 0 0.75rem; color: #64748b; font-size: 0.85rem; }
`;
const CodeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.65rem;
`;
const CodeCard = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.75rem 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  strong { color: #132e58; font-size: 0.9rem; }
  span { color: #64748b; font-size: 0.78rem; }
  button {
    margin-top: 0.35rem;
    align-self: flex-start;
    display: inline-flex;
    gap: 0.3rem;
    align-items: center;
    border: 0;
    background: #132e58;
    color: #fff;
    border-radius: 7px;
    padding: 0.35rem 0.6rem;
    font: inherit;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
  }
`;
const ReviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.65rem;
`;
const ReviewCard = styled.article`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.85rem;
  header {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    strong { color: #132e58; }
    em { font-style: normal; color: #b45309; font-weight: 800; }
  }
  .speed {
    display: inline-block;
    margin-top: 0.35rem;
    font-size: 0.72rem;
    font-weight: 700;
    color: #047857;
    background: #ecfdf5;
    border-radius: 999px;
    padding: 0.15rem 0.5rem;
  }
  p {
    margin: 0.5rem 0;
    font-size: 0.82rem;
    color: #475569;
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  a { color: #132e58; font-weight: 700; font-size: 0.8rem; }
`;
const ComplaintBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  a {
    background: #132e58;
    color: #fff;
    font-weight: 700;
    font-size: 0.82rem;
    padding: 0.5rem 0.85rem;
    border-radius: 8px;
  }
`;
const WarnList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
  li {
    background: #fff7ed;
    border: 1px solid #fed7aa;
    border-radius: 8px;
    padding: 0.65rem 0.8rem;
  }
  strong { display: block; color: #9a3412; }
  span { font-size: 0.8rem; color: #c2410c; }
`;
const Muted = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 0.85rem;
`;
const CardList = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;
const ListHead = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto 0.5rem;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  h2 { margin: 0; color: #132e58; display: flex; gap: 0.4rem; align-items: center; font-size: 1.1rem; }
  p { margin: 0.25rem 0 0; color: #64748b; font-size: 0.85rem; }
`;
const Faq = styled.section`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 1.5rem auto 0;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  h2 { color: #132e58; }
  details { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.75rem 1rem; margin-bottom: 0.5rem; }
  summary { cursor: pointer; font-weight: 700; color: #132e58; }
  p { margin: 0.5rem 0 0; color: #475569; font-size: 0.9rem; }
`;
const Empty = styled.p`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto 1rem;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  color: #b91c1c;
`;
