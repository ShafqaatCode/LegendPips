import styled from "styled-components";
import bgImage from "../../assets/banner/BannerBg.jpg";

export const BannerWrapper = styled.section`
  position: relative;
  background-image: url("${bgImage}");
  background-size: cover;
  background-position: center;
  height: 100vh;
  color: red;
  display: flex;
  align-items: center;
  padding: 0 3rem;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: rgba(19, 45, 88, 0.8); // Your overlay
    z-index: 1;
  }

  > * {
    position: relative;
    z-index: 2; // So the content sits above the overlay
  }
`; // your image path

export const HeroWrapper = styled.section`
  position: relative;
  height: 640px;
  background-image: url(${bgImage});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  padding: 0 4rem;
  z-index: 1;
  overflow: hidden;
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5); // for opacity
  z-index: 1;
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  width: 45%;
  // border: 2px solid red;
  color: ${({ theme }) => theme.colors.WHITE};
`;

export const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  text-transform: capitalize;
  line-height: 70px;
  letter-spacing: -0.6%;

  span {
    color: #fbbf24;
  }
`;

export const HeroSubTitle = styled.p`
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  font-family: "Poppins", sans-serif;
  letter-spacing: -0.6%;
  color: #fbbf24;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

export const JoinButton = styled.button`
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 30px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.WHITE};
  border: 1px solid white;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 270px;
  &:hover {
    opacity: 0.9;
  }
`;

export const CompareButton = styled.button`
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  width: 270px;
  border-radius: 30px;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.gold};
  border: 1px solid ${({ theme }) => theme.colors.gold};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.WHITE};
    color: ${({ theme }) => theme.colors.primary};
  }
`;
