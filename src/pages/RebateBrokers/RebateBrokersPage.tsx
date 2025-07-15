import React from "react";

import styled from "styled-components";

import RebatesBrokersSection from "./RebateBrokerBanner";
import AllBrokersList from "../../components/Broker/AllBrokersList";

const SectionWrapper = styled.section``;

const RebateBrokers: React.FC = () => {
  return (
    <SectionWrapper>
      <RebatesBrokersSection />

      {/* <BrokerSection showAll={true} /> */}
      <AllBrokersList showAll={true} />
      
      {/* <BrokerSection showAll={true} /> */}
    </SectionWrapper>
  );
};

export default RebateBrokers;
