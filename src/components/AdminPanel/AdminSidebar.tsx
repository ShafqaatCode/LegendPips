import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome, FiUsers, FiAward, FiFileText, FiVideo, FiSettings,
  FiLogOut, FiBarChart2, FiTrendingUp, FiShield, FiDatabase,
  FiX, FiInbox, FiActivity, FiDollarSign, FiGlobe, FiChevronDown, FiChevronUp,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { USER_LIST_PRESETS } from '../../utils/userListFilters';
import { KYC_RECORD_PRESETS } from '../../utils/kycRecordFilters';

const SidebarWrapper = styled.aside<{ $isOpen: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  width: 240px;
  height: 100vh;
  background: #132E58;
  color: white;
  z-index: 1000;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
  }

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
`;

const SidebarHeader = styled.div`
  padding: 0.875rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #Fbbf24;
  svg { font-size: 1.125rem; }
`;

const CloseButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) { display: block; }
`;

const NavSection = styled.div` padding: 0.5rem 0; `;

const SectionTitle = styled.div`
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.4);
  padding: 0.5rem 1rem 0.25rem;
  font-weight: 700;
`;

const NavLinkStyled = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 1rem;
  margin: 1px 0.5rem;
  border-radius: 7px;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 500;
  transition: all 0.15s;
  svg { font-size: 1rem; flex-shrink: 0; }
  &:hover { background: rgba(255, 255, 255, 0.08); color: white; }
  &.active { background: rgba(251, 191, 36, 0.18); color: #Fbbf24; font-weight: 600; }
`;

const UsersGroupBtn = styled.button<{ $open?: boolean; $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: calc(100% - 1rem);
  margin: 1px 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 7px;
  background: ${({ $active }) => ($active ? 'rgba(251, 191, 36, 0.18)' : 'transparent')};
  color: ${({ $active }) => ($active ? '#Fbbf24' : 'rgba(255, 255, 255, 0.75)')};
  font-size: 0.8125rem;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;

  svg:first-child { font-size: 1rem; }
  .chevron { margin-left: auto; font-size: 0.875rem; opacity: 0.7; }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: white;
  }
`;

const SubNav = styled.div`
  margin: 0.15rem 0.5rem 0.35rem 1.25rem;
  padding-left: 0.75rem;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
`;

const SubLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.65rem;
  margin: 1px 0;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.12s;

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    flex-shrink: 0;
  }

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.06);
    &::before { background: #Fbbf24; }
  }

  &.active {
    color: #Fbbf24;
    font-weight: 600;
    background: rgba(251, 191, 36, 0.1);
    &::before { background: #Fbbf24; }
  }
`;

const Footer = styled.div`
  margin-top: auto;
  padding: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: calc(100% - 1rem);
  margin: 0.25rem 0.5rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8125rem;
  cursor: pointer;
  text-align: left;
  &:hover { background: rgba(239, 68, 68, 0.15); color: #fca5a5; }
  svg { font-size: 1rem; }
`;

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout: authLogout } = useAuth();

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

  const link = (to: string, label: string, icon: React.ElementType, end?: boolean) => (
    <NavLinkStyled key={to} to={to} end={end} onClick={() => window.innerWidth <= 992 && onToggle()}>
      {React.createElement(icon)}<span>{label}</span>
    </NavLinkStyled>
  );

  return (
    <SidebarWrapper $isOpen={isOpen}>
      <SidebarHeader>
        <Logo><FiShield /><span>Admin</span></Logo>
        <CloseButton onClick={onToggle}><FiX /></CloseButton>
      </SidebarHeader>

      <NavSection>
        <SectionTitle>Main</SectionTitle>
        {link('/admin-panel', 'Dashboard', FiHome, true)}

        <UsersGroupBtn
          type="button"
          $open={usersOpen}
          $active={isUsersSection}
          onClick={() => setUsersOpen((o) => !o)}
        >
          <FiUsers /><span>Users</span>
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
                onClick={() => window.innerWidth <= 992 && onToggle()}
              >
                {preset.label}
              </SubLink>
            ))}
            <SubLink
              to="/admin-panel/users/bulk-email"
              className={() => (location.pathname === '/admin-panel/users/bulk-email' ? 'active' : '')}
              onClick={() => window.innerWidth <= 992 && onToggle()}
            >
              Bulk Email
            </SubLink>
          </SubNav>
        )}

        <UsersGroupBtn
          type="button"
          $open={kycOpen}
          $active={isKycSection}
          onClick={() => setKycOpen((o) => !o)}
        >
          <FiShield /><span>KYC Records</span>
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
                onClick={() => window.innerWidth <= 992 && onToggle()}
              >
                {preset.label}
              </SubLink>
            ))}
          </SubNav>
        )}
      </NavSection>

      <NavSection>
        <SectionTitle>Content</SectionTitle>
        {link('/admin-panel/brokers', 'Brokers', FiDatabase)}
        {link('/admin-panel/contests', 'Contests', FiAward)}
        {link('/admin-panel/signals', 'Signals', FiTrendingUp)}
        {link('/admin-panel/webinars', 'Webinars', FiVideo)}
        {link('/admin-panel/analysis', 'Analysis', FiFileText)}
        {link('/admin-panel/courses', 'Courses', FiFileText)}
      </NavSection>

      <NavSection>
        <SectionTitle>System</SectionTitle>
        {link('/admin-panel/feedback-inbox', 'Feedback', FiInbox)}
        {link('/admin-panel/user-activity', 'Activity', FiActivity)}
        {link('/admin-panel/rebate-credits', 'Rebates', FiDollarSign)}
        {link('/admin-panel/reports', 'Reports', FiBarChart2)}
        {link('/admin-panel/settings', 'Settings', FiSettings)}
      </NavSection>

      <Footer>
        {link('/', 'Homepage', FiGlobe, true)}
        <LogoutButton onClick={() => { authLogout(); navigate('/'); window.location.reload(); }}>
          <FiLogOut /><span>Logout</span>
        </LogoutButton>
      </Footer>
    </SidebarWrapper>
  );
};

export default AdminSidebar;
