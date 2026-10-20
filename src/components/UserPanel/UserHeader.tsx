import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiLogOut, FiMenu, FiShield } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { isImpersonating, restoreAdminSession } from '../../services/authService';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import NotificationBell from './NotificationBell';

const TITLE_BY_PATH: Array<{ match: RegExp; title: string; sub: string }> = [
  { match: /^\/user-panel\/?$/, title: 'Dashboard', sub: 'Your trading overview' },
  { match: /^\/user-panel\/alerts/, title: 'Alerts', sub: 'Notifications & updates' },
  { match: /^\/user-panel\/profile/, title: 'Profile', sub: 'Account details' },
  { match: /^\/user-panel\/verification/, title: 'Verification', sub: 'KYC status' },
  { match: /^\/user-panel\/rewards/, title: 'Rewards', sub: 'LP points & streak' },
  { match: /^\/user-panel\/signals/, title: 'Signals', sub: 'Live trading ideas' },
  { match: /^\/user-panel\/rebates/, title: 'Rebates', sub: 'Cashback wallet' },
  { match: /^\/user-panel\/live-accounts/, title: 'Live accounts', sub: 'Link your broker' },
  { match: /^\/user-panel\/strategies/, title: 'Strategies', sub: 'Saved setups' },
  { match: /^\/user-panel\/tickets/, title: 'Tickets', sub: 'Support requests' },
  { match: /^\/user-panel\/settings/, title: 'Settings', sub: 'Preferences' },
  { match: /^\/user-panel\/invite/, title: 'Invite friends', sub: 'Referral rewards' },
  { match: /^\/user-panel\/calendar/, title: 'Calendar', sub: 'Market events' },
  { match: /^\/user-panel\/contests/, title: 'Contests', sub: 'Competitions' },
  { match: /^\/user-panel\/activity/, title: 'Activity', sub: 'Recent actions' },
];

const HeaderWrapper = styled.header`
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px) saturate(1.15);
  border-bottom: 1px solid rgba(19, 46, 88, 0.08);
  padding: 0.7rem 1.35rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
`;

const MenuButton = styled.button`
  display: none;
  background: #fff;
  border: 1px solid #e2e8f0;
  font-size: 1.15rem;
  color: #132e58;
  cursor: pointer;
  padding: 0.45rem;
  border-radius: 12px;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: #fffbeb;
    border-color: rgba(251, 193, 19, 0.5);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const PageHint = styled.div`
  min-width: 0;

  .title {
    display: block;
    font-size: 0.95rem;
    font-weight: 800;
    color: #132e58;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .sub {
    display: block;
    margin-top: 0.12rem;
    font-size: 0.7rem;
    font-weight: 600;
    color: #94a3b8;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    .sub {
      display: none;
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const UserChip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.65rem 0.3rem 0.3rem;
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 999px;
`;

const Avatar = styled.div<{ $image?: string }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${({ $image }) =>
    $image ? `url(${$image}) center/cover no-repeat` : 'linear-gradient(135deg, #fbc113 0%, #f59e0b 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 800;
  color: #132e58;
`;

const UserName = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  color: #132e58;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const LogoutBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.75rem;
  border-radius: 11px;
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
    span {
      display: none;
    }
  }
`;

const ImpersonationBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  flex-wrap: wrap;
  padding: 0.4rem 0.7rem;
  margin-right: 0.25rem;
  border-radius: 10px;
  background: #fff7ed;
  border: 1px solid #fdba74;
  color: #9a3412;
  font-size: 0.72rem;
  font-weight: 600;
`;

const ReturnAdminBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.55rem;
  border-radius: 8px;
  border: none;
  background: #132e58;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
`;

interface UserHeaderProps {
  onMenuClick: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout: authLogout } = useAuth();
  const { t } = useLocale();
  const viewingAsUser = useMemo(() => isImpersonating(), []);

  const pageMeta = useMemo(() => {
    const hit = TITLE_BY_PATH.find((row) => row.match.test(location.pathname));
    return hit || { title: t('panel.member'), sub: t('panel.workspace') };
  }, [location.pathname, t]);

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
      <Left>
        <MenuButton onClick={onMenuClick} type="button" aria-label={t('panel.openMenu')}>
          <FiMenu />
        </MenuButton>
        <PageHint>
          <span className="title">{pageMeta.title}</span>
          <span className="sub">{pageMeta.sub}</span>
        </PageHint>
      </Left>

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
          <UserName>{user ? `${user.firstName} ${user.lastName}` : t('panel.userFallback')}</UserName>
        </UserChip>
        <LogoutBtn
          type="button"
          onClick={handleLogout}
          aria-label={viewingAsUser ? 'Return to admin' : t('panel.logout')}
        >
          {viewingAsUser ? <FiShield size={15} /> : <FiLogOut size={15} />}
          <span>{viewingAsUser ? 'Return to admin' : t('panel.logout')}</span>
        </LogoutBtn>
      </RightSection>
    </HeaderWrapper>
  );
};

export default UserHeader;
