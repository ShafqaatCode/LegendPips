import React, { useState } from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/AdminPanel/AdminSidebar';
import AdminHeader from '../../components/AdminPanel/AdminHeader';

const PanelWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f4f6f9;
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
  margin-left: 240px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-left: 0;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 1rem 1.25rem 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0.75rem;
  }
`;

const AdminPanel: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <PanelWrapper>
      <Backdrop $isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <MainContent>
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </PanelWrapper>
  );
};

export default AdminPanel;
