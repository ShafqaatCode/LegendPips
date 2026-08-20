import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiCheckCircle, FiSearch, FiShield } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import { fetchPublicTraders, type TraderProfile } from "../../services/traderService";
import { useLocale } from "../../contexts/LocaleContext";

type Props = { copyOnly?: boolean };

const TradersPage: React.FC<Props> = ({ copyOnly }) => {
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [items, setItems] = useState<TraderProfile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLocale();

  useEffect(() => {
    setLoading(true);
    fetchPublicTraders({ search: q, copyOnly, page: 1, limit: 24 })
      .then((r) => {
        setItems(r.items || []);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [q, copyOnly]);

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <h1>{copyOnly ? t("traders.copyTitle") : t("traders.title")}</h1>
          <p>
            {copyOnly ? t("traders.copyBody") : t("traders.body")}
          </p>
        </HeroInner>
      </Hero>
      <Page>
        <Toolbar>
          <Search>
            <FiSearch />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setQ(search.trim())}
              placeholder="Search name or strategy"
            />
            <button type="button" onClick={() => setQ(search.trim())}>Search</button>
          </Search>
          {!copyOnly && <Link to="/copy-trading">Copy trading marketplace →</Link>}
          {copyOnly && <Link to="/traders">All verified profiles →</Link>}
        </Toolbar>
        {error && <Err>{error}</Err>}
        {loading && <Empty>Loading traders…</Empty>}
        {!loading && items.length === 0 && (
          <Empty>No verified traders yet. Create a profile from your member panel after KYC.</Empty>
        )}
        <Grid>
          {items.map((t) => (
            <Card key={t.id} to={`/traders/${t.id}`}>
              <Top>
                <Avatar $img={t.user?.profileImage}>
                  {!t.user?.profileImage && (t.displayName.slice(0, 2).toUpperCase())}
                </Avatar>
                <div>
                  <strong>{t.displayName}</strong>
                  <Badge>
                    <FiCheckCircle /> Verified
                    {t.user?.kycStatus === "approved" ? " · KYC" : ""}
                  </Badge>
                </div>
              </Top>
              <p>{t.bio || t.strategy || "No bio yet."}</p>
              <Stats>
                <span><b>{t.roiPercent != null ? `${t.roiPercent}%` : "—"}</b> ROI</span>
                <span><b>{t.winRatePercent != null ? `${t.winRatePercent}%` : "—"}</b> Win</span>
                <span><b>{t.maxDrawdownPercent != null ? `${t.maxDrawdownPercent}%` : "—"}</b> DD</span>
              </Stats>
              <Meta>
                {(t.markets || []).join(" · ") || "Markets n/a"}
                {t.copyEnabled ? " · Copy open" : ""}
                {t.followerCount ? ` · ${t.followerCount} copiers` : ""}
              </Meta>
            </Card>
          ))}
        </Grid>
        <Hint>
          <FiShield /> Past performance is not a guarantee of future results. Always use your own risk controls.
        </Hint>
      </Page>
    </>
  );
};

export const CopyTradingPage: React.FC = () => <TradersPage copyOnly />;

export default TradersPage;

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
const Toolbar = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto 1rem;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  a { color: #132e58; font-weight: 700; font-size: 0.85rem; }
`;
const Search = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.35rem 0.5rem 0.35rem 0.7rem;
  input { border: 0; outline: none; font: inherit; min-width: 180px; }
  button {
    background: #132e58; color: #fff; border: 0; border-radius: 8px;
    padding: 0.35rem 0.7rem; font-weight: 700; cursor: pointer;
  }
`;
const Grid = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 0.85rem;
`;
const Card = styled(Link)`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  p { margin: 0; font-size: 0.82rem; color: #475569; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  &:hover { border-color: #fbbf24; }
`;
const Top = styled.div`
  display: flex;
  gap: 0.65rem;
  align-items: center;
  strong { display: block; color: #132e58; }
`;
const Avatar = styled.div<{ $img?: string }>`
  width: 44px; height: 44px; border-radius: 12px;
  background: ${({ $img }) => ($img ? `url(${$img}) center/cover` : "linear-gradient(145deg,#fbbf24,#f59e0b)")};
  color: #132e58; font-weight: 800; display: flex; align-items: center; justify-content: center;
`;
const Badge = styled.span`
  display: inline-flex; align-items: center; gap: 0.25rem;
  font-size: 0.7rem; color: #059669; font-weight: 700;
`;
const Stats = styled.div`
  display: flex; gap: 0.75rem; font-size: 0.75rem; color: #64748b;
  b { color: #132e58; display: block; font-size: 0.95rem; }
  span { display: flex; flex-direction: column; }
`;
const Meta = styled.div` font-size: 0.72rem; color: #94a3b8; text-transform: capitalize; `;
const Empty = styled.p`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 1rem auto; padding: 0 ${({ theme }) => theme.typography.pageGutter}; color: #64748b;
`;
const Err = styled(Empty)` color: #b91c1c; `;
const Hint = styled.p`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 1.25rem auto 0;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  color: #64748b; font-size: 0.8rem;
  display: flex; gap: 0.4rem; align-items: center;
`;
