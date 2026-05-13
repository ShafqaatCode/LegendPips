import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  FiActivity,
  FiAward,
  FiVideo,
  FiBook,
  FiTrendingUp,
  FiMessageSquare,
  FiSend,
  FiDollarSign,
} from 'react-icons/fi';
import { fetchMyActivity, type ActivityRow } from '../../../services/userInsightService';

const iconForType = (type: string): React.ElementType => {
  switch (type) {
    case 'contest':
      return FiAward;
    case 'webinar':
      return FiVideo;
    case 'course':
      return FiBook;
    case 'signal':
      return FiTrendingUp;
    case 'forum':
      return FiMessageSquare;
    case 'feedback':
      return FiSend;
    case 'rebate':
      return FiDollarSign;
    default:
      return FiActivity;
  }
};

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #132E58;
  margin: 0;
`;

const ActivityTimeline = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
`;

const ActivityItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid #e5e7eb;
  
  &:last-child {
    border-bottom: none;
  }
`;

const IconWrapper = styled.div<{ $type: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ $type }) => {
    if ($type === 'contest') return '#Fbbf2415';
    if ($type === 'webinar') return '#3b82f615';
    if ($type === 'course') return '#8b5cf615';
    if ($type === 'signal') return '#10b98115';
    if ($type === 'forum') return '#ec489915';
    if ($type === 'feedback') return '#6366f115';
    if ($type === 'rebate') return '#10b98115';
    return '#6b728015';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    color: ${({ $type }) => {
      if ($type === 'contest') return '#Fbbf24';
      if ($type === 'webinar') return '#3b82f6';
      if ($type === 'course') return '#8b5cf6';
      if ($type === 'signal') return '#10b981';
      if ($type === 'forum') return '#ec4899';
      if ($type === 'feedback') return '#6366f1';
      if ($type === 'rebate') return '#10b981';
      return '#6b7280';
    }};
    font-size: 1.5rem;
  }
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #132E58;
  margin: 0 0 0.25rem 0;
`;

const ActivityDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
`;

const ActivityTime = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
`;

const Meta = styled.span`
  font-size: 0.7rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-left: 0.5rem;
`;

const ErrorBanner = styled.div`
  background: #fef2f2;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
`;

const LoadMore = styled.button`
  margin-top: 1rem;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  border: 2px solid #132E58;
  background: white;
  color: #132E58;
  font-weight: 600;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.p`
  color: #6b7280;
  text-align: center;
  padding: 2rem;
  margin: 0;
`;

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

  useEffect(() => {
    load(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load only
  }, []);

  return (
    <Container>
      <Header>
        <Title>Activity</Title>
      </Header>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <ActivityTimeline>
        {loading && <EmptyState>Loading…</EmptyState>}
        {!loading && items.length === 0 && (
          <EmptyState>No activity yet. Join a contest, take a course, or post on the forum to see events here.</EmptyState>
        )}
        {!loading &&
          items.map((activity) => {
            const Icon = iconForType(activity.type);
            return (
              <ActivityItem key={activity.id}>
                <IconWrapper $type={activity.type}>
                  <Icon />
                </IconWrapper>
                <ActivityContent>
                  <ActivityTitle>
                    {activity.title}
                    <Meta>{activity.type}</Meta>
                  </ActivityTitle>
                  <ActivityDescription>{activity.description}</ActivityDescription>
                  <ActivityTime>{activity.time}</ActivityTime>
                </ActivityContent>
              </ActivityItem>
            );
          })}
        {pagination?.hasNextPage && (
          <LoadMore
            type="button"
            disabled={loadingMore}
            onClick={() => load(page + 1, true)}
          >
            {loadingMore ? 'Loading…' : 'Load more'}
          </LoadMore>
        )}
      </ActivityTimeline>
    </Container>
  );
};

export default Activity;
