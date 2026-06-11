import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiTrendingDown, FiLock, FiCalendar, FiEye } from 'react-icons/fi';
import { fetchPublicSignals, trackSignalView, type ApiSignal } from '../../../services/signalService';
import { SignalsTableSkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle,
  TableCard, DataTable, Th, Td, Tr, EmptyCell,
  ErrorBanner, GhostButton, Pill,
} from '../../../components/UserPanel/userUi';

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
    return () => { cancelled = true; };
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
    <PageWrap>
      <PageHeader>
        <PageTitle><FiTrendingUp /> My Signals</PageTitle>
        <PageSubtitle>Published signals — log views to track activity</PageSubtitle>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <TableCard>
        <DataTable>
          <thead>
            <tr>
              <Th>Pair</Th>
              <Th>Type</Th>
              <Th>Entry / TP / SL</Th>
              <Th>Status</Th>
              <Th>Date</Th>
              <Th>Log</Th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><EmptyCell colSpan={6}><SignalsTableSkeleton rows={5} /></EmptyCell></tr>
            )}
            {!loading && signals.length === 0 && !error && (
              <tr><EmptyCell colSpan={6}>No signals published yet.</EmptyCell></tr>
            )}
            {!loading && signals.map((signal) => {
              const uiStatus = displayStatus(signal.status);
              const dateStr = signal.createdAt ? new Date(signal.createdAt).toLocaleDateString() : '—';
              return (
                <Tr key={signal.id}>
                  <Td><strong style={{ color: '#132E58' }}>{signal.pair}</strong></Td>
                  <Td>
                    {signal.premium ? (
                      <Pill $variant="pending"><FiLock style={{ marginRight: 4 }} />Premium</Pill>
                    ) : (
                      <Pill $variant={signal.direction === 'buy' ? 'approved' : 'rejected'}>
                        {signal.direction === 'buy' ? <FiTrendingUp /> : <FiTrendingDown />}
                        {signal.direction.toUpperCase()}
                      </Pill>
                    )}
                  </Td>
                  <Td style={{ fontSize: '0.75rem', lineHeight: 1.5 }}>
                    {signal.entry} · TP {signal.tp} · SL {signal.sl}
                  </Td>
                  <Td><Pill $variant={uiStatus === 'open' ? 'approved' : 'incomplete'}>{uiStatus}</Pill></Td>
                  <Td style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}><FiCalendar style={{ marginRight: 4 }} />{dateStr}</Td>
                  <Td>
                    <GhostButton $sm type="button" disabled={loggingId === signal.id} onClick={() => onLogView(signal.id)}>
                      <FiEye /> {loggingId === signal.id ? '…' : 'Log'}
                    </GhostButton>
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </DataTable>
      </TableCard>
    </PageWrap>
  );
};

export default MySignals;
