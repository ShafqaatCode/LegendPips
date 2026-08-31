import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiArrowRight, FiCheckCircle, FiShield } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import { fetchBeginnerBrokers, type ApiBroker } from "../../services/brokerService";
import TopBeginnerBrokersWidget from "../../components/Broker/TopBeginnerBrokersWidget";

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
  background-position: center;
  filter: blur(2px);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(11, 27, 56, 0.85) 0%, rgba(19, 46, 88, 0.8) 100%);
  }
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
`;

const Kicker = styled.span`
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
`;

const Title = styled.h1`
  margin: 0.4rem 0 0.65rem;
  font-size: ${({ theme }) => theme.typography.heroTitle};
  line-height: ${({ theme }) => theme.typography.heroTitleLh};
  font-weight: 800;

  span {
    color: ${({ theme }) => theme.colors.gold};
  }
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

const WidgetRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
`;

const Search = styled.input`
  flex: 1;
  min-width: 200px;
  max-width: 360px;
  padding: 0.65rem 0.9rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-family: inherit;
  font-size: 0.875rem;
`;

const LinkBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  font-size: 0.8125rem;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.gold};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
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
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Logo = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #eef2f7;
`;

const LogoFallback = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.gold};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.85rem;
`;

const Name = styled.h2`
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(251, 191, 36, 0.2);
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.65rem;
  font-weight: 800;
`;

const Meta = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.45rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.muted};

  strong {
    display: block;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 0.8125rem;
  }
`;

const Blurb = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.muted};
  flex: 1;
`;

const CardCta = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 700;

  &:hover {
    opacity: 0.92;
  }
`;

const Empty = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
  border: 1px dashed #e5e7eb;
  border-radius: 14px;
`;

const Tips = styled.section`
  margin-top: 2rem;
  padding: 1.25rem;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
`;

const TipsTitle = styled.h3`
  margin: 0 0 0.75rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const TipList = styled.ul`
  margin: 0;
  padding-left: 1.1rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.8125rem;
  line-height: 1.65;
`;

const BeginnerBrokersPage: React.FC = () => {
  const [items, setItems] = useState<ApiBroker[]>([]);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setQ(search.trim()), 250);
    return () => window.clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchBeginnerBrokers({ search: q, page: 1, limit: 48 })
      .then((r) => {
        if (!cancelled) {
          setItems(r.items || []);
          setError(null);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setItems([]);
          setError(e.message || "Failed to load brokers");
        }
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
          <Kicker>Broker guide</Kicker>
          <Title>
            Best brokers for <span>new traders</span>
          </Title>
          <Lead>
            Curated by LegendPips for people just starting out — lower barriers to entry, clearer regulation
            signals, and platforms that are easier to learn on. Always verify terms yourself before depositing.
          </Lead>
        </HeroInner>
      </Hero>

      <Page>
        <WidgetRow>
          <TopBeginnerBrokersWidget variant="page" limit={6} />
        </WidgetRow>

        <Toolbar>
          <Search
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brokers for new traders…"
            aria-label="Search brokers for new traders"
          />
          <LinkBtn to="/scam-broker-shield">
            <FiShield /> Check Scam Broker Shield
          </LinkBtn>
        </Toolbar>

        {error && <Empty>{error}</Empty>}
        {loading ? (
          <Empty>Loading curated list…</Empty>
        ) : items.length === 0 ? (
          <Empty>
            No curated brokers published yet. Admins can mark brokers as “Best for new traders” in the admin panel.
          </Empty>
        ) : (
          <Grid>
            {items.map((b) => (
              <Card key={b._id}>
                <CardTop>
                  {b.logoUrl ? (
                    <Logo src={b.logoUrl} alt="" />
                  ) : (
                    <LogoFallback>{b.name.slice(0, 2).toUpperCase()}</LogoFallback>
                  )}
                  <div>
                    <Name>{b.name}</Name>
                    <Pill>
                      <FiCheckCircle size={12} /> New trader pick
                    </Pill>
                  </div>
                </CardTop>
                <Meta>
                  <div>
                    Min deposit
                    <strong>${b.minDeposit}</strong>
                  </div>
                  <div>
                    Regulation
                    <strong>{b.regulation || "—"}</strong>
                  </div>
                  <div>
                    Spread from
                    <strong>{b.spreadFrom || "—"}</strong>
                  </div>
                  <div>
                    Platforms
                    <strong>{b.platforms || "MT4 / MT5"}</strong>
                  </div>
                </Meta>
                <Blurb>
                  {b.beginnerBlurb?.trim() ||
                    b.description?.slice(0, 160) ||
                    "Friendly starting point with clearer onboarding and supported learning paths."}
                </Blurb>
                <CardCta to={`/rebates/broker/${b._id}`}>
                  View details <FiArrowRight />
                </CardCta>
              </Card>
            ))}
          </Grid>
        )}

        <Tips>
          <TipsTitle>What we look for in brokers for new traders</TipsTitle>
          <TipList>
            <li>Reasonable minimum deposit and transparent account types</li>
            <li>Clear regulation disclosures and withdrawal information</li>
            <li>Demo accounts / education-friendly platforms when available</li>
            <li>Not listed on Scam Broker Shield</li>
          </TipList>
        </Tips>
      </Page>
    </>
  );
};

export default BeginnerBrokersPage;
