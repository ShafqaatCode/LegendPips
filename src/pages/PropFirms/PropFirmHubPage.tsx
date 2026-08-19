import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiAward, FiCheckCircle, FiSearch } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import CompareToggle from "../../components/Broker/CompareToggle";
import PropFirmCard from "../../components/Broker/PropFirmCard";
import { fetchBrokersPage, type ApiBroker } from "../../services/brokerService";
import { formatPropCardSummary } from "../../utils/propTradingDisplay";
import { mapApiBrokerToRebateCardRow } from "../../utils/rebatesBrokersDisplay";

function cashbackNum(v?: string) {
  const n = parseFloat(String(v || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : -1;
}

const PropFirmHubPage: React.FC = () => {
  const [items, setItems] = useState<ApiBroker[]>([]);
  const [search, setSearch] = useState("");
  const [evalFilter, setEvalFilter] = useState("");
  const [sort, setSort] = useState<"cashback" | "name">("cashback");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBrokersPage({ rebatesPage: true, category: "prop", page: 1, limit: 50 })
      .then((r) => setItems(r.items || []))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = items.filter((b) => {
      if (q && !`${b.name} ${b.description} ${(b.propOffers || []).map((o) => o.label).join(" ")}`.toLowerCase().includes(q)) {
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

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <h1>PROP FIRM HUB</h1>
          <p>
            Compare evaluation cashback, discounts, and profit splits. Buy through LegendPips partner links
            and get credited after purchase verification.
          </p>
        </HeroInner>
      </Hero>

      <Page>
        <Steps>
          {[
            { n: "1", t: "Pick a firm", d: "Compare programs, first-purchase cashback, and discounts." },
            { n: "2", t: "Buy via partner link", d: "Open the firm from LegendPips so we can match your purchase." },
            { n: "3", t: "Get cashback", d: "Credits appear on My Rebates after the team verifies the challenge." },
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
          <Link to="/compare">Compare side by side →</Link>
        </Toolbar>

        {error && <Empty>{error}</Empty>}

        <TableWrap>
          <table>
            <thead>
              <tr>
                <th>Firm</th>
                <th>Best first cashback</th>
                <th>Repeat</th>
                <th>Discount</th>
                <th>Programs</th>
                <th>Eval / split</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const offers = b.propOffers || [];
                const best = offers.reduce((m, o) => Math.max(m, cashbackNum(o.firstPurchaseCashback)), -1);
                const bestOffer = offers.find((o) => cashbackNum(o.firstPurchaseCashback) === best);
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
                    <td>{bestOffer?.firstPurchaseCashback || "—"}</td>
                    <td>{bestOffer?.repeatPurchaseCashback || "—"}</td>
                    <td>{bestOffer?.discountPercent || "—"}</td>
                    <td>{offers.map((o) => o.label).join(", ") || formatPropCardSummary(offers)}</td>
                    <td>
                      {offers
                        .map((o) => [o.evaluationType, o.profitSplit, o.accountSize].filter(Boolean).join(" · "))
                        .filter(Boolean)
                        .join("; ") || "—"}
                    </td>
                    <td>
                      <RowActions>
                        <Link to={`/rebates/broker/${b._id}`}>Details</Link>
                        <CompareToggle brokerId={b._id} />
                      </RowActions>
                    </td>
                  </tr>
                );
              })}
              {!error && filtered.length === 0 && (
                <tr>
                  <td colSpan={7}>No prop firms match these filters yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </TableWrap>

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
              Use Add to compare on any card, or open the <Link to="/compare">broker comparison</Link> page and filter
              Prop firms.
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
  select { padding: 0.45rem 0.65rem; border-radius: 8px; border: 1px solid #e2e8f0; font: inherit; }
  a { margin-left: auto; color: #132e58; font-weight: 700; font-size: 0.85rem; }
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
  table { width: 100%; border-collapse: collapse; background: #fff; min-width: 720px; }
  th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #eef2f7; font-size: 0.85rem; }
  th { background: #f8fafc; color: #132e58; }
`;
const Verified = styled.span`
  display: inline-flex; gap: 0.25rem; align-items: center;
  margin-left: 0.4rem; color: #059669; font-size: 0.7rem; font-weight: 700;
`;
const RowActions = styled.div`
  display: flex; flex-direction: column; gap: 0.35rem; align-items: flex-start;
  a { color: #132e58; font-weight: 700; }
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
