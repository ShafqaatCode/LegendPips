import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import { fetchPerformingStocks, type PerformingStock } from "../../services/marketService";

const Hero = styled.section`
  position: relative;
  overflow: hidden;
  padding: clamp(2.25rem, 5vw, 3.25rem) ${({ theme }) => theme.typography.pageGutter}
    clamp(1.75rem, 4vw, 2.5rem);
  background: linear-gradient(135deg, #0b1b38 0%, #132e58 100%);
  color: white;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.14;
  background-image: url(${bannerBg});
  background-size: cover;
  filter: blur(2px);
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(11, 27, 56, 0.85), rgba(19, 46, 88, 0.8));
  }
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
`;

const Title = styled.h1`
  margin: 0.35rem 0 0.65rem;
  font-size: ${({ theme }) => theme.typography.heroTitle};
  line-height: ${({ theme }) => theme.typography.heroTitleLh};
  font-weight: 800;
  span { color: ${({ theme }) => theme.colors.gold}; }
`;

const Lead = styled.p`
  margin: 0;
  max-width: 40rem;
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.9);
`;

const Page = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 1.5rem ${({ theme }) => theme.typography.pageGutter} 3rem;
`;

const Search = styled.input`
  width: 100%;
  max-width: 360px;
  margin-bottom: 1.25rem;
  padding: 0.65rem 0.9rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-family: inherit;
`;

const Table = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(19, 46, 88, 0.05);
`;

const Head = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.4fr;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.muted};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.4fr;
  gap: 0.75rem;
  padding: 0.95rem 1rem;
  border-top: 1px solid #f1f5f9;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr 1fr;
    gap: 0.45rem;
  }
`;

const Sym = styled.div`
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  .name {
    display: block;
    font-size: 0.75rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const NewBadge = styled.span`
  margin-left: 0.4rem;
  display: inline-flex;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  background: #fbbf24;
  color: #111;
  font-size: 0.6rem;
  font-weight: 800;
`;

const Change = styled.div<{ $up: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 800;
  color: ${({ $up }) => ($up ? "#15803d" : "#b91c1c")};
`;

const Note = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.4;
`;

const Empty = styled.div`
  padding: 1.5rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
  border: 1px dashed #e5e7eb;
  border-radius: 14px;
`;

const BestPerformingStocksPage: React.FC = () => {
  const [items, setItems] = useState<PerformingStock[]>([]);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setQ(search.trim()), 250);
    return () => window.clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPerformingStocks(q)
      .then((list) => {
        if (!cancelled) setItems(list);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [q]);

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.9 }}>
            Market watch
          </div>
          <Title>
            Best Performing <span>Stocks</span>
          </Title>
          <Lead>
            Curated movers tracked by the LegendPips team. Figures are editorial snapshots — not live exchange data or
            investment advice.
          </Lead>
        </HeroInner>
      </Hero>
      <Page>
        <Search
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search symbol, name, or sector…"
        />
        {loading ? (
          <Empty>Loading stocks…</Empty>
        ) : items.length === 0 ? (
          <Empty>No performing stocks published yet. Admins can add them under Performing Stocks.</Empty>
        ) : (
          <Table>
            <Head>
              <div>Symbol</div>
              <div>Price</div>
              <div>Change</div>
              <div>Note</div>
            </Head>
            {items.map((s) => {
              const up = Number(s.changePercent) >= 0;
              return (
                <Row key={s._id}>
                  <Sym>
                    {s.symbol}
                    {s.showNewBadge !== false && <NewBadge>NEW</NewBadge>}
                    <span className="name">
                      {s.name}
                      {s.exchange ? ` · ${s.exchange}` : ""}
                      {s.sector ? ` · ${s.sector}` : ""}
                    </span>
                  </Sym>
                  <div style={{ fontWeight: 700, color: "#132e58" }}>
                    {s.currency || "USD"} {Number(s.price).toFixed(2)}
                  </div>
                  <Change $up={up}>
                    {up ? <FiTrendingUp /> : <FiTrendingDown />}
                    {up ? "+" : ""}
                    {Number(s.changePercent).toFixed(2)}%
                  </Change>
                  <Note>{s.note || "—"}</Note>
                </Row>
              );
            })}
          </Table>
        )}
      </Page>
    </>
  );
};

export default BestPerformingStocksPage;
