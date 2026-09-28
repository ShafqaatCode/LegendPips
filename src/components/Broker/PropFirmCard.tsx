import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaStar } from "react-icons/fa";
import { FiCopy, FiCheck } from "react-icons/fi";
import {
  CardContainer,
  LogoSection,
  InfoSection,
  TitleRow,
  VerifiedBadge,
  DisabledBadge,
  RatingBox,
  StarRow,
  ReviewText,
  ActionSection,
  PrimaryButton,
  SecondaryButton,
  TermsText,
  Container,
} from "./BrokerCard.styles";
import type { PropCashbackOffer, PropPromoCode } from "../../services/brokerService";
import {
  copyTextToClipboard,
  formatPropRatingLabel,
  resolvePropDiscount,
} from "../../utils/propTradingDisplay";
import CompareToggle from "./CompareToggle";
import BrokerLogo from "./BrokerLogo";

const CardLogo = styled(BrokerLogo)`
  height: 64px;
  width: 64px;
  border-radius: 50%;
  background-color: #fff;
  object-fit: contain;
  object-position: center;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #eef0f4;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);

  @media (max-width: 768px) {
    height: 72px;
    width: 72px;
  }
`;

interface PropFirmCardProps {
  title: string;
  brokerId?: string;
  logoSrc: string;
  rating: number;
  reviewsCount: string;
  propOffers: PropCashbackOffer[];
  propPromoCodes?: PropPromoCode[];
  setupUrl?: string;
  temporarilyDisabled?: boolean;
}

const PropFirmCard: React.FC<PropFirmCardProps> = ({
  title,
  brokerId,
  logoSrc,
  rating,
  reviewsCount,
  propOffers,
  propPromoCodes,
  setupUrl,
  temporarilyDisabled,
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const deal = resolvePropDiscount(propOffers, propPromoCodes);

  const startChallenge = () => {
    if (temporarilyDisabled) return;
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

  const onCopy = async () => {
    if (!deal.code) return;
    const ok = await copyTextToClipboard(deal.code);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <Container>
      <CardContainer>
        <LogoSection>
          <CardLogo src={logoSrc} name={title} alt={`${title} logo`} />
        </LogoSection>

        <InfoSection>
          <TitleRow>
            <h2>{title}</h2>
            {temporarilyDisabled ? (
              <DisabledBadge>Disabled</DisabledBadge>
            ) : (
              <VerifiedBadge>✔ Prop Firm</VerifiedBadge>
            )}
          </TitleRow>

          <CashbackRow>
            <CashLabel>Cashback</CashLabel>
            <CashLines>
              {deal.firstPurchase || deal.repeatPurchase ? (
                <>
                  {deal.firstPurchase && (
                    <span>
                      First: <b>{deal.firstPurchase}</b>
                    </span>
                  )}
                  {deal.repeatPurchase && (
                    <span>
                      Repeat: <b>{deal.repeatPurchase}</b>
                    </span>
                  )}
                </>
              ) : (
                <span>See details for rates</span>
              )}
            </CashLines>
          </CashbackRow>

          {(deal.discountPercent || deal.code) && (
            <PromoRow>
              {deal.discountPercent && (
                <OffBadge>{deal.discountPercent.replace(/\s*off$/i, "")} OFF</OffBadge>
              )}
              {deal.code && (
                <CodeBtn type="button" onClick={onCopy} title="Copy discount code">
                  <span>{copied ? "Copied" : deal.code}</span>
                  {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
                </CodeBtn>
              )}
            </PromoRow>
          )}
        </InfoSection>

        <RatingBox>
          <StarRow>
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} color={i < rating ? "#FBAF00" : "#ccc"} />
            ))}
          </StarRow>
          <ReviewText>
            <strong>{reviewsCount}</strong>
            <span>{formatPropRatingLabel(rating, reviewsCount)}</span>
          </ReviewText>
        </RatingBox>

        <ActionSection>
          <TermsText>
            {temporarilyDisabled ? "Temporarily unavailable for new setups" : "Terms & Conditions Apply"}
          </TermsText>
          <PrimaryButton
            type="button"
            onClick={startChallenge}
            disabled={temporarilyDisabled || (!brokerId && !setupUrl)}
          >
            {temporarilyDisabled ? "Disabled" : "Start Challenge"}
          </PrimaryButton>
          <SecondaryButton as="button" type="button" onClick={moreInfo} disabled={!brokerId}>
            More Information
          </SecondaryButton>
          <CompareToggle brokerId={brokerId} />
        </ActionSection>
      </CardContainer>
    </Container>
  );
};

export default PropFirmCard;

const CashbackRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem 0.55rem;
  margin-bottom: 0.35rem;
`;

const CashLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: #132e58;
`;

const CashLines = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.75rem;
  font-size: 0.78rem;
  color: rgba(15, 23, 42, 0.72);

  b {
    color: #0f1c46;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
  }
`;

const PromoRow = styled.div`
  display: inline-flex;
  align-items: stretch;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  max-width: 100%;

  @media (max-width: 768px) {
    margin: 0 auto;
  }
`;

const OffBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.28rem 0.5rem;
  background: #fbbf24;
  color: #132e58;
  font-weight: 800;
  font-size: 0.68rem;
  white-space: nowrap;
`;

const CodeBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border: 0;
  background: #f8fafc;
  color: #132e58;
  padding: 0.28rem 0.55rem;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  cursor: pointer;

  &:hover {
    background: #eef2ff;
    color: #1d4ed8;
  }
`;
