import React from 'react';
import styled from 'styled-components';

const HeroWrapper = styled.section`
  background: white;
  padding: 80px 3rem 40px 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 60px 2rem 30px 2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 60px 1.5rem 20px 1.5rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const LeftContent = styled.div`
  flex: 1;
  max-width: 700px;
`;

const MainHeading = styled.h1`
  font-size: 56px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: #132E58;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 42px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 32px;
    margin-bottom: 1rem;
  }
`;

const HighlightText = styled.span`
  color: #Fbbf24;
`;

const SubHeading = styled.h2`
  font-size: 24px;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 1.5rem;
  color: #132E58;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 20px;
    margin-bottom: 1rem;
  }
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: #666;
  margin-bottom: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 14px;
  }
`;

const RightContent = styled.div`
  flex-shrink: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const IconWrapper = styled.div`
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #Fbbf24;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const AnalysisHero: React.FC = () => {
  return (
    <HeroWrapper>
      <ContentWrapper>
        <LeftContent>
          <MainHeading>
            Market <HighlightText>Analysis</HighlightText>
          </MainHeading>
          <SubHeading>
            Smart <HighlightText>Insights</HighlightText> To Help You Make Stronger <HighlightText>Trading</HighlightText> Decisions.
          </SubHeading>
          <Description>
            Forex analysis helps you understand where a currency pair is likely to move next. By examining historical price movements, economic indicators, and market sentiment, traders can make more informed decisions about when to enter or exit positions.
          </Description>
        </LeftContent>
        <RightContent>
          <IconWrapper>
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3"/>
              <path d="M30 50 L45 35 L55 45 L70 30" stroke="currentColor" strokeWidth="3" fill="none"/>
              <rect x="40" y="40" width="20" height="25" stroke="currentColor" strokeWidth="2" fill="none"/>
              <line x1="50" y1="40" x2="50" y2="65" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </IconWrapper>
        </RightContent>
      </ContentWrapper>
    </HeroWrapper>
  );
};

export default AnalysisHero;
