import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  SectionShell,
  SliderWrapper,
  SliderRow,
  CardsViewport,
  CardsTrack,
  CardSlot,
  Card,
  IconWrap,
  CardCopy,
  CardLabel,
  CardHint,
  NavButton,
  ProgressRow,
  ProgressTrack,
  ProgressFill,
} from "./FeaturesSlider.styles";

import CashbackIcon from "../../assets/icons/cashback.svg";
import VerifiedIcon from "../../assets/icons/verified.svg";
import TradingIcon from "../../assets/icons/trading.svg";
import ContestIcon from "../../assets/icons/contest.svg";
import ScamIcon from "../../assets/icons/scam.svg";
import SupportIcon from "../../assets/icons/SupportIcon.svg";
import CalculatorIcon from "../../assets/icons/calculator-svgrepo-com (1) 1.svg";
import ClockIcon from "../../assets/icons/ClockIcon.svg";
import GroupIcon from "../../assets/icons/Group.svg";
import InfoIcon from "../../assets/icons/InfoCircled.svg";
import { useLocale } from "../../contexts/LocaleContext";

function getCardsToShow() {
  if (typeof window === "undefined") return 4;
  if (window.innerWidth < 480) return 2;
  if (window.innerWidth < 768) return 3;
  return 4;
}

const FEATURE_HINTS = [
  "Protect your capital",
  "Earn on every trade",
  "Vetted for beginners",
  "Expert market calls",
  "Win prizes & perks",
  "Report broker issues",
  "Find your ideal broker",
  "Help when you need it",
  "Market insights daily",
  "Calculators & charts",
  "Track market events",
  "Earn by inviting others",
];

const SLIDE_EASE = [0.45, 0.05, 0.55, 0.95] as const;
const SLIDE_DURATION = 0.52;

const FeaturesSlider = () => {
  const { t } = useLocale();
  const prefersReducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const features = [
    { icon: ScamIcon, label: t("slider.f1"), to: "/scam-broker-shield" },
    { icon: CashbackIcon, label: t("slider.f2"), to: "/rebates" },
    { icon: VerifiedIcon, label: t("slider.f3"), to: "/brokers/beginners" },
    { icon: TradingIcon, label: t("slider.f4"), to: "/signals" },
    { icon: ContestIcon, label: t("slider.f5"), to: "/contests" },
    { icon: InfoIcon, label: t("slider.f6"), to: "/complaints" },
    { icon: GroupIcon, label: t("slider.f7"), to: "/find-broker" },
    { icon: SupportIcon, label: t("slider.f8"), to: "/support" },
    { icon: TradingIcon, label: t("slider.f9"), to: "/analysis" },
    { icon: CalculatorIcon, label: t("slider.f10"), to: "/tools" },
    { icon: ClockIcon, label: t("slider.f11"), to: "/economic-calendar" },
    { icon: TradingIcon, label: t("slider.f13"), to: "/live-charts" },
    { icon: CashbackIcon, label: t("slider.f12"), to: "/user-panel/invite" },
  ];

  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [cardsToShow, setCardsToShow] = useState(getCardsToShow());
  const totalCards = features.length;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setStartIndex((prev) => (prev + 1) % totalCards);
  }, [totalCards]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setStartIndex((prev) => (prev - 1 + totalCards) % totalCards);
  }, [totalCards]);

  useEffect(() => {
    const handleResize = () => setCardsToShow(getCardsToShow());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (paused || prefersReducedMotion) return undefined;
    const interval = setInterval(nextSlide, 6500);
    return () => clearInterval(interval);
  }, [nextSlide, paused, prefersReducedMotion]);

  const visibleCards = [];
  for (let i = 0; i < cardsToShow; i += 1) {
    const index = (startIndex + i) % totalCards;
    visibleCards.push({ ...features[index], index });
  }

  const progress = ((startIndex + 1) / totalCards) * 100;
  const slideOffset = prefersReducedMotion ? 0 : direction * 36;

  const cardMotion = prefersReducedMotion
    ? {}
    : {
        layout: true,
        initial: { opacity: 0, x: slideOffset, scale: 0.98 },
        animate: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, x: -slideOffset, scale: 0.98 },
        transition: {
          duration: SLIDE_DURATION,
          ease: SLIDE_EASE,
          layout: { duration: SLIDE_DURATION, ease: SLIDE_EASE },
        },
      };

  return (
    <SectionShell aria-label="Platform features">
      <SliderWrapper
        ref={wrapperRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(e) => {
          if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
            setPaused(false);
          }
        }}
      >
        <SliderRow>
          <NavButton type="button" onClick={prevSlide} aria-label="Previous features">
            <FiChevronLeft size={20} />
          </NavButton>

          <CardsViewport>
            <LayoutGroup id="features-slider">
              <CardsTrack style={{ ["--cols" as string]: cardsToShow }}>
                <AnimatePresence mode="popLayout" initial={false}>
                  {visibleCards.map((card) => (
                    <CardSlot key={card.index} {...cardMotion}>
                      <Link to={card.to}>
                        <Card>
                          <IconWrap>
                            <img src={card.icon} alt="" aria-hidden />
                          </IconWrap>
                          <CardCopy>
                            <CardLabel>{card.label}</CardLabel>
                            <CardHint>{FEATURE_HINTS[card.index]}</CardHint>
                          </CardCopy>
                        </Card>
                      </Link>
                    </CardSlot>
                  ))}
                </AnimatePresence>
              </CardsTrack>
            </LayoutGroup>
          </CardsViewport>

          <NavButton type="button" onClick={nextSlide} aria-label="Next features">
            <FiChevronRight size={20} />
          </NavButton>
        </SliderRow>

        <ProgressRow aria-hidden>
          <ProgressTrack>
            <ProgressFill
              animate={{ width: `${progress}%` }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: SLIDE_DURATION, ease: SLIDE_EASE }
              }
            />
          </ProgressTrack>
        </ProgressRow>
      </SliderWrapper>
    </SectionShell>
  );
};

export default FeaturesSlider;
