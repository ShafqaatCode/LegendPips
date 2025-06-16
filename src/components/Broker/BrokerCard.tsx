import React from "react";
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
} from "./BrokerCard.styles";
import { FaStar } from "react-icons/fa";
import ArrowIcon from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg";

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
        <PrimaryButton>
          View Details <img src={ArrowIcon} alt="Arrow" />
        </PrimaryButton>
        <SecondaryButton>Broker Reviews</SecondaryButton>
      </ActionSection>
    </CardContainer>
  );
};

export default BrokerCard;
