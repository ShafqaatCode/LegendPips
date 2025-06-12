import styled from 'styled-components';
import bgImage from '../../assets/banner/BannerBg.jpg';



export const BannerWrapper = styled.section`
  position: relative;
  background-image: url('${bgImage}');
  background-size: cover;
  background-position: center;
  height: 100vh;
  color: red;
  display: flex;
  align-items: center;
  padding: 0 2rem;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color:rgba(19, 45, 88, 0.8); // Your overlay
    z-index: 1;
  }

  > * {
    position: relative;
    z-index: 2; // So the content sits above the overlay
  }
`;// your image path

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
  font-family: 'Poppins', sans-serif;
  text-transform: capitalize;
  line-height: 70px;
  letter-spacing: -0.6%;


  span {
    color:#fbbf24;
  }
`;

export const HeroSubTitle = styled.p`
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.6%;
  color: #fbbf24;
`;
