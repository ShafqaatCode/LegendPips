import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome, FiUsers, FiAward, FiFileText, FiVideo, FiSettings,
  FiLogOut, FiBarChart2, FiTrendingUp, FiShield, FiDatabase,
  FiX, FiInbox, FiActivity, FiDollarSign, FiGlobe, FiChevronDown, FiChevronUp,
  FiUserPlus, FiShuffle, FiLink, FiStar, FiAlertTriangle,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { USER_LIST_PRESETS } from '../../utils/userListFilters';
import { KYC_RECORD_PRESETS } from '../../utils/kycRecordFilters';
import { adminColors } from './adminUi';
import { hasPermission, isFullAdmin } from '../../utils/adminPermissions';
import { useLocale } from '../../contexts/LocaleContext';

const SidebarWrapper = styled.aside<{ $isOpen: boolean }>`
  position: fixed;
  left: 0;
  html[dir="rtl"] & {
    left: auto;
    right: 0;
    border-right: none;
    border-left: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow: -4px 0 32px rgba(8, 20, 40, 0.35);
  }
  top: 0;
  width: 256px;
  height: 100vh;
  background:
    radial-gradient(ellipse 120% 60% at 0% 0%, rgba(251, 191, 36, 0.12) 0%, transparent 55%),
    linear-gradient(180deg, #0c1f3d 0%, ${adminColors.navy} 42%, #0a1930 100%);
  color: white;
  z-index: 1000;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 4px 0 32px rgba(8, 20, 40, 0.35);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
    html[dir="rtl"] & {
      transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '100%')});
    }
  }

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
`;

const SidebarHeader = styled.div`
  padding: 1.15rem 1.05rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
`;

const BrandMark = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: linear-gradient(145deg, ${adminColors.gold} 0%, #f59e0b 100%);
  color: ${adminColors.navy};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow: 0 4px 14px rgba(251, 191, 36, 0.35);
  flex-shrink: 0;
`;

const BrandText = styled.div`
  min-width: 0;

  .name {
    font-size: 0.9375rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: white;
    line-height: 1.15;
  }
  .tag {
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(251, 191, 36, 0.85);
    margin-top: 0.15rem;
  }
`;

const CloseButton = styled.button`
  display: none;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) { display: flex; }
`;

const NavSection = styled.div`
  padding: 0.65rem 0 0.25rem;
`;

const SectionTitle = styled.div`
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.32);
  padding: 0.55rem 1.1rem 0.35rem;
  font-weight: 700;
`;

const navItemBase = `
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.8rem;
  margin: 2px 0.65rem;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.72);
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 500;
  transition: background 0.15s, color 0.15s, box-shadow 0.15s, transform 0.12s;
  svg { font-size: 1.05rem; flex-shrink: 0; opacity: 0.9; }
  &:hover {
    background: rgba(255, 255, 255, 0.07);
    color: white;
  }
`;

const NavLinkStyled = styled(NavLink)`
  ${navItemBase}
  &.active {
    background: linear-gradient(90deg, rgba(251, 191, 36, 0.22) 0%, rgba(251, 191, 36, 0.06) 100%);
    color: ${adminColors.gold};
    font-weight: 600;
    box-shadow: inset 3px 0 0 ${adminColors.gold};
    svg { opacity: 1; }
  }
`;

const UsersGroupBtn = styled.button<{ $open?: boolean; $active?: boolean }>`
  ${navItemBase}
  width: calc(100% - 1.3rem);
  border: none;
  background: ${({ $active }) =>
    $active ? 'linear-gradient(90deg, rgba(251, 191, 36, 0.18) 0%, transparent 100%)' : 'transparent'};
  color: ${({ $active }) => ($active ? adminColors.gold : 'rgba(255, 255, 255, 0.72)')};
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  cursor: pointer;
  text-align: left;
  font-family: inherit;

  svg:first-child { font-size: 1.05rem; }
  .chevron { margin-left: auto; font-size: 0.875rem; opacity: 0.55; }
  &:hover {
    background: rgba(255, 255, 255, 0.07);
    color: white;
  }
`;

const SubNav = styled.div`
  margin: 0.1rem 0.65rem 0.4rem 1.35rem;
  padding-left: 0.7rem;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
`;

const SubLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.42rem 0.65rem;
  margin: 1px 0;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.58);
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.12s;

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.22);
    flex-shrink: 0;
  }

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.06);
    &::before { background: ${adminColors.gold}; }
  }

  &.active {
    color: ${adminColors.gold};
    font-weight: 600;
    background: rgba(251, 191, 36, 0.1);
    &::before { background: ${adminColors.gold}; }
  }
`;

