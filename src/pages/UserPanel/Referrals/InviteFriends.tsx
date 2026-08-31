import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FiUserPlus, FiMail, FiSend, FiCheck, FiClock, FiChevronDown, FiCopy, FiDollarSign, FiUsers } from 'react-icons/fi';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle,
  SectionCard, SectionHead, SectionBody,
  PrimaryButton, ErrorBanner, userColors,
} from '../../../components/UserPanel/userUi';
import { useLocale } from '../../../contexts/LocaleContext';
import {
  fetchMyReferralInvites,
  fetchReferralTemplates,
  sendReferralInvite,
  type ReferralInviteRow,
  type ReferralTemplate,
} from '../../../services/referralService';
import { fetchMyAffiliateDashboard, type AffiliateDashboard } from '../../../services/affiliateService';
import { useAuth } from '../../../contexts/AuthContext';

const AffCard = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 0.9rem;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const AffBox = styled.div`
  background: white;
  border: 1px solid ${userColors.border};
  border-radius: 14px;
  padding: 0.9rem 1rem;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
  h3 { margin: 0 0 0.35rem; font-size: 0.75rem; font-weight: 800; color: ${userColors.muted}; text-transform: uppercase; letter-spacing: 0.04em; }
  .val { font-size: 1.15rem; font-weight: 800; color: ${userColors.navy}; word-break: break-all; }
  .meta { margin-top: 0.35rem; font-size: 0.75rem; color: ${userColors.muted}; }
  button.copy {
    margin-top: 0.55rem;
    display: inline-flex; align-items: center; gap: 0.35rem;
    border: 1px solid ${userColors.border}; background: #f8fafc; border-radius: 8px;
    padding: 0.35rem 0.6rem; font-size: 0.75rem; font-weight: 700; color: ${userColors.navy}; cursor: pointer;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
  gap: 0.9rem;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

/** Label left / control right form row (inspired by classic invite forms) */
const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr);
  gap: 0.75rem 1rem;
  align-items: start;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 0.35rem;
  }
`;

const Label = styled.div`
  padding-top: 0.55rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${userColors.navy};

  @media (max-width: 560px) {
    padding-top: 0;
  }

  .req {
    color: #dc2626;
    margin-left: 2px;
  }
`;

const Control = styled.div`
  min-width: 0;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.62rem 0.8rem;
  border-radius: 10px;
  border: 1px solid ${userColors.border};
  font-size: 0.8125rem;
  font-weight: 500;
  outline: none;
  background: #f8fafc;
  color: ${userColors.navy};
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;

  &:focus {
    border-color: ${userColors.navy};
    box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.1);
    background: white;
  }

  &:disabled {
    opacity: 0.75;
    cursor: default;
  }
`;

const SelectWrap = styled.div`
  position: relative;

  select {
    width: 100%;
    box-sizing: border-box;
    appearance: none;
    -webkit-appearance: none;
    padding: 0.6rem 2.25rem 0.6rem 0.75rem;
    border-radius: 9px;
    border: 1px solid ${userColors.border};
    font-size: 0.8125rem;
    font-weight: 600;
    color: ${userColors.navy};
    background: #fafbfc;
    outline: none;
    cursor: pointer;

    &:focus {
      border-color: ${userColors.navy};
      box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.08);
      background: white;
    }
  }

  svg {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${userColors.muted};
    pointer-events: none;
  }
`;

const MessageBox = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  min-height: 220px;
  padding: 0.85rem 0.9rem;
  border-radius: 10px;
  border: 1px solid ${userColors.border};
  background: #f1f5f9;
  color: ${userColors.navy};
  font-size: 0.8125rem;
  line-height: 1.55;
  font-family: inherit;
  resize: vertical;
  outline: none;

  &:disabled {
    opacity: 1;
    cursor: default;
    color: #334155;
  }
`;

const TemplateHelp = styled.p`
  margin: 0.4rem 0 0;
  font-size: 0.6875rem;
  color: ${userColors.muted};
  line-height: 1.4;
`;

const Hint = styled.p`
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  color: ${userColors.muted};
  line-height: 1.45;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 0.35rem;
`;

const SuccessBanner = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
  border: 1px solid #a7f3d0;
  color: #047857;
  font-size: 0.8125rem;
  font-weight: 600;
  margin-bottom: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 2px 10px rgba(5, 150, 105, 0.08);
`;

const HistoryRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.65rem 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  .email {
    font-size: 0.8125rem;
    font-weight: 700;
    color: ${userColors.navy};
  }
  .meta {
    font-size: 0.6875rem;
    color: ${userColors.muted};
    margin-top: 0.15rem;
  }
  .time {
    font-size: 0.6875rem;
    color: ${userColors.muted};
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }
`;

const EmptyHistory = styled.div`
  text-align: center;
  padding: 1.5rem 0.5rem;
  color: ${userColors.muted};
  font-size: 0.8125rem;
`;

/** Live preview: fill sample / live names into template text shown in the form */
function buildLivePreview(
  template: ReferralTemplate | undefined,
  inviterName: string,
  inviterEmail: string,
  friendName: string
) {
  if (!template) return { subject: '', body: '' };

  let subject = template.subjectPreview;
  let body = template.bodyPreview;

  if (friendName.trim()) {
    body = body
      .replace(/^Hi,?\n/m, `Hi ${friendName.trim()},\n`)
      .replace(/^Hello,?\n/m, `Hello ${friendName.trim()},\n`);
  }
  if (inviterName) {
    subject = subject.replace(/Your name/g, inviterName);
    body = body.replace(/Your name/g, inviterName);
  }
  if (inviterEmail) {
    body = body.replace(/you@email\.com/g, inviterEmail);
  }

  return { subject, body };
}

const InviteFriends: React.FC = () => {
  const { t } = useLocale();
  const { user } = useAuth();
  const [templates, setTemplates] = useState<ReferralTemplate[]>([]);
  const [history, setHistory] = useState<ReferralInviteRow[]>([]);
  const [templateId, setTemplateId] = useState('');
  const [toEmail, setToEmail] = useState('');
  const [friendName, setFriendName] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [affiliate, setAffiliate] = useState<AffiliateDashboard | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [t, h, aff] = await Promise.all([
        fetchReferralTemplates(),
        fetchMyReferralInvites(),
        fetchMyAffiliateDashboard().catch(() => null),
      ]);
      setTemplates(t);
      setHistory(h);
      setAffiliate(aff);
      setTemplateId((prev) => prev || (t[0]?.id ?? ''));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load invite options');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const inviterName = useMemo(
    () =>
      [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
      'Your name',
    [user?.firstName, user?.lastName]
  );

  const selected = templates.find((t) => t.id === templateId);
  const preview = useMemo(
    () => buildLivePreview(selected, inviterName, user?.email || '', friendName),
    [selected, inviterName, user?.email, friendName]
  );

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!templateId) {
      setError('Please select an email template');
      return;
    }
    if (!toEmail.trim()) {
      setError('Please enter your friend’s email');
      return;
    }

    setSending(true);
    try {
      const res = await sendReferralInvite({
        toEmail: toEmail.trim(),
        templateId,
        friendName: friendName.trim() || undefined,
      });
      setSuccess(res.message);
      setToEmail('');
      setFriendName('');
      const h = await fetchMyReferralInvites();
      setHistory(h);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setSending(false);
    }
  };

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle><FiUserPlus /> {t("panel.pageInvite")}</PageTitle>
        <PageSubtitle>
          Share your affiliate link, earn signup bonuses, and invite friends by email
        </PageSubtitle>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}
      {success && (
        <SuccessBanner>
          <FiCheck /> {success}
        </SuccessBanner>
      )}

      {affiliate && (
        <AffCard>
          <AffBox>
            <h3>Your invite link</h3>
            <div className="val" style={{ fontSize: '0.85rem' }}>{affiliate.inviteLink}</div>
            <div className="meta">Code: <strong>{affiliate.referralCode}</strong> · Tier: {affiliate.tier}</div>
            <button
              type="button"
              className="copy"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(affiliate.inviteLink);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  /* ignore */
                }
              }}
            >
              <FiCopy /> {copied ? 'Copied' : 'Copy link'}
            </button>
          </AffBox>
          <AffBox>
            <h3><FiUsers style={{ display: 'inline', marginRight: 4 }} />Network</h3>
            <div className="val">{affiliate.network.l1} direct</div>
            <div className="meta">{affiliate.network.l2} level-2 · L1 bonus ${(affiliate.tierConfig.l1SignupCents / 100).toFixed(2)} / signup</div>
          </AffBox>
          <AffBox>
            <h3><FiDollarSign style={{ display: 'inline', marginRight: 4 }} />Earnings</h3>
            <div className="val">${affiliate.earnings.totalUsd.toFixed(2)}</div>
            <div className="meta">Paid into your rebates wallet · {affiliate.earnings.count} commissions</div>
          </AffBox>
        </AffCard>
      )}

      <Layout>
        <SectionCard>
          <SectionHead>
            <h2><FiMail style={{ marginRight: 6 }} /> Compose invitation</h2>
          </SectionHead>
          <SectionBody>
            <Hint style={{ marginBottom: '1rem' }}>
              Emails go from our SMTP and always include{' '}
              <strong style={{ color: userColors.navy }}>https://legendpips.com</strong>
              {' '}with a register link. Subject and message update when you change the template.
            </Hint>

            <form onSubmit={handleSend}>
              <FormStack>
                <FormRow>
                  <Label>
                    Email template<span className="req">*</span>
                  </Label>
                  <Control>
                    <SelectWrap>
                      <select
                        value={templateId}
                        onChange={(e) => setTemplateId(e.target.value)}
                        disabled={loading || templates.length === 0}
                        aria-label="Email template"
                      >
                        {templates.length === 0 && (
                          <option value="">{loading ? 'Loading…' : 'No templates'}</option>
                        )}
                        {templates.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.title}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown size={16} />
                    </SelectWrap>
                    {selected?.shortDescription && (
                      <TemplateHelp>{selected.shortDescription}</TemplateHelp>
                    )}
                  </Control>
                </FormRow>

                <FormRow>
                  <Label>
                    Friend email<span className="req">*</span>
                  </Label>
                  <Control>
                    <Input
                      type="email"
                      value={toEmail}
                      onChange={(e) => setToEmail(e.target.value)}
                      placeholder="friend@email.com"
                      required
                      autoComplete="email"
                    />
                  </Control>
                </FormRow>

                <FormRow>
                  <Label>Friend name</Label>
                  <Control>
                    <Input
                      type="text"
                      value={friendName}
                      onChange={(e) => setFriendName(e.target.value)}
                      placeholder="Optional — used in the greeting"
                      maxLength={80}
                    />
                  </Control>
                </FormRow>

                <FormRow>
                  <Label>Subject</Label>
                  <Control>
                    <Input
                      type="text"
                      value={preview.subject}
                      readOnly
                      disabled
                      aria-label="Email subject (from template)"
                    />
                  </Control>
                </FormRow>

                <FormRow>
                  <Label>Message</Label>
                  <Control>
                    <MessageBox
                      value={preview.body}
                      readOnly
                      disabled
                      aria-label="Email message (from template)"
                    />
                    <TemplateHelp>
                      Message is fixed by the template (names filled automatically when sending).
                    </TemplateHelp>
                  </Control>
                </FormRow>

                <Actions>
                  <PrimaryButton type="submit" disabled={sending || loading || !templateId}>
                    <FiSend /> {sending ? 'Sending…' : 'Send invitation'}
                  </PrimaryButton>
                </Actions>
              </FormStack>
            </form>
          </SectionBody>
        </SectionCard>

        <SectionCard>
          <SectionHead>
            <h2><FiClock style={{ marginRight: 6 }} /> Recent invites</h2>
          </SectionHead>
          <SectionBody>
            {loading ? (
              <EmptyHistory>Loading…</EmptyHistory>
            ) : history.length === 0 ? (
              <EmptyHistory>No invitations sent yet.</EmptyHistory>
            ) : (
              history.map((row) => (
                <HistoryRow key={row.id}>
                  <div>
                    <div className="email">{row.toEmail}</div>
                    <div className="meta">
                      {row.friendName ? `${row.friendName} · ` : ''}
                      {row.subject}
                    </div>
                  </div>
                  <span className="time">
                    <FiClock />
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })
                      : '—'}
                  </span>
                </HistoryRow>
              ))
            )}
          </SectionBody>
        </SectionCard>
      </Layout>
    </PageWrap>
  );
};

export default InviteFriends;
