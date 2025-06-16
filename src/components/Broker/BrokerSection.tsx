import React from "react";
import BrokerCard from "./BrokerCard";
import ICLogo from "../../assets/icons/Ellipse 2.png";
import styled from "styled-components";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";
import ButtonBase from "../SharedComponents/Button";
import ArrowIcon from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 2.svg"

const BrokerSectionWrapper = styled.section`
display: flex;
flex-direction: column;
gap: 2rem;
padding: 1rem 0;
margin: 3rem 1rem;
`;

const BrokerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// Example array of broker data
const brokers = [
  {
    index: 1,
    featured: true,
    title: "IC Markets",
    description:
      "Connect with thousands of traders worldwide. Share insights, learn strategies, and grow together inside our thriving Forex community.",
    logoSrc: ICLogo,
    rating: 4,
    reviewsCount: "45k+",
  },
  {
    index: 2,
    featured: true,
    title: "IC Markets",
    description:
      "Connect with thousands of traders worldwide. Share insights, learn strategies, and grow together inside our thriving Forex community.",
    logoSrc: ICLogo,
    rating: 3,
    reviewsCount: "45k+",
  },
  {
    index: 3,
    featured: true,
    title: "IC Markets",
    description:
      "Connect with thousands of traders worldwide. Share insights, learn strategies, and grow together inside our thriving Forex community.",
    logoSrc: ICLogo,
    rating: 4,
    reviewsCount: "45k+",
  },
  // Add as many cards as needed here
];

const ButtonContainer = styled.div`
display:flex;
justify-content: center;


`

const BrokerSection: React.FC = () => {
  return (
    <BrokerSectionWrapper>
      <SectionHeadingSet
        upperText="All in one Trading Platform"
        mainHeading="Top Forex Brokers"
        subText="Find the best brokers carefully compared & reviewed for your trading needs. Trade confidently with secure platforms."
      />
      <BrokerWrapper>
        {brokers.map((broker, idx) => (
          <BrokerCard key={idx} {...broker} />
        ))}
      </BrokerWrapper>
      <ButtonContainer>
        <ButtonBase  bgColor="transparent"
        color="#132E58"
        borderColor="#132E58"
        padding="1rem 2.5rem"
        fontSize="1.1rem" >View All Brokers <img src={ArrowIcon} alt="icon" /></ButtonBase>
      </ButtonContainer>
    </BrokerSectionWrapper>
  );
};

export default BrokerSection;
