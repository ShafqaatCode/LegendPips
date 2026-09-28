import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiActivity, FiArrowRight, FiBarChart2, FiBell } from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import TradingViewWidget from "../../components/MarketCharts/TradingViewWidget";
import { DEFAULT_LIVE_CHART_SYMBOL, LIVE_CHART_SYMBOLS } from "../../data/liveChartSymbols";
import { useAuth } from "../../contexts/AuthContext";
import { createPriceAlert } from "../../services/priceAlertService";

const TV_ADVANCED =
  "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
const TV_HEATMAP =
  "https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js";
const TV_TICKER =
  "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";

const LiveChartsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [symbolId, setSymbolId] = useState(DEFAULT_LIVE_CHART_SYMBOL.id);
  const [alertPrice, setAlertPrice] = useState("");
  const [alertCondition, setAlertCondition] = useState<"above" | "below">("above");
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [alertSaving, setAlertSaving] = useState(false);

  const active = useMemo(
    () => LIVE_CHART_SYMBOLS.find((s) => s.id === symbolId) ?? DEFAULT_LIVE_CHART_SYMBOL,
    [symbolId]
  );

  const chartConfig = useMemo(
    () => ({
      width: "100%",
      height: 520,
      symbol: active.tvSymbol,
      interval: "15",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
      hide_top_toolbar: false,
      hide_legend: false,
      withdateranges: true,
      save_image: false,
      studies: ["STD;RSI"],
    }),
    [active.tvSymbol]
  );

  const heatmapConfig = useMemo(
    () => ({
      width: "100%",
      height: 420,
      currencies: ["EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD", "NZD"],
      isTransparent: false,
      colorTheme: "light",
      locale: "en",
    }),
    []
  );

  const tickerConfig = useMemo(
    () => ({
      symbols: [
        { proName: "FX:EURUSD", title: "EUR/USD" },
        { proName: "FX:GBPUSD", title: "GBP/USD" },
        { proName: "OANDA:XAUUSD", title: "Gold" },
        { proName: "BINANCE:BTCUSDT", title: "BTC/USDT" },
        { proName: "FOREXCOM:NAS100", title: "NAS100" },
      ],
      showSymbolLogo: true,
      isTransparent: false,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en",
    }),
    []
  );

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <Eyebrow>
            <FiActivity aria-hidden /> Market tools
          </Eyebrow>
          <Title>Live Forex Charts</Title>
          <Lead>
            Interactive forex, metals, crypto, and index charts powered by TradingView — no API key required on
            your side. Switch symbols below or use the chart toolbar for timeframes and studies.
          </Lead>
          <HeroLinks>
            <HeroLink to="/analysis">
              Market analysis <FiArrowRight />
            </HeroLink>
            <HeroLink to="/spread-comparison">Spread comparison</HeroLink>
          </HeroLinks>
        </HeroInner>
      </Hero>

      <TickerBand>
        <TradingViewWidget scriptSrc={TV_TICKER} config={tickerConfig} minHeight={46} />
      </TickerBand>

      <Page>
        <SymbolBar>
          <SymbolLabel>Symbol</SymbolLabel>
          <SymbolChips>
            {LIVE_CHART_SYMBOLS.map((s) => (
              <Chip
                key={s.id}
                type="button"
                $active={s.id === symbolId}
                onClick={() => setSymbolId(s.id)}
              >
                {s.label}
              </Chip>
            ))}
          </SymbolChips>
        </SymbolBar>

        {isAuthenticated && (
          <AlertBar>
            <FiBell aria-hidden />
            <span>Set price alert for <strong>{active.label}</strong></span>
            <AlertInput
              type="number"
              step="any"
              min="0"
              placeholder="Target price"
              value={alertPrice}
              onChange={(e) => setAlertPrice(e.target.value)}
            />
            <AlertSelect value={alertCondition} onChange={(e) => setAlertCondition(e.target.value as "above" | "below")}>
              <option value="above">Above</option>
              <option value="below">Below</option>
            </AlertSelect>
            <AlertBtn
              type="button"
              disabled={alertSaving}
              onClick={async () => {
                const price = parseFloat(alertPrice);
                if (!Number.isFinite(price) || price <= 0) {
                  setAlertMsg("Enter a valid target price");
                  return;
                }
                setAlertSaving(true);
                setAlertMsg(null);
                try {
                  await createPriceAlert({ symbolId: active.id, targetPrice: price, condition: alertCondition });
                  setAlertMsg("Alert created — manage in your panel");
                  setAlertPrice("");
                } catch (e) {
                  setAlertMsg(e instanceof Error ? e.message : "Failed to create alert");
                } finally {
                  setAlertSaving(false);
                }
              }}
            >
              {alertSaving ? "Saving…" : "Add alert"}
            </AlertBtn>
            <Link to="/user-panel/alerts">View alerts →</Link>
            {alertMsg && <AlertMsg>{alertMsg}</AlertMsg>}
          </AlertBar>
        )}

        <ChartCard>
          <ChartHead>
            <strong>{active.label}</strong>
            <span>{active.tvSymbol}</span>
          </ChartHead>
          <ChartBody>
            <TradingViewWidget
              key={active.tvSymbol}
              scriptSrc={TV_ADVANCED}
              config={chartConfig}
              minHeight={520}
            />
          </ChartBody>
        </ChartCard>

        <SideGrid>
          <Panel>
            <PanelTitle>
              <FiBarChart2 /> Forex heatmap
            </PanelTitle>
            <TradingViewWidget scriptSrc={TV_HEATMAP} config={heatmapConfig} minHeight={420} />
          </Panel>
          <Aside>
            <AsideTitle>About this tool</AsideTitle>
            <AsideText>
              Charts and quotes are provided by TradingView. Availability and update speed depend on the
              instrument and TradingView&apos;s data partners — treat prices as indicative, not for live
              execution on LegendPips.
            </AsideText>
            <AsideList>
              <li>Use charts for research alongside our <Link to="/analysis">analysis</Link> posts.</li>
              <li>Compare broker costs on <Link to="/spread-comparison">spread comparison</Link>.</li>
              <li>Check signals on <Link to="/signals">signals</Link> before trading live.</li>
            </AsideList>
            <Disclaimer>
              Trading involves risk. LegendPips does not provide investment advice.
            </Disclaimer>
          </Aside>
        </SideGrid>
      </Page>
    </>
  );
};

