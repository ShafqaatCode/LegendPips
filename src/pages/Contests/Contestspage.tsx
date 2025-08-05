import React from 'react'
import styled from 'styled-components';

// import Contest from '../../components/ContestTable/Contest';
// import ContestImg from '../../assets/Contest_Images/wmug5dukcys 1.png'
// import ContestInfo from '../../components/ContestTable/ContestInstruction';

import Competitions from '../../components/Contest/Competitions';
import ContestHeaderWithModals from '../../components/Contest/ContestHeader';
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
     

      <ContestHeaderWithModals />


 


      {/* <ContestList /> */}
      {/* <Contest imageSrc={ContestImg}
        title="Q2 Special – The Major's Mix II"
        subtitle="IC TRADING CUP 2025"
        eventInfo="Traders Cup Event 7 of 16"
        endTime={new Date('2025-07-27T13:00:00')}
        registrationDeadline="Jul 18, 2025, 01:00 PM"
        sponsorUrl="https://ictrading.com"
        sponsorText="ictrading.com" />
      <ContestInfo /> */}

      <Competitions />
     
      
     

    </MainContainer>
  )
}

export default Contests;