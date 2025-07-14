import React from "react";
import Banner from "../../components/Banner/Banner";
import BrokerSection from "../../components/Broker/BrokerSection";

import styled from "styled-components";

import RebatesBrokersSection from "./RebateBrokerBanner";

const SectionWrapper = styled.section``;

const RebateBrokers: React.FC = () => {
  return (
    <SectionWrapper>
      <RebatesBrokersSection />
      
      <BrokerSection showAll={true} />
      
    </SectionWrapper>
  );
};

export default RebateBrokers;
