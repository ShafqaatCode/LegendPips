import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiDollarSign, FiRefreshCw, FiPlus } from 'react-icons/fi';
import SimpleModal from '../../../components/AdminPanel/SimpleModal';
import { fetchAdminRebateCredits, grantRebateAdmin, formatUsd, type RebateCreditRow } from '../../../services/rebateService';
import { TableBodySkeleton } from '../../../components/SharedComponents/Shimmer';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #132e58;
  margin: 0;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 0.65rem 1.1rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: ${({ $primary }) => ($primary ? '#132e58' : 'white')};
  color: ${({ $primary }) => ($primary ? 'white' : '#132e58')};
  border: 2px solid ${({ $primary }) => ($primary ? '#132e58' : '#e5e7eb')};
  &:hover {
    opacity: 0.92;
  }
`;

const Toolbar = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  font-size: 0.875rem;
  min-width: 200px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.85rem 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #6b7280;
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 0.85rem 1rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
`;

const ErrorBox = styled.div`
  background: #fef2f2;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const Label = styled.div`
  font-weight: 700;
  color: #132e58;
  margin-bottom: 6px;
  font-size: 0.875rem;
`;

const Field = styled.input`
  width: 100%;
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  margin-bottom: 12px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  min-height: 72px;
  margin-bottom: 12px;
  resize: vertical;
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
        1,
        50,
        appliedUserId.trim() || undefined,
        appliedEmail.trim() || undefined
      );
      setItems(data.items || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [appliedUserId, appliedEmail]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const onGrant = async () => {
    const uid = formUserId.trim();
    const em = formEmail.trim();
    const usd = parseFloat(formUsd);
    if (!uid && !em) {
      alert('Enter a user id or account email.');
      return;
    }
    if (!Number.isFinite(usd) || usd <= 0) {
      alert('Enter a positive USD amount.');
      return;
    }
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
    <Container>
      <Header>
        <Title>
          <FiDollarSign style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Rebate credits
        </Title>
        <Button
          $primary
          type="button"
          onClick={() => {
            setFormUserId(appliedUserId || '');
            setFormEmail(appliedEmail || '');
            setModalOpen(true);
          }}
        >
          <FiPlus /> Grant rebate
        </Button>
      </Header>

      {error && <ErrorBox>{error}</ErrorBox>}

      <Toolbar>
        <Input
          placeholder="Filter by user MongoDB id"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
        />
        <Input
          placeholder="Or filter by account email"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
        />
        <Button
          type="button"
          onClick={() => {
            setAppliedUserId(userFilter.trim());
            setAppliedEmail(emailFilter.trim());
          }}
        >
          Apply filter
        </Button>
        <Button type="button" onClick={() => refresh()} disabled={loading}>
          <FiRefreshCw /> Refresh
        </Button>
      </Toolbar>

      <Card>
        <Table>
          <thead>
            <tr>
              <Th>When</Th>
              <Th>User</Th>
              <Th>Amount</Th>
              <Th>Type</Th>
              <Th>Broker / Firm</Th>
              <Th>Purchase</Th>
              <Th>Note</Th>
            </tr>
          </thead>
          <tbody>
            {loading && <TableBodySkeleton rows={6} cols={7} />}
            {!loading &&
              items.map((row) => (
                <tr key={row.id}>
                  <Td>{row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}</Td>
                  <Td>
                    <div style={{ fontWeight: 600 }}>{row.userLabel || '—'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{row.userEmail || row.userId}</div>
                  </Td>
                  <Td style={{ fontWeight: 700, color: '#059669' }}>{formatUsd(row.amountCents)}</Td>
                  <Td style={{ textTransform: 'capitalize' }}>{row.rebateCategory || '—'}</Td>
                  <Td>{row.brokerName || '—'}</Td>
                  <Td style={{ textTransform: 'capitalize' }}>{row.purchaseType || '—'}</Td>
                  <Td>{row.notes || '—'}</Td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Card>

      <SimpleModal
        isOpen={modalOpen}
        title="Grant rebate credit"
        onClose={() => !saving && setModalOpen(false)}
        footer={
          <>
            <Button type="button" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button $primary type="button" onClick={onGrant} disabled={saving}>
              {saving ? 'Saving…' : 'Grant'}
            </Button>
          </>
        }
      >
        <div>
          <Label>User email (if no id)</Label>
          <Field
            type="email"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            placeholder="user@example.com"
          />
          <Label>User id (MongoDB, if no email)</Label>
          <Field value={formUserId} onChange={(e) => setFormUserId(e.target.value)} placeholder="e.g. 674a…" />
          <Label>Amount (USD)</Label>
          <Field value={formUsd} onChange={(e) => setFormUsd(e.target.value)} placeholder="25.00" />
          <Label>Broker / prop firm (optional)</Label>
          <Field value={formBroker} onChange={(e) => setFormBroker(e.target.value)} placeholder="OneFunded" />
          <Label>Rebate type</Label>
          <select
            value={formCategory}
            onChange={(e) => setFormCategory(e.target.value as typeof formCategory)}
            style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8, border: '2px solid #e5e7eb', marginBottom: 12 }}
          >
            <option value="">—</option>
            <option value="forex">Forex</option>
            <option value="crypto">Crypto</option>
            <option value="prop">Prop trading</option>
          </select>
          <Label>Purchase type (prop)</Label>
          <select
            value={formPurchaseType}
            onChange={(e) => setFormPurchaseType(e.target.value as typeof formPurchaseType)}
            style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 8, border: '2px solid #e5e7eb', marginBottom: 12 }}
          >
            <option value="">—</option>
            <option value="first">First purchase</option>
            <option value="repeat">Repeat purchase</option>
          </select>
          <Label>Internal note (optional)</Label>
          <TextArea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} placeholder="January cashback batch" />
        </div>
      </SimpleModal>
    </Container>
  );
};

export default AdminRebateCredits;
