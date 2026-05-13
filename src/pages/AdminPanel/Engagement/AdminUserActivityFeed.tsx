import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiActivity, FiRefreshCw } from 'react-icons/fi';
import { fetchAdminActivityFeed, type AdminActivityFeedRow } from '../../../services/adminEngagementService';

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

const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  font-size: 0.875rem;
  min-width: 220px;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  border: 2px solid #e5e7eb;
  background: white;
  color: #132e58;
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
  min-width: 800px;
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

const TypeBadge = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #0369a1;
  background: #e0f2fe;
  padding: 0.2rem 0.45rem;
  border-radius: 6px;
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

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <Container>
      <Header>
        <Title>
          <FiActivity /> User activity feed
        </Title>
        <Toolbar>
          <Input
            placeholder="Filter by user MongoDB id"
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
          />
          <Button
            type="button"
            onClick={() => {
              setPage(1);
              setAppliedUserId(userIdFilter.trim());
            }}
          >
            Apply filter
          </Button>
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
              <Th>User</Th>
              <Th>Type</Th>
              <Th>Title</Th>
              <Th>Description</Th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <Td colSpan={5}>Loading…</Td>
              </tr>
            )}
            {!loading &&
              items.map((row) => (
                <tr key={row.id}>
                  <Td>{row.time}</Td>
                  <Td>
                    <div style={{ fontWeight: 600 }}>{row.userLabel}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{row.userId || '—'}</div>
                  </Td>
                  <Td>
                    <TypeBadge>{row.type}</TypeBadge>
                  </Td>
                  <Td>{row.title}</Td>
                  <Td>{row.description}</Td>
                </tr>
              ))}
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

export default AdminUserActivityFeed;
