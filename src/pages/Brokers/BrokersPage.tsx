import React from 'react'
import styled from 'styled-components';

import BrokerHeroSection2 from './BrokerHeroSection2';
import BrokerList from '../../components/AccountSetup2/dummyData';
import TopBeginnerBrokersWidget from '../../components/Broker/TopBeginnerBrokersWidget';

const Brokers: React.FC = () => {
  return (
    <>
      <BrokerHeroSection2 />
      <ContentBand>
        <Layout>
          <MainColumn>
            <BrokerList embedded />
          </MainColumn>
          <AsideColumn>
            <AsideSticky>
              <AsideEyebrow>New traders</AsideEyebrow>
              <TopBeginnerBrokersWidget limit={4} />
            </AsideSticky>
          </AsideColumn>
        </Layout>
      </ContentBand>
    </>
  )
}

export default Brokers;

const ContentBand = styled.section`
  background:
    radial-gradient(ellipse 70% 50% at 100% 0%, rgba(19, 46, 88, 0.04) 0%, transparent 55%),
    #f5f7fa;
  padding: 1.35rem 0 3rem;
`;

const Layout = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  box-sizing: border-box;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 320px);
  gap: 1.25rem 1.5rem;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div`
  min-width: 0;
`;

const AsideColumn = styled.aside`
  min-width: 0;

  @media (max-width: 1100px) {
    order: -1;
    max-width: 420px;
    width: 100%;
    margin: 0 auto;
  }
`;

const AsideSticky = styled.div`
  position: sticky;
  top: 5.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;

  /* Widget shell is centered by default — fill the sidebar */
  & > section {
    max-width: none;
    margin: 0;
    width: 100%;
  }

  @media (max-width: 1100px) {
    position: static;
  }
`;

const AsideEyebrow = styled.p`
  margin: 0 0 0.1rem 0.15rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
`;
