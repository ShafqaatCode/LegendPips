// Header.tsx
import React, { useEffect, useState } from "react";
import {
  HeaderWrapper,
  Topbar,
  StickyBar,
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
} from "./Header.styles";
import { NavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import LogoImg from "../../assets/icons/image 2.svg";
import SupportIcon from "../../assets/icons/SupportIcon.svg";
import CalculatorIcon from "../../assets/icons/calculator-svgrepo-com (1) 1.svg";
import LocationIcon from "../../assets/icons/Location marker.svg";
import SignupModal from "../../pages/Register/SignupModal";

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
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [signupOpen, setSignupOpen] = useState(true);


  const toggleSubmenu = () => {
    setSubmenuOpen(!submenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <><HeaderWrapper>
      {menuOpen && <Backdrop onClick={() => setMenuOpen(false)} />}

      {!isScrolled && (
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
      )}

      {!isScrolled && (
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

            <SubmenuWrapper
              onMouseEnter={() => window.innerWidth > 768 && setSubmenuOpen(true)}
              onMouseLeave={() => window.innerWidth > 768 && setSubmenuOpen(false)}
            >
              <SubmenuToggle onClick={toggleSubmenu}>
                Tools {submenuOpen ? <FiChevronUp /> : <FiChevronDown />}
              </SubmenuToggle>
              {submenuOpen && (
                <Submenu>
                  {toolsSubmenu.map((tool) => (
                    <SubmenuItem to={tool.to} key={tool.to}>{tool.label}</SubmenuItem>
                  ))}
                </Submenu>
              )}
            </SubmenuWrapper>
          </NavList>
        </Navbar>
      )}

      {isScrolled && (
        <StickyBar>
          <NavLink to="/">
            <Logo src={LogoImg} alt="LegendPips Logo" />
          </NavLink>
          <NavList>
            {navLinks.map((link) => (
              <NavItem to={link.to} key={link.to} end={link.end || false}>
                {link.label}
              </NavItem>
            ))}
            <SubmenuWrapper
              onMouseEnter={() => window.innerWidth > 768 && setSubmenuOpen(true)}
              onMouseLeave={() => window.innerWidth > 768 && setSubmenuOpen(false)}
            >
              <SubmenuToggle onClick={() => {
                if (window.innerWidth <= 768) {
                  setSubmenuOpen(!submenuOpen);
                }
              }}>
                Tools {submenuOpen ? <FiChevronUp /> : <FiChevronDown />}
              </SubmenuToggle>
              {submenuOpen && (
                <Submenu>
                  {toolsSubmenu.map((tool) => (
                    <SubmenuItem to={tool.to} key={tool.to}>{tool.label}</SubmenuItem>
                  ))}
                </Submenu>
              )}
            </SubmenuWrapper>
          </NavList>
          <NavLink to="/signin">
            <SignInButton>Sign In</SignInButton>
          </NavLink>
        </StickyBar>
      )}

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

      {menuOpen && (
        <MobileMenu>
          {[...navLinks, { label: "Tools" }].map((link) =>
            link.label === "Tools" ? (
              <div key="Tools">
                <SubmenuToggle
                  onClick={() => setSubmenuOpen(!submenuOpen)}
                >
                  Tools {submenuOpen ? <FiChevronUp /> : <FiChevronDown />}
                </SubmenuToggle>

                {submenuOpen && (
                  <div style={{ paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "0.75rem" }}>
                    {toolsSubmenu.map((tool) => (
                      <NavItem
                        to={tool.to}
                        key={tool.to}
                        onClick={() => setMenuOpen(false)}
                      >
                        {tool.label}
                      </NavItem>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              "to" in link ? (
                <NavItem
                  to={link.to}
                  key={link.to}
                  end={link.end || false}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavItem>
              ) : null
            )
          )}
        </MobileMenu>
      )}


    </HeaderWrapper>
      <SignupModal isOpen={signupOpen} onClose={() => setSignupOpen(false)} /></>

  );
};

export default Header;
