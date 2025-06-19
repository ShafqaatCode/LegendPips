import styled from "styled-components";
import { NavLink } from "react-router-dom";

const activeColor = "#fbc113";

// Header Container
export const HeaderWrapper = styled.header`
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 999;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
`;

// Dark background overlay (used when mobile menu is open)
export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 998;
  cursor: pointer;

  @media (max-width: 1100px) {
    display: none;
  }
`;

// Top Bar
export const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.primary};
  padding: 0 3rem;
  height: 4.2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary};

  @media (max-width: 1100px) {
    display: none;
  }
`;

// Logo
export const Logo = styled.img`
  min-width: 150px;
  height: 56px;
`;

// Link Section in Topbar
export const LinkGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

// Each Topbar Item
export const HeaderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: white;

  img {
    height: 20px;
    width: 20px;
  }

  span {
    font-size: 14px;
  }
`;

// Sign In Button
export const SignInButton = styled.button`
  background-color: ${({ theme }) => theme.colors.WHITE};
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;

  &:hover {
    background-color: ${activeColor};
    color: black;
  }
`;

// Desktop Navbar
export const Navbar = styled.nav`
  padding: 1.3rem 0;
  display: flex;
  justify-content: center;

  @media (max-width: 1100px) {
    display: none;
  }
`;

// Nav List Container
export const NavList = styled.ul`
  display: flex;
  list-style: none;
  gap: 2rem;
  position: relative;
`;

// Individual Nav Item
export const NavItem = styled(NavLink)`
  color: white;
  font-size: 14px;
  text-decoration: none;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;

  &.active {
    color: ${activeColor};
    border-bottom: 2px solid ${activeColor};
    font-weight: 700;
  }

  &:hover {
    color: ${activeColor};
    border-bottom: 2px solid ${activeColor};
  }
`;

// Submenu Wrapper (for hover or toggle logic)
export const SubmenuWrapper = styled.div`
  position: relative;

  &:hover > ul {
    display: block;
  }

  @media (max-width: 1100px) {
    width: 100%;
  }
`;

// Submenu Toggle (e.g., Tools ▼)
export const SubmenuToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
  color: white;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    color: ${activeColor};
  }

  @media (min-width: 1101px) {
    border-bottom: 2px solid transparent;
  }
`;

// Dropdown Menu
export const Submenu = styled.ul`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #132e58;
  padding: 1rem;
  border-radius: 6px;
  list-style: none;
  min-width: 220px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 1100px) {
    display: flex;
    flex-direction: column;
    position: relative;
    background-color: transparent;
    box-shadow: none;
    padding: 0;
    margin-top: 0.5rem;
  }
`;

// Dropdown Item
export const SubmenuItem = styled(NavLink)`
  color: white;
  font-size: 14px;
  text-decoration: none;
  padding: 8px 0;
  display: block;

  &:hover {
    color: ${activeColor};
  }

  &.active {
    font-weight: 600;
    color: ${activeColor};
  }
`;

// Mobile Topbar (hamburger)
export const MobileBar = styled.div`
  display: none;

  @media (max-width: 1100px) {
    background-color: ${({ theme }) => theme.colors.primary};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1.2rem;
  }
`;

// Mobile Menu Dropdown
export const MobileMenu = styled.div`
  @media (min-width: 1101px) {
    display: none;
  }

  background-color: ${({ theme }) => theme.colors.primary};
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// Sticky Navbar after scroll
export const StickyBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #132d58;
  padding: 0.3rem 3rem;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999;
  transition: all 0.3s ease;

  @media (max-width: 1100px) {
    display: none;
  }

  ${NavList} {
    gap: 1.5rem;
  }
`;

