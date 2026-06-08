import { useState, useEffect, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { AnimatePresence } from "framer-motion";
import {
  SectionShell,
  SliderWrapper,
  CardsRow,
  CardsViewport,
  CardsSlider,
  Card,
  IconBadge,
  CardLabel,
  NavButton,
  DotsRow,
  Dot,
} from "./FeaturesSlider.styles";

import CashbackIcon from "../../assets/icons/cashback.svg";
import VerifiedIcon from "../../assets/icons/verified.svg";
import TradingIcon from "../../assets/icons/trading.svg";
import ContestIcon from "../../assets/icons/contest.svg";
import ScamIcon from "../../assets/icons/scam.svg";

const features = [
  { icon: ScamIcon, label: "Scam Protection" },
  { icon: CashbackIcon, label: "Cashback Rebates" },
  { icon: VerifiedIcon, label: "Verified Broker" },
  { icon: TradingIcon, label: "Trading Signals" },
  { icon: ContestIcon, label: "Contests & Rewards" },
];

function getCardsToShow() {
  if (typeof window === "undefined") return 4;
  if (window.innerWidth < 480) return 2;
  if (window.innerWidth < 768) return 3;
  return 4;
}

const FeaturesSlider = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(getCardsToShow());
  const totalCards = features.length;

  const nextSlide = useCallback(() => {
    setStartIndex((prev) => (prev + 1) % totalCards);
  }, [totalCards]);

  const prevSlide = useCallback(() => {
    setStartIndex((prev) => (prev - 1 + totalCards) % totalCards);
  }, [totalCards]);

  useEffect(() => {
    const handleResize = () => setCardsToShow(getCardsToShow());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const visibleCards = [];
  for (let i = 0; i < cardsToShow; i += 1) {
    const index = (startIndex + i) % totalCards;
    visibleCards.push({ ...features[index], index });
  }

  return (
    <SectionShell aria-label="Platform features">
      <SliderWrapper>
        <CardsRow>
          <NavButton type="button" onClick={prevSlide} aria-label="Previous features">
            <FiChevronLeft size={20} />
          </NavButton>

          <CardsViewport>
            <AnimatePresence mode="popLayout">
              <CardsSlider
                key={startIndex}
                style={{ ["--cols" as string]: cardsToShow }}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }}
              >
                {visibleCards.map((card) => (
                  <Card key={`${card.index}-${card.label}`} layout>
                    <IconBadge>
                      <img src={card.icon} alt="" aria-hidden />
                    </IconBadge>
                    <CardLabel>{card.label}</CardLabel>
                  </Card>
                ))}
              </CardsSlider>
            </AnimatePresence>
          </CardsViewport>

          <NavButton type="button" onClick={nextSlide} aria-label="Next features">
            <FiChevronRight size={20} />
          </NavButton>
        </CardsRow>

        <DotsRow>
          {features.map((_, idx) => (
            <Dot
              key={idx}
              type="button"
              $active={idx === startIndex}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setStartIndex(idx)}
            />
          ))}
        </DotsRow>
      </SliderWrapper>
    </SectionShell>
  );
};

export default FeaturesSlider;
