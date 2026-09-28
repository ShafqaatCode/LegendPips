import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  FiAlertTriangle,
  FiArrowUpRight,
  FiCheckCircle,
  FiFileText,
  FiShield,
} from "react-icons/fi";

const ITEMS = [
  {
    id: "submit",
    step: "01",
    title: "Submit a complaint",
    blurb: "Report withdrawal delays, unfair conditions, or suspected scam brokers — get a ticket ID.",
    to: "/complaints",
    icon: <FiFileText size={18} />,
  },
  {
    id: "shield",
    step: "02",
    title: "Scam Broker Shield",
    blurb: "Check public warnings before you fund an unfamiliar platform.",
    to: "/scam-broker-shield",
    icon: <FiShield size={18} />,
  },
  {
    id: "track",
    step: "03",
    title: "Track your case",
    blurb: "Follow complaint progress from your member panel after you file.",
    to: "/user-panel/complaints",
    icon: <FiCheckCircle size={18} />,
  },
  {
    id: "alert",
    step: "04",
    title: "Warning list",
    blurb: "Browse known issues and community alerts before you trade.",
    to: "/complaints",
    icon: <FiAlertTriangle size={18} />,
  },
] as const;

const ComplaintsSection: React.FC = () => {
  return (
    <Section aria-label="Broker complaints">
      <Inner>
        <Intro>
          <Eyebrow>
            <FiShield size={13} aria-hidden /> Trader protection
          </Eyebrow>
          <Title>Broker complaints</Title>
          <Lead>
            Report issues, check scam warnings, and follow case status — the same protection tools
            traders use across LegendPips.
          </Lead>
          <Primary to="/complaints">
            Open complaint center <FiArrowUpRight />
          </Primary>
        </Intro>

        <List aria-label="Protection tools">
          {ITEMS.map((item) => (
            <Item key={item.id} to={item.to}>
              <Step>{item.step}</Step>
              <Icon aria-hidden>{item.icon}</Icon>
              <Body>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemBlurb>{item.blurb}</ItemBlurb>
              </Body>
              <Go className="go" aria-hidden>
                <FiArrowUpRight />
              </Go>
            </Item>
          ))}
        </List>
      </Inner>
    </Section>
  );
};

export default ComplaintsSection;

const Section = styled.section`
  padding: clamp(2.5rem, 5vw, 3.75rem) ${({ theme }) => theme.typography.pageGutter};
  background: #fff;
  border-top: 1px solid #e8ecf2;
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(240px, 0.85fr) minmax(0, 1.2fr);
  gap: clamp(1.5rem, 4vw, 3.25rem);
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Intro = styled.div`
  padding-top: 0.25rem;
`;

const Eyebrow = styled.p`
  margin: 0 0 0.65rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
`;

const Title = styled.h2`
  margin: 0 0 0.75rem;
  font-size: clamp(1.45rem, 2.2vw, 1.85rem);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.primary};
  max-width: 12ch;
`;

const Lead = styled.p`
  margin: 0 0 1.35rem;
  font-size: 0.92rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.muted};
  max-width: 36ch;
`;

const Primary = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.7rem 1.15rem;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  border-radius: 8px;

  &:hover {
    background: #1a4a7a;
  }
`;

const List = styled.div`
  border: 1px solid #e4e9f0;
  background: #f7f8fb;
  overflow: hidden;
`;

const Item = styled(Link)`
  display: grid;
  grid-template-columns: 2.4rem 2.4rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
  text-decoration: none;
  color: inherit;
  background: #fff;
  border-bottom: 1px solid #eef1f5;
  transition: background 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8fafc;
  }

  &:hover .go {
    color: ${({ theme }) => theme.colors.secondary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 2rem minmax(0, 1fr) auto;
    gap: 0.65rem;

    /* hide icon on very small screens to keep row clean */
    & > :nth-child(2) {
      display: none;
    }
  }
`;

const Step = styled.span`
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
`;

const Icon = styled.span`
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const Body = styled.div`
  min-width: 0;
`;

const ItemTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.01em;
`;

const ItemBlurb = styled.p`
  margin: 0.2rem 0 0;
  font-size: 0.78rem;
  line-height: 1.45;
  color: #64748b;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Go = styled.span`
  color: #cbd5e1;
  display: inline-flex;
  transition: color 0.15s ease;
`;
