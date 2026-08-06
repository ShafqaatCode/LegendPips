import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiUsers, FiAward, FiShield, FiInbox, FiActivity, FiClock, FiUserPlus, FiShuffle,
} from 'react-icons/fi';
import type { DashboardPreviews } from '../../services/adminEngagementService';
import { KYC_STATUS_LABELS, type KycStatus } from '../../services/kycService';
import {
  SectionCard, SectionHead, SectionBody,
  ShowAllBtn, Pill, EmptyPreview, adminColors,
} from './adminUi';
import { ShimmerBar } from '../SharedComponents/Shimmer';

interface AdminDashboardPreviewsProps {
  previews?: DashboardPreviews;
  loading?: boolean;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
  margin-bottom: 0.5rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const Wide = styled(SectionCard)`
  margin-bottom: 0;
  grid-column: span 2;

  @media (max-width: 1100px) {
    grid-column: span 2;
  }
  @media (max-width: 700px) {
    grid-column: span 1;
  }
`;

const Card = styled(SectionCard)`
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  min-height: 280px;
`;

const HeadIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: linear-gradient(145deg, ${adminColors.navy}, ${adminColors.navyLight});
  color: ${adminColors.gold};
  font-size: 0.8rem;
  margin-right: 0.4rem;
`;

const Row = styled.button`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  width: 100%;
  padding: 0.6rem 0.15rem;
  border: none;
  border-bottom: 1px solid #f1f5f9;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background 0.1s;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #f8fafc;
  }
`;

const Avatar = styled.div<{ $tone?: string }>`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 800;
  color: white;
  background: ${({ $tone }) => $tone || `linear-gradient(135deg, ${adminColors.navy}, ${adminColors.navyLight})`};
`;

const RowMain = styled.div`
  flex: 1;
  min-width: 0;
  .title {
    font-size: 0.8125rem;
    font-weight: 700;
    color: ${adminColors.navy};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sub {
    font-size: 0.6875rem;
    color: ${adminColors.muted};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 0.1rem;
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
  flex-shrink: 0;

  .time {
    font-size: 0.625rem;
    font-weight: 600;
    color: ${adminColors.muted};
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
  }
`;

const ActivityDot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
  box-shadow: 0 0 0 3px ${({ $color }) => `${$color}22`};
`;

const CountBadge = styled.span`
  margin-left: 0.35rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: #f1f5f9;
  color: ${adminColors.muted};
  font-size: 0.625rem;
  font-weight: 800;
`;

const initials = (first?: string, last?: string, email?: string) => {
  const a = (first || '').charAt(0);
  const b = (last || '').charAt(0);
  if (a || b) return `${a}${b}`.toUpperCase();
  return (email || '?').charAt(0).toUpperCase();
};

const fmtDate = (d?: string) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return '—';
  }
};

const TYPE_COLORS: Record<string, string> = {
  contest: '#Fbbf24',
  webinar: '#8b5cf6',
  course: '#6366f1',
  forum: '#ec4899',
  feedback: '#6366f1',
  signal: '#f59e0b',
  rebate: '#10b981',
  kyc: '#3b82f6',
};

