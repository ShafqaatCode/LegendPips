import React, { useState } from 'react';
import styled from 'styled-components';
import { FiMessageSquare, FiThumbsUp, FiThumbsDown, FiCalendar, FiUser } from 'react-icons/fi';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #132E58;
  margin: 0;
`;

const PostsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PostCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    border-color: #Fbbf24;
  }
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const PostTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #132E58;
  margin: 0;
  flex: 1;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  
  svg {
    color: #Fbbf24;
  }
`;

const PostContent = styled.p`
  color: #6b7280;
  font-size: 0.9375rem;
  line-height: 1.6;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PostFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const PostStats = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  
  svg {
    color: #132E58;
  }
`;

const ViewButton = styled.button`
  background: #132E58;
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #1a4a7a;
  }
`;

const ForumPosts: React.FC = () => {
  const posts = [
    {
      id: 1,
      title: 'Best Trading Strategy for Beginners',
      content: 'I\'ve been trading for 6 months now and wanted to share my experience with beginners. Here are some key strategies that helped me...',
      author: 'John Doe',
      date: '2024-01-15',
      likes: 24,
      replies: 8,
      views: 156,
    },
    {
      id: 2,
      title: 'EUR/USD Analysis - Current Market Trends',
      content: 'Let\'s discuss the current EUR/USD trends and what we can expect in the coming weeks. I\'ve noticed some interesting patterns...',
      author: 'John Doe',
      date: '2024-01-14',
      likes: 18,
      replies: 12,
      views: 203,
    },
    {
      id: 3,
      title: 'Risk Management Tips That Changed My Trading',
      content: 'After losing significant capital early in my trading journey, I learned the importance of proper risk management. Here are my top tips...',
      author: 'John Doe',
      date: '2024-01-13',
      likes: 32,
      replies: 15,
      views: 289,
    },
  ];

  return (
    <Container>
      <Header>
        <Title>My Forum Posts</Title>
      </Header>

      <PostsList>
        {posts.map((post) => (
          <PostCard key={post.id}>
            <PostHeader>
              <PostTitle>{post.title}</PostTitle>
            </PostHeader>
            <PostMeta>
              <span>
                <FiUser />
                {post.author}
              </span>
              <span>
                <FiCalendar />
                {post.date}
              </span>
            </PostMeta>
            <PostContent>{post.content}</PostContent>
            <PostFooter>
              <PostStats>
                <StatItem>
                  <FiThumbsUp />
                  {post.likes}
                </StatItem>
                <StatItem>
                  <FiMessageSquare />
                  {post.replies} Replies
                </StatItem>
                <StatItem>
                  {post.views} Views
                </StatItem>
              </PostStats>
              <ViewButton>View Thread</ViewButton>
            </PostFooter>
          </PostCard>
        ))}
      </PostsList>
    </Container>
  );
};

export default ForumPosts;
