import React from "react";
import styled from "styled-components";
import { FiArrowUpRight } from "react-icons/fi";

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
  onCtaClick?: () => void;
  /** Stretch to parent width (signals page). Default card width for homepage. */
  fluid?: boolean;
};

const defaultStats: Stat[] = [
  { value: "87%", label: "Win Rate", bgColor: "#e6fbe6", textColor: "#2ecc71" },
  { value: "1,248", label: "Total Pips", bgColor: "#e3f2fd", textColor: "#2196f3" },
  { value: "+$2,340", label: "Sample Profit", bgColor: "#f7f3e8", textColor: "#a16207" },
  { value: "24/7", label: "Coverage", bgColor: "#eef2ff", textColor: "#4338ca" },
];

const defaultInfo: InfoRow[] = [
  { label: "Free Signals:", value: "3 per day" },
  { label: "Premium Signals:", value: "Unlimited" },
  { label: "Alert Methods:", value: "Email, SMS, Telegram" },
];

const SignalPerformance: React.FC<SignalPerformanceProps> = ({
  title = "Signal Performance",
  stats = defaultStats,
  info = defaultInfo,
  onCtaClick,
  fluid = false,
}) => {
  return (
    <Container $fluid={fluid}>
      <Title>{title}</Title>
      <Grid>
        {stats.map((stat) => (
          <StatBox key={stat.label} $bg={stat.bgColor} $color={stat.textColor}>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatBox>
        ))}
      </Grid>
      <InfoList>
        {info.map((row) => (
          <InfoRowStyled key={row.label}>
            <span>{row.label}</span>
            {row.value ? <strong>{row.value}</strong> : null}
          </InfoRowStyled>
        ))}
      </InfoList>
      {onCtaClick ? (
        <SideCta type="button" onClick={onCtaClick}>
          Unlock full feed <FiArrowUpRight />
        </SideCta>
      ) : null}
    </Container>
  );
};

export default SignalPerformance;

const Container = styled.div<{ $fluid?: boolean }>`
  width: 100%;
  max-width: ${({ $fluid }) => ($fluid ? "100%" : "440px")};
  background: #fff;
  border-radius: 12px;
  padding: 1.35rem 1.25rem 1.35rem;
  border: 1px solid #e8ecf1;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);
  text-align: left;
  font-family: inherit;
`;

const Title = styled.h2`
  margin: 0 0 1rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: #132e58;
  letter-spacing: -0.01em;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

const StatBox = styled.div<{ $bg: string; $color?: string }>`
  background-color: ${(p) => p.$bg};
  color: ${(p) => p.$color || "#132e58"};
  border-radius: 12px;
  padding: 0.95rem 0.75rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
`;

const StatLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
`;

const InfoList = styled.div`
  margin-top: 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  font-size: 0.8rem;
  color: #475569;
`;

const InfoRowStyled = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  line-height: 1.45;

  strong {
    color: #132e58;
    font-weight: 700;
    text-align: right;
  }
`;

const SideCta = styled.button`
  margin-top: 1rem;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(201, 151, 18, 0.4);
  background: rgba(201, 151, 18, 0.1);
  color: #132e58;
  font-weight: 800;
  font-size: 0.84rem;
  font-family: inherit;
  cursor: pointer;

  &:hover {
    background: rgba(201, 151, 18, 0.18);
  }
`;
