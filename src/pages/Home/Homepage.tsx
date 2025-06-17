import type React from "react";
import PromoBanner from "../../components/PromoBanner/PromoBanner";

import FeaturesSlider from "../../components/FeatureSection/FeaturesSlider";

import BrokerSection from "../../components/Broker/BrokerSection";
import HowItWorks from "../../components/HItWorks/WorksSection";
import ChoosUs from "../../components/WhyChooseUs/WChooseUs";
import Testimonials from "../../components/Testimonials/Testimonials";
import FAQ from "../../components/Faqs/Faqs";
import Tabs from "../../components/Signals/Tabs/Tabs";



const HomePage: React.FC = () => {


    return (
        <>

            <PromoBanner />
            <FeaturesSlider />
            <BrokerSection />
            <HowItWorks />

            <Tabs />
            <ChoosUs />
            <Testimonials />
            <FAQ />
        </>

    )

}

export default HomePage;