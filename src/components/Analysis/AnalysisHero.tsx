import React from 'react';
import styled from 'styled-components';

const HeroWrapper = styled.section`
  background: white;
  padding: clamp(2.5rem, 6vw, 4rem) ${({ theme }) => theme.typography.pageGutter};
`;

const ContentWrapper = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(1.25rem, 3vw, 2rem);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const LeftContent = styled.div`
  flex: 1;
  max-width: 700px;
`;

const MainHeading = styled.h1`
  font-size: ${({ theme }) => theme.typography.heroTitle};
  font-weight: 700;
  line-height: ${({ theme }) => theme.typography.heroTitleLh};
  margin: 0 0 0.75rem;
  color: #132e58;
`;

const HighlightText = styled.span`
  color: #fbbf24;
`;

const SubHeading = styled.h2`
  font-size: ${({ theme }) => theme.typography.panelSectionTitle};
  font-weight: 600;
  line-height: 1.35;
  margin: 0 0 0.75rem;
  color: #132e58;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.65;
  color: #555;
  margin: 0;
`;

const RightContent = styled.div`
  flex-shrink: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const IconWrapper = styled.div`
  width: clamp(120px, 22vw, 160px);
  height: clamp(120px, 22vw, 160px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fbbf24;

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