const AdminDashboardPreviews: React.FC<AdminDashboardPreviewsProps> = ({ previews, loading }) => {
  const navigate = useNavigate();

  if (loading || !previews) {
    return (
      <Grid>
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <SectionHead><h2>Loading…</h2></SectionHead>
            <SectionBody>
              <ShimmerBar $h="18px" $w="70%" $mb="12px" />
              <ShimmerBar $h="18px" $w="90%" $mb="12px" />
              <ShimmerBar $h="18px" $w="55%" $mb="0" />
            </SectionBody>
          </Card>
        ))}
      </Grid>
    );
  }

  return (
    <Grid>
      <Card>
        <SectionHead>
          <h2>
            <HeadIcon><FiUsers /></HeadIcon>
            Recent users
            <CountBadge>{previews.recentUsers.length}</CountBadge>
          </h2>
          <ShowAllBtn type="button" onClick={() => navigate('/admin-panel/users')}>Show all →</ShowAllBtn>
        </SectionHead>
        <SectionBody style={{ paddingTop: 0, flex: 1 }}>
          {previews.recentUsers.length === 0 ? (
            <EmptyPreview>No users yet</EmptyPreview>
          ) : (
            previews.recentUsers.map((u) => (
              <Row key={u.id} type="button" onClick={() => navigate(`/admin-panel/users/${u.id}`)}>
                <Avatar>{initials(u.firstName, u.lastName, u.email)}</Avatar>
                <RowMain>
                  <div className="title">{u.firstName} {u.lastName}</div>
                  <div className="sub">{u.email}</div>
                </RowMain>
                <Right>
                  <Pill $variant={u.kycStatus || 'incomplete'}>
                    {KYC_STATUS_LABELS[(u.kycStatus || 'incomplete') as KycStatus]?.slice(0, 10) || '—'}
                  </Pill>
                  <span className="time"><FiClock /> {fmtDate(u.createdAt)}</span>
                </Right>
              </Row>
            ))
          )}
        </SectionBody>
      </Card>

      <Card>
        <SectionHead>
          <h2>
            <HeadIcon><FiShield /></HeadIcon>
            Pending KYC
            <CountBadge>{previews.pendingKyc.length}</CountBadge>
          </h2>
          <ShowAllBtn type="button" onClick={() => navigate('/admin-panel/kyc-records?filter=pending')}>
            Show all →
          </ShowAllBtn>
        </SectionHead>
        <SectionBody style={{ paddingTop: 0, flex: 1 }}>
          {previews.pendingKyc.length === 0 ? (
            <EmptyPreview>No pending reviews — queue is clear</EmptyPreview>
          ) : (
            previews.pendingKyc.map((u) => (
              <Row
                key={u.id}
                type="button"
                onClick={() =>
                  navigate(`/admin-panel/kyc-records/${u.id}`, { state: { kycFilter: 'pending' } })
                }
              >
                <Avatar $tone="linear-gradient(135deg, #f59e0b, #d97706)">
                  {initials(u.firstName, u.lastName, u.email)}
                </Avatar>
                <RowMain>
                  <div className="title">{u.firstName} {u.lastName}</div>
                  <div className="sub">{u.email}</div>
                </RowMain>
                <Right>
                  <Pill $variant="pending">Pending</Pill>
                  <span className="time"><FiClock /> {fmtDate(u.submittedAt)}</span>
                </Right>
              </Row>
            ))
          )}
        </SectionBody>
      </Card>

      <Card>
        <SectionHead>
          <h2>
            <HeadIcon><FiInbox /></HeadIcon>
            Feedback
            <CountBadge>{previews.recentFeedback.length}</CountBadge>
          </h2>
          <ShowAllBtn type="button" onClick={() => navigate('/admin-panel/feedback-inbox')}>
            Show all →
          </ShowAllBtn>
        </SectionHead>
        <SectionBody style={{ paddingTop: 0, flex: 1 }}>
          {previews.recentFeedback.length === 0 ? (
            <EmptyPreview>No feedback yet</EmptyPreview>
          ) : (
            previews.recentFeedback.map((f) => (
              <Row key={f.id} type="button" onClick={() => navigate('/admin-panel/feedback-inbox')}>
                <Avatar $tone="linear-gradient(135deg, #ec4899, #db2777)">
                  {(f.name || f.email || '?').charAt(0).toUpperCase()}
                </Avatar>
                <RowMain>
                  <div className="title">{f.name || f.email}</div>
                  <div className="sub">{f.preview || '—'}</div>
                </RowMain>
                <Right>
                  <Pill $variant={f.status === 'new' ? 'pending' : 'default'}>{f.status}</Pill>
                  <span className="time"><FiClock /> {fmtDate(f.createdAt)}</span>
                </Right>
              </Row>
            ))
          )}
        </SectionBody>
      </Card>

      <Card>
        <SectionHead>
          <h2>
            <HeadIcon><FiAward /></HeadIcon>
            Contests
            <CountBadge>{previews.recentContests.length}</CountBadge>
          </h2>
          <ShowAllBtn type="button" onClick={() => navigate('/admin-panel/contests')}>
            Show all →
          </ShowAllBtn>
        </SectionHead>
        <SectionBody style={{ paddingTop: 0, flex: 1 }}>
          {previews.recentContests.length === 0 ? (
            <EmptyPreview>No contests yet</EmptyPreview>
          ) : (
            previews.recentContests.map((c) => (
              <Row key={c.id} type="button" onClick={() => navigate('/admin-panel/contests')}>
                <Avatar $tone="linear-gradient(135deg, #Fbbf24, #d97706)">
                  {c.title.charAt(0).toUpperCase()}
                </Avatar>
                <RowMain>
                  <div className="title">{c.title}</div>
                  <div className="sub">{c.participants} participants · {c.entry || 'Free'}</div>
                </RowMain>
                <Right>
                  <Pill $variant={c.status === 'Ongoing' ? 'active' : c.status === 'Ended' ? 'default' : 'pending'}>
                    {c.status}
                  </Pill>
                </Right>
              </Row>
            ))
          )}
        </SectionBody>
      </Card>

      <Card>
        <SectionHead>
          <h2>
            <HeadIcon><FiUserPlus /></HeadIcon>
            Referrals
            <CountBadge>{(previews.recentReferrals || []).length}</CountBadge>
          </h2>
          <ShowAllBtn type="button" onClick={() => navigate('/admin-panel/referrals')}>
            Show all →
          </ShowAllBtn>
        </SectionHead>
        <SectionBody style={{ paddingTop: 0, flex: 1 }}>
          {(previews.recentReferrals || []).length === 0 ? (
            <EmptyPreview>No friend invites sent yet</EmptyPreview>
          ) : (
            (previews.recentReferrals || []).map((r) => (
              <Row key={r.id} type="button" onClick={() => navigate('/admin-panel/referrals')}>
                <Avatar $tone="linear-gradient(135deg, #132E58, #1e4a8c)">
                  {(r.inviterName || '?').charAt(0).toUpperCase()}
                </Avatar>
                <RowMain>
                  <div className="title">{r.inviterName} → {r.toEmail}</div>
                  <div className="sub">
                    {r.templateTitle}
                    {r.friendName ? ` · ${r.friendName}` : ''}
                  </div>
                </RowMain>
                <Right>
                  <span className="time"><FiClock /> {r.time || fmtDate(r.createdAt)}</span>
                </Right>
              </Row>
            ))
          )}
        </SectionBody>
      </Card>

      <Card>
        <SectionHead>
          <h2>
            <HeadIcon><FiShuffle /></HeadIcon>
            IB change
            <CountBadge>{(previews.recentIbChanges || []).length}</CountBadge>
          </h2>
          <ShowAllBtn type="button" onClick={() => navigate('/admin-panel/ib-change')}>
            Show all →
          </ShowAllBtn>
        </SectionHead>
        <SectionBody style={{ paddingTop: 0, flex: 1 }}>
          {(previews.recentIbChanges || []).length === 0 ? (
            <EmptyPreview>No IB change requests yet</EmptyPreview>
          ) : (
            (previews.recentIbChanges || []).map((r) => (
              <Row key={r.id} type="button" onClick={() => navigate('/admin-panel/ib-change')}>
                <Avatar $tone="linear-gradient(135deg, #0f766e, #0d9488)">
                  {(r.userName || '?').charAt(0).toUpperCase()}
                </Avatar>
                <RowMain>
                  <div className="title">{r.userName}</div>
                  <div className="sub">
                    {r.currentBroker} → {r.requestedBroker}
                  </div>
                </RowMain>
                <Right>
                  <Pill $variant={r.status === 'new' ? 'pending' : r.status === 'completed' ? 'active' : 'user'}>
                    {r.status === 'in_progress' ? 'Working' : r.status}
                  </Pill>
                  <span className="time"><FiClock /> {r.time || fmtDate(r.createdAt)}</span>
                </Right>
              </Row>
            ))
          )}
        </SectionBody>
      </Card>

      <Wide>
        <SectionHead>
          <h2>
            <HeadIcon><FiActivity /></HeadIcon>
            Recent activity
            <CountBadge>{previews.recentActivity.length}</CountBadge>
          </h2>
          <ShowAllBtn type="button" onClick={() => navigate('/admin-panel/user-activity')}>
            Show all →
          </ShowAllBtn>
        </SectionHead>
        <SectionBody style={{ paddingTop: 0 }}>
          {previews.recentActivity.length === 0 ? (
            <EmptyPreview>No activity logged yet</EmptyPreview>
          ) : (
            previews.recentActivity.map((a) => (
              <Row key={a.id} type="button" onClick={() => navigate('/admin-panel/user-activity')}>
                <ActivityDot $color={TYPE_COLORS[a.type] || adminColors.muted} />
                <RowMain>
                  <div className="title">
                    <strong>{a.userLabel}</strong>
                    <span style={{ fontWeight: 500, color: adminColors.muted }}> — {a.title}</span>
                  </div>
                  <div className="sub" style={{ textTransform: 'capitalize' }}>{a.type}</div>
                </RowMain>
                <Right>
                  <span className="time"><FiClock /> {a.time}</span>
                </Right>
              </Row>
            ))
          )}
        </SectionBody>
      </Wide>
    </Grid>
  );
};

export default AdminDashboardPreviews;
