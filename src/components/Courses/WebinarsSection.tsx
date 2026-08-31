import React from 'react';
import styled from 'styled-components';

const SectionWrapper = styled.section`
  background: #fafbfc;
  padding: 80px 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 60px 2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 40px 1.5rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const LeftContent = styled.div``;

const Heading = styled.h2`
  font-size: clamp(1.35rem, 1.5vw + 0.7rem, 1.75rem);
  font-weight: 700;
  color: #132E58;
  margin-bottom: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.25rem;
  }
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: #555;
  margin-bottom: 2rem;
`;

const WatchButton = styled.button`
  background: #132E58;
  color: white;
  border: none;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #0b1b38;
    transform: translateY(-2px);
  }
`;

const RightContent = styled.div`
  border-radius: 16px;
  overflow: hidden;
  background: #f5f5f5;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-height: 300px;
  }
`;

const LaptopIllustration = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%);
`;

const LaptopContainer = styled.div`
  width: 300px;
  height: 200px;
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 250px;
    height: 160px;
  }
`;

const LaptopBase = styled.div`
  width: 100%;
  height: 60%;
  background: #d0d0d0;
  border-radius: 8px 8px 2px 2px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 8px;
    background: #b0b0b0;
    border-radius: 0 0 4px 4px;
  }
`;

const LaptopScreen = styled.div`
  width: 100%;
  height: 40%;
  background: linear-gradient(135deg, #e8f4ff 0%, #d0e8ff 100%);
  border-radius: 4px 4px 8px 8px;
  position: relative;
  border: 3px solid #d0d0d0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 12px;
    background: #132E58;
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 20%;
    left: 10%;
    right: 10%;
    bottom: 10%;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border-radius: 4px;
    opacity: 0.3;
  }
`;

const BlueBand = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(135deg, #e8f4ff 0%, #d0e8ff 100%);
  transform: translateY(-50%);
  z-index: 1;
`;

const WebinarsSection: React.FC = () => {
  return (
    <SectionWrapper>
      <ContentWrapper>
        <LeftContent>
          <Heading>Trading Webinars, Live and Replay</Heading>
          <Description>
            Join free live webinars or watch past trading sessions anytime. Learn real-time market analysis, live trade executions, position sizing, risk control, and disciplined trading psychology. Master real-time analysis and live market conditions.
          </Description>
          <WatchButton>Watch Webinars</WatchButton>
        </LeftContent>
        <RightContent>
          <LaptopIllustration>
            <BlueBand />
            <LaptopContainer>
              <LaptopScreen />
              <LaptopBase />
            </LaptopContainer>
          </LaptopIllustration>
        </RightContent>
      </ContentWrapper>
    </SectionWrapper>
  );
};

export default WebinarsSection;
