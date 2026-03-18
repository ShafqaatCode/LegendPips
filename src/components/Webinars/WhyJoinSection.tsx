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
`;

const Heading = styled.h2`
  font-size: 42px;
  font-weight: 700;
  color: #132E58;
  text-align: center;
  margin-bottom: 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 32px;
    margin-bottom: 2rem;
  }
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const BenefitItem = styled.li`
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  padding-left: 2rem;
  position: relative;
  
  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #Fbbf24;
    font-weight: bold;
    font-size: 24px;
    top: 0;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 15px;
    padding-left: 1.75rem;
  }
`;

const WhyJoinSection: React.FC = () => {
  const benefits = [
    'Live market analysis with full breakdowns of market structure, key levels, trends, and session behavior to help you understand price movement in real time.',
    'Interactive Q and A sessions where you can ask detailed questions and receive clear, practical answers directly from experienced traders.',
    'Real trade examples explained from start to finish, including entry reasoning, risk placement, trade management, and exit decisions.',
    'Replay access available for every session, allowing you to review lessons, pause explanations, and learn again at your own pace.',
    'Learn directly from professionals who share real market experience, practical insights and disciplined trading approaches used in live conditions.'
  ];

  return (
    <SectionWrapper>
      <ContentWrapper>
        <Heading>Why Join Our Live Trading Webinars</Heading>
        <BenefitsList>
          {benefits.map((benefit, index) => (
            <BenefitItem key={index}>{benefit}</BenefitItem>
          ))}
        </BenefitsList>
      </ContentWrapper>
    </SectionWrapper>
  );
};

export default WhyJoinSection;
