import React, { Suspense, useEffect, useMemo, useState, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
  FiUsers, FiAward, FiVideo, FiInbox, FiTrendingUp, FiBook, FiDollarSign,
  FiActivity, FiArrowRight, FiShield, FiUserCheck, FiUserX, FiAlertCircle,
  FiZap, FiBarChart2, FiMail, FiClock, FiRefreshCw, FiBriefcase, FiLayers,
  FiUserPlus, FiShuffle,
} from 'react-icons/fi';
import {
  fetchAdminDashboard,
  type DashboardPreviews,
  type EngagementSummary,
  type PlatformMetrics,
} from '../../../services/adminEngagementService';
import { ShimmerBar } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, ErrorBanner, PrimaryButton, GhostButton, adminColors,
  SectionCard, SectionHead, SectionBody,
} from '../../../components/AdminPanel/adminUi';
import AdminDashboardPreviews from '../../../components/AdminPanel/AdminDashboardPreviews';

const AdminDashboardCharts = lazy(() => import('../../../components/AdminPanel/AdminDashboardCharts'));

const Hero = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.25rem;
  padding: 1.5rem 1.6rem;
  margin-bottom: 1.15rem;
  background:
    radial-gradient(ellipse 55% 100% at 100% -10%, rgba(251, 191, 36, 0.28) 0%, transparent 50%),
    radial-gradient(ellipse 40% 80% at 0% 100%, rgba(59, 130, 246, 0.15) 0%, transparent 45%),
    linear-gradient(128deg, #0a1830 0%, ${adminColors.navy} 48%, #1a4a7a 100%);
  border-radius: 18px;
  color: white;
  box-shadow: 0 14px 36px rgba(12, 31, 61, 0.3);
  position: relative;
  overflow: hidden;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const HeroMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const HeroChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.28rem 0.65rem;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.14);
  letter-spacing: 0.02em;
`;

const HeroTitle = styled.h1`
  margin: 0 0 0.4rem;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
`;

const HeroSub = styled.p`
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.88;
  max-width: 480px;
  line-height: 1.5;
`;

const HeroActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.65rem;
  position: relative;
  z-index: 1;

  @media (max-width: 800px) {
    align-items: flex-start;
  }
`;

const HeroKpiRow = styled.div`
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
  justify-content: flex-end;

  @media (max-width: 800px) {
    justify-content: flex-start;
  }
`;

const HeroKpi = styled.div`
  min-width: 88px;
  padding: 0.65rem 0.8rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  text-align: center;

  .v {
    font-size: 1.25rem;
    font-weight: 800;
    line-height: 1.1;
    color: ${adminColors.gold};
  }
  .l {
    margin-top: 0.2rem;
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    opacity: 0.75;
  }
`;

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin: 0 0 0.65rem;

  h2 {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${adminColors.muted};
  }
