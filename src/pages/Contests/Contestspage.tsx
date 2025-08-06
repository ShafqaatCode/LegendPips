import React from 'react'
import styled from 'styled-components';

// import Contest from '../../components/ContestTable/Contest';
// import ContestImg from '../../assets/Contest_Images/wmug5dukcys 1.png'
// import ContestInfo from '../../components/ContestTable/ContestInstruction';

import Competitions from '../../components/ContestList/Competitions';
import ContestHeaderWithModals from '../../components/ContestList/BrodcumHeader';
const MainContainer = styled.main`
  margin-top: 135px;
  margin:135px auto;
@media (max-width: ${({ theme }) => theme.breakpoints.laptop})
{
  margin-top: 80px;
} 
  
`


const Contests: React.FC = () => {


  return (
    <MainContainer>
      <ContestHeaderWithModals heading='Elite Skills Contest on the Web We Never Ask for Real Money!' />
      <Competitions />
    </MainContainer>
  )
}

export default Contests;