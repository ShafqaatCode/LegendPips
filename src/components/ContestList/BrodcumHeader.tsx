import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FiAward, FiUsers, FiGift } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import { useLocale } from "../../contexts/LocaleContext";

interface Props {
  heading?: string;
}

const ContestHeaderWithModals: React.FC<Props> = ({ heading }) => {
  const { t } = useLocale();
  const title = heading || t("contests.pageHeading");

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <Eyebrow>{t("contests.kicker")}</Eyebrow>
          <Title>{title}</Title>
          <Lead>{t("contests.body")}</Lead>
        </HeroInner>
      </Hero>

      <PromoSection>
        <PromoCard>
          <PromoGrid>
            <Brand>
              <BrandIcon aria-hidden>
                <FiAward />
              </BrandIcon>
              <BrandName>LegendPips</BrandName>
            </Brand>

            <PromoCopy>
              <PromoTitle>Compete free. Win real prizes. No deposit required.</PromoTitle>
              <PromoTags>
                <Tag><FiGift /> Cash prizes</Tag>
                <Tag><FiUsers /> Live leaderboard</Tag>
                <Tag>Demo accounts</Tag>
              </PromoTags>
            </PromoCopy>

            <PromoCta to="/contests#competitions">Browse contests</PromoCta>
          </PromoGrid>
          <Disclaimer>
            Contests on LegendPips use demo accounts. We never ask for real trading capital to join.
          </Disclaimer>
        </PromoCard>
      </PromoSection>
    </>
  );
};

export default ContestHeaderWithModals;

const Hero = styled.section`
  position: relative;
  min-height: clamp(260px, 34vh, 360px);
  display: flex;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, #0b1b38 0%, #132e58 100%);
  padding: clamp(2.75rem, 6vw, 4rem) ${({ theme }) => theme.typography.pageGutter}
    clamp(1.75rem, 4vw, 2.5rem);
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.15;
  background-image: url(${bannerBg});
  background-size: cover;
  background-position: center;
  filter: blur(2px);
  z-index: 1;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(11, 27, 56, 0.8), rgba(19, 46, 88, 0.8));
  }
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  text-align: center;
  color: #fff;
`;

const Eyebrow = styled.p`
  margin: 0 0 0.55rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fbbf24;
`;

const Title = styled.h1`
  margin: 0 0 0.75rem;
  font-size: ${({ theme }) => theme.typography.heroTitle};
  line-height: ${({ theme }) => theme.typography.heroTitleLh};
  font-weight: 700;
  color: #fff;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 1.45rem;
  }
`;

const Lead = styled.p`
  margin: 0 auto;
  max-width: 46rem;
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.88);
`;

const PromoSection = styled.section`
  position: relative;
  z-index: 1;
  isolation: isolate;
  background: #fafbfc;
  padding: 1.75rem ${({ theme }) => theme.typography.pageGutter} 0.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.25rem ${({ theme }) => theme.typography.pageGutter} 0.25rem;
  }
`;

const PromoCard = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  background: #132e58;
  border-radius: 14px;
  padding: 1.5rem 1.75rem 1.15rem;
  box-shadow: 0 10px 28px rgba(19, 46, 88, 0.14);
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 55% 120% at 100% 0%, rgba(251, 191, 36, 0.16) 0%, transparent 55%);
    pointer-events: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.25rem 1.15rem 1rem;
    border-radius: 12px;
  }
`;

const PromoGrid = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1.1rem;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: center;
  }
`;

const BrandIcon = styled.span`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 12px;
  background: linear-gradient(145deg, #fbbf24 0%, #f59e0b 100%);
  color: #132e58;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  flex-shrink: 0;
`;

const BrandName = styled.span`
  font-size: 1.15rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.01em;
`;

const PromoCopy = styled.div`
  min-width: 0;
  color: #fff;
`;

const PromoTitle = styled.p`
  margin: 0 0 0.65rem;
  font-size: clamp(0.95rem, 2vw, 1.15rem);
  font-weight: 600;
  line-height: 1.4;
  color: #fff;
`;

const PromoTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: center;
  }
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const PromoCta = styled(Link)`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fbbf24;
  color: #132e58;
  text-decoration: none;
  padding: 0.7rem 1.4rem;
  font-size: 0.9375rem;
  font-weight: 700;
  border-radius: 8px;
  white-space: nowrap;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: #f4b400;
    transform: translateY(-1px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-self: center;
  }
`;

const Disclaimer = styled.p`
  position: relative;
  z-index: 1;
  text-align: center;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.65);
  margin: 1rem 0 0;
  padding-top: 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  line-height: 1.45;
`;
