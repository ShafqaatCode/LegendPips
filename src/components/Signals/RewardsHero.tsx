import React from "react";
import styled from "styled-components";

import GiftIllustration from "../../assets/money-bag 2.png";

type RewardsHeroProps = {
  onJoinNow?: () => void;
};

const Hero = styled.section`
  position: relative;
  overflow: hidden;
  padding: clamp(2.5rem, 5vw, 3.5rem) ${({ theme }) => theme.typography.pageGutter};
  background: linear-gradient(135deg, #0b1b38 0%, #132e58 100%);
  color: white;
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(1.25rem, 3vw, 2rem);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    text-align: center;
    gap: 1.25rem;
  }
`;

const Left = styled.div`
  max-width: 36rem;
`;

const UpperText = styled.span`
  font-size: ${({ theme }) => theme.typography.caption};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
`;

const Upper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 0.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: center;
  }
`;

const TitleAccent = styled.span`
  color: ${({ theme }) => theme.colors.gold};
`;

const Title = styled.h2`
  margin: 0.35rem 0 0;
  font-size: ${({ theme }) => theme.typography.heroTitle};
  line-height: ${({ theme }) => theme.typography.heroTitleLh};
  font-weight: 700;
`;

const Description = styled.p`
  margin: 0.75rem 0 1.25rem;
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.9);
`;

const JoinButton = styled.button`
  padding: 0.55rem 1.15rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  background: ${({ theme }) => theme.colors.gold};
  color: #132e58;
  font-weight: 600;
  font-size: ${({ theme }) => theme.typography.body};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 7.5rem;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.02);
  }
`;

const Right = styled.div`
  width: min(100%, 280px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: min(100%, 240px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: min(100%, 200px);
  }
`;

const Illustration = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
`;

const RewardsHero: React.FC<RewardsHeroProps> = ({ onJoinNow }) => {
  return (
    <Hero>
      <Inner>
        <Left>
          <Upper>
            <UpperText>ALL IN ONE TRADING PLATFORM</UpperText>
          </Upper>

          <Title>
            Gift Rewards <TitleAccent>That Something More</TitleAccent>
          </Title>

          <Description>
            From cash prizes to exciting bonus rewards, we turn every trade into progress. Join the
            club and unlock deals designed to keep your momentum strong.
          </Description>

          <JoinButton type="button" onClick={onJoinNow}>
            Join Now
          </JoinButton>
        </Left>

        <Right>
          <Illustration src={GiftIllustration} alt="Gift rewards illustration" />
        </Right>
      </Inner>
    </Hero>
  );
};

export default RewardsHero;

