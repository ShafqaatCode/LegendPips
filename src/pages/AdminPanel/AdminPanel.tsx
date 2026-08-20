import React, { useState } from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/AdminPanel/AdminSidebar';
import AdminHeader from '../../components/AdminPanel/AdminHeader';
import { adminColors } from '../../components/AdminPanel/adminUi';
import AutoTranslateRoot from '../../components/i18n/AutoTranslateRoot';

const PanelWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 50% at 100% 0%, rgba(251, 191, 36, 0.07) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 0% 100%, rgba(19, 46, 88, 0.05) 0%, transparent 50%),
    ${adminColors.bg};
`;

const Backdrop = styled.div<{ $isOpen: boolean }>`
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(8, 20, 40, 0.5);
  backdrop-filter: blur(3px);
  z-index: 999;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transition: opacity 0.25s;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 256px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  min-width: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-left: 0;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 1.25rem 1.5rem 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0.85rem 0.85rem 1.5rem;
  }
`;

const AdminPanel: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <PanelWrapper>
      <Backdrop $isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      <div className="notranslate">
        <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>
      <MainContent>
        <div className="notranslate">
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        </div>
        <ContentArea>
          <AutoTranslateRoot>
            <Outlet />
          </AutoTranslateRoot>
        </ContentArea>
      </MainContent>
    </PanelWrapper>
  );
};

export default AdminPanel;
