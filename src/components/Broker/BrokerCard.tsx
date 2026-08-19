import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CardContainer,
  LogoSection,
  LogoImg,
  InfoSection,
  TitleRow,
  VerifiedBadge,
  Description,
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
import CompareToggle from "./CompareToggle";


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
  description: string;
  brokerId?: string;
  logoSrc: string;
  rating: number;
  reviewsCount: string;
}

const BrokerCard: React.FC<BrokerCardProps> = ({
  index,
  featured,
  title,
  description,
  brokerId,
  logoSrc,
  rating,
  reviewsCount,
}) => {
  const navigate = useNavigate();
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
            <Description>{description}</Description>
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
              <SecondaryButton as={Link} to={`/rebates/broker/${brokerId}#reviews`}>
                Broker Reviews
              </SecondaryButton>
            ) : (
              <SecondaryButton as="span" style={{ opacity: 0.55, cursor: "not-allowed", pointerEvents: "none" }}>
                Broker Reviews
              </SecondaryButton>
            )}
            <CompareToggle brokerId={brokerId} />
          </ActionSection>
        </CardContainer>
      </SlideFadeSection>
    </Container>

  );
};

export default BrokerCard;
