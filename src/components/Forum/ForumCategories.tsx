import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  FiHeart,
  FiMessageCircle,
  FiSearch,
  FiSend,
  FiCopy,
  FiAlertCircle,
  FiEye,
  FiImage,
  FiX,
  FiShare2,
} from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaTelegramPlane } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthModal } from '../../contexts/AuthModalContext';
import {
  fetchCommunityPosts,
  createForumPost,
  toggleForumLike,
  postForumComment,
  type CommunityPost,
  type CommunityPostCommentPreview,
} from '../../services/forumService';
import {
  findContentSafetyIssue,
  openWhatsAppShare,
  openFacebookShare,
  openXShare,
  openTelegramShare,
  nativeSharePost,
  copyShareLink,
} from '../../utils/contentSafety';
import { ForumBrowseSkeleton } from '../SharedComponents/Shimmer';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const SectionWrapper = styled.section`
  position: relative;
  z-index: 1;
  isolation: isolate;
  background: #fafbfc;
  padding: 40px ${({ theme }) => theme.typography.pageGutter} 56px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 28px 1.25rem 36px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 820px;
  margin: 0 auto;
`;

const SectionHead = styled.div`
  text-align: center;
  margin-bottom: 1.75rem;
`;

const Eyebrow = styled.p`
  display: none;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 700;
  color: #fbbf24;
  margin: 0 0 0.5rem;
`;

const SectionSub = styled.p`
  margin: 0 auto;
  max-width: 520px;
  font-size: 15px;
  line-height: 1.55;
  color: #64748b;
`;

const SearchBar = styled.div`
  max-width: 560px;
  margin: 0 auto 1.75rem;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 18px 14px 46px;
  font-size: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #132e58;
    box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const SearchIconWrap = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #132e58;
  display: flex;
  opacity: 0.7;
`;

const Composer = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.25rem 1.35rem 1.1rem;
  margin-bottom: 1.75rem;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  position: relative;
`;

const ComposerLabel = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #132e58;
  margin-bottom: 0.75rem;
`;

const TitleInput = styled.input`
  width: 100%;
  border: none;
  font-size: 17px;
  font-weight: 700;
  color: #132e58;
  padding: 0.35rem 0;
  margin-bottom: 0.5rem;
  background: transparent;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #94a3b8;
    font-weight: 600;
  }
`;

const BodyInput = styled.textarea`
  width: 100%;
  border: none;
  resize: vertical;
  min-height: 88px;
  font-size: 14px;
  line-height: 1.6;
  color: #334155;
  padding: 0.25rem 0;
  background: transparent;
  font-family: inherit;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const ComposerFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
  flex-wrap: wrap;
`;

const ComposerActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const AttachBtn = styled.button`
  background: #f1f5f9;
  color: #132e58;
  border: none;
  padding: 9px 12px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #e2e8f0;
  }
`;

const PreviewWrap = styled.div`
  position: relative;
  margin-top: 0.75rem;
  width: fit-content;
  max-width: 100%;
`;

const PreviewImg = styled.img`
  display: block;
  max-width: min(320px, 100%);
  max-height: 180px;
  width: auto;
  height: auto;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`;

const RemovePreview = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: rgba(19, 46, 88, 0.85);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const ErrorText = styled.p`
  margin: 0.5rem 0 0;
  font-size: 13px;
  color: #b91c1c;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const PublishBtn = styled.button`
  background: #fbbf24;
  color: #132e58;
  border: none;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s, transform 0.2s;

  &:hover:not(:disabled) {
    background: #f4b400;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const GuestBanner = styled.div`
  background: #132e58;
  color: #fff;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const GuestText = styled.div`
  flex: 1;
  min-width: 200px;

  strong {
    display: block;
    font-size: 16px;
    margin-bottom: 0.25rem;
  }

  span {
    font-size: 13px;
    opacity: 0.85;
  }
`;

const GuestBtn = styled.button`
  background: #fbbf24;
  color: #132e58;
  border: none;
  padding: 10px 18px;
  font-weight: 700;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f4b400;
  }
