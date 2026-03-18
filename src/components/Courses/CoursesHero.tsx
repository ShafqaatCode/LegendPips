import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
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
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const LeftContent = styled.div`
  color: white;
`;

const MainHeading = styled.h1`
  font-size: 56px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: white;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 42px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 32px;
  }
`;

const HighlightText = styled.span`
  color: #Fbbf24;
`;

const Subtitle = styled.p`
  font-size: 20px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 18px;
  }
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 15px;
  }
`;

const AccessButton = styled.button`
  background: #Fbbf24;
  color: #132E58;
  border: none;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f4b400;
    transform: translateY(-2px);
  }
`;

const RightContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    order: -1;
  }
`;

const IllustrationWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  height: 400px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 300px;
  }
`;

const EducationIllustration = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GraduationCap = styled.div`
  width: 140px;
  height: 140px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
  position: relative;
  z-index: 2;
  
  &::before {
    content: '📚';
    font-size: 70px;
  }
`;

const FloatingIcon = styled.div<{ $top?: string; $left?: string; $right?: string; $bottom?: string; $delay?: string }>`
  position: absolute;
  top: ${({ $top }) => $top || 'auto'};
  left: ${({ $left }) => $left || 'auto'};
  right: ${({ $right }) => $right || 'auto'};
  bottom: ${({ $bottom }) => $bottom || 'auto'};
  width: 70px;
  height: 70px;
  background: rgba(59, 130, 246, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(59, 130, 246, 0.2);
  animation: float 3s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || '0s'};
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
`;

const ChatWidget = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: #Fbbf24;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  z-index: 10;
  
  &::after {
    content: '💬';
    font-size: 24px;
  }
`;

const CoursesHero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <HeroWrapper>
      <ChartOverlay />
      <ContentWrapper>
        <LeftContent>
          <MainHeading>
            Understand <HighlightText>Markets,</HighlightText> Trade <HighlightText>Smarter</HighlightText>
          </MainHeading>
          <Subtitle>An All-in-One Trading Platform.</Subtitle>
          <Description>
            Learn trading with expert guidance and hands-on practice. Build your knowledge, skills, and confidence to trade smarter and make informed decisions in the markets.
          </Description>
          <AccessButton onClick={() => navigate('/register')}>
            Access Now
          </AccessButton>
        </LeftContent>
        <RightContent>
          <IllustrationWrapper>
            <EducationIllustration>
              <GraduationCap />
              <FloatingIcon $top="5%" $left="5%" $delay="0s">📊</FloatingIcon>
              <FloatingIcon $top="15%" $right="10%" $delay="0.5s">📈</FloatingIcon>
              <FloatingIcon $bottom="20%" $left="15%" $delay="1s">💰</FloatingIcon>
              <FloatingIcon $bottom="10%" $right="5%" $delay="1.5s">💡</FloatingIcon>
            </EducationIllustration>
          </IllustrationWrapper>
        </RightContent>
      </ContentWrapper>
      <ChatWidget />
    </HeroWrapper>
  );
};

export default CoursesHero;
