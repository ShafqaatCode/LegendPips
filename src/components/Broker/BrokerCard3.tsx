import React from "react";
import {
  CardContainer,
  LogoSection,
  InfoSection,
  TitleRow,
  VerifiedBadge,
  DisabledBadge,
  FeaturedRibbon,
 
  ActionSection,
  PrimaryButton,
  SecondaryButton,
  TermsText,
  TopIndex,
  Container,
} from "./BrokerCard3.styles";

import { motion } from "framer-motion";
import ArrowIcon from "../../assets/icons/blueCircle.svg";
import styled from "styled-components";
import BrokerLogo from "./BrokerLogo";

const CardLogo = styled(BrokerLogo)`
  height: 140px;
  width: 140px;
  border-radius: 50%;
  background-color: #fff;
  object-fit: contain;
  object-position: center;
  padding: 18px;
  box-sizing: border-box;
  border: 1px solid #eef0f4;

  @media (max-width: 768px) {
    height: 100px;
    width: 100px;
    padding: 12px;
  }
`;

export const Description = styled.p`
  font-size: 16px;
  color: rgba(15, 23, 42, 0.8);
  margin: 0;
  // border: 2px solid red;
  display: flex;
  /* justify-content: space-between; */
  gap: 4rem;
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
  description?: string;
  logoSrc: string;
  rating?: number;
  reviewsCount?: string;
  features: { name: string; value: string }[];
  temporarilyDisabled?: boolean;
}

const BrokerCard: React.FC<BrokerCardProps> = ({
  index,
  featured,
  title,
  logoSrc,
  features,
  temporarilyDisabled,
}) => {
  return (
    <Container>
      <SlideFadeSection>
        <CardContainer>
          {featured && <FeaturedRibbon>Featured</FeaturedRibbon>}
          <TopIndex>{index}</TopIndex>

          <LogoSection>
            <CardLogo src={logoSrc} name={title} alt={`${title} Logo`} />
          </LogoSection>

          <InfoSection>
            <TitleRow>
              <h2>{title}</h2>
              {temporarilyDisabled ? (
                <DisabledBadge>Disabled</DisabledBadge>
              ) : (
                <VerifiedBadge>✔ Verified Broker</VerifiedBadge>
              )}
            </TitleRow>
            <Description>

              {features.map((feature, idx) => (
                <div key={idx}>
                  <h4>{feature.name}</h4>
                  <p>{feature.value}</p>
                </div>
              ))}

            </Description>
          </InfoSection>

         
           <ActionSection>
            <TermsText>
              {temporarilyDisabled ? "Temporarily unavailable for new setups" : "Terms & Conditions Apply"}
            </TermsText>
            <PrimaryButton disabled={temporarilyDisabled} style={temporarilyDisabled ? { opacity: 0.55, cursor: "not-allowed" } : undefined}>
              {temporarilyDisabled ? "Disabled" : "Setup Account"}
            </PrimaryButton>
            <SecondaryButton>Broker Reviews <img src={ArrowIcon} alt="Arrow" /></SecondaryButton>
          </ActionSection>


        </CardContainer>
      </SlideFadeSection>
    </Container>

  );
};

export default BrokerCard;
