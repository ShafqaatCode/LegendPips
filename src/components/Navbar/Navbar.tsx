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
} from "../Header/Header.styles";
import { NavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import LogoImg from "../../assets/icons/image 2.svg";
import SupportIcon from "../../assets/icons/SupportIcon.svg";
import CalculatorIcon from "../../assets/icons/calculator-svgrepo-com (1) 1.svg";
import LocationIcon from "../../assets/icons/Location marker.svg";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/how-it-works", label: "How It Works?" },
  { to: "/rebates", label: "Rebates Brokers" },
  { to: "/contests", label: "Contests" },
  { to: "/brokers", label: "Brokers" },
  { to: "/signals", label: "Signals" },
  { to: "/analysis", label: "Analysis" },
  { to: "/forum", label: "Forum" },
  {
    label: "Tools",
    submenu: [
      { to: "/calculator", label: "Calculator" },
      { to: "/timer", label: "Timer" },
    ],
  },
  {
    label: "Resources",
    submenu: [
      { to: "/blogs", label: "Blogs" },
      { to: "/news", label: "News" },
    ],
  },
];

const NavbarComp: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleSubmenu = (label: string) => {
    setSubmenuOpen((prev) => (prev === label ? null : label));
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderLinks = (isMobile = false) => (
    navLinks.map((link) =>
      link.submenu ? (
        <SubmenuWrapper
          key={link.label}
          onMouseEnter={() => !isMobile && setSubmenuOpen(link.label)}
          onMouseLeave={() => !isMobile && setSubmenuOpen(null)}
        >
          <SubmenuToggle onClick={() => toggleSubmenu(link.label)}>
            {link.label} {submenuOpen === link.label ? <FiChevronUp /> : <FiChevronDown />}
          </SubmenuToggle>
          {submenuOpen === link.label && (
            <Submenu>
              {link.submenu.map((sub) => (
                <SubmenuItem to={sub.to} key={sub.to} onClick={() => setMenuOpen(false)}>
                  {sub.label}
                </SubmenuItem>
              ))}
            </Submenu>
          )}
        </SubmenuWrapper>
      ) : (
        <NavItem
          to={link.to!}
          key={link.to}
          end={link.end || false}
          onClick={() => setMenuOpen(false)}
        >
          {link.label}
        </NavItem>
      )
    )
  );

  return (
    <HeaderWrapper>
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

      {!isScrolled && <Navbar><NavList>{renderLinks()}</NavList></Navbar>}

      {isScrolled && (
        <StickyBar>
          <NavLink to="/">
            <Logo src={LogoImg} alt="LegendPips Logo" />
          </NavLink>
          <NavList>{renderLinks()}</NavList>
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

      {menuOpen && <MobileMenu>{renderLinks(true)}</MobileMenu>}
    </HeaderWrapper>
  );
};

export default NavbarComp;
