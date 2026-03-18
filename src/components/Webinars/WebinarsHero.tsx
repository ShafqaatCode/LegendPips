import React from 'react';
import styled from 'styled-components';

const HeroWrapper = styled.section`
  background: white;
  padding: 80px 3rem 60px 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 60px 2rem 40px 2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 40px 1.5rem 30px 1.5rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4rem;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const LeftContent = styled.div``;

const Heading = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: #132E58;
  margin-bottom: 1.5rem;
  line-height: 1.3;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 36px;
  }
`;

const HighlightText = styled.span`
  color: #Fbbf24;
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: #555;
  max-width: 700px;
`;

const RightContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    order: -1;
    justify-content: flex-start;
  }
`;

const IconWrapper = styled.div`
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
  color: #132E58;
  opacity: 0.8;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100px;
    height: 100px;
    font-size: 60px;
  }
`;

const WebinarsHero: React.FC = () => {
  return (
    <HeroWrapper>
      <ContentWrapper>
        <LeftContent>
          <Heading>
            Live Trading <HighlightText>Webinars</HighlightText>
          </Heading>
          <Description>
            Learn directly from experienced traders through live sessions and detailed market breakdowns. Watch real time analysis, understand trade planning, and see how professionals read price action. Ask questions, follow live explanations, and gain practical insights you can apply in your own trading.
          </Description>
        </LeftContent>
        <RightContent>
          <IconWrapper>🎓</IconWrapper>
        </RightContent>
      </ContentWrapper>
    </HeroWrapper>
  );
};

export default WebinarsHero;
