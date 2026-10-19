import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { FiActivity, FiRefreshCw } from "react-icons/fi";

const NAVY = "#132E58";
const GOLD = "#FBC113";

/** Pairs shown across the live desk. */
export const SPREAD_PAIRS = [
  "EUR/USD",
  "GBP/USD",
  "USD/JPY",
  "GBP/JPY",
  "USD/CAD",
  "EUR/AUD",
  "EUR/JPY",
  "EUR/GBP",
  "NZD/USD",
] as const;

export type SpreadPair = (typeof SPREAD_PAIRS)[number];

type DeskMode = "all" | "popular";

type BrokerSeed = {
  id: string;
  name: string;
  account?: string;
  popular: boolean;
  base: Record<SpreadPair, number>;
  jitter: number;
  color: string;
};

/**
 * Indicative desk — typical Raw/ECN profiles with ~1s random-walk ticks.
 * NOT a live broker feed (MyFXBook embed is commented out while their CDN is down).
 */
const BROKER_SEEDS: BrokerSeed[] = [
  {
    id: "pepperstone-razor",
    name: "Pepperstone",
    account: "Razor",
    popular: true,
    color: "#e85d04",
    jitter: 0.18,
    base: {
      "EUR/USD": 0.1, "GBP/USD": 0.4, "USD/JPY": 0.2, "GBP/JPY": 0.8,
      "USD/CAD": 0.3, "EUR/AUD": 0.9, "EUR/JPY": 0.4, "EUR/GBP": 0.3, "NZD/USD": 0.4,
    },
  },
  {
    id: "icmarkets-raw",
    name: "IC Markets",
    account: "Raw",
    popular: true,
    color: "#1d4ed8",
    jitter: 0.16,
    base: {
      "EUR/USD": 0.0, "GBP/USD": 0.3, "USD/JPY": 0.1, "GBP/JPY": 0.7,
      "USD/CAD": 0.2, "EUR/AUD": 0.8, "EUR/JPY": 0.3, "EUR/GBP": 0.2, "NZD/USD": 0.3,
    },
  },
  {
    id: "exness-raw",
    name: "Exness",
    account: "Raw",
    popular: true,
    color: "#f59e0b",
    jitter: 0.2,
    base: {
      "EUR/USD": 0.1, "GBP/USD": 0.5, "USD/JPY": 0.2, "GBP/JPY": 1.0,
      "USD/CAD": 0.4, "EUR/AUD": 1.1, "EUR/JPY": 0.5, "EUR/GBP": 0.4, "NZD/USD": 0.5,
    },
  },
  {
    id: "xm-ultra",
    name: "XM Group",
    account: "Ultra Low",
    popular: true,
    color: "#dc2626",
    jitter: 0.22,
    base: {
      "EUR/USD": 0.6, "GBP/USD": 0.9, "USD/JPY": 0.7, "GBP/JPY": 1.6,
      "USD/CAD": 1.0, "EUR/AUD": 1.8, "EUR/JPY": 1.1, "EUR/GBP": 0.9, "NZD/USD": 1.1,
    },
  },
  {
    id: "fpmarkets-raw",
    name: "FP Markets",
    account: "Raw",
    popular: true,
    color: "#0ea5e9",
    jitter: 0.17,
    base: {
      "EUR/USD": 0.0, "GBP/USD": 0.4, "USD/JPY": 0.1, "GBP/JPY": 0.8,
      "USD/CAD": 0.3, "EUR/AUD": 0.9, "EUR/JPY": 0.4, "EUR/GBP": 0.3, "NZD/USD": 0.4,
    },
  },
  {
    id: "tickmill-pro",
    name: "Tickmill",
    account: "Pro",
    popular: true,
    color: "#16a34a",
    jitter: 0.18,
    base: {
      "EUR/USD": 0.1, "GBP/USD": 0.5, "USD/JPY": 0.2, "GBP/JPY": 0.9,
      "USD/CAD": 0.4, "EUR/AUD": 1.0, "EUR/JPY": 0.5, "EUR/GBP": 0.4, "NZD/USD": 0.5,
    },
  },
  {
    id: "fxpro-raw",
    name: "FxPro",
    account: "Raw+",
    popular: true,
    color: "#7c3aed",
    jitter: 0.2,
    base: {
      "EUR/USD": 0.2, "GBP/USD": 0.6, "USD/JPY": 0.3, "GBP/JPY": 1.1,
      "USD/CAD": 0.5, "EUR/AUD": 1.2, "EUR/JPY": 0.6, "EUR/GBP": 0.5, "NZD/USD": 0.6,
    },
  },
  {
    id: "oanda-core",
    name: "OANDA",
    account: "Core",
    popular: true,
    color: "#0f766e",
    jitter: 0.24,
    base: {
      "EUR/USD": 0.8, "GBP/USD": 1.2, "USD/JPY": 0.9, "GBP/JPY": 2.0,
      "USD/CAD": 1.2, "EUR/AUD": 2.2, "EUR/JPY": 1.3, "EUR/GBP": 1.0, "NZD/USD": 1.3,
    },
  },
  {
    id: "dukascopy-ecn",
    name: "Dukascopy",
    account: "ECN",
    popular: true,
    color: "#0369a1",
    jitter: 0.19,
    base: {
      "EUR/USD": 0.2, "GBP/USD": 0.5, "USD/JPY": 0.3, "GBP/JPY": 1.0,
      "USD/CAD": 0.4, "EUR/AUD": 1.1, "EUR/JPY": 0.5, "EUR/GBP": 0.4, "NZD/USD": 0.5,
    },
  },
  {
    id: "justmarkets-raw",
    name: "JustMarkets",
    account: "Raw",
    popular: true,
    color: "#b45309",
    jitter: 0.2,
    base: {
      "EUR/USD": 0.1, "GBP/USD": 0.4, "USD/JPY": 0.2, "GBP/JPY": 0.9,
      "USD/CAD": 0.3, "EUR/AUD": 1.0, "EUR/JPY": 0.4, "EUR/GBP": 0.3, "NZD/USD": 0.4,
    },
  },
  {
    id: "moneta-raw",
    name: "Moneta Markets",
    account: "Raw",
    popular: true,
    color: "#be185d",
    jitter: 0.17,
    base: {
      "EUR/USD": 0.0, "GBP/USD": 0.3, "USD/JPY": 0.1, "GBP/JPY": 0.7,
      "USD/CAD": 0.2, "EUR/AUD": 0.8, "EUR/JPY": 0.3, "EUR/GBP": 0.2, "NZD/USD": 0.3,
    },
  },
  {
    id: "fxcc-ecn",
    name: "FXCC",
    account: "ECN",
    popular: true,
    color: "#4338ca",
    jitter: 0.18,
    base: {
      "EUR/USD": 0.1, "GBP/USD": 0.4, "USD/JPY": 0.2, "GBP/JPY": 0.8,
      "USD/CAD": 0.3, "EUR/AUD": 0.9, "EUR/JPY": 0.4, "EUR/GBP": 0.3, "NZD/USD": 0.4,
    },
  },
  {
    id: "go-markets-raw",
    name: "GO Markets",
    account: "Raw",
    popular: false,
    color: "#15803d",
    jitter: 0.19,
    base: {
      "EUR/USD": 0.1, "GBP/USD": 0.5, "USD/JPY": 0.2, "GBP/JPY": 0.9,
      "USD/CAD": 0.4, "EUR/AUD": 1.0, "EUR/JPY": 0.5, "EUR/GBP": 0.4, "NZD/USD": 0.5,
    },
  },
  {
    id: "activtrades-pro",
    name: "ActivTrades",
    account: "Pro",
    popular: false,
    color: "#c2410c",
    jitter: 0.22,
    base: {
      "EUR/USD": 0.5, "GBP/USD": 0.8, "USD/JPY": 0.6, "GBP/JPY": 1.5,
      "USD/CAD": 0.9, "EUR/AUD": 1.7, "EUR/JPY": 1.0, "EUR/GBP": 0.8, "NZD/USD": 1.0,
    },
  },
  {
    id: "liteforex-ecn",
    name: "LiteFinance",
    account: "ECN",
    popular: false,
    color: "#0891b2",
    jitter: 0.21,
    base: {
      "EUR/USD": 0.3, "GBP/USD": 0.7, "USD/JPY": 0.4, "GBP/JPY": 1.2,
      "USD/CAD": 0.6, "EUR/AUD": 1.4, "EUR/JPY": 0.7, "EUR/GBP": 0.6, "NZD/USD": 0.7,
    },
  },
  {
    id: "alpari-ecn",
    name: "Alpari",
    account: "ECN",
    popular: false,
    color: "#a16207",
    jitter: 0.2,
    base: {
      "EUR/USD": 0.2, "GBP/USD": 0.6, "USD/JPY": 0.3, "GBP/JPY": 1.1,
      "USD/CAD": 0.5, "EUR/AUD": 1.2, "EUR/JPY": 0.6, "EUR/GBP": 0.5, "NZD/USD": 0.6,
    },
  },
  {
    id: "amarkets-ecn",
    name: "AMarkets",
    account: "ECN",
    popular: false,
    color: "#db2777",
    jitter: 0.2,
    base: {
      "EUR/USD": 0.2, "GBP/USD": 0.5, "USD/JPY": 0.3, "GBP/JPY": 1.0,
      "USD/CAD": 0.4, "EUR/AUD": 1.1, "EUR/JPY": 0.5, "EUR/GBP": 0.4, "NZD/USD": 0.5,
    },
  },
  {
    id: "pu-prime-raw",
    name: "PU Prime",
    account: "Raw",
    popular: false,
    color: "#4f46e5",
    jitter: 0.18,
    base: {
      "EUR/USD": 0.1, "GBP/USD": 0.4, "USD/JPY": 0.2, "GBP/JPY": 0.8,
      "USD/CAD": 0.3, "EUR/AUD": 0.9, "EUR/JPY": 0.4, "EUR/GBP": 0.3, "NZD/USD": 0.4,
    },
  },
  {
    id: "startrader-ecn",
    name: "STARTRADER",
    account: "ECN",
    popular: false,
    color: "#047857",
    jitter: 0.19,
    base: {
      "EUR/USD": 0.1, "GBP/USD": 0.5, "USD/JPY": 0.2, "GBP/JPY": 0.9,
      "USD/CAD": 0.4, "EUR/AUD": 1.0, "EUR/JPY": 0.5, "EUR/GBP": 0.4, "NZD/USD": 0.5,
    },
  },
  {
    id: "iux-raw",
    name: "IUX",
    account: "Raw",
    popular: false,
    color: "#9333ea",
    jitter: 0.18,
    base: {
      "EUR/USD": 0.0, "GBP/USD": 0.4, "USD/JPY": 0.1, "GBP/JPY": 0.8,
      "USD/CAD": 0.3, "EUR/AUD": 0.9, "EUR/JPY": 0.4, "EUR/GBP": 0.3, "NZD/USD": 0.4,
    },
  },
  {
    id: "cxm-direct",
    name: "CXM Direct",
    account: "Raw",
    popular: false,
    color: "#0e7490",
    jitter: 0.17,
    base: {
      "EUR/USD": 0.1, "GBP/USD": 0.4, "USD/JPY": 0.2, "GBP/JPY": 0.8,
      "USD/CAD": 0.3, "EUR/AUD": 0.9, "EUR/JPY": 0.4, "EUR/GBP": 0.3, "NZD/USD": 0.4,
    },
  },
  {
    id: "elev8-raw",
    name: "ELEV8",
    account: "Raw",
    popular: false,
    color: "#ea580c",
    jitter: 0.2,
    base: {
      "EUR/USD": 0.2, "GBP/USD": 0.6, "USD/JPY": 0.3, "GBP/JPY": 1.1,
      "USD/CAD": 0.5, "EUR/AUD": 1.2, "EUR/JPY": 0.6, "EUR/GBP": 0.5, "NZD/USD": 0.6,
    },
  },
  {
    id: "spec-markets",
    name: "Spec Markets",
    account: "Raw",
    popular: false,
    color: "#2563eb",
    jitter: 0.19,
    base: {
      "EUR/USD": 0.1, "GBP/USD": 0.5, "USD/JPY": 0.2, "GBP/JPY": 0.9,
      "USD/CAD": 0.4, "EUR/AUD": 1.0, "EUR/JPY": 0.5, "EUR/GBP": 0.4, "NZD/USD": 0.5,
    },
  },
  {
    id: "fusion-raw",
    name: "Fusion Markets",
    account: "Raw",
    popular: false,
    color: "#0d9488",
    jitter: 0.17,
    base: {
      "EUR/USD": 0.0, "GBP/USD": 0.3, "USD/JPY": 0.1, "GBP/JPY": 0.7,
      "USD/CAD": 0.2, "EUR/AUD": 0.8, "EUR/JPY": 0.3, "EUR/GBP": 0.2, "NZD/USD": 0.3,
    },
  },
];

