import type React from "react";
import PromoBanner from "../../components/PromoBanner/PromoBanner";
import Signals from "../../components/Signals/Signals";
import FeaturesSlider from "../../components/FeatureSection/FeaturesSlider";
import BrokerCard from "../../components/Broker/BrokerCard";

const HomePage: React.FC = () => {
    return (
        <>
        
        <PromoBanner />
        <FeaturesSlider />
        <Signals />
        <BrokerCard />
        </>

    )

}

export default HomePage;