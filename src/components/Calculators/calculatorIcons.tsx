import React from "react";
import {
  FiActivity,
  FiAlertTriangle,
  FiBarChart2,
  FiCrosshair,
  FiDollarSign,
  FiGift,
  FiGitBranch,
  FiHexagon,
  FiLayers,
  FiPercent,
  FiPieChart,
  FiShield,
  FiTarget,
  FiTrendingDown,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

/** Shared calculator card icons — every catalog id must have one. */
export function getCalculatorIcon(id: string, size = 20): React.ReactNode {
  const props = { size, "aria-hidden": true as const };
  switch (id) {
    case "lot-size":
      return <FiLayers {...props} />;
    case "account-risk":
      return <FiShield {...props} />;
    case "pip":
      return <FiActivity {...props} />;
    case "margin":
      return <FiDollarSign {...props} />;
    case "profit":
      return <FiTrendingUp {...props} />;
    case "break-even":
      return <FiTarget {...props} />;
    case "rr":
      return <FiCrosshair {...props} />;
    case "drawdown":
      return <FiTrendingDown {...props} />;
    case "compound":
      return <FiZap {...props} />;
    case "lot":
      return <FiPieChart {...props} />;
    case "pivot":
      return <FiBarChart2 {...props} />;
    case "fibonacci":
      return <FiGitBranch {...props} />;
    case "rebate":
      return <FiGift {...props} />;
    case "crypto-profit":
      return <FiHexagon {...props} />;
    case "risk-of-ruin":
      return <FiAlertTriangle {...props} />;
    case "crypto-exchange-fees":
      return <FiPercent {...props} />;
    default:
      return <FiBarChart2 {...props} />;
  }
}
