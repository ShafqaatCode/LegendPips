import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { DashboardPreviews } from '../../services/adminEngagementService';
import { KYC_STATUS_LABELS, type KycStatus } from '../../services/kycService';
import {
  PreviewGrid, SectionCard, SectionHead, SectionBody,
  ShowAllBtn, PreviewRow, Pill, EmptyPreview,
} from './adminUi';

interface AdminDashboardPreviewsProps {
  previews?: DashboardPreviews;
  loading?: boolean;
}

const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString() : '—');

const AdminDashboardPreviews: React.FC<AdminDashboardPreviewsProps> = ({ previews, loading }) => {
  const navigate = useNavigate();

  if (loading || !previews) {
    return (
      <PreviewGrid>
        {Array.from({ length: 5 }).map((_, i) => (
          <SectionCard key={i} style={{ marginBottom: 0 }}>
            <SectionHead><h2>Loading…</h2></SectionHead>
            <SectionBody><EmptyPreview>…</EmptyPreview></SectionBody>
          </SectionCard>
        ))}
      </PreviewGrid>
    );
  }

  return (
    <PreviewGrid>
      <SectionCard style={{ marginBottom: 0 }}>
        <SectionHead>
          <h2>Recent Users</h2>
          <ShowAllBtn type="button" onClick={() => navigate('/admin-panel/users')}>Show all →</ShowAllBtn>
        </SectionHead>
        <SectionBody style={{ paddingTop: 0 }}>
          {previews.recentUsers.length === 0 ? (
            <EmptyPreview>No users yet</EmptyPreview>
          ) : (
            previews.recentUsers.map((u) => (
              <PreviewRow key={u.id} onClick={() => navigate(`/admin-panel/users/${u.id}`)}>
                <div className="main">
                  <div className="title">{u.firstName} {u.lastName}</div>
                  <div className="sub">{u.email}</div>
                </div>
                <Pill $variant={u.kycStatus || 'incomplete'}>
                  {KYC_STATUS_LABELS[(u.kycStatus || 'incomplete') as KycStatus]?.slice(0, 8) || '—'}
                </Pill>
              </PreviewRow>
            ))
          )}
        </SectionBody>
      </SectionCard>

      <SectionCard style={{ marginBottom: 0 }}>
        <SectionHead>
          <h2>Recent Contests</h2>
          <ShowAllBtn type="button" onClick={() => navigate('/admin-panel/contests')}>Show all →</ShowAllBtn>
        </SectionHead>
        <SectionBody style={{ paddingTop: 0 }}>
          {previews.recentContests.length === 0 ? (
            <EmptyPreview>No contests yet</EmptyPreview>
          ) : (
            previews.recentContests.map((c) => (
              <PreviewRow key={c.id} onClick={() => navigate('/admin-panel/contests')}>
                <div className="main">
                  <div className="title">{c.title}</div>
                  <div className="sub">{c.participants} participants · {c.entry || 'Free'}</div>
                </div>
                <Pill $variant={c.status === 'Ongoing' ? 'active' : c.status === 'Ended' ? 'default' : 'pending'}>
                  {c.status}
                </Pill>
              </PreviewRow>
            ))
          )}
        </SectionBody>
      </SectionCard>

      <SectionCard style={{ marginBottom: 0 }}>
        <SectionHead>
          <h2>Pending KYC</h2>
          <ShowAllBtn type="button" onClick={() => navigate('/admin-panel/kyc-records?filter=pending')}>Show all →</ShowAllBtn>
        </SectionHead>
        <SectionBody style={{ paddingTop: 0 }}>
          {previews.pendingKyc.length === 0 ? (
            <EmptyPreview>No pending reviews</EmptyPreview>
          ) : (
            previews.pendingKyc.map((u) => (
              <PreviewRow key={u.id} onClick={() => navigate(`/admin-panel/kyc-records/${u.id}`, { state: { kycFilter: 'pending' } })}>
                <div className="main">
                  <div className="title">{u.firstName} {u.lastName}</div>
                  <div className="sub">{u.email}</div>
                </div>
                <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>{fmtDate(u.submittedAt)}</span>
              </PreviewRow>
            ))
          )}
        </SectionBody>
      </SectionCard>

      <SectionCard style={{ marginBottom: 0 }}>
        <SectionHead>
          <h2>Recent Feedback</h2>
          <ShowAllBtn type="button" onClick={() => navigate('/admin-panel/feedback-inbox')}>Show all →</ShowAllBtn>
        </SectionHead>
        <SectionBody style={{ paddingTop: 0 }}>
          {previews.recentFeedback.length === 0 ? (
            <EmptyPreview>No feedback yet</EmptyPreview>
          ) : (
            previews.recentFeedback.map((f) => (
              <PreviewRow key={f.id} onClick={() => navigate('/admin-panel/feedback-inbox')}>
                <div className="main">
                  <div className="title">{f.name || f.email}</div>
                  <div className="sub">{f.preview || '—'}</div>
                </div>
                <Pill $variant={f.status === 'new' ? 'pending' : 'default'}>{f.status}</Pill>
              </PreviewRow>
            ))
          )}
        </SectionBody>
      </SectionCard>

      <SectionCard style={{ marginBottom: 0, gridColumn: 'span 2' }}>
        <SectionHead>
          <h2>Recent Activity</h2>
          <ShowAllBtn type="button" onClick={() => navigate('/admin-panel/user-activity')}>Show all →</ShowAllBtn>
        </SectionHead>
        <SectionBody style={{ paddingTop: 0 }}>
          {previews.recentActivity.length === 0 ? (
            <EmptyPreview>No activity logged</EmptyPreview>
          ) : (
            previews.recentActivity.map((a) => (
              <PreviewRow key={a.id} onClick={() => navigate('/admin-panel/user-activity')}>
                <div className="main">
                  <div className="title"><strong>{a.userLabel}</strong> — {a.title}</div>
                  <div className="sub">{a.type} · {a.time}</div>
                </div>
              </PreviewRow>
            ))
          )}
        </SectionBody>
      </SectionCard>
    </PreviewGrid>
  );
};

export default AdminDashboardPreviews;
