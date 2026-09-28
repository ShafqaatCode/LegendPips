import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiArrowRight } from "react-icons/fi";
import TradingViewWidget from "../MarketCharts/TradingViewWidget";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";
import {
  DEFAULT_LIVE_CHART_SYMBOL,
  LIVE_CHART_SYMBOLS,
} from "../../data/liveChartSymbols";

const TV_ADVANCED =
  "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

const FOREX_PICKS = LIVE_CHART_SYMBOLS.filter((s) => s.group === "forex").slice(0, 5);

/**
 * Compact mid-page TradingView forex chart (homepage).
 */
const HomeLiveForexCharts: React.FC = () => {
  const [symbolId, setSymbolId] = useState(
    FOREX_PICKS[0]?.id ?? DEFAULT_LIVE_CHART_SYMBOL.id
  );

  const active = useMemo(
    () =>
      LIVE_CHART_SYMBOLS.find((s) => s.id === symbolId) ??
      FOREX_PICKS[0] ??
      DEFAULT_LIVE_CHART_SYMBOL,
    [symbolId]
  );

  const chartConfig = useMemo(
    () => ({
      width: "100%",
      height: 300,
      symbol: active.tvSymbol,
      interval: "60",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      allow_symbol_change: false,
      calendar: false,
      support_host: "https://www.tradingview.com",
      hide_top_toolbar: true,
      hide_legend: true,
      hide_side_toolbar: true,
      withdateranges: false,
      save_image: false,
      details: false,
      hotlist: false,
    }),
    [active.tvSymbol]
  );

  return (
    <Section>
      <Inner>
        <SectionHeadingSet
          upperText="MARKET TOOLS"
          mainHeading="Live Forex Charts"
          subText="Real-time FX pairs powered by TradingView — peek here, open the full desk for more markets."
        />

        <Panel>
          <Toolbar>
            <Pairs role="tablist" aria-label="Forex pairs">
              {FOREX_PICKS.map((s) => (
                <PairBtn
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={s.id === active.id}
                  $active={s.id === active.id}
                  onClick={() => setSymbolId(s.id)}
                >
                  {s.label}
                </PairBtn>
              ))}
            </Pairs>
            <MoreLink to="/live-charts">
              Full charts <FiArrowRight size={14} />
            </MoreLink>
          </Toolbar>

          <ChartFrame>
            <TradingViewWidget scriptSrc={TV_ADVANCED} config={chartConfig} minHeight={300} />
          </ChartFrame>

          <Foot>
            Chart data by{" "}
            <a href="https://www.tradingview.com/" target="_blank" rel="noopener noreferrer">
              TradingView
            </a>
            · indicative prices
          </Foot>
        </Panel>
      </Inner>
    </Section>
  );
};

export default HomeLiveForexCharts;

const Section = styled.section`
  background: linear-gradient(180deg, #ffffff 0%, #f5f7fb 48%, #ffffff 100%);
  padding: clamp(2rem, 4vw, 2.75rem) 0;
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.15rem;
`;

const Panel = styled.div`
  width: 100%;
  max-width: 920px;
  background: #fff;
  border: 1px solid #e6ebf2;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(19, 46, 88, 0.04), 0 12px 28px rgba(19, 46, 88, 0.06);
  overflow: hidden;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem;
  flex-wrap: wrap;
  padding: 0.7rem 0.85rem;
  border-bottom: 1px solid #eef2f7;
  background: linear-gradient(180deg, #fafbfc 0%, #fff 100%);
`;

const Pairs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  min-width: 0;
`;

const PairBtn = styled.button<{ $active?: boolean }>`
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary : "#e5e9f0")};
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#475569")};
  border-radius: 8px;
  padding: 0.32rem 0.65rem;
  font-size: 0.72rem;
  font-weight: 700;
  font-family: inherit;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ $active, theme }) => ($active ? "#fff" : theme.colors.primary)};
  }
`;

const MoreLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  white-space: nowrap;
  margin-left: auto;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const ChartFrame = styled.div`
  width: 100%;
  min-height: 300px;
  background: #f8fafc;

  @media (max-width: 640px) {
    min-height: 260px;
  }
`;

const Foot = styled.p`
  margin: 0;
  padding: 0.45rem 0.85rem 0.55rem;
  font-size: 0.68rem;
  color: #94a3b8;
  border-top: 1px solid #eef2f7;
  background: #fafbfc;

  a {
    color: #64748b;
    font-weight: 600;
    text-decoration: none;
    margin-right: 0.25rem;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
      text-decoration: underline;
    }
  }
`;
