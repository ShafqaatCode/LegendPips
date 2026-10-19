import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiArrowRight, FiActivity } from "react-icons/fi";
import TradingViewWidget from "../MarketCharts/TradingViewWidget";
import {
  DEFAULT_LIVE_CHART_SYMBOL,
  LIVE_CHART_SYMBOLS,
  type LiveChartSymbol,
} from "../../data/liveChartSymbols";

const TV_ADVANCED =
  "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

const CHART_HEIGHT = 560;

/** Homepage desk symbols — same mix traders expect on a verify-style chart. */
const DESK_SYMBOLS: LiveChartSymbol[] = [
  ...LIVE_CHART_SYMBOLS.filter((s) => s.group === "forex"),
  ...LIVE_CHART_SYMBOLS.filter((s) => s.group === "metals"),
  ...LIVE_CHART_SYMBOLS.filter((s) => s.group === "crypto"),
  ...LIVE_CHART_SYMBOLS.filter((s) => s.group === "indices"),
];

/**
 * Homepage TradingView desk — brand navy/gold chrome + light candlestick chart.
 * No default indicators/studies.
 */
const HomeLiveForexCharts: React.FC = () => {
  const [symbolId, setSymbolId] = useState(
    DESK_SYMBOLS[0]?.id ?? DEFAULT_LIVE_CHART_SYMBOL.id
  );

  const active = useMemo(
    () =>
      DESK_SYMBOLS.find((s) => s.id === symbolId) ??
      DESK_SYMBOLS[0] ??
      DEFAULT_LIVE_CHART_SYMBOL,
    [symbolId]
  );

  const chartConfig = useMemo(
    () => ({
      width: "100%",
      height: CHART_HEIGHT,
      symbol: active.tvSymbol,
      interval: "60",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      toolbar_bg: "#f8fafc",
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_side_toolbar: false,
      withdateranges: true,
      save_image: true,
      details: false,
      hotlist: false,
      studies: [],
      support_host: "https://www.tradingview.com",
    }),
    [active.tvSymbol]
  );

  const groups = useMemo(() => {
    const order: LiveChartSymbol["group"][] = ["forex", "metals", "crypto", "indices"];
    return order
      .map((g) => ({
        key: g,
        label:
          g === "forex"
            ? "Forex"
            : g === "metals"
              ? "Metals"
              : g === "crypto"
                ? "Crypto"
                : "Indices",
        items: DESK_SYMBOLS.filter((s) => s.group === g),
      }))
      .filter((g) => g.items.length > 0);
  }, []);

  return (
    <Section>
      <Inner>
        <Header>
          <HeaderCopy>
            <Eyebrow>
              <FiActivity size={13} aria-hidden /> Live market desk
            </Eyebrow>
            <Title>{active.label} price chart</Title>
            <Sub>
              Live candlestick chart with timeframes and drawing tools — styled for LegendPips, with
              no indicators loaded by default. Switch symbols from the rail or open the full desk.
            </Sub>
          </HeaderCopy>
          <HeaderMeta>
            <PriceLabel>Watching</PriceLabel>
            <PriceValue>{active.label}</PriceValue>
            <MoreLink to="/live-charts">
              Full charts <FiArrowRight size={14} />
            </MoreLink>
          </HeaderMeta>
        </Header>

        <Desk>
          <SymbolRail aria-label="Chart symbols">
            {groups.map((group) => (
              <React.Fragment key={group.key}>
                <RailGroup>{group.label}</RailGroup>
                {group.items.map((s) => (
                  <RailBtn
                    key={s.id}
                    type="button"
                    $active={s.id === active.id}
                    onClick={() => setSymbolId(s.id)}
                    aria-pressed={s.id === active.id}
                  >
                    {s.label}
                  </RailBtn>
                ))}
              </React.Fragment>
            ))}
          </SymbolRail>

          <ChartPane>
            <TradingViewWidget
              key={active.tvSymbol}
              scriptSrc={TV_ADVANCED}
              config={chartConfig}
              minHeight={CHART_HEIGHT}
            />
          </ChartPane>
        </Desk>

        <Foot>
          Chart data by{" "}
          <a href="https://www.tradingview.com/" target="_blank" rel="noopener noreferrer">
            TradingView
          </a>
          · indicative prices · no indicators pre-loaded
        </Foot>
      </Inner>
    </Section>
  );
};

export default HomeLiveForexCharts;

const Section = styled.section`
  background:
    radial-gradient(ellipse 60% 45% at 100% 0%, rgba(29, 78, 216, 0.06), transparent 55%),
    linear-gradient(180deg, #ffffff 0%, #f5f7fb 50%, #ffffff 100%);
  padding: clamp(2.25rem, 4.5vw, 3.25rem) 0;
  border-top: 1px solid #e8ecf2;
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.25rem;
  flex-wrap: wrap;
`;

const HeaderCopy = styled.div`
  min-width: 0;
  flex: 1 1 280px;
`;

const Eyebrow = styled.p`
  margin: 0 0 0.45rem;
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
  margin: 0 0 0.4rem;
  font-size: clamp(1.35rem, 2.2vw, 1.75rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.primary};
`;

const Sub = styled.p`
  margin: 0;
  max-width: 52ch;
  font-size: 0.88rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.muted};
`;

const HeaderMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.15rem;
  text-align: right;
`;

const PriceLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #94a3b8;
`;

const PriceValue = styled.span`
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.primary};
`;

const MoreLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.35rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const Desk = styled.div`
  display: grid;
  grid-template-columns: 152px minmax(0, 1fr);
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(19, 46, 88, 0.08);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const SymbolRail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.75rem 0.55rem;
  background: linear-gradient(180deg, #132e58 0%, #0f2448 100%);
  border-right: 1px solid rgba(251, 191, 36, 0.18);
  max-height: ${CHART_HEIGHT + 8}px;
  overflow-y: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    max-height: none;
    border-right: none;
    border-bottom: 1px solid rgba(251, 191, 36, 0.18);
    padding: 0.65rem 0.7rem;
    gap: 0.35rem;
  }
`;

const RailGroup = styled.div`
  margin: 0.45rem 0.35rem 0.2rem;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(251, 191, 36, 0.85);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    margin: 0.25rem 0 0;
  }

  &:first-child {
    margin-top: 0;
  }
`;

const RailBtn = styled.button<{ $active?: boolean }>`
  appearance: none;
  width: 100%;
  text-align: left;
  border: 1px solid
    ${({ $active }) => ($active ? "rgba(251, 191, 36, 0.55)" : "transparent")};
  background: ${({ $active }) => ($active ? "rgba(251, 191, 36, 0.18)" : "transparent")};
  color: ${({ $active }) => ($active ? "#fbbf24" : "rgba(255, 255, 255, 0.82)")};
  border-radius: 8px;
  padding: 0.48rem 0.55rem;
  font-size: 0.78rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: auto;
    padding: 0.38rem 0.65rem;
  }
`;

const ChartPane = styled.div`
  min-width: 0;
  min-height: ${CHART_HEIGHT}px;
  background: #f8fafc;
`;

const Foot = styled.p`
  margin: 0;
  font-size: 0.7rem;
  color: #94a3b8;

  a {
    color: #64748b;
    font-weight: 600;
    text-decoration: none;
    margin-right: 0.2rem;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
      text-decoration: underline;
    }
  }
`;
