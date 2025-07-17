import React from "react";
import { TimerContainer, TimerItem, TimeValue, TimeLabel } from "./CountdownTimer.styles";

interface Props {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<Props> = ({ days, hours, minutes, seconds }) => {
  return (
    <TimerContainer>
      <TimerItem>
        <TimeValue>{days}</TimeValue>
        <TimeLabel>DAY</TimeLabel>
      </TimerItem>
      <TimerItem>
        <TimeValue>{String(hours).padStart(2, "0")}</TimeValue>
        <TimeLabel>HR</TimeLabel>
      </TimerItem>
      <TimerItem>
        <TimeValue>{String(minutes).padStart(2, "0")}</TimeValue>
        <TimeLabel>MIN</TimeLabel>
      </TimerItem>
      <TimerItem>
        <TimeValue>{String(seconds).padStart(2, "0")}</TimeValue>
        <TimeLabel>SEC</TimeLabel>
      </TimerItem>
    </TimerContainer>
  );
};

export default CountdownTimer;
