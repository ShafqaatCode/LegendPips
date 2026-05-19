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
    height: 20px;
    width: 20px;
  }
`;

const UpperHeading = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: ${({ theme }) => theme.typography.bannerUpper};
  line-height: 1.35;
  letter-spacing: 0.06em;
  text-align: center;
  text-transform: uppercase;
  color: #fbbf24;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const BannerHeading = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: ${({ theme }) => theme.typography.bannerTitle};
  line-height: ${({ theme }) => theme.typography.bannerTitleLh};
  text-align: center;
  text-transform: capitalize;
  color: #ffffff;
  margin: 0.25rem 0 0;
`;

const SubHeading = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.5;
  text-align: center;
  color: #ffffff;
  margin: 0.75rem auto 1.5rem auto;
  max-width: 38rem;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.caption};
    padding: 0 0.5rem;
  }
`;

const Wrapper = styled.section`
  text-align: center;
  margin: 0 auto;
  max-width: ${({ theme }) => theme.typography.contentMax};
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
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
