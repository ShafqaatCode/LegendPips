import React, { useState } from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import UserSidebar from '../../components/UserPanel/UserSidebar';
import UserHeader from '../../components/UserPanel/UserHeader';
import UserPanelHighlightBanners from '../../components/UserPanel/UserPanelHighlightBanners';
import AutoTranslateRoot from '../../components/i18n/AutoTranslateRoot';

const PanelWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background:
    radial-gradient(ellipse 55% 40% at 92% -8%, rgba(251, 193, 19, 0.12) 0%, transparent 55%),
    radial-gradient(ellipse 45% 35% at 0% 100%, rgba(19, 46, 88, 0.06) 0%, transparent 50%),
    linear-gradient(180deg, #f3f6fb 0%, #eef2f7 48%, #f7f9fc 100%);
`;

const Backdrop = styled.div<{ $isOpen: boolean }>`
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(10, 22, 40, 0.45);
  backdrop-filter: blur(2px);
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
  margin-left: 268px;
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
  padding: 1.25rem 1.5rem 2.75rem;
  display: flex;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0.9rem 0.85rem 2rem;
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
        <UserPanelHighlightBanners placement="top" />
        <ContentArea>
          <AutoTranslateRoot>
            <Outlet />
          </AutoTranslateRoot>
          <UserPanelHighlightBanners placement="bottom" />
        </ContentArea>
      </MainContent>
    </PanelWrapper>
  );
};

export default UserPanel;
