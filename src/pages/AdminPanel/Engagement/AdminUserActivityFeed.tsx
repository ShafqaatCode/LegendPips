import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiActivity, FiRefreshCw, FiSearch } from 'react-icons/fi';
import { fetchAdminActivityFeed, type AdminActivityFeedRow } from '../../../services/adminEngagementService';
import { TableBodySkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  GhostButton, FilterBar, SearchInput, FilterCount,
  TableCard, DataTable, Th, Td, Tr, Pill, ErrorBanner, adminColors,
  Pagination, PageButtons, PageBtn,
} from '../../../components/AdminPanel/adminUi';

const ACTIVITY_TYPES = [
  '',
  'auth',
  'kyc',
  'profile',
  'contest',
  'webinar',
  'course',
  'forum',
  'signal',
  'analysis',
  'feedback',
  'rebate',
  'broker',
  'complaint',
  'referral',
  'live_account',
  'ib_change',
  'trader',
  'system',
];

const TypeSelect = styled.select`
  min-width: 160px;
  padding: 0.5rem 0.7rem;
  border-radius: 9px;
  border: 1px solid ${adminColors.border};
  background: white;
  font-size: 0.8125rem;
  color: ${adminColors.navy};
  font-weight: 600;
`;

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
  const [q, setQ] = useState('');
  const [appliedQ, setAppliedQ] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<AdminActivityFeedRow[]>([]);
  const [pagination, setPagination] = useState<{
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalItems?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdminActivityFeed(page, 30, {
        q: appliedQ.trim() || undefined,
        type: type || undefined,
      });
      setItems(data.items);
      setPagination(data.pagination);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [page, appliedQ, type]);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiActivity /> User activity</PageTitle>
          <PageSubtitle>Complete timeline of member actions across the platform</PageSubtitle>
        </PageTitleGroup>
        <GhostButton type="button" onClick={refresh} disabled={loading}>
          <FiRefreshCw /> Refresh
        </GhostButton>
      </PageHeader>

      <StatsRow>
        <HeroNote>
          <h3>Full member history</h3>
          <p>
            Tracks login, KYC, profile, contests, signals, forum, rebates, complaints, referrals,
            live accounts, IB changes, traders, and more. Filter by email/name or activity type.
          </p>
        </HeroNote>
      </StatsRow>

      <FilterBar>
        <SearchInput style={{ maxWidth: 360, flex: 1 }}>
          <FiSearch />
          <input
            placeholder="Search email, name, or user id"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setPage(1);
                setAppliedQ(q.trim());
              }
            }}
          />
        </SearchInput>
        <TypeSelect
          value={type}
          onChange={(e) => {
            setPage(1);
            setType(e.target.value);
          }}
        >
          {ACTIVITY_TYPES.map((t) => (
            <option key={t || 'all'} value={t}>
              {t ? t.replace(/_/g, ' ') : 'All types'}
            </option>
          ))}
        </TypeSelect>
        <GhostButton
          $sm
          type="button"
          onClick={() => { setPage(1); setAppliedQ(q.trim()); }}
        >
          Apply
        </GhostButton>
        {(appliedQ || type) && (
          <GhostButton
            $sm
            type="button"
            onClick={() => {
              setQ('');
              setAppliedQ('');
              setType('');
              setPage(1);
            }}
          >
            Clear
          </GhostButton>
        )}
        <FilterCount>
          {loading ? 'Loading…' : `${pagination?.totalItems ?? items.length} events`}
        </FilterCount>
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
                <Td style={{ whiteSpace: 'nowrap', fontSize: '0.75rem', color: adminColors.muted }}>
                  {row.time}
                  {row.createdAt && (
                    <div style={{ fontSize: 11 }}>{new Date(row.createdAt).toLocaleString()}</div>
                  )}
                </Td>
                <Td>
                  <div style={{ fontWeight: 700, color: adminColors.navy, fontSize: '0.8125rem' }}>
                    {row.userId ? (
                      <Link to={`/admin-panel/users/${row.userId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {row.userLabel}
                      </Link>
                    ) : row.userLabel}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: adminColors.muted }}>
                    {row.userEmail || row.userId || '—'}
                  </div>
                </Td>
                <Td><Pill $variant="user">{row.type}</Pill></Td>
                <Td style={{ fontWeight: 600, color: adminColors.navy }}>{row.title}</Td>
                <Td style={{ fontSize: '0.8125rem', color: adminColors.muted, maxWidth: 320 }}>{row.description}</Td>
              </Tr>
            ))}
            {!loading && items.length === 0 && (
              <Tr>
                <Td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: adminColors.muted }}>
                  No activity events found.
                </Td>
              </Tr>
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
