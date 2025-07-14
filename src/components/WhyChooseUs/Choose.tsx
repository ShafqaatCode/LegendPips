import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";
import ThumsUpIcon from "../../assets/icons/Image-1.svg";
import GrothImg from "../../assets/icons/GrothImg.svg";
import ButtonBase from "../SharedComponents/Button";
import { FaArrowAltCircleDown, FaArrowAltCircleUp, FaGreaterThan } from "react-icons/fa";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { FaCircleArrowDown, FaCircleArrowUp } from "react-icons/fa6";

const WorkSectionWrapper = styled.section`
  padding: 1rem 2rem;
  width: 100%;
  background-color: white;
  padding-top: 3rem;
  
  
  overflow: hidden;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  margin:auto;
  gap: 2rem;
  

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column-reverse;
    width: 100%;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 600px;

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
  width: 80%;

  margin: 2rem auto;
  flex-wrap: wrap;

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

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: [0.42, 0, 0.58, 1],
    },
  }),
};

let POINTS = [
  {
    title: "Excellent customer service",
    desc: "We prioritize your satisfaction and profit. Our professional customer service team is always here to help you.",
  },
  {
    title: "Fast Withdrawal Process",
    desc: "Enjoy quick and secure withdrawals with no hassle — your money, when you need it.",
  },
  {
    title: "Trusted by Traders",
    desc: "Join thousands of satisfied traders who benefit from our tools, services, and support.",
  },
  {
    title: "Fast Withdrawal Process",
    desc: "Enjoy quick and secure withdrawals with no hassle — your money, when you need it.",
  },
  {
    title: "Fast Withdrawal Process",
    desc: "Enjoy quick and secure withdrawals with no hassle — your money, when you need it.",
  },
  {
    title: "Fast Withdrawal Process",
    desc: "Enjoy quick and secure withdrawals with no hassle — your money, when you need it.",
  },
];

const UnderPoints = [
  {
    title: "Advanced Scam Detection and Prevention",
    desc: "Our intelligent system verifies brokers using advanced AI checks and ensures fast complaint resolution.",
  },
  {
    title: "Copy Top Traders, Earn Like a Pro",
    desc: "Choose from a list of verified expert traders and mirror their trades for consistent results.",
  },
  {
    title: "Trading signal tracking is simple and reliable",
    desc: "Real-time trading live broadcast and signal sync ensures you’re always informed.",
  },
  {
    title: "Stay Informed with Daily Economic Insights",
    desc: "Keep track of upcoming economic events, news releases, and data that can impact your trades.",
  },
  {
    title: "Become an Affiliate Partner & Start Earning",
    desc: "Whether you're a content creator or trader, our affiliate program offers unlimited earning potential.",
  },
  {
    title: "Education That Elevates Your Trading",
    desc: "Unlock powerful insights with structured learning—monthly webinars, psychology classes, and analysis.",
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
            {POINTS_SHOW.map((point) => (
              <PointBox>
                <img src={ThumsUpIcon} alt="Icon" />
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
                    Less More <FaCircleArrowUp />
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
              <img src={ThumsUpIcon} alt="Icon" />
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
                  Less More <FaCircleArrowUp />
                </>
              ) : (
                <>
                  Read More  <FaCircleArrowDown />
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
