import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiShield, FiLock, FiList, FiCheck, FiX } from 'react-icons/fi';
import {
  disableTotp,
  enableTotp,
  fetchAdminAuditLogs,
  fetchTotpStatus,
  setupTotp,
  type AuditLogRow,
  type TotpSetup,
} from '../../../services/securityService';
import { TableBodySkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  PrimaryButton, GhostButton, SectionCard, SectionHead, SectionBody,
  DataTable, Th, Td, Tr, ErrorBanner, adminColors, Pill,
} from '../../../components/AdminPanel/adminUi';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  @media (max-width: 980px) { grid-template-columns: 1fr; }
`;

const Hint = styled.p`
  margin: 0 0 0.85rem;
  color: ${adminColors.muted};
  font-size: 0.8125rem;
  line-height: 1.5;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${adminColors.navy};
  margin-bottom: 0.75rem;
  input {
    width: 100%;
    padding: 0.55rem 0.7rem;
    border-radius: 9px;
    border: 1px solid ${adminColors.border};
    font-size: 0.875rem;
    outline: none;
    box-sizing: border-box;
    &:focus { border-color: ${adminColors.navy}; box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.08); }
  }
`;

const QrBox = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 0.85rem;
  border: 1px dashed ${adminColors.border};
  border-radius: 12px;
  background: #f8fafc;
  margin-bottom: 0.85rem;
  img { width: 148px; height: 148px; border-radius: 8px; background: white; }
  code {
    display: block;
    margin-top: 0.35rem;
    font-size: 0.75rem;
    word-break: break-all;
    color: ${adminColors.navy};
    font-weight: 700;
  }
`;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const AdminSecurity: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [setup, setSetup] = useState<TotpSetup | null>(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError, setLogsError] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    try {
      const s = await fetchTotpStatus();
      setEnabled(!!s.enabled);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to load 2FA status');
    }
  }, []);

  const loadLogs = useCallback(async () => {
    try {
      setLogsLoading(true);
      setLogsError(null);
      const data = await fetchAdminAuditLogs({ page: 1, limit: 40 });
      setLogs(data.items || []);
    } catch (e) {
      setLogsError(e instanceof Error ? e.message : 'Failed to load audit logs');
    } finally {
      setLogsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
    void loadLogs();
  }, [loadStatus, loadLogs]);

  const startSetup = async () => {
    setBusy(true);
    setErr('');
    setMsg('');
    try {
      const data = await setupTotp();
      setSetup(data);
      setCode('');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Setup failed');
    } finally {
      setBusy(false);
    }
  };

  const confirmEnable = async () => {
    if (code.trim().length < 6) {
      setErr('Enter the 6-digit code from your app.');
      return;
    }
    setBusy(true);
    setErr('');
    try {
      await enableTotp(code.trim());
      setEnabled(true);
      setSetup(null);
      setCode('');
      setMsg('Two-factor authentication is now enabled.');
      await loadLogs();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not enable 2FA');
    } finally {
      setBusy(false);
    }
  };

  const confirmDisable = async () => {
    if (code.trim().length < 6) {
      setErr('Enter your current authenticator code to disable 2FA.');
      return;
    }
    if (!window.confirm('Disable two-factor authentication for your admin account?')) return;
    setBusy(true);
    setErr('');
    try {
      await disableTotp(code.trim());
      setEnabled(false);
      setSetup(null);
      setCode('');
      setMsg('Two-factor authentication disabled.');
      await loadLogs();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not disable 2FA');
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiShield /> Security</PageTitle>
          <PageSubtitle>Admin 2FA, audit trail, and login abuse protection</PageSubtitle>
        </PageTitleGroup>
      </PageHeader>

      {(err || logsError) && <ErrorBanner>{err || logsError}</ErrorBanner>}
      {msg && (
        <div style={{
          marginBottom: '0.85rem',
          padding: '0.7rem 0.9rem',
          borderRadius: 10,
          background: '#ecfdf5',
          color: '#047857',
          fontWeight: 600,
          fontSize: 13,
        }}>
          {msg}
        </div>
      )}

      <Grid>
        <SectionCard>
          <SectionHead>
            <h2><FiLock style={{ display: 'inline', marginRight: 6 }} />Authenticator 2FA</h2>
          </SectionHead>
          <SectionBody>
            <Hint>
              Protect admin sign-in with Google Authenticator, Authy, or any TOTP app.
              After enable, login asks for a 6-digit code.
            </Hint>
            <div style={{ marginBottom: 12 }}>
              Status:{' '}
              <Pill $variant={enabled ? 'approved' : 'incomplete'}>
                {enabled ? 'Enabled' : 'Not enabled'}
              </Pill>
            </div>

            {setup && (
              <QrBox>
                <img src={setup.qrDataUrl} alt="2FA QR code" />
                <div>
                  <strong style={{ color: adminColors.navy }}>Scan this QR</strong>
                  <p style={{ margin: '0.35rem 0', fontSize: 13, color: adminColors.muted }}>
                    Or enter this secret manually:
                  </p>
                  <code>{setup.secret}</code>
                </div>
              </QrBox>
            )}

            {(setup || enabled) && (
              <Field>
                Authenticator code
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="123456"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              </Field>
            )}

            <ActionRow>
              {!enabled && !setup && (
                <PrimaryButton type="button" disabled={busy} onClick={() => void startSetup()}>
                  Set up 2FA
                </PrimaryButton>
              )}
              {setup && (
                <>
                  <PrimaryButton type="button" disabled={busy} onClick={() => void confirmEnable()}>
                    <FiCheck /> Confirm & enable
                  </PrimaryButton>
                  <GhostButton type="button" disabled={busy} onClick={() => { setSetup(null); setCode(''); }}>
                    Cancel
                  </GhostButton>
                </>
              )}
              {enabled && !setup && (
                <GhostButton $danger type="button" disabled={busy} onClick={() => void confirmDisable()}>
                  <FiX /> Disable 2FA
                </GhostButton>
              )}
            </ActionRow>
          </SectionBody>
        </SectionCard>

        <SectionCard>
          <SectionHead><h2>Fraud / login protection</h2></SectionHead>
          <SectionBody>
            <Hint style={{ marginBottom: 0 }}>
              Active now:
            </Hint>
            <ul style={{ margin: '0.55rem 0 0', paddingLeft: '1.1rem', color: adminColors.muted, fontSize: 13, lineHeight: 1.6 }}>
              <li>Rate limits on login, register, OTP, and password reset</li>
              <li>Account lock after 8 failed password attempts (15 minutes)</li>
              <li>Last login IP stored for admin accounts</li>
              <li>Sensitive admin actions written to the audit log</li>
            </ul>
          </SectionBody>
        </SectionCard>
      </Grid>

      <SectionCard>
        <SectionHead>
          <h2><FiList style={{ display: 'inline', marginRight: 6 }} />Audit log</h2>
        </SectionHead>
        <SectionBody style={{ padding: 0 }}>
          <DataTable>
            <thead>
              <tr>
                <Th>When</Th>
                <Th>Actor</Th>
                <Th>Action</Th>
                <Th>Target</Th>
                <Th>IP</Th>
              </tr>
            </thead>
            <tbody>
              {logsLoading ? (
                <TableBodySkeleton rows={8} cols={5} />
              ) : logs.length === 0 ? (
                <Tr>
                  <Td colSpan={5} style={{ color: adminColors.muted }}>
                    No audit events yet. Enable 2FA, block a user, or impersonate to generate entries.
                  </Td>
                </Tr>
              ) : (
                logs.map((row) => (
                  <Tr key={row.id}>
                    <Td style={{ whiteSpace: 'nowrap', fontSize: 12 }}>
                      {row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}
                    </Td>
                    <Td style={{ fontWeight: 600, color: adminColors.navy }}>{row.actorEmail}</Td>
                    <Td><code style={{ fontSize: 12 }}>{row.action}</code></Td>
                    <Td style={{ fontSize: 12, color: adminColors.muted }}>
                      {row.targetType ? `${row.targetType}:${row.targetId || '—'}` : '—'}
                    </Td>
                    <Td style={{ fontSize: 12 }}>{row.ip || '—'}</Td>
                  </Tr>
                ))
              )}
            </tbody>
          </DataTable>
        </SectionBody>
      </SectionCard>
    </PageWrap>
  );
};

export default AdminSecurity;
