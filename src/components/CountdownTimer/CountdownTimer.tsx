import React, { useEffect, useState, useRef } from 'react';
import { CountdownBox, Colon, TimeUnit } from "./CountdownTimer.styles";

interface CountDownProps {
  endTime: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountDown: React.FC<CountDownProps> = ({ endTime }) => {
  const calculateTimeLeft = (): TimeLeft => {
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

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Stop timer if finished
      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [endTime]);

  return (
    <CountdownBox>
      <TimeUnit>
        <strong>{timeLeft.days}</strong>
        <span>{timeLeft.days === 1 ? "DAY" : "DAYS"}</span>
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
