import type React from "react";
import PromoBanner from "../../components/PromoBanner/PromoBanner";
import Signals from "../../components/Signals/Signals";
import FeaturesSlider from "../../components/FeatureSection/FeaturesSlider";

import BrokerSection from "../../components/Broker/BrokerSection";
import HowItWorks from "../../components/HItWorks/WorksSection";

const HomePage: React.FC = () => {
    return (
        <>
        
        <PromoBanner />
        <FeaturesSlider />
        <BrokerSection />
        <Signals />
        <HowItWorks />
        </>

    )

}

export default HomePage;