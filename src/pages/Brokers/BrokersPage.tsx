import React from 'react'

import BrokerHeroSection2 from './BrokerHeroSection2';
import BrokerList from '../../components/AccountSetup2/dummyData';
import TopBeginnerBrokersWidget from '../../components/Broker/TopBeginnerBrokersWidget';
import styled from 'styled-components';

const WidgetBand = styled.section`
  padding: 1.25rem ${({ theme }) => theme.typography.pageGutter} 0.5rem;
  background: #f5f7fa;
  display: flex;
  justify-content: center;
`;

const Brokers: React.FC = () => {
  return (
    <>
      <BrokerHeroSection2 />
      <WidgetBand>
        <TopBeginnerBrokersWidget limit={5} />
      </WidgetBand>
      <BrokerList />
    </>
  )
}

export default Brokers;
