import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  FiShuffle, FiSend, FiCheck, FiClock, FiInfo, FiChevronDown,
  FiBriefcase, FiArrowRight,
} from 'react-icons/fi';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle,
  SectionCard, SectionHead, SectionBody,
  PrimaryButton, ErrorBanner, userColors, Pill,
} from '../../../components/UserPanel/userUi';
import {
  fetchMyIbChangeRequests,
  submitIbChangeRequest,
  type IbChangeRequestRow,
} from '../../../services/ibChangeService';
import { fetchBrokersPage, type ApiBroker } from '../../../services/brokerService';
import { useAuth } from '../../../contexts/AuthContext';

const OTHER_VALUE = '__other__';

const PageHero = styled.div`
  margin-bottom: 1.15rem;
  padding: 1.25rem 1.35rem;
  border-radius: 16px;
  color: white;
  background:
    radial-gradient(ellipse 70% 120% at 100% 0%, rgba(251, 191, 36, 0.28) 0%, transparent 55%),
    linear-gradient(128deg, #0a1830 0%, ${userColors.navy} 48%, ${userColors.navyLight} 100%);
  box-shadow: 0 12px 32px rgba(19, 46, 88, 0.22);

  h1 {
    margin: 0 0 0.35rem;
    font-size: 1.2rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    letter-spacing: -0.02em;
  }
  p {
    margin: 0;
    font-size: 0.8125rem;
    opacity: 0.9;
    line-height: 1.5;
    max-width: 520px;
  }
  svg { color: ${userColors.gold}; }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.85fr);
  gap: 1rem;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const FormCard = styled(SectionCard)`
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05);
  border: 1px solid ${userColors.border};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${userColors.navy};
  letter-spacing: 0.02em;

  &.full {
    grid-column: 1 / -1;
  }

  .req {
    color: #dc2626;
  }
`;

const inputStyles = `
  width: 100%;
  box-sizing: border-box;
  padding: 0.65rem 0.8rem;
  border-radius: 10px;
  border: 1px solid ${userColors.border};
  font-size: 0.8125rem;
  font-weight: 500;
  outline: none;
  background: #f8fafc;
  color: ${userColors.navy};
  font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;

  &:focus {
    border-color: ${userColors.navy};
    box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.1);
    background: white;
  }

  &:disabled {
    opacity: 0.7;
  }

  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }
`;

const Input = styled.input`${inputStyles}`;
const TextArea = styled.textarea`
  ${inputStyles}
  resize: vertical;
  min-height: 100px;
  font-weight: 400;
  line-height: 1.5;
`;

const SelectWrap = styled.div`
  position: relative;

  select {
    ${inputStyles}
    appearance: none;
    -webkit-appearance: none;
    padding-right: 2.4rem;
    cursor: pointer;
    font-weight: 600;
  }

  svg {
    position: absolute;
    right: 0.85rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${userColors.muted};
    pointer-events: none;
  }
`;

const BrokerCount = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-left: 0.35rem;
  padding: 0.12rem 0.45rem;
  border-radius: 999px;
  background: #eef2ff;
  color: ${userColors.navy};
  font-size: 0.625rem;
  font-weight: 800;
`;

const InfoBox = styled.div`
  display: flex;
  gap: 0.6rem;
  padding: 0.85rem 0.95rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #f0f5fc 0%, #f8fafc 100%);
  border: 1px solid #dbe4f0;
  font-size: 0.75rem;
  color: ${userColors.navy};
  line-height: 1.5;
  margin-bottom: 1.1rem;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: ${userColors.navyLight};
  }
`;

const Hint = styled.p`
  margin: 0.15rem 0 0;
  font-size: 0.7rem;
  color: ${userColors.muted};
  line-height: 1.4;
  font-weight: 500;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
  margin-top: 1rem;
  padding-top: 0.85rem;
  border-top: 1px solid #f1f5f9;
`;

