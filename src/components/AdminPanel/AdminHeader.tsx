import React from 'react';
import styled from 'styled-components';
import { FiMenu, FiBell } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const HeaderWrapper = styled.header`
  background: white;
  border-bottom: 1px solid #e8ecf1;
  padding: 0.625rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const MenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: #132E58;
  cursor: pointer;
  padding: 0.35rem;
  border-radius: 6px;

  &:hover { background: #f1f5f9; }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const Breadcrumb = styled.div`
  font-size: 0.75rem;
  color: #64748b;

  strong { color: #132E58; font-weight: 600; }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const IconButton = styled.button`
  position: relative;
  background: #f8fafc;
  border: 1px solid #e8ecf1;
  color: #64748b;
  font-size: 0.9375rem;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 7px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover { background: #f1f5f9; color: #132E58; }
`;

const Badge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: #Fbbf24;
  color: #132E58;
  font-size: 0.5625rem;
  font-weight: 800;
  padding: 1px 4px;
  border-radius: 8px;
  min-width: 14px;
  text-align: center;
`;

const UserChip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem 0.25rem 0.25rem;
  background: #f8fafc;
  border: 1px solid #e8ecf1;
  border-radius: 999px;
`;

const Avatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #Fbbf24, #f59e0b);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 800;
  color: #132E58;
`;

const UserName = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #132E58;
  padding-right: 0.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <HeaderWrapper>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <MenuButton onClick={onMenuClick}><FiMenu /></MenuButton>
        <Breadcrumb>LegendPips / <strong>Admin</strong></Breadcrumb>
      </div>

      <RightSection>
        <IconButton type="button" aria-label="Notifications">
          <FiBell />
          <Badge>5</Badge>
        </IconButton>
        <UserChip>
          <Avatar>{user ? `${user.firstName[0]}${user.lastName[0]}` : 'A'}</Avatar>
          <UserName>{user ? `${user.firstName} ${user.lastName}` : 'Admin'}</UserName>
        </UserChip>
      </RightSection>
    </HeaderWrapper>
  );
};

export default AdminHeader;
