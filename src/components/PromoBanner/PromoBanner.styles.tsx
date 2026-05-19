import styled from "styled-components";
import bgImage from "../../assets/banner/hero-bg3.png";
import { motion } from "framer-motion";

export const BannerWrapper = styled.section`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  // height: 100vh;
  min-height: 520px;
//   border: 2px solid red;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  background-image: url("${bgImage}");
  background-size: cover;
  background-position: center;
  /* margin-top: 50px; */
  color: ${({ theme }) => theme.colors.WHITE};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 ${({ theme }) => theme.typography.pageGutter};
    justify-content: center;
    /* margin-top: 70px; */
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    /* background-color: rgba(19, 45, 88, 0.7); */
    z-index: 1;
  }

  & > * {
    position: relative;
    z-index: 2;
  }
`;

export const HeroContent = styled.div`
  width: 50%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  
 

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 80%;
    margin-top: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    align-items: center;
    text-align: center;
    margin-top: 0;
  }
`;

export const SubheadingWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 6px;

  img {
    height: 22px;
    width: 22px;
  }
`;

export const HeroSubTitle = styled.p`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.typography.bannerUpper};
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.gold};
  text-transform: uppercase;
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 0.75rem;
  }
`;

export const HeroTitle = styled(motion.div)`
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.typography.heroTitle};
  font-weight: 600;
  line-height: ${({ theme }) => theme.typography.heroTitleLh};
  letter-spacing: -0.02em;
  margin: 0.35rem 0 0.5rem;
  text-transform: capitalize;

  span {
    color: ${({ theme }) => theme.colors.gold};
  }
`;

export const BrokersContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.2rem;
  /* border: 2px solid red; */
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

export const ActionButtons = styled(motion.div)`
  display: flex;
  gap: 0.4rem;
  margin-top: 2.5rem;
  white-space: nowrap;
  /* flex-wrap: wrap; */

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 1rem;
  }
`;

const ButtonBase = styled.button`
  padding: 0.5rem 1.15rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: auto;
  min-width: 10rem;
  max-width: 15rem;
  border: 1px solid transparent;
  font-family: ${({ theme }) => theme.font.family};

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    max-width: 280px;
  }
`;

export const JoinButton = styled(ButtonBase)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.WHITE};
  border-color: ${({ theme }) => theme.colors.WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
`;

export const CompareButton = styled(ButtonBase)`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.gold};
  border-color: ${({ theme }) => theme.colors.gold};

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;

  img {
    color: red;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.gold};
    color: ${({ theme }) => theme.colors.primary};
  }
`;
