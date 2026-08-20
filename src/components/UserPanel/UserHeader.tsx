import React from 'react';
import styled from 'styled-components';
import { FiMenu, FiBell } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

const HeaderWrapper = styled.header`
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(14px) saturate(1.2);
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: linear-gradient(90deg, #Fbbf24 0%, rgba(251, 191, 36, 0.15) 35%, transparent 70%);
  }
`;

const MenuButton = styled.button`
  display: none;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-size: 1.15rem;
  color: #132E58;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 10px;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: #fffbeb;
    border-color: rgba(251, 191, 36, 0.45);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const PageHint = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;

  .title {
    font-size: 0.875rem;
    font-weight: 800;
    color: #132E58;
    letter-spacing: -0.02em;
  }

  .sub {
    font-size: 0.7rem;
    font-weight: 600;
    color: #94a3b8;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    .sub { display: none; }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
`;

const IconButton = styled.button`
  position: relative;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #132E58;
  font-size: 1.05rem;
  cursor: pointer;
  padding: 0.45rem;
  border-radius: 10px;
  transition: all 0.15s;

  &:hover {
    background: #fffbeb;
    border-color: rgba(251, 191, 36, 0.45);
  }

  &::after {
    content: '';
    position: absolute;
    top: 7px;
    right: 7px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #Fbbf24;
    box-shadow: 0 0 0 2px white;
  }
`;

const UserChip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.35rem 0.7rem 0.35rem 0.4rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
`;

const Avatar = styled.div<{ $image?: string }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${({ $image }) =>
    $image ? `url(${$image}) center/cover no-repeat` : 'linear-gradient(135deg, #Fbbf24 0%, #f4b400 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 800;
  color: #132E58;
  box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.35);
`;

const UserName = styled.span`
  font-size: 0.8125rem;
  font-weight: 700;
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
  const { t } = useLocale();

  return (
    <HeaderWrapper>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <MenuButton onClick={onMenuClick} type="button" aria-label={t("panel.openMenu")}><FiMenu /></MenuButton>
        <PageHint>
          <span className="title">{t("panel.member")}</span>
          <span className="sub">{t("panel.workspace")}</span>
        </PageHint>
      </div>

      <RightSection>
        <LanguageSwitcher compact light />
        <IconButton type="button" aria-label={t("panel.notifications")}>
          <FiBell />
        </IconButton>
        <UserChip>
          <Avatar $image={user?.profileImage}>
            {!user?.profileImage && (user ? `${user.firstName[0]}${user.lastName[0]}` : 'U')}
          </Avatar>
          <UserName>{user ? `${user.firstName} ${user.lastName}` : t("panel.userFallback")}</UserName>
        </UserChip>
      </RightSection>
    </HeaderWrapper>
  );
};

export default UserHeader;
