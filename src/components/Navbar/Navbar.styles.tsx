import styled from "styled-components";
import { NavLink } from "react-router-dom";


const activeColor = "#fbc113";

// Header: topbar + desktop nav must stay in normal flow so <main> is not covered.
export const HeaderWrapper = styled.header`
  width: 100%;
  position: relative;
  z-index: 100;
  background-color: ${({ theme }) => theme.colors.primary};
  transition: all 0.3s ease;
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
  position: relative;
 

  @media (max-width: 1100px) {
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

/** Solid pill — desktop topbar when signed in */
export const UserPanelButton = styled(NavLink)`
  background-color: ${({ theme }) => theme.colors.WHITE};
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary};
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 14px;

  &:hover {
    background-color: ${activeColor};
    color: #0f172a;
  }

  svg {
    flex-shrink: 0;
  }
`;

/** Outline style — mobile bar on dark header when signed in */
export const PortalOutlineButton = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.92);
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: ${activeColor};
    border-color: ${activeColor};
  }

  svg {
    flex-shrink: 0;
  }
`;

export const Navbar = styled.nav`
  padding: 0.85rem 0 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary};
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: 1100px) {
    display: none;
  }
`;

export const NavList = styled.ul`
  display: flex;
  list-style: none;
  gap: 2rem;
  position: relative;
`;

export const NavItem = styled(NavLink)`
  color: white;
  font-size: 14px;
  text-decoration: none;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
  white-space: nowrap;

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
export const SubmenuWrapper = styled.div`
  position: relative;

  @media (min-width: 1101px) {
    &:hover > ul {
      display: block;
    }
  }

  @media (max-width: 1100px) {
    width: 100%;
  }
`;


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

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 998;
  cursor: pointer;

  @media (max-width: 1100px) {
    display: none !important;
  }
`;