`;

const AlertGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.15rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const AlertCard = styled.button<{ $tone: 'warn' | 'info' | 'danger' | 'ok' }>`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.95rem 1.05rem;
  border-radius: 14px;
  border: 1px solid
    ${({ $tone }) =>
      $tone === 'warn' ? '#fde68a' : $tone === 'danger' ? '#fecaca' : $tone === 'ok' ? '#a7f3d0' : '#bfdbfe'};
  background:
    ${({ $tone }) =>
      $tone === 'warn'
        ? 'linear-gradient(135deg, #fffbeb, #fef3c7)'
        : $tone === 'danger'
          ? 'linear-gradient(135deg, #fef2f2, #fee2e2)'
          : $tone === 'ok'
            ? 'linear-gradient(135deg, #ecfdf5, #d1fae5)'
            : 'linear-gradient(135deg, #eff6ff, #dbeafe)'};
  cursor: pointer;
  text-align: left;
  transition: transform 0.12s, box-shadow 0.15s;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
  }

  .icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
    background: white;
    color: ${({ $tone }) =>
      $tone === 'warn' ? '#d97706' : $tone === 'danger' ? '#dc2626' : $tone === 'ok' ? '#059669' : '#2563eb'};
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  }

  .count {
    font-size: 1.35rem;
    font-weight: 800;
    color: ${adminColors.navy};
    line-height: 1.1;
  }
  .label {
    font-size: 0.8125rem;
    font-weight: 700;
    color: ${adminColors.navy};
  }
  .hint {
    font-size: 0.6875rem;
    color: ${adminColors.muted};
    margin-top: 0.1rem;
  }
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.15rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const KpiCard = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.05rem 1.1rem;
  background: white;
  border: 1px solid ${adminColors.border};
  border-radius: 16px;
  cursor: pointer;
  text-align: left;
  box-shadow: ${adminColors.shadow};
  overflow: hidden;
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${adminColors.gold}, transparent);
    opacity: 0.85;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${adminColors.shadowHover};
    border-color: #cbd5e1;
  }

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.05rem;
  }

  .arrow {
    color: #cbd5e1;
    font-size: 0.9rem;
  }

  .val {
    font-size: 1.55rem;
    font-weight: 800;
    color: ${adminColors.navy};
    letter-spacing: -0.03em;
    line-height: 1;
  }
  .lbl {
    margin-top: 0.35rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: ${adminColors.muted};
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .meta {
    margin-top: 0.45rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: ${adminColors.success};
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.65rem;
  margin-bottom: 1.15rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const DetailTile = styled.button`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.75rem 0.85rem;
  background: white;
  border: 1px solid ${adminColors.border};
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.12s, background 0.12s;

  &:hover {
    border-color: ${adminColors.navy};
    background: #f8fafc;
  }

  .icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95rem;
    flex-shrink: 0;
  }
  .val {
    font-size: 1rem;
    font-weight: 800;
    color: ${adminColors.navy};
    line-height: 1.1;
  }
  .lbl {
    font-size: 0.6875rem;
    font-weight: 600;
    color: ${adminColors.muted};
  }
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(300px, 1fr);
  gap: 0.9rem;
  margin-bottom: 1.15rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  min-width: 0;
`;

const HealthCard = styled(SectionCard)`
  margin-bottom: 0;
`;

const ProgressRow = styled.div`
  margin-bottom: 0.8rem;
  &:last-child { margin-bottom: 0; }

  .head {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.3rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: ${adminColors.navy};
  }
  .head span {
    color: ${adminColors.muted};
    font-weight: 600;
  }
`;

const BarTrack = styled.div`
  height: 8px;
  border-radius: 999px;
  background: #f1f5f9;
  overflow: hidden;
`;

const BarFill = styled.div<{ $w: number; $color: string }>`
  height: 100%;
  width: ${({ $w }) => Math.min(100, Math.max(0, $w))}%;
  background: ${({ $color }) => $color};
  border-radius: 999px;
  transition: width 0.4s ease;
`;

const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
  margin-bottom: 1.15rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const QuickBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.75rem 0.85rem;
  background: white;
  border: 1px solid ${adminColors.border};
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  box-shadow: ${adminColors.shadow};
  transition: all 0.15s;

  &:hover {
    border-color: ${adminColors.gold};
    background: #fffbeb;
    transform: translateY(-1px);
  }

  .ic {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    background: linear-gradient(145deg, ${adminColors.navy}, ${adminColors.navyLight});
    color: ${adminColors.gold};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .t {
    font-size: 0.75rem;
    font-weight: 700;
    color: ${adminColors.navy};
  }
  .s {
    font-size: 0.625rem;
    color: ${adminColors.muted};
    font-weight: 600;
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const RefreshBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 9px;
  padding: 0.42rem 0.7rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;

  &:disabled svg {
    animation: ${spin} 0.8s linear infinite;
  }

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.16);
  }
`;

const insightTone = (n: number, warnAt = 1): 'warn' | 'ok' | 'info' =>
  n >= warnAt ? 'warn' : 'ok';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<EngagementSummary | null>(null);
  const [platform, setPlatform] = useState<Partial<PlatformMetrics> | null>(null);
  const [previews, setPreviews] = useState<DashboardPreviews | undefined>();
  const [now, setNow] = useState(() => new Date());

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdminDashboard();
      setSummary(data.summary);
      setPlatform(data.platform);
      setPreviews(data.previews);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const greeting = useMemo(() => {
    const h = now.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }, [now]);

  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const n = (v?: number) => (typeof v === 'number' ? v : 0);
  const totalUsers = n(summary?.totalUsers);
  const kycPending = n(platform?.kycPending);
  const kycApproved = n(platform?.kycApproved);
  const kycRejected = n(platform?.kycRejected);
  const kycIncomplete = n(platform?.kycIncomplete);
  const kycTotal = Math.max(1, kycPending + kycApproved + kycRejected + kycIncomplete);

  const primaryKpis = !loading && summary && platform
    ? [
        {
          icon: FiUsers,
          label: 'Total users',
          value: totalUsers,
          meta: `+${n(platform.newUsers7d)} this week · ${n(platform.newUsers24h)} today`,
          color: '#dbeafe',
          ink: '#2563eb',
          path: '/admin-panel/users',
        },
        {
          icon: FiActivity,
          label: 'Activity (24h)',
          value: summary.activity24h,
          meta: `${n(platform.activityLast7dTotal)} events over 7 days`,
          color: '#e0f2fe',
          ink: '#0284c7',
          path: '/admin-panel/user-activity',
        },
        {
          icon: FiShield,
          label: 'Pending KYC',
          value: kycPending,
          meta: `${kycApproved} verified · ${kycRejected} rejected`,
          color: '#fef3c7',
          ink: '#d97706',
          path: '/admin-panel/kyc-records?filter=pending',
        },
        {
          icon: FiDollarSign,
          label: 'Rebates (30d)',
          value: `$${n(platform.rebateUsd30d).toFixed(0)}`,
          meta: `${n(platform.rebateCredits30dCount)} credits · $${n(platform.rebateUsdAllTime).toFixed(0)} all-time`,
          color: '#d1fae5',
          ink: '#059669',
          path: '/admin-panel/rebate-credits',
        },
        {
          icon: FiUserPlus,
          label: 'Friend invites',
          value: n(platform.referralInvitesTotal),
          meta: `${n(platform.referralInvites24h)} today · ${n(platform.referralInvites7d)} this week`,
          color: '#e0e7ff',
          ink: '#4338ca',
          path: '/admin-panel/referrals',
        },
      ]
    : [];

  const detailTiles = !loading && summary && platform
    ? [
        { icon: FiUserCheck, label: 'Active users', value: n(platform.activeUsers), color: '#d1fae5', ink: '#059669', path: '/admin-panel/users' },
        { icon: FiUserX, label: 'Blocked', value: n(platform.blockedUsers), color: '#fee2e2', ink: '#dc2626', path: '/admin-panel/users' },
        { icon: FiAward, label: 'Contests', value: n(platform.contestsTotal), color: '#fef3c7', ink: '#d97706', path: '/admin-panel/contests' },
        { icon: FiZap, label: 'Ongoing contests', value: n(platform.contestsOngoing), color: '#fff7ed', ink: '#ea580c', path: '/admin-panel/contests' },
        { icon: FiTrendingUp, label: 'Signals published', value: n(platform.signalsPublished), color: '#dcfce7', ink: '#16a34a', path: '/admin-panel/signals' },
        { icon: FiVideo, label: 'Webinars', value: n(platform.webinarsTotal), color: '#ede9fe', ink: '#7c3aed', path: '/admin-panel/webinars' },
        { icon: FiBook, label: 'Courses', value: n(platform.coursesPublished), color: '#e0e7ff', ink: '#4f46e5', path: '/admin-panel/courses' },
        { icon: FiBriefcase, label: 'Brokers', value: n(platform.brokersPublished), color: '#cffafe', ink: '#0891b2', path: '/admin-panel/brokers' },
        { icon: FiInbox, label: 'Open feedback', value: summary.newFeedbackOpen, color: '#fce7f3', ink: '#db2777', path: '/admin-panel/feedback-inbox' },
        { icon: FiMail, label: 'Feedback total', value: n(platform.feedbackTotal), color: '#fbcfe8', ink: '#be185d', path: '/admin-panel/feedback-inbox' },
        { icon: FiUserPlus, label: 'Invites (7d)', value: n(platform.referralInvites7d), color: '#e0e7ff', ink: '#4338ca', path: '/admin-panel/referrals' },
        { icon: FiShuffle, label: 'IB change open', value: n(platform.ibChangeOpen), color: '#ccfbf1', ink: '#0f766e', path: '/admin-panel/ib-change' },
        { icon: FiBarChart2, label: '7d activity', value: n(platform.activityLast7dTotal), color: '#ecfccb', ink: '#65a30d', path: '/admin-panel/user-activity' },
      ]
    : [];

  const quickLinks = [
    { icon: FiUsers, title: 'Users', sub: 'Search & manage', path: '/admin-panel/users' },
    { icon: FiShield, title: 'KYC review', sub: 'Approve documents', path: '/admin-panel/kyc-records?filter=pending' },
    { icon: FiMail, title: 'Bulk email', sub: 'Message members', path: '/admin-panel/users/bulk-email' },
    { icon: FiUserPlus, title: 'Referrals', sub: 'Invite progress', path: '/admin-panel/referrals' },
    { icon: FiShuffle, title: 'IB change', sub: 'Broker requests', path: '/admin-panel/ib-change' },
    { icon: FiTrendingUp, title: 'Signals', sub: 'Publish setups', path: '/admin-panel/signals' },
    { icon: FiAward, title: 'Contests', sub: 'Manage events', path: '/admin-panel/contests' },
    { icon: FiDollarSign, title: 'Rebates', sub: 'Grant credits', path: '/admin-panel/rebate-credits' },
  ];

  return (
    <PageWrap>
      <Hero>
        <div>
          <HeroMeta>
            <HeroChip><FiClock /> {dateLabel}</HeroChip>
            <HeroChip><FiActivity /> Live admin overview</HeroChip>
          </HeroMeta>
          <HeroTitle>{greeting}, Admin</HeroTitle>
          <HeroSub>
            Full platform pulse — users, verification, content, engagement, and rebates in one place.
            Jump into anything that needs attention below.
          </HeroSub>
        </div>
        <HeroActions>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <PrimaryButton
              type="button"
              $sm
              onClick={() => navigate('/admin-panel/users')}
              style={{ background: adminColors.gold, color: adminColors.navy, boxShadow: 'none' }}
            >
              Manage users <FiArrowRight />
            </PrimaryButton>
            <GhostButton
              type="button"
              $sm
              onClick={() => navigate('/admin-panel/kyc-records?filter=pending')}
              style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.25)', color: 'white' }}
            >
              Review KYC
            </GhostButton>
            <RefreshBtn type="button" disabled={loading} onClick={load} title="Refresh">
              <FiRefreshCw /> {loading ? 'Refreshing' : 'Refresh'}
            </RefreshBtn>
          </div>
          <HeroKpiRow>
            <HeroKpi>
              <div className="v">{loading ? '…' : totalUsers}</div>
              <div className="l">Users</div>
            </HeroKpi>
            <HeroKpi>
              <div className="v">{loading ? '…' : n(summary?.activity24h)}</div>
              <div className="l">24h events</div>
            </HeroKpi>
            <HeroKpi>
              <div className="v">{loading ? '…' : kycPending}</div>
              <div className="l">KYC queue</div>
            </HeroKpi>
            <HeroKpi>
              <div className="v">{loading ? '…' : `$${n(platform?.rebateUsd30d).toFixed(0)}`}</div>
              <div className="l">Rebates 30d</div>
            </HeroKpi>
          </HeroKpiRow>
        </HeroActions>
      </Hero>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <SectionLabel><h2>Needs attention</h2></SectionLabel>
      <AlertGrid>
        <AlertCard
          type="button"
          $tone={loading ? 'info' : insightTone(kycPending)}
          onClick={() => navigate('/admin-panel/kyc-records?filter=pending')}
        >
          <div className="icon"><FiShield /></div>
          <div>
            <div className="count">{loading ? '…' : kycPending}</div>
            <div className="label">KYC awaiting review</div>
            <div className="hint">{loading ? 'Loading…' : kycPending ? 'Open queue and approve or reject' : 'Queue is clear'}</div>
          </div>
        </AlertCard>
        <AlertCard
          type="button"
          $tone={loading ? 'info' : insightTone(n(summary?.newFeedbackOpen))}
          onClick={() => navigate('/admin-panel/feedback-inbox')}
        >
          <div className="icon"><FiInbox /></div>
          <div>
            <div className="count">{loading ? '…' : n(summary?.newFeedbackOpen)}</div>
            <div className="label">Unread feedback</div>
            <div className="hint">
              {loading
                ? 'Loading…'
                : `${n(summary?.newFeedback24h)} new today · ${n(summary?.newFeedbackWeek)} this week`}
            </div>
          </div>
        </AlertCard>
        <AlertCard
          type="button"
          $tone={loading ? 'info' : n(platform?.blockedUsers) > 0 ? 'danger' : 'ok'}
          onClick={() => navigate('/admin-panel/users')}
        >
          <div className="icon"><FiAlertCircle /></div>
          <div>
            <div className="count">{loading ? '…' : n(platform?.blockedUsers)}</div>
            <div className="label">Blocked accounts</div>
            <div className="hint">
              {loading ? 'Loading…' : `${n(platform?.activeUsers)} active · ${n(platform?.newUsers24h)} signups today`}
            </div>
          </div>
        </AlertCard>
      </AlertGrid>

      <SectionLabel><h2>Key performance</h2></SectionLabel>
      <KpiGrid>
        {(loading ? Array.from({ length: 5 }) : primaryKpis).map((kpi: any, i) => (
          <KpiCard
            key={kpi?.label || i}
            type="button"
            disabled={loading}
            onClick={() => kpi?.path && navigate(kpi.path)}
          >
            <div className="top">
              <div className="icon" style={{ background: kpi?.color || '#f1f5f9', color: kpi?.ink || '#94a3b8' }}>
                {kpi?.icon ? <kpi.icon /> : null}
              </div>
              <FiArrowRight className="arrow" />
            </div>
            <div>
              <div className="val">{loading ? <ShimmerBar $h="28px" $w="48%" /> : kpi.value}</div>
              <div className="lbl">{loading ? '…' : kpi.label}</div>
              {!loading && <div className="meta">{kpi.meta}</div>}
            </div>
          </KpiCard>
        ))}
      </KpiGrid>

      <SectionLabel><h2>Platform inventory</h2></SectionLabel>
      <DetailGrid>
        {(loading ? Array.from({ length: 12 }) : detailTiles).map((t: any, i) => (
          <DetailTile
            key={t?.label || i}
            type="button"
            disabled={loading}
            onClick={() => t?.path && navigate(t.path)}
          >
            <div className="icon" style={{ background: t?.color || '#f1f5f9', color: t?.ink || '#94a3b8' }}>
              {t?.icon ? <t.icon /> : null}
            </div>
            <div>
              <div className="val">{loading ? <ShimmerBar $h="16px" $w="36px" /> : t.value}</div>
              <div className="lbl">{loading ? '…' : t.label}</div>
            </div>
          </DetailTile>
        ))}
      </DetailGrid>

      <MainLayout>
        <Stack>
          {!loading && (
            <Suspense
              fallback={
                <SectionCard style={{ marginBottom: 0, minHeight: 280 }}>
                  <SectionHead><h2>Analytics</h2></SectionHead>
                  <SectionBody><ShimmerBar $h="220px" $w="100%" /></SectionBody>
                </SectionCard>
              }
            >
              <AdminDashboardCharts />
            </Suspense>
          )}
          {loading && (
            <SectionCard style={{ marginBottom: 0, minHeight: 280 }}>
              <SectionHead><h2>Analytics</h2></SectionHead>
              <SectionBody><ShimmerBar $h="220px" $w="100%" /></SectionBody>
            </SectionCard>
          )}
        </Stack>

        <Stack>
          <HealthCard>
            <SectionHead>
              <h2>Verification health</h2>
              <GhostButton $sm type="button" onClick={() => navigate('/admin-panel/kyc-records')}>
                All records
              </GhostButton>
            </SectionHead>
            <SectionBody>
              {loading ? (
                <ShimmerBar $h="120px" $w="100%" />
              ) : (
                <>
                  <ProgressRow>
                    <div className="head">
                      <div>Verified</div>
                      <span>{kycApproved} · {Math.round((kycApproved / kycTotal) * 100)}%</span>
                    </div>
                    <BarTrack><BarFill $w={(kycApproved / kycTotal) * 100} $color="#10b981" /></BarTrack>
                  </ProgressRow>
                  <ProgressRow>
                    <div className="head">
                      <div>Pending review</div>
                      <span>{kycPending} · {Math.round((kycPending / kycTotal) * 100)}%</span>
                    </div>
                    <BarTrack><BarFill $w={(kycPending / kycTotal) * 100} $color="#f59e0b" /></BarTrack>
                  </ProgressRow>
                  <ProgressRow>
                    <div className="head">
                      <div>Not started</div>
                      <span>{kycIncomplete} · {Math.round((kycIncomplete / kycTotal) * 100)}%</span>
                    </div>
                    <BarTrack><BarFill $w={(kycIncomplete / kycTotal) * 100} $color="#94a3b8" /></BarTrack>
                  </ProgressRow>
                  <ProgressRow>
                    <div className="head">
                      <div>Rejected</div>
                      <span>{kycRejected} · {Math.round((kycRejected / kycTotal) * 100)}%</span>
                    </div>
                    <BarTrack><BarFill $w={(kycRejected / kycTotal) * 100} $color="#ef4444" /></BarTrack>
                  </ProgressRow>
                </>
              )}
            </SectionBody>
          </HealthCard>

          <HealthCard>
            <SectionHead>
              <h2>Engagement snapshot</h2>
              <GhostButton $sm type="button" onClick={() => navigate('/admin-panel/reports')}>
                Full reports
              </GhostButton>
            </SectionHead>
            <SectionBody>
              {loading ? (
                <ShimmerBar $h="100px" $w="100%" />
              ) : (
                <div style={{ display: 'grid', gap: '0.15rem' }}>
                  {[
                    { label: 'User growth (7d)', value: `+${n(platform?.newUsers7d)}`, hint: `${n(platform?.newUsers24h)} in last 24h` },
                    { label: 'Activity (7d)', value: n(platform?.activityLast7dTotal), hint: `${n(summary?.activity24h)} today` },
                    { label: 'Contest participation', value: n(platform?.contestParticipantsTotal), hint: `${n(platform?.contestsOngoing)} contests live` },
                    { label: 'Feedback this week', value: n(summary?.newFeedbackWeek), hint: `${n(summary?.newFeedbackOpen)} still open` },
                    { label: 'Rebate volume (30d)', value: `$${n(platform?.rebateUsd30d).toFixed(2)}`, hint: `${n(platform?.rebateCredits30dCount)} ledger rows` },
                  ].map((row) => (
                    <div
                      key={row.label}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        padding: '0.55rem 0',
                        borderBottom: '1px solid #f1f5f9',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: adminColors.navy }}>{row.label}</div>
                        <div style={{ fontSize: '0.6875rem', color: adminColors.muted, marginTop: 2 }}>{row.hint}</div>
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: adminColors.navy, whiteSpace: 'nowrap' }}>
                        {row.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionBody>
          </HealthCard>
        </Stack>
      </MainLayout>

      <SectionLabel><h2>Quick actions</h2></SectionLabel>
      <QuickGrid>
        {quickLinks.map((q) => (
          <QuickBtn key={q.path} type="button" onClick={() => navigate(q.path)}>
            <div className="ic"><q.icon /></div>
            <div>
              <div className="t">{q.title}</div>
              <div className="s">{q.sub}</div>
            </div>
          </QuickBtn>
        ))}
      </QuickGrid>

      <SectionLabel><h2>Live feeds</h2></SectionLabel>
      <AdminDashboardPreviews previews={previews} loading={loading} />
    </PageWrap>
  );
};

export default AdminDashboard;