const SuccessBanner = styled.div`
  padding: 0.7rem 0.9rem;
  border-radius: 12px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #047857;
  font-size: 0.8125rem;
  font-weight: 600;
  margin-bottom: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const FlowHint = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.35rem 0 1rem;
  padding: 0.55rem 0.75rem;
  border-radius: 10px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  font-size: 0.72rem;
  font-weight: 600;
  color: #92400e;

  svg { flex-shrink: 0; }
`;

const HistoryCard = styled(SectionCard)`
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05);
`;

const HistoryRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.8rem 0.15rem;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  .title {
    font-size: 0.8125rem;
    font-weight: 700;
    color: ${userColors.navy};
    display: flex;
    align-items: center;
    gap: 0.35rem;
    flex-wrap: wrap;
  }
  .meta {
    font-size: 0.6875rem;
    color: ${userColors.muted};
    margin-top: 0.25rem;
    line-height: 1.4;
  }
  .right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.3rem;
  }
  .time {
    font-size: 0.6875rem;
    color: ${userColors.muted};
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
  }
`;

const EmptyHistory = styled.div`
  text-align: center;
  padding: 2rem 0.75rem;
  color: ${userColors.muted};
  font-size: 0.8125rem;

  .icon {
    width: 44px;
    height: 44px;
    margin: 0 auto 0.65rem;
    border-radius: 12px;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${userColors.navy};
    font-size: 1.1rem;
  }
