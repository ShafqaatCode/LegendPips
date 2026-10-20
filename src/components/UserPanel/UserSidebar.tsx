import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getMyKyc, type KycStatus } from '../../services/kycService';
import { useLocale } from '../../contexts/LocaleContext';
import { useSiteLogo } from '../../contexts/SiteConfigContext';
import { isImpersonating, restoreAdminSession } from '../../services/authService';
import {
  FiHome, FiUser, FiAward, FiTrendingUp, FiVideo, FiBook, FiFileText,
  FiMessageSquare, FiSettings, FiLogOut, FiBarChart2, FiCalendar, FiX, FiBell,
  FiDollarSign, FiGlobe, FiShield, FiUserPlus, FiShuffle, FiLink, FiStar, FiAlertTriangle, FiUsers, FiShare2,
  FiMessageCircle, FiLifeBuoy, FiGift, FiSearch, FiChevronDown,
} from 'react-icons/fi';

type NavItem = {
  to: string;
  label: string;
  icon: React.ElementType;
  end?: boolean;
  badge?: string;
};

type NavGroup = {
  id: string;
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
};

const SidebarWrapper = styled.aside<{ $isOpen: boolean }>`
  position: fixed;
  left: 0;
  html[dir='rtl'] & {
    left: auto;
    right: 0;
    border-right: none;
    border-left: 1px solid rgba(255, 255, 255, 0.06);
  }
  top: 0;
  width: 268px;
  height: 100vh;
  background:
    radial-gradient(ellipse 80% 35% at 0% 0%, rgba(251, 193, 19, 0.16) 0%, transparent 55%),
    linear-gradient(185deg, #0a1830 0%, #132e58 52%, #0d2244 100%);
  color: white;
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease;
  box-shadow: 8px 0 32px rgba(8, 20, 40, 0.22);
  border-right: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
    html[dir='rtl'] & {
      transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '100%')});
    }
  }
`;

const SidebarHeader = styled.div`
  padding: 0.95rem 1rem 0.85rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  min-width: 0;

  img {
    display: block;
    height: 36px;
    width: auto;
    max-width: 148px;
    object-fit: contain;
  }
`;

const CloseButton = styled.button`
  display: none;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.35rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const UserProfile = styled.div`
  margin: 0 0.85rem 0.75rem;
  padding: 0.75rem 0.8rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;

