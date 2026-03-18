import React from 'react';
import styled from 'styled-components';

const BannerWrapper = styled.section`
  background: #132E58;
  padding: 3rem 3rem 2.5rem 3rem;
  margin: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 2.5rem 2rem 2rem 2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 2rem 1.5rem 1.5rem 1.5rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1.5rem;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: center;
  }
`;

const Logo = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: white;
  letter-spacing: 1px;
`;

const TextContent = styled.div`
  color: white;
`;

const MainText = styled.p`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 18px;
  }
`;

const TradeButton = styled.button`
  background: #Fbbf24;
  color: #132E58;
  border: none;
  padding: 12px 28px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background: #f4b400;
    transform: translateY(-2px);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-top: 1rem;
  }
`;

const CurrencyPairs = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const PairBadge = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Disclaimer = styled.p`
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  line-height: 1.5;
`;

const PepperstoneBanner: React.FC = () => {
  return (
    <BannerWrapper>
      <ContentWrapper>
        <LogoWrapper>
          <Logo>pepperstone</Logo>
        </LogoWrapper>
        <TextContent>
          <MainText>Trade 60+ FX pairs around the clock at spreads from 0.0 pips*</MainText>
          <CurrencyPairs>
            <PairBadge>EUR/USD</PairBadge>
            <PairBadge>GBP/USD</PairBadge>
          </CurrencyPairs>
        </TextContent>
        <TradeButton>Trade now</TradeButton>
      </ContentWrapper>
      <Disclaimer>
        Applicable to Razor accounts, other fees and changes may apply. Between 74-99% of retail investor accounts lose money when trading CFDs.
      </Disclaimer>
    </BannerWrapper>
  );
};

export default PepperstoneBanner;
