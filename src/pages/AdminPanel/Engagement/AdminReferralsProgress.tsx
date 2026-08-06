import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiUserPlus, FiRefreshCw, FiSearch, FiMail, FiUsers, FiClock, FiSend } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import {
  fetchAdminReferrals,
  type AdminReferralRow,
  type AdminReferralStats,
} from '../../../services/adminEngagementService';
import { TableBodySkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  GhostButton, FilterBar, SearchInput, FilterCount,
  TableCard, DataTable, Th, Td, Tr, Pill, ErrorBanner, adminColors,
  Pagination, PageButtons, PageBtn,
  StatsGrid, StatIconBox, StatBody, StatValue, StatLabel,
} from '../../../components/AdminPanel/adminUi';

const MetricCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem 1.05rem;
  background: ${adminColors.card};
  border: 1px solid ${adminColors.border};
  border-radius: 14px;
  box-shadow: ${adminColors.shadow};
`;

const HeroNote = styled.div`
  background:
    radial-gradient(ellipse 70% 120% at 100% 0%, rgba(251, 191, 36, 0.12) 0%, transparent 55%),
    linear-gradient(125deg, #0c1f3d 0%, ${adminColors.navy} 50%, ${adminColors.navyLight} 100%);
  border-radius: 16px;
  padding: 1.1rem 1.25rem;
  color: white;
  box-shadow: 0 10px 28px rgba(12, 31, 61, 0.22);
  margin-bottom: 1rem;
  h3 { margin: 0 0 0.25rem; font-size: 1rem; font-weight: 800; }
  p { margin: 0; font-size: 0.8125rem; opacity: 0.88; line-height: 1.45; }
  a { color: ${adminColors.gold}; font-weight: 700; }
`;

const InviterCell = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  text-align: left;
  cursor: pointer;

  .name {
    font-weight: 700;
    color: ${adminColors.navy};
    font-size: 0.8125rem;
  }
  .email {
    font-size: 0.6875rem;
    color: ${adminColors.muted};
    margin-top: 0.1rem;
  }

  &:hover .name {
    text-decoration: underline;
  }
`;

const emptyStats: AdminReferralStats = {
  total: 0,
  last24h: 0,
  last7d: 0,
  uniqueInviters: 0,
};

const AdminReferralsProgress: React.FC = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [appliedQ, setAppliedQ] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<AdminReferralRow[]>([]);
  const [stats, setStats] = useState<AdminReferralStats>(emptyStats);
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
      const data = await fetchAdminReferrals(page, 25, appliedQ || undefined);
      setItems(data.items || []);
      setStats(data.stats || emptyStats);
      setPagination(data.pagination || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load referrals');
    } finally {
      setLoading(false);
    }
  }, [page, appliedQ]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiUserPlus /> Referrals</PageTitle>
          <PageSubtitle>
            Full progress of friend invites — who invited whom, which template, and when
          </PageSubtitle>
        </PageTitleGroup>
        <GhostButton type="button" onClick={refresh} disabled={loading}>
          <FiRefreshCw /> Refresh
        </GhostButton>
      </PageHeader>

      <HeroNote>
        <h3>Invite tracking</h3>
        <p>
          Members send invitations from the user portal. Emails go out from your SMTP
          configuration and always include the live site at{' '}
          <a href="https://legendpips.com" target="_blank" rel="noreferrer">
            legendpips.com
          </a>{' '}
          with register link <strong>legendpips.com/register</strong>.
        </p>
      </HeroNote>

      <StatsGrid>
        <MetricCard>
          <StatIconBox $color="#2563eb"><FiSend /></StatIconBox>
          <StatBody>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total invites</StatLabel>
          </StatBody>
        </MetricCard>
        <MetricCard>
          <StatIconBox $color="#d97706"><FiClock /></StatIconBox>
          <StatBody>
            <StatValue>{stats.last24h}</StatValue>
            <StatLabel>Last 24 hours</StatLabel>
          </StatBody>
        </MetricCard>
        <MetricCard>
          <StatIconBox $color="#059669"><FiMail /></StatIconBox>
          <StatBody>
            <StatValue>{stats.last7d}</StatValue>
            <StatLabel>Last 7 days</StatLabel>
          </StatBody>
        </MetricCard>
        <MetricCard>
          <StatIconBox $color="#7c3aed"><FiUsers /></StatIconBox>
          <StatBody>
            <StatValue>{stats.uniqueInviters}</StatValue>
            <StatLabel>Unique inviters</StatLabel>
          </StatBody>
        </MetricCard>
      </StatsGrid>

      <FilterBar>
        <SearchInput style={{ maxWidth: 360, flex: 1 }}>
          <FiSearch />
          <input
            placeholder="Search inviter, friend email, name…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setPage(1);
                setAppliedQ(q.trim());
              }
            }}
          />
        </SearchInput>
        <GhostButton
          $sm
          type="button"
          onClick={() => { setPage(1); setAppliedQ(q.trim()); }}
        >
          Search
        </GhostButton>
        {appliedQ && (
          <GhostButton $sm type="button" onClick={() => { setQ(''); setAppliedQ(''); setPage(1); }}>
            Clear
          </GhostButton>
        )}
        <FilterCount>
          {loading ? 'Loading…' : `${pagination?.totalItems ?? items.length} invites`}
        </FilterCount>
      </FilterBar>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <TableCard>
        <DataTable>
          <thead>
            <tr>
              <Th>When</Th>
              <Th>Member (inviter)</Th>
              <Th>Friend email</Th>
              <Th>Template</Th>
              <Th>Subject</Th>
            </tr>
          </thead>
          <tbody>
            {loading && <TableBodySkeleton rows={8} cols={5} />}
            {!loading && items.map((row) => (
              <Tr key={row.id}>
                <Td style={{ whiteSpace: 'nowrap', fontSize: '0.75rem', color: adminColors.muted }}>
                  {row.time || (row.createdAt
                    ? new Date(row.createdAt).toLocaleString()
                    : '—')}
                  {row.createdAt && (
                    <div style={{ fontSize: '0.65rem', marginTop: 2 }}>
                      {new Date(row.createdAt).toLocaleString()}
                    </div>
                  )}
                </Td>
                <Td>
                  <InviterCell
                    type="button"
                    onClick={() => {
                      if (row.fromUser?.id) navigate(`/admin-panel/users/${row.fromUser.id}`);
                    }}
                  >
                    <div className="name">{row.fromUser?.name || 'User'}</div>
                    <div className="email">{row.fromUser?.email || '—'}</div>
                  </InviterCell>
                </Td>
                <Td>
                  <div style={{ fontWeight: 700, color: adminColors.navy, fontSize: '0.8125rem' }}>
                    {row.toEmail}
                  </div>
                  {row.friendName ? (
                    <div style={{ fontSize: '0.6875rem', color: adminColors.muted }}>{row.friendName}</div>
                  ) : null}
                </Td>
                <Td><Pill $variant="user">{row.templateTitle || row.templateId}</Pill></Td>
                <Td style={{ fontSize: '0.8125rem', color: adminColors.muted, maxWidth: 280 }}>
                  {row.subject}
                </Td>
              </Tr>
            ))}
            {!loading && items.length === 0 && (
              <Tr>
                <Td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: adminColors.muted }}>
                  No referral invites yet. They appear here when members send invites from the user portal.
                </Td>
              </Tr>
            )}
          </tbody>
        </DataTable>
        {pagination && (
          <Pagination>
            <span style={{ fontSize: '0.75rem', color: adminColors.muted }}>
              Page {pagination.currentPage} / {pagination.totalPages || 1}
            </span>
            <PageButtons>
              <PageBtn
                type="button"
                disabled={!pagination.hasPreviousPage}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </PageBtn>
              <PageBtn
                type="button"
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </PageBtn>
            </PageButtons>
          </Pagination>
        )}
      </TableCard>
    </PageWrap>
  );
};

export default AdminReferralsProgress;
