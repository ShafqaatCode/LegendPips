import React from "react";
import styled from "styled-components";
import LogoImg from "../../assets/icons/Logo.png";
import { NavLink } from "react-router-dom";
import SupportIcon from "../../assets/icons/SupportIcon.svg";
import CalculatorIcon from "../../assets/icons/calculator-svgrepo-com (1) 1.svg";
import LocationIcon from "../../assets/icons/Location marker.svg";

const TopContainer = styled.section`
  height: 4.2rem;
  background-color: ${({ theme }) => theme.colors.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary};
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
`;

const HeaderLink = styled(NavLink)``;

const Logo = styled.img`
  min-width: 150px;
  height: 56px;
//   border: 2px solid red;
`;

const LinkGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.WHITE};
//   border: 2px solid red;
`;

const HeaderItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;

  span {
    // border: 2px solid red;
    font-size:13px;
  }
`;

const SignInButton = styled.button`
    outline:none;
    border:none;
    padding: 8px 20px;
    border-radius:6px;
    background-color: ${({theme}) => theme.colors.WHITE}
`

const TopHeader: React.FC = () => {
  return (
    <TopContainer>
      <HeaderLink to="/">
        <Logo src={LogoImg} alt="LegendPips" />
      </HeaderLink>
      <LinkGroup>
        <HeaderLink to="/about">
          <HeaderItem>
            <img src={SupportIcon} alt="Icon" />
            <span>Live Chat</span>
          </HeaderItem>
        </HeaderLink>
        <HeaderLink to="/about">
          <HeaderItem>
            <img src={CalculatorIcon} alt="Icon" />
            <span>Rebate Calculator</span>
          </HeaderItem>
        </HeaderLink>
        <HeaderLink to="/about">
          <HeaderItem>
            <img src={LocationIcon} alt="Icon" />
            <span>United States</span>
          </HeaderItem>
        </HeaderLink>
        <HeaderLink to="/">
            <HeaderItem>
                <SignInButton>Sign In</SignInButton>
            </HeaderItem>
        </HeaderLink>
      </LinkGroup>
    </TopContainer>
  );
};

export default TopHeader;
