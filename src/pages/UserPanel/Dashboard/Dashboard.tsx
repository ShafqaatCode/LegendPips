import React, { useEffect, useState } from 'react';
import {
  FiTrendingUp, FiAward, FiVideo, FiBook, FiUsers, FiDollarSign, FiChevronRight,
  FiUserPlus, FiShield, FiShuffle, FiSettings,
} from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchMyDashboard, type DashboardStat } from '../../../services/userInsightService';
import { getMyKyc, KYC_STATUS_LABELS, type KycStatus } from '../../../services/kycService';
import { ShimmerBar } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, DashboardHero, StatsGrid, StatCard, StatIconBox, StatBody,
  StatValue, StatLabel, StatMeta, HintBar, ErrorBanner, KycStrip, Pill, GhostNavLink,
  QuickLinksGrid, QuickLinkCard, SectionLabel,
} from '../../../components/UserPanel/userUi';

const iconByKey: Record<string, React.ElementType> = {
  contests: FiAward,
  signals: FiTrendingUp,
  webinars: FiVideo,
  courses: FiBook,
  forum: FiUsers,
  rebates: FiDollarSign,
};

const kycHint: Record<KycStatus, string> = {
  incomplete: 'Complete verification to unlock full platform access.',
  pending: 'Your documents are under review — we\'ll update you soon.',
  approved: 'Your identity is verified. Full access is enabled.',
  rejected: 'Verification was declined. Review feedback and resubmit.',
};

const quickLinks = [
  { to: '/user-panel/rebates', title: 'My Rebates', desc: 'Cashback & credits', icon: FiDollarSign },
  { to: '/user-panel/invite', title: 'Invite friends', desc: 'Earn referral rewards', icon: FiUserPlus },
  { to: '/user-panel/verification', title: 'Verification', desc: 'KYC status', icon: FiShield },
  { to: '/user-panel/ib-change', title: 'IB change', desc: 'Broker / IB help', icon: FiShuffle },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [activitySummary, setActivitySummary] = useState<{
    thisMonth: number;
    changeText: string;
    positive: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState<KycStatus>('incomplete');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [data, kyc] = await Promise.all([fetchMyDashboard(), getMyKyc().catch(() => null)]);
        if (cancelled) return;
        setStats(data.stats || []);
        setActivitySummary(data.activitySummary || null);
        if (kyc) setKycStatus(kyc.kycStatus);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load dashboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <PageWrap>
      <DashboardHero>
        <div>
          <h1>Welcome back, {user?.firstName || 'User'}</h1>
          <p>Track contests, rebates, signals, and verification — all in one place.</p>
        </div>
        <Pill $variant={kycStatus}>{KYC_STATUS_LABELS[kycStatus]}</Pill>
      </DashboardHero>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <KycStrip $variant={kycStatus}>
        <div>
          <div className="label">Identity Verification</div>
          <div className="desc">{kycHint[kycStatus]}</div>
        </div>
        <GhostNavLink to="/user-panel/verification">
          {kycStatus === 'approved' ? 'View status' : 'Manage verification'}
          <FiChevronRight />
        </GhostNavLink>
      </KycStrip>

      {activitySummary && !loading && (
        <HintBar>
          <strong>Activity this month:</strong> {activitySummary.thisMonth} events
          <span style={{ color: activitySummary.positive ? '#059669' : '#dc2626', marginLeft: 6, fontWeight: 600 }}>
            ({activitySummary.changeText} vs last month)
          </span>
        </HintBar>
      )}

      <SectionLabel>Overview</SectionLabel>
      <StatsGrid>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <StatCard key={i}>
                <StatIconBox $color="#e2e8f0"><FiAward /></StatIconBox>
                <StatBody>
                  <StatValue><ShimmerBar $h="18px" $w="40px" /></StatValue>
                  <StatLabel><ShimmerBar $h="10px" $w="70px" /></StatLabel>
                </StatBody>
              </StatCard>
            ))
          : stats.map((stat) => {
              const Icon = iconByKey[stat.key] || FiTrendingUp;
              return (
                <StatCard key={stat.key}>
                  <StatIconBox $color={stat.color}><Icon /></StatIconBox>
                  <StatBody>
                    <StatValue>{stat.value}</StatValue>
                    <StatLabel>{stat.label}</StatLabel>
                    <StatMeta $positive={stat.positive}>{stat.changeText} this month</StatMeta>
                  </StatBody>
                </StatCard>
              );
            })}
      </StatsGrid>

      <SectionLabel>Quick actions</SectionLabel>
      <QuickLinksGrid>
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <QuickLinkCard key={item.to} to={item.to}>
              <span className="icon"><Icon /></span>
              <span className="title">{item.title}</span>
              <span className="desc">{item.desc}</span>
            </QuickLinkCard>
          );
        })}
      </QuickLinksGrid>

      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
        <GhostNavLink to="/user-panel/settings">
          <FiSettings /> Preferences
        </GhostNavLink>
      </div>
    </PageWrap>
  );
};

export default Dashboard;
