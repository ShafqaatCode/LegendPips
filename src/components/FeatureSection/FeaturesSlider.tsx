import React, { useState, useEffect } from "react";
import {
  SliderWrapper,
  CardsContainer,
  CardsSlider,
  Card,
  ArrowLeft,
  ArrowRight,
  ArrowsWrapper,
} from "./FeaturesSlider.styles";

import CashbackIcon from "../../assets/icons/cashback.svg";
import VerifiedIcon from "../../assets/icons/verified.svg";
import TradingIcon from "../../assets/icons/trading.svg";
import ContestIcon from "../../assets/icons/contest.svg";
import ScamIcon from "../../assets/icons/scam.svg";

const features = [
  { icon: CashbackIcon, label: "Cashback Rebates" },
  { icon: VerifiedIcon, label: "Verified Broker" },
  { icon: TradingIcon, label: "Trading Signals" },
  { icon: ContestIcon, label: "Contests & Rewards" },
  { icon: ScamIcon, label: "Scam Protection" },
  { icon: ScamIcon, label: "Scam Protection" },
  { icon: ScamIcon, label: "Scam Protection" },
];

const FeaturesSlider = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(getCardsToShow());
  const totalCards = features.length;

  function getCardsToShow() {
    if (window.innerWidth < 480) return 2;
    if (window.innerWidth < 768) return 3;
    if (window.innerWidth < 1024) return 4;
    return 5;
  }

  useEffect(() => {
    const handleResize = () => {
      setCardsToShow(getCardsToShow());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setStartIndex((prev) => (prev + 1) % totalCards);
  };

  const prevSlide = () => {
    setStartIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const visibleCards = [];
  for (let i = 0; i < cardsToShow; i++) {
    const index = (startIndex + i) % totalCards;
    visibleCards.push(features[index]);
  }

  const translateX = 0

  return (
    <SliderWrapper>
      <CardsContainer>
        <CardsSlider translateX={translateX}>
          {visibleCards.map((card, idx) => (
            <Card key={idx}>
              <div className="hover-bg" />
              <img src={card.icon} alt={card.label} />
              <p>{card.label}</p>
            </Card>
          ))}
        </CardsSlider>
      </CardsContainer>

      <ArrowsWrapper>
        <ArrowLeft onClick={prevSlide}>←</ArrowLeft>
        <ArrowRight onClick={nextSlide}>→</ArrowRight>
      </ArrowsWrapper>
    </SliderWrapper>
  );
};

export default FeaturesSlider;
