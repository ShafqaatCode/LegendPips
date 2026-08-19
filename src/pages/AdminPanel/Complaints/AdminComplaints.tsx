import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiAlertTriangle, FiRefreshCw, FiTrash2, FiSearch } from 'react-icons/fi';
import {
  adminBlacklistFromComplaint,
  adminDeleteComplaint,
  adminFetchComplaints,
  adminUpdateComplaint,
  type BrokerComplaint,
  type ComplaintStatus,
} from '../../../services/complaintService';
import { TableBodySkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  GhostButton, FilterBar, FilterSelect, SearchInput, FilterCount, PrimaryButton,
  TableCard, DataTable, Th, Td, Tr, Pill, ErrorBanner, adminColors,
  Pagination, PageButtons, PageBtn, ActionGroup,
} from '../../../components/AdminPanel/adminUi';

const Details = styled.div`
  max-width: 280px;
  font-size: 0.8rem;
  line-height: 1.4;
  color: ${adminColors.text};
  word-break: break-word;
`;

const NoteInput = styled.input`
  min-width: 140px;
  padding: 0.35rem 0.5rem;
  border: 1px solid ${adminColors.border};
  border-radius: 7px;
  font-size: 0.75rem;
  font-family: inherit;
`;

const AdminComplaints: React.FC = () => {
  const [status, setStatus] = useState('pending');
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<BrokerComplaint[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [notes, setNotes] = useState<Record<string, string>>({});
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
      const data = await adminFetchComplaints({
        status: status || undefined,
        search,
        page,
        limit: 15,
      });
      setItems(data.items);
      setPendingCount(data.pendingCount);
      setPagination(data.pagination);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => { refresh(); }, [refresh]);

  const setStatusFor = async (id: string, next: ComplaintStatus) => {
    try {
      await adminUpdateComplaint(id, { status: next, adminNote: notes[id], resolution: notes[id] });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    }
  };

  const warn = async (id: string, on: boolean) => {
    try {
      await adminUpdateComplaint(id, { publicWarning: on });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    }
  };

  const blacklist = async (id: string, on: boolean) => {
    try {
      await adminBlacklistFromComplaint(id, { blacklisted: on, reason: notes[id] });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Blacklist failed');
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this complaint permanently?')) return;
    await adminDeleteComplaint(id);
    await refresh();
  };

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiAlertTriangle /> Broker complaints</PageTitle>
          <PageSubtitle>Investigate trader reports, resolve tickets, and maintain the public warning list</PageSubtitle>
        </PageTitleGroup>
        <GhostButton type="button" onClick={refresh}><FiRefreshCw /> Refresh</GhostButton>
      </PageHeader>

      <FilterBar>
        <FilterSelect value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </FilterSelect>
        <SearchInput>
          <FiSearch />
          <input
            placeholder="Ticket, broker, trader, subject"
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
        <FilterCount>{pendingCount} pending</FilterCount>
      </FilterBar>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <TableCard>
        <DataTable>
          <thead>
            <tr>
              <Th>Ticket</Th>
              <Th>Broker</Th>
              <Th>Trader</Th>
              <Th>Issue</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableBodySkeleton rows={6} cols={6} />
            ) : items.length === 0 ? (
              <Tr><Td colSpan={6} style={{ textAlign: 'center', padding: '1.5rem', color: adminColors.muted }}>No complaints in this filter.</Td></Tr>
            ) : (
              items.map((row) => (
                <Tr key={row.id}>
                  <Td>
                    <strong>{row.ticketId}</strong>
                    <div style={{ fontSize: 11, color: adminColors.muted }}>
                      {row.createdAt ? new Date(row.createdAt).toLocaleString() : ''}
                    </div>
                  </Td>
                  <Td>
                    {row.brokerName}
                    {row.publicWarning ? <div style={{ fontSize: 11, color: '#c2410c' }}>On warning list</div> : null}
                  </Td>
                  <Td>
                    {row.authorName}
                    <div style={{ fontSize: 11, color: adminColors.muted }}>{row.authorEmail}</div>
                  </Td>
                  <Td>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{row.category} · {row.subject}</div>
                    <Details>{row.details}</Details>
                  </Td>
                  <Td><Pill $variant={row.status === 'resolved' ? 'approved' : row.status === 'dismissed' ? 'rejected' : 'pending'}>{row.status}</Pill></Td>
                  <Td>
                    <ActionGroup>
                      <NoteInput
                        placeholder="Note / resolution"
                        value={notes[row.id] || ''}
                        onChange={(e) => setNotes((prev) => ({ ...prev, [row.id]: e.target.value }))}
                      />
                      {row.status === 'pending' && (
                        <PrimaryButton $sm type="button" onClick={() => setStatusFor(row.id, 'investigating')}>Investigate</PrimaryButton>
                      )}
                      {row.status !== 'resolved' && (
                        <PrimaryButton $sm type="button" onClick={() => setStatusFor(row.id, 'resolved')}>Resolve</PrimaryButton>
                      )}
                      {row.status !== 'dismissed' && (
                        <GhostButton $sm type="button" onClick={() => setStatusFor(row.id, 'dismissed')}>Dismiss</GhostButton>
                      )}
                      <GhostButton $sm type="button" onClick={() => warn(row.id, !row.publicWarning)}>
                        {row.publicWarning ? 'Remove warning' : 'Public warning'}
                      </GhostButton>
                      <GhostButton $sm type="button" onClick={() => blacklist(row.id, true)}>Blacklist broker</GhostButton>
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

export default AdminComplaints;
