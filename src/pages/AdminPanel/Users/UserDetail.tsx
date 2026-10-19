import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiX, FiSlash, FiCheckCircle, FiTrash2, FiLogIn, FiActivity, FiMail } from 'react-icons/fi';
import {
  getAdminUserDetail, reviewKyc, KYC_STATUS_LABELS, DOCUMENT_LABELS,
  type KycStatus, type KycDocumentType,
} from '../../../services/kycService';
import { blockOrUnblockUser, deleteUser, impersonateUser, sendEmailToUser } from '../../../services/userService';
import {
  adminAssignUserCare,
  adminListAccountManagers,
  type AccountManager,
} from '../../../services/accountManagerService';
import { fetchBrokersPage, type ApiBroker } from '../../../services/brokerService';
import { applyAuthSession, stashAdminSession } from '../../../services/authService';
import { fetchAdminActivityFeed, type AdminActivityFeedRow } from '../../../services/adminEngagementService';
import { useAuth } from '../../../contexts/AuthContext';
import SimpleModal from '../../../components/AdminPanel/SimpleModal';
import { TableBodySkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, Pill, SectionCard, SectionHead, SectionBody,
  GhostButton, PrimaryButton, ErrorBanner, UserAvatar, ActionGroup,
  DataTable, Th, Td, Tr, adminColors,
} from '../../../components/AdminPanel/adminUi';

