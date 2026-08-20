import React from 'react';
import styled from 'styled-components';
import bannerBg from '../../assets/banner/BannerBg.jpg';
import { useLocale } from '../../contexts/LocaleContext';

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
  max-width: ${({ theme }) => theme.typography.contentMax};
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
  font-size: ${({ theme }) => theme.typography.heroTitle};
  font-weight: 700;
  line-height: ${({ theme }) => theme.typography.heroTitleLh};
  margin: 0 0 1rem;
  color: white;
`;

const HighlightText = styled.span`
  color: #fbbf24;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.65;
  margin: 0 0 0.75rem;
  color: rgba(255, 255, 255, 0.9);
`;

const SubDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.6;
  margin: 0 0 1.5rem;
  color: rgba(255, 255, 255, 0.8);
`;

const RecentPerformanceHeading = styled.h3`
  font-size: ${({ theme }) => theme.typography.panelSectionTitle};
  font-weight: 600;
  margin: 2rem 0 1rem;
  color: white;
`;

const SignalsHero: React.FC = () => {
  const { t } = useLocale();
  return (
    <HeroWrapper>
      <ChartOverlay />
      <ContentWrapper>
        <LeftContent>
          <MainHeading>
            {t("signals.title")}
          </MainHeading>
          <Description>
            {t("signals.body")}
          </Description>
          <RecentPerformanceHeading>{t("signals.recent")}</RecentPerformanceHeading>
        </LeftContent>
      </ContentWrapper>
    </HeroWrapper>
  );
};

export default SignalsHero;
