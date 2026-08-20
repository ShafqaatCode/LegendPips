import React, { useState } from 'react';
import styled from 'styled-components';
import RecentSignals from './SignalList';
import SignalPerformance from './SignalPerformance';

import SectionHeadingSet from '../../SharedComponents/SectionHeadingSet';
import { useLocale } from '../../../contexts/LocaleContext';

const Container = styled.div`
  background-color: #F3F4F7;
  font-family: 'Segoe UI', sans-serif;
  padding: 60px 20px;
  text-align: center;
`;

const TabsWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
  overflow-x: auto;
`;

const Tabs = styled.div`
  display: flex;
  gap: 24px;
  padding-bottom: 8px;

  @media (max-width: 600px) {
    gap: 16px;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  color: ${({ active }) => (active ? '#132E58' : '#444')};
  border-bottom: ${({ active }) =>
    active ? '2px solid #132E58' : '2px solid transparent'};

  &:hover {
    color: #132E58;
  }

  @media (max-width: 600px) {
    font-size: 14px;
    padding: 10px 8px;
  }
`;

const CardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 32px;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const RewardsAndBenefits: React.FC = () => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState('Signals');

  const tabs = [
    { id: 'Signals', label: t('signals.tab1') },
    { id: 'Rewards', label: t('signals.tab2') },
    { id: 'Stats', label: t('signals.tab3') },
    { id: 'Performance', label: t('signals.tab4') },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Signals':
        return (
          <CardsWrapper>
            <RecentSignals />
            <SignalPerformance />
          </CardsWrapper>
        );
      case 'Rewards':
        return (
          <CardsWrapper>
            <RecentSignals />
          </CardsWrapper>
        );
      case 'Stats':
        return (
          <CardsWrapper>
            <SignalPerformance />
          </CardsWrapper>
        );
      case 'Performance':
        return (
          <CardsWrapper>
            <RecentSignals />
            <SignalPerformance />
          </CardsWrapper>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <SectionHeadingSet
        upperText={t("common.allInOne")}
        mainHeading={t("signals.title")}
        subText={t("signals.body")}
      />

      <TabsWrapper>
        <Tabs>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Tab>
          ))}
        </Tabs>
      </TabsWrapper>

      {renderTabContent()}
    </Container>
  );
};

export default RewardsAndBenefits;
