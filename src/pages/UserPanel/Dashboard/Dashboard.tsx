import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiTrendingUp, FiAward, FiVideo, FiBook, FiUsers, FiDollarSign } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchMyDashboard, type DashboardStat } from '../../../services/userInsightService';
import { ShimmerBar } from '../../../components/SharedComponents/Shimmer';

const iconByKey: Record<string, React.ElementType> = {
  contests: FiAward,
  signals: FiTrendingUp,
  webinars: FiVideo,
  courses: FiBook,
  forum: FiUsers,
  rebates: FiDollarSign,
};

const DashboardContainer = styled.div`
  max-width: 1400px;
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

const ActivityHint = styled.p`
  font-size: 0.9375rem;
  color: #374151;
  margin: -1rem 0 2rem;
  padding: 1rem 1.25rem;
  background: #f0f9ff;
  border-radius: 10px;
  border: 1px solid #bae6fd;
`;

const ErrorBanner = styled.div`
  background: #fef2f2;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  border: 1px solid #fecaca;
`;

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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMyDashboard();
        if (cancelled) return;
        setStats(data.stats || []);
        setActivitySummary(data.activitySummary || null);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load dashboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const quickActions = [
    {
      icon: FiAward,
      title: 'Join Contest',
      description: 'Participate in trading contests',
    },
    {
      icon: FiVideo,
      title: 'Watch Webinar',
      description: 'Join live trading webinars',
    },
    {
      icon: FiBook,
      title: 'Start Course',
      description: 'Enroll in trading courses',
    },
    {
      icon: FiTrendingUp,
      title: 'View Signals',
      description: 'Check latest trading signals',
    },
  ];

  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>
          Welcome back, {user?.firstName || 'User'}! 👋
        </WelcomeTitle>
        <WelcomeText>
          Here&apos;s what&apos;s happening with your trading journey today.
        </WelcomeText>
      </WelcomeSection>

      {error && <ErrorBanner>{error}</ErrorBanner>}
      {activitySummary && !loading && (
        <ActivityHint>
          <strong>Activity this month:</strong> {activitySummary.thisMonth} logged events
          <span style={{ color: activitySummary.positive ? '#059669' : '#dc2626', marginLeft: '0.5rem', fontWeight: 600 }}>
            ({activitySummary.changeText} vs last month)
          </span>
        </ActivityHint>
      )}

      <StatsGrid>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <StatCard key={index}>
                <StatHeader>
                  <StatIcon $color="#e5e7eb">
                    <FiAward />
                  </StatIcon>
                </StatHeader>
                <StatValue>
                  <ShimmerBar $h="28px" $w="55%" />
                </StatValue>
                <StatLabel>
                  <ShimmerBar $h="13px" $w="75%" />
                </StatLabel>
                <StatChange $positive>
                  <ShimmerBar $h="12px" $w="85%" />
                </StatChange>
              </StatCard>
            ))
          : stats.map((stat) => {
              const Icon = iconByKey[stat.key] || FiTrendingUp;
              return (
                <StatCard key={stat.key}>
                  <StatHeader>
                    <StatIcon $color={stat.color}>
                      <Icon />
                    </StatIcon>
                  </StatHeader>
                  <StatValue>{stat.value}</StatValue>
                  <StatLabel>{stat.label}</StatLabel>
                  <StatChange $positive={stat.positive}>
                    <FiTrendingUp />
                    {stat.changeText} this month
                  </StatChange>
                </StatCard>
              );
            })}
      </StatsGrid>

      <SectionTitle>Quick Actions</SectionTitle>
      <QuickActionsGrid>
        {quickActions.map((action, index) => (
          <ActionCard key={index}>
            <ActionIcon>
              <action.icon />
            </ActionIcon>
            <ActionTitle>{action.title}</ActionTitle>
            <ActionDescription>{action.description}</ActionDescription>
          </ActionCard>
        ))}
      </QuickActionsGrid>
    </DashboardContainer>
  );
};

export default Dashboard;
