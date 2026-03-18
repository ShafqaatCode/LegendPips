import React from 'react';
import styled from 'styled-components';
import { FiMenu, FiBell, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const HeaderWrapper = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #132E58;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.625rem 1rem;
  gap: 0.5rem;
  min-width: 300px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
  
  input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.9375rem;
    color: #132E58;
    width: 100%;
    
    &::placeholder {
      color: #9ca3af;
    }
  }
  
  svg {
    color: #9ca3af;
    font-size: 1.125rem;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled.button`
  position: relative;
  background: transparent;
  border: none;
  color: #132E58;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background: #Fbbf24;
  color: #132E58;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.125rem 0.375rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: #f9fafb;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0.5rem;
  }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #Fbbf24 0%, #f4b400 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: #132E58;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const UserName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #132E58;
`;

const UserRole = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <HeaderWrapper>
      <LeftSection>
        <MenuButton onClick={onMenuClick}>
          <FiMenu />
        </MenuButton>
        <SearchBar>
          <FiSearch />
          <input type="text" placeholder="Search..." />
        </SearchBar>
      </LeftSection>

      <RightSection>
        <IconButton>
          <FiBell />
          <Badge>5</Badge>
        </IconButton>
        <UserInfo>
          <Avatar>
            {user ? `${user.firstName[0]}${user.lastName[0]}` : 'A'}
          </Avatar>
          <UserDetails>
            <UserName>
              {user ? `${user.firstName} ${user.lastName}` : 'Admin'}
            </UserName>
            <UserRole>Administrator</UserRole>
          </UserDetails>
        </UserInfo>
      </RightSection>
    </HeaderWrapper>
  );
};

export default AdminHeader;
