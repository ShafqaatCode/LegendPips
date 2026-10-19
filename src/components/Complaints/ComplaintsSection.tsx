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

type Accent = "navy" | "gold" | "blue" | "warn";

const ITEMS: {
  id: string;
  step: string;
  title: string;
  blurb: string;
  to: string;
  icon: React.ReactNode;
  accent: Accent;
  badge?: string;
}[] = [
  {
    id: "submit",
    step: "01",
    title: "Submit a complaint",
    blurb: "Report withdrawal delays, unfair conditions, or suspected scam brokers — get a ticket ID.",
    to: "/complaints",
    icon: <FiFileText size={18} />,
    accent: "navy",
    badge: "Start here",
  },
  {
    id: "shield",
    step: "02",
    title: "Scam Broker Shield",
    blurb: "Check public warnings before you fund an unfamiliar platform.",
    to: "/scam-broker-shield",
    icon: <FiShield size={18} />,
    accent: "blue",
  },
  {
    id: "track",
    step: "03",
    title: "Track your case",
    blurb: "Follow complaint progress from your member panel after you file.",
    to: "/user-panel/complaints",
    icon: <FiCheckCircle size={18} />,
    accent: "gold",
  },
  {
    id: "alert",
    step: "04",
    title: "Warning list",
    blurb: "Browse known issues and community alerts before you trade.",
    to: "/complaints",
    icon: <FiAlertTriangle size={18} />,
    accent: "warn",
  },
];

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
          <IntroActions>
            <Primary to="/complaints">
              Open complaint center <FiArrowUpRight />
            </Primary>
            <TextLink to="/scam-broker-shield">
              Scam Broker Shield <FiArrowUpRight />
            </TextLink>
          </IntroActions>
        </Intro>

        <ListCol>
          <ListHeader>
            <span>Protection tools</span>
            <ListHeaderHint>File · check · track</ListHeaderHint>
          </ListHeader>
          <List aria-label="Protection tools">
            {ITEMS.map((item, i) => (
              <Item key={item.id} to={item.to} $featured={i === 0} $accent={item.accent}>
                <Step $featured={i === 0}>{item.step}</Step>
                <Icon $accent={item.accent} aria-hidden>
                  {item.icon}
                </Icon>
                <Body>
                  <TitleRow>
                    <ItemTitle>{item.title}</ItemTitle>
                    {item.badge && <Badge>{item.badge}</Badge>}
                  </TitleRow>
                  <ItemBlurb>{item.blurb}</ItemBlurb>
                </Body>
                <Go className="go" aria-hidden>
                  <FiArrowUpRight />
                </Go>
              </Item>
            ))}
          </List>
          <ListFoot to="/complaints">
            View all complaints &amp; alerts <FiArrowUpRight />
          </ListFoot>
        </ListCol>
      </Inner>
    </Section>
  );
};

export default ComplaintsSection;

const accentMap: Record<
  Accent,
  { bg: string; color: string; border: string; glow: string }
> = {
  navy: {
    bg: "rgba(19, 46, 88, 0.1)",
    color: "#132e58",
    border: "rgba(19, 46, 88, 0.18)",
    glow: "rgba(19, 46, 88, 0.08)",
  },
  blue: {
    bg: "rgba(29, 78, 216, 0.1)",
    color: "#1d4ed8",
    border: "rgba(29, 78, 216, 0.22)",
    glow: "rgba(29, 78, 216, 0.08)",
  },
  gold: {
    bg: "rgba(251, 191, 36, 0.16)",
    color: "#b45309",
    border: "rgba(251, 191, 36, 0.45)",
    glow: "rgba(251, 191, 36, 0.12)",
  },
  warn: {
    bg: "rgba(220, 38, 38, 0.08)",
    color: "#b91c1c",
    border: "rgba(220, 38, 38, 0.2)",
    glow: "rgba(220, 38, 38, 0.06)",
  },
};

const Section = styled.section`
  padding: clamp(2.5rem, 5vw, 3.75rem) ${({ theme }) => theme.typography.pageGutter};
  background:
    radial-gradient(ellipse 55% 50% at 100% 0%, rgba(251, 191, 36, 0.1), transparent 55%),
    radial-gradient(ellipse 50% 45% at 0% 100%, rgba(29, 78, 216, 0.08), transparent 50%),
    #f7f8fb;
  border-top: 1px solid #e8ecf2;
  border-bottom: 1px solid #e8ecf2;
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

const IntroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem 1.1rem;
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
  transition: background 0.15s ease, transform 0.15s ease;

  &:hover {
    background: #1a4a7a;
    transform: translateY(-1px);
  }
`;

const TextLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const ListCol = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(19, 46, 88, 0.06);
`;

const ListHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 1.15rem;
  background: linear-gradient(135deg, #132e58 0%, #1a3d6e 100%);
  color: #fff;

  span:first-child {
    font-size: 0.82rem;
    font-weight: 800;
    letter-spacing: 0.02em;
  }
`;

const ListHeaderHint = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.72);
`;

const List = styled.div`
  padding: 0.4rem 0.55rem;
`;

const Item = styled(Link)<{ $featured?: boolean; $accent: Accent }>`
  display: grid;
  grid-template-columns: 2.5rem 2.65rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.85rem;
  margin: 0.2rem 0;
  padding: 0.9rem 0.8rem;
  text-decoration: none;
  color: inherit;
  border-radius: 12px;
  border: 1px solid transparent;
  background: ${({ $featured }) =>
    $featured ? "linear-gradient(90deg, #fffbeb 0%, #fff 55%)" : "transparent"};
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    background: #f8fafc;
    border-color: ${({ $accent }) => accentMap[$accent].border};
    box-shadow: 0 8px 20px ${({ $accent }) => accentMap[$accent].glow};
    transform: translateY(-1px);
  }

  &:hover .go {
    color: ${({ theme }) => theme.colors.secondary};
    transform: translate(2px, -2px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 2.2rem minmax(0, 1fr) auto;
    gap: 0.65rem;

    & > :nth-child(1) {
      display: none;
    }
  }
`;

const Step = styled.span<{ $featured?: boolean }>`
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
  color: ${({ $featured, theme }) => ($featured ? theme.colors.secondary : "#94a3b8")};
`;

const Icon = styled.span<{ $accent: Accent }>`
  width: 2.65rem;
  height: 2.65rem;
  border-radius: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ $accent }) => accentMap[$accent].bg};
  color: ${({ $accent }) => accentMap[$accent].color};
  border: 1px solid ${({ $accent }) => accentMap[$accent].border};
`;

const Body = styled.div`
  min-width: 0;
`;

const TitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 0.55rem;
`;

const ItemTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.015em;
`;

const Badge = styled.span`
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #92400e;
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 999px;
  padding: 0.15rem 0.45rem;
`;

const ItemBlurb = styled.p`
  margin: 0.28rem 0 0;
  font-size: 0.78rem;
  line-height: 1.5;
  color: #64748b;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Go = styled.span`
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  background: #f1f5f9;
  transition: color 0.18s ease, transform 0.18s ease, background 0.18s ease;
  flex-shrink: 0;
`;

const ListFoot = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.85rem 1rem;
  border-top: 1px solid #eef1f5;
  font-size: 0.82rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  background: #fafbfc;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
    background: #fff;
  }
`;
