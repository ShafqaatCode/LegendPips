import React from 'react'
import styled from 'styled-components';

// import Contest from '../../components/ContestTable/Contest';
// import ContestImg from '../../assets/Contest_Images/wmug5dukcys 1.png'
// import ContestInfo from '../../components/ContestTable/ContestInstruction';

import Competitions from '../../components/ContestList/Competitions';
import ContestHeaderWithModals from '../../components/ContestList/BrodcumHeader';
const MainContainer = styled.main`
  /* Nav is in document flow — no offset needed (old fixed-header margin caused the white gap). */
  margin: 0;
  padding: 0.35rem 0 0;
  width: 100%;
  box-sizing: border-box;
`;


const Contests: React.FC = () => {


  return (
    <MainContainer>
      <ContestHeaderWithModals heading='Elite Skills Contest on the Web We Never Ask for Real Money!' />
      <Competitions />
    </MainContainer>
  )
}

export default Contests;