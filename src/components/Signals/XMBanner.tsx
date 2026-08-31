import React from "react";
import styled from "styled-components";
import XmLogo from "../../assets/TradeMarketBrands/Ellipse 2-1.png";

const BannerWrapper = styled.section`
  position: relative;
  overflow: hidden;
  background: linear-gradient(105deg, #0f1f3a 0%, #132e58 48%, #1a3d6b 100%);
  border-radius: 14px;
  padding: clamp(1.1rem, 2.2vw, 1.35rem) clamp(1.15rem, 2.5vw, 1.75rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(1rem, 2.5vw, 1.75rem);
  margin: 0 0 1.5rem;
  box-shadow: 0 12px 28px rgba(19, 46, 88, 0.18);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 50% 120% at 100% 50%, rgba(251, 191, 36, 0.14) 0%, transparent 55%);
    pointer-events: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    padding: 1.25rem 1.1rem;
  }
`;

const LeftContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex: 1 1 100%;
    justify-content: center;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const DollarIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(145deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  font-weight: 800;
  color: #132e58;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.35);
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
`;

const BannerEyebrow = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(251, 191, 36, 0.95);
`;

const BannerText = styled.h3`
  color: white;
  font-size: clamp(1rem, 1.1vw + 0.75rem, 1.35rem);
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.01em;
`;

const RightContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    flex-direction: column;
    gap: 0.85rem;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.35rem 0.65rem 0.35rem 0.35rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
`;

const Logo = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 50%;
  background: #111;
`;

const LogoText = styled.span`
  color: rgba(255, 255, 255, 0.92);
  font-size: 0.8125rem;
  font-weight: 600;
  padding-right: 0.35rem;
  white-space: nowrap;
`;

const TradeButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #22c55e;
  color: white;
  border: none;
  padding: 0.7rem 1.35rem;
  font-size: 0.875rem;
  font-weight: 700;
  border-radius: 999px;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  white-space: nowrap;
  font-family: ${({ theme }) => theme.font.family};

  &:hover {
    background: #16a34a;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(34, 197, 94, 0.35);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    max-width: 240px;
  }
`;

const XMBanner: React.FC = () => {
  return (
    <BannerWrapper>
      <LeftContent>
        <DollarIcon>$</DollarIcon>
        <TextBlock>
          <BannerEyebrow>Partner offer</BannerEyebrow>
          <BannerText>Claim up to $10,600 Deposit Bonus</BannerText>
        </TextBlock>
      </LeftContent>
      <RightContent>
        <LogoContainer>
          <Logo src={XmLogo} alt="XM" />
          <LogoText>Trade at XM</LogoText>
        </LogoContainer>
        <TradeButton
          href="https://www.xm.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Trade at XM
        </TradeButton>
      </RightContent>
    </BannerWrapper>
  );
};

export default XMBanner;
