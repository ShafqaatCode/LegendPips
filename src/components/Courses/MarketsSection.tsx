import React from 'react';
import styled from 'styled-components';

const SectionWrapper = styled.section`
  background: white;
  padding: clamp(2.5rem, 6vw, 3.5rem) ${({ theme }) => theme.typography.pageGutter};
`;

const ContentWrapper = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  text-align: center;
`;

const Heading = styled.h2`
  font-size: ${({ theme }) => theme.typography.sectionTitle};
  line-height: ${({ theme }) => theme.typography.sectionTitleLh};
  font-weight: 700;
  color: #132e58;
  margin: 0 auto 1rem;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.lead};
  line-height: 1.65;
  color: #555;
  margin: 0 auto 2rem;
  max-width: 42rem;
`;

const MarketsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(1.5rem, 3vw, 2rem);
  margin-top: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const MarketCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const MarketIcon = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.75rem, 4vw, 2rem);
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(19, 46, 88, 0.15);
  }
`;

const MarketTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #132E58;
  margin-bottom: 0.5rem;
`;

const MarketDescription = styled.p`
  font-size: 14px;
  color: #666;
`;

const markets = [
  { icon: '💱', title: 'Forex', description: 'Currency Trading' },
  { icon: '₿', title: 'Crypto', description: 'Cryptocurrencies' },
  { icon: '📈', title: 'Stocks', description: 'Equity Markets' },
  { icon: '📅', title: 'Futures', description: 'Futures Markets' },
  { icon: '🥇', title: 'Gold', description: 'Precious Metals' },
  { icon: '🏭', title: 'Commodities', description: 'Raw Materials' }
];

const MarketsSection: React.FC = () => {
  return (
    <SectionWrapper>
      <ContentWrapper>
        <Heading>Learn to Trade Multiple Markets</Heading>
        <Description>
          Learn to trade across multiple financial instruments with structured education. Trade forex, stocks, crypto, and commodities with guided learning. Build skills across key financial instruments through practical training. Develop multi-market trading skills with step-by-step education.
        </Description>
        <MarketsGrid>
          {markets.map((market, index) => (
            <MarketCard key={index}>
              <MarketIcon>{market.icon}</MarketIcon>
              <MarketTitle>{market.title}</MarketTitle>
              <MarketDescription>{market.description}</MarketDescription>
            </MarketCard>
          ))}
        </MarketsGrid>
      </ContentWrapper>
    </SectionWrapper>
  );
};

export default MarketsSection;
