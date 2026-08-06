import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FiDollarSign, FiRefreshCw, FiPlus, FiSearch, FiCheck } from 'react-icons/fi';
import SimpleModal from '../../../components/AdminPanel/SimpleModal';
import { fetchAdminRebateCredits, grantRebateAdmin, formatUsd, type RebateCreditRow } from '../../../services/rebateService';
import { TableBodySkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  PrimaryButton, GhostButton, FilterBar, SearchInput, FilterCount,
  TableCard, DataTable, Th, Td, Tr, ErrorBanner, Pill, adminColors,
} from '../../../components/AdminPanel/adminUi';

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
  @media (max-width: 700px) { grid-template-columns: 1fr; }
`;

const MiniStat = styled.div`
  background: white;
  border: 1px solid ${adminColors.border};
  border-radius: 14px;
  padding: 0.85rem 1rem;
  box-shadow: ${adminColors.shadow};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  .icon {
    width: 40px; height: 40px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center; font-size: 1.05rem;
  }
  .val { font-size: 1.25rem; font-weight: 800; color: ${adminColors.navy}; }
  .lbl { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: ${adminColors.muted}; }
`;

const FormField = styled.label`
  display: flex; flex-direction: column; gap: 0.35rem;
  font-size: 0.6875rem; font-weight: 700; color: ${adminColors.navy}; margin-bottom: 0.7rem;
  input, select, textarea {
    width: 100%; padding: 0.55rem 0.7rem; border-radius: 9px; border: 1px solid ${adminColors.border};
    font-size: 0.8125rem; font-weight: 400; outline: none; background: #fafbfc; box-sizing: border-box;
    &:focus { border-color: ${adminColors.navy}; box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.08); background: white; }
  }
  textarea { min-height: 72px; resize: vertical; }
