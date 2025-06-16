import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const TopContainer = styled.header`
  height: 4.2rem;
  background-color: ${({ theme }) => theme.colors.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary};
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.WHITE};
  position: fixed;
  width: 100%;
  z-index: 1100;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const MobileBar = styled.header`
  display: none;
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 0 1rem;
  height: 4.2rem;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.WHITE};
  position: fixed;
  width: 100%;
  z-index: 1100;

  @media (max-width: 768px) {
    display: flex;
  }
`;

export const Logo = styled.img`
  height: 40px;
`;

export const HeaderLink = styled(NavLink)`
  text-decoration: none;
  color: inherit;
`;

export const DesktopGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

export const HeaderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;

  img {
    height: 20px;
  }

  span {
    font-size: 14px;
  }
`;

export const SignInButton = styled.button`
  outline: none;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  background-color: ${({ theme }) => theme.colors.WHITE};
  color: ${({ theme }) => theme.colors.primary};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.WHITE};
  }
`;
