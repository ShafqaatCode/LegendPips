import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getMyKyc, type KycStatus } from '../../services/kycService';
import {
  FiHome, FiUser, FiAward, FiTrendingUp, FiVideo, FiBook, FiFileText,
  FiMessageSquare, FiSettings, FiLogOut, FiBarChart2, FiCalendar,
  FiX, FiDollarSign, FiGlobe, FiShield, FiUserPlus, FiShuffle, FiLink,
} from 'react-icons/fi';

const SidebarWrapper = styled.aside<{ $isOpen: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  width: 248px;
  height: 100vh;
  background:
    radial-gradient(ellipse 90% 40% at 0% 0%, rgba(251, 191, 36, 0.14) 0%, transparent 55%),
    linear-gradient(180deg, #0c1f3d 0%, #132E58 45%, #0f2448 100%);
  color: white;
  z-index: 1000;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease;
  box-shadow: 4px 0 24px rgba(12, 31, 61, 0.18);
  border-right: 1px solid rgba(251, 191, 36, 0.12);

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
  gap: 0.55rem;
  font-size: 0.95rem;
  font-weight: 800;
  color: #Fbbf24;
  letter-spacing: -0.02em;

  span.mark {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(145deg, #Fbbf24 0%, #f59e0b 100%);
    color: #0c1f3d;
    font-size: 0.72rem;
    font-weight: 900;
    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.35);
  }
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

const UserProfile = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const Avatar = styled.div<{ $image?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${({ $image }) =>
    $image ? `url(${$image}) center/cover no-repeat` : 'linear-gradient(135deg, #Fbbf24 0%, #f4b400 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
  color: #132E58;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.45);
`;

const ProfileText = styled.div`
  min-width: 0;

  h3 {
    font-size: 0.8375rem;
    font-weight: 700;
    margin: 0 0 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    font-size: 0.6875rem;
    color: rgba(255, 255, 255, 0.55);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
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
  gap: 0.65rem;
  padding: 0.58rem 0.85rem;
  margin: 2px 0.55rem;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.78);
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 500;
  transition: all 0.15s;

  svg { font-size: 1rem; flex-shrink: 0; opacity: 0.9; }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  &.active {
    background: linear-gradient(90deg, rgba(251, 191, 36, 0.26) 0%, rgba(251, 191, 36, 0.08) 100%);
    color: #Fbbf24;
    font-weight: 700;
    box-shadow:
      inset 3px 0 0 #Fbbf24,
      0 4px 14px rgba(0, 0, 0, 0.12);
  }
`;

const NavBadge = styled.span<{ $variant?: string }>`
  margin-left: auto;
  font-size: 0.5625rem;
  font-weight: 700;
  padding: 0.15rem 0.4rem;
  border-radius: 999px;
  text-transform: uppercase;
  background: ${({ $variant }) =>
    $variant === 'pending' ? 'rgba(251,191,36,0.25)' :
    $variant === 'rejected' ? 'rgba(239,68,68,0.25)' :
    $variant === 'approved' ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.12)'};
  color: ${({ $variant }) =>
    $variant === 'pending' ? '#fde68a' :
    $variant === 'rejected' ? '#fca5a5' :
    $variant === 'approved' ? '#6ee7b7' : 'rgba(255,255,255,0.6)'};
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

interface UserSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();
  const [kycStatus, setKycStatus] = useState<KycStatus | undefined>(
    user?.kycStatus as KycStatus | undefined
  );

  useEffect(() => {
    getMyKyc()
      .then((data) => setKycStatus(data.kycStatus))
      .catch(() => undefined);
  }, []);

  const link = (to: string, label: string, icon: React.ElementType, end?: boolean, badge?: string) => (
    <NavLinkStyled
      key={to}
      to={to}
      end={end}
      onClick={() => window.innerWidth <= 992 && onToggle()}
    >
      {React.createElement(icon)}
      <span>{label}</span>
      {badge && <NavBadge $variant={badge}>{badge === 'approved' ? '✓' : badge.slice(0, 4)}</NavBadge>}
    </NavLinkStyled>
  );

  const kycBadge = kycStatus && kycStatus !== 'incomplete' ? kycStatus : undefined;

  return (
    <SidebarWrapper $isOpen={isOpen}>
      <SidebarHeader>
        <Logo><span className="mark">LP</span> Member</Logo>
        <CloseButton onClick={onToggle}><FiX /></CloseButton>
      </SidebarHeader>

      <UserProfile>
        <Avatar $image={user?.profileImage}>
          {!user?.profileImage && (user ? `${user.firstName[0]}${user.lastName[0]}` : 'U')}
        </Avatar>
        <ProfileText>
          <h3>{user ? `${user.firstName} ${user.lastName}` : 'User'}</h3>
          <p>{user?.email || ''}</p>
        </ProfileText>
      </UserProfile>

      <NavSection>
        <SectionTitle>Main</SectionTitle>
        {link('/user-panel', 'Dashboard', FiHome, true)}
        {link('/user-panel/profile', 'My Profile', FiUser)}
        {link('/user-panel/verification', 'Identity Verification', FiShield, false, kycBadge)}
        {link('/user-panel/contests', 'My Contests', FiAward)}
        {link('/user-panel/signals', 'My Signals', FiTrendingUp)}
        {link('/user-panel/rebates', 'My Rebates', FiDollarSign)}
        {link('/user-panel/live-accounts', 'My live accounts', FiLink)}
        {link('/user-panel/invite', 'Invite a friend', FiUserPlus)}
        {link('/user-panel/ib-change', 'IB change', FiShuffle)}
      </NavSection>

      <NavSection>
        <SectionTitle>Content</SectionTitle>
        {link('/user-panel/webinars', 'My Webinars', FiVideo)}
        {link('/user-panel/courses', 'My Courses', FiBook)}
        {link('/user-panel/trading-videos', 'Trading Videos', FiVideo)}
        {link('/user-panel/analysis', 'Saved Analysis', FiFileText)}
      </NavSection>

      <NavSection>
        <SectionTitle>Community</SectionTitle>
        {link('/user-panel/forum', 'Forum Posts', FiMessageSquare)}
        {link('/user-panel/activity', 'Activity', FiBarChart2)}
        {link('/user-panel/calendar', 'Calendar', FiCalendar)}
        {link('/user-panel/settings', 'Settings', FiSettings)}
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

export default UserSidebar;
