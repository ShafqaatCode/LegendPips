import React from "react";
import { Navigate } from "react-router-dom";

/** Streak UX moved into the Rewards dashboard. */
const MyStreak: React.FC = () => {
  return <Navigate to="/user-panel/rewards#trading-streak" replace />;
};

export default MyStreak;
