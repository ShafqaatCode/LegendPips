export type CalculatorItem = {
  id: string;
  title: string;
  shortLabel: string;
  path: string;
  description: string;
};

export const CALCULATORS_INTRO =
  "Simple, accurate trading calculators for everyday decisions — position size, margin, pips, profit, and risk. Educational estimates only; always confirm with your broker.";

export const CALCULATORS_CATALOG: CalculatorItem[] = [
  {
    id: "lot-size",
    title: "Position Size Calculator",
    shortLabel: "Easy lot sizing",
    path: "/position-size-calculator",
    description:
      "Enter balance, risk %, and stop-loss pips — get the correct lot size using standard pip values.",
  },
  {
    id: "account-risk",
    title: "Account Risk Calculator",
    shortLabel: "Risk $ + lots",
    path: "/account-risk-calculator",
    description:
      "See risk in dollars from your balance and %, plus the lot size for your stop-loss. Updates live.",
  },
  {
    id: "pip",
    title: "Pip Calculator",
    shortLabel: "Pip value",
    path: "/pip-calculator",
    description: "See how much a pip move is worth for your lot size and pair.",
  },
  {
    id: "margin",
    title: "Margin Calculator",
    shortLabel: "Required margin",
    path: "/margin-calculator",
    description: "Required margin from lots, price, and leverage — clear and accurate.",
  },
  {
    id: "profit",
    title: "Profit Calculator",
    shortLabel: "P/L estimate",
    path: "/profit-calculator",
    description: "Quick P/L from lots × pip value × pips.",
  },
  {
    id: "break-even",
    title: "Break-Even Calculator",
    shortLabel: "Cover costs",
    path: "/break-even-calculator",
    description: "Pips needed to cover spread and commission before profit.",
  },
  {
    id: "rr",
    title: "Risk / Reward Calculator",
    shortLabel: "R:R ratio",
    path: "/risk-reward-calculator",
    description: "Check whether a planned target justifies the stop.",
  },
  {
    id: "drawdown",
    title: "Drawdown Calculator",
    shortLabel: "Peak to trough",
    path: "/drawdown-calculator",
    description: "Measure percentage drawdown between peak and trough equity.",
  },
  {
    id: "compound",
    title: "Compound Calculator",
    shortLabel: "Growth projection",
    path: "/compound-calculator",
    description: "Project balance growth from a constant monthly return.",
  },
  {
    id: "lot",
    title: "Lot Calculator",
    shortLabel: "Units to lots",
    path: "/lot-calculator",
    description: "Convert units into standard, mini, and micro lots.",
  },
  {
    id: "pivot",
    title: "Pivot Point Calculator",
    shortLabel: "Support & resistance",
    path: "/pivot-point-calculator",
    description: "Standard, Woodie, Camarilla, and DeMark pivots from OHLC.",
  },
  {
    id: "fibonacci",
    title: "Fibonacci Calculator",
    shortLabel: "Retracements & extensions",
    path: "/fibonacci-calculator",
    description: "Fibonacci levels from swing high and low.",
  },
  {
    id: "rebate",
    title: "Rebate Calculator",
    shortLabel: "Cashback estimate",
    path: "/rebate-calculator",
    description: "Estimate LegendPips cashback from traded volume.",
  },
  {
    id: "crypto-profit",
    title: "Crypto Profit Calculator",
    shortLabel: "Coin P/L",
    path: "/crypto-profit-calculator",
    description: "Simple buy versus sell profit for a crypto quantity.",
  },
  {
    id: "risk-of-ruin",
    title: "Risk of Ruin Calculator",
    shortLabel: "Account survival",
    path: "/risk-of-ruin-calculator",
    description: "Estimate chance of losing the account given win rate and risk.",
  },
  {
    id: "crypto-exchange-fees",
    title: "Crypto Exchange Fees Calculator",
    shortLabel: "Round-trip fees",
    path: "/crypto-exchange-fees-calculator",
    description: "Buy and sell fees for a round-trip crypto trade.",
  },
];
