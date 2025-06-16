import React from "react";
import {
  TopContainer,
  Logo,
  HeaderLink,
  SignInButton,
  DesktopGroup,
  MobileBar,
  HeaderItem,
} from "./TopHeader.styles";

import LogoImg from "../../assets/icons/Logo_Svg.svg";
import SupportIcon from "../../assets/icons/SupportIcon.svg";
import CalculatorIcon from "../../assets/icons/calculator-svgrepo-com (1) 1.svg";
import LocationIcon from "../../assets/icons/Location marker.svg";
import { FaBars } from "react-icons/fa";


const TopHeader: React.FC = () => {
  return (
    <>
      {/* Desktop TopBar */}
      <TopContainer className="desktop-only">
        <HeaderLink to="/">
          <Logo src={LogoImg} alt="LegendPips Logo" />
        </HeaderLink>

        <DesktopGroup>
          <HeaderLink to="/live-chat">
            <HeaderItem>
              <img src={SupportIcon} alt="Live Chat" />
              <span>Live Chat</span>
            </HeaderItem>
          </HeaderLink>
          <HeaderLink to="/calculator">
            <HeaderItem>
              <img src={CalculatorIcon} alt="Calculator" />
              <span>Rebate Calculator</span>
            </HeaderItem>
          </HeaderLink>
          <HeaderLink to="/location">
            <HeaderItem>
              <img src={LocationIcon} alt="Location" />
              <span>United States</span>
            </HeaderItem>
          </HeaderLink>
          <HeaderLink to="/signin">
            <SignInButton>Sign In</SignInButton>
          </HeaderLink>
        </DesktopGroup>
      </TopContainer>

      {/* Mobile TopBar */}
      <MobileBar className="mobile-only">
        <HeaderLink to="/">
          <Logo src={LogoImg} alt="Logo" />
        </HeaderLink>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <HeaderLink to="/signin">
            <SignInButton>Sign In</SignInButton>
          </HeaderLink>
           <FaBars size={24} color="#fff" style={{ cursor: "pointer" }} />
        </div>
      </MobileBar>
    </>
  );
};

export default TopHeader;
