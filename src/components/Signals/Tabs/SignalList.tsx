import React from 'react';
import styled from 'styled-components';
import ArrowRight from '../../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg';

type SignalStatus = 'buy' | 'sell';

type Signal = {
  pair: string;
  entry: string;
  tp: string;
  sl: string;
  status: SignalStatus;
};

type RecentSignalsProps = {
  title?: string;
  isLive?: boolean;
  signals?: Signal[];
  ctaText?: string;
  onCtaClick?: () => void;
};

const Container = styled.div`
  width: 100%;
  max-width: 440px;
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', sans-serif;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-width: 100%;
    padding: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 500;
  color: #333;
`;

const LiveBadge = styled.div`
  background: #e6fbe6;
  color: #2ecc71;
  padding: 2px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: bold;
`;

const SignalList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SignalItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SignalInfo = styled.div`
  display: flex;
  gap: 12px;
`;

const ColorBar = styled.div<{ color: string }>`
  width: 4px;
  height: 40px;
  background-color: ${(props) => props.color};
  border-radius: 4px;
`;

const SignalDetails = styled.div`
  font-size: 16px;
  color: #333;
  font-weight: 500;
  text-align: left;
  
  strong {
    display: block;
    font-size: 16px;
    color: #333;
    margin-bottom: 4px;
  }
  
  span {
    display: block;
    color: #666;
    font-size: 12px;
    margin-top: 4px;
  }
`;

const StatusBadge = styled.button<{ status: SignalStatus }>`
  background-color: ${(props) =>
    props.status === 'buy' ? '#27ae60' : '#e74c3c'};
  color: white;
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const LockIcon = styled.span`
  font-size: 16px;
  display: inline-block;
`;

const FooterButton = styled.button`
  margin-top: 28px;
  background: #0b1b38;
  color: white;
  width: 100%;
  border: none;
  border-radius: 9999px;
  padding: 12px 0;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const defaultSignals: Signal[] = [
  { pair: 'EUR/USD', entry: '1.0845', tp: '1.0875', sl: '1.0825', status: 'buy' },
  { pair: 'GBP/USD', entry: '1.2645', tp: '1.2675', sl: '1.2625', status: 'buy' },
  { pair: 'AUD/USD', entry: '0.6545', tp: '0.6575', sl: '0.6525', status: 'buy' },
  { pair: 'CAD/JPY', entry: '110.45', tp: '110.75', sl: '110.25', status: 'buy' },
];

const RecentSignals: React.FC<RecentSignalsProps> = ({
  title = 'Recent Signals',
  isLive = true,
  signals = defaultSignals,
  ctaText = 'Get Premium Signals',
  onCtaClick,
}) => {
  return (
    <Container>
      <Header>
        <Title>{title}</Title>
        {isLive && <LiveBadge>LIVE</LiveBadge>}
      </Header>

      <SignalList>
        {signals.map((signal, idx) => (
          <SignalItem key={idx}>
            <SignalInfo>
              <ColorBar color={signal.status === 'buy' ? '#27ae60' : '#e74c3c'} />
              <SignalDetails>
                <strong>{signal.pair}</strong>
                <span>Entry: {signal.entry} | TP: {signal.tp} | SL: {signal.sl}</span>
              </SignalDetails>
            </SignalInfo>
            <StatusBadge status={signal.status}>
              {signal.status.toUpperCase()}
            </StatusBadge>
          </SignalItem>
        ))}
      </SignalList>

      <FooterButton onClick={onCtaClick}>
        <LockIcon>🔒</LockIcon>
        {ctaText} <img src={ArrowRight} alt="Arrow" />
      </FooterButton>
    </Container>
  );
};

export default RecentSignals;