type SpreadRow = {
  id: string;
  name: string;
  account?: string;
  color: string;
  spreads: Record<SpreadPair, number>;
};

type Props = {
  height?: number;
  className?: string;
  defaultMode?: DeskMode;
};

type Tone = "best" | "wide" | "mid";

function roundPip(n: number): number {
  return Math.round(Math.max(0, n) * 10) / 10;
}

function tickSpread(base: number, jitter: number): number {
  const delta = (Math.random() - 0.48) * jitter * 2;
  return roundPip(base + delta);
}

function seedRows(seeds: BrokerSeed[]): SpreadRow[] {
  return seeds.map((s) => ({
    id: s.id,
    name: s.name,
    account: s.account,
    color: s.color,
    spreads: { ...s.base },
  }));
}

function formatPip(n: number): string {
  return n.toFixed(1);
}

function columnTones(rows: SpreadRow[], pair: SpreadPair): Map<string, Tone> {
  const vals = rows.map((r) => ({ id: r.id, v: r.spreads[pair] }));
  const nums = vals.map((x) => x.v);
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const map = new Map<string, Tone>();
  for (const { id, v } of vals) {
    if (v === min) map.set(id, "best");
    else if (v === max && max > min) map.set(id, "wide");
    else map.set(id, "mid");
  }
  return map;
}

