// src/components/layout/TopHeader/TopHeader.tsx
import React from 'react';
import {
  TopContainer,
  HeaderLink,
  Logo,
  LinkGroup,
  HeaderItem,
  SignInButton
} from './TopHeader.styles';

import LogoImg from '../../assets/icons/Logo.png';
import SupportIcon from '../../assets/icons/SupportIcon.svg';
import CalculatorIcon from '../../assets/icons/calculator-svgrepo-com (1) 1.svg';
import LocationIcon from '../../assets/icons/Location marker.svg';

const TopHeader: React.FC = () => {
  return (
    <TopContainer>
      <HeaderLink to="/">
        <Logo src={LogoImg} alt="LegendPips Logo" />
      </HeaderLink>

      <LinkGroup>
        <HeaderLink to="/live-chat">
          <HeaderItem>
            <img src={SupportIcon} alt="Live Chat Icon" />
            
            <span>Live Chat</span>
          </HeaderItem>
        </HeaderLink>

        <HeaderLink to="/calculator">
          <HeaderItem>
            <img src={CalculatorIcon} alt="Calculator Icon" />
            <span>Rebate Calculator</span>
          </HeaderItem>
        </HeaderLink>

        <HeaderLink to="/location">
          <HeaderItem>
            <img src={LocationIcon} alt="Location Icon" />
            <span>United States</span>
          </HeaderItem>
        </HeaderLink>

        <HeaderLink to="/signin">
          <HeaderItem>
            <SignInButton>Sign In</SignInButton>
          </HeaderItem>
        </HeaderLink>
      </LinkGroup>
    </TopContainer>
  );
};

export default TopHeader;
