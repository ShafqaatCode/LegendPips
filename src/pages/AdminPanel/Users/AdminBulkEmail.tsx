import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiMail, FiSend, FiArrowLeft } from 'react-icons/fi';
import { sendBulkEmail, type BulkEmailAudience } from '../../../services/userService';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  SectionCard, SectionBody, PrimaryButton, GhostButton, ErrorBanner,
} from '../../../components/AdminPanel/adminUi';

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #64748b;
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 0.875rem;

  &:hover { color: #132E58; }
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #132E58;

  select, input, textarea {
    font-weight: 400;
    padding: 0.55rem 0.65rem;
    border: 1px solid #e8ecf1;
    border-radius: 8px;
    font-size: 0.8125rem;
    outline: none;

    &:focus { border-color: #132E58; }
  }

  textarea { min-height: 140px; resize: vertical; }
`;

const SuccessBanner = styled.div`
  padding: 0.625rem 0.875rem;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  color: #047857;
  font-size: 0.8125rem;
  margin-bottom: 0.875rem;
`;

const AUDIENCE_OPTIONS: { value: BulkEmailAudience; label: string }[] = [
  { value: 'all', label: 'All users (excluding admins)' },
  { value: 'active', label: 'Active users only' },
  { value: 'kyc-verified', label: 'KYC verified users' },
  { value: 'email-verified', label: 'Email verified users' },
  { value: 'banned', label: 'Banned users' },
];

const AdminBulkEmail: React.FC = () => {
  const [audience, setAudience] = useState<BulkEmailAudience>('active');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!window.confirm(`Send this email to "${AUDIENCE_OPTIONS.find((o) => o.value === audience)?.label}"?`)) return;

    setSending(true);
    try {
      const res = await sendBulkEmail({ audience, subject, message });
      setSuccess(res.message || 'Emails sent.');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <PageWrap>
      <BackLink to="/admin-panel/users"><FiArrowLeft /> Back to users</BackLink>

      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiMail /> Bulk Email</PageTitle>
          <PageSubtitle>Send announcements to a selected user group</PageSubtitle>
        </PageTitleGroup>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}
      {success && <SuccessBanner>{success}</SuccessBanner>}

      <SectionCard>
        <SectionBody>
          <form onSubmit={handleSend}>
            <Field>
              Send to
              <select value={audience} onChange={(e) => setAudience(e.target.value as BulkEmailAudience)}>
                {AUDIENCE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>
            <Field>
              Subject
              <input value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="Email subject line" />
            </Field>
            <Field>
              Message
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} required placeholder="Write your message…" />
            </Field>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <PrimaryButton type="submit" disabled={sending}>
                <FiSend /> {sending ? 'Sending…' : 'Send Email'}
              </PrimaryButton>
              <GhostButton type="button" onClick={() => { setSubject(''); setMessage(''); }}>
                Clear
              </GhostButton>
            </div>
          </form>
        </SectionBody>
      </SectionCard>
    </PageWrap>
  );
};

export default AdminBulkEmail;