const Avatar = styled.div<{ $image?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${({ $image }) =>
    $image
      ? `url(${$image}) center/cover no-repeat`
      : 'linear-gradient(135deg, #fbc113 0%, #f59e0b 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
  color: #132e58;
  flex-shrink: 0;
`;

const ProfileText = styled.div`
  min-width: 0;

  h3 {
    font-size: 0.84rem;
    font-weight: 700;
    margin: 0 0 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    font-size: 0.68rem;
    color: rgba(255, 255, 255, 0.55);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const SearchWrap = styled.div`
  position: relative;
  margin: 0 0.85rem 0.65rem;

  svg {
    position: absolute;
    left: 0.7rem;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.85rem;
    pointer-events: none;
  }

  input {
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.22);
    color: #fff;
    border-radius: 11px;
    padding: 0.55rem 0.7rem 0.55rem 2rem;
    font-size: 0.78rem;
    font-family: inherit;
    outline: none;

    &::placeholder {
      color: rgba(255, 255, 255, 0.38);
    }

    &:focus {
      border-color: rgba(251, 193, 19, 0.45);
      background: rgba(0, 0, 0, 0.3);
    }
  }
`;

const NavScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 0.5rem;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.18);
    border-radius: 2px;
  }
`;

const PrimaryBlock = styled.div`
  padding: 0.15rem 0 0.35rem;
`;

const Group = styled.div`
  margin-top: 0.2rem;
`;

const GroupToggle = styled.button`
  width: calc(100% - 1.1rem);
  margin: 0.15rem 0.55rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.45rem 0.65rem;
  border: none;
  border-radius: 9px;
  background: transparent;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  font-family: inherit;
  cursor: pointer;

  &:hover {
    color: rgba(255, 255, 255, 0.7);
    background: rgba(255, 255, 255, 0.04);
  }

  svg {
    transition: transform 0.18s ease;
  }
`;

const GroupBody = styled.div<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? 'block' : 'none')};
`;

const NavLinkStyled = styled(NavLink)<{ $featured?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.58rem 0.8rem;
  margin: 2px 0.55rem;
  border-radius: 11px;
  color: rgba(255, 255, 255, 0.78);
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 500;
  transition: background 0.15s, color 0.15s, box-shadow 0.15s;
  background: ${({ $featured }) =>
    $featured ? 'linear-gradient(90deg, rgba(251, 193, 19, 0.16), rgba(251, 193, 19, 0.04))' : 'transparent'};

  svg {
    font-size: 1rem;
    flex-shrink: 0;
    opacity: 0.92;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  &.active {
    background: linear-gradient(90deg, rgba(251, 193, 19, 0.28) 0%, rgba(251, 193, 19, 0.08) 100%);
    color: #fbc113;
    font-weight: 700;
    box-shadow: inset 3px 0 0 #fbc113;
  }
`;

const NavBadge = styled.span<{ $variant?: string }>`
  margin-left: auto;
  font-size: 0.55rem;
  font-weight: 700;
  padding: 0.15rem 0.4rem;
  border-radius: 999px;
  text-transform: uppercase;
  background: ${({ $variant }) =>
    $variant === 'pending'
      ? 'rgba(251,191,36,0.25)'
      : $variant === 'rejected'
        ? 'rgba(239,68,68,0.25)'
        : $variant === 'approved'
          ? 'rgba(16,185,129,0.25)'
          : 'rgba(255,255,255,0.12)'};
  color: ${({ $variant }) =>
    $variant === 'pending'
      ? '#fde68a'
      : $variant === 'rejected'
        ? '#fca5a5'
        : $variant === 'approved'
          ? '#6ee7b7'
          : 'rgba(255,255,255,0.6)'};
`;

const EmptySearch = styled.p`
  margin: 0.75rem 1rem;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.45);
  text-align: center;
`;

const Footer = styled.div`
  flex-shrink: 0;
  padding: 0.55rem 0.5rem 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: calc(100% - 1rem);
  margin: 0.25rem 0.5rem 0;
  padding: 0.62rem 0.75rem;
  border: 1px solid rgba(239, 68, 68, 0.28);
  border-radius: 11px;
  background: rgba(239, 68, 68, 0.12);
  color: #fca5a5;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  text-align: left;
  font-family: inherit;

  &:hover {
    background: rgba(239, 68, 68, 0.22);
    color: #fecaca;
  }
`;

interface UserSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();
  const { t } = useLocale();
  const { src: logoSrc, alt: logoAlt, height: logoHeight, maxWidth: logoMaxWidth } = useSiteLogo();
  const [kycStatus, setKycStatus] = useState<KycStatus | undefined>(
    user?.kycStatus as KycStatus | undefined
  );
  const [query, setQuery] = useState('');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    trading: true,
    earn: true,
    learn: false,
    support: false,
    account: false,
  });

  useEffect(() => {
    getMyKyc()
      .then((data) => setKycStatus(data.kycStatus))
      .catch(() => undefined);
  }, []);

  const kycBadge = kycStatus && kycStatus !== 'incomplete' ? kycStatus : undefined;

  const primary: NavItem[] = [
    { to: '/user-panel', label: t('panel.dashboard'), icon: FiHome, end: true },
    { to: '/user-panel/live-accounts', label: t('panel.liveAccounts'), icon: FiLink },
    { to: '/user-panel/rebates', label: t('panel.rebates'), icon: FiDollarSign },
    { to: '/user-panel/signals', label: t('panel.signals'), icon: FiTrendingUp },
    { to: '/user-panel/verification', label: t('panel.verification'), icon: FiShield, badge: kycBadge },
    { to: '/user-panel/alerts', label: t('panel.alerts'), icon: FiBell },
  ];

  const groups: NavGroup[] = [
    {
      id: 'trading',
      title: 'Trading',
      defaultOpen: true,
      items: [
        { to: '/user-panel/strategies', label: t('panel.strategies'), icon: FiBarChart2 },
        { to: '/user-panel/contests', label: t('panel.contests'), icon: FiAward },
        { to: '/user-panel/trader-profile', label: t('panel.traderProfile'), icon: FiUsers },
        { to: '/user-panel/copy-trading', label: t('panel.copyTrading'), icon: FiShare2 },
        { to: '/user-panel/ib-change', label: t('panel.ibChange'), icon: FiShuffle },
      ],
    },
    {
      id: 'earn',
      title: 'Rewards',
      defaultOpen: true,
      items: [
        { to: '/user-panel/rewards', label: 'Rewards & streak', icon: FiStar },
        { to: '/rewards', label: 'Public rewards', icon: FiGift },
        { to: '/leaderboard', label: 'Leaderboard', icon: FiBarChart2 },
        { to: '/streaks', label: 'Public streaks', icon: FiGlobe },
        { to: '/user-panel/invite', label: t('panel.invite'), icon: FiUserPlus },
      ],
    },
    {
      id: 'learn',
      title: 'Learn',
      items: [
        { to: '/user-panel/calendar', label: t('panel.calendar'), icon: FiCalendar },
        { to: '/user-panel/courses', label: t('panel.courses'), icon: FiBook },
        { to: '/user-panel/webinars', label: t('panel.webinars'), icon: FiVideo },
        { to: '/user-panel/trading-videos', label: t('panel.videos'), icon: FiVideo },
        { to: '/user-panel/analysis', label: t('panel.analysis'), icon: FiFileText },
      ],
    },
    {
      id: 'support',
      title: 'Support',
      items: [
        { to: '/live-chat', label: 'Live chat', icon: FiMessageCircle },
        { to: '/user-panel/tickets', label: t('panel.tickets'), icon: FiLifeBuoy },
        { to: '/user-panel/forum', label: t('panel.forum'), icon: FiMessageSquare },
        { to: '/user-panel/broker-reviews', label: t('panel.reviews'), icon: FiStar },
        { to: '/user-panel/complaints', label: t('panel.complaints'), icon: FiAlertTriangle },
        { to: '/user-panel/activity', label: t('panel.activity'), icon: FiBarChart2 },
      ],
    },
    {
      id: 'account',
      title: 'Account',
      items: [
        { to: '/user-panel/profile', label: t('panel.profile'), icon: FiUser },
        { to: '/user-panel/settings', label: t('panel.settings'), icon: FiSettings },
      ],
    },
  ];

  const q = query.trim().toLowerCase();

  const filteredPrimary = useMemo(
    () => (q ? primary.filter((i) => i.label.toLowerCase().includes(q)) : primary),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q, kycBadge, t]
  );

  const filteredGroups = useMemo(() => {
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((i) => i.label.toLowerCase().includes(q)),
      }))
      .filter((g) => g.items.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, t]);

  const closeOnMobile = () => {
    if (window.innerWidth <= 992) onToggle();
  };

  const renderLink = (item: NavItem, featured?: boolean) => (
    <NavLinkStyled
      key={item.to}
      to={item.to}
      end={item.end}
      $featured={featured}
      onClick={closeOnMobile}
    >
      {React.createElement(item.icon)}
      <span>{item.label}</span>
      {item.badge && (
        <NavBadge $variant={item.badge}>
          {item.badge === 'approved' ? '✓' : item.badge.slice(0, 4)}
        </NavBadge>
      )}
    </NavLinkStyled>
  );

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const hasResults = filteredPrimary.length > 0 || filteredGroups.some((g) => g.items.length > 0);

  return (
    <SidebarWrapper $isOpen={isOpen}>
      <SidebarHeader>
        <Logo to="/" aria-label={logoAlt}>
          <img
            src={logoSrc}
            alt={logoAlt}
            style={{
              height: Math.min(40, Math.max(28, logoHeight)),
              maxWidth: Math.min(160, logoMaxWidth),
            }}
          />
        </Logo>
        <CloseButton onClick={onToggle} type="button" aria-label="Close menu">
          <FiX />
        </CloseButton>
      </SidebarHeader>

      <UserProfile>
        <Avatar $image={user?.profileImage}>
          {!user?.profileImage && (user ? `${user.firstName[0]}${user.lastName[0]}` : 'U')}
        </Avatar>
        <ProfileText>
          <h3>{user ? `${user.firstName} ${user.lastName}` : t('panel.userFallback')}</h3>
          <p>{user?.email || ''}</p>
        </ProfileText>
      </UserProfile>

      <SearchWrap>
        <FiSearch aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search menu…"
          aria-label="Search menu"
        />
      </SearchWrap>

      <NavScroll>
        {!hasResults && <EmptySearch>No matches for “{query}”</EmptySearch>}

        {filteredPrimary.length > 0 && (
          <PrimaryBlock>
            {filteredPrimary.map((item) =>
              renderLink(item, item.to === '/user-panel/live-accounts')
            )}
          </PrimaryBlock>
        )}

        {filteredGroups.map((group) => {
          const open = Boolean(q) || openGroups[group.id];
          return (
            <Group key={group.id}>
              <GroupToggle
                type="button"
                onClick={() => toggleGroup(group.id)}
                aria-expanded={open}
              >
                <span>{group.title}</span>
                <FiChevronDown
                  style={{ transform: open ? 'rotate(180deg)' : 'none' }}
                  aria-hidden
                />
              </GroupToggle>
              <GroupBody $open={open}>{group.items.map((item) => renderLink(item))}</GroupBody>
            </Group>
          );
        })}
      </NavScroll>

      <Footer>
        {renderLink({ to: '/', label: t('panel.homepage'), icon: FiGlobe, end: true })}
        <LogoutButton
          type="button"
          onClick={() => {
            if (isImpersonating()) {
              if (restoreAdminSession()) {
                window.location.href = '/admin-panel';
                return;
              }
            }
            authLogout();
            navigate('/');
            window.location.reload();
          }}
        >
          {isImpersonating() ? (
            <>
              <FiShield />
              <span>Return to admin</span>
            </>
          ) : (
            <>
              <FiLogOut />
              <span>{t('panel.logout')}</span>
            </>
          )}
        </LogoutButton>
      </Footer>
    </SidebarWrapper>
  );
};

export default UserSidebar;
