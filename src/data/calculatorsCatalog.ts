export type CalculatorItem = {
  id: string;
  title: string;
  shortLabel: string;
  path: string;
  description: string;
};

export const CALCULATORS_INTRO =
  "Each of our calculators was designed to empower traders with essential tools for effective decision-making and risk management. These calculators are indispensable for both novice and experienced traders, providing valuable insights into risk management, trade sizing, margin requirements, technical analysis, and potential earnings.";

export const CALCULATORS_CATALOG: CalculatorItem[] = [
  {
    id: "lot-size",
    title: "Lot Size Calculator",
    shortLabel: "Position sizing",
    path: "/position-size-calculator",
    description:
      "Align trade sizes with your risk tolerance, prevent excessive losses, and optimize profit potential. Determines the appropriate lot size based on your currency pair, account balance, risk percentage, and stop-loss level.",
  },
  {
    id: "pip",
    title: "Pip Calculator",
    shortLabel: "Pip value",
    path: "/pip-calculator",
    description:
      "Evaluate potential profits or losses across standard, mini, and micro accounts based on your lot size. See exactly how much each pip move is worth in your deposit currency for smarter risk management.",
  },
  {
    id: "margin",
    title: "Margin Calculator",
    shortLabel: "Required margin",
    path: "/margin-calculator",
    description:
      "Determine the margin required to open a trade using your account currency, traded pair, leverage, and position size. Essential for staying within acceptable risk levels and avoiding margin calls.",
  },
  {
    id: "pivot",
    title: "Pivot Point Calculator",
    shortLabel: "Support & resistance",
    path: "/pivot-point-calculator",
    description:
      "Calculate Camarilla, Woodie's, Floor, and DeMark pivot points from OHLC data. Generates multiple support and resistance levels to help you plan entries, exits, and stop placements.",
  },
  {
    id: "fibonacci",
    title: "Fibonacci Calculator",
    shortLabel: "Retracements & extensions",
    path: "/fibonacci-calculator",
    description:
      "Identify potential Fibonacci retracement and extension levels from a swing high and low. Switch between uptrend and downtrend to map key zones for entries, exits, and profit targets.",
  },
  {
    id: "rebate",
    title: "Rebate Calculator",
    shortLabel: "Cashback estimate",
    path: "/rebate-calculator",
    description:
      "Get instant insight into potential cashback earnings. Enter your deposit currency, rebate level, traded pair, and volume in lots to estimate how much you can earn through LegendPips.",
  },
  {
    id: "profit",
    title: "Profit Calculator",
    shortLabel: "P/L estimate",
    path: "/profit-calculator",
    description: "Estimate profit or loss from lots, pip value, and pip distance.",
  },
  {
    id: "lot",
    title: "Lot Calculator",
    shortLabel: "Units to lots",
    path: "/lot-calculator",
    description: "Convert units of base currency into standard lots.",
  },
  {
    id: "rr",
    title: "Risk / Reward Calculator",
    shortLabel: "R:R ratio",
    path: "/risk-reward-calculator",
    description: "Check whether a planned target justifies the stop distance.",
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
    id: "crypto-profit",
    title: "Crypto Profit Calculator",
    shortLabel: "Coin P/L",
    path: "/crypto-profit-calculator",
    description: "Simple buy versus sell profit for a crypto quantity.",
  },
];
