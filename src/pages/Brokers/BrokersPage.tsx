import React from 'react'

import BrokerHeroSection2 from './BrokerHeroSection2';
import AllBrokersList from '../../components/Broker/AllBrokersList2';
import LiveAccountSetup from '../../components/AccountSetup/LiveAccountSetup';
import BrokerSystem from '../../components/AccountSetup/BrokerReview';
// import BrokerHeroSection from './BrokerHeroSection';




const Brokers: React.FC = () => {
  return (
    <>
      
      <BrokerHeroSection2 />
      <AllBrokersList  />
      <LiveAccountSetup />
      <BrokerSystem />

    </>
  )
}

export default Brokers;