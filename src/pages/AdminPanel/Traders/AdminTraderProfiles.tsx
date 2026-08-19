import React, { useCallback, useEffect, useState } from 'react';
import { FiCheck, FiRefreshCw, FiUsers } from 'react-icons/fi';
import {
  adminFetchCopyRequests, adminFetchTraders, adminModerateTrader,
  type CopyRequestRow, type TraderProfile, type TraderVerificationStatus,
} from '../../../services/traderService';
import { TableBodySkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  GhostButton, FilterBar, FilterCount, TableCard, DataTable, Th, Td, Tr, Pill, ErrorBanner, adminColors,
} from '../../../components/AdminPanel/adminUi';

const AdminTraderProfiles: React.FC = () => {
  const [tab, setTab] = useState<'profiles' | 'copy'>('profiles');
  const [status, setStatus] = useState('pending');
  const [items, setItems] = useState<TraderProfile[]>([]);
  const [copies, setCopies] = useState<CopyRequestRow[]>([]);
  const [copyStatus, setCopyStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminFetchTraders(1, status || undefined);
      setItems(data.items || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally { setLoading(false); }
  }, [status]);

  const loadCopies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminFetchCopyRequests(1, copyStatus || undefined);
      setCopies(data.items || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally { setLoading(false); }
  }, [copyStatus]);

  useEffect(() => {
    if (tab === 'profiles') loadProfiles();
    else loadCopies();
  }, [tab, loadProfiles, loadCopies]);

  const moderate = async (id: string, next: TraderVerificationStatus) => {
    const note = next === 'rejected' ? window.prompt('Rejection note (optional)') || '' : '';
    try {
      await adminModerateTrader(id, next, note.trim() || undefined);
      await loadProfiles();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed');
    }
  };

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiUsers /> Traders</PageTitle>
          <PageSubtitle>Verify performance profiles and review copy marketplace requests</PageSubtitle>
        </PageTitleGroup>
      </PageHeader>
      <FilterBar>
        <GhostButton $sm type="button" onClick={() => setTab('profiles')} style={tab === 'profiles' ? { background: '#132E58', color: '#fff' } : undefined}>Profiles</GhostButton>
        <GhostButton $sm type="button" onClick={() => setTab('copy')} style={tab === 'copy' ? { background: '#132E58', color: '#fff' } : undefined}>Copy requests</GhostButton>
      </FilterBar>
      {error && <ErrorBanner>{error}</ErrorBanner>}

      {tab === 'profiles' && (
        <>
          <FilterBar>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: '0.45rem 0.7rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
              <option value="draft">Draft</option>
            </select>
            <GhostButton $sm type="button" onClick={loadProfiles}><FiRefreshCw /> Refresh</GhostButton>
            <FilterCount>{loading ? 'Loading…' : `${items.length} profiles`}</FilterCount>
          </FilterBar>
          <TableCard>
            <DataTable>
              <thead>
                <tr>
                  <Th>Trader</Th>
                  <Th>Stats</Th>
                  <Th>Copy</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {loading && <TableBodySkeleton rows={5} cols={5} />}
                {!loading && items.map((row) => (
                  <Tr key={row.id}>
                    <Td>
                      <div style={{ fontWeight: 700, color: adminColors.navy }}>{row.displayName}</div>
                      <div style={{ fontSize: '0.7rem', color: adminColors.muted }}>{row.userEmail || row.userId}</div>
                    </Td>
                    <Td style={{ fontSize: '0.8rem' }}>
                      ROI {row.roiPercent ?? '—'}% · Win {row.winRatePercent ?? '—'}% · DD {row.maxDrawdownPercent ?? '—'}%
                    </Td>
                    <Td style={{ fontSize: '0.8rem' }}>{row.copyEnabled ? `Yes · fee ${row.copyFeePercent ?? 0}%` : 'No'}</Td>
                    <Td><Pill $variant={row.verificationStatus === 'verified' ? 'approved' : row.verificationStatus}>{row.verificationStatus}</Pill></Td>
                    <Td>
                      {row.verificationStatus !== 'verified' && (
                        <GhostButton $sm type="button" onClick={() => moderate(row.id, 'verified')}><FiCheck /> Verify</GhostButton>
                      )}
                      {row.verificationStatus !== 'rejected' && (
                        <GhostButton $sm type="button" onClick={() => moderate(row.id, 'rejected')}>Reject</GhostButton>
                      )}
                    </Td>
                  </Tr>
                ))}
                {!loading && items.length === 0 && (
                  <Tr><Td colSpan={5} style={{ textAlign: 'center', color: adminColors.muted, padding: '2rem' }}>No profiles.</Td></Tr>
                )}
              </tbody>
            </DataTable>
          </TableCard>
        </>
      )}

      {tab === 'copy' && (
        <>
          <FilterBar>
            <select value={copyStatus} onChange={(e) => setCopyStatus(e.target.value)} style={{ padding: '0.45rem 0.7rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="paused">Paused</option>
              <option value="declined">Declined</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <GhostButton $sm type="button" onClick={loadCopies}><FiRefreshCw /> Refresh</GhostButton>
            <FilterCount>{loading ? 'Loading…' : `${copies.length} requests`}</FilterCount>
          </FilterBar>
          <TableCard>
            <DataTable>
              <thead>
                <tr>
                  <Th>When</Th>
                  <Th>Follower</Th>
                  <Th>Trader</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {loading && <TableBodySkeleton rows={5} cols={5} />}
                {!loading && copies.map((row) => (
                  <Tr key={row.id}>
                    <Td style={{ fontSize: '0.75rem' }}>{row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}</Td>
                    <Td>{row.followerEmail || `${row.follower?.firstName || ''} ${row.follower?.lastName || ''}`}</Td>
                    <Td>{row.profile?.displayName || row.traderEmail}</Td>
                    <Td>${row.amountUsd}</Td>
                    <Td><Pill $variant={row.status === 'accepted' ? 'approved' : row.status}>{row.status}</Pill></Td>
                  </Tr>
                ))}
                {!loading && copies.length === 0 && (
                  <Tr><Td colSpan={5} style={{ textAlign: 'center', color: adminColors.muted, padding: '2rem' }}>No copy requests.</Td></Tr>
                )}
              </tbody>
            </DataTable>
          </TableCard>
        </>
      )}
    </PageWrap>
  );
};

export default AdminTraderProfiles;
