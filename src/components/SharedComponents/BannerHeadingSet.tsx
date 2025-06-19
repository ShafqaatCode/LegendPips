import React from "react";
import styled from "styled-components";
import MathImg from "../../assets/icons/all-svgrepo-com 2.png";

interface BannerHeadingProps {
  upperText: string;
  mainHeading: string;
  subText: string;
}

const UpperHeadingDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  color: #fbbf24;
  white-space: nowrap;
  margin: 0.5rem 0;

  img {
    height: 24px;
    width: 24px;
  }
`;

const UpperHeading = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  text-transform: uppercase;
  color: #fbbf24;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const BannerHeading = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 48px;
  line-height: 70px;
  text-align: center;
  text-transform: capitalize;
  color: #ffffff;

  @media (max-width: 768px) {
    font-size: 32px;
    line-height: 45px;
  }
`;

const SubHeading = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 30px;
  text-align: center;
  color: #ffffff;
  margin: 1rem auto 2rem auto;
  max-width: 650px;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 24px;
    padding: 0 0.5rem;
  }
`;

const Wrapper = styled.section`
  text-align: center;
  margin: auto;
  max-width: 800px;
  padding: 0 1.5rem;
`;

const BannerHeadingSet: React.FC<BannerHeadingProps> = ({
  upperText,
  mainHeading,
  subText,
}) => {
  return (
    <Wrapper>
      <UpperHeadingDiv>
        <img src={MathImg} alt="icon" />
        <UpperHeading>{upperText}</UpperHeading>
      </UpperHeadingDiv>
      <BannerHeading>{mainHeading}</BannerHeading>
      <SubHeading>{subText}</SubHeading>
    </Wrapper>
  );
};

export default BannerHeadingSet;
