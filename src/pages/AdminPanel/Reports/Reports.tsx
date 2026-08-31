import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  FiBarChart2,
  FiTrendingUp,
  FiDownload,
  FiCalendar,
  FiUsers,
  FiActivity,
  FiDollarSign,
  FiAward,
  FiFileText,
  FiAlertTriangle,
  FiBriefcase,
  FiShield,
  FiUserCheck,
  FiGitPullRequest,
} from 'react-icons/fi';
import { fetchAdminFullMetrics, type PlatformMetrics, type EngagementSummary } from '../../../services/adminEngagementService';
import { ShimmerBar, TableBodySkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  PrimaryButton, StatsGrid, StatCard, StatIconBox, StatBody, StatValue, StatLabel, StatMeta,
  SectionCard, SectionHead, SectionBody, DataTable, Th, Td, Tr,
  ErrorBanner, adminColors,
} from '../../../components/AdminPanel/adminUi';

const SectionLabel = styled.h2`
  margin: 1.25rem 0 0.65rem;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${adminColors.muted};
`;

const ExportCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.1rem;
  background: linear-gradient(180deg, #f8fafc 0%, white 100%);
  border: 1px solid ${adminColors.border};
  border-radius: 14px;
  flex-wrap: wrap;

  h3 { margin: 0 0 0.25rem; font-size: 0.9375rem; font-weight: 800; color: ${adminColors.navy}; }
  p { margin: 0; font-size: 0.8125rem; color: ${adminColors.muted}; line-height: 1.4; }
  .date {
    display: flex; align-items: center; gap: 0.35rem;
    margin-top: 0.45rem; font-size: 0.75rem; color: ${adminColors.muted}; font-weight: 600;
  }
`;

type Kpi = {
  icon: React.ComponentType;
  label: string;
  value: string;
  meta: string;
  color: string;
};

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
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load analytics');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const exportJson = () => {
    if (!summary || !platform) return;
    const blob = new Blob(
      [JSON.stringify({ generatedAt: new Date().toISOString(), summary, platform }, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legendpips-admin-analytics-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ready = !loading && summary && platform;
  const n = (v?: number) => (typeof v === 'number' ? v : 0);

  const businessKpis: Kpi[] = ready
    ? [
        {
          icon: FiUsers,
          label: 'Registered users',
          value: String(summary!.totalUsers),
          meta: `${n(platform!.newUsers7d)} new (7d)`,
          color: '#3b82f6',
        },
        {
          icon: FiBriefcase,
          label: 'Published brokers',
          value: String(n(platform!.brokersPublished)),
          meta: `${n(platform!.signalsPublished)} signals live`,
          color: '#6366f1',
        },
        {
          icon: FiDollarSign,
          label: 'Rebates credited (30d)',
          value: `$${n(platform!.rebateUsd30d).toFixed(2)}`,
          meta: `${n(platform!.rebateCredits30dCount)} credits · all-time $${n(platform!.rebateUsdAllTime).toFixed(2)}`,
          color: '#059669',
        },
        {
          icon: FiAlertTriangle,
          label: 'Complaints open',
          value: String(n(platform!.complaintsOpen)),
          meta: `${n(platform!.complaintsPending)} pending · ${n(platform!.complaintsLast7d)} new (7d)`,
          color: '#dc2626',
        },
        {
          icon: FiActivity,
          label: 'Activity (7 days)',
          value: String(n(platform!.activityLast7dTotal)),
          meta: `${n(summary!.activity24h)} last 24h`,
          color: '#0ea5e9',
        },
        {
          icon: FiAward,
          label: 'Contest joins',
          value: String(n(platform!.contestParticipantsTotal)),
          meta: `${n(platform!.contestsOngoing)} ongoing contests`,
          color: '#Fbbf24',
        },
      ]
    : Array.from({ length: 6 }).map(() => ({
        icon: FiBarChart2,
        label: '…',
        value: '—',
        meta: '',
        color: '#e2e8f0',
      }));

  const conversionKpis: Kpi[] = ready
    ? [
        {
          icon: FiShield,
          label: 'KYC pending',
          value: String(n(platform!.kycPending)),
          meta: `${n(platform!.kycApproved)} approved · ${n(platform!.kycRejected)} rejected`,
          color: '#d97706',
        },
        {
          icon: FiUserCheck,
          label: 'Live account requests',
          value: String(n(platform!.liveAccountOpen)),
          meta: `${n(platform!.liveAccountTotal)} total · ${n(platform!.liveAccount24h)} (24h)`,
          color: '#0891b2',
        },
        {
          icon: FiGitPullRequest,
          label: 'IB change open',
          value: String(n(platform!.ibChangeOpen)),
          meta: `${n(platform!.ibChangeTotal)} total · ${n(platform!.referralInvites7d)} invites (7d)`,
          color: '#7c3aed',
        },
        {
          icon: FiDollarSign,
          label: 'Withdrawals pending',
          value: String(n(platform!.withdrawalPending)),
          meta: `Paid (30d) $${n(platform!.withdrawalPaidUsd30d).toFixed(2)}`,
          color: '#059669',
        },
      ]
    : Array.from({ length: 4 }).map(() => ({
        icon: FiBarChart2,
        label: '…',
        value: '—',
        meta: '',
        color: '#e2e8f0',
      }));

  const breakdownRows = platform
    ? Object.entries(platform.activityByTypeLast7d || {})
        .map(([type, count]) => ({ type, count: Number(count) || 0 }))
        .sort((a, b) => b.count - a.count)
    : [];

  const renderKpiGrid = (items: Kpi[]) => (
    <StatsGrid>
      {items.map((stat, index) => (
        <StatCard
          key={`${stat.label}-${index}`}
          type="button"
          disabled
          style={{ cursor: 'default', pointerEvents: 'none' }}
        >
          <StatIconBox $color={stat.color}><stat.icon /></StatIconBox>
          <StatBody>
            <StatValue>{!ready ? <ShimmerBar $h="22px" $w="48%" /> : stat.value}</StatValue>
            <StatLabel>{!ready ? '…' : stat.label}</StatLabel>
            {ready && (
              <StatMeta $positive>
                <FiTrendingUp style={{ display: 'inline', marginRight: 4 }} />
                {stat.meta}
              </StatMeta>
            )}
          </StatBody>
        </StatCard>
      ))}
    </StatsGrid>
  );

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiBarChart2 /> Analytics</PageTitle>
          <PageSubtitle>
            Business KPIs, conversion queues, content snapshot, and exportable metrics
          </PageSubtitle>
        </PageTitleGroup>
        <PrimaryButton type="button" onClick={exportJson} disabled={!ready}>
          <FiDownload /> Export JSON
        </PrimaryButton>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <SectionLabel>Business overview</SectionLabel>
      {renderKpiGrid(businessKpis)}

      <SectionLabel>Conversion & ops queues</SectionLabel>
      {renderKpiGrid(conversionKpis)}

      <SectionCard>
        <SectionHead><h2>Activity by type (last 7 days)</h2></SectionHead>
        <SectionBody style={{ padding: 0 }}>
          <DataTable>
            <thead>
              <tr><Th>Type</Th><Th>Events</Th></tr>
            </thead>
            <tbody>
              {!ready ? (
                <TableBodySkeleton rows={5} cols={2} />
              ) : breakdownRows.length > 0 ? (
                breakdownRows.map((row) => (
                  <Tr key={row.type}>
                    <Td style={{ fontWeight: 700, color: adminColors.navy }}>{row.type}</Td>
                    <Td>{row.count}</Td>
                  </Tr>
                ))
              ) : (
                <Tr><Td colSpan={2} style={{ color: adminColors.muted }}>No activity in the last 7 days.</Td></Tr>
              )}
            </tbody>
          </DataTable>
        </SectionBody>
      </SectionCard>

      <SectionCard>
        <SectionHead><h2>Platform snapshot</h2></SectionHead>
        <SectionBody style={{ padding: 0 }}>
          <DataTable>
            <thead>
              <tr><Th>Metric</Th><Th>Value</Th></tr>
            </thead>
            <tbody>
              {!ready ? (
                <TableBodySkeleton rows={12} cols={2} />
              ) : (
                <>
                  {[
                    ['Active users', n(platform!.activeUsers)],
                    ['Blocked users', n(platform!.blockedUsers)],
                    ['New users (24h)', n(platform!.newUsers24h)],
                    ['Published signals', n(platform!.signalsPublished)],
                    ['Published brokers', n(platform!.brokersPublished)],
                    ['Webinars', n(platform!.webinarsTotal)],
                    ['Published courses', n(platform!.coursesPublished)],
                    ['Complaints (all time)', n(platform!.complaintsTotal)],
                    ['Complaints resolved/closed', n(platform!.complaintsResolved)],
                    ['Feedback messages (all time)', n(platform!.feedbackTotal)],
                    ['Open feedback tickets', n(summary!.newFeedbackOpen)],
                    ['Feedback (last 7 days)', n(summary!.newFeedbackWeek)],
                    ['Referral invites (all time)', n(platform!.referralInvitesTotal)],
                  ].map(([label, value]) => (
                    <Tr key={String(label)}>
                      <Td style={{ color: adminColors.muted }}>{label}</Td>
                      <Td style={{ fontWeight: 700, color: adminColors.navy }}>{value}</Td>
                    </Tr>
                  ))}
                </>
              )}
            </tbody>
          </DataTable>
        </SectionBody>
      </SectionCard>

      <SectionCard>
        <SectionHead>
          <h2>
            <FiFileText style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
            Export
          </h2>
        </SectionHead>
        <SectionBody>
          <ExportCard>
            <div>
              <h3>Analytics export</h3>
              <p>JSON bundle: business KPIs, queues, activity breakdown, and platform counts</p>
              <div className="date"><FiCalendar /> {new Date().toLocaleDateString()}</div>
            </div>
            <PrimaryButton type="button" onClick={exportJson} disabled={!ready}>
              <FiDownload /> Download
            </PrimaryButton>
          </ExportCard>
        </SectionBody>
      </SectionCard>
    </PageWrap>
  );
};

export default Reports;
