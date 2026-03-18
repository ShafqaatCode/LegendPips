import React from "react";
import styled from "styled-components";

import GiftIllustration from "../../assets/money-bag 2.png";

type RewardsHeroProps = {
  onJoinNow?: () => void;
};

const Hero = styled.section`
  position: relative;
  overflow: hidden;
  padding: 72px 24px;
  background: linear-gradient(135deg, #0b1b38 0%, #132e58 100%);
  color: white;
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    text-align: center;
    gap: 24px;
  }
`;

const Left = styled.div`
  max-width: 620px;
`;

const Upper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: center;
  }
`;

const UpperText = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
`;

const Title = styled.h2`
  margin: 0;
  font-size: 46px;
  line-height: 1.08;
  font-weight: 700;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 34px;
  }
`;

const TitleAccent = styled.span`
  color: ${({ theme }) => theme.colors.gold};
`;

const Description = styled.p`
  margin: 14px 0 28px;
  font-size: 16px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
`;

const JoinButton = styled.button`
  padding: 12px 22px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  background: ${({ theme }) => theme.colors.gold};
  color: #132e58;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.02);
  }
`;

const Right = styled.div`
  width: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 320px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 260px;
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

