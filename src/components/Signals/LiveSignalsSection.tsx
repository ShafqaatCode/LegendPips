import React, { useState } from 'react';
import styled from 'styled-components';
import SectionHeadingSet from '../SharedComponents/SectionHeadingSet';
import RecentSignals from './Tabs/SignalList';
import SignalPerformance from './Tabs/SignalPerformance';

const SectionWrapper = styled.section`
  background: white;
  padding: 80px 3rem;
  min-height: 420px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 60px 2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 40px 1.5rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-bottom: 30px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

const TabsWrapper = styled.div`
  display: flex;
  gap: 0;
  background: #f3f4f7;
  border-radius: 8px;
  padding: 4px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-width: max-content;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  background: ${({ active }) => (active ? '#132E58' : 'transparent')};
  color: ${({ active }) => (active ? 'white' : '#132E58')};
  border: none;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background: ${({ active }) => (active ? '#132E58' : 'rgba(19, 46, 88, 0.1)')};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 10px 24px;
    font-size: 14px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 24px;
    max-width: 600px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: 20px;
  }
`;

type TabSignal = {
  id?: string;
  pair: string;
  entry: string;
  tp: string;
  sl: string;
  status: 'buy' | 'sell';
};

interface LiveSignalsSectionProps {
  onCtaClick?: () => void;
  forexSignals?: TabSignal[];
  cryptoSignals?: TabSignal[];
}

const defaultForex: TabSignal[] = [
  { pair: 'EUR/USD', entry: '1.0845', tp: '1.0875', sl: '1.0825', status: 'buy' },
  { pair: 'GBP/USD', entry: '1.2645', tp: '1.2675', sl: '1.2625', status: 'buy' },
  { pair: 'AUD/USD', entry: '0.6545', tp: '0.6575', sl: '0.6525', status: 'buy' },
  { pair: 'CAD/JPY', entry: '110.45', tp: '110.75', sl: '110.25', status: 'buy' },
];

const defaultCryptoGold: TabSignal[] = [
  { pair: 'XAU/USD', entry: '2340', tp: '2365', sl: '2320', status: 'buy' },
  { pair: 'BTC/USD', entry: '43250', tp: '44500', sl: '42500', status: 'buy' },
  { pair: 'ETH/USD', entry: '2650', tp: '2750', sl: '2600', status: 'buy' },
  { pair: 'XAG/USD', entry: '28.40', tp: '29.10', sl: '27.80', status: 'buy' },
];

const LiveSignalsSection: React.FC<LiveSignalsSectionProps> = ({
  onCtaClick,
  forexSignals: forexProp,
  cryptoSignals: cryptoProp,
}) => {
  const [activeTab, setActiveTab] = useState<'forex' | 'cryptoGold'>('forex');

  const forexSignals = forexProp?.length ? forexProp : defaultForex;
  const cryptoGoldSignals = cryptoProp?.length ? cryptoProp : defaultCryptoGold;

  return (
    <SectionWrapper>
      <SectionHeadingSet
        upperText="ALL IN ONE TRADING PLATFORM"
        mainHeading="LIVE SIGNALS"
        subText="Stay ahead of every move with accurate, live market signals across Forex, Gold, and Crypto — updated in real time to help you capture every trading opportunity with confidence and precision."
      />
      
      <TabsContainer>
        <TabsWrapper>
          <Tab
            active={activeTab === 'forex'}
            onClick={() => setActiveTab('forex')}
          >
            Forex
          </Tab>
          <Tab
            active={activeTab === 'cryptoGold'}
            onClick={() => setActiveTab('cryptoGold')}
          >
            Crypto
          </Tab>
        </TabsWrapper>
      </TabsContainer>

      <ContentWrapper>
        <RecentSignals
          title="Recent Signal Performance"
          isLive={true}
          signals={activeTab === 'forex' ? forexSignals : cryptoGoldSignals}
          ctaText="Get Premium Signals"
          onCtaClick={onCtaClick}
        />
        <SignalPerformance
          title="Signal Performance"
          stats={[
            { value: '87%', label: 'Win Rate', bgColor: '#e6fbe6', textColor: '#2ecc71' },
            { value: '1248', label: 'Total Pips', bgColor: '#e3f2fd', textColor: '#2196f3' },
            { value: '+$2340', label: 'Total Profit', bgColor: '#fff8e6', textColor: '#f4b400' },
            { value: '24/7', label: 'Market Coverage', bgColor: '#f3e5f5', textColor: '#9c27b0' },
          ]}
          info={[
            { label: 'Free Signals:', value: '3 per day' },
            { label: 'Premium Signals:', value: 'Unlimited' },
            { label: 'Alert Methods:', value: 'Email, SMS, Telegram' },
          ]}
        />
      </ContentWrapper>
    </SectionWrapper>
  );
};

export default LiveSignalsSection;
