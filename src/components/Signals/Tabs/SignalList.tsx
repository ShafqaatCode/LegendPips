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
};

const Container = styled.div`
  width: 440px;
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', sans-serif;
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
  align-items: flex-start;
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
  font-size: 14px;
  color: #838384;
  font-weight: 300;

  span {
    display: block;
    color: #aaa;
    font-size: 11px;
    margin-bottom: 2px;
  }
`;

const StatusBadge = styled.div<{ status: SignalStatus }>`
  background-color: ${(props) =>
    props.status === 'buy' ? '#e6fbe6' : '#ffecec'};
  color: ${(props) => (props.status === 'buy' ? '#2ecc71' : '#ff5c5c')};
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 600;
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
  { pair: 'GBP/JPY', entry: '188.45', tp: '188.15', sl: '188.65', status: 'sell' },
  { pair: 'EUR/USD', entry: '1.0845', tp: '1.0875', sl: '1.0825', status: 'buy' },
  { pair: 'GBP/JPY', entry: '188.45', tp: '188.15', sl: '188.65', status: 'sell' },
];

const RecentSignals: React.FC<RecentSignalsProps> = ({
  title = 'Recent Signals',
  isLive = true,
  signals = defaultSignals,
  ctaText = 'Get Premium Signals',
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
                <span>
                  Entry:{signal.entry} | TP:{signal.tp} | SL:{signal.sl}
                </span>
              </SignalDetails>
            </SignalInfo>
            <StatusBadge status={signal.status}>
              {signal.status.toUpperCase()}
            </StatusBadge>
          </SignalItem>
        ))}
      </SignalList>

      <FooterButton>
        {ctaText} <img src={ArrowRight} alt="Arrow" />
      </FooterButton>
    </Container>
  );
};

export default RecentSignals;
