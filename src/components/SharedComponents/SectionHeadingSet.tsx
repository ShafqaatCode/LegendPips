import React from "react";
import styled from "styled-components";
import {
  SectionHeading,
  UpperHeading,
  SubHeading,
} from "../SharedStyleComponents/StyleHeadings.styles";
import MathImg from "../../assets/icons/all-svgrepo-com 2.png";

const UpperHeadingDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;

  img {
    height: 24px;
    width: 24px;
  }
`;

const HeadingWrapper = styled.div`
  text-align: center;
`;

interface SectionHeadingSetProps {
  upperText: string;
  mainHeading: string;
  subText: string;
}

const SectionHeadingSet: React.FC<SectionHeadingSetProps> = ({
  upperText,
  mainHeading,
  subText,
}) => {
  return (
    <HeadingWrapper>
      <UpperHeadingDiv>
        <img src={MathImg} alt="icon" />
        <UpperHeading>{upperText}</UpperHeading>
      </UpperHeadingDiv>
      <SectionHeading>{mainHeading}</SectionHeading>
      <SubHeading>{subText}</SubHeading>
    </HeadingWrapper>
  );
};

export default SectionHeadingSet;
