import React from "react";
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
// import ArrowIcon from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg";
import styled from "styled-components";

export const Description = styled.p`
  font-size: 16px;
  color: rgba(15, 23, 42, 0.8);
  margin: 0;
  // border: 2px solid red;
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
  margin: auto;

  h4 {
    font-size: 16px;
    font-weight: 500;
  }

  p {
    font-size: 14px;
    font-weight: 300;
    // text-align: center;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    flex-wrap: wrap;
    gap: 2rem;
    text-align: center;
  }

  @media (max-width: 768px) {
    // text-align: left;
    // flex-direction: column;
    justify-content: center;
    gap: 1rem;
  }
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
  description: string;
  logoSrc: string;
  rating: number;
  reviewsCount: string;
}

const BrokerCard: React.FC<BrokerCardProps> = ({
  index,
  featured,
  title,
  description,
  logoSrc,
  rating,
  reviewsCount,
}) => {
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
            <Description>

              <div>
                <h4>Standard Account</h4>
                <p>Up to 0.5 pips</p>
              </div>
              <div>
                <h4>Raw Account</h4>
                <p>Up to 0.3 pips</p>
              </div>
              <div>
                <h4>CTrader</h4>
                <p>Up to 0.2 pips</p>
              </div>

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
            <PrimaryButton>
              View Details <img src={ArrowIcon} alt="Arrow" />
            </PrimaryButton>
            <SecondaryButton>Broker Reviews</SecondaryButton>
          </ActionSection>


        </CardContainer>
      </SlideFadeSection>
    </Container>

  );
};

export default BrokerCard;
