// src/components/layout/Navbar/Navbar.tsx
import React, { useState } from "react";
import {
  NavbarWrapper,
  NavList,
  NavItem,
  MobileWrapper,
  Logo,
  SignInButton,
  HamburgerButton,
  MobileMenu,
} from "../Navbar/Navbar.styles";
// import { NavLink } from "react-router-dom";

import LogoImg from "../../assets/icons/Logo_Svg.svg"
import { FaBars } from "react-icons/fa"; // install react-icons if needed

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <NavbarWrapper>
      <MobileWrapper>
        <Logo src={LogoImg} alt="Logo" />
        <div>
          <SignInButton to="/signin">Sign In</SignInButton>
          <HamburgerButton onClick={() => setOpen(!open)}>
            <FaBars />
          </HamburgerButton>
        </div>
      </MobileWrapper>

      <NavList className={open ? "open" : ""}>
        <NavItem to="/" end>Home</NavItem>
        <NavItem to="/how-it-works">How It Works?</NavItem>
        <NavItem to="/rebates">Rebates Brokers</NavItem>
        <NavItem to="/contests">Contests</NavItem>
        <NavItem to="/brokers">Brokers</NavItem>
        <NavItem to="/tools">Tools</NavItem>
        <NavItem to="/signals">Signals</NavItem>
        <NavItem to="/analysis">Analysis</NavItem>
        <NavItem to="/forum">Forum</NavItem>
      </NavList>

      {/* Optional mobile dropdown menu */}
      {open && (
        <MobileMenu>
          <NavItem to="/" onClick={() => setOpen(false)}>Home</NavItem>
          <NavItem to="/how-it-works" onClick={() => setOpen(false)}>How It Works?</NavItem>
          <NavItem to="/rebates" onClick={() => setOpen(false)}>Rebates Brokers</NavItem>
          <NavItem to="/contests" onClick={() => setOpen(false)}>Contests</NavItem>
          <NavItem to="/brokers" onClick={() => setOpen(false)}>Brokers</NavItem>
          <NavItem to="/tools" onClick={() => setOpen(false)}>Tools</NavItem>
          <NavItem to="/signals" onClick={() => setOpen(false)}>Signals</NavItem>
          <NavItem to="/analysis" onClick={() => setOpen(false)}>Analysis</NavItem>
          <NavItem to="/forum" onClick={() => setOpen(false)}>Forum</NavItem>
        </MobileMenu>
      )}
    </NavbarWrapper>
  );
};

export default Navbar;
