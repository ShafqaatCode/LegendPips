import React from 'react'
import styled from 'styled-components';

// import Contest from '../../components/ContestTable/Contest';
// import ContestImg from '../../assets/Contest_Images/wmug5dukcys 1.png'
// import ContestInfo from '../../components/ContestTable/ContestInstruction';

import Competitions from '../../components/ContestList/Competitions';
import ContestHeaderWithModals from '../../components/ContestList/BrodcumHeader';
import { useLocale } from '../../contexts/LocaleContext';
const MainContainer = styled.main`
  margin: 0;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
`;


const Contests: React.FC = () => {
  const { t } = useLocale();

  return (
    <MainContainer>
      <ContestHeaderWithModals heading={t('contests.pageHeading')} />
      <Competitions />
    </MainContainer>
  )
}

export default Contests;