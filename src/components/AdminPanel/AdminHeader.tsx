import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiSearch, FiLogOut, FiChevronDown, FiMessageSquare } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { adminColors } from './adminUi';
import { isFullAdmin, hasPermission } from '../../utils/adminPermissions';
import { useLocale } from '../../contexts/LocaleContext';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { fetchAdminChatConversations } from '../../services/chatService';
import { connectChatSocket } from '../../services/chatService';
import NotificationBell from '../UserPanel/NotificationBell';

const HeaderWrapper = styled.header`
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(232, 236, 241, 0.9);
  padding: 0.7rem 1.35rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8) inset;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0;
`;

const MenuButton = styled.button`
  display: none;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  font-size: 1.15rem;
  color: ${adminColors.navy};
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 9px;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;

  &:hover { background: #e2e8f0; }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const TitleBlock = styled.div`
  min-width: 0;

  .crumb {
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${adminColors.muted};
  }
  h1 {
    margin: 0.1rem 0 0;
    font-size: 1rem;
    font-weight: 800;
    color: ${adminColors.navy};
    letter-spacing: -0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  flex-shrink: 0;
`;

const SearchPill = styled.div`
  display: none;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  background: #f8fafc;
  border: 1px solid #e8ecf1;
  border-radius: 999px;
  color: ${adminColors.muted};
  font-size: 0.75rem;
  min-width: 160px;

  @media (min-width: 900px) {
    display: flex;
  }

  kbd {
    margin-left: auto;
    font-size: 0.6rem;
    font-weight: 700;
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
    background: white;
    border: 1px solid #e2e8f0;
    color: ${adminColors.muted};
  }
`;

const IconButton = styled.button`
  position: relative;
  background: white;
  border: 1px solid #e8ecf1;
  color: ${adminColors.muted};
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  border-radius: 10px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);

  &:hover {
    background: #f8fafc;
    color: ${adminColors.navy};
    border-color: #cbd5e1;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -3px;
  right: -3px;
  background: linear-gradient(135deg, ${adminColors.gold}, #f59e0b);
  color: ${adminColors.navy};
  font-size: 0.55rem;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: 999px;
  min-width: 14px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(251, 191, 36, 0.4);
`;

const UserChipWrap = styled.div`
  position: relative;
`;

const UserChip = styled.button`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.28rem 0.55rem 0.28rem 0.28rem;
  background: white;
  border: 1px solid #e8ecf1;
  border-radius: 999px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s, background 0.15s;

  &:hover,
  &[aria-expanded='true'] {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${adminColors.gold}, #f59e0b);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 800;
  color: ${adminColors.navy};
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.35);
`;

const UserMeta = styled.div`
  line-height: 1.15;
  padding-right: 0.1rem;
  text-align: left;

  .name {
    font-size: 0.75rem;
    font-weight: 700;
    color: ${adminColors.navy};
  }
  .role {
    font-size: 0.6rem;
    font-weight: 600;
    color: ${adminColors.muted};
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const ChipChevron = styled(FiChevronDown)<{ $open?: boolean }>`
  color: ${adminColors.muted};
  font-size: 0.85rem;
  flex-shrink: 0;
  transition: transform 0.15s;
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const UserMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 12px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
  padding: 0.35rem;
  z-index: 120;
`;

const UserMenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.7rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #b91c1c;
  font-size: 0.8125rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: #fef2f2;
  }
`;

const PAGE_TITLE_KEYS: Record<string, string> = {
  '/admin-panel': 'panel.dashboard',
  '/admin-panel/users': 'panel.users',
  '/admin-panel/users/bulk-email': 'panel.bulkEmail',
  '/admin-panel/push-alerts': 'Push alerts',
  '/admin-panel/panel-highlights': 'Panel highlights',
  '/admin-panel/kyc-records': 'panel.kycRecords',
  '/admin-panel/brokers': 'panel.brokers',
  '/admin-panel/broker-reviews': 'panel.brokerReviews',
  '/admin-panel/complaints': 'nav.complaints',
  '/admin-panel/contests': 'nav.contests',
  '/admin-panel/signals': 'nav.signals',
  '/admin-panel/webinars': 'nav.webinars',
  '/admin-panel/analysis': 'nav.analysis',
  '/admin-panel/courses': 'nav.courses',
  '/admin-panel/feedback-inbox': 'panel.feedback',
  '/admin-panel/live-chat': 'Live chat',
  '/admin-panel/user-activity': 'panel.activity',
  '/admin-panel/rebate-credits': 'nav.rebates',
  '/admin-panel/reports': 'panel.reports',
  '/admin-panel/settings': 'panel.settings',
  '/admin-panel/team': 'panel.adminTeam',
};

function resolveTitleKey(pathname: string): string {
  if (PAGE_TITLE_KEYS[pathname]) return PAGE_TITLE_KEYS[pathname];
  if (pathname.startsWith('/admin-panel/users/')) return 'panel.userDetail';
  if (pathname.startsWith('/admin-panel/kyc-records/')) return 'panel.kycReview';
  return 'panel.admin';
}

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
  const { user, logout: authLogout } = useAuth();
  const { t, locale } = useLocale();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [clock, setClock] = useState(() => new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatUnread, setChatUnread] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const canLiveChat = hasPermission(user, 'live_chat');

  useEffect(() => {
    const t = window.setInterval(() => setClock(new Date()), 60000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (!canLiveChat) {
      setChatUnread(0);
      return;
    }
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchAdminChatConversations({ status: 'open', page: 1, limit: 1 });
        if (!cancelled) setChatUnread(data.unreadTotal || 0);
      } catch {
        // ignore
      }
    };
    load();
    const timer = window.setInterval(load, 45000);
    const socket = connectChatSocket();
    const onConv = (conv: { unreadByAdmin?: number }) => {
      // Soft bump — refresh totals from API for accuracy
      load();
      void conv;
    };
    socket?.on('chat:conversation', onConv);
    socket?.on('chat:message', load);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      socket?.off('chat:conversation', onConv);
      socket?.off('chat:message', load);
    };
  }, [canLiveChat]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const title = t(resolveTitleKey(pathname));
  const timeLabel = clock.toLocaleString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleLogout = () => {
    setMenuOpen(false);
    authLogout();
    navigate('/');
    window.location.reload();
  };

  return (
    <HeaderWrapper>
      <Left>
        <MenuButton type="button" onClick={onMenuClick} aria-label={t("panel.openMenu")}><FiMenu /></MenuButton>
        <TitleBlock>
          <div className="crumb">{t("panel.consoleCrumb")}</div>
          <h1>{title}</h1>
        </TitleBlock>
      </Left>

      <RightSection>
        <LanguageSwitcher compact light />
        <SearchPill>
          <FiSearch size={14} />
          <span>{t("panel.search")}</span>
          <kbd>{timeLabel}</kbd>
        </SearchPill>
        {canLiveChat && (
          <IconButton
            type="button"
            aria-label="Live chat"
            title={chatUnread ? `${chatUnread} unread live chat` : 'Live chat'}
            onClick={() => navigate('/admin-panel/live-chat')}
          >
            <FiMessageSquare />
            {chatUnread > 0 && <Badge>{chatUnread > 9 ? '9+' : chatUnread}</Badge>}
          </IconButton>
        )}
        <NotificationBell variant="panel" />
        <UserChipWrap ref={menuRef}>
          <UserChip
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Avatar>{user ? `${user.firstName[0]}${user.lastName[0]}` : 'A'}</Avatar>
            <UserMeta>
              <div className="name">{user ? `${user.firstName} ${user.lastName}` : t("panel.admin")}</div>
              <div className="role">{isFullAdmin(user) ? t("panel.superAdmin") : t("panel.staff")}</div>
            </UserMeta>
            <ChipChevron $open={menuOpen} />
          </UserChip>
          {menuOpen && (
            <UserMenu role="menu">
              {canLiveChat && (
                <UserMenuItem
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/admin-panel/live-chat');
                  }}
                  style={{ color: adminColors.navy }}
                >
                  <FiMessageSquare size={15} />
                  Live chat{chatUnread > 0 ? ` (${chatUnread})` : ''}
                </UserMenuItem>
              )}
              <UserMenuItem type="button" role="menuitem" onClick={handleLogout}>
                <FiLogOut size={15} />
                {t("panel.logout")}
              </UserMenuItem>
            </UserMenu>
          )}
        </UserChipWrap>
      </RightSection>
    </HeaderWrapper>
  );
};

export default AdminHeader;
