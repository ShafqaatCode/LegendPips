import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers,
  FiAward,
  FiVideo,
  FiFileText,
  FiActivity,
  FiArrowUp,
  FiArrowDown,
  FiInbox,
  FiTrendingUp,
  FiBook,
  FiDollarSign,
  FiBarChart2,
} from 'react-icons/fi';
import { fetchAdminFullMetrics, fetchAdminActivityFeed } from '../../../services/adminEngagementService';

const DashboardContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #132E58 0%, #1a4a7a 100%);
  border-radius: 16px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  color: white;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.5rem;
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const WelcomeText = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ $color }) => $color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
  font-size: 1.5rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #132E58;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const StatChange = styled.div<{ $positive?: boolean }>`
  font-size: 0.875rem;
  color: ${({ $positive }) => ($positive ? '#10b981' : '#ef4444')};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #132E58;
  margin-bottom: 1.5rem;
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ActionCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    border-color: #Fbbf24;
  }
`;

const ActionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #Fbbf24;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #132E58;
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const ActionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #132E58;
  margin-bottom: 0.25rem;
`;

const ActionDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

const RecentActivity = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
`;

const ActivityIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $color }) => $color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  font-size: 0.9375rem;
  color: #132E58;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [feedLoading, setFeedLoading] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<{
    summary: {
      totalUsers: number;
      newFeedbackOpen: number;
      newFeedback24h: number;
      newFeedbackWeek: number;
      activity24h: number;
    };
    platform: {
      newUsers7d: number;
      contestsTotal: number;
      contestParticipantsTotal: number;
      webinarsTotal: number;
      coursesPublished: number;
      brokersPublished: number;
      signalsPublished: number;
      activityLast7dTotal: number;
      rebateUsd30d: number;
    };
  } | null>(null);
  const [feedItems, setFeedItems] = useState<
    { id: string; userLabel: string; type: string; title: string; description: string; time: string }[]
  >([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setMetricsLoading(true);
        setMetricsError(null);
        const data = await fetchAdminFullMetrics();
        if (!cancelled) {
          setMetrics({ summary: data.summary, platform: data.platform });
        }
      } catch (e) {
        if (!cancelled) setMetricsError(e instanceof Error ? e.message : 'Failed to load metrics');
      } finally {
        if (!cancelled) setMetricsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setFeedLoading(true);
        const data = await fetchAdminActivityFeed(1, 10);
        if (!cancelled) setFeedItems(data.items);
      } catch {
        if (!cancelled) setFeedItems([]);
      } finally {
        if (!cancelled) setFeedLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const colorForType = (t: string) => {
    if (t === 'contest') return '#Fbbf24';
    if (t === 'webinar') return '#8b5cf6';
    if (t === 'course') return '#8b5cf6';
    if (t === 'forum') return '#ec4899';
    if (t === 'feedback') return '#6366f1';
    if (t === 'signal') return '#f59e0b';
    if (t === 'rebate') return '#10b981';
    return '#6b7280';
  };

  const stats = metricsLoading
    ? Array.from({ length: 8 }).map((_, i) => ({
        icon: FiUsers,
        label: 'Loading…',
        value: '—',
        change: '…',
        positive: true,
        color: '#e5e7eb',
        key: `s-${i}`,
      }))
    : metrics
      ? [
          {
            icon: FiUsers,
            key: 'users',
            label: 'Total users',
            value: String(metrics.summary.totalUsers),
            change: `${metrics.platform.newUsers7d} new accounts (7 days)`,
            positive: true,
            color: '#3b82f6',
          },
          {
            icon: FiAward,
            key: 'contests',
            label: 'Contests',
            value: String(metrics.platform.contestsTotal),
            change: `${metrics.platform.contestParticipantsTotal} participant rows`,
            positive: true,
            color: '#Fbbf24',
          },
          {
            icon: FiTrendingUp,
            key: 'signals',
            label: 'Published signals',
            value: String(metrics.platform.signalsPublished),
            change: 'in signal catalog',
            positive: true,
            color: '#10b981',
          },
          {
            icon: FiVideo,
            key: 'webinars',
            label: 'Webinars',
            value: String(metrics.platform.webinarsTotal),
            change: 'scheduled / recorded',
            positive: true,
            color: '#8b5cf6',
          },
          {
            icon: FiBook,
            key: 'courses',
            label: 'Published courses',
            value: String(metrics.platform.coursesPublished),
            change: `${metrics.platform.brokersPublished} published brokers`,
            positive: true,
            color: '#6366f1',
          },
          {
            icon: FiActivity,
            key: 'activity',
            label: 'Activity (24h)',
            value: String(metrics.summary.activity24h),
            change: `${metrics.platform.activityLast7dTotal} events (7 days)`,
            positive: true,
            color: '#0ea5e9',
          },
          {
            icon: FiInbox,
            key: 'feedback',
            label: 'Open feedback',
            value: String(metrics.summary.newFeedbackOpen),
            change: `${metrics.summary.newFeedback24h} submissions (24h)`,
            positive: metrics.summary.newFeedbackOpen === 0,
            color: '#ec4899',
          },
          {
            icon: FiDollarSign,
            key: 'rebates',
            label: 'Rebates credited (30d)',
            value: `$${metrics.platform.rebateUsd30d.toFixed(2)}`,
            change: 'from rebate ledger',
            positive: true,
            color: '#059669',
          },
        ]
      : [];

  const quickActions = [
    {
      icon: FiUsers,
      title: 'Manage Users',
      description: 'View and manage all users',
      path: '/admin-panel/users',
    },
    {
      icon: FiAward,
      title: 'Create Contest',
      description: 'Set up a new trading contest',
      path: '/admin-panel/contests',
    },
    {
      icon: FiVideo,
      title: 'Add Webinar',
      description: 'Schedule a new webinar',
      path: '/admin-panel/webinars',
    },
    {
      icon: FiFileText,
      title: 'Publish Analysis',
      description: 'Create new analysis article',
      path: '/admin-panel/analysis',
    },
    {
      icon: FiInbox,
      title: 'Feedback inbox',
      description: 'Read and triage user feedback',
      path: '/admin-panel/feedback-inbox',
    },
    {
      icon: FiActivity,
      title: 'User activity feed',
      description: 'Cross-platform activity log',
      path: '/admin-panel/user-activity',
    },
    {
      icon: FiDollarSign,
      title: 'Rebate credits',
      description: 'Grant and review cashback ledger',
      path: '/admin-panel/rebate-credits',
    },
    {
      icon: FiBarChart2,
      title: 'Reports & analytics',
      description: 'Exports and activity breakdown',
      path: '/admin-panel/reports',
    },
  ];

  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>Admin Dashboard 👋</WelcomeTitle>
        <WelcomeText>
          Overview of your platform&apos;s performance and activities.
        </WelcomeText>
      </WelcomeSection>

      {metricsError && (
        <div
          style={{
            background: '#fef2f2',
            color: '#b91c1c',
            padding: '1rem',
            borderRadius: 10,
            marginBottom: '1rem',
            border: '1px solid #fecaca',
          }}
        >
          {metricsError}
        </div>
      )}

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={'key' in stat ? (stat as { key: string }).key : index}>
            <StatHeader>
              <StatIcon $color={stat.color}>
                <stat.icon />
              </StatIcon>
            </StatHeader>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
            <StatChange $positive={stat.positive}>
              {stat.positive ? <FiArrowUp /> : <FiArrowDown />}
              {stat.change}
            </StatChange>
          </StatCard>
        ))}
      </StatsGrid>

      <SectionTitle>Quick Actions</SectionTitle>
      <QuickActionsGrid>
        {quickActions.map((action, index) => (
          <ActionCard
            key={index}
            role="button"
            tabIndex={0}
            onClick={() => action.path && navigate(action.path)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (action.path) navigate(action.path);
              }
            }}
          >
            <ActionIcon>
              <action.icon />
            </ActionIcon>
            <ActionTitle>{action.title}</ActionTitle>
            <ActionDescription>{action.description}</ActionDescription>
          </ActionCard>
        ))}
      </QuickActionsGrid>

      <SectionTitle>Recent user activity</SectionTitle>
      <RecentActivity>
        <ActivityList>
          {feedLoading && (
            <ActivityItem>
              <ActivityContent>
                <ActivityText>Loading activity…</ActivityText>
              </ActivityContent>
            </ActivityItem>
          )}
          {!feedLoading && feedItems.length === 0 && (
            <ActivityItem>
              <ActivityContent>
                <ActivityText>No recent activity logged.</ActivityText>
              </ActivityContent>
            </ActivityItem>
          )}
          {!feedLoading &&
            feedItems.map((row) => {
              const color = colorForType(row.type);
              return (
                <ActivityItem key={row.id}>
                  <ActivityIcon $color={color}>
                    <FiActivity />
                  </ActivityIcon>
                  <ActivityContent>
                    <ActivityText>
                      <strong>{row.userLabel}</strong> — {row.title}{' '}
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>({row.type})</span>
                    </ActivityText>
                    <ActivityTime>{row.time}</ActivityTime>
                    {row.description ? (
                      <ActivityTime style={{ marginTop: 4, display: 'block', color: '#4b5563' }}>
                        {row.description}
                      </ActivityTime>
                    ) : null}
                  </ActivityContent>
                </ActivityItem>
              );
            })}
        </ActivityList>
      </RecentActivity>
    </DashboardContainer>
  );
};

export default AdminDashboard;
