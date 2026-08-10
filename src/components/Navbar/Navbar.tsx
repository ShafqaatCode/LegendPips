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
  UserPanelButton,
  PortalOutlineButton,
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
import { FiChevronDown, FiChevronUp, FiShield, FiUser } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useSiteConfig } from "../../contexts/SiteConfigContext";
import LogoImg from "../../assets/icons/image 2.svg";
import SupportIcon from "../../assets/icons/SupportIcon.svg";
import CalculatorIcon from "../../assets/icons/calculator-svgrepo-com (1) 1.svg";
import LocationIcon from "../../assets/icons/Location marker.svg";

import LoginModal from "../../pages/Login/LoginModal";
import RegisterModal from "../../pages/Register/RegisterModal";

const FALLBACK_NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/how-it-works", label: "How It Works?" },
  { to: "/rebates", label: "Rebates Brokers" },
  { to: "/contests", label: "Contests" },
  { to: "/brokers", label: "Brokers" },
  { to: "/signals", label: "Signals" },
  { to: "/rewards", label: "Rewards" },
  { to: "/analysis", label: "Analysis" },
  { to: "/forum", label: "Forum" },
  { to: "/courses", label: "Courses" },
  { to: "/trading-videos", label: "Trading Videos" },
  { to: "/webinars", label: "Webinars" },
];

const FALLBACK_TOOLS = [
  { to: "/calculators", label: "All Calculators" },
  { to: "/pip-calculator", label: "Pip Calculator" },
  { to: "/position-size-calculator", label: "Position Size Calculator" },
  { to: "/margin-calculator", label: "Margin Calculator" },
  { to: "/rebate-calculator", label: "Rebate Calculator" },
  { to: "/pivot-point-calculator", label: "Pivot Point Calculator" },
  { to: "/fibonacci-calculator", label: "Fibonacci Calculator" },
];

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [signinOpen, setSigninOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { mainNav, toolsNav, config } = useSiteConfig();

  const navLinks = mainNav.length
    ? mainNav.map((n) => ({ to: n.path, label: n.label, end: n.end }))
    : FALLBACK_NAV;
  const toolsSubmenu = toolsNav.length
    ? toolsNav.map((n) => ({ to: n.path, label: n.label }))
    : FALLBACK_TOOLS;
  const logoSrc = config?.siteLogoUrl || LogoImg;

  const portalPath = user?.role === "admin" ? "/admin-panel" : "/user-panel";
  const isAdmin = user?.role === "admin";

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
            <Logo src={logoSrc} alt={`${config?.siteName || "LegendPips"} Logo`} />
          </NavLink>

          <LinkGroup>
            <NavLink to="/live-chat">
              <HeaderItem>
                <img src={SupportIcon} alt="Live Chat" />
                <span>Live Chat</span>
              </HeaderItem>
            </NavLink>
            <NavLink to="/rebate-calculator">
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
            {isAuthenticated ? (
              <UserPanelButton to={portalPath} title={isAdmin ? "Open admin panel" : "Open your account panel"}>
                {isAdmin ? <FiShield size={18} aria-hidden /> : <FiUser size={18} aria-hidden />}
                <span>{isAdmin ? "Admin panel" : `${user?.firstName || "My"} account`}</span>
              </UserPanelButton>
            ) : (
              <SignInButton onClick={() => setSigninOpen(true)}>Sign In</SignInButton>
            )}
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
            <Logo src={logoSrc} alt={`${config?.siteName || "LegendPips"} Logo`} />
          </NavLink>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {isAuthenticated ? (
              <PortalOutlineButton to={portalPath} title={isAdmin ? "Admin panel" : "My account panel"}>
                {isAdmin ? <FiShield size={18} aria-hidden /> : <FiUser size={18} aria-hidden />}
                <span>{isAdmin ? "Admin" : user?.firstName || "Account"}</span>
              </PortalOutlineButton>
            ) : (
              <SignInButton onClick={() => setSigninOpen(true)}>Sign In</SignInButton>
            )}
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
            {isAuthenticated && (
              <NavItem to={portalPath} onClick={() => setMenuOpen(false)}>
                {isAdmin ? "Admin panel" : "My account panel"}
              </NavItem>
            )}
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
