import React, { useEffect, useState } from 'react';
import {
  FiActivity, FiAward, FiVideo, FiBook, FiTrendingUp,
  FiMessageSquare, FiSend, FiDollarSign,
} from 'react-icons/fi';
import { fetchMyActivity, type ActivityRow } from '../../../services/userInsightService';
import { ActivityTimelineSkeleton, ShimmerBar } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle,
  TimelineList, TimelineItem, TimelineIcon,
  ErrorBanner, GhostButton, EmptyState,
} from '../../../components/UserPanel/userUi';

const iconForType = (type: string): { icon: React.ElementType; color: string } => {
  switch (type) {
    case 'contest': return { icon: FiAward, color: '#Fbbf24' };
    case 'webinar': return { icon: FiVideo, color: '#3b82f6' };
    case 'course': return { icon: FiBook, color: '#8b5cf6' };
    case 'signal': return { icon: FiTrendingUp, color: '#10b981' };
    case 'forum': return { icon: FiMessageSquare, color: '#ec4899' };
    case 'feedback': return { icon: FiSend, color: '#6366f1' };
    case 'rebate': return { icon: FiDollarSign, color: '#059669' };
    default: return { icon: FiActivity, color: '#64748b' };
  }
};

const Activity: React.FC = () => {
  const [items, setItems] = useState<ActivityRow[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<{ hasNextPage: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (nextPage: number, append: boolean) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);
      const data = await fetchMyActivity(nextPage, 30);
      setPagination(data.pagination);
      setItems((prev) => (append ? [...prev, ...data.items] : data.items));
      setPage(nextPage);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load activity');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => { load(1, false); }, []);

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle><FiActivity /> Activity</PageTitle>
        <PageSubtitle>Your platform activity timeline</PageSubtitle>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <TimelineList>
        {loading && <div style={{ padding: '0.75rem 0' }}><ActivityTimelineSkeleton rows={6} /></div>}
        {!loading && items.length === 0 && (
          <EmptyState style={{ border: 'none' }}>No activity yet. Join contests, courses, or forum to see events here.</EmptyState>
        )}
        {!loading && items.map((activity) => {
          const { icon: Icon, color } = iconForType(activity.type);
          return (
            <TimelineItem key={activity.id}>
              <TimelineIcon $color={color}><Icon /></TimelineIcon>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#132E58' }}>
                  {activity.title}
                  <span style={{ marginLeft: 6, fontSize: '0.625rem', color: '#94a3b8', textTransform: 'uppercase' }}>{activity.type}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>{activity.description}</div>
                <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: 4 }}>{activity.time}</div>
              </div>
            </TimelineItem>
          );
        })}
      </TimelineList>

      {pagination?.hasNextPage && (
        <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
          <GhostButton type="button" disabled={loadingMore} onClick={() => load(page + 1, true)}>
            {loadingMore ? <ShimmerBar $h="12px" $w="60px" /> : 'Load more'}
          </GhostButton>
        </div>
      )}
    </PageWrap>
  );
};

export default Activity;
