import React from "react";
import styled from "styled-components";

import CashIcon from "../../assets/icons/cashback.svg";
import GiftIcon from "../../assets/icons/badge2.svg";
import Flag3 from "../../assets/FlagIcons/Rectangle 34625471-2.png";
import Flag4 from "../../assets/FlagIcons/Rectangle 34625472-2.png";

type Reward = {
  id: string;
  title: string;
  iconSrc: string;
  detailText: string;
};

const Section = styled.section`
  padding: 14px 12px 30px;
  background: transparent;
`;

const Inner = styled.div`
  max-width: 1040px;
  margin: 0 auto;
`;

const TopLabel = styled.div`
  display: inline-flex;
  align-items: center;
  background: #fbbf24;
  color: #132e58;
  font-weight: 900;
  padding: 8px 14px;
  border-radius: 8px;
  margin: 4px 0 14px;
  font-size: 13px;
`;

const SmallGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const SmallCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 16px 12px;
  min-height: 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const SmallIcon = styled.img`
  width: 34px;
  height: 34px;
  object-fit: contain;
`;

const SmallTitle = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: #132e58;
  text-align: center;
`;

const DetailsGrid = styled.div`
  margin-top: 22px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const DetailCard = styled.div`
  background: white;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 16px 14px 18px;
`;

const DetailHeader = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #fbbf24;
  color: #132e58;
  font-weight: 900;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 10px;
`;

const DetailIcon = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
`;

const DetailText = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: #6b7280;
`;

interface RewardsCardsProps {
  onJoinNow?: () => void;
}

const RewardsCards: React.FC<RewardsCardsProps> = ({ onJoinNow }) => {
  // Not used for now, but kept so the parent can hook it later (e.g., CTA inside rewards).
  void onJoinNow;
  const rewards: Reward[] = [
    {
      id: "cash",
      title: "Cash Rewards",
      iconSrc: CashIcon,
      detailText:
        "Earn cash rewards on your everyday trades with supported brokers. Enjoy transparent earnings with no hidden fees—just real rewards that grow with every move you make.",
    },
    {
      id: "gift",
      title: "Gift Rewards",
      iconSrc: GiftIcon,
      detailText:
        "Unlock bonus gift rewards and exclusive offers designed to upgrade your trading experience. Expect special drops and tailored bonuses that keep momentum high.",
    },
    {
      id: "international",
      title: "International Tours",
      iconSrc: Flag3,
      detailText:
        "Explore international promotions and event-driven reward drops. Discover new opportunities and participate in global experiences designed to celebrate great trading.",
    },
    {
      id: "national",
      title: "National Tours",
      iconSrc: Flag4,
      detailText:
        "Rewards designed for local engagement—join community events, unlock exciting bonuses, and be part of trading experiences crafted for your region.",
    },
  ];

  return (
    <Section>
      <Inner>
        <TopLabel>Exclusive Rewards</TopLabel>

        <SmallGrid>
          {rewards.map((r) => (
            <SmallCard key={r.id}>
              <SmallIcon src={r.iconSrc} alt={`${r.title} icon`} />
              <SmallTitle>{r.title}</SmallTitle>
            </SmallCard>
          ))}
        </SmallGrid>

        <DetailsGrid>
          {rewards.map((r) => (
            <DetailCard key={`${r.id}-detail`}>
              <DetailHeader>
                <DetailIcon src={r.iconSrc} alt={`${r.title} icon`} />
                {r.title}
              </DetailHeader>
              <DetailText>{r.detailText}</DetailText>
            </DetailCard>
          ))}
        </DetailsGrid>
      </Inner>
    </Section>
  );
};

export default RewardsCards;

