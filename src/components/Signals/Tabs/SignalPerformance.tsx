import React from 'react';
import styled from 'styled-components';

type Stat = {
  value: string;
  label: string;
  bgColor: string;
  textColor?: string;
};

type InfoRow = {
  label: string;
  value: string;
};

type SignalPerformanceProps = {
  title?: string;
  stats?: Stat[];
  info?: InfoRow[];
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

const Title = styled.h2`
  font-size: 20px;
  font-weight: 500;
  color: #303030;
  margin-bottom: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const StatBox = styled.div<{ bg: string; color?: string }>`
  background-color: ${(props) => props.bg};
  color: ${(props) => props.color || '#333'};
  border-radius: 12px;
  padding: 16px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #555;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 11px;
  }
`;

const InfoList = styled.div`
  margin-top: 24px;
  font-size: 13px;
  font-weight: 300;
  color: #444;
  line-height: 1.8;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InfoRowStyled = styled.div`
  display: flex;
  justify-content: space-between;
`;

// Default values
const defaultStats: Stat[] = [
  { value: '87%', label: 'Win Rate', bgColor: '#e6fbe6', textColor: '#2ecc71' },
  { value: '1248', label: 'Total Pips', bgColor: '#e3f2fd', textColor: '#2196f3' },
  { value: '+$2340', label: 'Total Profit', bgColor: '#fff8e6', textColor: '#f4b400' },
  { value: '947', label: 'Open Signals', bgColor: '#f3e5f5', textColor: '#9c27b0' },
];

const defaultInfo: InfoRow[] = [
  { label: 'Free Signal to Premium Signal', value: '' },
  { label: 'Open Only Premium Signals', value: '' },
];

const SignalPerformance: React.FC<SignalPerformanceProps> = ({
  title = 'Signal Performance',
  stats = defaultStats,
  info = defaultInfo,
}) => {
  return (
    <Container>
      <Title>{title}</Title>
      <Grid>
        {stats.map((stat, index) => (
          <StatBox key={index} bg={stat.bgColor} color={stat.textColor}>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatBox>
        ))}
      </Grid>
      <InfoList>
        {info.map((row, index) => (
          <InfoRowStyled key={index}>
            <span>{row.label}</span>
            {row.value && <span>{row.value}</span>}
          </InfoRowStyled>
        ))}
      </InfoList>
    </Container>
  );
};

export default SignalPerformance;
