import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { FaStar } from "react-icons/fa";
import { FiColumns, FiX } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import CompareToggle from "../../components/Broker/CompareToggle";
import { fetchBrokersPage, fetchCompareBrokers, fetchCompareBrokersBySlugs, type ApiBroker } from "../../services/brokerService";
import {
  clearCompareIds,
  getCompareIds,
  setCompareIds,
  subscribeCompare,
} from "../../utils/compareBrokers";
import { comparePairPath, parseComparePairSlug } from "../../utils/brokerSlug";
import { useLocale } from "../../contexts/LocaleContext";

function cashbackScore(rate?: string) {
  const n = parseFloat(String(rate || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : -1;
}

function spreadScore(spread?: string) {
  const n = parseFloat(String(spread || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
}

const ComparePage: React.FC = () => {
  const navigate = useNavigate();
  const { pairSlug } = useParams();
  const [params, setParams] = useSearchParams();
  const idsFromUrl = useMemo(
    () => (params.get("ids") || "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4),
    [params]
  );

  const [items, setItems] = useState<ApiBroker[]>([]);
  const [pool, setPool] = useState<ApiBroker[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"forex" | "crypto" | "prop" | "binary" | "ewallet" | "">(
    () => (params.get("category") as "forex" | "crypto" | "prop" | "binary" | "ewallet" | "") || ""
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t } = useLocale();

  /** Prefer URL ids; fall back to loaded rows so chips/remove stay correct after SEO slug URLs. */
  const selectedIds = useMemo(() => {
    if (idsFromUrl.length) return idsFromUrl;
    return items.map((b) => b._id).filter(Boolean).slice(0, 4);
  }, [idsFromUrl, items]);

  const propMode = useMemo(
    () =>
      category === "prop" ||
      (items.length >= 2 && items.every((b) => b.rebateCategory === "prop")),
    [category, items]
  );

  const writeUrlIds = (next: string[]) => {
    const qs: Record<string, string> = {};
    if (next.length) qs.ids = next.join(",");
    if (category) qs.category = category;
    setParams(qs, { replace: true });
  };

  // Keep localStorage aligned with URL selection
  useEffect(() => {
    if (idsFromUrl.length) setCompareIds(idsFromUrl);
  }, [idsFromUrl]);

  // Restore from localStorage when landing on bare /compare
  useEffect(() => {
    if (pairSlug) return;
    if (idsFromUrl.length) return;
    const stored = getCompareIds();
    if (stored.length >= 2) {
      const qs: Record<string, string> = { ids: stored.join(",") };
      if (category) qs.category = category;
      setParams(qs, { replace: true });
    }
  }, [idsFromUrl.length, pairSlug, setParams, category]);

  // Keep URL in sync when CompareToggle changes localStorage on this page
  useEffect(() => {
    return subscribeCompare((stored) => {
      const current = (params.get("ids") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (stored.join(",") === current.join(",")) return;
      const qs: Record<string, string> = {};
      if (stored.length) qs.ids = stored.join(",");
      if (category) qs.category = category;
      setParams(qs, { replace: true });
      if (!stored.length) setItems([]);
    });
  }, [params, category, setParams]);

  // Load by SEO slug when there are no ids in the URL yet
  useEffect(() => {
    if (!pairSlug) return;
    if (idsFromUrl.length >= 2) return;
    const slugs = parseComparePairSlug(pairSlug);
    if (slugs.length < 2) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCompareBrokersBySlugs(slugs)
      .then((rows) => {
        if (cancelled) return;
        setItems(rows);
        if (rows.length >= 2) {
          const nextIds = rows.map((b) => b._id);
          setCompareIds(nextIds);
          const qs: Record<string, string> = { ids: nextIds.join(",") };
          if (category) qs.category = category;
          setParams(qs, { replace: true });
        } else if (rows.length < 2) {
          setError("Could not load enough brokers for this comparison link.");
        }
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
  }, [pairSlug, idsFromUrl.length, category, setParams]);

  // Primary load path: compare by broker ids
  useEffect(() => {
    if (idsFromUrl.length < 2) {
      if (!pairSlug) {
        setItems([]);
        setError(null);
      }
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCompareBrokers(idsFromUrl)
      .then((rows) => {
        if (cancelled) return;
        setItems(rows);
        if (rows.length < idsFromUrl.length) {
          setError(
            "Some selected brokers are unavailable or unpublished. Showing the ones we could load."
          );
        }
        if (rows.length >= 2) {
          // Pretty share URL, but keep ?ids= so selection/remove stays correct
          const path = comparePairPath(rows);
          const qs = new URLSearchParams();
          qs.set("ids", rows.map((b) => b._id).join(","));
          if (category) qs.set("category", category);
          const next = `${path}?${qs.toString()}`;
          const cur = `${window.location.pathname}${window.location.search}`;
          if (cur !== next) navigate(next, { replace: true });
        }
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
  }, [idsFromUrl, category, navigate]);

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
    if (selectedIds.includes(id) || selectedIds.length >= 4) return;
    const next = [...selectedIds, id];
    setCompareIds(next);
    writeUrlIds(next);
  };

  const removeId = (id: string) => {
    const next = selectedIds.filter((x) => x !== id);
    setCompareIds(next);
    if (next.length) {
      writeUrlIds(next);
      // Drop SEO slug path when editing selection so id-based load owns the page
      if (pairSlug) navigate(`/compare?ids=${next.join(",")}${category ? `&category=${category}` : ""}`, { replace: true });
    } else {
      clearCompareIds();
      setItems([]);
      if (pairSlug) navigate("/compare", { replace: true });
      else writeUrlIds([]);
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
          <h1>{t("compare.title")}</h1>
          <p>
            {t("compare.body")}{" "}
            <Link to="/spread-comparison" style={{ color: "#fbbf24", fontWeight: 700 }}>
              Spread comparison →
            </Link>
          </p>
        </HeroInner>
      </Hero>

      <Page>
        <Picker>
          <h2>
            <FiColumns /> {t("compare.add")}
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
              <option value="binary">Binary brokers</option>
              <option value="ewallet">E-wallet</option>
            </select>
          </Filters>
          <Chips>
            {pool.slice(0, 16).map((b) => (
              <Chip
                key={b._id}
                type="button"
                $on={selectedIds.includes(b._id)}
                disabled={selectedIds.length >= 4 && !selectedIds.includes(b._id)}
                onClick={() => (selectedIds.includes(b._id) ? removeId(b._id) : addId(b._id))}
              >
                {b.name}
              </Chip>
            ))}
          </Chips>
          {selectedIds.length > 0 && (
            <Selected>
              Selected: {selectedIds.length}/4
              {selectedIds.length >= 2 && (
                <Share type="button" onClick={share}>
                  {copied ? "Link copied" : "Copy share link"}
                </Share>
              )}
              <Ghost
                type="button"
                onClick={() => {
                  clearCompareIds();
                  setItems([]);
                  if (pairSlug) navigate("/compare", { replace: true });
                  else writeUrlIds([]);
                }}
              >
                Clear
              </Ghost>
            </Selected>
          )}
        </Picker>

        {error && <Err>{error}</Err>}
        {loading && <Empty>Loading comparison…</Empty>}
        {!loading && selectedIds.length < 2 && items.length < 2 && (
          <Empty>Select at least two brokers to see the comparison matrix.</Empty>
        )}
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
                  label="LegendScore"
                  values={items.map((b) => ({
                    text: b.legendScore ? `${b.legendScore.toFixed(1)}/10` : "—",
                    win: b.legendScore === Math.max(0, ...items.map((x) => x.legendScore || 0)) && !!b.legendScore,
                  }))}
                />
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
                {propMode ? (
                  <>
                    <Row
                      label="Best first cashback"
                      values={items.map((b) => {
                        const o = (b.propOffers || [])[0];
                        const best = (b.propOffers || []).reduce(
                          (m, x) => Math.max(m, cashbackScore(x.firstPurchaseCashback)),
                          -1
                        );
                        const top = (b.propOffers || []).find(
                          (x) => cashbackScore(x.firstPurchaseCashback) === best
                        ) || o;
                        return {
                          text: top?.firstPurchaseCashback || "—",
                          win: cashbackScore(top?.firstPurchaseCashback) === Math.max(...items.map((x) => {
                            const bb = (x.propOffers || []).reduce(
                              (m, p) => Math.max(m, cashbackScore(p.firstPurchaseCashback)),
                              -1
                            );
                            return bb;
                          })) && cashbackScore(top?.firstPurchaseCashback) > 0,
                        };
                      })}
                    />
                    <Row
                      label="Discount %"
                      values={items.map((b) => ({
                        text: (b.propOffers || [])[0]?.discountPercent || "—",
                      }))}
                    />
                    <Row
                      label="Discount code"
                      values={items.map((b) => ({
                        text:
                          (b.propOffers || []).find((o) => o.discountCode)?.discountCode ||
                          (b.propPromoCodes || []).find((p) => p.active !== false)?.code ||
                          "—",
                      }))}
                    />
                    <Row
                      label="Challenge fee"
                      values={items.map((b) => ({
                        text: (b.propOffers || [])[0]?.challengeFee || "—",
                      }))}
                    />
                    <Row
                      label="Profit target"
                      values={items.map((b) => ({
                        text: (b.propOffers || [])[0]?.profitTarget || "—",
                      }))}
                    />
                    <Row
                      label="Daily / max drawdown"
                      values={items.map((b) => {
                        const o = (b.propOffers || [])[0];
                        return {
                          text: [o?.dailyDrawdown, o?.maxDrawdown].filter(Boolean).join(" / ") || "—",
                        };
                      })}
                    />
                    <Row
                      label="Min trading days"
                      values={items.map((b) => ({
                        text: (b.propOffers || [])[0]?.minTradingDays || "—",
                      }))}
                    />
                    <Row
                      label="Payout cycle"
                      values={items.map((b) => ({
                        text: (b.propOffers || [])[0]?.payoutCycle || "—",
                      }))}
                    />
                    <Row
                      label="Scaling"
                      values={items.map((b) => ({
                        text: (b.propOffers || [])[0]?.scalingPlan || "—",
                      }))}
                    />
                    <Row
                      label="Eval / split / size"
                      values={items.map((b) => {
                        const o = (b.propOffers || [])[0];
                        return {
                          text: [o?.evaluationType, o?.profitSplit, o?.accountSize].filter(Boolean).join(" · ") || "—",
                        };
                      })}
                    />
                  </>
                ) : (
                  <>
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
                    <Row label="Country" values={items.map((b) => ({ text: b.country || "—" }))} />
                    <Row label="Leverage" values={items.map((b) => ({ text: b.leverage || "—" }))} />
                    <Row label="Platforms" values={items.map((b) => ({ text: b.platforms || "—" }))} />
                    <Row label="Commission" values={items.map((b) => ({ text: b.commission || "—" }))} />
                    <Row label="Regulation" values={items.map((b) => ({ text: b.regulation || "—" }))} />
                    <Row label="Crypto" values={items.map((b) => ({ text: b.crypto || "—" }))} />
                  </>
                )}
                <Row label="Type" values={items.map((b) => ({ text: b.rebateCategory || "forex" }))} />
                <Row label="Verified" values={items.map((b) => ({ text: b.verified === false ? "No" : "Yes" }))} />
                <Row
                  label="Warning list"
                  values={items.map((b) => ({
                    text: b.blacklisted ? "Yes" : "No",
                    warn: !!b.blacklisted,
                  }))}
                />
                {!propMode && (
                  <>
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
                  </>
                )}
                <tr>
                  <th>Actions</th>
                  {items.map((b) => (
                    <td key={b._id}>
                      <Links>
                        <Link to={`/rebates/broker/${b._id}`}>Details</Link>
                        <Link to={`/rebates/broker/${b._id}/reviews`}>Reviews</Link>
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
