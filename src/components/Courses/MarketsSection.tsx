import React from 'react';
import styled from 'styled-components';

const SectionWrapper = styled.section`
  background: white;
  padding: 80px 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 60px 2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 40px 1.5rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
`;

const Heading = styled.h2`
  font-size: 42px;
  font-weight: 700;
  color: #132E58;
  margin-bottom: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 32px;
  }
`;

const Description = styled.p`
  font-size: 18px;
  line-height: 1.7;
  color: #555;
  margin-bottom: 3rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 16px;
    margin-bottom: 2rem;
  }
`;

const MarketsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  margin-top: 3rem;
  
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
  font-size: 48px;
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