function cloneSeeds(): BrokerSeed[] {
  return BROKER_SEEDS.map((s) => ({
    ...s,
    base: { ...s.base },
  }));
}

/*
 * ── Official MyFXBook / mfbcdn embed (commented while their service is down) ──
 *
 * const OFFICIAL_SYMBOLS = "AUDCAD,AUDCHF,...XAUUSD,ZARJPY";
 * const OFFICIAL_MT4_SERVERS = "10018,10024,...930,9301";
 * iframe src:
 *   https://widget.mfbcdn.net/widget/broker-spreads.html
 *     ?symbols=${OFFICIAL_SYMBOLS}
 *     &mt4Servers=${OFFICIAL_MT4_SERVERS}
 *     &includeCommissions=true
 *     &promoteBroker=0
 *
 * Re-enable when https://www.myfxbook.com is back from maintenance.
 */

const LiveForexSpreadsDesk: React.FC<Props> = ({
  height = 720,
  className,
  defaultMode = "all",
}) => {
  const [mode, setMode] = useState<DeskMode>(defaultMode);
  const seedsRef = useRef<BrokerSeed[]>(cloneSeeds());
  const [rows, setRows] = useState<SpreadRow[]>(() => seedRows(seedsRef.current));
  const [tickAt, setTickAt] = useState(() => Date.now());
  const [flash, setFlash] = useState<Record<string, true>>({});
  const prevRef = useRef<Record<string, number>>({});

  const visibleSeeds = useMemo(
    () => (mode === "popular" ? BROKER_SEEDS.filter((s) => s.popular) : BROKER_SEEDS),
    [mode]
  );

  const visibleRows = useMemo(() => {
    const ids = new Set(visibleSeeds.map((s) => s.id));
    return rows.filter((r) => ids.has(r.id));
  }, [rows, visibleSeeds]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const nextFlash: Record<string, true> = {};
      setRows((prev) =>
        prev.map((row) => {
          const seed = seedsRef.current.find((s) => s.id === row.id);
          if (!seed) return row;
          const spreads = { ...row.spreads };
          for (const pair of SPREAD_PAIRS) {
            const next = tickSpread(seed.base[pair], seed.jitter);
            const key = `${row.id}:${pair}`;
            if (prevRef.current[key] !== next) nextFlash[key] = true;
            prevRef.current[key] = next;
            seed.base[pair] = roundPip(seed.base[pair] * 0.92 + next * 0.08);
            spreads[pair] = next;
          }
          return { ...row, spreads };
        })
      );
      setFlash(nextFlash);
      setTickAt(Date.now());
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!Object.keys(flash).length) return;
    const t = window.setTimeout(() => setFlash({}), 380);
    return () => window.clearTimeout(t);
  }, [flash]);

  const tonesByPair = useMemo(() => {
    const out = {} as Record<SpreadPair, Map<string, Tone>>;
    for (const pair of SPREAD_PAIRS) {
      out[pair] = columnTones(visibleRows, pair);
    }
    return out;
  }, [visibleRows]);

  const reset = () => {
    seedsRef.current = cloneSeeds();
    setRows(seedRows(seedsRef.current));
    setTickAt(Date.now());
  };

  return (
    <Shell className={className}>
      <TopBar>
        <TopLeft>
          <LivePill>
            <span className="dot" aria-hidden />
            Live
          </LivePill>
          <TopCopy>
            <h3>
              <FiActivity aria-hidden /> Live forex spreads
            </h3>
            <p>
              Best spread is colored in green, worst in red · indicative quotes refresh about
              every second
            </p>
          </TopCopy>
        </TopLeft>
        <TopActions>
          <ModeSwitch role="group" aria-label="Broker list size">
            <ModeBtn type="button" $active={mode === "all"} onClick={() => setMode("all")}>
              All brokers
            </ModeBtn>
            <ModeBtn
              type="button"
              $active={mode === "popular"}
              onClick={() => setMode("popular")}
            >
              Popular
            </ModeBtn>
          </ModeSwitch>
          <GhostBtn type="button" onClick={reset} title="Resync spreads">
            <FiRefreshCw /> Refresh
          </GhostBtn>
        </TopActions>
      </TopBar>

      <MetaRow>
        <Legend>
          <LegendItem $tone="best">
            <i /> Best (tight)
          </LegendItem>
          <LegendItem $tone="mid">
            <i /> Typical
          </LegendItem>
          <LegendItem $tone="wide">
            <i /> Wider
          </LegendItem>
        </Legend>
        <PairRow aria-label="Pairs shown">
          {SPREAD_PAIRS.map((p) => (
            <PairChip key={p}>{p}</PairChip>
          ))}
        </PairRow>
      </MetaRow>

      <TableScroll style={{ maxHeight: height }}>
        <Table>
          <thead>
            <tr>
              <th className="broker-col">Brokers</th>
              {SPREAD_PAIRS.map((p) => (
                <th key={p}>{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, idx) => (
              <tr key={row.id} className={idx === 0 ? "featured" : undefined}>
                <td className="broker-col">
                  <BrokerCell>
                    <Logo $bg={row.color}>{row.name.slice(0, 2).toUpperCase()}</Logo>
                    <div>
                      <strong>{row.name}</strong>
                      {row.account && <em>{row.account}</em>}
                    </div>
                  </BrokerCell>
                </td>
                {SPREAD_PAIRS.map((pair) => {
                  const tone = tonesByPair[pair].get(row.id) || "mid";
                  const key = `${row.id}:${pair}`;
                  return (
                    <td key={pair}>
                      <Cell $tone={tone} $flash={Boolean(flash[key])}>
                        {formatPip(row.spreads[pair])}
                      </Cell>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableScroll>

      <Foot>
        Indicative LegendPips spread desk · {visibleRows.length} brokers · cells update ~every
        second · green = tighter · red = wider. Not a live broker feed — confirm quotes with your
        broker. {/* Live MyFXBook embed temporarily disabled (their site under upgrade). */}
      </Foot>
    </Shell>
  );
};

export default LiveForexSpreadsDesk;

const Shell = styled.section`
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(19, 46, 88, 0.12);
  background: #fff;
  box-shadow:
    0 4px 6px rgba(15, 23, 42, 0.03),
    0 18px 40px rgba(19, 46, 88, 0.1);
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1.05rem 1.2rem;
  background:
    radial-gradient(ellipse 55% 120% at 100% 0%, rgba(251, 193, 19, 0.18), transparent 55%),
    linear-gradient(135deg, ${NAVY} 0%, #0f2448 55%, #1a3d6e 100%);
  color: #fff;
`;

const TopLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0;
`;

const LivePill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.32rem 0.7rem;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.18);
  border: 1px solid rgba(52, 211, 153, 0.45);
  color: #6ee7b7;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  flex-shrink: 0;

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #34d399;
    box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.25);
    animation: pulse 1.4s ease infinite;
  }

  @keyframes pulse {
    50% {
      box-shadow: 0 0 0 6px rgba(52, 211, 153, 0.08);
    }
  }
`;

const TopCopy = styled.div`
  min-width: 0;

  h3 {
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 1.05rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  p {
    margin: 0.2rem 0 0;
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.72);
    line-height: 1.4;
  }
`;

const TopActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`;

const ModeSwitch = styled.div`
  display: inline-flex;
  padding: 3px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.12);
`;

const ModeBtn = styled.button<{ $active?: boolean }>`
  appearance: none;
  border: none;
  border-radius: 999px;
  padding: 0.4rem 0.75rem;
  font-size: 0.72rem;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
  color: ${({ $active }) => ($active ? NAVY : "rgba(255,255,255,0.78)")};
  background: ${({ $active }) =>
    $active ? `linear-gradient(135deg, ${GOLD}, #f59e0b)` : "transparent"};
`;

const GhostBtn = styled.button`
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border-radius: 999px;
  padding: 0.45rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.14);
    border-color: rgba(251, 193, 19, 0.55);
  }
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1.15rem;
  background: linear-gradient(180deg, #f8fafc 0%, #fff 100%);
  border-bottom: 1px solid #eef2f7;
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
`;

const LegendItem = styled.span<{ $tone: Tone }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: #64748b;

  i {
    width: 12px;
    height: 12px;
    border-radius: 4px;
    display: block;
    background: ${({ $tone }) =>
      $tone === "best" ? "#bbf7d0" : $tone === "wide" ? "#fecaca" : "#e2e8f0"};
    border: 1px solid
      ${({ $tone }) =>
        $tone === "best" ? "#86efac" : $tone === "wide" ? "#fca5a5" : "#cbd5e1"};
  }
`;

const PairRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;

const PairChip = styled.span`
  padding: 0.22rem 0.55rem;
  border-radius: 999px;
  background: rgba(19, 46, 88, 0.06);
  border: 1px solid rgba(19, 46, 88, 0.1);
  color: ${NAVY};
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.02em;
`;

const TableScroll = styled.div`
  overflow: auto;
  background: #fff;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.8125rem;
  min-width: 980px;

  th,
  td {
    padding: 0.55rem 0.65rem;
    border-bottom: 1px solid #eef2f7;
    text-align: center;
    white-space: nowrap;
  }

  th {
    position: sticky;
    top: 0;
    z-index: 2;
    background: #f8fafc;
    color: #64748b;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    border-bottom: 1px solid #e2e8f0;
  }

  th.broker-col,
  td.broker-col {
    text-align: left;
    position: sticky;
    left: 0;
    z-index: 1;
    background: #fff;
    min-width: 190px;
    border-right: 1px solid #eef2f7;
  }

  th.broker-col {
    z-index: 3;
    background: #f8fafc;
  }

  tr.featured td {
    background: rgba(251, 193, 19, 0.06);
  }

  tr.featured td.broker-col {
    background: #fffbeb;
  }

  tbody tr:hover td {
    background: #f8fafc;
  }

  tbody tr:hover td.broker-col {
    background: #f1f5f9;
  }
`;

const BrokerCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;

  strong {
    display: block;
    color: ${NAVY};
    font-weight: 800;
    font-size: 0.84rem;
    line-height: 1.2;
  }

  em {
    display: block;
    margin-top: 0.1rem;
    font-style: normal;
    font-size: 0.68rem;
    font-weight: 600;
    color: #94a3b8;
  }
`;

const Logo = styled.span<{ $bg: string }>`
  width: 34px;
  height: 34px;
  border-radius: 9px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ $bg }) => $bg};
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
`;

const Cell = styled.span<{ $tone: Tone; $flash?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3.1rem;
  padding: 0.28rem 0.45rem;
  border-radius: 6px;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  color: ${NAVY};
  background: ${({ $tone }) =>
    $tone === "best" ? "#dcfce7" : $tone === "wide" ? "#fee2e2" : "transparent"};
  border: 1px solid
    ${({ $tone }) =>
      $tone === "best" ? "#86efac" : $tone === "wide" ? "#fca5a5" : "transparent"};
  transition: background 0.2s ease, box-shadow 0.2s ease;
  box-shadow: ${({ $flash }) =>
    $flash ? "0 0 0 2px rgba(251, 193, 19, 0.55)" : "none"};
`;

const Foot = styled.p`
  margin: 0;
  padding: 0.7rem 1.15rem;
  font-size: 0.74rem;
  color: #64748b;
  background: #f8fafc;
  border-top: 1px solid #eef2f7;
  text-align: center;
  line-height: 1.45;
`;
