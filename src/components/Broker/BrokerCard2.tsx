import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CardContainer,
  LogoSection,
  LogoImg,
  InfoSection,
  TitleRow,
  VerifiedBadge,
  FeaturedRibbon,
  RatingBox,
  StarRow,
  ReviewText,
  ActionSection,
  PrimaryButton,
  SecondaryButton,
  TermsText,
  TopIndex,
  Container,
} from "./BrokerCard.styles";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import ArrowIcon from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg";
import styled from "styled-components";

export const Description = styled.div`
  font-size: 0.8125rem;
  line-height: 1.5;
  color: rgba(15, 23, 42, 0.72);
  margin: 0;
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  row-gap: 0.65rem;

  h4 {
    font-size: 0.75rem;
    font-weight: 600;
    margin: 0 0 0.15rem 0;
    color: #0f1c46;
  }

  p {
    font-size: 0.7rem;
    font-weight: 400;
    margin: 0;
    color: rgba(15, 23, 42, 0.65);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    justify-content: center;
    gap: 1rem;
    text-align: center;
  }

  @media (max-width: 768px) {
    justify-content: center;
    gap: 0.75rem;
  }
`;

const BodyBlurb = styled.p`
  font-size: 0.8125rem;
  line-height: 1.5;
  color: rgba(15, 23, 42, 0.75);
  margin: 0 0 0.6rem 0;
  width: 100%;
  max-width: 36rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;



//animation varient
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

const SlideFadeSection = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

interface BrokerCardProps {
  index: number;
  featured?: boolean;
  title: string;
  description?: string;
  brokerId?: string;
  logoSrc: string;
  rating: number;
  reviewsCount: string;
  accountTypes?: Array<{
    name: string;
    spreadFrom?: string;
    minDeposit?: string;
    commission?: string;
  }>;
}

const DEFAULT_REBATE_ACCOUNT_ROWS = [
  { name: "Standard Account", spreadFrom: "Up to 0.5 pips" },
  { name: "Raw Account", spreadFrom: "Up to 0.3 pips" },
  { name: "CTrader", spreadFrom: "Up to 0.2 pips" },
];

const BrokerCard: React.FC<BrokerCardProps> = ({
  index,
  featured,
  title,
  description,
  brokerId,
  logoSrc,
  rating,
  reviewsCount,
  accountTypes,
}) => {
  const navigate = useNavigate();
  const accountRows =
    accountTypes && accountTypes.length > 0
      ? accountTypes.slice(0, 3).map((a) => ({
          name: a.name,
          detail: a.spreadFrom || a.minDeposit || a.commission || "—",
        }))
      : DEFAULT_REBATE_ACCOUNT_ROWS.map((a) => ({ name: a.name, detail: a.spreadFrom }));
  return (
    <Container>
      <SlideFadeSection>
        <CardContainer>
          {featured && <FeaturedRibbon>Featured</FeaturedRibbon>}
          <TopIndex>{index}</TopIndex>

          <LogoSection>
            <LogoImg src={logoSrc} alt={`${title} Logo`} />
          </LogoSection>

          <InfoSection>
            <TitleRow>
              <h2>{title}</h2>
              <VerifiedBadge>✔ Verified Broker</VerifiedBadge>
            </TitleRow>
            {description?.trim() ? <BodyBlurb>{description.trim()}</BodyBlurb> : null}
            <Description>
              {accountRows.map((row, i) => (
                <div key={`${row.name}-${i}`}>
                  <h4>{row.name}</h4>
                  <p>{row.detail}</p>
                </div>
              ))}
            </Description>
          </InfoSection>

          <RatingBox>
            <StarRow>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} color={i < rating ? "#FBAF00" : "#ccc"} />
              ))}
            </StarRow>
            <ReviewText>
              <strong>{reviewsCount}</strong>
              <span>Customer Reviews</span>
            </ReviewText>
          </RatingBox>
           <ActionSection>
            <TermsText>Terms & Conditions Apply</TermsText>
            <PrimaryButton
              type="button"
              disabled={!brokerId}
              onClick={() => brokerId && navigate(`/rebates/broker/${brokerId}`)}
              style={!brokerId ? { opacity: 0.55, cursor: "not-allowed" } : undefined}
            >
              View Details <img src={ArrowIcon} alt="Arrow" />
            </PrimaryButton>
            {brokerId ? (
              <SecondaryButton as={Link} to={`/rebates/broker/${brokerId}`}>
                Broker Reviews
              </SecondaryButton>
            ) : (
              <SecondaryButton as="span" style={{ opacity: 0.55, cursor: "not-allowed", pointerEvents: "none" }}>
                Broker Reviews
              </SecondaryButton>
            )}
          </ActionSection>


        </CardContainer>
      </SlideFadeSection>
    </Container>

  );
};

export default BrokerCard;
