import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiBarChart2, FiTrendingUp, FiTrendingDown, FiDownload, FiCalendar, FiUsers, FiActivity, FiDollarSign, FiAward } from 'react-icons/fi';
import { fetchAdminFullMetrics, type PlatformMetrics, type EngagementSummary } from '../../../services/adminEngagementService';

const Container = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #132E58;
  margin: 0;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  background: #132E58;
  color: white;
  
  &:hover {
    background: #1a4a7a;
    transform: translateY(-2px);
  }
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
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const ReportsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #132E58;
  margin-bottom: 1.5rem;
`;

const ErrorBox = styled.div`
  background: #fef2f2;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem 0.5rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #6b7280;
  border-bottom: 2px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 0.75rem 0.5rem;
  font-size: 0.9rem;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
`;

const Meta = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1rem 0;
`;

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<EngagementSummary | null>(null);
  const [platform, setPlatform] = useState<PlatformMetrics | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAdminFullMetrics();
        if (!cancelled) {
          setSummary(data.summary);
          setPlatform(data.platform);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load reports data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const exportJson = () => {
    if (!summary || !platform) return;
    const blob = new Blob([JSON.stringify({ generatedAt: new Date().toISOString(), summary, platform }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legendpips-admin-metrics-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats =
    loading || !summary || !platform
      ? [
          { icon: FiBarChart2, label: 'Loading…', value: '—', change: '…', positive: true, color: '#e5e7eb' },
          { icon: FiUsers, label: '…', value: '—', change: '…', positive: true, color: '#e5e7eb' },
          { icon: FiActivity, label: '…', value: '—', change: '…', positive: true, color: '#e5e7eb' },
          { icon: FiDollarSign, label: '…', value: '—', change: '…', positive: true, color: '#e5e7eb' },
        ]
      : [
          {
            icon: FiUsers,
            label: 'Registered users',
            value: String(summary.totalUsers),
            change: `${platform.newUsers7d} new (7 days)`,
            positive: true,
            color: '#3b82f6',
          },
          {
            icon: FiActivity,
            label: 'Activity events (7 days)',
            value: String(platform.activityLast7dTotal),
            change: `${summary.activity24h} in last 24 hours`,
            positive: true,
            color: '#0ea5e9',
          },
          {
            icon: FiAward,
            label: 'Contest joins (all time)',
            value: String(platform.contestParticipantsTotal),
            change: `${platform.contestsTotal} contests in CMS`,
            positive: true,
            color: '#Fbbf24',
          },
          {
            icon: FiDollarSign,
            label: 'Rebates credited (30 days)',
            value: `$${platform.rebateUsd30d.toFixed(2)}`,
            change: 'ledger total',
            positive: true,
            color: '#059669',
          },
        ];

  const breakdownRows = platform
    ? Object.entries(platform.activityByTypeLast7d)
        .map(([type, count]) => ({ type, count: Number(count) || 0 }))
        .sort((a, b) => b.count - a.count)
    : [];

  return (
    <Container>
      <Header>
        <Title>Reports & Analytics</Title>
        <Button type="button" onClick={exportJson} disabled={loading || !summary || !platform}>
          <FiDownload />
          Export metrics (JSON)
        </Button>
      </Header>

      {error && <ErrorBox>{error}</ErrorBox>}

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <StatHeader>
              <StatIcon $color={stat.color}>
                <stat.icon />
              </StatIcon>
            </StatHeader>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
            <StatChange $positive={stat.positive}>
              {stat.positive ? <FiTrendingUp /> : <FiTrendingDown />}
              {stat.change}
            </StatChange>
          </StatCard>
        ))}
      </StatsGrid>

      <ReportsSection>
        <SectionTitle>Activity by type (last 7 days)</SectionTitle>
        <Meta>Based on the unified activity log (same source as the user activity feed).</Meta>
        {!platform || loading ? (
          <Meta>Loading…</Meta>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Type</Th>
                <Th>Events</Th>
              </tr>
            </thead>
            <tbody>
              {breakdownRows && breakdownRows.length > 0 ? (
                breakdownRows.map((row) => (
                  <tr key={row.type}>
                    <Td style={{ fontWeight: 600 }}>{row.type}</Td>
                    <Td>{row.count}</Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <Td colSpan={2}>No activity in the last 7 days.</Td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </ReportsSection>

      <ReportsSection>
        <SectionTitle>Content catalog snapshot</SectionTitle>
        {!platform || !summary || loading ? (
          <Meta>Loading…</Meta>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Metric</Th>
                <Th>Value</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>Published signals</Td>
                <Td>{platform.signalsPublished}</Td>
              </tr>
              <tr>
                <Td>Webinars</Td>
                <Td>{platform.webinarsTotal}</Td>
              </tr>
              <tr>
                <Td>Published courses</Td>
                <Td>{platform.coursesPublished}</Td>
              </tr>
              <tr>
                <Td>Published brokers</Td>
                <Td>{platform.brokersPublished}</Td>
              </tr>
              <tr>
                <Td>Forum threads</Td>
                <Td>{platform.forumThreads}</Td>
              </tr>
              <tr>
                <Td>Forum comments</Td>
                <Td>{platform.forumComments}</Td>
              </tr>
              <tr>
                <Td>Feedback messages (all time)</Td>
                <Td>{platform.feedbackTotal}</Td>
              </tr>
              <tr>
                <Td>New users (24 hours)</Td>
                <Td>{platform.newUsers24h}</Td>
              </tr>
              <tr>
                <Td>Open feedback tickets</Td>
                <Td>{summary.newFeedbackOpen}</Td>
              </tr>
              <tr>
                <Td>Feedback (last 7 days)</Td>
                <Td>{summary.newFeedbackWeek}</Td>
              </tr>
            </tbody>
          </Table>
        )}
      </ReportsSection>

      <ReportsSection>
        <SectionTitle>Report history</SectionTitle>
        <Meta>Automated downloadable snapshots are not stored on the server yet. Use Export to save metrics locally.</Meta>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              background: '#f9fafb',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 600, color: '#132E58' }}>
                Platform metrics export
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                JSON bundle: engagement summary + platform counts + 7-day activity breakdown
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                <FiCalendar />
                {new Date().toLocaleDateString()}
              </div>
            </div>
            <Button type="button" onClick={exportJson} disabled={loading || !summary || !platform}>
              <FiDownload />
              Download
            </Button>
          </div>
        </div>
      </ReportsSection>
    </Container>
  );
};

export default Reports;
