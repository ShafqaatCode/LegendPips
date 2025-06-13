import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
// import 'swiper/css';
// import 'swiper/css/navigation';
import { NavLink } from "react-router-dom";
import styled from "styled-components";

// Icons
import CashbackIcon from "../../assets/icons/cashback.svg";
import VerifiedIcon from "../../assets/icons/verified.svg";
import TradingIcon from "../../assets/icons/trading.svg";
import ContestIcon from "../../assets/icons/contest.svg";
import ScamIcon from "../../assets/icons/scam.svg";


const SliderWrapper = styled.div`
  padding: 2rem 2rem;
  background: ${({ theme }) => theme.colors.background || "#f9fafb"};
`;

const FeatureCard = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.WHITE};
  border-radius: 16px;
  padding: 2rem 1rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
  z-index: 1;
  cursor: pointer;

  img {
    height: 48px;
    margin-bottom: 1rem;
  }

  p {
    font-weight: 600;
    color: #1f2a37;
    font-size: 0.95rem;
    z-index: 2;
  }

  .hover-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0%;
    height: 0%;
    background-color: ${({ theme }) => theme.colors.primary};
    opacity: 0.08;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    z-index: 0;
    transition: width 0.4s ease, height 0.4s ease;
  }

  &:hover .hover-bg {
    width: 300%;
    height: 300%;
  }

  &:hover {
    transform: translateY(-4px);
  }
`;


const features = [
  { icon: CashbackIcon, label: "Cashback Rebates", link: "/rebates" },
  { icon: VerifiedIcon, label: "Verified Broker", link: "/brokers" },
  { icon: TradingIcon, label: "Trading Signals", link: "/signals" },
  { icon: ContestIcon, label: "Contests & Rewards", link: "/contests" },
  { icon: ScamIcon, label: "Scam Protection", link: "/protection" },
];

const FeaturesSlider: React.FC = () => {
  return (
    <SliderWrapper>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1.2}
        autoplay={{ delay: 3000 }}
        navigation
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
      >
        {features.map((feature, index) => (
          <SwiperSlide key={index}>
            <FeatureCard to={feature.link}>
              <img src={feature.icon} alt={feature.label} />
              <p>{feature.label}</p>
              <div className="hover-bg" />
            </FeatureCard>
          </SwiperSlide>
        ))}
      </Swiper>
    </SliderWrapper>
  );
};

export default FeaturesSlider;
