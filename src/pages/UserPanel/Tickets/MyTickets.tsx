import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiLifeBuoy, FiPlus, FiSend } from 'react-icons/fi';
import { fetchMyTickets, submitFeedback, type SupportTicket } from '../../../services/feedbackService';
import { useAuth } from '../../../contexts/AuthContext';
import { PanelCardListSkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle,
  ListStack, ListCard, CardTitle, MetaLine, CardFooter,
  PrimaryButton, EmptyState, ErrorBanner,
} from '../../../components/UserPanel/userUi';

const FormCard = styled.form`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.1rem 1.15rem;
  margin-bottom: 1.25rem;
  display: grid;
  gap: 0.75rem;
  box-shadow: 0 4px 16px rgba(19, 46, 88, 0.05);
`;

const Field = styled.label`
  display: grid;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  input, select, textarea {
    font: inherit;
    text-transform: none;
    letter-spacing: normal;
    font-weight: 500;
    color: #0f172a;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 0.65rem 0.75rem;
    outline: none;
  }

  textarea {
    min-height: 110px;
    resize: vertical;
  }

  input:focus, select:focus, textarea:focus {
    border-color: #132e58;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ReplyBox = styled.div`
  margin-top: 0.65rem;
  padding: 0.75rem 0.85rem;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #334155;
  line-height: 1.5;

  strong {
    display: block;
    margin-bottom: 0.25rem;
    color: #132e58;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
`;

const statusLabel: Record<string, string> = {
  new: 'Open',
  read: 'In review',
  archived: 'Closed',
};

const MyTickets: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMyTickets(1, 50);
      setItems(data.items || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email || !message.trim()) {
      setError('Please enter a message.');
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await submitFeedback({
        email: user.email,
        subject: subject.trim() || 'Support request',
        category,
        message: message.trim(),
        page: '/user-panel/tickets',
      });
      setSuccess(res.ticketId ? `Ticket ${res.ticketId} created.` : 'Ticket created.');
      setSubject('');
      setMessage('');
      setCategory('general');
      setShowForm(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrap>
      <PageHeader>
        <div>
          <PageTitle><FiLifeBuoy style={{ marginRight: 8, verticalAlign: 'middle' }} /> Support tickets</PageTitle>
          <PageSubtitle>Open a ticket and track replies from the LegendPips team</PageSubtitle>
        </div>
        <PrimaryButton type="button" onClick={() => setShowForm((v) => !v)}>
          <FiPlus /> {showForm ? 'Hide form' : 'New ticket'}
        </PrimaryButton>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}
      {success && <ErrorBanner style={{ background: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}>{success}</ErrorBanner>}

      {showForm && (
        <FormCard onSubmit={onSubmit}>
          <Row>
            <Field>
              Subject
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Short summary"
                maxLength={200}
              />
            </Field>
            <Field>
              Category
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="general">General</option>
                <option value="account">Account</option>
                <option value="rebates">Rebates</option>
                <option value="technical">Technical</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </Row>
          <Field>
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue…"
              required
            />
          </Field>
          <PrimaryButton type="submit" disabled={submitting}>
            <FiSend /> {submitting ? 'Sending…' : 'Submit ticket'}
          </PrimaryButton>
        </FormCard>
      )}

      {loading ? (
        <PanelCardListSkeleton cards={4} />
      ) : items.length === 0 ? (
        <EmptyState>No support tickets yet. Open one if you need help.</EmptyState>
      ) : (
        <ListStack>
          {items.map((row) => (
            <ListCard key={row.id}>
              <CardTitle>{row.ticketId} · {row.subject}</CardTitle>
              <MetaLine>
                {statusLabel[row.status] || row.status} · {row.category}
                {row.createdAt ? ` · ${new Date(row.createdAt).toLocaleString()}` : ''}
              </MetaLine>
              <p style={{ margin: '0.55rem 0 0', fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                {row.message}
              </p>
              {row.adminReply ? (
                <ReplyBox>
                  <strong>Team reply</strong>
                  {row.adminReply}
                </ReplyBox>
              ) : null}
              <CardFooter>
                {row.repliedAt
                  ? `Replied ${new Date(row.repliedAt).toLocaleString()}`
                  : 'Awaiting reply'}
              </CardFooter>
            </ListCard>
          ))}
        </ListStack>
      )}
    </PageWrap>
  );
};

export default MyTickets;
