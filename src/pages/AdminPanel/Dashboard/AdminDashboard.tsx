import React, { Suspense, useEffect, useState, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers, FiAward, FiVideo, FiInbox,
  FiTrendingUp, FiBook, FiDollarSign, FiActivity,
} from 'react-icons/fi';
import { fetchAdminDashboard, type DashboardPreviews } from '../../../services/adminEngagementService';
import { ShimmerBar } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, DashboardHero, StatsGrid, StatCard, StatIconBox, StatBody,
  StatValue, StatLabel, StatMeta, ErrorBanner,
} from '../../../components/AdminPanel/adminUi';
import AdminDashboardPreviews from '../../../components/AdminPanel/AdminDashboardPreviews';

const AdminDashboardCharts = lazy(() => import('../../../components/AdminPanel/AdminDashboardCharts'));

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [platform, setPlatform] = useState<any>(null);
  const [previews, setPreviews] = useState<DashboardPreviews | undefined>();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAdminDashboard();
        if (cancelled) return;
        setSummary(data.summary);
        setPlatform(data.platform);
        setPreviews(data.previews);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load dashboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const stats = summary && platform ? [
    { icon: FiUsers, label: 'Users', value: summary.totalUsers, meta: `+${platform.newUsers7d} this week`, color: '#3b82f6', path: '/admin-panel/users' },
    { icon: FiAward, label: 'Contests', value: platform.contestsTotal, meta: `${platform.contestParticipantsTotal} participants`, color: '#Fbbf24', path: '/admin-panel/contests' },
    { icon: FiTrendingUp, label: 'Signals', value: platform.signalsPublished, meta: 'published', color: '#10b981', path: '/admin-panel/signals' },
    { icon: FiVideo, label: 'Webinars', value: platform.webinarsTotal, meta: 'total', color: '#8b5cf6', path: '/admin-panel/webinars' },
    { icon: FiBook, label: 'Courses', value: platform.coursesPublished, meta: `${platform.brokersPublished} brokers`, color: '#6366f1', path: '/admin-panel/courses' },
    { icon: FiActivity, label: 'Activity 24h', value: summary.activity24h, meta: `${platform.activityLast7dTotal ?? '…'} / 7d`, color: '#0ea5e9', path: '/admin-panel/user-activity' },
    { icon: FiInbox, label: 'Open feedback', value: summary.newFeedbackOpen, meta: `${summary.newFeedback24h} today`, color: '#ec4899', path: '/admin-panel/feedback-inbox' },
    { icon: FiDollarSign, label: 'Rebates 30d', value: `$${platform.rebateUsd30d.toFixed(0)}`, meta: 'credited', color: '#059669', path: '/admin-panel/rebate-credits' },
  ] : [];

  return (
    <PageWrap>
      <DashboardHero>
        <div>
          <h1>Dashboard</h1>
          <p>Platform overview — stats, previews, and analytics</p>
        </div>
      </DashboardHero>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <StatsGrid>
        {(loading ? Array.from({ length: 8 }) : stats).map((stat: any, i) => (
          <StatCard
            key={stat?.label || i}
            type="button"
            disabled={loading}
            onClick={() => stat?.path && navigate(stat.path)}
          >
            <StatIconBox $color={stat?.color || '#e2e8f0'}>
              {stat?.icon ? <stat.icon /> : null}
            </StatIconBox>
            <StatBody>
              <StatValue>{loading ? <ShimmerBar $h="20px" $w="40px" /> : stat.value}</StatValue>
              <StatLabel>{loading ? '…' : stat.label}</StatLabel>
              {!loading && <StatMeta>{stat.meta}</StatMeta>}
            </StatBody>
          </StatCard>
        ))}
      </StatsGrid>

      <AdminDashboardPreviews previews={previews} loading={loading} />

      {!loading && (
        <Suspense fallback={null}>
          <AdminDashboardCharts />
        </Suspense>
      )}
    </PageWrap>
  );
};

export default AdminDashboard;
