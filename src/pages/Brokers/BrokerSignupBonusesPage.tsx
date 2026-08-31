import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiExternalLink, FiGift } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import { fetchSignupBonuses, type SignupBonus } from "../../services/marketService";

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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.1rem;
  box-shadow: 0 10px 24px rgba(19, 46, 88, 0.05);
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
`;

const NewBadge = styled.span`
  display: inline-flex;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  background: #fbbf24;
  color: #111;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.04em;
`;

const BonusValue = styled.div`
  margin: 0.65rem 0 0.35rem;
  font-size: 1.25rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const Meta = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 0.45rem;
`;

const Desc = styled.p`
  margin: 0 0 0.85rem;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.muted};
`;

const Cta = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.95rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 700;
`;

const CtaLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.95rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 700;
`;

const Empty = styled.div`
  padding: 1.5rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
  border: 1px dashed #e5e7eb;
  border-radius: 14px;
`;

const BrokerSignupBonusesPage: React.FC = () => {
  const [items, setItems] = useState<SignupBonus[]>([]);
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
    fetchSignupBonuses(q)
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
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, opacity: 0.9, fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            <FiGift /> Promotions
          </div>
          <Title>
            Broker Signup <span>Bonuses</span>
          </Title>
          <Lead>
            Compare welcome and deposit bonuses from partner brokers. Always read terms before claiming — offers can
            change or expire.
          </Lead>
        </HeroInner>
      </Hero>
      <Page>
        <Search
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bonuses or brokers…"
        />
        {loading ? (
          <Empty>Loading bonuses…</Empty>
        ) : items.length === 0 ? (
          <Empty>
            No signup bonuses published yet. Admins can add them under Signup Bonuses.
            <div style={{ marginTop: 10 }}>
              <Link to="/brokers">Browse brokers →</Link>
            </div>
          </Empty>
        ) : (
          <Grid>
            {items.map((b) => (
              <Card key={b._id}>
                <Row>
                  <div>
                    <strong style={{ color: "#132e58" }}>{b.brokerName}</strong>
                    <Meta>{b.title}</Meta>
                  </div>
                  {b.showNewBadge !== false && <NewBadge>NEW</NewBadge>}
                </Row>
                <BonusValue>{b.bonusLabel}</BonusValue>
                <Meta style={{ textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700 }}>
                  {b.bonusType.replace("_", " ")}
                  {b.featured ? " · Featured" : ""}
                </Meta>
                <Desc>{b.description || b.terms || "Claim through the partner link and follow broker terms."}</Desc>
                {b.ctaUrl ? (
                  <Cta href={b.ctaUrl} target="_blank" rel="noopener noreferrer">
                    Claim offer <FiExternalLink />
                  </Cta>
                ) : b.brokerId ? (
                  <CtaLink to={`/rebates/broker/${b.brokerId}`}>View broker</CtaLink>
                ) : null}
              </Card>
            ))}
          </Grid>
        )}
      </Page>
    </>
  );
};

export default BrokerSignupBonusesPage;
