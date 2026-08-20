import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
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
import { useLocale } from "../../contexts/LocaleContext";


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

const CtaLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  &:hover {
    color: #de992f;
    text-decoration: underline;
  }
`;

const UpperContentContainer = styled.div``;

const ChoosUs: React.FC = () => {
  const [showMore, setShowMore] = useState(false);
  const { t } = useLocale();

  const POINTS = [
    { title: t("why.p1t"), desc: t("why.p1d"), icon: Icon1, to: "/complaints" },
    { title: t("why.p2t"), desc: t("why.p2d"), icon: Icon2 },
    { title: t("why.p3t"), desc: t("why.p3d"), icon: Icon3 },
    { title: t("why.p4t"), desc: t("why.p4d"), icon: Icon4 },
    { title: t("why.p5t"), desc: t("why.p5d"), icon: Icon5 },
    { title: t("why.p6t"), desc: t("why.p6d"), icon: Icon6 },
  ];
  const UnderPoints = [
    { title: t("why.u1t"), desc: t("why.u1d"), icon: Icon7 },
    { title: t("why.u2t"), desc: t("why.u2d"), icon: Icon8 },
    { title: t("why.u3t"), desc: t("why.u3d"), icon: Icon9 },
    { title: t("why.u4t"), desc: t("why.u4d"), icon: Icon10 },
    { title: t("why.u5t"), desc: t("why.u5d"), icon: Icon11 },
    { title: t("why.u6t"), desc: t("why.u6d"), icon: Icon12 },
  ];

  const POINTS_SHOW = showMore ? POINTS : POINTS.slice(0, 3);

  return (
    <WorkSectionWrapper>
      <SectionHeadingSet
        upperText={t("why.kicker")}
        mainHeading={t("why.title")}
        subText={t("why.body")}
      />

      <Wrapper>
        <UpperContentContainer>
          <ContentContainer>
            {POINTS_SHOW.map((point, i) => (
              <PointBox key={i}>
                <img src={point.icon} alt="Icon" />
                <div>
                  <h2>
                    {"to" in point && point.to ? (
                      <CtaLink to={point.to}>{point.title}</CtaLink>
                    ) : (
                      point.title
                    )}
                  </h2>
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
                    {t("why.less")} <FaCircleArrowUp />
                  </>
                ) : (
                  <>
                    {t("why.more")} <FaCircleArrowDown />
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
                  {t("why.less")} <FaCircleArrowUp />
                </>
              ) : (
                <>
                  {t("why.more")} <FaCircleArrowDown />
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
