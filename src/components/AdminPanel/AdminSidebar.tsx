import React from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiAward,
  FiFileText,
  FiVideo,
  FiSettings,
  FiLogOut,
  FiBarChart2,
  FiTrendingUp,
  FiShield,
  FiDatabase,
  FiX,
  FiInbox,
  FiActivity,
  FiDollarSign,
  FiGlobe,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const SidebarWrapper = styled.aside<{ $isOpen: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  width: 280px;
  height: 100vh;
  background: #132E58;
  color: white;
  z-index: 1000;
  overflow-y: auto;
  transition: transform 0.3s ease;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
  }
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #Fbbf24;
`;

const CloseButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const AdminBadge = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(251, 191, 36, 0.1);
`;

const BadgeText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #Fbbf24;
  
  svg {
    font-size: 1rem;
  }
`;

const NavSection = styled.div`
  padding: 1rem 0;
`;

const SectionTitle = styled.h4`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.5);
  padding: 0 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin: 0.25rem 0;
`;

const NavLinkStyled = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.9375rem;
  font-weight: 500;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  &.active {
    background: rgba(251, 191, 36, 0.15);
    color: #Fbbf24;
    border-left: 3px solid #Fbbf24;
    
    svg {
      color: #Fbbf24;
    }
  }
  
  svg {
    font-size: 1.25rem;
    transition: color 0.2s ease;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9375rem;
  font-weight: 500;
  margin-top: 1rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ff6b6b;
  }
  
  svg {
    font-size: 1.25rem;
  }
`;

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();

  const mainMenuItems = [
    { to: '/admin-panel', label: 'Dashboard', icon: FiHome, end: true },
    { to: '/admin-panel/users', label: 'Users', icon: FiUsers },
  ];

  const contentMenuItems = [
    { to: '/admin-panel/brokers', label: 'Brokers', icon: FiDatabase },
    { to: '/admin-panel/contests', label: 'Contests', icon: FiAward },
    { to: '/admin-panel/signals', label: 'Signals', icon: FiTrendingUp },
    { to: '/admin-panel/webinars', label: 'Webinars', icon: FiVideo },
    { to: '/admin-panel/analysis', label: 'Analysis', icon: FiFileText },
    { to: '/admin-panel/courses', label: 'Courses', icon: FiFileText },
  ];

  const systemMenuItems = [
    { to: '/admin-panel/feedback-inbox', label: 'Feedback inbox', icon: FiInbox },
    { to: '/admin-panel/user-activity', label: 'User activity', icon: FiActivity },
    { to: '/admin-panel/rebate-credits', label: 'Rebate credits', icon: FiDollarSign },
    { to: '/admin-panel/reports', label: 'Reports & Analytics', icon: FiBarChart2 },
    { to: '/admin-panel/settings', label: 'Settings', icon: FiSettings },
  ];

  const handleLogout = () => {
    authLogout();
    navigate('/');
    window.location.reload();
  };

  return (
    <SidebarWrapper $isOpen={isOpen}>
      <SidebarHeader>
        <Logo>
          <FiShield />
          <span>Admin Panel</span>
        </Logo>
        <CloseButton onClick={onToggle}>
          <FiX />
        </CloseButton>
      </SidebarHeader>

      <AdminBadge>
        <BadgeText>
          <FiShield />
          Administrator Access
        </BadgeText>
      </AdminBadge>

      <NavSection>
        <SectionTitle>Main</SectionTitle>
        <NavList>
          {mainMenuItems.map((item) => (
            <NavItem key={item.to}>
              <NavLinkStyled
                to={item.to}
                end={item.end || false}
                onClick={() => window.innerWidth <= 992 && onToggle()}
              >
                <item.icon />
                <span>{item.label}</span>
              </NavLinkStyled>
            </NavItem>
          ))}
        </NavList>
      </NavSection>

      <NavSection>
        <SectionTitle>Content</SectionTitle>
        <NavList>
          {contentMenuItems.map((item) => (
            <NavItem key={item.to}>
              <NavLinkStyled
                to={item.to}
                onClick={() => window.innerWidth <= 992 && onToggle()}
              >
                <item.icon />
                <span>{item.label}</span>
              </NavLinkStyled>
            </NavItem>
          ))}
        </NavList>
      </NavSection>

      <NavSection>
        <SectionTitle>System</SectionTitle>
        <NavList>
          {systemMenuItems.map((item) => (
            <NavItem key={item.to}>
              <NavLinkStyled
                to={item.to}
                onClick={() => window.innerWidth <= 992 && onToggle()}
              >
                <item.icon />
                <span>{item.label}</span>
              </NavLinkStyled>
            </NavItem>
          ))}
        </NavList>
      </NavSection>

      <NavSection>
        <NavList>
          <NavItem>
            <NavLinkStyled
              to="/"
              end
              onClick={() => window.innerWidth <= 992 && onToggle()}
            >
              <FiGlobe />
              <span>Back to homepage</span>
            </NavLinkStyled>
          </NavItem>
        </NavList>
      </NavSection>

      <LogoutButton onClick={handleLogout}>
        <FiLogOut />
        <span>Logout</span>
      </LogoutButton>
    </SidebarWrapper>
  );
};

export default AdminSidebar;
