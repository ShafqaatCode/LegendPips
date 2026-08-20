import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Banner from '../../components/Banner/Banner'
import bannerImg from "../../assets/banner/BannerBg.jpg";
import LegendPipsFeatures from '../../components/PipsFeatures/PipsFeatureSection';
import HowItWorks from '../../components/HItWorks/WorksSection';
import WhyChooseUs from '../../components/WhyChooseUs/Choose';
import FeaturesSlider from '../../components/FeatureSection/FeaturesSlider';
import RegisterModal from '../../pages/Register/RegisterModal';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
// import RebateCalculator from '../../components/Calculators/RebateCalculator/RebateCalculator';
// import MarginCalculator from '../../components/Calculators/MarginCalculator/MarginCalculator';
// import PipCalculator from '../../components/Calculators/PipsCalculator/PipCalculator';
// import PivotPointCalculator from '../../components/Calculators/PivotpointCalculator/PivotPointCalculator';
// import PositionSizeCalculator from '../../components/Calculators/PositionSizeCalculator/PositionsizeCalculator';



const HitWorksPage: React.FC = () => {
  const { t } = useLocale();
  const [signupOpen, setSignupOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleSignupClick = () => {
    if (isAuthenticated) {
      navigate(user?.role === "admin" ? "/admin-panel" : "/user-panel");
      return;
    }
    setSignupOpen(true);
  };

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
        bannerHeading={t("how.bannerTitle")}
        upperText={t("how.bannerKicker")}
        subText={t("how.bannerBody")}
        buttonText={t("how.ctaBtn")}
        onButtonClick={handleSignupClick}
      />
      <RegisterModal isOpen={signupOpen} onClose={() => setSignupOpen(false)} />
      <FeaturesSlider />
      <HowItWorks />

      <LegendPipsFeatures />

      <WhyChooseUs />
      {/* <RebateCalculator />
      <MarginCalculator />
      <PipCalculator />
      <PivotPointCalculator />
      <PositionSizeCalculator /> */}

    </>
  )
}

export default HitWorksPage;