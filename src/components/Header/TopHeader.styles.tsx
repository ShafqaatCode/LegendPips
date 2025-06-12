// src/components/layout/TopHeader/TopHeader.styles.ts
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

// export const GradientText = styled.h1`
//   background: ${({ theme }) => theme.colors.Gold};
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
//   display: inline-block;
// `;

export const TopContainer = styled.header`
  height: 4.2rem;
  background-color: ${({ theme }) => theme.colors.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary};
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.WHITE};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Logo = styled.img`
  min-width: 150px;
  height: 56px;
`;

export const HeaderLink = styled(NavLink)`
  text-decoration: none;
  color: inherit;
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
  background-color: ${({ theme }) => theme.colors.WHITE};
//   color: ${({ theme }) => theme.colors.primary};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.WHITE};
  }
`;
