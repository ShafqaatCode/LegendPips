import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiStar, FiRefreshCw, FiTrash2, FiCheck, FiX, FiSearch } from 'react-icons/fi';
import {
  adminDeleteBrokerReview,
  adminFetchBrokerReviews,
  adminModerateBrokerReview,
  type AdminBrokerReviewRow,
} from '../../../services/brokerReviewService';
import { TableBodySkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  GhostButton, FilterBar, FilterSelect, SearchInput, FilterCount, PrimaryButton,
  TableCard, DataTable, Th, Td, Tr, Pill, ErrorBanner, adminColors,
  Pagination, PageButtons, PageBtn, ActionGroup,
} from '../../../components/AdminPanel/adminUi';

const Comment = styled.div`
  max-width: 320px;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: ${adminColors.text};
  word-break: break-word;
`;

const Stars = styled.span`
  font-weight: 800;
  color: ${adminColors.navy};
`;

const NoteInput = styled.input`
  min-width: 140px;
  padding: 0.35rem 0.5rem;
  border: 1px solid ${adminColors.border};
  border-radius: 7px;
  font-size: 0.75rem;
  font-family: inherit;
`;

const statusPill = (s: string) => s;

const AdminBrokerReviews: React.FC = () => {
  const [status, setStatus] = useState('pending');
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<AdminBrokerReviewRow[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState<{
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalItems: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminFetchBrokerReviews({
        status: status || undefined,
        search,
        page,
        limit: 15,
      });
      setItems(data.items);
      setPendingCount(data.pendingCount);
      setPagination(data.pagination);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => { refresh(); }, [refresh]);

  const moderate = async (id: string, action: 'approve' | 'reject') => {
    try {
      await adminModerateBrokerReview(id, action, notes[id]);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this review permanently?')) return;
    await adminDeleteBrokerReview(id);
    await refresh();
  };

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiStar /> Broker reviews</PageTitle>
          <PageSubtitle>Approve trader reviews before they appear on broker pages</PageSubtitle>
        </PageTitleGroup>
        <GhostButton type="button" onClick={refresh}><FiRefreshCw /> Refresh</GhostButton>
      </PageHeader>

      <FilterBar>
        <FilterSelect value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </FilterSelect>
        <SearchInput>
          <FiSearch />
          <input
            placeholder="Search author, title, comment"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSearch(q.trim());
                setPage(1);
              }
            }}
          />
        </SearchInput>
        <GhostButton $sm type="button" onClick={() => { setSearch(q.trim()); setPage(1); }}>Search</GhostButton>
        <FilterCount>{pendingCount} awaiting moderation</FilterCount>
      </FilterBar>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <TableCard>
        <DataTable>
          <thead>
            <tr>
              <Th>Broker</Th>
              <Th>Trader</Th>
              <Th>Rating</Th>
              <Th>Review</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableBodySkeleton rows={6} cols={6} />
            ) : items.length === 0 ? (
              <Tr><Td colSpan={6} style={{ textAlign: 'center', padding: '1.5rem', color: adminColors.muted }}>No reviews in this filter.</Td></Tr>
            ) : (
              items.map((row) => (
                <Tr key={row.id}>
                  <Td>
                    <strong>{row.brokerName}</strong>
                    <div style={{ fontSize: 11, color: adminColors.muted }}>
                      {row.createdAt ? new Date(row.createdAt).toLocaleString() : ''}
                    </div>
                  </Td>
                  <Td>
                    {row.authorName}
                    {row.kycVerified ? <div style={{ fontSize: 11, color: '#047857' }}>KYC verified</div> : <div style={{ fontSize: 11, color: adminColors.muted }}>Unverified</div>}
                    {row.flagged ? <div style={{ fontSize: 11, color: '#c2410c' }}>Flagged{row.flagReason ? `: ${row.flagReason}` : ''}</div> : null}
                  </Td>
                  <Td><Stars>{row.rating} / 5</Stars></Td>
                  <Td>
                    {row.title ? <div style={{ fontWeight: 700, marginBottom: 4 }}>{row.title}</div> : null}
                    <Comment>{row.comment}</Comment>
                  </Td>
                  <Td><Pill $variant={statusPill(row.status)}>{row.status}</Pill></Td>
                  <Td>
                    <ActionGroup>
                      {row.status !== 'approved' && (
                        <PrimaryButton $sm type="button" onClick={() => moderate(row.id, 'approve')}>
                          <FiCheck /> Approve
                        </PrimaryButton>
                      )}
                      {row.status !== 'rejected' && (
                        <>
                          <NoteInput
                            placeholder="Reject reason"
                            value={notes[row.id] || ''}
                            onChange={(e) => setNotes((prev) => ({ ...prev, [row.id]: e.target.value }))}
                          />
                          <GhostButton $sm type="button" onClick={() => moderate(row.id, 'reject')}>
                            <FiX /> Reject
                          </GhostButton>
                        </>
                      )}
                      <GhostButton $sm type="button" onClick={() => remove(row.id)}><FiTrash2 /> Delete</GhostButton>
                    </ActionGroup>
                  </Td>
                </Tr>
              ))
            )}
          </tbody>
        </DataTable>
      </TableCard>

      {pagination && pagination.totalPages > 1 && (
        <Pagination>
          <PageButtons>
            <PageBtn type="button" disabled={!pagination.hasPreviousPage} onClick={() => setPage((p) => p - 1)}>Prev</PageBtn>
            <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
            <PageBtn type="button" disabled={!pagination.hasNextPage} onClick={() => setPage((p) => p + 1)}>Next</PageBtn>
          </PageButtons>
        </Pagination>
      )}
    </PageWrap>
  );
};

export default AdminBrokerReviews;