`;

const Feed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PostCard = styled.article`
  background: #fff;
  border-radius: 12px;
  padding: 1.25rem 1.35rem;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  }
`;

const PostTop = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(145deg, #132e58, #1e4976);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(19, 46, 88, 0.25);
`;

const AuthorBlock = styled.div`
  flex: 1;
  min-width: 0;
`;

const AuthorName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #132e58;
`;

const MetaRow = styled.div`
  font-size: 12px;
  color: #94a3b8;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
`;

const Pill = styled.span`
  background: rgba(251, 191, 36, 0.18);
  color: #92400e;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
`;

const PostTitle = styled.h3`
  margin: 0 0 0.45rem;
  font-size: 18px;
  font-weight: 800;
  color: #132e58;
  letter-spacing: -0.01em;
  line-height: 1.35;
`;

const PostBody = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: #475569;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PostMedia = styled.div`
  margin-top: 0.85rem;
  border-radius: 12px;
  overflow: hidden;
  background: #0f172a08;
  border: 1px solid #eef2f7;
`;

const PostImg = styled.img`
  display: block;
  width: 100%;
  height: auto;
  max-height: min(72vh, 720px);
  object-fit: contain;
  background: #f8fafc;
`;

const PreviewComments = styled.div`
  margin-top: 0.85rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;

const PreviewComment = styled.div`
  display: flex;
  gap: 0.55rem;
  align-items: flex-start;
`;

const PreviewAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(145deg, #132e58, #1e4976);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const PreviewBubble = styled.div`
  flex: 1;
  min-width: 0;
  background: #f8fafc;
  border-radius: 12px;
  padding: 0.45rem 0.7rem;
`;

const PreviewAuthor = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #132e58;
  margin-right: 0.35rem;
`;

const PreviewText = styled.span`
  font-size: 13px;
  color: #475569;
  line-height: 1.45;
  word-break: break-word;
`;

const ViewAllComments = styled.button`
  background: none;
  border: none;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  padding: 0;
  cursor: pointer;
  text-align: left;
  margin-top: 0.15rem;

  &:hover {
    color: #132e58;
  }
`;

const PreviewActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
  padding-left: 0.15rem;
`;

const MiniReplyBtn = styled.button`
  background: none;
  border: none;
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #132e58;
  }
`;

const QuickCommentRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.65rem;
`;

const QuickCommentInput = styled.input`
  flex: 1;
  min-width: 0;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 999px;
  padding: 0.55rem 0.9rem;
  font-size: 13px;
  color: #132e58;

  &:focus {
    outline: none;
    border-color: #fbbf24;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.2);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const QuickSendBtn = styled.button`
  border: none;
  background: #132e58;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;

  &:disabled {
    opacity: 0.55;
    cursor: wait;
  }

  &:hover:not(:disabled) {
    background: #0b1b38;
  }
`;

const InlineReplyRow = styled.div`
  display: flex;
  gap: 0.45rem;
  align-items: center;
  margin-top: 0.45rem;
  margin-left: 2.1rem;
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 1rem;
  padding-top: 0.85rem;
  border-top: 1px solid #f1f5f9;
  flex-wrap: wrap;
`;

const ActionBtn = styled.button<{ $active?: boolean }>`
  background: ${({ $active }) => ($active ? 'rgba(251, 191, 36, 0.18)' : 'transparent')};
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
    background: ${({ $active }) => ($active ? 'rgba(251, 191, 36, 0.28)' : '#f8fafc')};
    color: #132e58;
  }

  svg {
    font-size: 16px;
  }
`;

const ShareWrap = styled.div`
  margin-left: auto;
  position: relative;
`;

const SharePanel = styled.div`
  position: absolute;
  right: 0;
  bottom: calc(100% + 8px);
  min-width: 200px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.16);
  padding: 0.4rem;
  z-index: 20;
`;

const ShareOption = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  border: none;
  background: transparent;
  padding: 0.55rem 0.7rem;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #132e58;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: #f8fafc;
  }
`;

const Empty = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #64748b;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  border: 1px dashed rgba(19, 46, 88, 0.15);
`;

const LoadMoreWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.25rem;
`;

