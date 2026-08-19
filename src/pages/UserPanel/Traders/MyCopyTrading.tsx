import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShare2 } from 'react-icons/fi';
import {
  fetchMyCopying, fetchMyFollowers, patchCopyRequest,
  type CopyRequestRow, type CopyRequestStatus,
} from '../../../services/traderService';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle, HintBar, ErrorBanner,
  TableCard, DataTable, Th, Td, EmptyCell, GhostButton, Pill, Toolbar,
} from '../../../components/UserPanel/userUi';

const MyCopyTrading: React.FC = () => {
  const [tab, setTab] = useState<'copying' | 'followers'>('copying');
  const [copying, setCopying] = useState<CopyRequestRow[]>([]);
  const [followers, setFollowers] = useState<CopyRequestRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [a, b] = await Promise.all([fetchMyCopying(), fetchMyFollowers()]);
      setCopying(a);
      setFollowers(b);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const act = async (id: string, status: CopyRequestStatus) => {
    try {
      await patchCopyRequest(id, status);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Update failed');
    }
  };

  const rows = tab === 'copying' ? copying : followers;

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle><FiShare2 /> Copy trading</PageTitle>
        <PageSubtitle>Marketplace requests only — LegendPips does not auto-copy trades on your broker.</PageSubtitle>
      </PageHeader>
      <HintBar>
        Browse the <Link to="/copy-trading">copy marketplace</Link> or publish your offer from{' '}
        <Link to="/user-panel/trader-profile">your trader profile</Link>.
      </HintBar>
      {error && <ErrorBanner>{error}</ErrorBanner>}
      <Toolbar>
        <GhostButton $sm type="button" onClick={() => setTab('copying')} style={tab === 'copying' ? { background: '#132E58', color: '#fff' } : undefined}>
          I copy ({copying.length})
        </GhostButton>
        <GhostButton $sm type="button" onClick={() => setTab('followers')} style={tab === 'followers' ? { background: '#132E58', color: '#fff' } : undefined}>
          Copying me ({followers.length})
        </GhostButton>
      </Toolbar>
      <TableCard>
        <DataTable>
          <thead>
            <tr>
              <Th>When</Th>
              <Th>{tab === 'copying' ? 'Trader' : 'Follower'}</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><EmptyCell colSpan={5}>No requests yet.</EmptyCell></tr>
            )}
            {rows.map((row) => {
              const person = tab === 'copying' ? row.trader : row.follower;
              const name = row.profile?.displayName || `${person?.firstName || ''} ${person?.lastName || ''}`.trim() || '—';
              return (
                <tr key={row.id}>
                  <Td style={{ fontSize: '0.75rem' }}>{row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}</Td>
                  <Td>
                    {tab === 'copying' && row.profile?.id ? <Link to={`/traders/${row.profile.id}`}>{name}</Link> : name}
                  </Td>
                  <Td>${row.amountUsd}</Td>
                  <Td><Pill $variant={row.status === 'accepted' ? 'approved' : row.status}>{row.status}</Pill></Td>
                  <Td>
                    {tab === 'copying' && row.status === 'pending' && (
                      <GhostButton $sm type="button" onClick={() => act(row.id, 'cancelled')}>Cancel</GhostButton>
                    )}
                    {tab === 'copying' && (row.status === 'accepted' || row.status === 'paused') && (
                      <GhostButton $sm type="button" onClick={() => act(row.id, 'cancelled')}>Stop</GhostButton>
                    )}
                    {tab === 'followers' && row.status === 'pending' && (
                      <>
                        <GhostButton $sm type="button" onClick={() => act(row.id, 'accepted')}>Accept</GhostButton>
                        <GhostButton $sm type="button" onClick={() => act(row.id, 'declined')}>Decline</GhostButton>
                      </>
                    )}
                    {tab === 'followers' && row.status === 'accepted' && (
                      <GhostButton $sm type="button" onClick={() => act(row.id, 'paused')}>Pause</GhostButton>
                    )}
                    {tab === 'followers' && row.status === 'paused' && (
                      <GhostButton $sm type="button" onClick={() => act(row.id, 'accepted')}>Resume</GhostButton>
                    )}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </DataTable>
      </TableCard>
    </PageWrap>
  );
};

export default MyCopyTrading;
