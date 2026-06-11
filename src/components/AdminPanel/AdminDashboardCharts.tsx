import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { fetchAdminDashboardCharts, type PlatformMetrics } from '../../services/adminEngagementService';
import { ShimmerBar } from '../SharedComponents/Shimmer';
import { SectionCard, SectionHead, SectionBody } from './adminUi';

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.25rem;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(SectionCard)`
  margin-bottom: 0;
  min-height: 280px;
  display: flex;
  flex-direction: column;
`;

const ChartWrap = styled.div`
  flex: 1;
  min-height: 220px;
  width: 100%;
  font-size: 0.75rem;

  .recharts-cartesian-grid-horizontal line,
  .recharts-cartesian-grid-vertical line {
    stroke: #f1f5f9;
  }

  .recharts-text {
    fill: #64748b;
    font-size: 0.6875rem;
  }
`;

const EmptyChart = styled.div`
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 0.8125rem;
`;

const COLORS = {
  navy: '#132E58',
  gold: '#Fbbf24',
  blue: '#3b82f6',
  green: '#10b981',
  purple: '#8b5cf6',
  pink: '#ec4899',
  orange: '#f59e0b',
  slate: '#94a3b8',
};

const KYC_COLORS: Record<string, string> = {
  incomplete: '#94a3b8',
  pending: '#f59e0b',
  approved: '#10b981',
  rejected: '#ef4444',
};

const ACTIVITY_TYPE_COLORS: Record<string, string> = {
  contest: COLORS.gold,
  webinar: COLORS.purple,
  course: '#6366f1',
  forum: COLORS.pink,
  feedback: '#6366f1',
  signal: COLORS.orange,
  rebate: COLORS.green,
};

const KYC_LABELS: Record<string, string> = {
  incomplete: 'Not started',
  pending: 'Pending',
  approved: 'Verified',
  rejected: 'Rejected',
};

const tooltipStyle = {
  fontSize: '0.75rem',
  borderRadius: 8,
  border: '1px solid #e8ecf1',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
};

interface AdminDashboardChartsProps {
  platform?: Partial<PlatformMetrics>;
  loading?: boolean;
}

const AdminDashboardCharts: React.FC<AdminDashboardChartsProps> = () => {
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState<Partial<PlatformMetrics>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAdminDashboardCharts();
        if (!cancelled) setPlatform(data.platform);
      } catch {
        if (!cancelled) setPlatform({});
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <ChartsGrid>
        {Array.from({ length: 4 }).map((_, i) => (
          <ChartCard key={i}>
            <SectionHead><h2>Analytics</h2></SectionHead>
            <SectionBody><ShimmerBar $h="220px" $w="100%" /></SectionBody>
          </ChartCard>
        ))}
      </ChartsGrid>
    );
  }

  const activityByType = Object.entries(platform.activityByTypeLast7d || {})
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      key: name,
    }))
    .sort((a, b) => b.value - a.value);

  const kycData = Object.entries(platform.kycStatusBreakdown || {})
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({
      name: KYC_LABELS[key] || key,
      value,
      key,
    }));

  const signups = platform.userSignupsLast7d || [];
  const activityDaily = platform.activityDailyLast7d || [];

  return (
    <ChartsGrid>
      <ChartCard>
        <SectionHead><h2>New User Signups (7 days)</h2></SectionHead>
        <SectionBody style={{ paddingTop: 0 }}>
          <ChartWrap>
            {signups.every((d) => d.count === 0) ? (
              <EmptyChart>No signups in the last 7 days</EmptyChart>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={signups} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={COLORS.blue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Signups"
                    stroke={COLORS.blue}
                    strokeWidth={2}
                    fill="url(#signupGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartWrap>
        </SectionBody>
      </ChartCard>

      <ChartCard>
        <SectionHead><h2>Platform Activity (7 days)</h2></SectionHead>
        <SectionBody style={{ paddingTop: 0 }}>
          <ChartWrap>
            {activityDaily.every((d) => d.count === 0) ? (
              <EmptyChart>No activity logged this week</EmptyChart>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={activityDaily} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" name="Events" fill={COLORS.navy} radius={[4, 4, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartWrap>
        </SectionBody>
      </ChartCard>

      <ChartCard>
        <SectionHead><h2>Activity by Type (7 days)</h2></SectionHead>
        <SectionBody style={{ paddingTop: 0 }}>
          <ChartWrap>
            {activityByType.length === 0 ? (
              <EmptyChart>No activity by type yet</EmptyChart>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={activityByType}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={2}
                  >
                    {activityByType.map((entry) => (
                      <Cell
                        key={entry.key}
                        fill={ACTIVITY_TYPE_COLORS[entry.key] || COLORS.slate}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '0.6875rem' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartWrap>
        </SectionBody>
      </ChartCard>

      <ChartCard>
        <SectionHead><h2>KYC Verification Status</h2></SectionHead>
        <SectionBody style={{ paddingTop: 0 }}>
          <ChartWrap>
            {kycData.length === 0 ? (
              <EmptyChart>No user KYC data</EmptyChart>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={kycData}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    width={72}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="value" name="Users" radius={[0, 4, 4, 0]} maxBarSize={20}>
                    {kycData.map((entry) => (
                      <Cell key={entry.key} fill={KYC_COLORS[entry.key] || COLORS.slate} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartWrap>
        </SectionBody>
      </ChartCard>
    </ChartsGrid>
  );
};

export default AdminDashboardCharts;
