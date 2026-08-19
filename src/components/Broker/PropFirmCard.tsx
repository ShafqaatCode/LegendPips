import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaStar } from "react-icons/fa";
import {
  CardContainer,
  LogoSection,
  LogoImg,
  InfoSection,
  TitleRow,
  VerifiedBadge,
  RatingBox,
  StarRow,
  ReviewText,
  ActionSection,
  PrimaryButton,
  TermsText,
  Container,
} from "./BrokerCard.styles";
import type { PropCashbackOffer } from "../../services/brokerService";
import { formatPropCardSummary, formatPropRatingLabel } from "../../utils/propTradingDisplay";
import CompareToggle from "./CompareToggle";

interface PropFirmCardProps {
  title: string;
  brokerId?: string;
  logoSrc: string;
  rating: number;
  reviewsCount: string;
  propOffers: PropCashbackOffer[];
  setupUrl?: string;
}

const PropFirmCard: React.FC<PropFirmCardProps> = ({
  title,
  brokerId,
  logoSrc,
  rating,
  reviewsCount,
  propOffers,
  setupUrl,
}) => {
  const navigate = useNavigate();
  const summary = formatPropCardSummary(propOffers);
  const extras = [
    ...new Set(
      propOffers.flatMap((o) =>
        [o.evaluationType, o.profitSplit, o.accountSize].filter((x): x is string => Boolean(x))
      )
    ),
  ];

  const openAccount = () => {
    if (brokerId) {
      navigate(`/rebates/broker/${brokerId}?setup=1`);
      return;
    }
    if (setupUrl?.trim()) {
      window.open(setupUrl.trim(), "_blank", "noopener,noreferrer");
    }
  };

  const moreInfo = () => {
    if (brokerId) navigate(`/rebates/broker/${brokerId}`);
  };

  return (
    <Container>
      <CardContainer>
        <LogoSection>
          <LogoImg src={logoSrc} alt={`${title} logo`} />
        </LogoSection>

        <InfoSection>
          <TitleRow>
            <h2>{title}</h2>
            <VerifiedBadge>✔ Prop Firm</VerifiedBadge>
          </TitleRow>
          <CashbackBlock>
            <CashbackLabel>Cashback</CashbackLabel>
            <CashbackValue>{summary}</CashbackValue>
          </CashbackBlock>
          {extras.length > 0 && <MetaLine>{extras.join(" · ")}</MetaLine>}
        </InfoSection>

        <RatingBox>
          <StarRow>
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} color={i < rating ? "#FBAF00" : "#d1d5db"} />
            ))}
          </StarRow>
          <ReviewText>
            <strong>{reviewsCount}</strong>
            <span>{formatPropRatingLabel(rating, reviewsCount)}</span>
          </ReviewText>
        </RatingBox>

        <ActionSection>
          <TermsText>Terms & Conditions Apply</TermsText>
          <OutlineBtn type="button" onClick={moreInfo} disabled={!brokerId}>
            More Information
          </OutlineBtn>
          <PrimaryButton
            type="button"
            onClick={openAccount}
            disabled={!brokerId && !setupUrl}
          >
            Open Account
          </PrimaryButton>
          <CompareToggle brokerId={brokerId} />
        </ActionSection>
      </CardContainer>
    </Container>
  );
};

export default PropFirmCard;

const CashbackBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem 0.5rem;
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.5;
`;

const CashbackLabel = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const CashbackValue = styled.span`
  color: rgba(15, 23, 42, 0.78);
  font-weight: 500;
`;

const MetaLine = styled.p`
  margin: 0.35rem 0 0;
  font-size: 0.75rem;
  color: #64748b;
  text-transform: capitalize;
`;

const OutlineBtn = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  max-width: 9.5rem;
  margin: 0 auto;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(19, 46, 88, 0.06);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
