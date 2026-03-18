import React from 'react';
import styled from 'styled-components';
import RecentSignals from './Tabs/SignalList';
import SignalPerformance from './Tabs/SignalPerformance';

const SectionWrapper = styled.section`
  background: white;
  padding: 60px 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 40px 2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 30px 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #132E58;
  margin-bottom: 2rem;
  text-align: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 24px;
    margin-bottom: 1.5rem;
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

type Signal = {
  pair: string;
  entry: string;
  tp: string;
  sl: string;
  status: 'buy' | 'sell';
};

interface SignalsSectionProps {
  title: string;
  signals: Signal[];
  onCtaClick?: () => void;
}

const SignalsSection: React.FC<SignalsSectionProps> = ({ title, signals, onCtaClick }) => {
  return (
    <SectionWrapper>
      <SectionTitle>{title}</SectionTitle>
      <ContentWrapper>
        <RecentSignals
          title="Recent Signal Performance"
          isLive={true}
          signals={signals}
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

export default SignalsSection;
