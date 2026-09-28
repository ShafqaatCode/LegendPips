import type React from "react";
import PromoBanner from "../../components/PromoBanner/PromoBanner";

import FeaturesSlider from "../../components/FeatureSection/FeaturesSlider";

import BrokerSection from "../../components/Broker/BrokerSection";
import TopBeginnerBrokersWidget from "../../components/Broker/TopBeginnerBrokersWidget";
import HowItWorks from "../../components/HItWorks/WorksSection";
import ChoosUs from "../../components/WhyChooseUs/Choose";
import Testimonials from "../../components/Testimonials/Testimonials";
import WhatWeDoSection from "../../components/WhatWeDo/WhatWeDoSection";
import ContactAdviceSection from "../../components/Support/ContactAdviceSection";
import FAQ from "../../components/Faqs/Faqs";
import Tabs from "../../components/Signals/Tabs/Tabs";
import CommunitySection from "../../components/Community/CommunitySection";
import ContestSection from "../../components/ContestList/ContestSection";
import PaymentMethodsSection from "../../components/PaymentMethods/PaymentMethodsSection";
import CalculatorsSection from "../../components/Calculators/CalculatorsSection";
import ComplaintsSection from "../../components/Complaints/ComplaintsSection";
import HomeAlertPopup from "../../components/Alerts/HomeAlertPopup";
import HomeLiveForexCharts from "../../components/MarketCharts/HomeLiveForexCharts";

const HomePage: React.FC = () => {
  return (
    <>
      <HomeAlertPopup />
      <PromoBanner />
      <FeaturesSlider />
      <BrokerSection />
      <ContestSection />
      <TopBeginnerBrokersWidget variant="home" limit={5} />
      <HowItWorks />
      <CalculatorsSection />
      <HomeLiveForexCharts />
      <ComplaintsSection />
      <CommunitySection />
      <Tabs />
      <ChoosUs />
      <WhatWeDoSection />
      <ContactAdviceSection />
      <Testimonials />
      <PaymentMethodsSection />
      <FAQ />
    </>
  );
};

export default HomePage;
