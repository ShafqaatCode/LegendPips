import React from 'react'
import Banner from '../../components/Banner/Banner'
import bannerImg from "../../assets/banner/BannerBg.jpg";
import LegendPipsFeatures from '../../components/PipsFeatures/PipsFeatureSection';
import HowItWorks from '../../components/HItWorks/WorksSection';
import RegisterModal from '../Register/Register';
import LoginForm from '../Login/Login';
import WhyChooseUs from '../../components/WhyChooseUs/Choose';
import FeaturesSlider from '../../components/FeatureSection/FeaturesSlider';



const HitWorksPage: React.FC = () => {
  return (



    // <Banner
    //   backgroundImage={bannerImg}
    //   title="HOW IT WORKS"
    //   breadcrumb="Home > Pages > How-It-works"
    // />
    <>
    {/* <Banner upperText='PLATEFORM FOR TRADERS' subText='How it works' bannerHeading='How it works' /> */}
    {/* <div style={{ height: " 110px" }}>

    </div> */}
     <Banner
        backgroundImage={bannerImg}
        bannerHeading="Earning from every trade has never been this simple." upperText="all in one Trading plateform" subText="Legend Pips gives you cashback for your trades without changing your broker. Plus, you get tools, signals, and protection—built to help you grow."
      />
    <FeaturesSlider />
    <HowItWorks />
    <RegisterModal />
    <LegendPipsFeatures />
    <LoginForm />
    <WhyChooseUs />

    </>
  )
}

export default HitWorksPage;