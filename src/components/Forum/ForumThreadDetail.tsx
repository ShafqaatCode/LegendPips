import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiHeart,
  FiMessageCircle,
  FiArrowLeft,
  FiCopy,
  FiAlertCircle,
  FiEye,
  FiSend,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import {
  fetchForumThread,
  postForumComment,
  toggleForumLike,
  type ForumThreadDetailResponse,
  type ForumCommentNode,
} from '../../services/forumService';
import { getAuthToken } from '../../utils/apiConfig';
import {
  findContentSafetyIssue,
  openWhatsAppShare,
  copyShareLink,
} from '../../utils/contentSafety';
import { ForumThreadSkeleton } from '../SharedComponents/Shimmer';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthModal } from '../../contexts/AuthModalContext';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageWrapper = styled.section`
  background:
    radial-gradient(ellipse 70% 40% at 0% 0%, rgba(251, 191, 36, 0.1), transparent 50%),
    linear-gradient(180deg, #f7f9fc 0%, #eef2f8 100%);
  padding: 48px ${({ theme }) => theme.typography.pageGutter};
  min-height: 70vh;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 28px 1.25rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  background: #fff;
  border-radius: 18px;
  padding: 1.75rem 1.85rem;
  border: 1px solid rgba(19, 46, 88, 0.07);
  box-shadow: 0 16px 40px rgba(19, 46, 88, 0.07);
  animation: ${fadeUp} 0.4s ease both;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.25rem;
  }
`;

const BackBtn = styled.button`
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  margin-bottom: 1rem;
  padding: 0;

  &:hover {
    color: #132e58;
  }
`;

const ThreadTitle = styled.h1`
  font-size: clamp(1.4rem, 3vw, 1.85rem);
  font-weight: 800;
  color: #132e58;
  margin: 0 0 0.75rem;
  line-height: 1.3;
  letter-spacing: -0.02em;
`;

const ThreadMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 13px;
  color: #64748b;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #f1f5f9;
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
`;

const PostCard = styled.div`
  background: linear-gradient(180deg, #fafbfd 0%, #fff 40%);
  border: 1px solid #eef2f7;
  border-radius: 14px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 1rem;
`;

const Avatar = styled.div<{ $size?: number }>`
  width: ${({ $size }) => $size || 48}px;
  height: ${({ $size }) => $size || 48}px;
  border-radius: 50%;
  background: linear-gradient(145deg, #132e58, #1e4976);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: ${({ $size }) => (($size || 48) > 40 ? 14 : 12)}px;
  flex-shrink: 0;
`;

const AuthorName = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #132e58;
`;

const PostDate = styled.div`
  font-size: 12px;
  color: #94a3b8;
`;

const PostText = styled.p`
  font-size: 15px;
  line-height: 1.75;
  color: #334155;
  margin: 0 0 1rem;
  white-space: pre-wrap;
`;

const PostImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
  max-height: min(72vh, 720px);
  object-fit: contain;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 1rem;
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
  padding-top: 0.85rem;
  border-top: 1px solid #f1f5f9;
`;

const ActionBtn = styled.button<{ $active?: boolean }>`
  background: ${({ $active }) => ($active ? 'rgba(251, 191, 36, 0.2)' : 'transparent')};
  border: none;
  color: ${({ $active }) => ($active ? '#b45309' : '#64748b')};
  font-size: 13px;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: #f8fafc;
    color: #132e58;
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;

const CommentsSection = styled.div`
  margin-top: 0.5rem;
`;

const CommentsHeader = styled.h3`
  font-size: 16px;
  font-weight: 800;
  color: #132e58;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CommentForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-bottom: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  padding: 0.85rem;
  border: 1px solid #eef2f7;
`;

const CommentInput = styled.textarea`
  width: 100%;
  min-height: 72px;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  resize: vertical;
  font-family: inherit;
  background: #fff;

  &:focus {
    outline: none;
    border-color: #fbbf24;
    box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.2);
  }
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Hint = styled.span`
  font-size: 11px;
  color: #94a3b8;
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: 13px;
  color: #b91c1c;
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const PostCommentButton = styled.button`
  background: linear-gradient(135deg, #132e58, #0b1b38);
  color: white;
  border: none;
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover:not(:disabled) {
    filter: brightness(1.08);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const CommentItem = styled.div<{ $depth?: number }>`
  display: flex;
  gap: 0.75rem;
  padding: ${({ $depth }) => ($depth ? '0.65rem 0.7rem' : '0.85rem')};
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  background: ${({ $depth }) => ($depth ? '#fafbfc' : '#fff')};
  margin-left: ${({ $depth }) => Math.min(($depth || 0) * 18, 54)}px;
`;

const CommentText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
  margin: 0.25rem 0;
  white-space: pre-wrap;
`;

const CommentDate = styled.span`
  font-size: 11px;
  color: #94a3b8;
`;

const ReplyToTag = styled.span`
  font-size: 11px;
  color: #92400e;
  background: rgba(251, 191, 36, 0.18);
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 600;
`;

const ReplyBtn = styled.button`
  background: transparent;
  border: none;
  color: #132e58;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;

  &:hover {
    background: #f1f5f9;
  }
`;

const NestedReplies = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-top: 0.65rem;
`;

const InlineReplyBox = styled.div`
  margin-top: 0.65rem;
  padding: 0.65rem;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: sticky;
  top: 100px;
  align-self: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: relative;
    top: 0;
  }
`;

const SidebarSection = styled.div`
  background: #132e58;
  border-radius: 14px;
  padding: 1.25rem;
  box-shadow: 0 12px 32px rgba(19, 46, 88, 0.2);
`;

const SidebarTitle = styled.h3`
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 1rem;
`;

const ThreadList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ThreadItem = styled.li`
  cursor: pointer;
  padding: 0.65rem 0.7rem;
  border-radius: 8px;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ThreadItemTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.25rem;
  line-height: 1.4;
`;

const ThreadItemDate = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.65);
`;

const SafetyCard = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 1.15rem;
  border: 1px solid rgba(251, 191, 36, 0.35);
  box-shadow: 0 8px 24px rgba(19, 46, 88, 0.06);
`;

const SafetyTitle = styled.h4`
  margin: 0 0 0.5rem;
  font-size: 14px;
  font-weight: 800;
  color: #132e58;
`;

const SafetyText = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.55;
  color: #64748b;
`;

const Toast = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #132e58;
  color: #fff;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  z-index: 1000;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
`;

type Thread = ForumThreadDetailResponse['thread'];

const countAllComments = (nodes: ForumCommentNode[]): number =>
  nodes.reduce((sum, n) => sum + 1 + countAllComments(n.replies || []), 0);

const mapCommentTree = (
  nodes: ForumCommentNode[],
  id: string,
  updater: (c: ForumCommentNode) => ForumCommentNode
): ForumCommentNode[] =>
  nodes.map((n) => {
    if (n.id === id) return updater(n);
    if (n.replies?.length) {
      return { ...n, replies: mapCommentTree(n.replies, id, updater) };
    }
    return n;
  });

const insertReplyInTree = (
  nodes: ForumCommentNode[],
  parentId: string,
  reply: ForumCommentNode
): ForumCommentNode[] =>
  nodes.map((n) => {
    if (n.id === parentId) {
      return { ...n, replies: [...(n.replies || []), { ...reply, replies: reply.replies || [] }] };
    }
    if (n.replies?.length) {
      return { ...n, replies: insertReplyInTree(n.replies, parentId, reply) };
    }
    return n;
  });

const findInTree = (nodes: ForumCommentNode[], id: string): ForumCommentNode | null => {
  for (const n of nodes) {
    if (n.id === id) return n;
    const nested = findInTree(n.replies || [], id);
    if (nested) return nested;
  }
  return null;
};

const ForumThreadDetail: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { openSignIn } = useAuthModal();
  const [comment, setComment] = useState('');
  const [data, setData] = useState<Thread | null>(null);
  const [related, setRelated] = useState<{ id: string; title: string; date: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ForumCommentNode | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyError, setReplyError] = useState<string | null>(null);
  const [postingReply, setPostingReply] = useState(false);
  const [liking, setLiking] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  };

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

  const ensureAuth = () => {
    if (!getAuthToken() && !isAuthenticated) {
      openSignIn({ returnTo: `/forum/thread/${threadId}` });
      return false;
    }
    return true;
  };

  const bumpReplyCount = (prev: Thread) => {
    const next = (prev.replyCount || prev.commentCount || countAllComments(prev.comments)) + 1;
    return {
      ...prev,
      replyCount: next,
      commentCount: next,
      replies: String(next),
    };
  };

  const handlePostComment = async () => {
    if (!comment.trim() || !threadId) return;
    if (!ensureAuth()) return;
    const safety = findContentSafetyIssue(comment);
    if (safety) {
      setCommentError(safety);
      return;
    }
    setPosting(true);
    setCommentError(null);
    try {
      const created = await postForumComment(threadId, comment.trim(), null);
      setComment('');
      setData((prev) =>
        prev
          ? {
              ...bumpReplyCount(prev),
              comments: [...prev.comments, { ...created, replies: [] }],
            }
          : prev
      );
      showToast('Comment posted');
    } catch (e: any) {
      setCommentError(e.message || 'Failed to post comment');
    } finally {
      setPosting(false);
    }
  };

  const handlePostReply = async () => {
    if (!replyText.trim() || !threadId || !replyingTo) return;
    if (!ensureAuth()) return;
    const safety = findContentSafetyIssue(replyText);
    if (safety) {
      setReplyError(safety);
      return;
    }
    setPostingReply(true);
    setReplyError(null);
    try {
      const created = await postForumComment(threadId, replyText.trim(), replyingTo.id);
      setData((prev) =>
        prev
          ? {
              ...bumpReplyCount(prev),
              comments: insertReplyInTree(prev.comments, replyingTo.id, {
                ...created,
                replies: [],
              }),
            }
          : prev
      );
      setReplyText('');
      setReplyingTo(null);
      showToast('Reply posted');
    } catch (e: any) {
      setReplyError(e.message || 'Failed to reply');
    } finally {
      setPostingReply(false);
    }
  };

  const handleLikeThread = async () => {
    if (!data || !threadId) return;
    if (!ensureAuth()) return;
    if (liking) return;
    setLiking('thread');
    const prevLiked = !!data.likedByMe;
    const prevLikes = data.post.likes;
    setData({
      ...data,
      likedByMe: !prevLiked,
      post: { ...data.post, likes: Math.max(0, prevLikes + (prevLiked ? -1 : 1)) },
    });
    try {
      const res = await toggleForumLike('thread', threadId);
      setData((d) =>
        d ? { ...d, likedByMe: res.liked, post: { ...d.post, likes: res.likes } } : d
      );
    } catch (e: any) {
      setData((d) =>
        d
          ? { ...d, likedByMe: prevLiked, post: { ...d.post, likes: prevLikes } }
          : d
      );
      showToast(e.message || 'Could not like');
    } finally {
      setLiking(null);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!data) return;
    if (!ensureAuth()) return;
    if (liking) return;
    setLiking(commentId);
    const target = findInTree(data.comments, commentId);
    if (!target) {
      setLiking(null);
      return;
    }
    const prevLiked = !!target.likedByMe;
    const prevLikes = target.likes;
    setData({
      ...data,
      comments: mapCommentTree(data.comments, commentId, (c) => ({
        ...c,
        likedByMe: !prevLiked,
        likes: Math.max(0, prevLikes + (prevLiked ? -1 : 1)),
      })),
    });
    try {
      const res = await toggleForumLike('comment', commentId);
      setData((d) =>
        d
          ? {
              ...d,
              comments: mapCommentTree(d.comments, commentId, (c) => ({
                ...c,
                likedByMe: res.liked,
                likes: res.likes,
              })),
            }
          : d
      );
    } catch (e: any) {
      setData((d) =>
        d
          ? {
              ...d,
              comments: mapCommentTree(d.comments, commentId, (c) => ({
                ...c,
                likedByMe: prevLiked,
                likes: prevLikes,
              })),
            }
          : d
      );
      showToast(e.message || 'Could not like');
    } finally {
      setLiking(null);
    }
  };

  const renderComment = (c: ForumCommentNode, depth = 0): React.ReactNode => (
    <div key={c.id}>
      <CommentItem $depth={depth}>
        <Avatar $size={depth ? 32 : 36} style={{ background: c.avatarColor }}>
          {c.avatar}
        </Avatar>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <AuthorName style={{ fontSize: 13 }}>{c.author}</AuthorName>
            {c.replyToAuthor ? <ReplyToTag>↳ {c.replyToAuthor}</ReplyToTag> : null}
          </div>
          <CommentText>{c.content}</CommentText>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <CommentDate>{c.date}</CommentDate>
            <ActionBtn
              type="button"
              $active={!!c.likedByMe}
              disabled={liking === c.id}
              onClick={() => handleLikeComment(c.id)}
              style={{ padding: '4px 8px' }}
            >
              <FiHeart size={14} fill={c.likedByMe ? 'currentColor' : 'none'} />
              {c.likes || 0}
            </ActionBtn>
            {depth < 3 && (
              <ReplyBtn
                type="button"
                onClick={() => {
                  if (!ensureAuth()) return;
                  setReplyingTo(c);
                  setReplyText('');
                  setReplyError(null);
                }}
              >
                Reply
              </ReplyBtn>
            )}
          </div>

          {replyingTo?.id === c.id && (
            <InlineReplyBox>
              <CommentInput
                placeholder={`Reply to ${c.author}…`}
                value={replyText}
                maxLength={4000}
                onChange={(e) => {
                  setReplyText(e.target.value);
                  setReplyError(null);
                }}
                style={{ minHeight: 56 }}
              />
              {replyError && (
                <ErrorText>
                  <FiAlertCircle /> {replyError}
                </ErrorText>
              )}
              <FormRow style={{ marginTop: 8 }}>
                <Hint>Replying to {c.author}</Hint>
                <div style={{ display: 'flex', gap: 8 }}>
                  <ReplyBtn type="button" onClick={() => setReplyingTo(null)}>
                    Cancel
                  </ReplyBtn>
                  <PostCommentButton
                    type="button"
                    onClick={handlePostReply}
                    disabled={postingReply}
                    style={{ padding: '8px 14px' }}
                  >
                    <FiSend size={14} />
                    {postingReply ? 'Posting…' : 'Reply'}
                  </PostCommentButton>
                </div>
              </FormRow>
            </InlineReplyBox>
          )}
        </div>
      </CommentItem>
      {(c.replies || []).length > 0 && (
        <NestedReplies>{(c.replies || []).map((r) => renderComment(r, depth + 1))}</NestedReplies>
      )}
    </div>
  );

  if (loading) {
    return (
      <PageWrapper>
        <ContentWrapper>
          <MainContent>
            <ForumThreadSkeleton />
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
            <BackBtn type="button" onClick={() => navigate('/forum')}>
              <FiArrowLeft /> Back to community
            </BackBtn>
            <div style={{ padding: '2rem', textAlign: 'center', color: '#b91c1c' }}>
              {error || 'Not found'}
            </div>
          </MainContent>
        </ContentWrapper>
      </PageWrapper>
    );
  }

  const threadData = data;
  const totalComments = threadData.commentCount ?? countAllComments(threadData.comments);

  return (
    <PageWrapper>
      <ContentWrapper>
        <MainContent>
          <BackBtn type="button" onClick={() => navigate('/forum')}>
            <FiArrowLeft /> Back to community
          </BackBtn>
          <ThreadTitle>{threadData.title}</ThreadTitle>
          <ThreadMeta>
            <MetaItem>Created {threadData.created}</MetaItem>
            <MetaItem>
              <FiMessageCircle size={14} /> {threadData.replyCount ?? totalComments} replies
            </MetaItem>
            <MetaItem>
              <FiEye size={14} /> {threadData.views ?? 0} views
            </MetaItem>
          </ThreadMeta>

          <PostCard>
            <PostHeader>
              <Avatar>{threadData.post.avatar}</Avatar>
              <div>
                <AuthorName>{threadData.post.author}</AuthorName>
                <PostDate>{threadData.post.date}</PostDate>
              </div>
            </PostHeader>
            <PostText>{threadData.post.content}</PostText>
            {threadData.post.image ? (
              <PostImage src={threadData.post.image} alt="Thread attachment" />
            ) : null}
            <ActionBar>
              <ActionBtn
                type="button"
                $active={!!threadData.likedByMe}
                disabled={liking === 'thread'}
                onClick={handleLikeThread}
              >
                <FiHeart fill={threadData.likedByMe ? 'currentColor' : 'none'} />
                {threadData.post.likes}
              </ActionBtn>
              <ActionBtn
                type="button"
                onClick={() => openWhatsAppShare(threadData.title, threadData.id)}
              >
                <FaWhatsapp color="#25D366" /> WhatsApp
              </ActionBtn>
              <ActionBtn
                type="button"
                onClick={async () => {
                  const ok = await copyShareLink(threadData.id);
                  showToast(ok ? 'Link copied' : 'Could not copy');
                }}
              >
                <FiCopy /> Copy link
              </ActionBtn>
            </ActionBar>
          </PostCard>

          <CommentsSection>
            <CommentsHeader>
              <FiMessageCircle /> {totalComments} Comment{totalComments !== 1 ? 's' : ''}
            </CommentsHeader>

            <CommentForm>
              <CommentInput
                placeholder="Leave a thoughtful comment…"
                value={comment}
                maxLength={4000}
                onChange={(e) => {
                  setComment(e.target.value);
                  setCommentError(null);
                }}
              />
              {commentError && (
                <ErrorText>
                  <FiAlertCircle /> {commentError}
                </ErrorText>
              )}
              <FormRow>
                <Hint>Be respectful — keep discussion focused on trading.</Hint>
                <PostCommentButton type="button" onClick={handlePostComment} disabled={posting}>
                  <FiSend size={14} />
                  {posting ? 'Posting…' : 'Post comment'}
                </PostCommentButton>
              </FormRow>
            </CommentForm>

            <CommentList>
              {threadData.comments.length === 0 ? (
                <Hint style={{ padding: '0.5rem 0' }}>No comments yet — start the thread.</Hint>
              ) : (
                threadData.comments.map((c) => renderComment(c, 0))
              )}
            </CommentList>
          </CommentsSection>
        </MainContent>

        <Sidebar>
          <SidebarSection>
            <SidebarTitle>Related threads</SidebarTitle>
            <ThreadList>
              {related.length === 0 ? (
                <ThreadItemTitle style={{ opacity: 0.7, padding: '0.5rem' }}>
                  No related threads yet
                </ThreadItemTitle>
              ) : (
                related.map((thread) => (
                  <ThreadItem
                    key={thread.id}
                    onClick={() => navigate(`/forum/thread/${thread.id}`)}
                  >
                    <ThreadItemTitle>{thread.title}</ThreadItemTitle>
                    <ThreadItemDate>{thread.date}</ThreadItemDate>
                  </ThreadItem>
                ))
              )}
            </ThreadList>
          </SidebarSection>

          <SafetyCard>
            <SafetyTitle>Share responsibly</SafetyTitle>
            <SafetyText>
              Prefer sharing the post link on WhatsApp rather than personal contact details inside
              the thread.
            </SafetyText>
          </SafetyCard>
        </Sidebar>
      </ContentWrapper>
      {toast && <Toast>{toast}</Toast>}
    </PageWrapper>
  );
};

export default ForumThreadDetail;