export default LiveChartsPage;

const Hero = styled.section`
  position: relative;
  min-height: clamp(240px, 32vh, 320px);
  display: flex;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, #0b1b38 0%, #132e58 100%);
  padding: clamp(3rem, 7vw, 4.25rem) ${({ theme }) => theme.typography.pageGutter} 1.75rem;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.14;
  background-image: url(${bannerBg});
  background-size: cover;
  filter: blur(2px);
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(11, 27, 56, 0.82), rgba(19, 46, 88, 0.82));
  }
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 2;
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
  color: #fff;
`;

const Eyebrow = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gold};
`;

const Title = styled.h1`
  margin: 0 0 0.75rem;
  font-size: clamp(1.6rem, 2.5vw, 2.15rem);
`;

const Lead = styled.p`
  margin: 0;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.9);
`;

const HeroLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.65rem 1rem;
  margin-top: 1rem;
`;

const HeroLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: ${({ theme }) => theme.colors.gold};
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const TickerBand = styled.div`
  background: #0b1b38;
  border-bottom: 1px solid rgba(251, 191, 36, 0.2);
`;

const Page = styled.main`
  background: #f4f6fa;
  padding: 1.25rem ${({ theme }) => theme.typography.pageGutter} 3rem;
`;

const SymbolBar = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto 1rem;
`;

const SymbolLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 0.5rem;
`;

const SymbolChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

const Chip = styled.button<{ $active: boolean }>`
  border: 1px solid ${({ $active }) => ($active ? "#132e58" : "#e2e8f0")};
  background: ${({ $active }) => ($active ? "#132e58" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#132e58")};
  border-radius: 999px;
  padding: 0.45rem 0.85rem;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover {
    border-color: #132e58;
  }
`;

const AlertBar = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #fff;
  font-size: 0.8125rem;
  color: #64748b;

  svg {
    color: #132e58;
  }

  a {
    color: #132e58;
    font-weight: 700;
    text-decoration: none;
    margin-left: auto;
  }
`;

const AlertInput = styled.input`
  width: 120px;
  padding: 0.4rem 0.55rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.8125rem;
`;

const AlertSelect = styled.select`
  padding: 0.4rem 0.55rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.8125rem;
`;

const AlertBtn = styled.button`
  padding: 0.45rem 0.85rem;
  border: none;
  border-radius: 8px;
  background: #132e58;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AlertMsg = styled.span`
  width: 100%;
  font-size: 0.75rem;
  color: #059669;
  font-weight: 600;
`;

const ChartCard = styled.section`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto 1.25rem;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(19, 46, 88, 0.06);
`;

const ChartHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;

  strong {
    color: #132e58;
    font-size: 1rem;
  }

  span {
    color: #64748b;
    font-size: 0.8rem;
    font-weight: 600;
  }
`;

const ChartBody = styled.div`
  height: 520px;
  width: 100%;
  background: #fff;
`;

const SideGrid = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(240px, 0.9fr);
  gap: 1.25rem;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.section`
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(19, 46, 88, 0.06);
  padding: 0.85rem 0.85rem 0.5rem;
`;

const PanelTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0 0 0.65rem;
  padding: 0 0.15rem;
  font-size: 0.95rem;
  color: #132e58;
`;

const Aside = styled.aside`
  border-radius: 14px;
  border: 1px solid rgba(251, 191, 36, 0.28);
  background: linear-gradient(165deg, #0f2448 0%, #132e58 55%, #0c1f3d 100%);
  color: #fff;
  padding: 1.25rem 1.2rem;
`;

const AsideTitle = styled.h3`
  margin: 0 0 0.65rem;
  font-size: 1rem;
`;

const AsideText = styled.p`
  margin: 0 0 0.85rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.88);
`;

const AsideList = styled.ul`
  margin: 0 0 1rem;
  padding-left: 1.1rem;
  font-size: 0.85rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.9);

  a {
    color: ${({ theme }) => theme.colors.gold};
    font-weight: 700;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Disclaimer = styled.p`
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.65);
`;
