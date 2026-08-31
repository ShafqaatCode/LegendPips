import type React from "react";
import PromoBanner from "../../components/PromoBanner/PromoBanner";

import FeaturesSlider from "../../components/FeatureSection/FeaturesSlider";

import BrokerSection from "../../components/Broker/BrokerSection";
import TopBeginnerBrokersWidget from "../../components/Broker/TopBeginnerBrokersWidget";
import styled from "styled-components";
import HowItWorks from "../../components/HItWorks/WorksSection";
import ChoosUs from "../../components/WhyChooseUs/Choose";
import Testimonials from "../../components/Testimonials/Testimonials";
import FAQ from "../../components/Faqs/Faqs";
import Tabs from "../../components/Signals/Tabs/Tabs";
import CommunitySection from "../../components/Community/CommunitySection";
import ContestSection from "../../components/ContestList/ContestSection";
import PaymentMethodsSection from "../../components/PaymentMethods/PaymentMethodsSection";
// import { UnderDevelopmentModal } from "../Home/UnderDevModel";
// import { useState } from "react";

const BeginnerBand = styled.section`
  padding: 1.5rem ${({ theme }) => theme.typography.pageGutter} 0.25rem;
  background: #eef1f6;
  display: flex;
  justify-content: center;
`;

const HomePage: React.FC = () => {
  // const [showModal, setShowModal] = useState(true);

    return (
        <>
            
            <PromoBanner />
            <FeaturesSlider />
            <BeginnerBand>
              <TopBeginnerBrokersWidget limit={5} />
            </BeginnerBand>
            <BrokerSection />
            <ContestSection />
            <HowItWorks />
            <CommunitySection />
            <Tabs />
            <ChoosUs />
            <Testimonials />
            <PaymentMethodsSection />
            <FAQ />
            {/* <UnderDevelopmentModal
                open={showModal}
                onClose={() => setShowModal(false)}
            /> */}


        </>

    )

}

export default HomePage;