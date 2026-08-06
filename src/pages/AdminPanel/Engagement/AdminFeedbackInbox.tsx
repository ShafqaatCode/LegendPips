import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FiInbox, FiTrash2, FiEye, FiArchive, FiRefreshCw, FiMail } from 'react-icons/fi';
import {
  fetchAdminFeedback,
  patchFeedbackStatus,
  deleteFeedbackAdmin,
  type AdminFeedbackRow,
} from '../../../services/adminEngagementService';
import { TableBodySkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  GhostButton, FilterBar, FilterSelect, FilterCount,
  TableCard, DataTable, Th, Td, Tr, Pill, ErrorBanner, adminColors,
  Pagination, PageButtons, PageBtn, ActionGroup,
} from '../../../components/AdminPanel/adminUi';

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
  @media (max-width: 700px) { grid-template-columns: 1fr; }
`;

const MiniStat = styled.div`
  background: white;
  border: 1px solid ${adminColors.border};
  border-radius: 14px;
  padding: 0.85rem 1rem;
  box-shadow: ${adminColors.shadow};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  .icon {
    width: 40px; height: 40px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center; font-size: 1.05rem;
  }
  .val { font-size: 1.25rem; font-weight: 800; color: ${adminColors.navy}; }
  .lbl { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: ${adminColors.muted}; }
`;

const Msg = styled.div`
  max-width: 280px;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: ${adminColors.text};
  white-space: pre-wrap;
  word-break: break-word;
`;

const statusPill = (s: string) => {
  if (s === 'new') return 'pending';
  if (s === 'read') return 'user';
  return 'incomplete';
};

const AdminFeedbackInbox: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<AdminFeedbackRow[]>([]);
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
      const data = await fetchAdminFeedback(page, 15, statusFilter || undefined);
      setItems(data.items);
      setPagination(data.pagination);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { refresh(); }, [refresh]);

  const setStatus = async (id: string, status: 'new' | 'read' | 'archived') => {
    await patchFeedbackStatus(id, status);
    await refresh();
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this feedback permanently?')) return;
    await deleteFeedbackAdmin(id);
    await refresh();
  };

  const userLabel = (row: AdminFeedbackRow) => {
    if (row.userNameSnapshot) return row.userNameSnapshot;
    const u = row.userId;
    if (u && typeof u === 'object') {
      const n = `${u.firstName || ''} ${u.lastName || ''}`.trim();
      return n || u.email || '—';
    }
    return 'Guest';
  };

  const counts = useMemo(() => ({
    total: items.length,
    new: items.filter((i) => i.status === 'new').length,
    read: items.filter((i) => i.status === 'read').length,
  }), [items]);

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiInbox /> Feedback</PageTitle>
          <PageSubtitle>Review user messages, mark as read, and archive tickets</PageSubtitle>
        </PageTitleGroup>
        <GhostButton type="button" onClick={refresh} disabled={loading}>
          <FiRefreshCw /> Refresh
        </GhostButton>
      </PageHeader>

      <StatsRow>
        <MiniStat>
          <div className="icon" style={{ background: '#ede9fe', color: '#7c3aed' }}><FiInbox /></div>
          <div><div className="val">{loading ? '…' : counts.total}</div><div className="lbl">On this page</div></div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: '#fef3c7', color: '#d97706' }}><FiMail /></div>
          <div><div className="val">{loading ? '…' : counts.new}</div><div className="lbl">New</div></div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: '#dbeafe', color: '#2563eb' }}><FiEye /></div>
          <div><div className="val">{loading ? '…' : counts.read}</div><div className="lbl">Read</div></div>
        </MiniStat>
      </StatsRow>

      <FilterBar>
        <FilterSelect
          value={statusFilter}
          onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="archived">Archived</option>
        </FilterSelect>
        <FilterCount>{loading ? 'Loading…' : `${items.length} messages`}</FilterCount>
      </FilterBar>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <TableCard>
        <DataTable>
          <thead>
            <tr>
              <Th>When</Th>
              <Th>From</Th>
              <Th>Message</Th>
              <Th>Page</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading && <TableBodySkeleton rows={6} cols={6} />}
            {!loading && items.map((row) => {
              const id = row._id;
              return (
                <Tr key={id}>
                  <Td style={{ whiteSpace: 'nowrap', fontSize: '0.75rem', color: adminColors.muted }}>
                    {row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}
                  </Td>
                  <Td>
                    <div style={{ fontWeight: 700, color: adminColors.navy, fontSize: '0.8125rem' }}>{userLabel(row)}</div>
                    <div style={{ fontSize: '0.6875rem', color: adminColors.muted }}>{row.email}</div>
                  </Td>
                  <Td><Msg>{row.message}</Msg></Td>
                  <Td style={{ fontSize: '0.75rem' }}>{row.page || '—'}</Td>
                  <Td><Pill $variant={statusPill(row.status)}>{row.status}</Pill></Td>
                  <Td>
                    <ActionGroup style={{ flexWrap: 'wrap' }}>
                      {row.status !== 'read' && (
                        <GhostButton $sm type="button" onClick={() => setStatus(id, 'read')}><FiEye /> Read</GhostButton>
                      )}
                      {row.status !== 'archived' && (
                        <GhostButton $sm type="button" onClick={() => setStatus(id, 'archived')}><FiArchive /> Archive</GhostButton>
                      )}
                      {row.status !== 'new' && (
                        <GhostButton $sm type="button" onClick={() => setStatus(id, 'new')}>New</GhostButton>
                      )}
                      <GhostButton $sm $danger type="button" onClick={() => remove(id)}><FiTrash2 /></GhostButton>
                    </ActionGroup>
                  </Td>
                </Tr>
              );
            })}
            {!loading && items.length === 0 && (
              <Tr><Td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: adminColors.muted }}>No feedback messages.</Td></Tr>
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

export default AdminFeedbackInbox;
