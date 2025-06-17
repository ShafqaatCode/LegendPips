import React, { useState } from 'react';
import styled from 'styled-components';
import RecentSignals from './SignalList';
import SignalPerformance from './SignalPerformance';

import SectionHeadingSet from '../../SharedComponents/SectionHeadingSet';

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
`;

const Tabs = styled.div`
  display: flex;
  gap: 32px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 8px;
`;
const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: 12px 16px;
  font-size: 16px;
  /* border: 2px solid red; */
  font-weight: 600;
  cursor: pointer;
  color: ${({ active }) => (active ? '#132E58' : '#444')};
  border-bottom: ${({ active }) => (active ? '2px solid #132E58' : '2px solid transparent')};

  &:hover {
    color: #132E58;
  }
`;

const CardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 32px;
`;

const RewardsAndBenefits: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Gift Rewards');

    const tabs = ['Gift Rewards', 'Cash Rewards', 'National Tours', 'International Tours'];

    return (
        <Container>
            <SectionHeadingSet
                upperText="ALL IN ONE TRADING PLATFORM"
                mainHeading="LIVE SIGNALS"
                subText="Trade, earn, repeat. With rebates, expert tools, and a strong community, Legend Pips makes every trade more rewarding."
            />

            <TabsWrapper>
                <Tabs>
                    {tabs.map((tab) => (
                        <Tab key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)}>
                            {tab}
                        </Tab>
                    ))}
                </Tabs>
            </TabsWrapper>

            {activeTab === 'Gift Rewards' && (
                <CardsWrapper>
                    <RecentSignals />
                    <SignalPerformance />
                </CardsWrapper>
            )}
            {activeTab === 'Cash Rewards' && (
                <CardsWrapper>
                    <RecentSignals />
                    <SignalPerformance />
                </CardsWrapper>
            )}
            {activeTab === 'National Tours' && (
                <CardsWrapper>
                    <RecentSignals />

                </CardsWrapper>
            )}
            {activeTab === 'International Tours' && (
                <CardsWrapper>
                    <RecentSignals />
                    <SignalPerformance />
                </CardsWrapper>
            )}

        </Container>
    );
};

export default RewardsAndBenefits;
