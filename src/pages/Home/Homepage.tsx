import type React from "react";
import PromoBanner from "../../components/PromoBanner/PromoBanner";

import FeaturesSlider from "../../components/FeatureSection/FeaturesSlider";

import BrokerSection from "../../components/Broker/BrokerSection";
import TopBeginnerBrokersWidget from "../../components/Broker/TopBeginnerBrokersWidget";
import HowItWorks from "../../components/HItWorks/WorksSection";
import ChoosUs from "../../components/WhyChooseUs/Choose";
import Testimonials from "../../components/Testimonials/Testimonials";
import FAQ from "../../components/Faqs/Faqs";
import Tabs from "../../components/Signals/Tabs/Tabs";
import CommunitySection from "../../components/Community/CommunitySection";
import ContestSection from "../../components/ContestList/ContestSection";
import PaymentMethodsSection from "../../components/PaymentMethods/PaymentMethodsSection";

const HomePage: React.FC = () => {
  return (
    <>
      <PromoBanner />
      <FeaturesSlider />
      <BrokerSection />
      <ContestSection />
      <HowItWorks />
      <CommunitySection />
      <Tabs />
      <ChoosUs />
      <Testimonials />
      <TopBeginnerBrokersWidget variant="home" limit={5} />
      <PaymentMethodsSection />
      <FAQ />
    </>
  );
};

export default HomePage;
