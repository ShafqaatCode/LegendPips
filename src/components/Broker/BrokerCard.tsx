import React from "react";
import {
  CardContainer,
  LogoSection,
  LogoImg,
  InfoSection,
  TitleRow,
  VerifiedBadge,
  Description,
//   Badge,s
  RatingBox,
  StarRow,
  ReviewCount,
  ActionSection,
  PrimaryButton,
  SecondaryLink,
  TopRibbon,
} from "../Broker/Broker.styles";

import Logo from "../../assets/icons/icmarkets-logo.png"; // Replace with actual logo
import { FaArrowRight, FaStar } from "react-icons/fa";

const BrokerCard = () => {
  return (
    <CardContainer>
      <TopRibbon>Featured</TopRibbon>

      <LogoSection>
        <LogoImg src={Logo} alt="IC Markets Logo" />
      </LogoSection>

      <InfoSection>
        <TitleRow>
          <h2>IC Market</h2>
          <VerifiedBadge>✔ Verified Broker</VerifiedBadge>
        </TitleRow>

        <Description>
          Connect with thousands of traders worldwide. Share insights, learn
          strategies, and grow together inside our thriving Forex community.
        </Description>
      </InfoSection>

      <RatingBox>
        <StarRow>
          {[...Array(4)].map((_, i) => (
            <FaStar key={i} color="#FFA500" />
          ))}
          <FaStar color="#ccc" />
        </StarRow>
        <ReviewCount>45k+ <br /> <span>Customer Reviews</span></ReviewCount>
      </RatingBox>

      <ActionSection>
        <span className="terms">Terms & Conditions Apply</span>
        <PrimaryButton>
          View Details <FaArrowRight />
        </PrimaryButton>
        <SecondaryLink>
          Broker Reviews <FaArrowRight />
        </SecondaryLink>
      </ActionSection>
    </CardContainer>
  );
};

export default BrokerCard;