const LoadMoreBtn = styled.button`
  background: #fff;
  color: #132e58;
  border: 1px solid rgba(19, 46, 88, 0.15);
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(19, 46, 88, 0.06);

  &:hover:not(:disabled) {
    border-color: #fbbf24;
    background: #fffbeb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;

const PageMeta = styled.p`
  text-align: center;
  margin: 0.85rem 0 0;
  font-size: 12px;
  color: #94a3b8;
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
  animation: ${fadeUp} 0.25s ease both;
`;

const PAGE_SIZE = 10;

const ForumCategories: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { openSignIn } = useAuthModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [likingId, setLikingId] = useState<string | null>(null);
  const [shareOpenId, setShareOpenId] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [replyTarget, setReplyTarget] = useState<{
    postId: string;
    commentId: string;
    author: string;
  } | null>(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [submittingKey, setSubmittingKey] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  };

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchQuery), 280);
    return () => window.clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const loadPosts = useCallback(
    async (pageNum: number, append: boolean) => {
      if (append) setLoadingMore(true);
      else {
        setLoading(true);
        setLoadError(null);
      }
      try {
        const res = await fetchCommunityPosts({
          search: debouncedSearch,
          page: pageNum,
          limit: PAGE_SIZE,
        });
        setPosts((prev) => (append ? [...prev, ...res.posts] : res.posts));
        setPage(res.page);
        setHasMore(res.hasMore);
        setTotal(res.total);
      } catch (e: any) {
        if (!append) {
          setLoadError(e.message || 'Failed to load community posts');
          setPosts([]);
        } else {
          showToast(e.message || 'Could not load more');
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [debouncedSearch]
  );

  useEffect(() => {
    loadPosts(1, false);
  }, [loadPosts]);

  const requireAuth = (from = '/forum') => {
    openSignIn({ returnTo: from });
  };

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onPickImage = (file: File | null) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setFormError('Use a JPEG, PNG, or WebP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image must be under 5MB.');
      return;
    }
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFormError(null);
  };

  const handlePublish = async () => {
    if (!isAuthenticated) {
      requireAuth('/forum#composer');
      return;
    }
    const safety = findContentSafetyIssue(`${title}\n${body}`);
    if (safety) {
      setFormError(safety);
      return;
    }
    if (title.trim().length < 4) {
      setFormError('Title must be at least 4 characters.');
      return;
    }
    if (!imageFile && body.trim().length < 8) {
      setFormError('Add a short description or an image.');
      return;
    }
    setPublishing(true);
    setFormError(null);
    try {
      const post = await createForumPost({
        title: title.trim(),
        content: body.trim(),
        image: imageFile,
      });
      setTitle('');
      setBody('');
      clearImage();
      showToast('Post published');
      navigate(`/forum/thread/${post.id}`);
    } catch (e: any) {
      setFormError(e.message || 'Could not publish');
    } finally {
      setPublishing(false);
    }
  };

  const handleLike = async (e: React.MouseEvent, post: CommunityPost) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      requireAuth(`/forum/thread/${post.id}`);
      return;
    }
    if (likingId) return;
    setLikingId(post.id);
    const prev = post;
    setPosts((list) =>
      list.map((p) =>
        p.id === post.id
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              likes: Math.max(0, p.likes + (p.likedByMe ? -1 : 1)),
            }
          : p
      )
    );
    try {
      const res = await toggleForumLike('thread', post.id);
      setPosts((list) =>
        list.map((p) => (p.id === post.id ? { ...p, likedByMe: res.liked, likes: res.likes } : p))
      );
    } catch (err: any) {
      setPosts((list) => list.map((p) => (p.id === post.id ? prev : p)));
      showToast(err.message || 'Could not like');
    } finally {
      setLikingId(null);
    }
  };

  useEffect(() => {
    if (!shareOpenId) return;
    const onDoc = () => setShareOpenId(null);
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [shareOpenId]);

  const handleShareClick = async (e: React.MouseEvent, post: CommunityPost) => {
    e.stopPropagation();
    const usedNative = await nativeSharePost(post.title, post.id);
    if (usedNative) return;
    setShareOpenId((id) => (id === post.id ? null : post.id));
  };

  const handleCopy = async (e: React.MouseEvent, post: CommunityPost) => {
    e.stopPropagation();
    const ok = await copyShareLink(post.id);
    setShareOpenId(null);
    showToast(ok ? 'Link copied' : 'Could not copy link');
  };

  const appendPreviewComment = (postId: string, preview: CommunityPostCommentPreview) => {
    setPosts((list) =>
      list.map((p) => {
        if (p.id !== postId) return p;
        const existing = p.previewComments || [];
        const nextPreview =
          existing.length < 2 ? [...existing, preview] : existing;
        return {
          ...p,
          replyCount: (p.replyCount || 0) + 1,
          previewComments: nextPreview,
        };
      })
    );
  };

  const submitFeedComment = async (post: CommunityPost) => {
    const text = (commentDrafts[post.id] || '').trim();
    if (!text) return;
    if (!isAuthenticated) {
      requireAuth(`/forum/thread/${post.id}`);
      return;
    }
    const safety = findContentSafetyIssue(text);
    if (safety) {
      showToast(safety);
      return;
    }
    const key = `c:${post.id}`;
    if (submittingKey) return;
    setSubmittingKey(key);
    try {
      const created = await postForumComment(post.id, text, null);
      appendPreviewComment(post.id, {
        id: created.id,
        author: created.author,
        avatar: created.avatar,
        content: created.content,
        time: created.date || 'Just now',
      });
      setCommentDrafts((d) => ({ ...d, [post.id]: '' }));
      showToast('Comment posted');
    } catch (e: any) {
      showToast(e.message || 'Could not comment');
    } finally {
      setSubmittingKey(null);
    }
  };

  const submitFeedReply = async (post: CommunityPost) => {
    if (!replyTarget || replyTarget.postId !== post.id) return;
    const text = replyDraft.trim();
    if (!text) return;
    if (!isAuthenticated) {
      requireAuth(`/forum/thread/${post.id}`);
      return;
    }
    const safety = findContentSafetyIssue(text);
    if (safety) {
      showToast(safety);
      return;
    }
    const key = `r:${replyTarget.commentId}`;
    if (submittingKey) return;
    setSubmittingKey(key);
    try {
      await postForumComment(post.id, text, replyTarget.commentId);
      setPosts((list) =>
        list.map((p) =>
          p.id === post.id ? { ...p, replyCount: (p.replyCount || 0) + 1 } : p
        )
      );
      setReplyDraft('');
      setReplyTarget(null);
      showToast('Reply posted — open the post for the full thread');
    } catch (e: any) {
      showToast(e.message || 'Could not reply');
    } finally {
      setSubmittingKey(null);
    }
  };

  return (
    <SectionWrapper id="community-feed">
      <ContentWrapper>
        <SectionHead>
          <SectionTitle>Trader Community Forums</SectionTitle>
          <SectionSub>
            Post chart takes, ask questions, and discuss markets with other traders.
          </SectionSub>
        </SectionHead>

        <SearchBar>
          <SearchIconWrap>
            <FiSearch size={18} />
          </SearchIconWrap>
          <SearchInput
            type="search"
            placeholder="Search posts, topics, tickers…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search community posts"
          />
        </SearchBar>

        {isAuthenticated ? (
          <Composer id="composer">
            <ComposerLabel>Create a post</ComposerLabel>
            <TitleInput
              placeholder="What's on your mind about the markets?"
              value={title}
              maxLength={160}
              onChange={(e) => {
                setTitle(e.target.value);
                setFormError(null);
              }}
            />
            <BodyInput
              placeholder="Share your analysis, question, or setup…"
              value={body}
              maxLength={8000}
              onChange={(e) => {
                setBody(e.target.value);
                setFormError(null);
              }}
            />
            {imagePreview && (
              <PreviewWrap>
                <PreviewImg src={imagePreview} alt="Selected preview" />
                <RemovePreview type="button" onClick={clearImage} aria-label="Remove image">
                  <FiX size={14} />
                </RemovePreview>
              </PreviewWrap>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={(e) => onPickImage(e.target.files?.[0] || null)}
            />
            {formError && (
              <ErrorText>
                <FiAlertCircle /> {formError}
              </ErrorText>
            )}
            <ComposerFooter>
              <ComposerActions>
                <AttachBtn type="button" onClick={() => fileInputRef.current?.click()}>
                  <FiImage /> {imageFile ? 'Change image' : 'Add image'}
                </AttachBtn>
              </ComposerActions>
              <PublishBtn type="button" onClick={handlePublish} disabled={publishing}>
                <FiSend />
                {publishing ? 'Publishing…' : 'Publish'}
              </PublishBtn>
            </ComposerFooter>
          </Composer>
        ) : (
          <GuestBanner>
            <GuestText>
              <strong>Join the conversation</strong>
              <span>Sign in to post, like, comment, and share with traders worldwide.</span>
            </GuestText>
            <GuestBtn type="button" onClick={() => requireAuth('/forum')}>
              Sign in to post
            </GuestBtn>
          </GuestBanner>
        )}

        {loading ? (
          <ForumBrowseSkeleton />
        ) : loadError ? (
          <Empty style={{ color: '#b91c1c' }}>{loadError}</Empty>
        ) : posts.length === 0 ? (
          <Empty>
            {debouncedSearch.trim()
              ? 'No posts match your search.'
              : 'No posts yet — be the first to start a discussion.'}
          </Empty>
        ) : (
          <Feed>
            {posts.map((post) => (
              <PostCard key={post.id} onClick={() => navigate(`/forum/thread/${post.id}`)}>
                <PostTop>
                  <Avatar>{(post.authorAvatar || post.author || 'LP').slice(0, 2).toUpperCase()}</Avatar>
                  <AuthorBlock>
                    <AuthorName>{post.author}</AuthorName>
                    <MetaRow>
                      <span>{post.time}</span>
                      <Pill>{post.sectionTitle}</Pill>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <FiEye size={12} /> {post.views}
                      </span>
                    </MetaRow>
                  </AuthorBlock>
                </PostTop>
                <PostTitle>{post.title}</PostTitle>
                {(post.contentPreview || post.content) ? (
                  <PostBody>{post.contentPreview || post.content}</PostBody>
                ) : null}
                {post.imageUrl ? (
                  <PostMedia>
                    <PostImg src={post.imageUrl} alt="" loading="lazy" />
                  </PostMedia>
                ) : null}
                <PreviewComments onClick={(e) => e.stopPropagation()}>
                    {(post.previewComments || []).map((c) => (
                      <div key={c.id}>
                        <PreviewComment>
                          <PreviewAvatar>
                            {(c.avatar || c.author || 'LP').slice(0, 2).toUpperCase()}
                          </PreviewAvatar>
                          <PreviewBubble>
                            <PreviewAuthor>{c.author}</PreviewAuthor>
                            <PreviewText>{c.content}</PreviewText>
                          </PreviewBubble>
                        </PreviewComment>
                        <PreviewActions>
                          <MiniReplyBtn
                            type="button"
                            onClick={() => {
                              if (!isAuthenticated) {
                                requireAuth(`/forum/thread/${post.id}`);
                                return;
                              }
                              setReplyTarget({
                                postId: post.id,
                                commentId: c.id,
                                author: c.author,
                              });
                              setReplyDraft('');
                            }}
                          >
                            Reply
                          </MiniReplyBtn>
                          <MiniReplyBtn
                            type="button"
                            onClick={() => navigate(`/forum/thread/${post.id}`)}
                          >
                            View thread
                          </MiniReplyBtn>
                        </PreviewActions>
                        {replyTarget?.commentId === c.id && (
                          <InlineReplyRow>
                            <QuickCommentInput
                              placeholder={`Reply to ${c.author}…`}
                              value={replyDraft}
                              onChange={(e) => setReplyDraft(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  submitFeedReply(post);
                                }
                              }}
                            />
                            <QuickSendBtn
                              type="button"
                              disabled={submittingKey === `r:${c.id}`}
                              onClick={() => submitFeedReply(post)}
                              aria-label="Send reply"
                            >
                              <FiSend size={14} />
                            </QuickSendBtn>
                          </InlineReplyRow>
                        )}
                      </div>
                    ))}
                    {post.replyCount > (post.previewComments?.length || 0) && (
                      <ViewAllComments
                        type="button"
                        onClick={() => navigate(`/forum/thread/${post.id}`)}
                      >
                        View all {post.replyCount} comments
                      </ViewAllComments>
                    )}
                    <QuickCommentRow>
                      <QuickCommentInput
                        placeholder="Write a comment…"
                        value={commentDrafts[post.id] || ''}
                        onChange={(e) =>
                          setCommentDrafts((d) => ({ ...d, [post.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            submitFeedComment(post);
                          }
                        }}
                        onFocus={() => {
                          if (!isAuthenticated) requireAuth(`/forum/thread/${post.id}`);
                        }}
                      />
                      <QuickSendBtn
                        type="button"
                        disabled={submittingKey === `c:${post.id}`}
                        onClick={() => submitFeedComment(post)}
                        aria-label="Post comment"
                      >
                        <FiSend size={14} />
                      </QuickSendBtn>
                    </QuickCommentRow>
                  </PreviewComments>
                <ActionBar onClick={(e) => e.stopPropagation()}>
                  <ActionBtn
                    type="button"
                    $active={post.likedByMe}
                    onClick={(e) => handleLike(e, post)}
                    aria-label="Like post"
                  >
                    <FiHeart fill={post.likedByMe ? 'currentColor' : 'none'} />
                    {post.likes}
                  </ActionBtn>
                  <ActionBtn
                    type="button"
                    onClick={() => navigate(`/forum/thread/${post.id}`)}
                    aria-label="Comments"
                  >
                    <FiMessageCircle />
                    {post.replyCount}
                  </ActionBtn>
                  <ShareWrap>
                    <ActionBtn
                      type="button"
                      onClick={(e) => handleShareClick(e, post)}
                      aria-label="Share"
                      aria-expanded={shareOpenId === post.id}
                    >
                      <FiShare2 />
                      Share
                    </ActionBtn>
                    {shareOpenId === post.id && (
                      <SharePanel onClick={(e) => e.stopPropagation()}>
                        <ShareOption
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openWhatsAppShare(post.title, post.id);
                            setShareOpenId(null);
                          }}
                        >
                          <FaWhatsapp color="#25D366" /> WhatsApp
                        </ShareOption>
                        <ShareOption
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openFacebookShare(post.id);
                            setShareOpenId(null);
                          }}
                        >
                          <FaFacebookF color="#1877F2" /> Facebook
                        </ShareOption>
                        <ShareOption
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openXShare(post.title, post.id);
                            setShareOpenId(null);
                          }}
                        >
                          <FaXTwitter /> X
                        </ShareOption>
                        <ShareOption
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openTelegramShare(post.title, post.id);
                            setShareOpenId(null);
                          }}
                        >
                          <FaTelegramPlane color="#229ED9" /> Telegram
                        </ShareOption>
                        <ShareOption type="button" onClick={(e) => handleCopy(e, post)}>
                          <FiCopy /> Copy link
                        </ShareOption>
                      </SharePanel>
                    )}
                  </ShareWrap>
                </ActionBar>
              </PostCard>
            ))}
          </Feed>
        )}
        {!loading && !loadError && posts.length > 0 && (
          <>
            <PageMeta>
              Showing {posts.length} of {total} posts
            </PageMeta>
            {hasMore && (
              <LoadMoreWrap>
                <LoadMoreBtn
                  type="button"
                  disabled={loadingMore}
                  onClick={() => loadPosts(page + 1, true)}
                >
                  {loadingMore ? 'Loading…' : 'Load more'}
                </LoadMoreBtn>
              </LoadMoreWrap>
            )}
          </>
        )}
      </ContentWrapper>
      {toast && <Toast>{toast}</Toast>}
    </SectionWrapper>
  );
};

export default ForumCategories;
