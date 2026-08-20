import React, { useState } from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import UserSidebar from '../../components/UserPanel/UserSidebar';
import UserHeader from '../../components/UserPanel/UserHeader';
import AutoTranslateRoot from '../../components/i18n/AutoTranslateRoot';

const PanelWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background:
    radial-gradient(ellipse 70% 45% at 100% -5%, rgba(251, 191, 36, 0.14) 0%, transparent 52%),
    radial-gradient(ellipse 50% 40% at 0% 100%, rgba(19, 46, 88, 0.08) 0%, transparent 48%),
    radial-gradient(ellipse 40% 30% at 50% 50%, rgba(255, 255, 255, 0.55) 0%, transparent 60%),
    linear-gradient(165deg, #e8eef6 0%, #f4f7fb 40%, #eef3f8 100%);
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
  padding: 1.35rem 1.65rem 2.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0.95rem 0.9rem 1.75rem;
  }
`;

const UserPanel: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <PanelWrapper>
      <Backdrop $isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      <div className="notranslate">
        <UserSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>
      <MainContent>
        <div className="notranslate">
          <UserHeader onMenuClick={() => setSidebarOpen(true)} />
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

export default UserPanel;
