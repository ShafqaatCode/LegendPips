import React from 'react';
import styled from 'styled-components';
import { FiActivity, FiAward, FiVideo, FiBook, FiTrendingUp, FiMessageSquare } from 'react-icons/fi';

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

const Activity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'signal',
      title: 'New Signal Received',
      description: 'EUR/USD BUY signal at 1.0850',
      time: '2 hours ago',
      icon: FiTrendingUp,
    },
    {
      id: 2,
      type: 'contest',
      title: 'Contest Rank Updated',
      description: 'You moved to rank #45 in Forex Trading Championship',
      time: '5 hours ago',
      icon: FiAward,
    },
    {
      id: 3,
      type: 'webinar',
      title: 'Webinar Completed',
      description: 'You completed "Advanced Forex Trading Strategies"',
      time: '1 day ago',
      icon: FiVideo,
    },
    {
      id: 4,
      type: 'course',
      title: 'Course Progress',
      description: 'Completed lesson 8 of 12 in "Forex Trading Basics"',
      time: '2 days ago',
      icon: FiBook,
    },
    {
      id: 5,
      type: 'forum',
      title: 'Forum Reply',
      description: 'Someone replied to your post "Best Trading Strategy for Beginners"',
      time: '3 days ago',
      icon: FiMessageSquare,
    },
  ];

  return (
    <Container>
      <Header>
        <Title>Activity</Title>
      </Header>

      <ActivityTimeline>
        {activities.map((activity) => (
          <ActivityItem key={activity.id}>
            <IconWrapper $type={activity.type}>
              <activity.icon />
            </IconWrapper>
            <ActivityContent>
              <ActivityTitle>{activity.title}</ActivityTitle>
              <ActivityDescription>{activity.description}</ActivityDescription>
              <ActivityTime>{activity.time}</ActivityTime>
            </ActivityContent>
          </ActivityItem>
        ))}
      </ActivityTimeline>
    </Container>
  );
};

export default Activity;
