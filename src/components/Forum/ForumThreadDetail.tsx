import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchForumThread, postForumComment, type ForumThreadDetailResponse } from '../../services/forumService';
import { getAuthToken } from '../../utils/apiConfig';

const PageWrapper = styled.section`
  background: #fafbfc;
  padding: 60px 3rem;
  min-height: 100vh;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 40px 2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 30px 1.5rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const MainContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.5rem;
    border-radius: 12px;
  }
`;

const ThreadHeader = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
`;

const ThreadTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #132E58;
  margin-bottom: 1rem;
  line-height: 1.3;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 24px;
  }
`;

const ThreadMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  font-size: 14px;
  color: #666;
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionBadge = styled.button`
  background: #Fbbf24;
  color: #132E58;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 1rem;
  margin-right: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f4b400;
    transform: translateY(-2px);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ $primary?: boolean; $yellow?: boolean }>`
  background: ${({ $primary, $yellow }) =>
    $yellow ? '#Fbbf24' : $primary ? '#132E58' : 'white'};
  color: ${({ $primary, $yellow }) =>
    $yellow ? '#132E58' : $primary ? 'white' : '#132E58'};
  border: 2px solid #132E58;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${({ $primary, $yellow }) =>
      $yellow ? '#f4b400' : $primary ? '#0b1b38' : '#f0f7ff'};
    transform: translateY(-2px);
  }
  
  img {
    width: 16px;
    height: 16px;
  }
`;

const PostCard = styled.div`
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #132E58 0%, #0b1b38 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
  flex-shrink: 0;
`;

const PostAuthorInfo = styled.div`
  flex: 1;
`;

const AuthorName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #132E58;
  margin-bottom: 0.25rem;
`;

const PostDate = styled.div`
  font-size: 13px;
  color: #999;
`;

const PostContent = styled.div`
  margin-bottom: 1.5rem;
`;

const PostText = styled.p`
  font-size: 15px;
  line-height: 1.7;
  color: #333;
  margin-bottom: 1rem;
`;

const PostImage = styled.img`
  width: 100%;
  border-radius: 8px;
  margin-top: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CommentsSection = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
`;

const CommentsHeader = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #132E58;
  margin-bottom: 1rem;
`;

const CommentForm = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  font-size: 14px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #132E58;
    box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const PostCommentButton = styled.button`
  background: #132E58;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background: #0b1b38;
    transform: translateY(-2px);
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CommentItem = styled.div`
  display: flex;
  gap: 1rem;
`;

const CommentAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ color }) => color || 'linear-gradient(135deg, #10b981 0%, #059669 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
`;

const CommentContent = styled.div`
  flex: 1;
`;

const CommentAuthor = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #132E58;
  margin-bottom: 0.25rem;
`;

const CommentText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 0.5rem;
`;

const CommentDate = styled.span`
  font-size: 12px;
  color: #999;
`;

const CommentActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.75rem;
`;

const ActionIcon = styled.button<{ $type?: 'up' | 'down' }>`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f0f0f0;
    color: #132E58;
  }
  
  &::before {
    content: ${({ $type }) => $type === 'up' ? '"👍"' : '"👎"'};
    font-size: 16px;
  }
`;

const ReplyButton = styled.button`
  background: transparent;
  border: 1px solid #e0e0e0;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #132E58;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f0f7ff;
    border-color: #132E58;
  }
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: sticky;
  top: 100px;
  align-self: start;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: relative;
    top: 0;
  }
`;

const SidebarSection = styled.div<{ $white?: boolean }>`
  background: ${({ $white }) => ($white ? 'white' : '#132E58')};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`;

const SidebarTitle = styled.h3<{ $dark?: boolean }>`
  font-size: 20px;
  font-weight: 700;
  color: ${({ $dark }) => ($dark ? '#132E58' : 'white')};
  margin-bottom: 1.5rem;
`;

const ThreadList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ThreadItem = styled.li<{ $dark?: boolean }>`
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.75rem;
  border-radius: 8px;
  
  &:hover {
    background: ${({ $dark }) => ($dark ? '#f0f7ff' : 'rgba(255, 255, 255, 0.1)')};
  }
`;

