

import styled from "styled-components";
import bgImage from "../../assets/banner/BannerBg.jpg"

export const BannerWrapper = styled.section`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  min-height: 600px;
  padding: 0 3rem;
  background-image: url("${bgImage}");
  background-size: cover;
  background-position: center;
  color: ${({ theme }) => theme.colors.WHITE};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 1.5rem;
    justify-content: center;
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: rgba(19, 45, 88, 0.7);
    z-index: 1;
  }

  & > * {
    position: relative;
    z-index: 2;
  }
`;

export const HeroContent = styled.div`
  width: 45%;
  max-width: 700px;
  display: flex;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 80%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    align-items: center;
    text-align: center;
  }
`;

export const SubheadingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  img {
    height: 30px;
    width: 30px;
  }
`;

export const HeroSubTitle = styled.p`
  font-family: ${({ theme }) => theme.font.family};
  font-size: 20px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: -0.6%;
  color: ${({ theme }) => theme.colors.gold};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 16px;
  }
`;

export const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.font.family};
  font-size: 48px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.6%;
  margin: 0.5rem 0;
  text-transform: capitalize;

  span {
    color: ${({ theme }) => theme.colors.gold};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 40px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 32px;
    line-height: 1.3;
  }
`;

export const BrokersContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
  gap: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    width: 100%;
    max-width: 400px;
  }
`;

export const BrokerLeftSection = styled.div`
  flex: 1;
  padding-right: 1.5rem;
  border-right: 1px dashed ${({ theme }) => theme.colors.WHITE};

  h4 {
    font-size: 15px;
    font-weight: 600;
    line-height: 1.6;
    padding: 8px 0;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    border-right: none;
    // border-bottom: 1px dashed ${({ theme }) => theme.colors.WHITE};
    padding-right: 0;
    padding-bottom: 1.5rem;
    text-align: center;
  }
`;

export const BrokerRightSection = styled.div`
  flex: 2;
  
  p {
    max-width: 320px;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.5;
    text-align: left;
    margin: auto;

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      text-align: center;
      max-width: 100%;
      font-size: 15px;
    
    }
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 1rem;
  }
`;

const ButtonBase = styled.button`
  padding: 0.75rem 2rem;
  font-size: 1.2rem;
  line-height: 35px;
  font-weight: 550;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 270px;
  border: 1px solid transparent;
  font-family: ${({theme})=> theme.font.family};

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    max-width: 320px;
  }
`;

export const JoinButton = styled(ButtonBase)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.WHITE};
  border-color: ${({ theme }) => theme.colors.WHITE};
  display:flex;
  align-item:center;
  justify-content: center;
  gap: .4rem;

  

`;

export const CompareButton = styled(ButtonBase)`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.gold};
  border-color: ${({ theme }) => theme.colors.gold};

  display:flex;
  align-item:center;
  justify-content: center;
  gap: .4rem;

  img{
  color: red;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.gold};
    color: ${({ theme }) => theme.colors.primary};
  }
`;