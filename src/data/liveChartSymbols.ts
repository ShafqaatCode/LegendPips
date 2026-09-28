export type LiveChartSymbol = {
  id: string;
  label: string;
  tvSymbol: string;
  group: "forex" | "metals" | "crypto" | "indices";
};

export const LIVE_CHART_SYMBOLS: LiveChartSymbol[] = [
  { id: "eurusd", label: "EUR/USD", tvSymbol: "FX:EURUSD", group: "forex" },
  { id: "gbpusd", label: "GBP/USD", tvSymbol: "FX:GBPUSD", group: "forex" },
  { id: "usdjpy", label: "USD/JPY", tvSymbol: "FX:USDJPY", group: "forex" },
  { id: "audusd", label: "AUD/USD", tvSymbol: "FX:AUDUSD", group: "forex" },
  { id: "usdcad", label: "USD/CAD", tvSymbol: "FX:USDCAD", group: "forex" },
  { id: "xauusd", label: "Gold", tvSymbol: "OANDA:XAUUSD", group: "metals" },
  { id: "xagusd", label: "Silver", tvSymbol: "OANDA:XAGUSD", group: "metals" },
  { id: "btcusd", label: "BTC/USD", tvSymbol: "BINANCE:BTCUSDT", group: "crypto" },
  { id: "ethusd", label: "ETH/USD", tvSymbol: "BINANCE:ETHUSDT", group: "crypto" },
  { id: "nas100", label: "NAS100", tvSymbol: "FOREXCOM:NAS100", group: "indices" },
  { id: "us30", label: "US30", tvSymbol: "FOREXCOM:US30", group: "indices" },
];

export const DEFAULT_LIVE_CHART_SYMBOL = LIVE_CHART_SYMBOLS[0];
