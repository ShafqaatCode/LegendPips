import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiBarChart2,
  FiDollarSign,
  FiGift,
  FiLayers,
  FiTrendingUp,
} from "react-icons/fi";
import bannerImg from "../../assets/banner/BannerBg.jpg";
import {
  CALCULATORS_CATALOG,
  CALCULATORS_INTRO,
  type CalculatorItem,
} from "../../data/calculatorsCatalog";

const ICONS: Record<string, React.ReactNode> = {
  "lot-size": <FiLayers size={22} />,
  pip: <FiTrendingUp size={22} />,
  margin: <FiDollarSign size={22} />,
  pivot: <FiBarChart2 size={22} />,
  rebate: <FiGift size={22} />,
};

const Page = styled.div`
  background: #f3f4f7;
`;

const Hero = styled.section`
  position: relative;
  background-image: url(${bannerImg});
  background-size: cover;
  background-position: center;
  padding: clamp(5.5rem, 9vw, 7rem) 0 clamp(2.75rem, 5vw, 3.5rem);
  text-align: center;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(19, 46, 88, 0.92) 0%,
      rgba(26, 64, 112, 0.88) 50%,
      rgba(19, 46, 88, 0.94) 100%
    );
  }
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
`;

const Eyebrow = styled.p`
  margin: 0 0 0.65rem;
  font-size: ${({ theme }) => theme.typography.bannerUpper};
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gold};
`;

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.bannerTitle};
  line-height: ${({ theme }) => theme.typography.bannerTitleLh};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.WHITE};
`;

const HeroLead = styled.p`
  margin: 0.85rem auto 0;
  max-width: 40rem;
  font-size: ${({ theme }) => theme.typography.lead};
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.88);
`;

const Content = styled.section`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: clamp(2rem, 4vw, 2.75rem) ${({ theme }) => theme.typography.pageGutter}
    clamp(2.5rem, 5vw, 3.5rem);
  box-sizing: border-box;
`;

const Intro = styled.p`
  margin: 0 auto clamp(1.75rem, 3vw, 2.25rem);
  max-width: 52rem;
  text-align: center;
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.muted};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(0.85rem, 2vw, 1.15rem);

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: clamp(1.1rem, 2vw, 1.35rem);
  background: ${({ theme }) => theme.colors.WHITE};
  border: 1px solid #e3e7ee;
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(19, 46, 88, 0.04), 0 8px 22px rgba(19, 46, 88, 0.06);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: rgba(251, 191, 36, 0.45);
    box-shadow: 0 2px 4px rgba(19, 46, 88, 0.06), 0 14px 28px rgba(19, 46, 88, 0.1);
    transform: translateY(-2px);
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
`;

const IconBadge = styled.div`
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  background: linear-gradient(145deg, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0.08) 100%);
  border: 1px solid rgba(251, 191, 36, 0.35);
`;

const CardHead = styled.div`
  min-width: 0;
`;

const Tag = styled.span`
  display: inline-block;
  margin-bottom: 0.35rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: clamp(1rem, 0.6vw + 0.9rem, 1.125rem);
  line-height: 1.3;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const CardText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.65;
  color: #4b5563;
`;

const CardLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: auto;
  width: fit-content;
  padding: 0.55rem 0.95rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.WHITE};
  background: ${({ theme }) => theme.colors.primary};
  transition: background 0.2s ease, color 0.2s ease, transform 0.15s ease;

  svg {
    transition: transform 0.2s ease;
  }

  &:hover {
    background: linear-gradient(135deg, #132e58 0%, #1a4070 100%);
    color: ${({ theme }) => theme.colors.gold};

    svg {
      transform: translate(2px, -2px);
    }
  }
`;

function CalculatorCard({ item }: { item: CalculatorItem }) {
  return (
    <Card>
      <CardTop>
        <IconBadge aria-hidden>{ICONS[item.id]}</IconBadge>
        <CardHead>
          <Tag>{item.shortLabel}</Tag>
          <CardTitle>{item.title}</CardTitle>
        </CardHead>
      </CardTop>
      <CardText>{item.description}</CardText>
      <CardLink to={item.path}>
        Open calculator
        <FiArrowUpRight size={16} aria-hidden />
      </CardLink>
    </Card>
  );
}

const CalculatorsPage: React.FC = () => {
  return (
    <Page>
      <Hero>
        <HeroInner>
          <Eyebrow>Trading tools</Eyebrow>
          <Title>Forex Calculators</Title>
          <HeroLead>
            Free, accurate tools for position sizing, pip value, margin, pivot levels, and
            cashback estimates — built for LegendPips traders.
          </HeroLead>
        </HeroInner>
      </Hero>

      <Content>
        <Intro>{CALCULATORS_INTRO}</Intro>
        <Grid>
          {CALCULATORS_CATALOG.map((item) => (
            <CalculatorCard key={item.id} item={item} />
          ))}
        </Grid>
      </Content>
    </Page>
  );
};

export default CalculatorsPage;
