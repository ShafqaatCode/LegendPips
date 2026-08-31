import React from "react";
import styled from "styled-components";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import GiftIllustration from "../../assets/money-bag 2.png";

type RewardsJoinClubProps = {
  onJoinNow?: () => void;
};

const Hero = styled.section`
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: clamp(240px, 32vh, 340px);
  display: flex;
  align-items: center;
  padding: clamp(2.25rem, 5vw, 3.25rem) ${({ theme }) => theme.typography.pageGutter}
    clamp(1.75rem, 4vw, 2.5rem);
  background: linear-gradient(135deg, #0b1b38 0%, #132e58 100%);
  color: white;
`;

const ChartOverlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.14;
  background-image: url(${bannerBg});
  background-size: cover;
  background-position: center;
  filter: blur(2px);
  z-index: 1;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(11, 27, 56, 0.82) 0%, rgba(19, 46, 88, 0.78) 100%);
  }
`;

const Glow = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: radial-gradient(ellipse 45% 80% at 100% 20%, rgba(251, 191, 36, 0.18) 0%, transparent 55%);
`;

const Inner = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(1.25rem, 3vw, 2.5rem);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    text-align: center;
  }
`;

const Left = styled.div`
  max-width: 36rem;
`;

const Kicker = styled.span`
  display: inline-block;
  font-size: ${({ theme }) => theme.typography.caption};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 0.35rem;
`;

const Title = styled.h1`
  margin: 0.35rem 0 0;
  font-size: ${({ theme }) => theme.typography.heroTitle};
  line-height: ${({ theme }) => theme.typography.heroTitleLh};
  font-weight: 700;
  letter-spacing: -0.02em;
`;

const Accent = styled.span`
  color: ${({ theme }) => theme.colors.gold};
`;

const Subtitle = styled.p`
  margin: 0.65rem 0 0;
  font-size: ${({ theme }) => theme.typography.lead};
  font-weight: 600;
  color: rgba(251, 191, 36, 0.95);
  line-height: 1.4;
`;

const Description = styled.p`
  margin: 0.75rem 0 1.35rem;
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.9);
  max-width: 34rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-left: auto;
    margin-right: auto;
  }
`;

const JoinButton = styled.button`
  padding: 0.6rem 1.25rem;
  border-radius: 999px;
  border: none;
  background: ${({ theme }) => theme.colors.gold};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  font-size: ${({ theme }) => theme.typography.body};
  font-family: ${({ theme }) => theme.font.family};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 8rem;
  transition: transform 0.15s ease, filter 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.03);
  }
`;

const Right = styled.div`
  width: min(100%, 260px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: min(100%, 200px);
  }
`;

const Illustration = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.35));
`;

const RewardsJoinClub: React.FC<RewardsJoinClubProps> = ({ onJoinNow }) => {
  return (
    <Hero>
      <ChartOverlay />
      <Glow />
      <Inner>
        <Left>
          <Kicker>Exclusive community</Kicker>
          <Title>
            Join the <Accent>club</Accent>
          </Title>
          <Subtitle>Turn trades into unforgettable rewards.</Subtitle>
          <Description>
            Become a loyal member of our exclusive trading community. Fulfill the required trading lots and unlock
            premium rewards designed to elevate your journey.
          </Description>
          <JoinButton type="button" onClick={onJoinNow}>
            Join Now
          </JoinButton>
        </Left>
        <Right>
          <Illustration src={GiftIllustration} alt="" />
        </Right>
      </Inner>
    </Hero>
  );
};

export default RewardsJoinClub;
