import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  FiBarChart2, FiTrendingUp, FiDownload, FiCalendar, FiUsers, FiActivity, FiDollarSign, FiAward, FiFileText,
} from 'react-icons/fi';
import { fetchAdminFullMetrics, type PlatformMetrics, type EngagementSummary } from '../../../services/adminEngagementService';
import { ShimmerBar, TableBodySkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  PrimaryButton, StatsGrid, StatCard, StatIconBox, StatBody, StatValue, StatLabel, StatMeta,
  SectionCard, SectionHead, SectionBody, DataTable, Th, Td, Tr,
  ErrorBanner, adminColors,
} from '../../../components/AdminPanel/adminUi';

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
    return () => { cancelled = true; };
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

  const ready = !loading && summary && platform;

  const stats = ready
    ? [
        { icon: FiUsers, label: 'Registered users', value: String(summary!.totalUsers), meta: `${platform!.newUsers7d} new (7d)`, color: '#3b82f6' },
        { icon: FiActivity, label: 'Activity (7 days)', value: String(platform!.activityLast7dTotal), meta: `${summary!.activity24h} last 24h`, color: '#0ea5e9' },
        { icon: FiAward, label: 'Contest joins', value: String(platform!.contestParticipantsTotal), meta: `${platform!.contestsTotal} contests`, color: '#Fbbf24' },
        { icon: FiDollarSign, label: 'Rebates (30d)', value: `$${platform!.rebateUsd30d.toFixed(2)}`, meta: 'ledger total', color: '#059669' },
      ]
    : Array.from({ length: 4 }).map((_, i) => ({
        icon: FiBarChart2, label: '…', value: '—', meta: '', color: '#e2e8f0', key: i,
      }));

  const breakdownRows = platform
    ? Object.entries(platform.activityByTypeLast7d)
        .map(([type, count]) => ({ type, count: Number(count) || 0 }))
        .sort((a, b) => b.count - a.count)
    : [];

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiBarChart2 /> Reports</PageTitle>
          <PageSubtitle>Platform metrics, content snapshot, and exportable analytics</PageSubtitle>
        </PageTitleGroup>
        <PrimaryButton type="button" onClick={exportJson} disabled={!ready}>
          <FiDownload /> Export JSON
        </PrimaryButton>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <StatsGrid>
        {stats.map((stat: any, index) => (
          <div key={stat.label + index} style={{ display: 'contents' }}>
            <StatCard type="button" disabled style={{ cursor: 'default', pointerEvents: 'none' }}>
              <StatIconBox $color={stat.color}><stat.icon /></StatIconBox>
              <StatBody>
                <StatValue>{!ready ? <ShimmerBar $h="22px" $w="48%" /> : stat.value}</StatValue>
                <StatLabel>{!ready ? '…' : stat.label}</StatLabel>
                {ready && <StatMeta $positive><FiTrendingUp style={{ display: 'inline', marginRight: 4 }} />{stat.meta}</StatMeta>}
              </StatBody>
            </StatCard>
          </div>
        ))}
      </StatsGrid>

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
        <SectionHead><h2>Content catalog snapshot</h2></SectionHead>
        <SectionBody style={{ padding: 0 }}>
          <DataTable>
            <thead>
              <tr><Th>Metric</Th><Th>Value</Th></tr>
            </thead>
            <tbody>
              {!ready ? (
                <TableBodySkeleton rows={8} cols={2} />
              ) : (
                <>
                  {[
                    ['Published signals', platform!.signalsPublished],
                    ['Webinars', platform!.webinarsTotal],
                    ['Published courses', platform!.coursesPublished],
                    ['Published brokers', platform!.brokersPublished],
                    ['Forum threads', platform!.forumThreads],
                    ['Forum comments', platform!.forumComments],
                    ['Feedback messages (all time)', platform!.feedbackTotal],
                    ['New users (24 hours)', platform!.newUsers24h],
                    ['Open feedback tickets', summary!.newFeedbackOpen],
                    ['Feedback (last 7 days)', summary!.newFeedbackWeek],
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
          <h2><FiFileText style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Export</h2>
        </SectionHead>
        <SectionBody>
          <ExportCard>
            <div>
              <h3>Platform metrics export</h3>
              <p>JSON bundle: engagement summary + platform counts + 7-day activity breakdown</p>
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
