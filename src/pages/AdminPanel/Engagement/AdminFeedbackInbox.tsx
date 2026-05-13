import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiInbox, FiTrash2, FiEye, FiArchive, FiRefreshCw } from 'react-icons/fi';
import {
  fetchAdminFeedback,
  patchFeedbackStatus,
  deleteFeedbackAdmin,
  type AdminFeedbackRow,
} from '../../../services/adminEngagementService';

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
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #132e58;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
`;

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  font-size: 0.875rem;
  color: #132e58;
`;

const Button = styled.button<{ $danger?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  border: 2px solid ${({ $danger }) => ($danger ? '#fecaca' : '#e5e7eb')};
  background: ${({ $danger }) => ($danger ? '#fef2f2' : 'white')};
  color: ${({ $danger }) => ($danger ? '#b91c1c' : '#132e58')};
  &:hover {
    border-color: #132e58;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TableWrap = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.85rem 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #6b7280;
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 0.85rem 1rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
`;

const Badge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${({ $status }) =>
    $status === 'new' ? '#fef3c7' : $status === 'read' ? '#e0f2fe' : '#f3f4f6'};
  color: ${({ $status }) =>
    $status === 'new' ? '#b45309' : $status === 'read' ? '#0369a1' : '#4b5563'};
`;

const Msg = styled.div`
  max-width: 360px;
  white-space: pre-wrap;
  word-break: break-word;
`;

const RowActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const ErrorBox = styled.div`
  background: #fef2f2;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

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

  useEffect(() => {
    refresh();
  }, [refresh]);

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

  return (
    <Container>
      <Header>
        <Title>
          <FiInbox /> Feedback inbox
        </Title>
        <Toolbar>
          <Select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
          >
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="archived">Archived</option>
          </Select>
          <Button type="button" onClick={refresh} disabled={loading}>
            <FiRefreshCw /> Refresh
          </Button>
        </Toolbar>
      </Header>

      {error && <ErrorBox>{error}</ErrorBox>}

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>When</Th>
              <Th>Email</Th>
              <Th>User</Th>
              <Th>Message</Th>
              <Th>Page</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <Td colSpan={7}>Loading…</Td>
              </tr>
            )}
            {!loading &&
              items.map((row) => {
                const id = row._id;
                return (
                  <tr key={id}>
                    <Td>{row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}</Td>
                    <Td>{row.email}</Td>
                    <Td>{userLabel(row)}</Td>
                    <Td>
                      <Msg>{row.message}</Msg>
                    </Td>
                    <Td>{row.page || '—'}</Td>
                    <Td>
                      <Badge $status={row.status}>{row.status}</Badge>
                    </Td>
                    <Td>
                      <RowActions>
                        {row.status !== 'read' && (
                          <Button type="button" onClick={() => setStatus(id, 'read')}>
                            <FiEye /> Read
                          </Button>
                        )}
                        {row.status !== 'archived' && (
                          <Button type="button" onClick={() => setStatus(id, 'archived')}>
                            <FiArchive /> Archive
                          </Button>
                        )}
                        {row.status !== 'new' && (
                          <Button type="button" onClick={() => setStatus(id, 'new')}>
                            New
                          </Button>
                        )}
                        <Button type="button" $danger onClick={() => remove(id)}>
                          <FiTrash2 /> Delete
                        </Button>
                      </RowActions>
                    </Td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
        {pagination && (
          <Pagination>
            <span>
              Page {pagination.currentPage} / {pagination.totalPages || 1}
            </span>
            <Button
              type="button"
              disabled={!pagination.hasPreviousPage}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <Button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </Pagination>
        )}
      </TableWrap>
    </Container>
  );
};

export default AdminFeedbackInbox;
