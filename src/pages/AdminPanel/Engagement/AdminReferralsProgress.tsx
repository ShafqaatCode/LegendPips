import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiUserPlus, FiRefreshCw, FiSearch, FiMail, FiUsers, FiClock, FiSend, FiSettings, FiAward } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import {
  fetchAdminReferrals,
  type AdminReferralRow,
  type AdminReferralStats,
} from '../../../services/adminEngagementService';
import {
  fetchAdminAffiliateMembers,
  fetchAdminAffiliateOverview,
  fetchAdminAffiliateSettings,
  patchAdminAffiliateTier,
  saveAdminAffiliateSettings,
} from '../../../services/affiliateService';
import { TableBodySkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  GhostButton, PrimaryButton, FilterBar, SearchInput, FilterCount,
  TableCard, DataTable, Th, Td, Tr, Pill, ErrorBanner, adminColors,
  Pagination, PageButtons, PageBtn,
  StatsGrid, StatIconBox, StatBody, StatValue, StatLabel,
} from '../../../components/AdminPanel/adminUi';

const TabRow = styled.div`
  display: flex;
  gap: 0.4rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const TabBtn = styled.button<{ $active?: boolean }>`
  border: 1px solid ${({ $active }) => ($active ? adminColors.navy : adminColors.border)};
  background: ${({ $active }) => ($active ? adminColors.navy : 'white')};
  color: ${({ $active }) => ($active ? 'white' : adminColors.navy)};
  border-radius: 999px;
  padding: 0.4rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
`;

const TierGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
`;

