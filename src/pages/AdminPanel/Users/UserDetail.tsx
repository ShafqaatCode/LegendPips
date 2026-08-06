import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiX, FiSlash, FiCheckCircle, FiTrash2, FiLogIn } from 'react-icons/fi';
import {
  getAdminUserDetail, reviewKyc, KYC_STATUS_LABELS, DOCUMENT_LABELS,
  type KycStatus, type KycDocumentType,
} from '../../../services/kycService';
import { blockOrUnblockUser, deleteUser, impersonateUser } from '../../../services/userService';
import { applyAuthSession } from '../../../services/authService';
import { useAuth } from '../../../contexts/AuthContext';
import SimpleModal from '../../../components/AdminPanel/SimpleModal';
import {
  PageWrap, Pill, SectionCard, SectionHead, SectionBody,
  GhostButton, PrimaryButton, ErrorBanner, UserAvatar, ActionGroup,
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
  const [impersonating, setImpersonating] = useState(false);

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

  const handleReview = async (action: 'approve' | 'reject') => {
    if (!id) return;
    setReviewing(true);
    setError('');
    try {
      await reviewKyc(id, action, action === 'reject' ? rejectionReason : undefined);
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
    const action = user.status === 'blocked' ? 'unblock' : 'block';
    if (!window.confirm(`${action === 'block' ? 'Ban' : 'Unban'} this user?`)) return;
    try {
      await blockOrUnblockUser(id, action);
      await loadUser();
    } catch (e: any) {
      setError(e.message);
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
    if (!window.confirm(`Sign in as ${user.firstName} ${user.lastName}? You will be taken to their user panel.`)) return;
    setImpersonating(true);
    setError('');
    try {
      const data = await impersonateUser(id);
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
          <GhostButton $sm type="button" onClick={handleBlockToggle} disabled={user.role === 'admin'}>
            {user.status === 'blocked' ? <><FiCheckCircle /> Unban</> : <><FiSlash /> Ban</>}
          </GhostButton>
          <GhostButton $sm $danger type="button" onClick={() => setShowDelete(true)} disabled={user.role === 'admin'}>
            <FiTrash2 /> Delete
          </GhostButton>
        </ActionGroup>
      </ProfileRow>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <Grid>
        <SectionCard style={{ margin: 0 }}>
          <SectionHead><h2>Account</h2></SectionHead>
          <SectionBody>
            <InfoRow><span>Joined</span><span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</span></InfoRow>
            {profile?.submittedAt && <InfoRow><span>KYC submitted</span><span>{new Date(profile.submittedAt).toLocaleString()}</span></InfoRow>}
            {profile?.reviewedAt && <InfoRow><span>Reviewed</span><span>{new Date(profile.reviewedAt).toLocaleString()}</span></InfoRow>}
            {profile?.rejectionReason && <InfoRow><span>Rejection</span><span>{profile.rejectionReason}</span></InfoRow>}
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

      {user.kycDocuments?.length > 0 && (
        <SectionCard>
          <SectionHead><h2>Documents</h2></SectionHead>
          <SectionBody>
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

            {kycStatus === 'pending' && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <TextArea
                  placeholder="Rejection reason (required if rejecting)…"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
                <ActionGroup>
                  <PrimaryButton $sm type="button" disabled={reviewing} onClick={() => handleReview('approve')}>
                    <FiCheck /> Approve
                  </PrimaryButton>
                  <GhostButton $sm $danger type="button" disabled={reviewing} onClick={() => handleReview('reject')}>
                    <FiX /> Reject
                  </GhostButton>
                </ActionGroup>
              </div>
            )}
          </SectionBody>
        </SectionCard>
      )}

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
    </PageWrap>
  );
};

export default UserDetail;
