// SignalBox.tsx
import React from "react";
import {
  SignalBoxContainer,
  SignalTopbar,
  AssetInfo,
  StatusWrapper,
  SignalContentGrid,
  SignalItem,
  SignalLabel,
  SignalValue,
  SignalBottombar,
  PipsValue,
} from "./SignalBox.styles";

import ClockIcon from "../../assets/icons/ClockIcon.svg";
import ActiveIcon from "../../assets/icons/GreenCircleIcon.svg";

interface SignalBoxProps {
  pair: string;
  type: "BUY" | "SELL";
  timeAgo: string;
  entry: string;
  current: string;
  takeProfit: string;
  stopLoss: string;
  status?: "Active" | "Closed";
  pips: string;
}

const SignalBox: React.FC<SignalBoxProps> = ({
  pair,
  type,
  timeAgo,
  entry,
  current,
  takeProfit,
  stopLoss,
  status,
  pips,
}) => {
  return (
    <SignalBoxContainer>
      <SignalTopbar>
        <AssetInfo>
          <h3>{pair}</h3>
          <button>{type}</button>
        </AssetInfo>

        <StatusWrapper>
          <img src={ClockIcon} alt="Clock Icon" />
          <p>{timeAgo}</p>
        </StatusWrapper>
      </SignalTopbar>

      <SignalContentGrid>
        <SignalItem>
          <SignalLabel>Entry</SignalLabel>
          <SignalValue>{entry}</SignalValue>
        </SignalItem>
        <SignalItem>
          <SignalLabel>Current</SignalLabel>
          <SignalValue>{current}</SignalValue>
        </SignalItem>
        <SignalItem>
          <SignalLabel>Take Profit</SignalLabel>
          <SignalValue>{takeProfit}</SignalValue>
        </SignalItem>
        <SignalItem>
          <SignalLabel>Stop Loss</SignalLabel>
          <SignalValue>{stopLoss}</SignalValue>
        </SignalItem>
      </SignalContentGrid>

      <SignalBottombar>
        <StatusWrapper>
          <img src={ActiveIcon} alt="Status Icon" />
          <p>{status}</p>
        </StatusWrapper>

        <PipsValue>{pips}</PipsValue>
      </SignalBottombar>
    </SignalBoxContainer>
  );
};

export default SignalBox;
