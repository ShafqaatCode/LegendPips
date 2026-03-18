import React, { useState } from "react";
import styled from "styled-components";
import TradingCard from "../../components/TradingCard/TradingCard";
import BrokerLogo from "../../assets/Contest_Images/wmug5dukcys 1.png";

const SliderWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  max-width: 1250px;
  position: relative;
  margin: 40px auto;
  padding: 0 70px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 60px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 50px;
    margin: 30px auto;
  }
`;

const SliderTrack = styled.div<{ translateX: number; $cardsPerView: number }>`
  display: flex;
  gap: 24px;
  transition: transform 0.5s ease;
  transform: translateX(${(props) => props.translateX}%);
  margin: 0;
  width: 100%;
  will-change: transform;
`;

const Slide = styled.div<{ $cardsPerView: number }>`
  flex: 0 0 calc((100% - ${({ $cardsPerView }) => ($cardsPerView - 1) * 24}px) / ${({ $cardsPerView }) => $cardsPerView});
  min-width: 0;
  padding: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex: 0 0 calc((100% - 24px) / 2);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex: 0 0 100%;
  }
`;

const Button = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #132e58;
  color: #fff;
  border: none;
  padding: 12px 16px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  opacity: 0.9;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
    background: #1a4a7a;
    transform: translateY(-50%) scale(1.1);
  }

  &.prev {
    left: 0;
  }

  &.next {
    right: 0;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 36px;
    height: 36px;
    padding: 8px 12px;
    font-size: 16px;
    
    &.prev {
      left: 5px;
    }
    
    &.next {
      right: 5px;
    }
  }
`;

const TradingSlider: React.FC = () => {
  const brokers = [
    {
      logo: BrokerLogo,
      title: "IC Market",
      features: [
        "Regulated in Australia & globally",
        "Spreads from 0.0 pips",
        "Trusted by traders worldwide",
        "Min Deposit 200$",
      ],
      description:
        "Partnering with one of the world's largest Forex broker for a secure and seamless trading experience.",
      buttonText: "Open Account",
      buttonLink: "#",
    },
    {
      logo: BrokerLogo,
      title: "Broker Two",
      features: [
        "Global regulation",
        "Tight spreads",
        "Fast execution",
        "Min Deposit 100$",
      ],
      description: "Partnering with one of the world's largest Forex broker for a secure and seamless trading experience.",
      buttonText: "Start Trading",
      buttonLink: "#",
    },
    {
      logo: BrokerLogo,
      title: "Broker Three",
      features: ["Licensed", "0 commission", "Fast deposits", "Min Deposit 50$"],
      description: "Partnering with one of the world's largest Forex broker for a secure and seamless trading experience.",
      buttonText: "Join Now",
      buttonLink: "#",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  React.useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth <= 768) {
        setCardsPerView(1);
      } else if (window.innerWidth <= 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const maxIndex = Math.max(0, brokers.length - cardsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Calculate translation percentage - move by one card width including gap
  const translatePercentage = currentIndex * (100 / cardsPerView);

  return (
    <SliderWrapper>
      {brokers.length > cardsPerView && (
        <>
          <Button className="prev" onClick={handlePrev}>
            {"<"}
          </Button>
          <Button className="next" onClick={handleNext}>
            {">"}
          </Button>
        </>
      )}
      <SliderTrack translateX={-translatePercentage} $cardsPerView={cardsPerView}>
        {brokers.map((b, i) => (
          <Slide key={i} $cardsPerView={cardsPerView}>
            <TradingCard {...b} />
          </Slide>
        ))}
      </SliderTrack>
    </SliderWrapper>
  );
};

export default TradingSlider;