`;

const AdminRebateCredits: React.FC = () => {
  const [items, setItems] = useState<RebateCreditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userFilter, setUserFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [appliedUserId, setAppliedUserId] = useState('');
  const [appliedEmail, setAppliedEmail] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formUserId, setFormUserId] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formUsd, setFormUsd] = useState('25');
  const [formBroker, setFormBroker] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formCategory, setFormCategory] = useState<'forex' | 'crypto' | 'prop' | ''>('');
  const [formPurchaseType, setFormPurchaseType] = useState<'first' | 'repeat' | ''>('');
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdminRebateCredits(
        1, 50, appliedUserId.trim() || undefined, appliedEmail.trim() || undefined
      );
      setItems(data.items || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [appliedUserId, appliedEmail]);

  useEffect(() => { refresh(); }, [refresh]);

  const totalUsd = useMemo(() => {
    return items.reduce((s, r) => s + (r.amountCents || 0), 0) / 100;
  }, [items]);

  const onGrant = async () => {
    const uid = formUserId.trim();
    const em = formEmail.trim();
    const usd = parseFloat(formUsd);
    if (!uid && !em) { alert('Enter a user id or account email.'); return; }
    if (!Number.isFinite(usd) || usd <= 0) { alert('Enter a positive USD amount.'); return; }
    try {
      setSaving(true);
      await grantRebateAdmin({
        ...(em ? { userEmail: em } : { userId: uid }),
        amountUsd: usd,
        brokerName: formBroker.trim() || undefined,
        notes: formNotes.trim() || undefined,
        rebateCategory: formCategory || undefined,
        purchaseType: formPurchaseType || undefined,
      });
      setModalOpen(false);
      setFormNotes('');
      setFormEmail('');
      await refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Grant failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiDollarSign /> Rebates</PageTitle>
          <PageSubtitle>Ledger of rebate credits and manual grants to accounts</PageSubtitle>
        </PageTitleGroup>
        <PrimaryButton type="button" onClick={() => {
          setFormUserId(appliedUserId || '');
          setFormEmail(appliedEmail || '');
          setModalOpen(true);
        }}>
          <FiPlus /> Grant rebate
        </PrimaryButton>
      </PageHeader>

      <StatsRow>
        <MiniStat>
          <div className="icon" style={{ background: '#d1fae5', color: '#059669' }}><FiDollarSign /></div>
          <div>
            <div className="val">{loading ? '…' : `$${totalUsd.toFixed(2)}`}</div>
            <div className="lbl">Page total</div>
          </div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: '#dbeafe', color: '#2563eb' }}><FiDollarSign /></div>
          <div>
            <div className="val">{loading ? '…' : items.length}</div>
            <div className="lbl">Credits listed</div>
          </div>
        </MiniStat>
        <MiniStat>
          <div className="icon" style={{ background: '#fef3c7', color: '#d97706' }}><FiPlus /></div>
          <div>
            <div className="val">Grant</div>
            <div className="lbl">Manual credit</div>
          </div>
        </MiniStat>
      </StatsRow>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <FilterBar>
        <SearchInput style={{ maxWidth: 240, flex: 1 }}>
          <FiSearch />
          <input placeholder="User MongoDB id" value={userFilter} onChange={(e) => setUserFilter(e.target.value)} />
        </SearchInput>
        <SearchInput style={{ maxWidth: 240, flex: 1 }}>
          <FiSearch />
          <input placeholder="Account email" value={emailFilter} onChange={(e) => setEmailFilter(e.target.value)} />
        </SearchInput>
        <GhostButton $sm type="button" onClick={() => { setAppliedUserId(userFilter.trim()); setAppliedEmail(emailFilter.trim()); }}>
          Apply
        </GhostButton>
        <GhostButton $sm type="button" onClick={refresh} disabled={loading}><FiRefreshCw /> Refresh</GhostButton>
        <FilterCount>{loading ? 'Loading…' : `${items.length} rows`}</FilterCount>
      </FilterBar>

      <TableCard>
        <DataTable>
          <thead>
            <tr>
              <Th>When</Th>
              <Th>User</Th>
              <Th>Amount</Th>
              <Th>Type</Th>
              <Th>Broker</Th>
              <Th>Purchase</Th>
              <Th>Note</Th>
            </tr>
          </thead>
          <tbody>
            {loading && <TableBodySkeleton rows={6} cols={7} />}
            {!loading && items.map((row) => (
              <Tr key={row.id}>
                <Td style={{ whiteSpace: 'nowrap', fontSize: '0.75rem', color: adminColors.muted }}>
                  {row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}
                </Td>
                <Td>
                  <div style={{ fontWeight: 700, color: adminColors.navy, fontSize: '0.8125rem' }}>{row.userLabel || '—'}</div>
                  <div style={{ fontSize: '0.6875rem', color: adminColors.muted }}>{row.userEmail || row.userId}</div>
                </Td>
                <Td style={{ fontWeight: 800, color: '#059669' }}>{formatUsd(row.amountCents)}</Td>
                <Td>{row.rebateCategory ? <Pill $variant="user">{row.rebateCategory}</Pill> : '—'}</Td>
                <Td style={{ fontSize: '0.8125rem' }}>{row.brokerName || '—'}</Td>
                <Td style={{ fontSize: '0.8125rem', textTransform: 'capitalize' }}>{row.purchaseType || '—'}</Td>
                <Td style={{ fontSize: '0.8125rem', color: adminColors.muted, maxWidth: 160 }}>{row.notes || '—'}</Td>
              </Tr>
            ))}
            {!loading && items.length === 0 && (
              <Tr><Td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: adminColors.muted }}>No rebate credits found.</Td></Tr>
            )}
          </tbody>
        </DataTable>
      </TableCard>

      <SimpleModal
        isOpen={modalOpen}
        title="Grant rebate credit"
        onClose={() => !saving && setModalOpen(false)}
        footer={
          <>
            <GhostButton type="button" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</GhostButton>
            <PrimaryButton type="button" onClick={onGrant} disabled={saving}>
              <FiCheck /> {saving ? 'Saving…' : 'Grant'}
            </PrimaryButton>
          </>
        }
      >
        <FormField>User email (if no id)
          <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="user@example.com" />
        </FormField>
        <FormField>User id (MongoDB, if no email)
          <input value={formUserId} onChange={(e) => setFormUserId(e.target.value)} placeholder="e.g. 674a…" />
        </FormField>
        <FormField>Amount (USD)
          <input value={formUsd} onChange={(e) => setFormUsd(e.target.value)} placeholder="25.00" />
        </FormField>
        <FormField>Broker / prop firm (optional)
          <input value={formBroker} onChange={(e) => setFormBroker(e.target.value)} placeholder="OneFunded" />
        </FormField>
        <FormField>Rebate type
          <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as typeof formCategory)}>
            <option value="">—</option>
            <option value="forex">Forex</option>
            <option value="crypto">Crypto</option>
            <option value="prop">Prop trading</option>
          </select>
        </FormField>
        <FormField>Purchase type (prop)
          <select value={formPurchaseType} onChange={(e) => setFormPurchaseType(e.target.value as typeof formPurchaseType)}>
            <option value="">—</option>
            <option value="first">First purchase</option>
            <option value="repeat">Repeat purchase</option>
          </select>
        </FormField>
        <FormField>Internal note (optional)
          <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} placeholder="January cashback batch" />
        </FormField>
      </SimpleModal>
    </PageWrap>
  );
};

export default AdminRebateCredits;
