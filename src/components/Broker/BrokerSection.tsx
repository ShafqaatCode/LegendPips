import React from "react";
import BrokerCard from "./BrokerCard";
import ICLogo from "../../assets/icons/Ellipse 2.png";
import styled from "styled-components";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";

const BrokerSectionWrapper = styled.section`
  padding: 3rem 0;
`;

const BrokerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
    </BrokerSectionWrapper>
  );
};

export default BrokerSection;
