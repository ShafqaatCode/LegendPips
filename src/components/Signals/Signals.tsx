import type React from "react";
import styled from "styled-components";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";
import SignalBox from "./SignalBox";

const SignalsSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 650px;
  // border: 2px solid red;

  margin: 1rem 1rem;
`;

const SignalImgContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;

  img {
    height: 250px;
  }
`;



const Signals: React.FC = () => {
  return (
    <SignalsSection>
      <SectionHeadingSet
        upperText="ALL IN ONE TRADING PLATFORM"
        mainHeading="LIVE SIGNALS"
        subText="Trade, earn, repeat. With rebates, expert tools, and a strong community, Legend Pips makes every trade more rewarding."
      />
      <SignalImgContainer>
        <SignalBox
          pair="EUR/USD"
          type="BUY"
          timeAgo="2h ago"
          entry="1.0843"
          current="1.0902"
          takeProfit="1.1000"
          stopLoss="1.0780"
          status="Active"
          pips="+63 Pips"
        />
        <SignalBox
          pair="EUR/USD"
          type="BUY"
          timeAgo="2h ago"
          entry="1.0843"
          current="1.0902"
          takeProfit="1.1000"
          stopLoss="1.0780"
          status="Active"
          pips="+63 Pips"
        />
        <SignalBox
          pair="EUR/USD"
          type="BUY"
          timeAgo="2h ago"
          entry="1.0843"
          current="1.0902"
          takeProfit="1.1000"
          stopLoss="1.0780"
          status="Closed"
          pips="+63 Pips"
        />
      </SignalImgContainer>
    </SignalsSection>
  );
};

export default Signals;
