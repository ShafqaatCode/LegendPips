import type React from "react";
import styled from "styled-components";
import {
  SectionHeading,
  UpperHeading,
  SubHeading,
} from "../SharedStyleComponents/StyleHeadings.styles";
// import SignalBoxImg from "../../assets/Frame 157.svg";
import MathImg from "../../assets/icons/all-svgrepo-com 1.svg";
import SignalBox from "./SignalBox";

const SignalsSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 700px;

  // margin: 0rem 1rem;
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

const UpperHeadingDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
`;

const Signals: React.FC = () => {
  return (
    <SignalsSection>
      <div>
        <UpperHeadingDiv>
          <img src={MathImg} alt="" />
          <UpperHeading>All IN ONE TRADING PlATEFORM</UpperHeading>
        </UpperHeadingDiv>
        <SectionHeading>LIVE SIGNALS</SectionHeading>
        <SubHeading>
          Trade, earn, repeat. With rebates, expert tools, and a strong
          community, Legend Pips makes every trade more rewarding.
        </SubHeading>
      </div>
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
