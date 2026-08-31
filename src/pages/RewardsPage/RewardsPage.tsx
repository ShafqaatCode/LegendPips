import React, { useState } from "react";
import styled from "styled-components";

import RewardsJoinClub from "../../components/Signals/RewardsJoinClub";
import XMBanner from "../../components/Signals/XMBanner";
import RewardsCards from "../../components/Signals/RewardsCards";
import SubscriptionModal from "../../components/Signals/SubscriptionModal";

import ParticipationIcon from "../../assets/icons/verified.svg";
import LockIcon from "../../assets/icons/badge1.svg";
import DiceIcon from "../../assets/icons/contest.svg";
import RewardPointsIcon from "../../assets/icons/statistics1.svg";
import FairPlayIcon from "../../assets/icons/support-svgrepo-com 1.svg";

const Frame = styled.div`
  max-width: 1120px;
  margin: 0 auto 24px;
  background: white;
  overflow: hidden;
`;

const Inner = styled.div`
  padding: 1.15rem 12px 22px;
`;

const BottomCta = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 10px 22px;
`;

const BottomText = styled.div`
  font-weight: 700;
  color: #132e58;
  font-size: 13px;
`;

const JoinNowButton = styled.button`
  border: none;
  cursor: pointer;
  background: #132e58;
  color: white;
  border-radius: 999px;
  padding: 10px 18px;
  font-weight: 700;

  &:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }
`;

const SectionCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 18px 18px;
  box-shadow: 0 10px 24px rgba(19, 46, 88, 0.05);
  margin: 6px 0 18px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
`;

const HeaderPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #fbbf24;
  color: #132e58;
  font-weight: 900;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 14px;
`;

const HeaderIcon = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
`;

const List = styled.ul`
  list-style: disc;
  padding-left: 18px;
  margin: 0;

  li {
    color: #6b7280;
    font-size: 12px;
    line-height: 1.7;
    margin: 10px 0;
  }
`;

const SectionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 10px 0 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SectionHeaderTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 900;
  color: #132e58;
`;

const DetailCard = styled(SectionCard)`
  padding-top: 14px;
`;

const DetailTop = styled.div`
  margin-bottom: 10px;
`;

const DetailPill = styled(HeaderPill)`
  font-size: 13px;
`;

const DetailIcon = styled(HeaderIcon)``;

const RewardPointsHeading = styled.h3`
  margin: 12px 0 10px;
  font-size: 20px;
  font-weight: 900;
  color: #132e58;
`;

const InlineIcon = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
`;

const MiniCard = styled(SectionCard)`
  margin: 18px 0;
`;

const RulesOuter = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
`;

const RuleBlock = styled.div`
  padding: 16px 16px;
  border-top: 1px solid #f3f4f6;

  &:first-child {
    border-top: none;
  }
`;

const RuleHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
`;

const RulePill = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fbbf24;
  color: #132e58;
  font-weight: 900;
  border-radius: 8px;
  font-size: 12px;
  padding: 6px 12px;
  width: fit-content;
`;

const RuleIconWrap = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #fbbf24;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const RuleIcon = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
`;

const RewardsPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <RewardsJoinClub onJoinNow={() => setShowModal(true)} />
      <Frame>
        <Inner>
          <XMBanner />
          <RewardsCards onJoinNow={() => setShowModal(true)} />

        <BottomCta>
          <BottomText>Start Trading. Start winning.</BottomText>
          <JoinNowButton type="button" onClick={() => setShowModal(true)}>
            Join Now
          </JoinNowButton>
        </BottomCta>

        <SectionCard>
          <HeaderRow>
            <HeaderPill>
              <HeaderIcon src={ParticipationIcon} alt="" />
              Participation Criteria
            </HeaderPill>
          </HeaderRow>
          <List>
            <li>
              Connect your trading account through our IB only – To participate, your account must be linked
              directly with our Introducing Broker. This ensures your trades are promptly tracked and
              counted towards your reward journey.
            </li>
            <li>
              Complete the milestone of 100 trading lots – Rewards are unlocked once you achieve a total of
              100 lots. This milestone demonstrates consistency and community, making it eligible for
              valuable rewards.
            </li>
            <li>Only demo competition accounts are counted – To keep the competition level and fair for all, only real trading lots executed in live accounts will be considered for eligibility.</li>
            <li>
              Rewards are open to verified members only – Every participant must complete verification before
              rewards can be claimed, ensuring that only genuine traders benefit from the program.
            </li>
            <li>Start today – every trade brings you closer to unlocking exclusive rewards.</li>
          </List>
        </SectionCard>

        <SectionHeaderRow>
          <SectionHeaderTitle>Your Trades. Your Rewards.</SectionHeaderTitle>
          <JoinNowButton type="button" onClick={() => setShowModal(true)}>
            Join Now
          </JoinNowButton>
        </SectionHeaderRow>

        <DetailCard>
          <DetailTop>
            <DetailPill>
              <DetailIcon src={LockIcon} alt="" />
              Unlocking Your Rewards
            </DetailPill>
          </DetailTop>
          <List>
            <li>
              Trade and accumulate lots through your linked account – Start trading actively using your account
              connected through our IB. Every trade you make counts toward your total lots, bringing
              you closer to unlocking exciting rewards.
            </li>
            <li>Track your lots and reward status in your dashboard.</li>
            <li>
              Upon reaching 100 lots, you automatically qualify for gift rewards – After completing the milestone,
              you can claim gift rewards directly through your rewards experience.
            </li>
            <li>Gifts you receive may include top bonus offers designed for your trading journey.</li>
          </List>
        </DetailCard>

        <BottomCta>
          <BottomText>Trade More. Earn More.</BottomText>
          <JoinNowButton type="button" onClick={() => setShowModal(true)}>
            Join Now
          </JoinNowButton>
        </BottomCta>

        <DetailCard>
          <DetailTop>
            <DetailPill>
              <DetailIcon src={DiceIcon} alt="" />
              Lucky Draw & Final Competition
            </DetailPill>
          </DetailTop>
          <List>
            <li>
              Step 1: Enter the Lucky Draw – Spend just $1 to enter the Lucky Draw. Winners are selected fairly
              and announced publicly, giving everyone an equal chance to win.
            </li>
            <li>
              Step 2: Advance to the Final Competition Round – Winners enter the final round where they compete to
              win bigger rewards.
            </li>
            <li>
              Step 3: Final Rewards – The final competition recognizes the best performance, and winners receive
              exclusive prizes.
            </li>
            <li>
              Your participation helps build a stronger community while driving meaningful trading momentum.
            </li>
          </List>
        </DetailCard>

        <BottomCta>
          <BottomText>Start Today. Win Tomorrow.</BottomText>
          <JoinNowButton type="button" onClick={() => setShowModal(true)}>
            Join Now
          </JoinNowButton>
        </BottomCta>

        <MiniCard>
          <RewardPointsHeading>
            LegendPips Reward Points
          </RewardPointsHeading>
          <List>
            <li>Earn points with every lot – redeem them for signals, education, and tools.</li>
            <li>Earn as You Trade – every lot you complete adds up to LegendPips Reward Points, making each trade more valuable beyond profits.</li>
            <li>Redeem your Points – use your accumulated points directly on our website to unlock exclusive bonuses.</li>
            <li>Watch & Earn again – premium trading signals can boost your point earnings.</li>
            <li>Referral Rewards – invite friends and earn points when they join.</li>
            <li>With LegendPips Reward Points, your trades don’t just move profits—they build rewards that fuel your growth.</li>
          </List>
        </MiniCard>

        <SectionHeaderRow style={{ marginTop: 6 }}>
          <SectionHeaderTitle>Start Trading. Unlock Rewards.</SectionHeaderTitle>
          <JoinNowButton type="button" onClick={() => setShowModal(true)}>
            Join Now
          </JoinNowButton>
        </SectionHeaderRow>

        <RulesOuter>
          <RuleBlock>
            <RuleHeader>
              <RulePill>Rules</RulePill>
              <RuleIconWrap>
                <RuleIcon src={ParticipationIcon} alt="" />
              </RuleIconWrap>
            </RuleHeader>
            <List>
              <li>Only participants with a linked account are eligible.</li>
              <li>All reward calculations are based on completed trade lots only.</li>
              <li>Rewards are subject to verification and eligibility checks.</li>
            </List>
          </RuleBlock>

          <RuleBlock>
            <RuleHeader>
              <RulePill>Competition Guidelines</RulePill>
              <RuleIconWrap>
                <RuleIcon src={DiceIcon} alt="" />
              </RuleIconWrap>
            </RuleHeader>
            <List>
              <li>Starting date is announced in advance on the platform.</li>
              <li>Each round has a fair winner selection method.</li>
              <li>Winners are picked based on performance metrics and total eligible points.</li>
            </List>
          </RuleBlock>

          <RuleBlock>
            <RuleHeader>
              <RulePill>Fair Play Policy</RulePill>
              <RuleIconWrap>
                <RuleIcon src={FairPlayIcon} alt="" />
              </RuleIconWrap>
            </RuleHeader>
            <List>
              <li>Any unfair activity may lead to disqualification.</li>
              <li>We reserve the right to review any suspicious activity.</li>
              <li>Honest trading is required to ensure a level playing field.</li>
            </List>
          </RuleBlock>
        </RulesOuter>

        <SectionCard>
          <p style={{ margin: 0, color: "#6b7280", fontSize: 12, lineHeight: 1.7 }}>
            We will remove any contestant found violating the spirit of fair competition: in general, any
            trading activity that would not succeed in a real-world trading environment will be considered
            unfair. This includes, for example, opening multiple accounts and placing similar but opposing
            trades as an individual or coordinated group.
          </p>
        </SectionCard>

        <SectionCard>
          <SectionHeaderTitle style={{ marginBottom: 10 }}>
            Why Choose LegendPips Service?
          </SectionHeaderTitle>
          <List>
            <li>
              Increased earning tools and verified rebates – our platform is built for trust and transparency.
            </li>
            <li>Trading community access – education, signals, and resources designed to help you improve.</li>
            <li>Exclusive opportunities – reward programs, premium signals, and special events.</li>
            <li>Performance-first mindset – track your progress and unlock benefits as you grow.</li>
          </List>
        </SectionCard>
      </Inner>
      <SubscriptionModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </Frame>
    </>
  );
};

export default RewardsPage;

