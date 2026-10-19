import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiFilter,
  FiRefreshCw,
  FiZap,
} from "react-icons/fi";
import bannerBg from "../../assets/banner/BannerBg.jpg";
import TradingViewWidget from "../../components/MarketCharts/TradingViewWidget";
import {
  fetchEconomicCalendar,
  type EconEvent,
  type EconImpact,
} from "../../services/economicCalendarService";

const TV_EVENTS =
  "https://s3.tradingview.com/external-embedding/embed-widget-events.js";

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "NZD", "CNY"] as const;
const IMPACTS: { id: EconImpact; label: string }[] = [
  { id: "high", label: "High" },
  { id: "medium", label: "Medium" },
  { id: "low", label: "Low" },
];

/** Quick picks for the search dropdown — users can still type anything. */
const SEARCH_SUGGESTIONS = [
  { value: "", label: "Search or pick a topic…" },
  { value: "FOMC", label: "FOMC" },
  { value: "CPI", label: "CPI (inflation)" },
  { value: "NFP", label: "NFP / payrolls" },
  { value: "Unemployment", label: "Unemployment" },
  { value: "Interest Rate", label: "Interest rate" },
  { value: "GDP", label: "GDP" },
  { value: "PMI", label: "PMI" },
  { value: "Retail Sales", label: "Retail sales" },
  { value: "ECB", label: "ECB" },
  { value: "BOE", label: "Bank of England" },
  { value: "BOJ", label: "Bank of Japan" },
  { value: "Fed", label: "Fed / Federal Reserve" },
  { value: "Oil", label: "Oil inventories" },
] as const;

type DayTab = "today" | "tomorrow" | "week" | "all";
type TzMode = "local" | "utc";

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function inRange(iso: string, from: Date, to: Date): boolean {
  const t = Date.parse(iso);
  return t >= from.getTime() && t <= to.getTime();
}

function formatWhen(iso: string, tz: TzMode): { day: string; time: string } {
  const d = new Date(iso);
  const optsDate: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    ...(tz === "utc" ? { timeZone: "UTC" } : {}),
  };
  const optsTime: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    ...(tz === "utc" ? { timeZone: "UTC", hour12: false } : { hour12: false }),
  };
  return {
    day: d.toLocaleDateString(undefined, optsDate),
    time: d.toLocaleTimeString(undefined, optsTime) + (tz === "utc" ? " UTC" : ""),
  };
}

function countdownLabel(iso: string, now: number): string {
  const diff = Date.parse(iso) - now;
  if (diff < -5 * 60_000) return "Released";
  if (diff < 0) return "Live / just out";
  const mins = Math.round(diff / 60_000);
  if (mins < 60) return `in ${mins}m`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hrs < 48) return `in ${hrs}h ${rem}m`;
  const days = Math.floor(hrs / 24);
  return `in ${days}d`;
}

function impactTone(impact: EconImpact): "high" | "medium" | "low" | "holiday" {
  if (impact === "high" || impact === "medium" || impact === "low" || impact === "holiday") {
    return impact;
  }
  return "low";
}

