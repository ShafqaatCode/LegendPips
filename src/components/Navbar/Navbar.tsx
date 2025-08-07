// Header.tsx
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
  SubmenuWrapper,
  SubmenuToggle,
  Submenu,
  SubmenuItem,
} from "./Navbar.styles";
import { NavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import LogoImg from "../../assets/icons/image 2.svg";
import SupportIcon from "../../assets/icons/SupportIcon.svg";
import CalculatorIcon from "../../assets/icons/calculator-svgrepo-com (1) 1.svg";
import LocationIcon from "../../assets/icons/Location marker.svg";

import LoginModal from "../../pages/Login/LoginModal";
import RegisterModal from "../../pages/Register/RegisterModal";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/how-it-works", label: "How It Works?" },
  { to: "/rebates", label: "Rebates Brokers" },
  { to: "/contests", label: "Contests" },
  { to: "/brokers", label: "Brokers" },
  { to: "/signals", label: "Signals" },
  { to: "/analysis", label: "Analysis" },
  { to: "/forum", label: "Forum" },
];

const toolsSubmenu = [
  { to: "/calculator", label: "Calculator" },
  { to: "/timer", label: "Timer" },
];

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false); // for desktop
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false); // for mobile
  const [signupOpen, setSignupOpen] = useState(false);
  const [signinOpen, setSigninOpen] = useState(false);

  return (
    <>
      <HeaderWrapper>
        {menuOpen && (
          <Backdrop
            onClick={() => {
              setMenuOpen(false);
              setMobileSubmenuOpen(false);
            }}
          />
        )}

        {/* Topbar */}
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
            <SignInButton onClick={() => setSigninOpen(true)}>Sign In</SignInButton>
          </LinkGroup>
        </Topbar>

        {/* Desktop Navbar */}
        <Navbar>
          <NavList>
            {navLinks.map((link) => (
              <NavItem
                to={link.to}
                key={link.to}
                end={link.end || false}
              >
                {link.label}
              </NavItem>
            ))}

            <SubmenuWrapper
              onMouseEnter={() => setSubmenuOpen(true)}
              onMouseLeave={() => setSubmenuOpen(false)}
            >
              <SubmenuToggle>
                Tools {submenuOpen ? <FiChevronUp /> : <FiChevronDown />}
              </SubmenuToggle>

              {submenuOpen && (
                <Submenu>
                  {toolsSubmenu.map((tool) => (
                    <SubmenuItem to={tool.to} key={tool.to}>
                      {tool.label}
                    </SubmenuItem>
                  ))}
                </Submenu>
              )}
            </SubmenuWrapper>
          </NavList>
        </Navbar>

        {/* Mobile Bar */}
        <MobileBar>
          <NavLink to="/">
            <Logo src={LogoImg} alt="LegendPips Logo" />
          </NavLink>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <SignInButton onClick={() => setSigninOpen(true)}>Sign In</SignInButton>
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

            {/* Mobile Tools Submenu */}
            <div>
              <SubmenuToggle onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}>
                Tools {mobileSubmenuOpen ? <FiChevronUp /> : <FiChevronDown />}
              </SubmenuToggle>

              {mobileSubmenuOpen && (
                <div
                  style={{
                    paddingLeft: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.4rem",
                    marginTop: "0.75rem",
                  }}
                >
                  {toolsSubmenu.map((tool) => (
                    <NavItem
                      to={tool.to}
                      key={tool.to}
                      onClick={() => {
                        setMenuOpen(false);
                        setMobileSubmenuOpen(false);
                      }}
                    >
                      {tool.label}
                    </NavItem>
                  ))}
                </div>
              )}
            </div>
          </MobileMenu>
        )}
      </HeaderWrapper>

      {/* Auth Modals */}
      <RegisterModal
        isOpen={signupOpen}
        onClose={() => setSignupOpen(false)}
      />
      <LoginModal
        isOpen={signinOpen}
        onClose={() => setSigninOpen(false)}
        onSwitchToRegister={() => {
          setSigninOpen(false);
          setSignupOpen(true);
        }}
      />
    </>
  );
};

export default Header;
