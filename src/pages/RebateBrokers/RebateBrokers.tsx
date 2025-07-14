import React from "react";
import Banner from "../../components/Banner/Banner";
import bannerImg from "../../assets/banner/BannerBg.jpg";
import styled from "styled-components";
import BrokerSection from "../../components/Broker/BrokerSection";

const SectionWrapper = styled.section``;

const RebateBrokers: React.FC = () => {
  return (
    <SectionWrapper>
      <BrokerSection showAll={true} />
    </SectionWrapper>
  );
};

export default RebateBrokers;
