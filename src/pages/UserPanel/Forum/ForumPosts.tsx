import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiThumbsUp, FiCalendar, FiUser } from 'react-icons/fi';
import { fetchMyForumPosts, type MyForumPostItem } from '../../../services/forumService';
import { PanelCardListSkeleton } from '../../../components/SharedComponents/Shimmer';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle,
  ListStack, ListCard, CardTitle, MetaLine, CardFooter,
  PrimaryButton, EmptyState, ErrorBanner,
} from '../../../components/UserPanel/userUi';

const ForumPosts: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<MyForumPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPosts(await fetchMyForumPosts());
    } catch (e: any) {
      setError(e.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <PageWrap>
        <PageHeader><PageTitle><FiMessageSquare /> Forum Posts</PageTitle></PageHeader>
        <EmptyState><PanelCardListSkeleton cards={3} /></EmptyState>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle><FiMessageSquare /> Forum Posts</PageTitle>
        <PageSubtitle>Threads you started or commented on</PageSubtitle>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      {posts.length === 0 ? (
        <EmptyState>
          <p>No forum posts yet.</p>
          <PrimaryButton $sm type="button" style={{ marginTop: 8 }} onClick={() => navigate('/forum')}>Browse forums</PrimaryButton>
        </EmptyState>
      ) : (
        <ListStack>
          {posts.map((post) => (
            <ListCard key={post.id} onClick={() => navigate(`/forum/thread/${post.id}`)}>
              <CardTitle>{post.title}</CardTitle>
              <MetaLine><FiUser />{post.author} · <FiCalendar />{post.date}</MetaLine>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {post.content}
              </p>
              <CardFooter>
                <span><FiThumbsUp style={{ marginRight: 4 }} />{post.likes} · {post.replies} replies · {post.views} views</span>
                <PrimaryButton $sm type="button" onClick={(e) => { e.stopPropagation(); navigate(`/forum/thread/${post.id}`); }}>View</PrimaryButton>
              </CardFooter>
            </ListCard>
          ))}
        </ListStack>
      )}
    </PageWrap>
  );
};

export default ForumPosts;
