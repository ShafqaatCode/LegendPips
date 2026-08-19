import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";
import RegisterModal from "../../pages/Register/RegisterModal";
import { useAuth } from "../../contexts/AuthContext";
import ArrowIcon from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg";
import bankIcon from "../../assets/icons/bank-transfer 1.svg";

import paypalLogo from "../../assets/payment/paypal-ar21.svg";
import skrillLogo from "../../assets/payment/skrill.svg";
import netellerLogo from "../../assets/payment/neteller.svg";
import fasapayLogo from "../../assets/payment/fasapay.svg";
import perfectMoneyLogo from "../../assets/payment/perfectmoney.svg";
import voletLogo from "../../assets/payment/volet.svg";
import usdtTrc20Logo from "../../assets/payment/usdt-trc20.svg";
import usdtBep20Logo from "../../assets/payment/usdt-bep20.svg";
import usdcLogo from "../../assets/payment/usdc.svg";
import wiseLogo from "../../assets/payment/wise.svg";
import payoneerLogo from "../../assets/payment/payoneer.svg";

type PaymentMethod = {
  id: string;
  alt: string;
  src?: string;
  variant?: "wire";
};

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "paypal", alt: "PayPal", src: paypalLogo },
  { id: "skrill", alt: "Skrill", src: skrillLogo },
  { id: "neteller", alt: "NETELLER", src: netellerLogo },
  { id: "fasapay", alt: "FasaPay", src: fasapayLogo },
  { id: "wire", alt: "Wire Transfer", variant: "wire" },
  { id: "perfectmoney", alt: "Perfect Money", src: perfectMoneyLogo },
  { id: "volet", alt: "Volet", src: voletLogo },
  { id: "usdt-trc20", alt: "USDT TRC20", src: usdtTrc20Logo },
  { id: "usdt-bep20", alt: "USDT BEP20", src: usdtBep20Logo },
  { id: "usdc", alt: "USDC", src: usdcLogo },
  { id: "wise", alt: "Wise", src: wiseLogo },
  { id: "payoneer", alt: "Payoneer", src: payoneerLogo },
];

const Section = styled.section`
  background: ${({ theme }) => theme.colors.WHITE};
  padding: clamp(2.5rem, 5vw, 3.5rem) 0;
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1.5rem, 3vw, 2rem);
  box-sizing: border-box;
`;

const LogoPanel = styled.div`
  width: 100%;
  background: linear-gradient(180deg, #fafbfc 0%, ${({ theme }) => theme.colors.WHITE} 100%);
  border: 1px solid #e8eaef;
  border-radius: 14px;
  padding: clamp(1.25rem, 2.5vw, 1.75rem);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 10px 28px rgba(15, 23, 42, 0.06);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.gold} 100%);
  }
`;

const LogoRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const LogoGrid = styled.div<{ $columns?: number; $center?: boolean }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns ?? 4}, minmax(0, 1fr));
  gap: 0.85rem;
  width: ${({ $center }) => ($center ? "min(100%, 720px)" : "100%")};
  margin: ${({ $center }) => ($center ? "0 auto" : "0")};

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
    margin: 0;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const BrandTile = styled.div`
  background: ${({ theme }) => theme.colors.WHITE};
  border: 1px solid #e8eaef;
  border-radius: 12px;
  min-height: 80px;
  padding: 1rem 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;

  &:hover {
    border-color: rgba(251, 191, 36, 0.55);
    box-shadow: 0 4px 16px rgba(19, 46, 88, 0.08);
    transform: translateY(-2px);
  }
`;

const BrandLogo = styled.img`
  display: block;
  max-width: 92%;
  max-height: 42px;
  width: auto;
  height: auto;
  object-fit: contain;
`;

const WireMark = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  text-align: center;

  img {
    width: 22px;
    height: 22px;
    object-fit: contain;
  }

  span {
    font-size: 0.625rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: ${({ theme }) => theme.colors.primary};
    line-height: 1.2;
  }
`;

const SignupButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.75rem 2.25rem;
  min-width: 240px;
  border: none;
  border-radius: 30px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.WHITE};
  font-size: 0.9375rem;
  font-weight: 600;
  font-family: inherit;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(19, 46, 88, 0.22);
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;

  &:hover {
    background: #1a3d6e;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(19, 46, 88, 0.28);
  }

  img {
    width: 20px;
    height: 20px;
    filter: brightness(0) invert(1);
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 320px;
  }
`;

const PaymentMethodsSection: React.FC = () => {
  const [signupOpen, setSignupOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleSignup = () => {
    if (isAuthenticated) {
      navigate(user?.role === "admin" ? "/admin-panel" : "/user-panel");
      return;
    }
    setSignupOpen(true);
  };

  const renderBrand = (method: PaymentMethod) => (
    <BrandTile key={method.id}>
      {method.variant === "wire" ? (
        <WireMark>
          <img src={bankIcon} alt="" aria-hidden />
          <span>WIRE TRANSFER</span>
        </WireMark>
      ) : (
        <BrandLogo src={method.src} alt={method.alt} loading="lazy" />
      )}
    </BrandTile>
  );

  return (
    <Section aria-labelledby="payment-methods-heading">
      <Inner>
        <SectionHeadingSet
          upperText="Secure payouts & deposits"
          mainHeading="Payment Methods"
          subText="Fund your account and withdraw rebates through trusted global payment providers."
        />

        <LogoPanel>
          <LogoRows>
            <LogoGrid $columns={4}>{PAYMENT_METHODS.map(renderBrand)}</LogoGrid>
          </LogoRows>
        </LogoPanel>

        <SignupButton type="button" onClick={handleSignup}>
          Signup For Free
          <img src={ArrowIcon} alt="" aria-hidden />
        </SignupButton>
      </Inner>

      <RegisterModal isOpen={signupOpen} onClose={() => setSignupOpen(false)} />
    </Section>
  );
};

export default PaymentMethodsSection;
