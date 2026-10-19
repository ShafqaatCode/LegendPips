import React from "react";
import styled, { keyframes } from "styled-components";
import { FiArrowUpRight, FiLock } from "react-icons/fi";

type SignalStatus = "buy" | "sell";

type Signal = {
  id?: string;
  pair: string;
  entry: string;
  tp: string;
  sl: string;
  status: SignalStatus;
  premium?: boolean;
  locked?: boolean;
};

type RecentSignalsProps = {
  title?: string;
  isLive?: boolean;
  signals?: Signal[];
  ctaText?: string;
  onCtaClick?: () => void;
  loading?: boolean;
  /** Stretch to parent width (signals page). Default card width for homepage. */
  fluid?: boolean;
};

const defaultSignals: Signal[] = [
  { pair: "EUR/USD", entry: "1.0845", tp: "1.0875", sl: "1.0825", status: "buy" },
  { pair: "GBP/USD", entry: "1.2645", tp: "1.2675", sl: "1.2625", status: "buy" },
  { pair: "AUD/USD", entry: "0.6545", tp: "0.6575", sl: "0.6525", status: "buy" },
  { pair: "CAD/JPY", entry: "110.45", tp: "110.75", sl: "110.25", status: "buy" },
];

const RecentSignals: React.FC<RecentSignalsProps> = ({
  title = "Recent Signals",
  isLive = true,
  signals = defaultSignals,
  ctaText = "Get Premium Signals",
  onCtaClick,
  loading = false,
  fluid = false,
}) => {
  const rows = loading ? defaultSignals.slice(0, 4) : signals;

  return (
    <Container $fluid={fluid}>
      <Header>
        <Title>{title}</Title>
        {isLive && !loading ? (
          <LiveBadge>
            <Pulse />
            LIVE
          </LiveBadge>
        ) : loading ? (
          <LiveBadge $muted>Updating…</LiveBadge>
        ) : null}
      </Header>

      <List role="list">
        {rows.map((signal, idx) => {
          const locked =
            !!signal.locked ||
            (!!signal.premium && (signal.entry === "••••" || signal.tp === "••••"));
          return (
            <Row key={signal.id || `${signal.pair}-${idx}`} role="listitem" $loading={loading}>
              <Left>
                <ColorBar $status={signal.status} />
                <Details>
                  <strong>
                    {signal.pair}
                    {signal.premium ? <PremiumTag>Premium</PremiumTag> : null}
                  </strong>
                  {locked ? (
                    <LockedLine>
                      <FiLock aria-hidden />
                      Levels locked — unlock with live account
                    </LockedLine>
                  ) : (
                    <span>
                      Entry: {signal.entry} | TP: {signal.tp} | SL: {signal.sl}
                    </span>
                  )}
                </Details>
              </Left>
              <StatusBadge $status={signal.status} type="button" tabIndex={-1}>
                {signal.status.toUpperCase()}
              </StatusBadge>
            </Row>
          );
        })}
        {!loading && signals.length === 0 && <Empty>No active signals in this market right now.</Empty>}
      </List>

      <FooterButton type="button" onClick={onCtaClick}>
        <FiLock aria-hidden />
        {ctaText}
        <FiArrowUpRight aria-hidden />
      </FooterButton>
    </Container>
  );
};

export default RecentSignals;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.45; transform: scale(0.85); }
`;

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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.35rem;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #132e58;
  letter-spacing: -0.01em;
`;

const LiveBadge = styled.div<{ $muted?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: ${({ $muted }) => ($muted ? "#f1f5f9" : "#e6fbe6")};
  color: ${({ $muted }) => ($muted ? "#64748b" : "#2ecc71")};
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  flex-shrink: 0;
`;

const Pulse = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  animation: ${pulse} 1.4s ease-in-out infinite;
`;

const List = styled.div`
  margin-top: 0.85rem;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div<{ $loading?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid #f0f0f0;
  opacity: ${({ $loading }) => ($loading ? 0.55 : 1)};

  &:last-of-type {
    border-bottom: none;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex: 1;
`;

const ColorBar = styled.div<{ $status: SignalStatus }>`
  width: 4px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 4px;
  background: ${({ $status }) => ($status === "buy" ? "#27ae60" : "#e74c3c")};
`;

const Details = styled.div`
  min-width: 0;
  text-align: left;

  strong {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
    font-size: 0.95rem;
    font-weight: 700;
    color: #132e58;
    margin-bottom: 0.25rem;
  }

  span {
    display: block;
    font-size: 0.72rem;
    line-height: 1.4;
    color: #64748b;
  }
`;

const PremiumTag = styled.em`
  font-style: normal;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #b45309;
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 999px;
  padding: 0.1rem 0.4rem;
`;

const LockedLine = styled.span`
  display: inline-flex !important;
  align-items: center;
  gap: 0.35rem;
  color: #94a3b8 !important;
  font-weight: 600;
`;

const StatusBadge = styled.button<{ $status: SignalStatus }>`
  flex-shrink: 0;
  background: ${({ $status }) => ($status === "buy" ? "#27ae60" : "#e74c3c")};
  color: #fff;
  padding: 0.4rem 0.85rem;
  font-size: 0.72rem;
  font-weight: 700;
  border: none;
  border-radius: 6px;
  cursor: default;
  font-family: inherit;
  letter-spacing: 0.03em;
`;

const Empty = styled.p`
  margin: 0.75rem 0;
  padding: 1rem;
  text-align: center;
  font-size: 0.85rem;
  color: #64748b;
`;

const FooterButton = styled.button`
  margin-top: 1.15rem;
  background: #0b1b38;
  color: #fff;
  width: 100%;
  border: none;
  border-radius: 999px;
  padding: 0.8rem 1rem;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.45rem;
  font-family: inherit;
  transition: opacity 0.15s ease, transform 0.15s ease;

  &:hover {
    opacity: 0.94;
    transform: translateY(-1px);
  }
`;
