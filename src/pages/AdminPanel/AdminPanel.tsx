import React, { useState } from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/AdminPanel/AdminSidebar';
import AdminHeader from '../../components/AdminPanel/AdminHeader';

const PanelWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #fafbfc;
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const Backdrop = styled.div<{ $isOpen: boolean }>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  transition: opacity 0.3s ease;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 280px;
  padding: 0;
  min-height: 100vh;
  background: #fafbfc;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-left: 0;
    padding-top: 70px;
  }
`;

const ContentArea = styled.div`
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1rem;
  }
`;

const AdminPanel: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <PanelWrapper>
      <Backdrop $isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <MainContent>
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </PanelWrapper>
  );
};

export default AdminPanel;
