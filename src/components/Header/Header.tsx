import React, { useState } from "react";
import {
  HeaderWrapper,
  Topbar,
  Navbar,
  Logo,
  NavList,
  NavItem,
  LinkGroup,
  HeaderItem,
  SignInButton,
  MobileBar,
  MobileMenu,
  Backdrop,
} from "./Header.styles";
import { NavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa";

import LogoImg from "../../assets/icons/Logo.png";
import SupportIcon from "../../assets/icons/SupportIcon.svg";
import CalculatorIcon from "../../assets/icons/calculator-svgrepo-com (1) 1.svg";
import LocationIcon from "../../assets/icons/Location marker.svg";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/how-it-works", label: "How It Works?" },
  { to: "/rebates", label: "Rebates Brokers" },
  { to: "/contests", label: "Contests" },
  { to: "/brokers", label: "Brokers" },
  { to: "/tools", label: "Tools" },
  { to: "/signals", label: "Signals" },
  { to: "/analysis", label: "Analysis" },
  { to: "/forum", label: "Forum" },
];

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <HeaderWrapper>
     
      {menuOpen && <Backdrop onClick={() => setMenuOpen(false)} />}

      
      <Topbar>
        <NavLink to="/">
          <Logo src={LogoImg} alt="LegendPips Logo" />
        </NavLink>

        <LinkGroup>
          <NavLink to="/live-chat">
            <HeaderItem>
              <img src={SupportIcon} alt="Live Chat" />
              <span>Live Chat</span>
            </HeaderItem>
          </NavLink>
          <NavLink to="/calculator">
            <HeaderItem>
              <img src={CalculatorIcon} alt="Calculator" />
              <span>Rebate Calculator</span>
            </HeaderItem>
          </NavLink>
          <NavLink to="/location">
            <HeaderItem>
              <img src={LocationIcon} alt="Location" />
              <span>United States</span>
            </HeaderItem>
          </NavLink>
          <NavLink to="/signin">
            <SignInButton>Sign In</SignInButton>
          </NavLink>
        </LinkGroup>
      </Topbar>

      {/* Navbar (Desktop) */}
      <Navbar>
        <NavList>
          {navLinks.map((link) => (
            <NavItem
              to={link.to}
              key={link.to}
              end={link.end || false}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavItem>
          ))}
        </NavList>
      </Navbar>

      {/* Mobile Topbar */}
      <MobileBar>
        <NavLink to="/">
          <Logo src={LogoImg} alt="LegendPips Logo" />
        </NavLink>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <NavLink to="/signin">
            <SignInButton>Sign In</SignInButton>
          </NavLink>
          <FaBars
            size={22}
            color="white"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ cursor: "pointer" }}
          />
        </div>
      </MobileBar>

      {/* Mobile Menu */}
      {menuOpen && (
        <MobileMenu>
          {navLinks.map((link) => (
            <NavItem
              to={link.to}
              key={link.to}
              end={link.end || false}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavItem>
          ))}
        </MobileMenu>
      )}
    </HeaderWrapper>
  );
};

export default Header;
