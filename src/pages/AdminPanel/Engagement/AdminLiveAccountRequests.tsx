import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiLink, FiRefreshCw, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import {
  fetchAdminLiveAccountRequests,
  patchAdminLiveAccountRequest,
  type AdminLiveAccountRow,
  type AdminLiveAccountStats,
} from '../../../services/adminEngagementService';
import { TableBodySkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  GhostButton, FilterBar, SearchInput, FilterCount, PrimaryButton,
  TableCard, DataTable, Th, Td, Tr, Pill, ErrorBanner, adminColors,
  Pagination, PageButtons, PageBtn,
  StatsGrid, StatIconBox, StatBody, StatValue, StatLabel,
} from '../../../components/AdminPanel/adminUi';

const MetricCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem 1.05rem;
  background: ${adminColors.card};
  border: 1px solid ${adminColors.border};
  border-radius: 14px;
  box-shadow: ${adminColors.shadow};
`;

const HeroNote = styled.div`
  background:
    radial-gradient(ellipse 70% 120% at 100% 0%, rgba(251, 191, 36, 0.12) 0%, transparent 55%),
    linear-gradient(125deg, #0c1f3d 0%, ${adminColors.navy} 50%, ${adminColors.navyLight} 100%);
  border-radius: 16px;
  padding: 1.1rem 1.25rem;
  color: white;
  box-shadow: 0 10px 28px rgba(12, 31, 61, 0.22);
  margin-bottom: 1rem;
  h3 { margin: 0 0 0.25rem; font-size: 1rem; font-weight: 800; }
  p { margin: 0; font-size: 0.8125rem; opacity: 0.88; line-height: 1.45; }
`;

const Select = styled.select`
  padding: 0.45rem 0.65rem;
  border-radius: 8px;
  border: 1px solid ${adminColors.border};
  font-size: 0.75rem;
  font-weight: 600;
  color: ${adminColors.navy};
  background: white;
`;

const StatusActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;

const NoteInput = styled.input`
  width: 100%;
  min-width: 120px;
  max-width: 180px;
  padding: 0.35rem 0.5rem;
  border: 1px solid ${adminColors.border};
  border-radius: 7px;
  font-size: 0.7rem;
  font-family: inherit;
`;

const emptyStats: AdminLiveAccountStats = {
  total: 0,
  pending: 0,
  inProgress: 0,
  last24h: 0,
  approved: 0,
  rejected: 0,
};

const statusPill = (s: string) => {
  if (s === 'pending') return 'pending';
  if (s === 'in_progress') return 'user';
  if (s === 'approved') return 'active';
  if (s === 'rejected') return 'rejected';
  return 'default';
};

const AdminLiveAccountRequests: React.FC = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [appliedQ, setAppliedQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<AdminLiveAccountRow[]>([]);
  const [stats, setStats] = useState<AdminLiveAccountStats>(emptyStats);
  const [pagination, setPagination] = useState<{
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalItems: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdminLiveAccountRequests(page, 25, appliedQ || undefined, status || undefined);
      setItems(data.items || []);
      setStats(data.stats || emptyStats);
      setPagination(data.pagination || null);
      const seed: Record<string, string> = {};
      (data.items || []).forEach((r) => {
        seed[r.id] = r.adminNote || '';
      });
      setNotes(seed);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [page, appliedQ, status]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setStatusFor = async (id: string, next: string) => {
    try {
      setBusyId(id);
      setError(null);
      await patchAdminLiveAccountRequest(id, {
        status: next,
        adminNote: notes[id] ?? '',
      });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiLink /> Live account requests</PageTitle>
          <PageSubtitle>
            Members submit broker account numbers for cashback / IB linking — approve or reject each one
          </PageSubtitle>
        </PageTitleGroup>
        <GhostButton type="button" onClick={refresh} disabled={loading}>
          <FiRefreshCw /> Refresh
        </GhostButton>
      </PageHeader>

      <HeroNote>
        <h3>Live account queue</h3>
        <p>
          When a member completes setup on the rebate broker page, the request lands here.
          Link the account with the broker/IB, then approve so the member sees progress — or reject with a short note.
        </p>
      </HeroNote>

      <StatsGrid>
        <MetricCard>
          <StatIconBox $color="#2563eb"><FiLink /></StatIconBox>
          <StatBody>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total</StatLabel>
          </StatBody>
        </MetricCard>
        <MetricCard>
          <StatIconBox $color="#d97706"><FiLink /></StatIconBox>
          <StatBody>
            <StatValue>{stats.pending}</StatValue>
            <StatLabel>Pending</StatLabel>
          </StatBody>
        </MetricCard>
        <MetricCard>
          <StatIconBox $color="#7c3aed"><FiLink /></StatIconBox>
          <StatBody>
            <StatValue>{stats.inProgress}</StatValue>
            <StatLabel>In review</StatLabel>
          </StatBody>
        </MetricCard>
        <MetricCard>
          <StatIconBox $color="#059669"><FiLink /></StatIconBox>
          <StatBody>
            <StatValue>{stats.last24h}</StatValue>
            <StatLabel>Last 24h</StatLabel>
          </StatBody>
        </MetricCard>
      </StatsGrid>

      <FilterBar>
        <SearchInput style={{ maxWidth: 320, flex: 1 }}>
          <FiSearch />
          <input
            placeholder="Search name, email, broker, account…"
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
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </Select>
        <GhostButton $sm type="button" onClick={() => { setPage(1); setAppliedQ(q.trim()); }}>
          Search
        </GhostButton>
        <FilterCount>
          {loading ? 'Loading…' : `${pagination?.totalItems ?? items.length} requests`}
        </FilterCount>
      </FilterBar>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <TableCard>
        <DataTable>
          <thead>
            <tr>
              <Th>When</Th>
              <Th>Member</Th>
              <Th>Broker / account</Th>
              <Th>Admin note</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading && <TableBodySkeleton rows={6} cols={6} />}
            {!loading && items.map((row) => (
              <Tr key={row.id}>
                <Td style={{ whiteSpace: 'nowrap', fontSize: '0.75rem', color: adminColors.muted }}>
                  {row.time || '—'}
                  {row.createdAt && (
                    <div style={{ fontSize: '0.65rem' }}>
                      {new Date(row.createdAt).toLocaleString()}
                    </div>
                  )}
                </Td>
                <Td>
                  <button
                    type="button"
                    onClick={() => row.userId && navigate(`/admin-panel/users/${row.userId}`)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      padding: 0,
                      textAlign: 'left',
                      cursor: row.userId ? 'pointer' : 'default',
                    }}
                  >
                    <div style={{ fontWeight: 700, color: adminColors.navy, fontSize: '0.8125rem' }}>
                      {row.userName}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: adminColors.muted }}>{row.userEmail}</div>
                  </button>
                </Td>
                <Td>
                  <div style={{ fontWeight: 700, color: adminColors.navy, fontSize: '0.8125rem' }}>
                    {row.brokerName}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: adminColors.muted }}>
                    #{row.accountNumber}
                  </div>
                </Td>
                <Td>
                  <NoteInput
                    value={notes[row.id] ?? ''}
                    placeholder="Optional note to user"
                    onChange={(e) => setNotes((n) => ({ ...n, [row.id]: e.target.value }))}
                    disabled={busyId === row.id}
                  />
                </Td>
                <Td>
                  <Pill $variant={statusPill(row.status)}>
                    {row.status === 'in_progress' ? 'In review' : row.status}
                  </Pill>
                </Td>
                <Td>
                  <StatusActions>
                    {(row.status === 'pending' || row.status === 'rejected') && (
                      <GhostButton
                        $sm
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => setStatusFor(row.id, 'in_progress')}
                      >
                        Review
                      </GhostButton>
                    )}
                    {row.status !== 'approved' && (
                      <PrimaryButton
                        $sm
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => setStatusFor(row.id, 'approved')}
                      >
                        Approve
                      </PrimaryButton>
                    )}
                    {row.status !== 'rejected' && row.status !== 'approved' && (
                      <GhostButton
                        $sm
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => setStatusFor(row.id, 'rejected')}
                      >
                        Reject
                      </GhostButton>
                    )}
                  </StatusActions>
                </Td>
              </Tr>
            ))}
            {!loading && items.length === 0 && (
              <Tr>
                <Td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: adminColors.muted }}>
                  No live account requests yet.
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
              <PageBtn type="button" disabled={!pagination.hasPreviousPage} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Prev
              </PageBtn>
              <PageBtn type="button" disabled={!pagination.hasNextPage} onClick={() => setPage((p) => p + 1)}>
                Next
              </PageBtn>
            </PageButtons>
          </Pagination>
        )}
      </TableCard>
    </PageWrap>
  );
};

export default AdminLiveAccountRequests;
