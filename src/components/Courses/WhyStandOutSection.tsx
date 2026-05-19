import React from 'react';
import styled from 'styled-components';

const SectionWrapper = styled.section`
  background: #fafbfc;
  padding: clamp(2.5rem, 6vw, 3.5rem) ${({ theme }) => theme.typography.pageGutter};
`;

const ContentWrapper = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1.5rem, 4vw, 2.5rem);
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }
`;

const LeftContent = styled.div``;

const Heading = styled.h2`
  font-size: ${({ theme }) => theme.typography.sectionTitle};
  line-height: ${({ theme }) => theme.typography.sectionTitleLh};
  font-weight: 700;
  color: #132e58;
  margin: 0 0 1rem;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.65;
  color: #555;
  margin: 0;
`;

const RightContent = styled.div`
  background: #132E58;
  border-radius: 16px;
  padding: 3rem;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 2rem;
    min-height: 300px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;
  position: relative;
  z-index: 2;
`;

const IconCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.75rem, 4vw, 2rem);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(1.1);
  }
`;

const DecorativeLine = styled.div`
  position: absolute;
  width: 2px;
  height: 200px;
  background: linear-gradient(to bottom, transparent, rgba(251, 191, 36, 0.3), transparent);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  z-index: 1;
`;

const DecorativeCircle = styled.div<{ $top?: string; $left?: string; $right?: string; $bottom?: string }>`
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 2px solid rgba(251, 191, 36, 0.2);
  top: ${({ $top }) => $top || 'auto'};
  left: ${({ $left }) => $left || 'auto'};
  right: ${({ $right }) => $right || 'auto'};
  bottom: ${({ $bottom }) => $bottom || 'auto'};
  z-index: 1;
`;

const WhyStandOutSection: React.FC = () => {
  return (
    <SectionWrapper>
      <ContentWrapper>
        <LeftContent>
          <Heading>Why We Stand Out</Heading>
          <Description>
            Learn from certified trainers with years of market experience through interactive live webinars and on-demand recorded sessions. Access structured courses covering every aspect of trading, including strategies, risk management, and market analysis. Enjoy live Q&A sessions with real-time examples, step-by-step demonstrations, and advanced lessons. Receive personalized guidance, personalized feedback, and ongoing support to build confidence and master trading in real-world conditions.
          </Description>
        </LeftContent>
        <RightContent>
          <DecorativeLine />
          <DecorativeCircle $top="10%" $left="10%" />
          <DecorativeCircle $bottom="10%" $right="10%" />
          <IconWrapper>
            <IconCircle>📊</IconCircle>
            <IconCircle>🎤</IconCircle>
            <IconCircle>⚖️</IconCircle>
          </IconWrapper>
        </RightContent>
      </ContentWrapper>
    </SectionWrapper>
  );
};

export default WhyStandOutSection;
