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
    display: block;
  }
`;

const PageHint = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #64748b;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  position: relative;
  background: transparent;
  border: none;
  color: #132E58;
  font-size: 1.0625rem;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 7px;

  &:hover { background: #f1f5f9; }
`;

const UserChip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.65rem;
  background: #f8fafc;
  border: 1px solid #e8ecf1;
  border-radius: 8px;
`;

const Avatar = styled.div<{ $image?: string }>`
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: ${({ $image }) =>
    $image ? `url(${$image}) center/cover no-repeat` : 'linear-gradient(135deg, #Fbbf24 0%, #f4b400 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #132E58;
`;

const UserName = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #132E58;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

interface UserHeaderProps {
  onMenuClick: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <HeaderWrapper>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <MenuButton onClick={onMenuClick}><FiMenu /></MenuButton>
        <PageHint>Member Panel</PageHint>
      </div>

      <RightSection>
        <IconButton type="button" aria-label="Notifications">
          <FiBell />
        </IconButton>
        <UserChip>
          <Avatar $image={user?.profileImage}>
            {!user?.profileImage && (user ? `${user.firstName[0]}${user.lastName[0]}` : 'U')}
          </Avatar>
          <UserName>{user ? `${user.firstName} ${user.lastName}` : 'User'}</UserName>
        </UserChip>
      </RightSection>
    </HeaderWrapper>
  );
};

export default UserHeader;
