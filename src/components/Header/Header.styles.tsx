import styled from "styled-components";
import { NavLink } from "react-router-dom";

const activeColor = "#fbc113";

// Wrapper
export const HeaderWrapper = styled.header`
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 999;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
`;

// Backdrop
export const Backdrop = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 998;
  cursor: pointer;
`;

// Topbar
export const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.primary};
  padding: 0 3rem;
  height: 4.2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary};
  transition: transform 0.3s ease;

  &.hidden {
    transform: translateY(-100%);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Logo = styled.img`
  min-width: 150px;
  height: 56px;
`;

export const LinkGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

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

// Navbar
export const Navbar = styled.nav`
  background: ${({ theme }) => theme.colors.primary};
  padding: 1.3rem 0;
  display: flex;
  justify-content: center;
  transition: transform 0.3s ease;

  &.shifted {
    transform: translateY(-4.2rem);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavList = styled.ul`
  display: flex;
  list-style: none;
  gap: 2rem;
`;

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

// Mobile Topbar
export const MobileBar = styled.div`
  display: none;

  @media (max-width: 768px) {
    background-color: ${({ theme }) => theme.colors.primary};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1.2rem;
  }
`;

// Mobile Dropdown
export const MobileMenu = styled.div`
  @media (min-width: 769px) {
    display: none;
  }

  background-color: ${({ theme }) => theme.colors.primary};
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
export const StickyBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.primary};
  padding: 0.7rem 3rem;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999;

  @media (max-width: 768px) {
    display: none;
  }

  ${NavList} {
    gap: 1.5rem;
  }
`;
