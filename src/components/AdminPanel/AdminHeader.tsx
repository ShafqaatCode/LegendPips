import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { FiMenu, FiBell, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { adminColors } from './adminUi';
import { isFullAdmin } from '../../utils/adminPermissions';
import { useLocale } from '../../contexts/LocaleContext';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

const HeaderWrapper = styled.header`
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(232, 236, 241, 0.9);
  padding: 0.7rem 1.35rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8) inset;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0;
`;

const MenuButton = styled.button`
  display: none;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  font-size: 1.15rem;
  color: ${adminColors.navy};
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 9px;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;

  &:hover { background: #e2e8f0; }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const TitleBlock = styled.div`
  min-width: 0;

  .crumb {
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${adminColors.muted};
  }
  h1 {
    margin: 0.1rem 0 0;
    font-size: 1rem;
    font-weight: 800;
    color: ${adminColors.navy};
    letter-spacing: -0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  flex-shrink: 0;
`;

const SearchPill = styled.div`
  display: none;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  background: #f8fafc;
  border: 1px solid #e8ecf1;
  border-radius: 999px;
  color: ${adminColors.muted};
  font-size: 0.75rem;
  min-width: 160px;

  @media (min-width: 900px) {
    display: flex;
  }

  kbd {
    margin-left: auto;
    font-size: 0.6rem;
    font-weight: 700;
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
    background: white;
    border: 1px solid #e2e8f0;
    color: ${adminColors.muted};
  }
`;

const IconButton = styled.button`
  position: relative;
  background: white;
  border: 1px solid #e8ecf1;
  color: ${adminColors.muted};
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  border-radius: 10px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);

  &:hover {
    background: #f8fafc;
    color: ${adminColors.navy};
    border-color: #cbd5e1;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -3px;
  right: -3px;
  background: linear-gradient(135deg, ${adminColors.gold}, #f59e0b);
  color: ${adminColors.navy};
  font-size: 0.55rem;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: 999px;
  min-width: 14px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(251, 191, 36, 0.4);
`;

const UserChip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.28rem 0.65rem 0.28rem 0.28rem;
  background: white;
  border: 1px solid #e8ecf1;
  border-radius: 999px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${adminColors.gold}, #f59e0b);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 800;
  color: ${adminColors.navy};
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.35);
`;

const UserMeta = styled.div`
  line-height: 1.15;
  padding-right: 0.2rem;

  .name {
    font-size: 0.75rem;
    font-weight: 700;
    color: ${adminColors.navy};
  }
  .role {
    font-size: 0.6rem;
    font-weight: 600;
    color: ${adminColors.muted};
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const PAGE_TITLE_KEYS: Record<string, string> = {
  '/admin-panel': 'panel.dashboard',
  '/admin-panel/users': 'panel.users',
  '/admin-panel/users/bulk-email': 'panel.bulkEmail',
  '/admin-panel/kyc-records': 'panel.kycRecords',
  '/admin-panel/brokers': 'panel.brokers',
  '/admin-panel/broker-reviews': 'panel.brokerReviews',
  '/admin-panel/complaints': 'nav.complaints',
  '/admin-panel/contests': 'nav.contests',
  '/admin-panel/signals': 'nav.signals',
  '/admin-panel/webinars': 'nav.webinars',
  '/admin-panel/analysis': 'nav.analysis',
  '/admin-panel/courses': 'nav.courses',
  '/admin-panel/feedback-inbox': 'panel.feedback',
  '/admin-panel/user-activity': 'panel.activity',
  '/admin-panel/rebate-credits': 'nav.rebates',
  '/admin-panel/reports': 'panel.reports',
  '/admin-panel/settings': 'panel.settings',
  '/admin-panel/team': 'panel.adminTeam',
};

function resolveTitleKey(pathname: string): string {
  if (PAGE_TITLE_KEYS[pathname]) return PAGE_TITLE_KEYS[pathname];
  if (pathname.startsWith('/admin-panel/users/')) return 'panel.userDetail';
  if (pathname.startsWith('/admin-panel/kyc-records/')) return 'panel.kycReview';
  return 'panel.admin';
}

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { t, locale } = useLocale();
  const { pathname } = useLocation();
  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    const t = window.setInterval(() => setClock(new Date()), 60000);
    return () => window.clearInterval(t);
  }, []);

  const title = t(resolveTitleKey(pathname));
  const timeLabel = clock.toLocaleString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <HeaderWrapper>
      <Left>
        <MenuButton type="button" onClick={onMenuClick} aria-label={t("panel.openMenu")}><FiMenu /></MenuButton>
        <TitleBlock>
          <div className="crumb">{t("panel.consoleCrumb")}</div>
          <h1>{title}</h1>
        </TitleBlock>
      </Left>

      <RightSection>
        <LanguageSwitcher compact light />
        <SearchPill>
          <FiSearch size={14} />
          <span>{t("panel.search")}</span>
          <kbd>{timeLabel}</kbd>
        </SearchPill>
        <IconButton type="button" aria-label={t("panel.notifications")}>
          <FiBell />
          <Badge>5</Badge>
        </IconButton>
        <UserChip>
          <Avatar>{user ? `${user.firstName[0]}${user.lastName[0]}` : 'A'}</Avatar>
          <UserMeta>
            <div className="name">{user ? `${user.firstName} ${user.lastName}` : t("panel.admin")}</div>
            <div className="role">{isFullAdmin(user) ? t("panel.superAdmin") : t("panel.staff")}</div>
          </UserMeta>
        </UserChip>
      </RightSection>
    </HeaderWrapper>
  );
};

export default AdminHeader;
