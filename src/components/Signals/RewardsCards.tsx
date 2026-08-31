import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { REWARD_LIST } from "../../data/rewardsDetails";

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

const SmallCard = styled(Link)`
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
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: rgba(251, 191, 36, 0.65);
    transform: translateY(-2px);
    box-shadow: 0 10px 22px rgba(19, 46, 88, 0.08);
  }
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

const DetailCard = styled(Link)`
  background: white;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 16px 14px 18px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  display: block;
  transition: border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: rgba(251, 191, 36, 0.65);
    transform: translateY(-2px);
    box-shadow: 0 10px 22px rgba(19, 46, 88, 0.08);
  }
`;

const DetailCta = styled.span`
  display: inline-flex;
  margin-top: 10px;
  font-size: 11px;
  font-weight: 800;
  color: #132e58;
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
  const rewards = REWARD_LIST;

  return (
    <Section>
      <Inner>
        <TopLabel>Exclusive Rewards</TopLabel>

        <SmallGrid>
          {rewards.map((r) => (
            <SmallCard key={r.id} to={`/rewards/${r.id}`}>
              <SmallIcon src={r.iconSrc} alt={`${r.title} icon`} />
              <SmallTitle>{r.title}</SmallTitle>
            </SmallCard>
          ))}
        </SmallGrid>

        <DetailsGrid>
          {rewards.map((r) => (
            <DetailCard key={`${r.id}-detail`} to={`/rewards/${r.id}`}>
              <DetailHeader>
                <DetailIcon src={r.iconSrc} alt={`${r.title} icon`} />
                {r.title}
              </DetailHeader>
              <DetailText>{r.teaser}</DetailText>
              <DetailCta>View full details →</DetailCta>
            </DetailCard>
          ))}
        </DetailsGrid>
      </Inner>
    </Section>
  );
};

export default RewardsCards;

