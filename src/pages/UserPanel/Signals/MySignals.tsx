import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiTrendingUp, FiTrendingDown, FiLock, FiCalendar, FiFilter, FiEye } from 'react-icons/fi';
import { fetchPublicSignals, trackSignalView, type ApiSignal } from '../../../services/signalService';
import { SignalsTableSkeleton } from '../../../components/SharedComponents/Shimmer';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #132E58;
  margin: 0;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-weight: 600;
  color: #132E58;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #132E58;
    background: #f9fafb;
  }
`;

const SignalsTable = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr 1fr 0.8fr 0.9fr 1fr;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
  font-weight: 600;
  color: #132E58;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr 1fr 0.8fr 0.9fr 1fr;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f9fafb;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1rem;
  }
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #132E58;
  font-size: 0.9375rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: space-between;
    
    &::before {
      content: attr(data-label);
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      font-size: 0.75rem;
    }
  }
`;

const PairBadge = styled.span`
  background: #132E58;
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
`;

const ActionButton = styled.button<{ $type: 'buy' | 'sell' | 'locked' }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  ${({ $type }) => {
    if ($type === 'buy') {
      return `
        background: #10b981;
        color: white;
        &:hover { background: #059669; }
      `;
    }
    if ($type === 'sell') {
      return `
        background: #ef4444;
        color: white;
        &:hover { background: #dc2626; }
      `;
    }
    return `
      background: #f3f4f6;
      color: #6b7280;
      cursor: not-allowed;
    `;
  }}
`;

const ProfitBadge = styled.span<{ $positive?: boolean }>`
  color: ${({ $positive }) => ($positive ? '#10b981' : '#6b7280')};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $status }) => {
    if ($status === 'open') return '#10b98115';
    if ($status === 'closed') return '#6b728015';
    return '#Fbbf2415';
  }};
  color: ${({ $status }) => {
    if ($status === 'open') return '#10b981';
    if ($status === 'closed') return '#6b7280';
    return '#Fbbf24';
  }};
`;

const LogBtn = styled.button`
  padding: 0.4rem 0.65rem;
  border-radius: 8px;
  border: 2px solid #132e58;
  background: white;
  color: #132e58;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  &:hover {
    background: #132e58;
    color: white;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorBanner = styled.div`
  background: #fef2f2;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const EmptyHint = styled.p`
  color: #6b7280;
  padding: 1.5rem;
  margin: 0;
`;

const displayStatus = (s: ApiSignal['status']): 'open' | 'closed' | 'pending' => {
  if (s === 'active') return 'open';
  return s;
};

const MySignals: React.FC = () => {
  const [signals, setSignals] = useState<ApiSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggingId, setLoggingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPublicSignals({ limit: 50 });
        if (!cancelled) setSignals(data.items || []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load signals');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onLogView = async (id: string) => {
    try {
      setLoggingId(id);
      await trackSignalView(id);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Sign in required to log signal views.');
    } finally {
      setLoggingId(null);
    }
  };

  return (
    <Container>
      <Header>
        <Title>My Signals</Title>
        <FilterButton type="button">
          <FiFilter />
          Filter
        </FilterButton>
      </Header>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <SignalsTable>
        <TableHeader>
          <div>Pair</div>
          <div>Type</div>
          <div>Entry / TP / SL</div>
          <div>Status</div>
          <div>Profit</div>
          <div>Date</div>
          <div>Activity</div>
        </TableHeader>
        {loading && <SignalsTableSkeleton rows={6} />}
        {!loading && signals.length === 0 && !error && (
          <EmptyHint>No signals published yet. Check back soon or browse the Signals page.</EmptyHint>
        )}
        {!loading &&
          signals.map((signal) => {
            const uiStatus = displayStatus(signal.status);
            const dateStr = signal.createdAt
              ? new Date(signal.createdAt).toLocaleDateString()
              : '—';
            return (
              <TableRow key={signal.id}>
                <TableCell data-label="Pair">
                  <PairBadge>{signal.pair}</PairBadge>
                </TableCell>
                <TableCell data-label="Type">
                  <ActionButton
                    $type={signal.premium ? 'locked' : signal.direction}
                    disabled={signal.premium}
                  >
                    {signal.premium ? (
                      <>
                        <FiLock />
                        Premium
                      </>
                    ) : (
                      <>
                        {signal.direction === 'buy' ? <FiTrendingUp /> : <FiTrendingDown />}
                        {signal.direction.toUpperCase()}
                      </>
                    )}
                  </ActionButton>
                </TableCell>
                <TableCell data-label="Entry / TP / SL">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
                    <span>Entry: {signal.entry}</span>
                    <span>TP: {signal.tp}</span>
                    <span>SL: {signal.sl}</span>
                  </div>
                </TableCell>
                <TableCell data-label="Status">
                  <StatusBadge $status={uiStatus}>
                    {uiStatus.charAt(0).toUpperCase() + uiStatus.slice(1)}
                  </StatusBadge>
                </TableCell>
                <TableCell data-label="Profit">
                  <ProfitBadge $positive>—</ProfitBadge>
                </TableCell>
                <TableCell data-label="Date">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiCalendar />
                    {dateStr}
                  </div>
                </TableCell>
                <TableCell data-label="Activity">
                  <LogBtn
                    type="button"
                    disabled={loggingId === signal.id}
                    onClick={() => onLogView(signal.id)}
                    title="Records on your Activity feed (requires login)"
                  >
                    <FiEye />
                    {loggingId === signal.id ? '…' : 'Log view'}
                  </LogBtn>
                </TableCell>
              </TableRow>
            );
          })}
      </SignalsTable>
    </Container>
  );
};

export default MySignals;
