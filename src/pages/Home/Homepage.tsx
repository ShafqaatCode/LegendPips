import type React from "react";
import PromoBanner from "../../components/PromoBanner/PromoBanner";
import Signals from "../../components/Signals/Signals";
import FeaturesSlider from "../../components/FeatureSection/FeaturesSlider";

import BrokerSection from "../../components/Broker/BrokerSection";
import HowItWorks from "../../components/HItWorks/WorksSection";
import ChoosUs from "../../components/WhyChooseUs/WChooseUs";
import Testimonials from "../../components/Testimonials/Testimonials";

const HomePage: React.FC = () => {
    return (
        <>
        
        <PromoBanner />
        <FeaturesSlider />
        <BrokerSection />
        <HowItWorks />
        <Signals />
        <ChoosUs />
        <Testimonials />
        </>

    )

}

export default HomePage;