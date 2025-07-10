import React from 'react'
import Banner from '../../components/Banner/Banner'
import bannerImg from "../../assets/banner/BannerBg.jpg";
import LegendPipsFeatures from '../../components/PipsFeatures/PipsFeatureSection';
import HowItWorks from '../../components/HItWorks/WorksSection';



const HitWorksPage: React.FC = () => {
  return (



    // <Banner
    //   backgroundImage={bannerImg}
    //   title="HOW IT WORKS"
    //   breadcrumb="Home > Pages > How-It-works"
    // />
    <>
    {/* <Banner upperText='PLATEFORM FOR TRADERS' subText='How it works' bannerHeading='How it works' /> */}
    <div style={{ height: " 110px" }}>

    </div>
    <HowItWorks />
    <LegendPipsFeatures />

    </>
  )
}

export default HitWorksPage;