const ThreadItemTitle = styled.div<{ $dark?: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${({ $dark }) => ($dark ? '#132E58' : 'white')};
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const ThreadItemDate = styled.div<{ $dark?: boolean }>`
  font-size: 12px;
  color: ${({ $dark }) => ($dark ? '#999' : 'rgba(255, 255, 255, 0.7)')};
`;

const ForumThreadDetail: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [data, setData] = useState<ForumThreadDetailResponse['thread'] | null>(null);
  const [related, setRelated] = useState<{ id: string; title: string; date: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  const loadThread = useCallback(async () => {
    if (!threadId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchForumThread(threadId);
      setData(res.thread);
      setRelated(res.related || []);
    } catch (e: any) {
      setError(e.message || 'Thread not found');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    loadThread();
  }, [loadThread]);

  const handlePostComment = async () => {
    if (!comment.trim() || !threadId) return;
    if (!getAuthToken()) {
      navigate('/signin', { state: { from: `/forum/thread/${threadId}` } });
      return;
    }
    setPosting(true);
    try {
      await postForumComment(threadId, comment.trim());
      setComment('');
      await loadThread();
    } catch (e: any) {
      alert(e.message || 'Failed to post comment');
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <ContentWrapper>
          <MainContent>
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Loading thread…</div>
          </MainContent>
        </ContentWrapper>
      </PageWrapper>
    );
  }

  if (error || !data) {
    return (
      <PageWrapper>
        <ContentWrapper>
          <MainContent>
            <div style={{ padding: '2rem', textAlign: 'center', color: '#b91c1c' }}>{error || 'Not found'}</div>
          </MainContent>
        </ContentWrapper>
      </PageWrapper>
    );
  }

  const threadData = data;

  return (
    <PageWrapper>
      <ContentWrapper>
        <MainContent>
          <ThreadHeader>
            <ThreadTitle>{threadData.title}</ThreadTitle>
            <ThreadMeta>
              <MetaItem>Created {threadData.created}</MetaItem>
              <MetaItem>👤 {threadData.participants} participants</MetaItem>
              <MetaItem>💬 {threadData.replies} replies</MetaItem>
            </ThreadMeta>
          </ThreadHeader>

          <ActionButtons>
            <SectionBadge type="button">
              {threadData.title.length > 28 ? `${threadData.title.slice(0, 28)}…` : threadData.title}
            </SectionBadge>
            <ActionButton $yellow>Latest Posts</ActionButton>
            <ActionButton $primary>
              Add a Post
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </ActionButton>
          </ActionButtons>

          <PostCard>
            <PostHeader>
              <Avatar>{threadData.post.avatar}</Avatar>
              <PostAuthorInfo>
                <AuthorName>{threadData.post.author}</AuthorName>
                <PostDate>{threadData.post.date}</PostDate>
              </PostAuthorInfo>
            </PostHeader>
            <PostContent>
              <PostText>{threadData.post.content}</PostText>
              {threadData.post.image ? (
                <PostImage src={threadData.post.image} alt="Thread attachment" />
              ) : null}
              <PostActions>
                <ActionIcon $type="up">{threadData.post.likes}</ActionIcon>
                <ActionIcon $type="down">{threadData.post.dislikes}</ActionIcon>
              </PostActions>
            </PostContent>
          </PostCard>

          <CommentsSection>
            <CommentsHeader>{threadData.comments.length} Comment{threadData.comments.length !== 1 ? 's' : ''}</CommentsHeader>
            
            <CommentForm>
              <CommentInput
                type="text"
                placeholder="Leave a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
              />
              <PostCommentButton type="button" onClick={handlePostComment} disabled={posting}>
                {posting ? 'Posting…' : 'Post'}
              </PostCommentButton>
            </CommentForm>

            <CommentList>
              {threadData.comments.map((comment) => (
                <CommentItem key={comment.id}>
                  <CommentAvatar color={comment.avatarColor}>{comment.avatar}</CommentAvatar>
                  <CommentContent>
                    <CommentAuthor>{comment.author}</CommentAuthor>
                    <CommentText>{comment.content}</CommentText>
                    <CommentDate>{comment.date}</CommentDate>
                    <CommentActions>
                      <ActionIcon $type="up">{comment.likes || 0}</ActionIcon>
                      <ActionIcon $type="down">{comment.dislikes || 0}</ActionIcon>
                      <ReplyButton>Reply</ReplyButton>
                    </CommentActions>
                  </CommentContent>
                </CommentItem>
              ))}
            </CommentList>
          </CommentsSection>
        </MainContent>

        <Sidebar>
          <SidebarSection>
            <SidebarTitle>Related Threads</SidebarTitle>
            <ThreadList>
              {related.map((thread) => (
                <ThreadItem key={thread.id} onClick={() => navigate(`/forum/thread/${thread.id}`)}>
                  <ThreadItemTitle>{thread.title}</ThreadItemTitle>
                  <ThreadItemDate>{thread.date}</ThreadItemDate>
                </ThreadItem>
              ))}
            </ThreadList>
          </SidebarSection>

          <SidebarSection $white>
            <SidebarTitle $dark>Latest market news</SidebarTitle>
            <ThreadList>
              {[
                { id: '1', title: 'Dollar Dynamics: USD Cup and Handle, USD/JPY Breakout and EUR/USD 1.1500', date: 'November 22, 2025 12:07 AM' },
                { id: '2', title: 'Crypto Forecast: Bitcoin Collapse Extends 36% Off Record High - BTC/USD', date: 'November 21, 2025 11:52 PM' },
                { id: '3', title: 'Gold Price Analysis: XAUUSD Tests Key Support Level', date: 'November 21, 2025 08:41 PM' },
                { id: '4', title: 'Stock Market Update: Major Indices Show Mixed Signals', date: 'November 21, 2025 06:41 PM' },
                { id: '5', title: 'Forex Market Outlook: Central Bank Decisions Ahead', date: 'November 21, 2025 05:35 PM' }
              ].map((news) => (
                <ThreadItem key={news.id} $dark onClick={() => navigate(`/analysis/${news.id}`)}>
                  <ThreadItemTitle $dark>{news.title}</ThreadItemTitle>
                  <ThreadItemDate $dark>{news.date}</ThreadItemDate>
                </ThreadItem>
              ))}
            </ThreadList>
          </SidebarSection>
        </Sidebar>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default ForumThreadDetail;
