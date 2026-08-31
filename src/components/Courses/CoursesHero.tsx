import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import bannerBg from '../../assets/banner/BannerBg.jpg';
import { useLocale } from '../../contexts/LocaleContext';

const HeroWrapper = styled.section`
  position: relative;
  min-height: clamp(280px, 36vh, 380px);
  display: flex;
  align-items: center;
  padding: clamp(2.75rem, 6vw, 4rem) ${({ theme }) => theme.typography.pageGutter}
    clamp(1.75rem, 4vw, 2.75rem);
  overflow: hidden;
  background: linear-gradient(135deg, #0b1b38 0%, #132e58 100%);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: clamp(2.5rem, 6vw, 3.5rem) ${({ theme }) => theme.typography.pageGutter}
      clamp(1.5rem, 3.5vw, 2.25rem);
    min-height: 320px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: clamp(2.25rem, 6vw, 3rem) ${({ theme }) => theme.typography.pageGutter}
      clamp(1.35rem, 3.5vw, 2rem);
    min-height: 280px;
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

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.heroSubtitle};
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1rem;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1.5rem;
  max-width: 36rem;
`;

const AccessButton = styled.button`
  background: #fbbf24;
  color: #132e58;
  border: none;
  padding: 0.55rem 1.25rem;
  font-size: ${({ theme }) => theme.typography.body};
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f4b400;
    transform: translateY(-1px);
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

const GraduationCap = styled.div`
  width: 110px;
  height: 110px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
  position: relative;
  z-index: 2;

  &::before {
    content: "📚";
    font-size: 40px;
  }
`;

const FloatingIcon = styled.div<{ $top?: string; $left?: string; $right?: string; $bottom?: string; $delay?: string }>`
  position: absolute;
  top: ${({ $top }) => $top || 'auto'};
  left: ${({ $left }) => $left || 'auto'};
  right: ${({ $right }) => $right || 'auto'};
  bottom: ${({ $bottom }) => $bottom || 'auto'};
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
  const { t } = useLocale();

  return (
    <HeroWrapper>
      <ChartOverlay />
      <ContentWrapper>
        <LeftContent>
          <MainHeading>
            {t("courses.title")} <HighlightText>{t("courses.highlight1")}</HighlightText> Trade <HighlightText>{t("courses.highlight2")}</HighlightText>
          </MainHeading>
          <Subtitle>{t("courses.subtitle")}</Subtitle>
          <Description>
            {t("courses.body")}
          </Description>
          <AccessButton onClick={() => navigate('/register')}>
            {t("courses.cta")}
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
