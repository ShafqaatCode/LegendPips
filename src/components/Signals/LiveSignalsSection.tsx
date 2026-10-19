import React, { useState } from "react";
import styled from "styled-components";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";
import RecentSignals from "./Tabs/SignalList";
import SignalPerformance from "./Tabs/SignalPerformance";

type TabSignal = {
  id?: string;
  pair: string;
  entry: string;
  tp: string;
  sl: string;
  status: "buy" | "sell";
  premium?: boolean;
  locked?: boolean;
};

interface LiveSignalsSectionProps {
  onCtaClick?: () => void;
  forexSignals?: TabSignal[];
  cryptoSignals?: TabSignal[];
  loading?: boolean;
  ctaText?: string;
}

const defaultForex: TabSignal[] = [
  { pair: "EUR/USD", entry: "1.0845", tp: "1.0875", sl: "1.0825", status: "buy" },
  { pair: "GBP/USD", entry: "1.2645", tp: "1.2675", sl: "1.2625", status: "buy" },
  { pair: "AUD/USD", entry: "0.6545", tp: "0.6575", sl: "0.6525", status: "buy" },
  { pair: "CAD/JPY", entry: "110.45", tp: "110.75", sl: "110.25", status: "buy" },
];

const defaultCryptoGold: TabSignal[] = [
  { pair: "XAU/USD", entry: "2340", tp: "2365", sl: "2320", status: "buy" },
  { pair: "BTC/USD", entry: "43250", tp: "44500", sl: "42500", status: "buy" },
  { pair: "ETH/USD", entry: "2650", tp: "2750", sl: "2600", status: "buy" },
  { pair: "XAG/USD", entry: "28.40", tp: "29.10", sl: "27.80", status: "buy" },
];

const LiveSignalsSection: React.FC<LiveSignalsSectionProps> = ({
  onCtaClick,
  forexSignals: forexProp,
  cryptoSignals: cryptoProp,
  loading = false,
  ctaText = "Get Premium Signals",
}) => {
  const [activeTab, setActiveTab] = useState<"forex" | "cryptoGold">("forex");

  const forexSignals = forexProp?.length ? forexProp : defaultForex;
  const cryptoGoldSignals = cryptoProp?.length ? cryptoProp : defaultCryptoGold;
  const activeSignals = activeTab === "forex" ? forexSignals : cryptoGoldSignals;

  return (
    <SectionWrapper id="live-signals">
      <SectionHeadingSet
        upperText="ALL IN ONE TRADING PLATFORM"
        mainHeading="LIVE SIGNALS"
        subText="Stay ahead with clear live setups across Forex, Gold, and Crypto — entry, take-profit, and stop-loss on every idea."
      />

      <TabsContainer>
        <TabsWrapper role="tablist" aria-label="Signal markets">
          <Tab
            type="button"
            role="tab"
            aria-selected={activeTab === "forex"}
            active={activeTab === "forex"}
            onClick={() => setActiveTab("forex")}
          >
            Forex
            <Count>{forexSignals.length}</Count>
          </Tab>
          <Tab
            type="button"
            role="tab"
            aria-selected={activeTab === "cryptoGold"}
            active={activeTab === "cryptoGold"}
            onClick={() => setActiveTab("cryptoGold")}
          >
            Gold & Crypto
            <Count>{cryptoGoldSignals.length}</Count>
          </Tab>
        </TabsWrapper>
      </TabsContainer>

      <ContentWrapper>
        <RecentSignals
          title={activeTab === "forex" ? "Active Forex setups" : "Active Gold & Crypto setups"}
          isLive={!loading}
          signals={activeSignals}
          ctaText={ctaText}
          onCtaClick={onCtaClick}
          loading={loading}
          fluid
        />
        <SignalPerformance
          title="Signal performance"
          stats={[
            { value: "87%", label: "Win rate", bgColor: "#e6fbe6", textColor: "#15803d" },
            { value: "1,248", label: "Total pips", bgColor: "#e3f2fd", textColor: "#132e58" },
            { value: "+$2,340", label: "Sample profit", bgColor: "#f7f3e8", textColor: "#a16207" },
            { value: "24/7", label: "Coverage", bgColor: "#eef2ff", textColor: "#4338ca" },
          ]}
          info={[
            { label: "Free preview", value: "Live board above" },
            { label: "Premium access", value: "Full feed + alerts" },
            { label: "Alert methods", value: "Email, SMS, Telegram" },
          ]}
          onCtaClick={onCtaClick}
          fluid
        />
      </ContentWrapper>
    </SectionWrapper>
  );
};

export default LiveSignalsSection;

const SectionWrapper = styled.section`
  background: #f7f9fc;
  padding: 3.25rem ${({ theme }) => theme.typography.pageGutter} 2.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding-top: 2.25rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 0.25rem 0 1.5rem;
`;

const TabsWrapper = styled.div`
  display: inline-flex;
  gap: 0.25rem;
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 12px;
  padding: 0.3rem;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.04);
`;

const Tab = styled.button<{ active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: ${({ active }) => (active ? "#132e58" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "#132e58")};
  border: none;
  padding: 0.65rem 1.1rem;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  border-radius: 9px;
  font-family: inherit;
  transition: background 0.18s ease, color 0.18s ease;

  &:hover {
    background: ${({ active }) => (active ? "#132e58" : "rgba(19, 46, 88, 0.06)")};
  }
`;

const Count = styled.span`
  display: inline-flex;
  min-width: 1.35rem;
  height: 1.35rem;
  padding: 0 0.35rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 800;
  background: rgba(251, 193, 19, 0.95);
  color: #132e58;
`;

const ContentWrapper = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(260px, 0.85fr);
  gap: 1.1rem;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;
