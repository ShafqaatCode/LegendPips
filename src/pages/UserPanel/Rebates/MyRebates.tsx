import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiRefreshCw } from 'react-icons/fi';
import { fetchMyRebateCredits, formatUsd, type RebateCreditRow } from '../../../services/rebateService';
import { TableBodySkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle, DashboardHero,
  HintBar, ErrorBanner, Toolbar, GhostButton,
  TableCard, DataTable, Th, Td, EmptyCell,
} from '../../../components/UserPanel/userUi';

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

  useEffect(() => { load(); }, [load]);

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle><FiDollarSign /> My Rebates</PageTitle>
        <PageSubtitle>Forex, crypto, and prop challenge cashback credits</PageSubtitle>
      </PageHeader>

      <HintBar>
        <strong>Prop rebates:</strong> buy through partner links on{' '}
        <Link to="/rebates" style={{ color: '#132E58', fontWeight: 600 }}>Prop Trading</Link>.
        Credits appear after purchase verification.
      </HintBar>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <DashboardHero>
        <div>
          <p style={{ margin: 0, fontSize: '0.6875rem', opacity: 0.85 }}>Lifetime credited</p>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiDollarSign />{formatUsd(totalCents)}</h1>
        </div>
      </DashboardHero>

      <Toolbar>
        <GhostButton $sm type="button" onClick={load} disabled={loading}><FiRefreshCw /> Refresh</GhostButton>
      </Toolbar>

      <TableCard>
        <DataTable>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Amount</Th>
              <Th>Type</Th>
              <Th>Firm</Th>
              <Th>Purchase</Th>
              <Th>Note</Th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><EmptyCell colSpan={6}><TableBodySkeleton rows={5} cols={6} /></EmptyCell></tr>
            )}
            {!loading && items.length === 0 && (
              <tr><EmptyCell colSpan={6}>No rebate credits yet.</EmptyCell></tr>
            )}
            {!loading && items.map((row) => (
              <tr key={row.id}>
                <Td style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                  {row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}
                </Td>
                <Td style={{ fontWeight: 700, color: '#059669' }}>{formatUsd(row.amountCents)}</Td>
                <Td style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>{row.rebateCategory || '—'}</Td>
                <Td style={{ fontSize: '0.75rem' }}>{row.brokerName || '—'}</Td>
                <Td style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>{row.purchaseType || '—'}</Td>
                <Td style={{ fontSize: '0.75rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.notes || '—'}</Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </TableCard>
    </PageWrap>
  );
};

export default MyRebates;
