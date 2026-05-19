import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import bannerBg from '../../assets/banner/BannerBg.jpg';
import ArrowRight from '../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg';

const HeroWrapper = styled.section`
  position: relative;
  min-height: clamp(380px, 52vh, 480px);
  display: flex;
  align-items: center;
  padding: clamp(4rem, 9vw, 5.5rem) ${({ theme }) => theme.typography.pageGutter}
    clamp(2.25rem, 5vw, 3.5rem);
  overflow: hidden;
  background: linear-gradient(135deg, #0b1b38 0%, #132e58 100%);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: clamp(3.5rem, 8vw, 5rem) ${({ theme }) => theme.typography.pageGutter}
      clamp(2rem, 4vw, 3rem);
    min-height: 420px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: clamp(3.25rem, 8vw, 4.5rem) ${({ theme }) => theme.typography.pageGutter}
      clamp(1.75rem, 4vw, 2.5rem);
    min-height: 380px;
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
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1.5rem, 4vw, 2.5rem);
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }
`;

const LeftContent = styled.div`
  color: white;
`;

const SubHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: ${({ theme }) => theme.typography.bannerUpper};
  font-weight: 600;
  color: #10b981;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const MainHeading = styled.h1`
  font-size: ${({ theme }) => theme.typography.heroTitle};
  font-weight: 700;
  line-height: ${({ theme }) => theme.typography.heroTitleLh};
  margin: 0 0 0.75rem;
  color: white;
`;

const HighlightText = styled.span`
  color: #fbbf24;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1.25rem;
`;

const JoinButton = styled.button`
  background: #fbbf24;
  color: #132e58;
  border: none;
  padding: 0.55rem 1.25rem;
  font-size: ${({ theme }) => theme.typography.body};
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f4b400;
    transform: translateY(-1px);
  }

  img {
    width: 18px;
    height: 18px;
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
  max-width: min(420px, 100%);
  height: clamp(240px, 38vh, 320px);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EducationIllustration = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GlobeIcon = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
  position: relative;
  z-index: 2;

  &::before {
    content: "🌍";
    font-size: 52px;
  }
`;

const GraduationCap = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #fbbf24 0%, #f4b400 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(251, 191, 36, 0.4);
  z-index: 3;

  &::before {
    content: "🎓";
    font-size: 32px;
  }
`;

const FloatingIcon = styled.div<{ $top?: string; $left?: string; $right?: string; $bottom?: string; $delay?: string }>`
  position: absolute;
  top: ${({ $top }) => $top || "auto"};
  left: ${({ $left }) => $left || "auto"};
  right: ${({ $right }) => $right || "auto"};
  bottom: ${({ $bottom }) => $bottom || "auto"};
  width: 56px;
  height: 56px;
  background: rgba(59, 130, 246, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(59, 130, 246, 0.2);
  animation: float 3s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || "0s"};
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(5deg);
    }
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

const VideosHero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <HeroWrapper>
      <ChartOverlay />
      <ContentWrapper>
        <LeftContent>
          <SubHeading>ALL IN ONE TRADING PLATFORM</SubHeading>
          <MainHeading>
            Understand <HighlightText>Markets,</HighlightText> Trade <HighlightText>Smarter</HighlightText>
          </MainHeading>
          <Description>
            Learn trading with expert guidance and hands-on practice. Build your knowledge, skills, and confidence to trade smarter and make informed decisions in the markets.
          </Description>
          <JoinButton onClick={() => navigate('/register')}>
            Join Now
            <img src={ArrowRight} alt="Arrow" />
          </JoinButton>
        </LeftContent>
        <RightContent>
          <IllustrationWrapper>
            <EducationIllustration>
              <GlobeIcon />
              <GraduationCap />
              <FloatingIcon $top="5%" $left="5%" $delay="0s">💰</FloatingIcon>
              <FloatingIcon $top="15%" $right="10%" $delay="0.5s">📊</FloatingIcon>
              <FloatingIcon $bottom="20%" $left="15%" $delay="1s">📈</FloatingIcon>
              <FloatingIcon $bottom="10%" $right="5%" $delay="1.5s">✏️</FloatingIcon>
            </EducationIllustration>
          </IllustrationWrapper>
        </RightContent>
      </ContentWrapper>
      <ChatWidget />
    </HeroWrapper>
  );
};

export default VideosHero;
