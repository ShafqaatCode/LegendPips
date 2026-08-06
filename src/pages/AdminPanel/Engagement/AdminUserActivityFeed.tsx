import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiActivity, FiRefreshCw, FiSearch } from 'react-icons/fi';
import { fetchAdminActivityFeed, type AdminActivityFeedRow } from '../../../services/adminEngagementService';
import { TableBodySkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  GhostButton, FilterBar, SearchInput, FilterCount,
  TableCard, DataTable, Th, Td, Tr, Pill, ErrorBanner, adminColors,
  Pagination, PageButtons, PageBtn,
} from '../../../components/AdminPanel/adminUi';

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const HeroNote = styled.div`
  background:
    radial-gradient(ellipse 70% 120% at 100% 0%, rgba(251, 191, 36, 0.12) 0%, transparent 55%),
    linear-gradient(125deg, #0c1f3d 0%, ${adminColors.navy} 50%, ${adminColors.navyLight} 100%);
  border-radius: 16px;
  padding: 1.1rem 1.25rem;
  color: white;
  box-shadow: 0 10px 28px rgba(12, 31, 61, 0.22);
  h3 { margin: 0 0 0.25rem; font-size: 1rem; font-weight: 800; }
  p { margin: 0; font-size: 0.8125rem; opacity: 0.88; }
`;

const AdminUserActivityFeed: React.FC = () => {
  const [userIdFilter, setUserIdFilter] = useState('');
  const [appliedUserId, setAppliedUserId] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<AdminActivityFeedRow[]>([]);
  const [pagination, setPagination] = useState<{
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdminActivityFeed(page, 25, appliedUserId.trim() || undefined);
      setItems(data.items);
      setPagination(data.pagination);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [page, appliedUserId]);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiActivity /> Activity</PageTitle>
          <PageSubtitle>Live timeline of platform events and user actions</PageSubtitle>
        </PageTitleGroup>
        <GhostButton type="button" onClick={refresh} disabled={loading}>
          <FiRefreshCw /> Refresh
        </GhostButton>
      </PageHeader>

      <StatsRow>
        <HeroNote>
          <h3>Unified activity log</h3>
          <p>Filter by MongoDB user id to audit a single account — contests, enrollment, sign-ins, and more.</p>
        </HeroNote>
      </StatsRow>

      <FilterBar>
        <SearchInput style={{ maxWidth: 360, flex: 1 }}>
          <FiSearch />
          <input
            placeholder="Filter by user MongoDB id"
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
          />
        </SearchInput>
        <GhostButton
          $sm
          type="button"
          onClick={() => { setPage(1); setAppliedUserId(userIdFilter.trim()); }}
        >
          Apply filter
        </GhostButton>
        {appliedUserId && (
          <GhostButton $sm type="button" onClick={() => { setUserIdFilter(''); setAppliedUserId(''); setPage(1); }}>
            Clear
          </GhostButton>
        )}
        <FilterCount>{loading ? 'Loading…' : `${items.length} events`}</FilterCount>
      </FilterBar>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <TableCard>
        <DataTable>
          <thead>
            <tr>
              <Th>When</Th>
              <Th>User</Th>
              <Th>Type</Th>
              <Th>Title</Th>
              <Th>Description</Th>
            </tr>
          </thead>
          <tbody>
            {loading && <TableBodySkeleton rows={6} cols={5} />}
            {!loading && items.map((row) => (
              <Tr key={row.id}>
                <Td style={{ whiteSpace: 'nowrap', fontSize: '0.75rem', color: adminColors.muted }}>{row.time}</Td>
                <Td>
                  <div style={{ fontWeight: 700, color: adminColors.navy, fontSize: '0.8125rem' }}>{row.userLabel}</div>
                  <div style={{ fontSize: '0.6875rem', color: adminColors.muted }}>{row.userId || '—'}</div>
                </Td>
                <Td><Pill $variant="user">{row.type}</Pill></Td>
                <Td style={{ fontWeight: 600, color: adminColors.navy }}>{row.title}</Td>
                <Td style={{ fontSize: '0.8125rem', color: adminColors.muted, maxWidth: 320 }}>{row.description}</Td>
              </Tr>
            ))}
            {!loading && items.length === 0 && (
              <Tr><Td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: adminColors.muted }}>No activity events found.</Td></Tr>
            )}
          </tbody>
        </DataTable>
        {pagination && (
          <Pagination>
            <span style={{ fontSize: '0.75rem', color: adminColors.muted }}>
              Page {pagination.currentPage} / {pagination.totalPages || 1}
            </span>
            <PageButtons>
              <PageBtn type="button" disabled={!pagination.hasPreviousPage} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</PageBtn>
              <PageBtn type="button" disabled={!pagination.hasNextPage} onClick={() => setPage((p) => p + 1)}>Next</PageBtn>
            </PageButtons>
          </Pagination>
        )}
      </TableCard>
    </PageWrap>
  );
};

export default AdminUserActivityFeed;
