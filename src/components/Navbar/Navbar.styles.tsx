// src/components/layout/Navbar/Navbar.styles.ts
import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const NavbarWrapper = styled.nav`
  width: 100%;
  position: fixed;
  top: 67px;
  left: 0;
  z-index: 1000;
  background-color: transparent;
  display: flex;
  justify-content: center;
  padding: 1rem 2rem;

  @media (max-width: 768px) {
    justify-content: space-between;
    padding: 0.75rem 1.2rem;
    flex-direction: column;
  }
`;

export const MobileWrapper = styled.div`
  width: 100%;
  display: none;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    display: flex;
  }
`;

export const Logo = styled.img`
  height: 50px;
`;

export const SignInButton = styled(NavLink)`
  padding: 6px 14px;
  background-color: ${({ theme }) => theme.colors.WHITE};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  margin-right: 10px;
  text-decoration: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.WHITE};
  }
`;

export const HamburgerButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.WHITE};
  cursor: pointer;
`;

export const NavList = styled.ul`
  display: flex;
  gap: 2rem;
  list-style: none;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavItem = styled(NavLink)`
  font-size: 14px;
  color: #ffffff;
  text-decoration: none;
  font-weight: 400;

  &.active {
    color: #fbc113;
    font-weight: 600;
  }

  &:hover {
    color: #fbc113;
  }
`;

export const MobileMenu = styled.div`
  display: none;
  flex-direction: column;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.9);
  width: 100%;

  @media (max-width: 768px) {
    display: flex;
  }

  ${NavItem} {
    margin-bottom: 1rem;
  }
`;
