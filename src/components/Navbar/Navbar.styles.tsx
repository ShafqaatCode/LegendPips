import styled from "styled-components";
import { NavLink } from "react-router-dom";


const activeColor = "#fbc113";

// Header: topbar + desktop nav must stay in normal flow so <main> is not covered.
export const HeaderWrapper = styled.header`
  width: 100%;
  position: relative;
  z-index: 2000;
  background-color: ${({ theme }) => theme.colors.primary};
  transition: all 0.3s ease;
`;

// Top Bar
export const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.primary};
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  height: 3.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;

  @media (max-width: 1100px) {
    display: none;
  }
`;

export const Logo = styled.img`
  min-width: 112px;
  height: 40px;
  object-fit: contain;
`;

export const LinkGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem 0.85rem;
`;

export const TopbarDivider = styled.span`
  width: 1px;
  height: 1.1rem;
  background: rgba(255, 255, 255, 0.18);
  margin: 0 0.15rem;
  flex-shrink: 0;
`;

export const HeaderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: rgba(255, 255, 255, 0.82);
  transition: color 0.2s ease;

  &:hover {
    color: #fff;
  }

  img {
    height: 14px;
    width: 14px;
    opacity: 0.9;
  }

  span {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.01em;
  }
`;

export const SignInButton = styled.button`
  background: rgba(255, 255, 255, 0.08);
  padding: 0.35rem 0.85rem;
  height: 2rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-family: inherit;

  &:hover {
    background: ${activeColor};
    border-color: ${activeColor};
    color: #0f172a;
  }
`;

/** Compact ghost chip — desktop topbar when signed in */
export const UserPanelButton = styled.button`
  background: rgba(255, 255, 255, 0.08);
  padding: 0.3rem 0.7rem;
  height: 2rem;
  border-radius: 6px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.22);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.95);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 12px;
  font-family: inherit;
  line-height: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.14);
    border-color: rgba(255, 255, 255, 0.4);
    color: #fff;
  }

  svg {
    flex-shrink: 0;
    opacity: 0.9;
  }
`;

/** Outline style — mobile bar on dark header when signed in */
export const PortalOutlineButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
  height: 2rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: rgba(255, 255, 255, 0.95);
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
  font-family: inherit;
  line-height: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: ${activeColor};
    border-color: ${activeColor};
  }

  svg {
    flex-shrink: 0;
  }
`;

export const AccountMenuWrap = styled.div`
  position: relative;
  display: inline-flex;
`;

export const AccountDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.16);
  padding: 0.35rem;
  z-index: 1200;
`;

export const AccountDropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  border: none;
  background: transparent;
  padding: 0.65rem 0.75rem;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #132e58;
  cursor: pointer;
  text-align: left;
  font-family: inherit;

  &:hover {
    background: #f8fafc;
  }

  &.danger {
    color: #b91c1c;
  }

  &.danger:hover {
    background: #fef2f2;
  }
`;

export const Navbar = styled.nav`
  position: relative;
  z-index: 2;
  padding: 0.55rem 0 0.65rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary};
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  overflow: visible;

  @media (max-width: 1100px) {
    display: none;
  }
`;

export const NavList = styled.ul`
  display: flex;
  list-style: none;
  gap: 1.35rem;
  position: relative;
  overflow: visible;
  margin: 0;
  padding: 0;
`;

export const NavItem = styled(NavLink)`
  color: white;
  font-size: 13px;
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
  z-index: 5;
  overflow: visible;

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
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;

  &:hover,
  &[data-open="true"] {
    color: ${activeColor};
    border-bottom-color: ${activeColor};
  }
`;

/** Desktop mega-menu — sits fully below the nav row (not under the Tools label). */
export const ToolsMegaMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  inset-inline-end: 0;
  inset-inline-start: auto;
  html[dir="rtl"] & {
    right: auto;
    left: 0;
    inset-inline-end: 0;
    inset-inline-start: auto;
  }
  z-index: 3000;
  width: min(560px, calc(100vw - 2rem));
  max-height: min(70vh, 480px);
  overflow: auto;
  padding: 0.85rem 1.1rem 1.15rem;
  margin-top: 0;
  border-radius: 12px;
  background: linear-gradient(165deg, #0f2448 0%, #132e58 55%, #0c1f3d 100%);
  border: 1px solid rgba(251, 191, 36, 0.22);
  box-shadow:
    0 18px 48px rgba(8, 20, 40, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.04) inset;
  display: grid;
  grid-template-columns: 168px 1fr;
  gap: 1rem 1.15rem;
  text-align: start;

  /* Invisible hover bridge so the menu does not close when moving the pointer down */
  &::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: -12px;
    height: 12px;
    background: transparent;
  }

  @media (max-width: 1100px) {
    display: none;
  }
`;

export const ToolsMegaColumn = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  & + & {
    border-inline-start: 1px solid rgba(255, 255, 255, 0.1);
    padding-inline-start: 1.1rem;
  }
`;

export const ToolsMegaLabel = styled.div`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(251, 191, 36, 0.9);
  margin-bottom: 0.35rem;
  padding-bottom: 0.35rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

export const ToolsMegaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.15rem 0.75rem;
`;

export const ToolsMegaLink = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.8125rem;
  font-weight: 500;
  text-decoration: none;
  padding: 0.45rem 0.55rem;
  border-radius: 8px;
  line-height: 1.35;
  white-space: normal;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: ${activeColor};
  }

  &.active {
    color: ${activeColor};
    background: rgba(251, 191, 36, 0.12);
    font-weight: 650;
  }
`;

export const Submenu = styled.ul`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #132e58;
  padding: 1rem;
  html[dir="rtl"] & {
    left: auto;
    right: 0;
  }
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

/** Compact Brokers dropdown under the Brokers nav label. */
export const BrokersDropMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  z-index: 3000;
  min-width: 240px;
  padding: 0.55rem 0.45rem;
  border-radius: 12px;
  background: linear-gradient(165deg, #0f2448 0%, #132e58 55%, #0c1f3d 100%);
  border: 1px solid rgba(251, 191, 36, 0.22);
  box-shadow:
    0 18px 48px rgba(8, 20, 40, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.04) inset;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  text-align: start;

  html[dir="rtl"] & {
    left: auto;
    right: 0;
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: -12px;
    height: 12px;
    background: transparent;
  }

  @media (max-width: 1100px) {
    display: none;
  }
`;

export const BrokersDropLink = styled(NavLink)`
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8125rem;
  font-weight: 500;
  text-decoration: none;
  padding: 0.55rem 0.7rem;
  border-radius: 8px;
  white-space: nowrap;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: ${activeColor};
  }

  &.active {
    color: ${activeColor};
    background: rgba(251, 191, 36, 0.12);
    font-weight: 650;
  }
`;

export const DropSectionLabel = styled.div`
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(251, 191, 36, 0.92);
  padding: 0.35rem 0.7rem 0.45rem;
  margin-bottom: 0.1rem;
`;

export const MobileToolsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-top: 0.5rem;
  padding-inline-start: 0.35rem;
`;

export const MobileToolsHeading = styled.div`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(251, 191, 36, 0.85);
  margin: 0.55rem 0 0.2rem;
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
