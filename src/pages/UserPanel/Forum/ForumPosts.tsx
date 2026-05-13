import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiMessageSquare, FiThumbsUp, FiThumbsDown, FiCalendar, FiUser, FiLoader } from "react-icons/fi";
import { fetchMyForumPosts, type MyForumPostItem } from "../../../services/forumService";

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
  color: #132e58;
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
    border-color: #fbbf24;
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
  color: #132e58;
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
    color: #fbbf24;
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
    color: #132e58;
  }
`;

const ViewButton = styled.button`
  background: #132e58;
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

const Empty = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  color: #6b7280;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const ForumPosts: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<MyForumPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchMyForumPosts();
      setPosts(items);
    } catch (e: any) {
      setError(e.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>My Forum Posts</Title>
        </Header>
        <Empty>
          <FiLoader style={{ fontSize: "2rem", marginBottom: "0.5rem" }} />
          Loading…
        </Empty>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <Title>My Forum Posts</Title>
        </Header>
        <Empty style={{ color: "#b91c1c" }}>{error}</Empty>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>My Forum Posts</Title>
      </Header>

      {posts.length === 0 ? (
        <Empty>
          <p>Threads you start or comment on will show here.</p>
          <p style={{ marginTop: "0.75rem" }}>
            <ViewButton type="button" onClick={() => navigate("/forum")}>
              Browse forums
            </ViewButton>
          </p>
        </Empty>
      ) : (
        <PostsList>
          {posts.map((post) => (
            <PostCard key={post.id} onClick={() => navigate(`/forum/thread/${post.id}`)}>
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
                  <StatItem>{post.views} Views</StatItem>
                </PostStats>
                <ViewButton
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/forum/thread/${post.id}`);
                  }}
                >
                  View Thread
                </ViewButton>
              </PostFooter>
            </PostCard>
          ))}
        </PostsList>
      )}
    </Container>
  );
};

export default ForumPosts;
