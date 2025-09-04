import React, { useState } from "react";
import styled from "styled-components";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";

import GrothImg from "../../assets/icons/GrothImg.svg";
import ButtonBase from "../SharedComponents/Button";

import { motion } from "framer-motion";
import { FaCircleArrowDown, FaCircleArrowUp } from "react-icons/fa6";

import Icon1 from "../../assets/ChooseusIcons/Image.png";
import Icon2 from "../../assets/ChooseusIcons/image3.png";
import Icon3 from "../../assets/ChooseusIcons/Image-1.png";
import Icon4 from "../../assets/ChooseusIcons/Image-2.png";
import Icon5 from "../../assets/ChooseusIcons/5736412_1.png";
import Icon6 from "../../assets/ChooseusIcons/image3-1.png";
import Icon7 from "../../assets/ChooseusIcons/image3-2.png";
import Icon8 from "../../assets/ChooseusIcons/image3-3.png";
import Icon9 from "../../assets/ChooseusIcons/image3-4.png";
import Icon10 from "../../assets/ChooseusIcons/img1.png";
import Icon11 from "../../assets/ChooseusIcons/img3.png";
import Icon12 from "../../assets/ChooseusIcons/Img2.png";


const WorkSectionWrapper = styled.section`
  padding: 1rem 2rem;
  width: 100%;
  background-color: white;
  padding-top: 3rem;
  //   max-width: 1280px;
  margin: auto;
  /* overflow: hidden; */
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 85%;
  margin-top: 1rem;
  margin: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    flex-direction: column-reverse;
    width: 100%;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 600px;
  margin: 1rem auto 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    align-items: center;
    text-align: center;
    padding: 0 1rem;
  }
`;

const PointBox = styled(motion.div)`
  display: flex;
  color: #303030;

  gap: 10px;
  min-width: 500px;

  h2,
  h3 {
    font-family: Inter;
    font-weight: 500;
    font-size: 18px;
    line-height: 100%;
  }

  p {
    font-family: Inter;
    font-weight: 300;
    font-size: 12px;
    max-width: 420px;
    padding: 0.5rem 0;
  }

  img {
    height: 48px;
    min-width: 48px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-width: auto;
    p {
      max-width: 100%;
    }
  }
`;

const ImageContainer = styled.div`
  img {
    height: auto;
    width: 450px;
    object-fit: contain;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    img {
      height: 300px;
      width: auto;
    }
  }
`;

const UnderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  //   flex-direction: column;
  gap: 2rem 0;
  width: 85%;
  margin: 2rem auto;
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}){
    justify-content: center;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 1rem;
    width: 100%;
    justify-content: center;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: start;

  align-items: center;
  width: 80%;
  //   margin: 2rem auto;

  @media (max-width: 768px) {
    justify-content: center;
    width: 80%;
    margin: auto;
  }
`;

const UpperContentContainer = styled.div``;

const POINTS = [
  {
    title: "Broker causing problems? Submit a complaint now.",
    desc: "Facing issues like delayed withdrawals, trade manipulation, or poor support? We’re here to help resolve it.",
    icon: Icon1,
  },
  {
    title: "AI-Powered Broker Finder",
    desc: "Whether you trade in forex, crypto, or stocks our AI helps you find the perfect trading partner fast.",
    icon: Icon2,
  },
  {
    title: "Excellent customer service",
    desc: "We prioritize your satisfaction and profit. Our professional customer service team is always here to help you.",
    icon: Icon3,
  },
  {
    title: "Top technical analysis",
    desc: "We have a very robust trading system, AI intelligence, technical analysis, big data and strategic cooperation with the world’s top trading analysts.",
    icon: Icon4,
  },
  {
    title: "Exciting Lucky Draws with Real Prizes",
    desc: "Spend just $1 and get a chance to spin the wheel for exciting prizes! The more you spend, the more chances you get to win big.",
    icon: Icon5,
  },
  {
    title: "Delivering tools that elevate your trading game",
    desc: "Gain access to a suite of powerful trading tools designed to enhance every aspect of your trading journey.",
    icon: Icon6,
  },
];

const UnderPoints = [
  {
    title: "Stay Informed with Daily Economic Insights",
    desc: "Keep track of upcoming economic events, news releases, and data that can impact your trades.",
    icon: Icon7,
  },
  {
    title: "Become an Affiliate Partner & Start Earning",
    desc: "Whether you’re a content creator or a trading pro, our affiliate program offers unlimited earning potential.",
    icon: Icon8,
  },
  {
    title: "Education That Elevates Your Trading",
    desc: "Unlock powerful insights with structured learning from beginner to expert featuring monthly webinars, psychology classes, and advanced trading lessons.",
    icon: Icon9,
  },
  {
    title: "Advanced Scam Detection and Prevention",
    desc: "Our intelligent system verifies brokers using advanced AI checks and ensures fast, transparent complaint resolution.",
    icon: Icon10,
  },
  {
    title: "Copy Top Traders, Earn Like a Pro",
    desc: "Choose from a list of verified expert traders and mirror their trades in real time for consistent results.",
    icon: Icon11,
  },
  {
    title: "Trading signal tracking is simple and reliable",
    desc: "Our trading signals are pushed live to VIP customers through the system, social network and email. Real-time trading broadcasts provide better clarity.",
    icon: Icon12,
  },
];

const ChoosUs: React.FC = () => {
  const [showMore, setShowMore] = useState(false);

  const POINTS_SHOW = showMore ? POINTS : POINTS.slice(0, 3);

  return (
    <WorkSectionWrapper>
      <SectionHeadingSet
        upperText="All in one trading Platform"
        mainHeading="Why Choose Us"
        subText="Discover why traders worldwide trust us as their top choice. With a focus on delivering consistent profits, exceptional service, cutting-edge technology."
      />

      <Wrapper>
        <UpperContentContainer>
          <ContentContainer>
            {POINTS_SHOW.map((point, i) => (
              <PointBox key={i}>
                <img src={point.icon} alt="Icon" />
                <div>
                  <h2>{point.title}</h2>
                  <p>{point.desc}</p>
                </div>
              </PointBox>
            ))}
          </ContentContainer>
          {showMore == false && (
            <ButtonContainer style={{ marginTop: "2rem", textAlign: "center" }}>
              <ButtonBase
                width="200px"
                fontSize="16px"
                onClick={() => setShowMore((prev) => !prev)}
              >
                {showMore ? (
                  <>
                    Show Less <FaCircleArrowUp />
                  </>
                ) : (
                  <>
                    Read More <FaCircleArrowDown />
                  </>
                )}
              </ButtonBase>
            </ButtonContainer>
          )}
        </UpperContentContainer>

        <ImageContainer>
          <img src={GrothImg} alt="Growth" />
        </ImageContainer>
      </Wrapper>

      {showMore && (
        <UnderContent>
          {UnderPoints.map((point, index) => (
            <PointBox key={index}>
              <img src={point.icon} alt="Icon" />
              <div>
                <h3>{point.title}</h3>
                <p>{point.desc}</p>
              </div>
            </PointBox>
          ))}
          <ButtonContainer style={{ marginTop: "1rem", textAlign: "center" }}>
            <ButtonBase
              width="200px"
              fontSize="16px"
              onClick={() => setShowMore((prev) => !prev)}
            >
              {showMore ? (
                <>
                  Show Less <FaCircleArrowUp />
                </>
              ) : (
                <>
                  Read More <FaCircleArrowDown />
                </>
              )}
            </ButtonBase>
          </ButtonContainer>
        </UnderContent>
      )}
    </WorkSectionWrapper>
  );
};

export default ChoosUs;
