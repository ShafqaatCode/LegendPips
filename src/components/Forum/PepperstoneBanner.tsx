import React from 'react';
import styled from 'styled-components';

const BannerSection = styled.section`
  position: relative;
  z-index: 1;
  isolation: isolate;
  background: #fafbfc;
  padding: 1.75rem ${({ theme }) => theme.typography.pageGutter} 0.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.25rem 1.25rem 0.25rem;
  }
`;

const BannerCard = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  background: #132e58;
  border-radius: 14px;
  padding: 1.5rem 1.75rem 1.15rem;
  box-shadow: 0 10px 28px rgba(19, 46, 88, 0.14);
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.25rem 1.15rem 1rem;
    border-radius: 12px;
  }
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1.1rem;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.02em;
  line-height: 1;
`;

const TextContent = styled.div`
  color: white;
  min-width: 0;
`;

const MainText = styled.p`
  font-size: clamp(0.95rem, 2vw, 1.15rem);
  font-weight: 600;
  margin: 0 0 0.65rem;
  color: white;
  line-height: 1.4;
`;

const CurrencyPairs = styled.div`
  display: flex;
  gap: 0.65rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: center;
  }
`;

const PairBadge = styled.div`
  background: rgba(255, 255, 255, 0.08);
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.22);
`;

const TradeButton = styled.button`
  background: #fbbf24;
  color: #132e58;
  border: none;
  padding: 0.7rem 1.4rem;
  font-size: 0.9375rem;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #f4b400;
    transform: translateY(-1px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-self: center;
  }
`;

const Disclaimer = styled.p`
  text-align: center;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.65);
  margin: 1rem 0 0;
  padding-top: 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  line-height: 1.45;
`;

const PepperstoneBanner: React.FC = () => {
  return (
    <BannerSection>
      <BannerCard>
        <ContentWrapper>
          <Logo>pepperstone</Logo>
          <TextContent>
            <MainText>Trade 60+ FX pairs around the clock at spreads from 0.0 pips*</MainText>
            <CurrencyPairs>
              <PairBadge>EUR/USD</PairBadge>
              <PairBadge>GBP/USD</PairBadge>
            </CurrencyPairs>
          </TextContent>
          <TradeButton type="button">Trade now</TradeButton>
        </ContentWrapper>
        <Disclaimer>
          Applicable to Razor accounts, other fees and charges may apply. Between 74-89% of retail
          investor accounts lose money when trading CFDs.
        </Disclaimer>
      </BannerCard>
    </BannerSection>
  );
};

export default PepperstoneBanner;
