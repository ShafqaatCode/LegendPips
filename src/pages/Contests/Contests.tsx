import React from 'react'
import Banner from '../../components/Banner/Banner'
import bannerImg from "../../assets/banner/BannerBg.jpg";
import BannerHeadingSet from '../../components/SharedComponents/BannerHeadingSet';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  height: 600px;
 
  margin-top: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0, 66, 153, 0.6),
    rgba(0, 66, 153, 0.5),
    rgba(0, 66, 153, 0.6)
  );
  z-index: 1;
`;
const Contests: React.FC = () => {
  return (

    <Wrapper>
      <Overlay />
      <BannerHeadingSet subText='...' mainHeading='.......' upperText='...' />
    </Wrapper>





  )
}

export default Contests;