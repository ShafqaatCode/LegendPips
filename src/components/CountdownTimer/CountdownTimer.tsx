import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

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

// Styled
const CountdownBox = styled.div`
  display: flex;
  align-items: center;
  background-color: #1d3250;
  color: white;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
`;

const TimeUnit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 1rem;

  strong {
    font-size: 1.2rem;
    font-weight: 400;
  }

  span {
    font-size: 14px;
    color: #b0c4de;
    margin-top: 0.5rem;
  }
`;

const Colon = styled.span`
  /* font-weight: bold; */
  font-size: 1.3rem;
`;
