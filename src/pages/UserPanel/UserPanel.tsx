import React, { useState } from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import UserSidebar from '../../components/UserPanel/UserSidebar';
import UserHeader from '../../components/UserPanel/UserHeader';

const PanelWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 50% at 100% 0%, rgba(251, 191, 36, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 0% 100%, rgba(19, 46, 88, 0.06) 0%, transparent 45%),
    linear-gradient(165deg, #eef2f7 0%, #f7f9fc 45%, #f0f4f8 100%);
`;

const Backdrop = styled.div<{ $isOpen: boolean }>`
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  z-index: 999;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transition: opacity 0.2s;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 248px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-left: 0;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 1.15rem 1.5rem 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0.85rem 0.85rem 1.5rem;
  }
`;

const UserPanel: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <PanelWrapper>
      <Backdrop $isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      <UserSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <MainContent>
        <UserHeader onMenuClick={() => setSidebarOpen(true)} />
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </PanelWrapper>
  );
};

export default UserPanel;
