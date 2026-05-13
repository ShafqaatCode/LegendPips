import React from 'react';
import styled from 'styled-components';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiHome,
  FiUser,
  FiAward,
  FiTrendingUp,
  FiVideo,
  FiBook,
  FiFileText,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiBarChart2,
  FiCalendar,
  FiX,
  FiMenu,
  FiDollarSign,
} from 'react-icons/fi';

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

const UserProfile = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #Fbbf24 0%, #f4b400 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #132E58;
  margin-bottom: 0.75rem;
`;

const UserName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: white;
`;

const UserEmail = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
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

interface UserSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();

  const mainMenuItems = [
    { to: '/user-panel', label: 'Dashboard', icon: FiHome, end: true },
    { to: '/user-panel/profile', label: 'My Profile', icon: FiUser },
    { to: '/user-panel/contests', label: 'My Contests', icon: FiAward },
    { to: '/user-panel/signals', label: 'My Signals', icon: FiTrendingUp },
    { to: '/user-panel/rebates', label: 'My Rebates', icon: FiDollarSign },
  ];

  const contentMenuItems = [
    { to: '/user-panel/webinars', label: 'My Webinars', icon: FiVideo },
    { to: '/user-panel/courses', label: 'My Courses', icon: FiBook },
    { to: '/user-panel/trading-videos', label: 'Trading Videos', icon: FiVideo },
    { to: '/user-panel/analysis', label: 'Saved Analysis', icon: FiFileText },
  ];

  const communityMenuItems = [
    { to: '/user-panel/forum', label: 'Forum Posts', icon: FiMessageSquare },
    { to: '/user-panel/activity', label: 'Activity', icon: FiBarChart2 },
    { to: '/user-panel/calendar', label: 'Calendar', icon: FiCalendar },
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
          <span>LP</span>
          <span>Panel</span>
        </Logo>
        <CloseButton onClick={onToggle}>
          <FiX />
        </CloseButton>
      </SidebarHeader>

      <UserProfile>
        <Avatar>
          {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
        </Avatar>
        <UserName>
          {user ? `${user.firstName} ${user.lastName}` : 'User'}
        </UserName>
        <UserEmail>{user?.email || 'user@example.com'}</UserEmail>
      </UserProfile>

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
        <SectionTitle>Community</SectionTitle>
        <NavList>
          {communityMenuItems.map((item) => (
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
              to="/user-panel/settings"
              onClick={() => window.innerWidth <= 992 && onToggle()}
            >
              <FiSettings />
              <span>Settings</span>
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

export default UserSidebar;
