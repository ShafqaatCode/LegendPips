import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiCheckCircle, FiDollarSign, FiRefreshCw, FiSend } from 'react-icons/fi';
import {
  fetchMyRebateCredits,
  fetchMyRebateSummary,
  fetchMyWithdrawals,
  formatUsd,
  requestRebateWithdrawal,
  REBATE_PAYOUT_LABELS,
  type RebateCreditRow,
  type RebatePayoutMethod,
  type RebateSummary,
  type RebateWithdrawalRow,
} from '../../../services/rebateService';
import { TableBodySkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle, HintBar, ErrorBanner, Toolbar, GhostButton,
  TableCard, DataTable, Th, Td, EmptyCell, StatsGrid, StatCard, StatIconBox, StatBody, StatValue,
  StatLabel, SectionCard, SectionHead, SectionBody, FormGrid, Field, PrimaryButton, Pill,
} from '../../../components/UserPanel/userUi';
import { useLocale } from '../../../contexts/LocaleContext';

const MyRebates: React.FC = () => {
  const { t } = useLocale();
  const [items, setItems] = useState<RebateCreditRow[]>([]);
  const [withdrawals, setWithdrawals] = useState<RebateWithdrawalRow[]>([]);
  const [summary, setSummary] = useState<RebateSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amountUsd, setAmountUsd] = useState('');
  const [method, setMethod] = useState<RebatePayoutMethod>('paypal');
  const [payoutDetails, setPayoutDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [credits, sum, wd] = await Promise.all([
        fetchMyRebateCredits(1, 50),
        fetchMyRebateSummary(),
        fetchMyWithdrawals(1, 30),
      ]);
      setItems(credits.items || []);
      setSummary(sum);
      setWithdrawals(wd.items || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const available = summary?.availableCents || 0;
  const minUsd = (summary?.minWithdrawCents || 2000) / 100;

  const onWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const usd = parseFloat(amountUsd);
    if (!Number.isFinite(usd) || usd < minUsd) {
      alert(`Minimum withdrawal is $${minUsd.toFixed(0)}.`);
      return;
    }
    if (!payoutDetails.trim()) {
      alert('Enter payout details.');
      return;
    }
    try {
      setSubmitting(true);
      await requestRebateWithdrawal({ amountUsd: usd, method, payoutDetails: payoutDetails.trim() });
      setAmountUsd('');
      setPayoutDetails('');
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle><FiDollarSign /> {t("panel.rebates")}</PageTitle>
        <PageSubtitle>Cashback credits, available balance, and payout requests</PageSubtitle>
      </PageHeader>

      <HintBar>
        Credits are posted after partner verification — LegendPips does not sync live broker trades.
        Prop rebates: buy through partner links on{' '}
        <Link to="/rebates" style={{ color: '#132E58', fontWeight: 600 }}>Prop Trading</Link>.
      </HintBar>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <StatsGrid>
        <StatCard>
          <StatIconBox $color="#132E58"><FiDollarSign /></StatIconBox>
          <StatBody>
            <StatValue>{loading ? '…' : formatUsd(summary?.lifetimeCents || 0)}</StatValue>
            <StatLabel>Lifetime credited</StatLabel>
          </StatBody>
        </StatCard>
        <StatCard>
          <StatIconBox $color="#059669"><FiDollarSign /></StatIconBox>
          <StatBody>
            <StatValue>{loading ? '…' : formatUsd(available)}</StatValue>
            <StatLabel>Available</StatLabel>
          </StatBody>
        </StatCard>
        <StatCard>
          <StatIconBox $color="#d97706"><FiClock /></StatIconBox>
          <StatBody>
            <StatValue>{loading ? '…' : formatUsd(summary?.pendingWithdrawalsCents || 0)}</StatValue>
            <StatLabel>Pending payout</StatLabel>
          </StatBody>
        </StatCard>
        <StatCard>
          <StatIconBox $color="#2563eb"><FiCheckCircle /></StatIconBox>
          <StatBody>
            <StatValue>{loading ? '…' : formatUsd(summary?.paidWithdrawalsCents || 0)}</StatValue>
            <StatLabel>Paid out</StatLabel>
          </StatBody>
        </StatCard>
      </StatsGrid>

      <Toolbar>
        <GhostButton $sm type="button" onClick={load} disabled={loading}><FiRefreshCw /> Refresh</GhostButton>
        {summary?.thisMonthCents ? (
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            This month credited: {formatUsd(summary.thisMonthCents)}
          </span>
        ) : null}
      </Toolbar>

      <SectionCard style={{ marginBottom: '1rem' }}>
        <SectionHead>Request withdrawal</SectionHead>
        <SectionBody>
          <p style={{ margin: '0 0 0.85rem', fontSize: '0.8125rem', color: '#475569' }}>
            Available {formatUsd(available)}. Minimum ${minUsd.toFixed(0)}. Pending requests reduce available balance
            until they are paid or rejected.
          </p>
          <form onSubmit={onWithdraw}>
            <FormGrid>
              <Field>
                Amount (USD)
                <input
                  type="number"
                  min={minUsd}
                  step="0.01"
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(e.target.value)}
                  placeholder={minUsd.toFixed(2)}
                />
              </Field>
              <Field>
                Method
                <select value={method} onChange={(e) => setMethod(e.target.value as RebatePayoutMethod)}>
                  {(Object.keys(REBATE_PAYOUT_LABELS) as RebatePayoutMethod[]).map((key) => (
                    <option key={key} value={key}>{REBATE_PAYOUT_LABELS[key]}</option>
                  ))}
                </select>
              </Field>
              <Field className="full">
                Payout details
                <input
                  value={payoutDetails}
                  onChange={(e) => setPayoutDetails(e.target.value)}
                  placeholder="PayPal email, wallet address, or bank details"
                />
              </Field>
            </FormGrid>
            <PrimaryButton type="submit" disabled={submitting || available < (summary?.minWithdrawCents || 2000)} style={{ marginTop: '0.85rem' }}>
              <FiSend /> {submitting ? 'Submitting…' : 'Request payout'}
            </PrimaryButton>
          </form>
        </SectionBody>
      </SectionCard>

      {(summary?.byBroker?.length || summary?.byCategory?.length) ? (
        <SectionCard style={{ marginBottom: '1rem' }}>
          <SectionHead>Breakdown</SectionHead>
          <SectionBody>
            <FormGrid>
              <div>
                <strong style={{ fontSize: '0.75rem', color: '#132E58' }}>By firm</strong>
                {(summary?.byBroker || []).map((row) => (
                  <div key={row.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', padding: '0.35rem 0', borderBottom: '1px solid #eef2f7' }}>
                    <span>{row.name}</span>
                    <span>{formatUsd(row.totalCents)}</span>
                  </div>
                ))}
              </div>
              <div>
                <strong style={{ fontSize: '0.75rem', color: '#132E58' }}>By type</strong>
                {(summary?.byCategory || []).map((row) => (
                  <div key={row.category} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', padding: '0.35rem 0', borderBottom: '1px solid #eef2f7' }}>
                    <span style={{ textTransform: 'capitalize' }}>{row.category}</span>
                    <span>{formatUsd(row.totalCents)}</span>
                  </div>
                ))}
              </div>
            </FormGrid>
          </SectionBody>
        </SectionCard>
      ) : null}

      <SectionCard style={{ marginBottom: '1rem' }}>
        <SectionHead>Withdrawal history</SectionHead>
        <SectionBody style={{ padding: 0 }}>
          <TableCard style={{ boxShadow: 'none', border: 0, margin: 0 }}>
            <DataTable>
              <thead>
                <tr>
                  <Th>Date</Th>
                  <Th>Amount</Th>
                  <Th>Method</Th>
                  <Th>Status</Th>
                  <Th>Note</Th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><EmptyCell colSpan={5}><TableBodySkeleton rows={3} cols={5} /></EmptyCell></tr>
                )}
                {!loading && withdrawals.length === 0 && (
                  <tr><EmptyCell colSpan={5}>No withdrawal requests yet.</EmptyCell></tr>
                )}
                {!loading && withdrawals.map((row) => (
                  <tr key={row.id}>
                    <Td style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                      {row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}
                    </Td>
                    <Td style={{ fontWeight: 700 }}>{formatUsd(row.amountCents)}</Td>
                    <Td style={{ fontSize: '0.75rem' }}>{REBATE_PAYOUT_LABELS[row.method] || row.method}</Td>
                    <Td><Pill $variant={row.status === 'paid' ? 'approved' : row.status}>{row.status}</Pill></Td>
                    <Td style={{ fontSize: '0.75rem' }}>{row.adminNote || '—'}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </TableCard>
        </SectionBody>
      </SectionCard>

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
