import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiDollarSign, FiRefreshCw } from 'react-icons/fi';
import { fetchMyRebateCredits, formatUsd, type RebateCreditRow } from '../../../services/rebateService';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #132E58;
  margin: 0 0 0.5rem 0;
`;

const Sub = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 0.95rem;
`;

const Summary = styled.div`
  background: linear-gradient(135deg, #132e58 0%, #1a4a7a 100%);
  color: white;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SummaryLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
`;

const SummaryValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.75rem;
`;

const IconBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  background: white;
  color: #132e58;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  &:hover {
    border-color: #132e58;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
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
  font-size: 0.9rem;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
`;

const ErrorBox = styled.div`
  background: #fef2f2;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const Empty = styled.p`
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  margin: 0;
`;

const MyRebates: React.FC = () => {
  const [items, setItems] = useState<RebateCreditRow[]>([]);
  const [totalCents, setTotalCents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMyRebateCredits(1, 50);
      setItems(data.items || []);
      setTotalCents(data.totalCents || 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Container>
      <Header>
        <Title>My Rebates</Title>
        <Sub>Cashback credits posted to your account appear here and in your dashboard totals.</Sub>
      </Header>

      {error && <ErrorBox>{error}</ErrorBox>}

      <Summary>
        <div>
          <SummaryLabel>Lifetime credited (this ledger)</SummaryLabel>
          <SummaryValue>
            <FiDollarSign />
            {formatUsd(totalCents)}
          </SummaryValue>
        </div>
      </Summary>

      <Toolbar>
        <IconBtn type="button" onClick={load} disabled={loading}>
          <FiRefreshCw /> Refresh
        </IconBtn>
      </Toolbar>

      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Amount</Th>
              <Th>Broker</Th>
              <Th>Note</Th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <Td colSpan={4}>Loading…</Td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <Td colSpan={4}>
                  <Empty>No rebate credits yet. Credits are added when your broker cashback is confirmed.</Empty>
                </Td>
              </tr>
            )}
            {!loading &&
              items.map((row) => (
                <tr key={row.id}>
                  <Td>{row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}</Td>
                  <Td style={{ fontWeight: 700, color: '#059669' }}>{formatUsd(row.amountCents)}</Td>
                  <Td>{row.brokerName || '—'}</Td>
                  <Td>{row.notes || '—'}</Td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default MyRebates;