const TierCard = styled.div`
  border: 1px solid ${adminColors.border};
  border-radius: 12px;
  padding: 0.85rem;
  background: #f8fafc;
  h4 { margin: 0 0 0.55rem; text-transform: capitalize; color: ${adminColors.navy}; font-size: 0.875rem; }
  label { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.65rem; font-weight: 700; color: ${adminColors.muted}; margin-bottom: 0.45rem; text-transform: uppercase; }
  input { padding: 0.4rem 0.5rem; border-radius: 8px; border: 1px solid ${adminColors.border}; font-size: 0.8125rem; }
`;

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
  const [tab, setTab] = useState<'invites' | 'affiliates' | 'settings'>('invites');
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
  const [affOverview, setAffOverview] = useState<any>(null);
  const [affMembers, setAffMembers] = useState<any[]>([]);
  const [affPage, setAffPage] = useState(1);
  const [affQ, setAffQ] = useState('');
  const [settingsEnabled, setSettingsEnabled] = useState(true);
  const [tiers, setTiers] = useState<Record<string, any>>({});
  const [savingSettings, setSavingSettings] = useState(false);

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

  const refreshAffiliate = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [ov, members] = await Promise.all([
        fetchAdminAffiliateOverview(),
        fetchAdminAffiliateMembers(affPage, 25, affQ || undefined),
      ]);
      setAffOverview(ov);
      setAffMembers(members.items || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load affiliates');
    } finally {
      setLoading(false);
    }
  }, [affPage, affQ]);

  const refreshSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const s = await fetchAdminAffiliateSettings();
      setSettingsEnabled(!!s.enabled);
      setTiers(s.tiers || {});
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'invites') refresh();
    if (tab === 'affiliates') refreshAffiliate();
    if (tab === 'settings') refreshSettings();
  }, [tab, refresh, refreshAffiliate, refreshSettings]);

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiUserPlus /> Referrals & Affiliates</PageTitle>
          <PageSubtitle>
            Email invites, 2-level affiliate network, tiers, and commission settings
          </PageSubtitle>
        </PageTitleGroup>
        <GhostButton
          type="button"
          onClick={() => {
            if (tab === 'invites') refresh();
            if (tab === 'affiliates') refreshAffiliate();
            if (tab === 'settings') refreshSettings();
          }}
          disabled={loading}
        >
          <FiRefreshCw /> Refresh
        </GhostButton>
      </PageHeader>

      <TabRow>
        <TabBtn $active={tab === 'invites'} type="button" onClick={() => setTab('invites')}>
          <FiMail style={{ marginRight: 4 }} /> Invites
        </TabBtn>
        <TabBtn $active={tab === 'affiliates'} type="button" onClick={() => setTab('affiliates')}>
          <FiAward style={{ marginRight: 4 }} /> Affiliates
        </TabBtn>
        <TabBtn $active={tab === 'settings'} type="button" onClick={() => setTab('settings')}>
          <FiSettings style={{ marginRight: 4 }} /> Commission settings
        </TabBtn>
      </TabRow>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      {tab === 'affiliates' && (
        <>
          <StatsGrid style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'contents' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '0.9rem 1rem', background: 'white', border: `1px solid ${adminColors.border}`, borderRadius: 14 }}>
                <StatIconBox $color="#3b82f6"><FiUsers /></StatIconBox>
                <StatBody>
                  <StatValue>{affOverview?.membersWithCode ?? '—'}</StatValue>
                  <StatLabel>Members with codes</StatLabel>
                </StatBody>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '0.9rem 1rem', background: 'white', border: `1px solid ${adminColors.border}`, borderRadius: 14 }}>
                <StatIconBox $color="#059669"><FiSend /></StatIconBox>
                <StatBody>
                  <StatValue>{affOverview?.attributedUsers ?? '—'}</StatValue>
                  <StatLabel>Attributed signups</StatLabel>
                </StatBody>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '0.9rem 1rem', background: 'white', border: `1px solid ${adminColors.border}`, borderRadius: 14 }}>
                <StatIconBox $color="#Fbbf24"><FiClock /></StatIconBox>
                <StatBody>
                  <StatValue>${((affOverview?.earningsTotalCents || 0) / 100).toFixed(2)}</StatValue>
                  <StatLabel>Commissions paid</StatLabel>
                </StatBody>
              </div>
            </div>
          </StatsGrid>
          <FilterBar>
            <SearchInput style={{ maxWidth: 320, flex: 1 }}>
              <FiSearch />
              <input
                placeholder="Search email / code / name"
                value={affQ}
                onChange={(e) => setAffQ(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') setAffPage(1); }}
              />
            </SearchInput>
            <GhostButton $sm type="button" onClick={() => { setAffPage(1); refreshAffiliate(); }}>Search</GhostButton>
          </FilterBar>
          <TableCard>
            <DataTable>
              <thead>
                <tr>
                  <Th>Member</Th>
                  <Th>Code</Th>
                  <Th>Tier</Th>
                  <Th>Direct refs</Th>
                  <Th>Joined</Th>
                </tr>
              </thead>
              <tbody>
                {loading && <TableBodySkeleton rows={5} cols={5} />}
                {!loading && affMembers.map((m) => (
                  <Tr key={m.id}>
                    <Td>
                      <button type="button" style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }} onClick={() => navigate(`/admin-panel/users/${m.id}`)}>
                        <div style={{ fontWeight: 700, color: adminColors.navy }}>{m.name}</div>
                        <div style={{ fontSize: 12, color: adminColors.muted }}>{m.email}</div>
                      </button>
                    </Td>
                    <Td><code>{m.referralCode || '—'}</code></Td>
                    <Td>
                      <select
                        value={m.tier}
                        onChange={async (e) => {
                          try {
                            await patchAdminAffiliateTier(m.id, e.target.value);
                            refreshAffiliate();
                          } catch (err) {
                            alert(err instanceof Error ? err.message : 'Failed');
                          }
                        }}
                        style={{ padding: '0.3rem 0.45rem', borderRadius: 8, border: `1px solid ${adminColors.border}` }}
                      >
                        {['bronze', 'silver', 'gold', 'platinum', 'vip'].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </Td>
                    <Td>{m.directReferrals}</Td>
                    <Td style={{ fontSize: 12 }}>{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '—'}</Td>
                  </Tr>
                ))}
                {!loading && affMembers.length === 0 && (
                  <Tr><Td colSpan={5} style={{ textAlign: 'center', color: adminColors.muted, padding: '1.5rem' }}>No affiliate members yet.</Td></Tr>
                )}
              </tbody>
            </DataTable>
          </TableCard>
        </>
      )}

      {tab === 'settings' && (
        <TableCard style={{ padding: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontWeight: 700, color: adminColors.navy }}>
            <input type="checkbox" checked={settingsEnabled} onChange={(e) => setSettingsEnabled(e.target.checked)} />
            Affiliate program enabled
          </label>
          <TierGrid>
            {['bronze', 'silver', 'gold', 'platinum', 'vip'].map((tier) => {
              const row = tiers[tier] || {};
              const setField = (key: string, value: number) => {
                setTiers((prev) => ({ ...prev, [tier]: { ...prev[tier], [key]: value } }));
              };
              return (
                <TierCard key={tier}>
                  <h4>{tier}</h4>
                  <label>L1 signup $
                    <input type="number" step="0.01" value={(Number(row.l1SignupCents || 0) / 100)} onChange={(e) => setField('l1SignupCents', Math.round(Number(e.target.value) * 100))} />
                  </label>
                  <label>L2 signup $
                    <input type="number" step="0.01" value={(Number(row.l2SignupCents || 0) / 100)} onChange={(e) => setField('l2SignupCents', Math.round(Number(e.target.value) * 100))} />
                  </label>
                  <label>L1 rebate share %
                    <input type="number" value={Number(row.l1RebateSharePct || 0)} onChange={(e) => setField('l1RebateSharePct', Number(e.target.value))} />
                  </label>
                  <label>L2 rebate share %
                    <input type="number" value={Number(row.l2RebateSharePct || 0)} onChange={(e) => setField('l2RebateSharePct', Number(e.target.value))} />
                  </label>
                  <label>Min direct referrals
                    <input type="number" value={Number(row.minDirectReferrals || 0)} onChange={(e) => setField('minDirectReferrals', Number(e.target.value))} />
                  </label>
                </TierCard>
              );
            })}
          </TierGrid>
          <PrimaryButton
            type="button"
            style={{ marginTop: 16 }}
            disabled={savingSettings}
            onClick={async () => {
              try {
                setSavingSettings(true);
                await saveAdminAffiliateSettings({ enabled: settingsEnabled, tiers });
                alert('Affiliate settings saved');
              } catch (e) {
                alert(e instanceof Error ? e.message : 'Save failed');
              } finally {
                setSavingSettings(false);
              }
            }}
          >
            Save commission settings
          </PrimaryButton>
        </TableCard>
      )}

      {tab === 'invites' && (
        <>
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
        </>
      )}
    </PageWrap>
  );
};

export default AdminReferralsProgress;