const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-bottom: 0.875rem;

  &:hover { color: #132E58; }
`;

const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const ProfileInfo = styled.div`
  flex: 1;
  min-width: 200px;

  h1 {
    margin: 0 0 0.15rem;
    font-size: 1.125rem;
    font-weight: 700;
    color: #132E58;
  }

  p { margin: 0; font-size: 0.8125rem; color: #64748b; }
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 0.75rem;

  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.45rem 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.8125rem;

  &:last-child { border-bottom: none; }
  span:first-child { color: #64748b; }
  span:last-child { color: #132E58; font-weight: 600; text-align: right; max-width: 58%; }
`;

const DocGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.625rem;
`;

const DocCard = styled.a`
  border: 1px solid #e8ecf1;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;

  img { width: 100%; height: 100px; object-fit: cover; background: #f1f5f9; }
  div { padding: 0.5rem; font-size: 0.6875rem; font-weight: 700; color: #132E58; }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 72px;
  padding: 0.625rem;
  border: 1px solid #e8ecf1;
  border-radius: 8px;
  font-size: 0.8125rem;
  resize: vertical;
  outline: none;
  margin-bottom: 0.625rem;

  &:focus { border-color: #132E58; }
`;

const CareGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;

  label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: #64748b;
  }

  select {
    border: 1px solid #e8ecf1;
    border-radius: 8px;
    padding: 0.55rem 0.65rem;
    font-size: 0.8125rem;
    font-family: inherit;
    color: #132e58;
    background: #fff;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser: setAuthUser } = useAuth();
  const fromKyc = location.pathname.startsWith('/admin-panel/kyc-records');
  const kycFilter = (location.state as { kycFilter?: string } | null)?.kycFilter;
  const backPath = fromKyc
    ? `/admin-panel/kyc-records${kycFilter ? `?filter=${kycFilter}` : ''}`
    : '/admin-panel/users';
  const backLabel = fromKyc ? 'KYC records' : 'users';
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showBan, setShowBan] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [banLoading, setBanLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState('');
  const [impersonating, setImpersonating] = useState(false);
  const [activity, setActivity] = useState<AdminActivityFeedRow[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [managers, setManagers] = useState<AccountManager[]>([]);
  const [brokers, setBrokers] = useState<ApiBroker[]>([]);
  const [managerId, setManagerId] = useState('');
  const [brokerId, setBrokerId] = useState('');
  const [premiumAccess, setPremiumAccess] = useState(false);
  const [careSaving, setCareSaving] = useState(false);
  const [careMsg, setCareMsg] = useState('');

  const loadUser = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      setUser(await getAdminUserDetail(id));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUser(); }, [id]);

  useEffect(() => {
    if (!user) return;
    setManagerId(user.assignedManagerId || '');
    setBrokerId(user.recommendedBrokerId || '');
    setPremiumAccess(!!user.premiumSignalsAccess);
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [mgrs, brokerPage] = await Promise.all([
          adminListAccountManagers(false),
          fetchBrokersPage({ page: 1, limit: 50 }),
        ]);
        if (cancelled) return;
        setManagers(mgrs);
        setBrokers(brokerPage.items || []);
      } catch {
        /* assignment UI still usable with empty lists */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        setActivityLoading(true);
        const data = await fetchAdminActivityFeed(1, 40, { userId: id });
        if (!cancelled) setActivity(data.items || []);
      } catch {
        if (!cancelled) setActivity([]);
      } finally {
        if (!cancelled) setActivityLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const saveCareAssignment = async () => {
    if (!id) return;
    setCareSaving(true);
    setCareMsg('');
    setError('');
    try {
      const res = await adminAssignUserCare(id, {
        assignedManagerId: managerId || null,
        recommendedBrokerId: brokerId || null,
        premiumSignalsAccess: premiumAccess,
      });
      const refreshed = await getAdminUserDetail(id).catch(() => res.user);
      setUser(refreshed);
      setManagerId((refreshed as { assignedManagerId?: string | null })?.assignedManagerId || managerId || '');
      setBrokerId((refreshed as { recommendedBrokerId?: string | null })?.recommendedBrokerId || brokerId || '');
      setPremiumAccess(!!(refreshed as { premiumSignalsAccess?: boolean })?.premiumSignalsAccess);
      setCareMsg(
        premiumAccess
          ? `Premium signals unlocked for ${user?.email || 'this user'}.`
          : managerId
            ? `Manager assigned to ${user?.email || "this user"}. Log in (or Impersonate) as that user to see the card in their panel.`
            : res.message || "Assignment saved"
      );
    } catch (e: any) {
      setError(e.message || 'Failed to save assignment');
    } finally {
      setCareSaving(false);
    }
  };

  const handleReview = async (action: 'approve' | 'reject' | 'unverify') => {
    if (!id) return;
    if ((action === 'reject' || action === 'unverify') && !rejectionReason.trim()) {
      setError(
        action === 'unverify'
          ? 'Please explain why this user is being marked unverified (e.g. expired ID).'
          : 'Rejection reason is required.'
      );
      return;
    }
    if (
      action === 'unverify' &&
      !window.confirm(
        'Mark this user unverified? They will be notified with your reason and must resubmit documents.'
      )
    ) {
      return;
    }
    setReviewing(true);
    setError('');
    try {
      await reviewKyc(
        id,
        action,
        action === 'approve' ? undefined : rejectionReason.trim()
      );
      await loadUser();
      setRejectionReason('');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setReviewing(false);
    }
  };

  const handleBlockToggle = async () => {
    if (!id || !user) return;
    if (user.status === 'blocked') {
      if (!window.confirm('Re-enable this user? They will be able to sign in again and will get a notification email.')) return;
      try {
        await blockOrUnblockUser(id, 'unblock');
        await loadUser();
      } catch (e: any) {
        setError(e.message);
      }
      return;
    }
    setBanReason('');
    setShowBan(true);
  };

  const confirmBan = async () => {
    if (!id) return;
    if (!banReason.trim()) {
      setError('Please provide a reason. The user will see this in their email.');
      return;
    }
    setBanLoading(true);
    setError('');
    try {
      await blockOrUnblockUser(id, 'block', banReason.trim());
      setShowBan(false);
      setBanReason('');
      await loadUser();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBanLoading(false);
    }
  };

  const openEmail = () => {
    setEmailSubject('');
    setEmailMessage('');
    setEmailSuccess('');
    setError('');
    setShowEmail(true);
  };

  const confirmEmail = async () => {
    if (!id) return;
    if (!emailSubject.trim() || !emailMessage.trim()) {
      setError('Subject and message are required.');
      return;
    }
    setEmailSending(true);
    setError('');
    setEmailSuccess('');
    try {
      const res = await sendEmailToUser(id, {
        subject: emailSubject.trim(),
        message: emailMessage.trim(),
      });
      setEmailSuccess(res.message || 'Email sent.');
      setEmailSubject('');
      setEmailMessage('');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setEmailSending(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteUser(id);
      navigate(backPath);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleLoginAsUser = async () => {
    if (!id || !user) return;
    if (user.role === 'admin') return;
    if (
      !window.confirm(
        `Sign in as ${user.firstName} ${user.lastName}? You will open their user panel. Use “Return to admin” anytime to come back to the admin panel.`
      )
    )
      return;
    setImpersonating(true);
    setError('');
    try {
      const data = await impersonateUser(id);
      stashAdminSession();
      applyAuthSession(data.token, data.user);
      setAuthUser(data.user);
      window.location.href = '/user-panel';
    } catch (e: any) {
      setError(e.message);
      setImpersonating(false);
    }
  };

  if (loading) return <PageWrap><p style={{ fontSize: '0.8125rem', color: '#64748b' }}>Loading…</p></PageWrap>;
  if (!user) return (
    <PageWrap>
      <BackLink onClick={() => navigate(backPath)}><FiArrowLeft /> {fromKyc ? 'Back to KYC records' : 'Back to users'}</BackLink>
      <ErrorBanner>{error || 'User not found'}</ErrorBanner>
    </PageWrap>
  );

  const kycStatus = (user.kycStatus || 'incomplete') as KycStatus;
  const profile = user.kycProfile;

  return (
    <PageWrap>
      <BackLink onClick={() => navigate(backPath)}><FiArrowLeft /> Back to {backLabel.toLowerCase()}</BackLink>

      <ProfileRow>
        <UserAvatar style={{ width: 48, height: 48, fontSize: '0.875rem', borderRadius: '10px' }}>
          {user.firstName[0]}{user.lastName[0]}
        </UserAvatar>
        <ProfileInfo>
          <h1>{user.firstName} {user.lastName}</h1>
          <p>{user.email}{user.phone ? ` · ${user.phone}` : ''}</p>
        </ProfileInfo>
        <BadgeRow>
          <Pill $variant={user.role}>{user.role}</Pill>
          <Pill $variant={user.status}>{user.status === 'blocked' ? 'banned' : user.status}</Pill>
          <Pill $variant={kycStatus}>{KYC_STATUS_LABELS[kycStatus]}</Pill>
        </BadgeRow>
        <ActionGroup>
          <PrimaryButton
            $sm
            type="button"
            onClick={handleLoginAsUser}
            disabled={user.role === 'admin' || impersonating}
            title={user.role === 'admin' ? 'Cannot sign in as admin' : 'Open user panel as this user'}
          >
            <FiLogIn /> {impersonating ? 'Signing in…' : 'Login as user'}
          </PrimaryButton>
          <GhostButton $sm type="button" onClick={openEmail} disabled={!user.email}>
            <FiMail /> Email
          </GhostButton>
          <GhostButton $sm type="button" onClick={handleBlockToggle} disabled={user.role === 'admin'}>
            {user.status === 'blocked' ? <><FiCheckCircle /> Enable</> : <><FiSlash /> Disable</>}
          </GhostButton>
          <GhostButton $sm $danger type="button" onClick={() => setShowDelete(true)} disabled={user.role === 'admin'}>
            <FiTrash2 /> Delete
          </GhostButton>
        </ActionGroup>
      </ProfileRow>

      {error && <ErrorBanner>{error}</ErrorBanner>}
      {careMsg && (
        <div style={{
          padding: '0.625rem 0.875rem',
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: 8,
          color: '#047857',
          fontSize: '0.8125rem',
          marginBottom: '0.875rem',
        }}>
          {careMsg}
        </div>
      )}
      {emailSuccess && !showEmail && (
        <div style={{
          padding: '0.625rem 0.875rem',
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: 8,
          color: '#047857',
          fontSize: '0.8125rem',
          marginBottom: '0.875rem',
        }}>
          {emailSuccess}
        </div>
      )}

      <SectionCard style={{ marginBottom: '0.75rem' }}>
        <SectionHead>
          <h2>Account manager & recommended broker</h2>
        </SectionHead>
        <SectionBody>
          <CareGrid>
            <label>
              Account manager
              <select value={managerId} onChange={(e) => setManagerId(e.target.value)}>
                <option value="">— Not assigned —</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id} disabled={m.active === false}>
                    {m.name}{m.active === false ? " (inactive)" : ""}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Recommended broker
              <select value={brokerId} onChange={(e) => setBrokerId(e.target.value)}>
                <option value="">— Not assigned —</option>
                {brokers.map((b) => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </label>
          </CareGrid>
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.55rem',
              marginTop: '0.85rem',
              padding: '0.75rem 0.85rem',
              border: '1px solid #e8ecf1',
              borderRadius: 8,
              background: premiumAccess ? '#ecfdf5' : '#f8fafc',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              color: '#132E58',
            }}
          >
            <input
              type="checkbox"
              checked={premiumAccess}
              onChange={(e) => setPremiumAccess(e.target.checked)}
              style={{ marginTop: 2 }}
            />
            <span>
              <strong style={{ display: 'block', marginBottom: 2 }}>Premium signals access</strong>
              <span style={{ color: '#64748b', fontWeight: 500 }}>
                Unlock full entry / TP / SL for premium signals. Also granted automatically when a live account is approved.
              </span>
            </span>
          </label>
          <div style={{ marginTop: '0.75rem' }}>
            <PrimaryButton type="button" $sm onClick={saveCareAssignment} disabled={careSaving}>
              {careSaving ? 'Saving…' : 'Save assignment'}
            </PrimaryButton>
          </div>
        </SectionBody>
      </SectionCard>

      <Grid>
        <SectionCard style={{ margin: 0 }}>
          <SectionHead><h2>Account</h2></SectionHead>
          <SectionBody>
            <InfoRow><span>Joined</span><span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</span></InfoRow>
            {user.status === 'blocked' && user.blockReason && (
              <InfoRow><span>Disable reason</span><span>{user.blockReason}</span></InfoRow>
            )}
            {user.status === 'blocked' && user.blockedAt && (
              <InfoRow><span>Disabled at</span><span>{new Date(user.blockedAt).toLocaleString()}</span></InfoRow>
            )}
            {profile?.submittedAt && <InfoRow><span>KYC submitted</span><span>{new Date(profile.submittedAt).toLocaleString()}</span></InfoRow>}
            {profile?.reviewedAt && <InfoRow><span>Reviewed</span><span>{new Date(profile.reviewedAt).toLocaleString()}</span></InfoRow>}
            {profile?.rejectionReason && (
              <InfoRow>
                <span>{kycStatus === 'rejected' ? 'Unverified reason' : 'Rejection'}</span>
                <span>{profile.rejectionReason}</span>
              </InfoRow>
            )}
          </SectionBody>
        </SectionCard>

        <SectionCard style={{ margin: 0 }}>
          <SectionHead><h2>KYC Profile</h2></SectionHead>
          <SectionBody>
            {profile ? (
              <>
                <InfoRow><span>DOB</span><span>{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : '—'}</span></InfoRow>
                <InfoRow><span>Nationality</span><span>{profile.nationality || '—'}</span></InfoRow>
                <InfoRow><span>ID</span><span>{profile.idDocumentType?.replace(/_/g, ' ')} · {profile.idDocumentNumber}</span></InfoRow>
                <InfoRow><span>Address</span><span>{[profile.addressLine1, profile.city, profile.country].filter(Boolean).join(', ')}</span></InfoRow>
              </>
            ) : (
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#94a3b8' }}>No KYC submitted.</p>
            )}
          </SectionBody>
        </SectionCard>
      </Grid>

      {(user.kycDocuments?.length > 0 || kycStatus === 'approved' || kycStatus === 'rejected' || kycStatus === 'pending') && (
        <SectionCard>
          <SectionHead><h2>Documents & verification actions</h2></SectionHead>
          <SectionBody>
            {user.kycDocuments?.length > 0 ? (
              <DocGrid>
                {user.kycDocuments.map((doc: { type: KycDocumentType; url: string }) => (
                  <DocCard key={doc.type} href={doc.url} target="_blank" rel="noopener noreferrer">
                    {doc.url.toLowerCase().includes('.pdf') ? (
                      <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', fontSize: '0.75rem' }}>PDF</div>
                    ) : (
                      <img src={doc.url} alt={DOCUMENT_LABELS[doc.type]} />
                    )}
                    <div>{DOCUMENT_LABELS[doc.type]}</div>
                  </DocCard>
                ))}
              </DocGrid>
            ) : (
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.8125rem', color: '#94a3b8' }}>No documents on file.</p>
            )}

            {(kycStatus === 'pending' || kycStatus === 'approved' || kycStatus === 'rejected') && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                {(kycStatus === 'pending' || kycStatus === 'approved') && (
                  <TextArea
                    placeholder={
                      kycStatus === 'approved'
                        ? 'Reason for marking unverified (required) — e.g. ID expired, blurry selfie, address proof outdated…'
                        : 'Rejection reason (required if rejecting)…'
                    }
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                )}
                <ActionGroup>
                  {kycStatus === 'pending' && (
                    <>
                      <PrimaryButton $sm type="button" disabled={reviewing} onClick={() => handleReview('approve')}>
                        <FiCheck /> Approve / Verify
                      </PrimaryButton>
                      <GhostButton $sm $danger type="button" disabled={reviewing} onClick={() => handleReview('reject')}>
                        <FiX /> Reject
                      </GhostButton>
                    </>
                  )}
                  {kycStatus === 'approved' && (
                    <GhostButton $sm $danger type="button" disabled={reviewing} onClick={() => handleReview('unverify')}>
                      <FiX /> Mark unverified
                    </GhostButton>
                  )}
                  {kycStatus === 'rejected' && (
                    <PrimaryButton $sm type="button" disabled={reviewing} onClick={() => handleReview('approve')}>
                      <FiCheck /> Re-verify user
                    </PrimaryButton>
                  )}
                </ActionGroup>
                {kycStatus === 'approved' && (
                  <p style={{ margin: '0.55rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                    Use this if documents expired or failed a check. The user is notified with your reason and must resubmit.
                  </p>
                )}
                {kycStatus === 'rejected' && (
                  <p style={{ margin: '0.55rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                    User can resubmit after fixing the issue. Or re-verify here if the previous decision should be reversed.
                  </p>
                )}
              </div>
            )}
          </SectionBody>
        </SectionCard>
      )}

      <SectionCard>
        <SectionHead>
          <h2><FiActivity style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Activity history</h2>
        </SectionHead>
        <SectionBody style={{ padding: 0 }}>
          <DataTable>
            <thead>
              <tr>
                <Th>When</Th>
                <Th>Type</Th>
                <Th>Title</Th>
                <Th>Details</Th>
              </tr>
            </thead>
            <tbody>
              {activityLoading && <TableBodySkeleton rows={5} cols={4} />}
              {!activityLoading && activity.map((row) => (
                <Tr key={row.id}>
                  <Td style={{ whiteSpace: 'nowrap', fontSize: 12, color: adminColors.muted }}>
                    {row.createdAt ? new Date(row.createdAt).toLocaleString() : row.time}
                  </Td>
                  <Td><Pill $variant="user">{row.type}</Pill></Td>
                  <Td style={{ fontWeight: 600, color: adminColors.navy }}>{row.title}</Td>
                  <Td style={{ fontSize: 12, color: adminColors.muted }}>{row.description || '—'}</Td>
                </Tr>
              ))}
              {!activityLoading && activity.length === 0 && (
                <Tr>
                  <Td colSpan={4} style={{ color: adminColors.muted, textAlign: 'center', padding: '1.25rem' }}>
                    No activity logged for this user yet.
                  </Td>
                </Tr>
              )}
            </tbody>
          </DataTable>
        </SectionBody>
      </SectionCard>

      <SimpleModal
        isOpen={showDelete}
        title="Delete User"
        onClose={() => setShowDelete(false)}
        footer={
          <>
            <GhostButton type="button" onClick={() => setShowDelete(false)}>Cancel</GhostButton>
            <GhostButton $danger type="button" onClick={handleDelete}><FiTrash2 /> Delete</GhostButton>
          </>
        }
      >
        <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>Permanently delete {user.firstName} {user.lastName}?</p>
      </SimpleModal>

      <SimpleModal
        isOpen={showBan}
        title="Disable account"
        onClose={() => !banLoading && setShowBan(false)}
        footer={
          <>
            <GhostButton type="button" onClick={() => setShowBan(false)} disabled={banLoading}>Cancel</GhostButton>
            <GhostButton $danger type="button" onClick={confirmBan} disabled={banLoading || !banReason.trim()}>
              <FiSlash /> {banLoading ? 'Disabling…' : 'Disable & email user'}
            </GhostButton>
          </>
        }
      >
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.5 }}>
          {user.firstName} will not be able to sign in. They will receive an email with your reason and a link to contact support.
        </p>
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
          Reason (required — included in email)
        </label>
        <TextArea
          value={banReason}
          onChange={(e) => setBanReason(e.target.value)}
          placeholder="e.g. Multiple ToS violations / suspected fraud / requested by compliance…"
          maxLength={1000}
        />
      </SimpleModal>

      <SimpleModal
        isOpen={showEmail}
        title={`Email ${user.firstName}`}
        onClose={() => !emailSending && setShowEmail(false)}
        footer={
          <>
            <GhostButton type="button" onClick={() => setShowEmail(false)} disabled={emailSending}>
              {emailSuccess ? 'Close' : 'Cancel'}
            </GhostButton>
            <PrimaryButton
              type="button"
              onClick={confirmEmail}
              disabled={emailSending || !emailSubject.trim() || !emailMessage.trim()}
            >
              <FiMail /> {emailSending ? 'Sending…' : 'Send email'}
            </PrimaryButton>
          </>
        }
      >
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.5 }}>
          Sending to <strong style={{ color: '#132E58' }}>{user.email}</strong>
        </p>
        {emailSuccess && (
          <div style={{
            padding: '0.55rem 0.75rem',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: 8,
            color: '#047857',
            fontSize: '0.8125rem',
            marginBottom: '0.75rem',
          }}>
            {emailSuccess}
          </div>
        )}
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
          Subject
        </label>
        <input
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          placeholder="Email subject"
          style={{
            width: '100%',
            marginBottom: 12,
            padding: '0.55rem 0.65rem',
            border: '1px solid #e8ecf1',
            borderRadius: 8,
            fontSize: '0.8125rem',
            boxSizing: 'border-box',
          }}
        />
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
          Message
        </label>
        <TextArea
          value={emailMessage}
          onChange={(e) => setEmailMessage(e.target.value)}
          placeholder="Write your message…"
        />
      </SimpleModal>
    </PageWrap>
  );
};

export default UserDetail;
