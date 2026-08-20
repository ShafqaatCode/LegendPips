import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BannerWrapper,
  HeroContent,
  SubheadingWrapper,
  HeroSubTitle,
  HeroTitle,
  BrokersContainer,
  BrokerLeftSection,
  BrokerRightSection,
  ActionButtons,
  JoinButton,
  CompareButton,
} from "./PromoBanner.styles";


import mathIcon from "../../assets/icons/all-svgrepo-com 1.svg";
import brokersImg from "../../assets/icons/Group 19.svg";
import ArrowIcon from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg";
import ArrowIcon2 from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 2.svg";

import type { Variants } from "framer-motion";
import LoginModal from "../../pages/Login/LoginModal";
import RegisterModal from "../../pages/Register/RegisterModal";
import { useAuth } from "../../contexts/AuthContext";
import { useLocale } from "../../contexts/LocaleContext";



export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.7,
      ease: [0.42, 0, 0.58, 1],
    },
  }),
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.7,
      ease: [0.42, 0, 0.58, 1]
    }
  })
}



const PromoBanner = () => {
  const [signinOpen, setSigninOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();

  const handleJoinFree = () => {
    if (isAuthenticated) {
      navigate(user?.role === "admin" ? "/admin-panel" : "/user-panel");
      return;
    }
    setSigninOpen(true);
  };

  const handleCompareBrokers = () => {
    navigate("/compare");
  };

  return (
    <>


      <BannerWrapper>
        <HeroContent>
          <SubheadingWrapper custom={0} variants={fadeInDown} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <img src={mathIcon} alt="Trading Icon" />
            <HeroSubTitle>{t("home.kicker")}</HeroSubTitle>
          </SubheadingWrapper>

          <HeroTitle custom={1} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {t("home.title")}
          </HeroTitle>

          <BrokersContainer custom={2} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <BrokerLeftSection>
              <h4>{t("home.topBrokers")}</h4>
              <img src={brokersImg} alt="Top Broker Logos" />
            </BrokerLeftSection>
            <BrokerRightSection>
              <p>
                {t("home.blurb")}
              </p>
            </BrokerRightSection>
          </BrokersContainer>

          <ActionButtons custom={3} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <JoinButton type="button" onClick={handleJoinFree}>
              {t("home.joinFree")}
              <img src={ArrowIcon} alt="Arrow" />
            </JoinButton>
            <CompareButton type="button" onClick={handleCompareBrokers}>
              {t("home.compareBrokers")}
              <img src={ArrowIcon2} alt="Arrow" />
            </CompareButton>
          </ActionButtons>
        </HeroContent>
      </BannerWrapper>

      <LoginModal
        isOpen={signinOpen}
        onClose={() => setSigninOpen(false)}
        onSwitchToRegister={() => {
          setSigninOpen(false);
          setSignupOpen(true);
        }}
      />
      <RegisterModal isOpen={signupOpen} onClose={() => setSignupOpen(false)} />
    </>
  );
};

export default PromoBanner;