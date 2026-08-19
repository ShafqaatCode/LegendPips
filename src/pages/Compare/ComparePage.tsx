import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { FaStar } from "react-icons/fa";
import { FiColumns, FiX } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import CompareToggle from "../../components/Broker/CompareToggle";
import { fetchBrokersPage, fetchCompareBrokers, type ApiBroker } from "../../services/brokerService";
import { clearCompareIds, getCompareIds, setCompareIds } from "../../utils/compareBrokers";

function cashbackScore(rate?: string) {
  const n = parseFloat(String(rate || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : -1;
}

function spreadScore(spread?: string) {
  const n = parseFloat(String(spread || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
}

const ComparePage: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const ids = useMemo(
    () => (params.get("ids") || "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4),
    [params]
  );

  const [items, setItems] = useState<ApiBroker[]>([]);
  const [pool, setPool] = useState<ApiBroker[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"forex" | "crypto" | "prop" | "">("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (ids.length) setCompareIds(ids);
  }, [ids]);

  useEffect(() => {
    if (ids.length) return;
    const stored = getCompareIds();
    if (stored.length >= 2) setParams({ ids: stored.join(",") }, { replace: true });
  }, [ids.length, setParams]);

  useEffect(() => {
    if (ids.length < 2) {
      setItems([]);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCompareBrokers(ids)
      .then((rows) => {
        if (!cancelled) setItems(rows);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to compare");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ids]);

  useEffect(() => {
    fetchBrokersPage({
      page: 1,
      limit: 50,
      category: category || undefined,
      search: search || undefined,
    })
      .then((r) => setPool(r.items || []))
      .catch(() => setPool([]));
  }, [search, category]);

  const addId = (id: string) => {
    if (ids.includes(id) || ids.length >= 4) return;
    const next = [...ids, id];
    setCompareIds(next);
    setParams({ ids: next.join(",") });
  };

  const removeId = (id: string) => {
    const next = ids.filter((x) => x !== id);
    setCompareIds(next);
    if (next.length) setParams({ ids: next.join(",") });
    else {
      setParams({});
      setItems([]);
    }
  };

  const bestRating = Math.max(0, ...items.map((b) => b.reviewStats?.average || b.rebatesStarRating || 0));
  const bestMin = Math.min(...items.map((b) => b.minDeposit || Infinity));
  const bestCash = Math.max(-1, ...items.map((b) => cashbackScore(b.cashbackRate)));
  const bestSpread = Math.min(...items.map((b) => spreadScore(b.spreadFrom)));

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <h1>BROKER COMPARISON</h1>
          <p>
            Compare regulation, spreads, cashback, and reviews side by side. Pick 2–4 brokers and share the
            link with other traders.
          </p>
        </HeroInner>
      </Hero>

      <Page>
        <Picker>
          <h2>
            <FiColumns /> Add brokers
          </h2>
          <Filters>
            <input
              placeholder="Search brokers"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
              <option value="">All types</option>
              <option value="forex">Forex</option>
              <option value="crypto">Crypto</option>
              <option value="prop">Prop firms</option>
            </select>
          </Filters>
          <Chips>
            {pool.slice(0, 16).map((b) => (
              <Chip
                key={b._id}
                type="button"
                $on={ids.includes(b._id)}
                disabled={ids.length >= 4 && !ids.includes(b._id)}
                onClick={() => (ids.includes(b._id) ? removeId(b._id) : addId(b._id))}
              >
                {b.name}
              </Chip>
            ))}
          </Chips>
          {ids.length > 0 && (
            <Selected>
              Selected: {ids.length}/4
              {ids.length >= 2 && (
                <Share type="button" onClick={share}>
                  {copied ? "Link copied" : "Copy share link"}
                </Share>
              )}
              <Ghost
                type="button"
                onClick={() => {
                  clearCompareIds();
                  setParams({});
                  setItems([]);
                }}
              >
                Clear
              </Ghost>
            </Selected>
          )}
        </Picker>

        {error && <Err>{error}</Err>}
        {loading && <Empty>Loading comparison…</Empty>}
        {!loading && ids.length < 2 && <Empty>Select at least two brokers to see the comparison matrix.</Empty>}

        {!loading && items.length >= 2 && (
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <th>Feature</th>
                  {items.map((b) => (
                    <th key={b._id}>
                      <Head>
                        {b.logoUrl ? <img src={b.logoUrl} alt="" /> : null}
                        <strong>{b.name}</strong>
                        <Remove type="button" onClick={() => removeId(b._id)} aria-label={`Remove ${b.name}`}>
                          <FiX />
                        </Remove>
                      </Head>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <Row
                  label="Rating"
                  values={items.map((b) => {
                    const avg = b.reviewStats?.average || b.rebatesStarRating || 0;
                    const count = b.reviewStats?.count || 0;
                    return {
                      text: (
                        <span>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <FaStar key={n} color={n <= Math.round(avg) ? "#FBAF00" : "#d1d5db"} />
                          ))}{" "}
                          {avg ? avg.toFixed(1) : "—"} {count ? `(${count})` : ""}
                        </span>
                      ),
                      win: avg === bestRating && avg > 0,
                    };
                  })}
                />
                <Row
                  label="Min deposit"
                  values={items.map((b) => ({
                    text: b.minDeposit ? `$${b.minDeposit}` : "—",
                    win: b.minDeposit === bestMin && bestMin !== Infinity,
                  }))}
                />
                <Row
                  label="Spread from"
                  values={items.map((b) => ({
                    text: b.spreadFrom || "—",
                    win: spreadScore(b.spreadFrom) === bestSpread && bestSpread !== Infinity,
                  }))}
                />
                <Row
                  label="Cashback"
                  values={items.map((b) => ({
                    text: b.cashbackRate || "—",
                    win: cashbackScore(b.cashbackRate) === bestCash && bestCash > 0,
                  }))}
                />
                <Row label="Regulation" values={items.map((b) => ({ text: b.regulation || "—" }))} />
                <Row label="Crypto" values={items.map((b) => ({ text: b.crypto || "—" }))} />
                <Row label="Type" values={items.map((b) => ({ text: b.rebateCategory || "forex" }))} />
                <Row label="Verified" values={items.map((b) => ({ text: b.verified === false ? "No" : "Yes" }))} />
                <Row
                  label="Warning list"
                  values={items.map((b) => ({
                    text: b.blacklisted ? "Yes" : "No",
                    warn: !!b.blacklisted,
                  }))}
                />
                <Row
                  label="Funding"
                  values={items.map((b) => ({
                    text: (b.fundingMethods || []).slice(0, 4).join(", ") || "—",
                  }))}
                />
                <Row
                  label="Highlights"
                  values={items.map((b) => ({
                    text: (b.features || []).slice(0, 3).join(" · ") || "—",
                  }))}
                />
                <tr>
                  <th>Actions</th>
                  {items.map((b) => (
                    <td key={b._id}>
                      <Links>
                        <Link to={`/rebates/broker/${b._id}`}>Details</Link>
                        <Link to={`/rebates/broker/${b._id}#reviews`}>Reviews</Link>
                        <Link to={`/complaints?broker=${b._id}`}>Complaint</Link>
                        <CompareToggle brokerId={b._id} />
                      </Links>
                    </td>
                  ))}
                </tr>
              </tbody>
            </Table>
          </TableWrap>
        )}
      </Page>
    </>
  );
};

const Row: React.FC<{
  label: string;
  values: { text: React.ReactNode; win?: boolean; warn?: boolean }[];
}> = ({ label, values }) => (
  <tr>
    <th>{label}</th>
    {values.map((v, i) => (
      <td key={i} className={v.warn ? "warn" : v.win ? "win" : ""}>
        {v.text}
      </td>
    ))}
  </tr>
);

export default ComparePage;

const Hero = styled.section`
  position: relative;
  min-height: clamp(260px, 36vh, 360px);
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
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  color: #fff;
  h1 {
    margin: 0 0 0.75rem;
    font-size: ${({ theme }) => theme.typography.heroTitle};
  }
  p {
    margin: 0;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
  }
`;
const Page = styled.main`
  background: #f4f6fa;
  padding: 1.25rem 0 5rem;
`;
const Picker = styled.section`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto 1rem;
  padding: 1rem ${({ theme }) => theme.typography.pageGutter};
  h2 {
    margin: 0 0 0.65rem;
    color: #132e58;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
`;
const Filters = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.65rem;
  input,
  select {
    padding: 0.5rem 0.7rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font: inherit;
  }
  input {
    flex: 1;
    min-width: 160px;
  }
`;
const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;
const Chip = styled.button<{ $on?: boolean }>`
  border: 1px solid ${({ $on }) => ($on ? "#132e58" : "#e2e8f0")};
  background: ${({ $on }) => ($on ? "#132e58" : "#fff")};
  color: ${({ $on }) => ($on ? "#fff" : "#132e58")};
  border-radius: 99px;
  padding: 0.3rem 0.7rem;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  &:disabled {
    opacity: 0.4;
  }
`;
const Selected = styled.div`
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: #475569;
  display: flex;
  gap: 0.6rem;
  align-items: center;
  flex-wrap: wrap;
`;
const Share = styled.button`
  background: #fbbf24;
  border: 0;
  border-radius: 8px;
  padding: 0.35rem 0.7rem;
  font-weight: 800;
  cursor: pointer;
`;
const Ghost = styled.button`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.35rem 0.7rem;
  cursor: pointer;
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
const TableWrap = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  overflow-x: auto;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
  th,
  td {
    border-bottom: 1px solid #eef2f7;
    padding: 0.85rem 0.75rem;
    text-align: left;
    vertical-align: top;
    font-size: 0.85rem;
  }
  th:first-child,
  td:first-child {
    position: sticky;
    left: 0;
    background: #f8fafc;
    font-weight: 800;
    color: #132e58;
    width: 140px;
  }
  td.win {
    background: #ecfdf5;
    font-weight: 700;
  }
  td.warn {
    background: #fff7ed;
    color: #9a3412;
  }
`;
const Head = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  img {
    width: 28px;
    height: 28px;
    object-fit: contain;
  }
`;
const Remove = styled.button`
  margin-left: auto;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: #94a3b8;
`;
const Links = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  align-items: flex-start;
  a {
    color: #132e58;
    font-weight: 700;
    font-size: 0.8rem;
  }
`;
