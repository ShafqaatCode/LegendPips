import React from "react";
import styled from "styled-components";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import { useLocale } from "../../contexts/LocaleContext";

type SignalsHeroProps = {
  onCtaClick?: () => void;
};

const SignalsHero: React.FC<SignalsHeroProps> = ({ onCtaClick }) => {
  const { t } = useLocale();
  return (
    <HeroWrapper>
      <ChartOverlay />
      <ContentWrapper>
        <LeftContent>
          <Eyebrow>LegendPips · Trading signals</Eyebrow>
          <MainHeading>
            Clear setups. <Highlight>Defined risk.</Highlight>
          </MainHeading>
          <Description>{t("signals.body")}</Description>
          <Actions>
            <PrimaryBtn type="button" onClick={onCtaClick}>
              Get premium signals
            </PrimaryBtn>
            <GhostBtn
              type="button"
              onClick={() => {
                document.getElementById("live-signals")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View live board
            </GhostBtn>
          </Actions>
        </LeftContent>
      </ContentWrapper>
    </HeroWrapper>
  );
};

export default SignalsHero;

const HeroWrapper = styled.section`
  position: relative;
  min-height: clamp(260px, 34vh, 360px);
  display: flex;
  align-items: center;
  padding: clamp(2.5rem, 5.5vw, 3.75rem) ${({ theme }) => theme.typography.pageGutter}
    clamp(1.75rem, 4vw, 2.5rem);
  overflow: hidden;
  background: linear-gradient(135deg, #0b1b38 0%, #132e58 100%);
`;

const ChartOverlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.18;
  background-image: url(${bannerBg});
  background-size: cover;
  background-position: center;
  filter: blur(2px);
  z-index: 1;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, rgba(11, 27, 56, 0.92) 0%, rgba(19, 46, 88, 0.78) 100%);
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
`;

const LeftContent = styled.div`
  max-width: 40rem;
  color: white;
`;

const Eyebrow = styled.div`
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fbc113;
  margin-bottom: 0.55rem;
`;

const MainHeading = styled.h1`
  font-size: ${({ theme }) => theme.typography.heroTitle};
  font-weight: 800;
  line-height: ${({ theme }) => theme.typography.heroTitleLh};
  letter-spacing: -0.03em;
  margin: 0 0 0.75rem;
  color: white;
`;

const Highlight = styled.span`
  color: #fbc113;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.lead};
  line-height: 1.6;
  margin: 0;
  color: rgba(255, 255, 255, 0.86);
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 1.25rem;
`;

const PrimaryBtn = styled.button`
  border: none;
  cursor: pointer;
  padding: 0.75rem 1.15rem;
  border-radius: 11px;
  background: #fbc113;
  color: #132e58;
  font-weight: 800;
  font-size: 0.88rem;
  font-family: inherit;
`;

const GhostBtn = styled.button`
  border: 1px solid rgba(255, 255, 255, 0.35);
  cursor: pointer;
  padding: 0.75rem 1.15rem;
  border-radius: 11px;
  background: transparent;
  color: #fff;
  font-weight: 700;
  font-size: 0.88rem;
  font-family: inherit;
`;
