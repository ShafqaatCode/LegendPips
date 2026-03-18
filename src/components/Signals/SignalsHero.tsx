import React from 'react';
import styled from 'styled-components';
import bannerBg from '../../assets/banner/BannerBg.jpg';

const HeroWrapper = styled.section`
  position: relative;
  min-height: 600px;
  display: flex;
  align-items: center;
  padding: 120px 3rem 80px 3rem;
  overflow: hidden;
  background: linear-gradient(135deg, #0b1b38 0%, #132E58 100%);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 100px 2rem 60px 2rem;
    min-height: 500px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 100px 1.5rem 40px 1.5rem;
    min-height: 450px;
    flex-direction: column;
  }
`;

const ChartOverlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.15;
  background-image: url(${bannerBg});
  background-size: cover;
  background-position: center;
  filter: blur(2px);
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(11, 27, 56, 0.8) 0%, rgba(19, 46, 88, 0.8) 100%);
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const LeftContent = styled.div`
  width: 100%;
  max-width: 800px;
  color: white;
  text-align: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-width: 100%;
  }
`;

const MainHeading = styled.h1`
  font-size: 56px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: white;
  
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

const Description = styled.p`
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 16px;
  }
`;

const SubDescription = styled.p`
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.8);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 14px;
    margin-bottom: 1.5rem;
  }
`;



const RecentPerformanceHeading = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  color: white;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 20px;
    margin-top: 2rem;
  }
`;

const SignalsHero: React.FC = () => {
  return (
    <HeroWrapper>
      <ChartOverlay />
      <ContentWrapper>
        <LeftContent>
          <MainHeading>
            LIVE SIGNALS
          </MainHeading>
          <Description>
            Stay ahead of every move with accurate, live market signals across Forex, Gold, and Crypto — updated in real time to help you capture every trading opportunity with confidence and precision.
          </Description>
          <RecentPerformanceHeading>Recent Signal Performance</RecentPerformanceHeading>
        </LeftContent>
      </ContentWrapper>
    </HeroWrapper>
  );
};

export default SignalsHero;
