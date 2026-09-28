import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiArrowRight, FiCalendar } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import TradingViewWidget from "../../components/MarketCharts/TradingViewWidget";

const TV_EVENTS =
  "https://s3.tradingview.com/external-embedding/embed-widget-events.js";

const EconomicCalendarPage: React.FC = () => {
  const config = useMemo(
    () => ({
      colorTheme: "light",
      isTransparent: false,
      width: "100%",
      height: 620,
      locale: "en",
      importanceFilter: "-1,0,1",
      countryFilter: "us,eu,gb,jp,au,ca,ch",
    }),
    []
  );

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <Eyebrow>
            <FiCalendar aria-hidden /> Tools
          </Eyebrow>
          <Title>Economic calendar</Title>
          <Lead>
            Track high-impact macro releases, central bank events, and data prints that move forex and
            CFD markets — powered by TradingView.
          </Lead>
          <HeroLinks>
            <HeroLink to="/live-charts">
              Live charts <FiArrowRight />
            </HeroLink>
            <HeroLink to="/analysis">Market analysis</HeroLink>
          </HeroLinks>
        </HeroInner>
      </Hero>

      <Page>
        <Card>
          <TradingViewWidget scriptSrc={TV_EVENTS} config={config} minHeight={620} />
        </Card>
        <Note>
          Times shown in UTC. For personal reminders, use{" "}
          <Link to="/user-panel/alerts">alerts</Link> in your member panel.
        </Note>
      </Page>
    </>
  );
};

const Hero = styled.section`
  position: relative;
  min-height: clamp(260px, 34vh, 340px);
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
`;

const Eyebrow = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gold};
`;

const Title = styled.h1`
  margin: 0 0 0.75rem;
  font-size: clamp(1.6rem, 2.5vw, 2.15rem);
`;

const Lead = styled.p`
  margin: 0;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.9);
`;

const HeroLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.65rem 1rem;
  margin-top: 1.1rem;
`;

const HeroLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: ${({ theme }) => theme.colors.gold};
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Page = styled.main`
  background: #f4f6fa;
  padding: 1.25rem ${({ theme }) => theme.typography.pageGutter} 3rem;
`;

const Card = styled.section`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(19, 46, 88, 0.06);
`;

const Note = styled.p`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0.85rem auto 0;
  font-size: 0.8125rem;
  color: #64748b;
  text-align: center;
  a {
    color: #132e58;
    font-weight: 700;
  }
`;

export default EconomicCalendarPage;
