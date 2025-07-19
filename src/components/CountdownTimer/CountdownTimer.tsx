import React, { useEffect, useState } from 'react';
import {
  CountdownBox,
  Colon,
  TimeUnit
} from "./CountdownTimer.styles"

interface CountDownProps {
  endTime: Date;
}

const CountDown: React.FC<CountDownProps> = ({ endTime }) => {
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const end = endTime.getTime();
    const difference = end - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <CountdownBox>
      <TimeUnit>
        <strong>{timeLeft.days}</strong>

        <span>DAY</span>
      </TimeUnit>
      <Colon>:</Colon>
      <TimeUnit>
        <strong>{String(timeLeft.hours).padStart(2, '0')}</strong>
        <span>HR</span>
      </TimeUnit>
      <Colon>:</Colon>
      <TimeUnit>
        <strong>{String(timeLeft.minutes).padStart(2, '0')}</strong>
        <span>MIN</span>
      </TimeUnit>
      <Colon>:</Colon>
      <TimeUnit>
        <strong>{String(timeLeft.seconds).padStart(2, '0')}</strong>
        <span>SEC</span>
      </TimeUnit>
    </CountdownBox>
  );
};

export default CountDown;
