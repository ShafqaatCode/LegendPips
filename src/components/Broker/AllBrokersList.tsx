import React from "react";

import styled from "styled-components";

import ButtonBase from "../SharedComponents/Button";
import ArrowIcon from "../../assets/arrow-narrow-circle-broken-up-right-blue.png";
import { brokers_data } from "../../data/brokers_data";



import { Link } from "react-router-dom";
import BrokerCard2 from "./BrokerCard2";

const BrokerSectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 0;
  margin: 3rem 1rem;
  /* border: 2px solid red; */
`;

const BrokerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

interface props {
  showAll?: boolean;
}

const AllBrokersList: React.FC<props> = ({ showAll = false }) => {
  const visiableBrokers = showAll ? brokers_data : brokers_data.slice(0, 5);

  
  return (
    <BrokerSectionWrapper>
      {/* <SectionHeadingSet
        upperText="All in one Trading Platform"
        mainHeading="Top Forex Brokers"
        subText="Find the best brokers carefully compared & reviewed for your trading needs. Trade confidently with secure platforms."
      /> */}
      <BrokerWrapper>
        {visiableBrokers.map((broker, idx) => (
          <BrokerCard2 key={idx} {...broker} />
        ))}
      </BrokerWrapper>
      {!showAll && (
        <ButtonContainer>
          <Link to={"/rebates"} style={{ textDecoration: "none" }}>
            <ButtonBase
              bgColor="transparent"
              color="#132E58"
              borderColor="#132E58"
              padding="1rem 2.5rem"
              fontSize="1.2rem"
              fontWeight="600"
             
            >
              View All Brokers <img src={ArrowIcon} alt="icon" />
            </ButtonBase>
          </Link>
        </ButtonContainer>
      )}
    </BrokerSectionWrapper>
  );
};

export default AllBrokersList;
