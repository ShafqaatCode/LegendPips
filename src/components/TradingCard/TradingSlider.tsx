import React, { useState } from "react";
import styled from "styled-components";
import TradingCard from "../../components/TradingCard/TradingCard";
import BrokerLogo from "../../assets/Contest_Images/wmug5dukcys 1.png";

const SliderWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  max-width: 1250px;
  position: relative;
  
  margin: 10px auto;
  
  
`;

const SliderTrack = styled.div<{ translateX: number }>`
  display: flex;
  gap: 70px;
  transition: transform 0.5s ease;
  transform: translateX(${(props) => props.translateX}%);
  
  
  margin: 0 auto;
`;

const Slide = styled.div`
  min-width: 33.33%; /* default for desktop */
  padding: 0 10px;

  @media (max-width: 1024px) {
    min-width: 50%; /* 2 per view */
  }

  @media (max-width: 768px) {
    min-width: 100%; /* 1 per view */
  }
`;

const Button = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #1a365d;
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }

  &.prev {
    left: 10px;
  }

  &.next {
    right: 10px;
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
        "Partnering with one of the world’s largest Forex broker for a secure and seamless trading experience.",
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
      description: "Partnering with one of the world’s largest Forex broker for a secure and seamless trading experience.",
      buttonText: "Start Trading",
      buttonLink: "#",
    },
    {
      logo: BrokerLogo,
      title: "Broker Three",
      features: ["Licensed", "0 commission", "Fast deposits", "Min Deposit 50$"],
      description: "Partnering with one of the world’s largest Forex broker for a secure and seamless trading experience.",
      buttonText: "Join Now",
      buttonLink: "#",
    },
    {
      logo: BrokerLogo,
      title: "Broker Three",
      features: ["Licensed", "0 commission", "Fast deposits", "Min Deposit 50$"],
      description: "Top broker with zero commission accounts.",
      buttonText: "Join Now",
      buttonLink: "#",
    },
    {
      logo: BrokerLogo,
      title: "Broker Three",
      features: ["Licensed", "0 commission", "Fast deposits", "Min Deposit 50$"],
      description: "Top broker with zero commission accounts.",
      buttonText: "Join Now",
      buttonLink: "#",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? brokers.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === brokers.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <SliderWrapper>
      <Button className="prev" onClick={handlePrev}>
        {"<"}
      </Button>
      <SliderTrack translateX={-currentIndex * 100}>
        {brokers.map((b, i) => (
          <Slide key={i}>
            <TradingCard {...b} />
          </Slide>
        ))}
      </SliderTrack>
      <Button className="next" onClick={handleNext}>
        {">"}
      </Button>
    </SliderWrapper>
  );
};

export default TradingSlider;
