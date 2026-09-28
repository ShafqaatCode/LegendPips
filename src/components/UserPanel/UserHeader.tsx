import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiMenu, FiShield } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { isImpersonating, restoreAdminSession } from '../../services/authService';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import NotificationBell from './NotificationBell';

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

const LogoutBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.75rem;
  border-radius: 10px;
  border: 1px solid #fecaca;
  background: #fff;
  color: #b91c1c;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: #fef2f2;
    border-color: #f87171;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0.45rem;
    span { display: none; }
  }
`;

const ImpersonationBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
  padding: 0.45rem 0.75rem;
  margin-right: 0.35rem;
  border-radius: 10px;
  background: #fff7ed;
  border: 1px solid #fdba74;
  color: #9a3412;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ReturnAdminBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  border: 1px solid #132E58;
  background: #132E58;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #1a3d6e;
  }
`;

interface UserHeaderProps {
  onMenuClick: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();
  const { t } = useLocale();
  const viewingAsUser = useMemo(() => isImpersonating(), []);

  const handleReturnToAdmin = () => {
    if (!restoreAdminSession()) return;
    window.location.href = '/admin-panel';
  };

  const handleLogout = () => {
    if (viewingAsUser) {
      handleReturnToAdmin();
      return;
    }
    authLogout();
    navigate('/');
    window.location.reload();
  };

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
        {viewingAsUser && (
          <ImpersonationBar>
            Viewing as {user ? `${user.firstName} ${user.lastName}` : 'user'}
            <ReturnAdminBtn type="button" onClick={handleReturnToAdmin}>
              <FiShield size={13} />
              Return to admin
            </ReturnAdminBtn>
          </ImpersonationBar>
        )}
        <LanguageSwitcher compact light />
        <NotificationBell />
        <UserChip>
          <Avatar $image={user?.profileImage}>
            {!user?.profileImage && (user ? `${user.firstName[0]}${user.lastName[0]}` : 'U')}
          </Avatar>
          <UserName>{user ? `${user.firstName} ${user.lastName}` : t("panel.userFallback")}</UserName>
        </UserChip>
        <LogoutBtn type="button" onClick={handleLogout} aria-label={viewingAsUser ? 'Return to admin' : t("panel.logout")}>
          {viewingAsUser ? <FiShield size={15} /> : <FiLogOut size={15} />}
          <span>{viewingAsUser ? 'Return to admin' : t("panel.logout")}</span>
        </LogoutBtn>
      </RightSection>
    </HeaderWrapper>
  );
};

export default UserHeader;