`;

const statusVariant = (s: string) => {
  if (s === 'new') return 'pending';
  if (s === 'in_progress') return 'user';
  if (s === 'completed') return 'active';
  if (s === 'rejected') return 'default';
  return 'default';
};

const statusLabel = (s: string) => {
  if (s === 'in_progress') return 'In progress';
  if (s === 'new') return 'Submitted';
  if (s === 'completed') return 'Completed';
  if (s === 'rejected') return 'Closed';
  return s;
};

async function loadAllPublishedBrokers(): Promise<ApiBroker[]> {
  const first = await fetchBrokersPage({ page: 1, limit: 50 });
  let items = [...(first.items || [])];
  const totalPages = first.pagination?.totalPages || 1;
  for (let p = 2; p <= Math.min(totalPages, 10); p++) {
    const next = await fetchBrokersPage({ page: p, limit: 50 });
    items = items.concat(next.items || []);
  }
  const byId = new Map<string, ApiBroker>();
  for (const b of items) {
    if (b?._id && b?.name) byId.set(b._id, b);
  }
  return Array.from(byId.values()).sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  );
}

const RequestIbChange: React.FC = () => {
  const { user } = useAuth();
  const [brokers, setBrokers] = useState<ApiBroker[]>([]);
  const [history, setHistory] = useState<IbChangeRequestRow[]>([]);
  const [currentBrokerId, setCurrentBrokerId] = useState('');
  const [currentBrokerOther, setCurrentBrokerOther] = useState('');
  const [currentAccountNumber, setCurrentAccountNumber] = useState('');
  const [requestedBrokerId, setRequestedBrokerId] = useState('');
  const [requestedBrokerOther, setRequestedBrokerOther] = useState('');
  const [requestedAccountNumber, setRequestedAccountNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resolveBrokerName = useCallback(
    (id: string, other: string) => {
      if (id === OTHER_VALUE) return other.trim();
      return brokers.find((b) => b._id === id)?.name || '';
    },
    [brokers]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [items, brokerList] = await Promise.all([
        fetchMyIbChangeRequests(),
        loadAllPublishedBrokers().catch(() => [] as ApiBroker[]),
      ]);
      setHistory(items);
      setBrokers(brokerList);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const currentBroker = resolveBrokerName(currentBrokerId, currentBrokerOther);
    const requestedBroker = resolveBrokerName(requestedBrokerId, requestedBrokerOther);

    if (!currentBrokerId) {
      setError('Please select your current broker');
      return;
    }
    if (!currentBroker) {
      setError(currentBrokerId === OTHER_VALUE
        ? 'Please type your current broker name'
        : 'Please select your current broker');
      return;
    }
    if (!requestedBrokerId) {
      setError('Please select the broker you want');
      return;
    }
    if (!requestedBroker) {
      setError(requestedBrokerId === OTHER_VALUE
        ? 'Please type the broker you want'
        : 'Please select the broker you want');
      return;
    }
    if (
      currentBrokerId &&
      requestedBrokerId &&
      currentBrokerId !== OTHER_VALUE &&
      requestedBrokerId !== OTHER_VALUE &&
      currentBrokerId === requestedBrokerId
    ) {
      setError('Current and requested broker should be different');
      return;
    }

    setSending(true);
    try {
      const res = await submitIbChangeRequest({
        currentBroker,
        currentAccountNumber: currentAccountNumber.trim() || undefined,
        requestedBroker,
        requestedAccountNumber: requestedAccountNumber.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setSuccess(res.message);
      setCurrentBrokerId('');
      setCurrentBrokerOther('');
      setCurrentAccountNumber('');
      setRequestedBrokerId('');
      setRequestedBrokerOther('');
      setRequestedAccountNumber('');
      setNotes('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setSending(false);
    }
  };

  const brokerOptions = useMemo(
    () =>
      brokers.map((b) => (
        <option key={b._id} value={b._id}>
          {b.name}
          {b.topCashback ? ' · Top cashback' : ''}
        </option>
      )),
    [brokers]
  );

  return (
    <PageWrap>
      <PageHero>
        <h1><FiShuffle /> Request IB change</h1>
        <p>
          Pick your current broker and the partner you want under LegendPips IB.
          We’ll email our team and follow up on your account.
        </p>
      </PageHero>

      {/* keep title in a11y tree via hidden header for layout parity if needed */}
      <PageHeader style={{ display: 'none' }}>
        <PageTitle>Request IB change</PageTitle>
        <PageSubtitle>IB change</PageSubtitle>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}
      {success && (
        <SuccessBanner>
          <FiCheck /> {success}
        </SuccessBanner>
      )}

      <Layout>
        <FormCard>
          <SectionHead>
            <h2>
              <FiSend style={{ marginRight: 6 }} /> Submit request
              {brokers.length > 0 && (
                <BrokerCount>
                  <FiBriefcase size={10} /> {brokers.length} brokers
                </BrokerCount>
              )}
            </h2>
          </SectionHead>
          <SectionBody>
            <InfoBox>
              <FiInfo size={16} />
              <div>
                Hello{user?.firstName ? `, ${user.firstName}` : ''}. This does not switch broker
                accounts automatically — we help with IB linking on{' '}
                <strong>legendpips.com</strong>. Login and funding issues stay with the broker’s
                support team.
              </div>
            </InfoBox>

            <FlowHint>
              <FiArrowRight /> Select from our published broker list, or choose “Other” if yours is not listed.
            </FlowHint>

            <form onSubmit={handleSubmit}>
              <FormGrid>
                <Field>
                  Current broker <span className="req">*</span>
                  <SelectWrap>
                    <select
                      value={currentBrokerId}
                      onChange={(e) => setCurrentBrokerId(e.target.value)}
                      required
                      disabled={loading}
                      aria-label="Current broker"
                    >
                      <option value="">
                        {loading ? 'Loading brokers…' : 'Select current broker'}
                      </option>
                      {brokerOptions}
                      <option value={OTHER_VALUE}>Other (not in list)</option>
                    </select>
                    <FiChevronDown size={16} />
                  </SelectWrap>
                  {currentBrokerId === OTHER_VALUE && (
                    <>
                      <Input
                        value={currentBrokerOther}
                        onChange={(e) => setCurrentBrokerOther(e.target.value)}
                        placeholder="Type broker name"
                        required
                        maxLength={120}
                        style={{ marginTop: 8 }}
                      />
                    </>
                  )}
                </Field>

                <Field>
                  Current account # <span style={{ fontWeight: 500, color: userColors.muted }}>(optional)</span>
                  <Input
                    value={currentAccountNumber}
                    onChange={(e) => setCurrentAccountNumber(e.target.value)}
                    placeholder="Trading account number"
                    maxLength={80}
                  />
                </Field>

                <Field>
                  Broker you want <span className="req">*</span>
                  <SelectWrap>
                    <select
                      value={requestedBrokerId}
                      onChange={(e) => setRequestedBrokerId(e.target.value)}
                      required
                      disabled={loading}
                      aria-label="Requested broker"
                    >
                      <option value="">
                        {loading ? 'Loading brokers…' : 'Select target broker'}
                      </option>
                      {brokerOptions}
                      <option value={OTHER_VALUE}>Other (not in list)</option>
                    </select>
                    <FiChevronDown size={16} />
                  </SelectWrap>
                  {requestedBrokerId === OTHER_VALUE && (
                    <Input
                      value={requestedBrokerOther}
                      onChange={(e) => setRequestedBrokerOther(e.target.value)}
                      placeholder="Type broker name"
                      required
                      maxLength={120}
                      style={{ marginTop: 8 }}
                    />
                  )}
                  <Hint>Should be a LegendPips partner for cashback / IB setup.</Hint>
                </Field>

                <Field>
                  New account # <span style={{ fontWeight: 500, color: userColors.muted }}>(if opened)</span>
                  <Input
                    value={requestedAccountNumber}
                    onChange={(e) => setRequestedAccountNumber(e.target.value)}
                    placeholder="Optional"
                    maxLength={80}
                  />
                </Field>

                <Field className="full">
                  Extra notes
                  <TextArea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Already under another IB — need to open via LegendPips referral link…"
                    maxLength={4000}
                  />
                </Field>
              </FormGrid>

              <Hint style={{ marginTop: '0.85rem' }}>
                We’ll email support and reply to {user?.email || 'your account email'}.
              </Hint>

              <Actions>
                <PrimaryButton type="submit" disabled={sending || loading}>
                  <FiSend /> {sending ? 'Sending…' : 'Send IB change request'}
                </PrimaryButton>
              </Actions>
            </form>
          </SectionBody>
        </FormCard>

        <HistoryCard>
          <SectionHead>
            <h2><FiClock style={{ marginRight: 6 }} /> Your requests</h2>
          </SectionHead>
          <SectionBody>
            {loading ? (
              <EmptyHistory>Loading…</EmptyHistory>
            ) : history.length === 0 ? (
              <EmptyHistory>
                <div className="icon"><FiShuffle /></div>
                No IB change requests yet.<br />
                Submit one when you need help switching partners.
              </EmptyHistory>
            ) : (
              history.map((row) => (
                <HistoryRow key={row.id}>
                  <div>
                    <div className="title">
                      {row.currentBroker}
                      <FiArrowRight size={12} color={userColors.muted} />
                      {row.requestedBroker}
                    </div>
                    <div className="meta">
                      {row.currentAccountNumber ? `Acct ${row.currentAccountNumber} · ` : ''}
                      {row.notes ? row.notes.slice(0, 90) : 'No notes'}
                    </div>
                    {row.adminNote ? (
                      <div className="meta" style={{ color: userColors.navy, marginTop: 4 }}>
                        Team: {row.adminNote}
                      </div>
                    ) : null}
                  </div>
                  <div className="right">
                    <Pill $variant={statusVariant(row.status)}>{statusLabel(row.status)}</Pill>
                    <span className="time">
                      <FiClock />
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })
                        : '—'}
                    </span>
                  </div>
                </HistoryRow>
              ))
            )}
          </SectionBody>
        </HistoryCard>
      </Layout>
    </PageWrap>
  );
};

export default RequestIbChange;
