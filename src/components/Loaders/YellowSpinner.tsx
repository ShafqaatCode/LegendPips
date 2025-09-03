// Spinner.tsx
import React from "react";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

const SpinnerWrapper = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
  animation: ${rotate} 1.2s linear infinite;
`;

const Dot = styled.div<{ index: number }>`
  position: absolute;
  width: 14px;
  height: 14px;
  background-color: #d97706; /* Orange */
  border-radius: 50%;
  animation: ${bounce} 1.2s infinite ease-in-out;
  animation-delay: ${({ index }) => `${-1.1 + index * 0.1}s`};

  top: 50%;
  left: 50%;
  transform-origin: -24px 0; /* Moves dots in a circle */

  ${({ index }) => `
    transform: rotate(${index * 45}deg) translate(24px, -50%);
  `}
`;

const Spinner: React.FC = () => {
  return (
    <SpinnerWrapper>
      {Array.from({ length: 8 }).map((_, i) => (
        <Dot key={i} index={i} />
      ))}
    </SpinnerWrapper>
  );
};

export default Spinner;