const Footer = styled.div`
  margin-top: auto;
  padding: 0.65rem 0.5rem 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.15));
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: calc(100% - 1.3rem);
  margin: 0.2rem 0.65rem;
  padding: 0.55rem 0.8rem;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.8125rem;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  &:hover {
    background: rgba(239, 68, 68, 0.12);
    border-color: rgba(239, 68, 68, 0.25);
    color: #fca5a5;
  }
  svg { font-size: 1.05rem; }
`;

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout: authLogout, user } = useAuth();
  const { t } = useLocale();

  const isUsersSection =
    location.pathname.startsWith('/admin-panel/users') ||
    location.pathname.startsWith('/admin-panel/user');

  const isKycSection = location.pathname.startsWith('/admin-panel/kyc-records');

  const [usersOpen, setUsersOpen] = useState(isUsersSection);
  const [kycOpen, setKycOpen] = useState(isKycSection);

  useEffect(() => {
    if (isUsersSection) setUsersOpen(true);
  }, [isUsersSection]);

  useEffect(() => {
    if (isKycSection) setKycOpen(true);
  }, [isKycSection]);

  const closeMobile = () => {
    if (window.innerWidth <= 992) onToggle();
  };

  const link = (to: string, label: string, icon: React.ElementType, end?: boolean) => (
    <NavLinkStyled key={to} to={to} end={end} onClick={closeMobile}>
      {React.createElement(icon)}<span>{label}</span>
    </NavLinkStyled>
  );

  const show = (...perms: string[]) => hasPermission(user, ...perms);
  const full = isFullAdmin(user);

  return (
    <SidebarWrapper $isOpen={isOpen}>
      <SidebarHeader>
        <Brand>
          <BrandMark><FiShield /></BrandMark>
          <BrandText>
            <div className="name">LegendPips</div>
            <div className="tag">{full ? t("panel.adminConsole") : t("panel.staffConsole")}</div>
          </BrandText>
        </Brand>
        <CloseButton type="button" onClick={onToggle} aria-label={t("panel.closeMenu")}><FiX /></CloseButton>
      </SidebarHeader>

      <NavSection>
        <SectionTitle>{t("panel.main")}</SectionTitle>
        {show('dashboard') && link('/admin-panel', t("panel.dashboard"), FiHome, true)}

        {show('users') && (
          <>
            <UsersGroupBtn
              type="button"
              $open={usersOpen}
              $active={isUsersSection}
              onClick={() => setUsersOpen((o) => !o)}
            >
              <FiUsers /><span>{t("panel.users")}</span>
              <span className="chevron">{usersOpen ? <FiChevronUp /> : <FiChevronDown />}</span>
            </UsersGroupBtn>

            {usersOpen && (
              <SubNav>
                {USER_LIST_PRESETS.map((preset) => (
                  <SubLink
                    key={preset.id || 'all'}
                    to={preset.id ? `/admin-panel/users?filter=${preset.id}` : '/admin-panel/users'}
                    className={() => {
                      if (location.pathname !== '/admin-panel/users') return '';
                      const filter = new URLSearchParams(location.search).get('filter') || '';
                      return filter === preset.id ? 'active' : '';
                    }}
                    onClick={closeMobile}
                  >
                    {t(
                      preset.id === "kyc-verified"
                        ? "panel.usersKycOk"
                        : preset.id === "kyc-pending"
                          ? "panel.usersKycWait"
                          : preset.id === "email-verified"
                            ? "panel.usersEmail"
                            : preset.id === "active"
                              ? "panel.usersActive"
                              : preset.id === "banned"
                                ? "panel.usersBanned"
                                : "panel.usersAll"
                    )}
                  </SubLink>
                ))}
                {show('bulk_email') && (
                  <SubLink
                    to="/admin-panel/users/bulk-email"
                    className={() => (location.pathname === '/admin-panel/users/bulk-email' ? 'active' : '')}
                    onClick={closeMobile}
                  >
                    {t("panel.bulkEmail")}
                  </SubLink>
                )}
              </SubNav>
            )}
          </>
        )}

        {!show('users') && show('bulk_email') && link('/admin-panel/users/bulk-email', t("panel.bulkEmail"), FiInbox)}

        {show('kyc') && (
          <>
            <UsersGroupBtn
              type="button"
              $open={kycOpen}
              $active={isKycSection}
              onClick={() => setKycOpen((o) => !o)}
            >
              <FiShield /><span>{t("panel.kycRecords")}</span>
              <span className="chevron">{kycOpen ? <FiChevronUp /> : <FiChevronDown />}</span>
            </UsersGroupBtn>

            {kycOpen && (
              <SubNav>
                {KYC_RECORD_PRESETS.map((preset) => (
                  <SubLink
                    key={preset.id || 'all-kyc'}
                    to={preset.id ? `/admin-panel/kyc-records?filter=${preset.id}` : '/admin-panel/kyc-records'}
                    className={() => {
                      if (!location.pathname.startsWith('/admin-panel/kyc-records')) return '';
                      if (location.pathname !== '/admin-panel/kyc-records') return '';
                      const filter = new URLSearchParams(location.search).get('filter') || '';
                      return filter === preset.id ? 'active' : '';
                    }}
                    onClick={closeMobile}
                  >
                    {t(
                      preset.id === "pending"
                        ? "panel.kycPend"
                        : preset.id === "approved"
                          ? "panel.kycOk"
                          : preset.id === "rejected"
                            ? "panel.kycNo"
                            : "panel.kycAll"
                    )}
                  </SubLink>
                ))}
              </SubNav>
            )}
          </>
        )}
      </NavSection>

      {(show('brokers') || show('contests') || show('signals') || show('webinars') || show('analysis') || show('courses')) && (
        <NavSection>
          <SectionTitle>{t("panel.content")}</SectionTitle>
          {show('brokers') && link('/admin-panel/brokers', t("panel.brokers"), FiDatabase)}
          {show('brokers') && link('/admin-panel/broker-reviews', t("panel.brokerReviews"), FiStar)}
          {show('brokers') && link('/admin-panel/signup-bonuses', "Signup Bonuses", FiDollarSign)}
          {show('analysis') && link('/admin-panel/performing-stocks', "Performing Stocks", FiTrendingUp)}
          {show('contests') && link('/admin-panel/contests', t("nav.contests"), FiAward)}
          {show('signals') && link('/admin-panel/signals', t("nav.signals"), FiTrendingUp)}
          {show('webinars') && link('/admin-panel/webinars', t("nav.webinars"), FiVideo)}
          {show('analysis') && link('/admin-panel/analysis', t("nav.analysis"), FiFileText)}
          {show('courses') && link('/admin-panel/courses', t("nav.courses"), FiFileText)}
        </NavSection>
      )}

      {(show('feedback') || show('activity') || show('rebates') || show('traders') || show('live_accounts') || show('reports') || show('settings') || show('brokers') || full) && (
        <NavSection>
          <SectionTitle>{t("panel.system")}</SectionTitle>
          {show('feedback') && link('/admin-panel/feedback-inbox', t("panel.feedback"), FiInbox)}
          {(show('feedback') || show('brokers')) && link('/admin-panel/complaints', t("nav.complaints"), FiAlertTriangle)}
          {show('activity') && link('/admin-panel/user-activity', t("panel.activity"), FiActivity)}
          {show('referrals') && link('/admin-panel/referrals', t("panel.referrals"), FiUserPlus)}
          {show('ib_change') && link('/admin-panel/ib-change', t("panel.ibChange"), FiShuffle)}
          {show('live_accounts') && link('/admin-panel/live-accounts', t("panel.qlLive"), FiLink)}
          {show('rebates') && link('/admin-panel/rebate-credits', t("nav.rebates"), FiDollarSign)}
          {show('traders') && link('/admin-panel/traders', t("nav.traders"), FiUsers)}
          {show('reports') && link('/admin-panel/reports', t("panel.reports"), FiBarChart2)}
          {link('/admin-panel/security', t("panel.security"), FiShield)}
          {show('settings') && link('/admin-panel/settings', t("panel.settings"), FiSettings)}
          {full && link('/admin-panel/team', t("panel.adminTeam"), FiUsers)}
        </NavSection>
      )}

      {/* Always expose Security for any admin (2FA self-service) */}
      {!(show('feedback') || show('activity') || show('rebates') || show('traders') || show('live_accounts') || show('reports') || show('settings') || show('brokers') || full) && (
        <NavSection>
          <SectionTitle>{t("panel.system")}</SectionTitle>
          {link('/admin-panel/security', t("panel.security"), FiShield)}
        </NavSection>
      )}

      <Footer>
        {user && (
          <div style={{
            margin: '0 0.65rem 0.5rem',
            padding: '0.55rem 0.7rem',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>
              {user.firstName} {user.lastName}
            </div>
            <div style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
              {full ? t("panel.superAdmin") : t("panel.teamStaff")}
            </div>
          </div>
        )}
        {link('/', t("panel.viewWebsite"), FiGlobe, true)}
        <LogoutButton type="button" onClick={() => { authLogout(); navigate('/'); window.location.reload(); }}>
          <FiLogOut /><span>{t("panel.logout")}</span>
        </LogoutButton>
      </Footer>
    </SidebarWrapper>
  );
};

export default AdminSidebar;
