import React from 'react';
import styled from 'styled-components';
import XmLogo from '../../assets/TradeMarketBrands/Ellipse 2-1.png';

const BannerWrapper = styled.section`
  background: #2d2d2d;
  padding: 2rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin: 2rem 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 1.5rem 2rem;
    flex-wrap: wrap;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.5rem;
    flex-direction: column;
    text-align: center;
  }
`;

const LeftContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const DollarIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f4b400 0%, #fbbf24 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  color: #2d2d2d;
  flex-shrink: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 50px;
    height: 50px;
    font-size: 28px;
  }
`;

const BannerText = styled.h3`
  color: white;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 24px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 20px;
  }
`;

const RightContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const Logo = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 50px;
    height: 50px;
  }
`;

const LogoText = styled.span`
  color: white;
  font-size: 14px;
  font-weight: 500;
`;

const TradeButton = styled.button`
  background: #27ae60;
  color: white;
  border: none;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background: #229954;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(39, 174, 96, 0.4);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 10px 24px;
    font-size: 14px;
    width: 100%;
    max-width: 200px;
  }
`;

const XMBanner: React.FC = () => {
  return (
    <BannerWrapper>
      <LeftContent>
        <DollarIcon>$</DollarIcon>
        <BannerText>Claim up to $10,600 Deposit Bonus</BannerText>
      </LeftContent>
      <RightContent>
        <LogoContainer>
          <Logo src={XmLogo} alt="XM Logo" />
          <LogoText>Trade at XM</LogoText>
        </LogoContainer>
        <TradeButton>Trade at XM</TradeButton>
      </RightContent>
    </BannerWrapper>
  );
};

export default XMBanner;
