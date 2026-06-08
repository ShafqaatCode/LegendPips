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
    id: "rebate",
    title: "Rebate Calculator",
    shortLabel: "Cashback estimate",
    path: "/rebate-calculator",
    description:
      "Get instant insight into potential cashback earnings. Enter your deposit currency, rebate level, traded pair, and volume in lots to estimate how much you can earn through LegendPips.",
  },
];