const EconomicCalendarPage: React.FC = () => {
  const [events, setEvents] = useState<EconEvent[]>([]);
  const [highUpcoming, setHighUpcoming] = useState<EconEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>("");
  const [fetchedAt, setFetchedAt] = useState<string>("");
  const [dayTab, setDayTab] = useState<DayTab>("week");
  const [impacts, setImpacts] = useState<EconImpact[]>(["high", "medium"]);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [tz, setTz] = useState<TzMode>("local");
  const [showTv, setShowTv] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [query, setQuery] = useState("");

  const tvConfig = useMemo(
    () => ({
      colorTheme: "light",
      isTransparent: false,
      width: "100%",
      height: 620,
      locale: "en",
      importanceFilter: "-1,0,1",
      countryFilter: "us,eu,gb,jp,au,ca,ch,nz,cn",
    }),
    []
  );

  const load = useCallback(async (refresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEconomicCalendar({ refresh });
      setEvents(data.events || []);
      setHighUpcoming(data.highUpcoming || []);
      setSource(data.source || "");
      setFetchedAt(data.fetchedAt || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load calendar");
      setEvents([]);
      setHighUpcoming([]);
      setShowTv(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    const today = startOfDay(new Date());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    return events.filter((e) => {
      if (impacts.length && !impacts.includes(e.impact)) return false;
      if (currencies.length && !currencies.includes(e.currency) && e.currency !== "ALL") {
        return false;
      }
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        if (
          !e.title.toLowerCase().includes(q) &&
          !e.currency.toLowerCase().includes(q) &&
          !e.country.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (dayTab === "today") return inRange(e.datetime, today, endOfDay(today));
      if (dayTab === "tomorrow") return inRange(e.datetime, tomorrow, endOfDay(tomorrow));
      if (dayTab === "week") return inRange(e.datetime, today, endOfDay(weekEnd));
      return true;
    });
  }, [events, impacts, currencies, dayTab, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, EconEvent[]>();
    for (const e of filtered) {
      const key = formatWhen(e.datetime, tz).day;
      const list = map.get(key) || [];
      list.push(e);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [filtered, tz]);

  const nextHigh = highUpcoming[0] || filtered.find((e) => e.impact === "high" && Date.parse(e.datetime) >= now);

  const toggleImpact = (id: EconImpact) => {
    setImpacts((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleCurrency = (c: string) => {
    setCurrencies((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  return (
    <>
      <Hero>
        <Overlay />
        <HeroInner>
          <Eyebrow>
            <FiCalendar aria-hidden /> Daily trading tool
          </Eyebrow>
          <Title>Economic calendar</Title>
          <Lead>
            Plan your day around high-impact releases — times, currencies, and actual vs forecast in
            one place. Built for forex and CFD traders who check this every session.
          </Lead>
          <HeroLinks>
            <HeroLink to="/live-charts">
              Live charts <FiArrowRight />
            </HeroLink>
            <HeroLink to="/analysis">Market analysis</HeroLink>
          </HeroLinks>
        </HeroInner>
      </Hero>

      <Page>
        {nextHigh && (
          <NextCard>
            <NextIcon aria-hidden>
              <FiZap />
            </NextIcon>
            <NextBody>
              <NextLabel>Next high-impact</NextLabel>
              <NextTitle>
                {nextHigh.currency} · {nextHigh.title}
              </NextTitle>
              <NextMeta>
                <span>{formatWhen(nextHigh.datetime, tz).day}</span>
                <span>{formatWhen(nextHigh.datetime, tz).time}</span>
                <NextCountdown>{countdownLabel(nextHigh.datetime, now)}</NextCountdown>
              </NextMeta>
            </NextBody>
            {(nextHigh.forecast || nextHigh.previous) && (
              <NextStats>
                <Stat>
                  <StatL>Forecast</StatL>
                  <StatV>{nextHigh.forecast || "—"}</StatV>
                </Stat>
                <Stat>
                  <StatL>Previous</StatL>
                  <StatV>{nextHigh.previous || "—"}</StatV>
                </Stat>
                <Stat>
                  <StatL>Actual</StatL>
                  <StatV>{nextHigh.actual || "Pending"}</StatV>
                </Stat>
              </NextStats>
            )}
          </NextCard>
        )}

        <Toolbar>
          <Tabs>
            {(
              [
                ["today", "Today"],
                ["tomorrow", "Tomorrow"],
                ["week", "This week"],
                ["all", "All"],
              ] as const
            ).map(([id, label]) => (
              <Tab key={id} type="button" $active={dayTab === id} onClick={() => setDayTab(id)}>
                {label}
              </Tab>
            ))}
          </Tabs>

          <ToolbarRight>
            <TzToggle>
              <TzBtn type="button" $active={tz === "local"} onClick={() => setTz("local")}>
                My time
              </TzBtn>
              <TzBtn type="button" $active={tz === "utc"} onClick={() => setTz("utc")}>
                UTC
              </TzBtn>
            </TzToggle>
            <RefreshBtn type="button" onClick={() => void load(true)} disabled={loading}>
              <FiRefreshCw />
              Refresh
            </RefreshBtn>
          </ToolbarRight>
        </Toolbar>

        <Filters>
          <FilterBlock>
            <FilterLabel>
              <FiFilter /> Impact
            </FilterLabel>
            <ChipRow>
              {IMPACTS.map((i) => (
                <Chip
                  key={i.id}
                  type="button"
                  $active={impacts.includes(i.id)}
                  $tone={i.id}
                  onClick={() => toggleImpact(i.id)}
                >
                  {i.label}
                </Chip>
              ))}
            </ChipRow>
          </FilterBlock>

          <FilterBlock>
            <FilterLabel>Currency</FilterLabel>
            <ChipRow>
              <Chip
                type="button"
                $active={currencies.length === 0}
                onClick={() => setCurrencies([])}
              >
                All
              </Chip>
              {CURRENCIES.map((c) => (
                <Chip
                  key={c}
                  type="button"
                  $active={currencies.includes(c)}
                  onClick={() => toggleCurrency(c)}
                >
                  {c}
                </Chip>
              ))}
            </ChipRow>
          </FilterBlock>

          <SearchRow>
            <SearchSelect
              aria-label="Popular searches"
              value={SEARCH_SUGGESTIONS.some((s) => s.value === query) ? query : ""}
              onChange={(e) => {
                const v = e.target.value;
                setQuery(v);
                if (v) {
                  setDayTab("week");
                  setImpacts(["high", "medium", "low"]);
                }
              }}
            >
              {SEARCH_SUGGESTIONS.map((s) => (
                <option key={s.label} value={s.value}>
                  {s.label}
                </option>
              ))}
            </SearchSelect>
            <Search
              type="search"
              placeholder="Or type your own (e.g. CPI, NFP, FOMC)…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </SearchRow>
        </Filters>

        <MetaRow>
          <span>
            {loading
              ? "Loading events…"
              : `${filtered.length} event${filtered.length === 1 ? "" : "s"} shown`}
          </span>
          {source && (
            <span>
              {source.startsWith("seed")
                ? "Showing latest available week data"
                : `Source: ${source.replace(/-(stale|disk)$/, " (cached)")}`}
              {fetchedAt ? ` · updated ${new Date(fetchedAt).toLocaleTimeString()}` : ""}
            </span>
          )}
        </MetaRow>

        {error && (
          <ErrorBox role="alert">
            {error}. Showing TradingView calendar below as backup.
          </ErrorBox>
        )}

        <Card>
          {loading && !events.length ? (
            <Empty>Loading this week&apos;s economic events…</Empty>
          ) : grouped.length === 0 ? (
            <Empty>
              No events match these filters. Try &quot;This week&quot;, turn on Low impact, pick a
              topic from the dropdown, or clear search.
            </Empty>
          ) : (
            grouped.map(([day, rows]) => (
              <DayBlock key={day}>
                <DayHeading>
                  <FiClock aria-hidden /> {day}
                </DayHeading>
                <Table role="table" aria-label={`Events on ${day}`}>
                  <TableHead>
                    <span>Time</span>
                    <span>Currency</span>
                    <span>Event</span>
                    <span>Impact</span>
                    <span>Actual</span>
                    <span>Forecast</span>
                    <span>Previous</span>
                  </TableHead>
                  {rows.map((e) => {
                    const when = formatWhen(e.datetime, tz);
                    const past = Date.parse(e.datetime) < now - 60_000;
                    return (
                      <Row key={e.id} $past={past} role="row">
                        <Cell $area="time">
                          <TimeMain>{when.time}</TimeMain>
                          {!past && e.impact === "high" && (
                            <TimeSub>{countdownLabel(e.datetime, now)}</TimeSub>
                          )}
                        </Cell>
                        <Cell $area="cur">
                          <CurrencyBadge>{e.currency}</CurrencyBadge>
                        </Cell>
                        <Cell $area="title">
                          <EventTitle>{e.title}</EventTitle>
                          <EventCountry>{e.country}</EventCountry>
                        </Cell>
                        <Cell $area="impact">
                          <ImpactPill $tone={impactTone(e.impact)}>{e.impact}</ImpactPill>
                        </Cell>
                        <Cell $area="actual" $emphasis={!!e.actual} $desktopOnly>
                          {e.actual || "—"}
                        </Cell>
                        <Cell $area="forecast" $desktopOnly>
                          {e.forecast || "—"}
                        </Cell>
                        <Cell $area="previous" $desktopOnly>
                          {e.previous || "—"}
                        </Cell>
                        <MobileVals>
                          <span>
                            Actual <strong>{e.actual || "—"}</strong>
                          </span>
                          <span>
                            Forecast <strong>{e.forecast || "—"}</strong>
                          </span>
                          <span>
                            Prev <strong>{e.previous || "—"}</strong>
                          </span>
                        </MobileVals>
                      </Row>
                    );
                  })}
                </Table>
              </DayBlock>
            ))
          )}
        </Card>

        <TvToggleRow>
          <TvToggle type="button" onClick={() => setShowTv((v) => !v)}>
            {showTv ? "Hide" : "Show"} TradingView calendar embed
          </TvToggle>
        </TvToggleRow>

        {showTv && (
          <Card>
            <TradingViewWidget scriptSrc={TV_EVENTS} config={tvConfig} minHeight={620} />
          </Card>
        )}

        <Note>
          Times follow your selected timezone. Figures are educational market data — always confirm
          with your broker before trading news.
        </Note>
      </Page>
    </>
  );
};

export default EconomicCalendarPage;

/* ——— styles ——— */

const Hero = styled.section`
  position: relative;
  min-height: clamp(240px, 30vh, 300px);
  display: flex;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, #0b1b38 0%, #132e58 100%);
  padding: clamp(2.75rem, 6vw, 4rem) ${({ theme }) => theme.typography.pageGutter} 1.75rem;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.15;
  background-image: url(${bannerBg});
  background-size: cover;
  filter: blur(2px);
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(11, 27, 56, 0.85), rgba(19, 46, 88, 0.85));
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
  margin-top: 1.1rem;
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

const Page = styled.main`
  background: #f4f6fa;
  padding: 1.25rem ${({ theme }) => theme.typography.pageGutter} 3rem;
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  box-sizing: border-box;
`;

const NextCard = styled.section`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  background: linear-gradient(135deg, #132e58 0%, #1a3d6e 100%);
  color: #fff;
  border-radius: 16px;
  padding: 1.1rem 1.25rem;
  margin-bottom: 1rem;
  box-shadow: 0 12px 28px rgba(19, 46, 88, 0.18);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: auto 1fr;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const NextIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(214, 158, 46, 0.2);
  color: #f0d78a;
  display: grid;
  place-items: center;
  font-size: 1.25rem;
`;

const NextBody = styled.div`
  min-width: 0;
`;

const NextLabel = styled.p`
  margin: 0 0 0.2rem;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #f0d78a;
`;

const NextTitle = styled.h2`
  margin: 0 0 0.35rem;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.3;
`;

const NextMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.85rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.85);
`;

const NextCountdown = styled.span`
  font-weight: 700;
  color: #f0d78a;
`;

const NextStats = styled.div`
  display: flex;
  gap: 0.65rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-column: 1 / -1;
  }
`;

const Stat = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 0.5rem 0.75rem;
  min-width: 5.5rem;
`;

const StatL = styled.div`
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.7;
`;

const StatV = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  margin-top: 0.15rem;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
`;

const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const Tab = styled.button<{ $active?: boolean }>`
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? "#132e58" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#132e58")};
  border: 1px solid ${({ $active }) => ($active ? "#132e58" : "#dbe2ea")};
`;

const ToolbarRight = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`;

const TzToggle = styled.div`
  display: inline-flex;
  background: #fff;
  border: 1px solid #dbe2ea;
  border-radius: 999px;
  overflow: hidden;
`;

const TzBtn = styled.button<{ $active?: boolean }>`
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.4rem 0.75rem;
  background: ${({ $active }) => ($active ? "#d69e2e" : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : "#132e58")};
`;

const RefreshBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid #dbe2ea;
  background: #fff;
  color: #132e58;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;

const Filters = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 0.9rem 1rem;
  margin-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FilterBlock = styled.div``;

const FilterLabel = styled.p`
  margin: 0 0 0.4rem;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;

const Chip = styled.button<{ $active?: boolean; $tone?: string }>`
  border: 1px solid
    ${({ $active, $tone }) =>
      $active
        ? $tone === "high"
          ? "#dc2626"
          : $tone === "medium"
            ? "#d69e2e"
            : "#132e58"
        : "#e2e8f0"};
  background: ${({ $active, $tone }) =>
    $active
      ? $tone === "high"
        ? "#fef2f2"
        : $tone === "medium"
          ? "#fffbeb"
          : "#eef2ff"
      : "#f8fafc"};
  color: #132e58;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  cursor: pointer;
`;

const SearchRow = styled.div`
  display: grid;
  grid-template-columns: minmax(10rem, 14rem) 1fr;
  gap: 0.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const SearchSelect = styled.select`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #dbe2ea;
  border-radius: 10px;
  padding: 0.55rem 0.75rem;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  color: #132e58;
  background: #f8fafc;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: #132e58;
    background: #fff;
  }
`;

const Search = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #dbe2ea;
  border-radius: 10px;
  padding: 0.55rem 0.75rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: #132e58;
  background: #f8fafc;
  &:focus {
    outline: none;
    border-color: #132e58;
    background: #fff;
  }
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.35rem;
  margin-bottom: 0.55rem;
  font-size: 0.75rem;
  color: #64748b;
`;

const ErrorBox = styled.div`
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 0.65rem 0.85rem;
  font-size: 0.8125rem;
  margin-bottom: 0.75rem;
`;

const Card = styled.section`
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(19, 46, 88, 0.06);
  margin-bottom: 0.85rem;
`;

const Empty = styled.p`
  margin: 0;
  padding: 2rem 1.25rem;
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
`;

const DayBlock = styled.div`
  & + & {
    border-top: 1px solid #eef2f7;
  }
`;

const DayHeading = styled.h3`
  margin: 0;
  padding: 0.75rem 1rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #132e58;
  background: #f8fafc;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  border-bottom: 1px solid #eef2f7;
`;

const Table = styled.div`
  display: flex;
  flex-direction: column;
`;

const TableHead = styled.div`
  display: grid;
  grid-template-columns: 5.5rem 4.5rem minmax(10rem, 1.6fr) 5rem 5rem 5rem 5rem;
  gap: 0.5rem;
  padding: 0.45rem 1rem;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
  border-bottom: 1px solid #eef2f7;

  @media (max-width: 900px) {
    display: none;
  }
`;

const Row = styled.div<{ $past?: boolean }>`
  display: grid;
  grid-template-columns: 5.5rem 4.5rem minmax(10rem, 1.6fr) 5rem 5rem 5rem 5rem;
  gap: 0.5rem;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  opacity: ${({ $past }) => ($past ? 0.62 : 1)};
  background: #fff;

  &:hover {
    background: #fafbfc;
  }

  @media (max-width: 900px) {
    grid-template-columns: 4.5rem 1fr auto;
    grid-template-areas:
      "time title impact"
      "cur title impact"
      "vals vals vals";
  }
`;

const Cell = styled.div<{
  $emphasis?: boolean;
  $area?: string;
  $desktopOnly?: boolean;
}>`
  font-size: 0.8125rem;
  color: #132e58;
  font-variant-numeric: tabular-nums;
  font-weight: ${({ $emphasis }) => ($emphasis ? 700 : 500)};

  @media (max-width: 900px) {
    grid-area: ${({ $area }) => $area || "auto"};
    ${({ $desktopOnly }) => $desktopOnly && "display: none;"}
  }
`;

const MobileVals = styled.div`
  display: none;
  @media (max-width: 900px) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem 1rem;
    grid-area: vals;
    font-size: 0.75rem;
    color: #64748b;
    padding-top: 0.2rem;
    strong {
      color: #132e58;
      font-variant-numeric: tabular-nums;
    }
  }
`;

const TimeMain = styled.div`
  font-weight: 700;
`;

const TimeSub = styled.div`
  font-size: 0.6875rem;
  color: #d69e2e;
  font-weight: 700;
  margin-top: 0.1rem;
`;

const CurrencyBadge = styled.span`
  display: inline-flex;
  padding: 0.2rem 0.45rem;
  border-radius: 6px;
  background: #eef2ff;
  color: #132e58;
  font-size: 0.75rem;
  font-weight: 800;
`;

const EventTitle = styled.div`
  font-weight: 700;
  line-height: 1.3;
`;

const EventCountry = styled.div`
  font-size: 0.6875rem;
  color: #64748b;
  margin-top: 0.1rem;
`;

const ImpactPill = styled.span<{ $tone: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 4.2rem;
  padding: 0.2rem 0.45rem;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: capitalize;
  background: ${({ $tone }) =>
    $tone === "high" ? "#fef2f2" : $tone === "medium" ? "#fffbeb" : "#f1f5f9"};
  color: ${({ $tone }) =>
    $tone === "high" ? "#b91c1c" : $tone === "medium" ? "#b45309" : "#475569"};
`;

const TvToggleRow = styled.div`
  display: flex;
  justify-content: center;
  margin: 0.5rem 0 0.85rem;
`;

const TvToggle = styled.button`
  border: none;
  background: transparent;
  color: #132e58;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
`;

const Note = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  color: #64748b;
  text-align: center;
  line-height: 1.5;
`;
