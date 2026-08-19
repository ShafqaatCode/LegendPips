import { API_CONFIG, getAuthHeaders, getAuthHeadersMultipart } from "../utils/apiConfig";

export interface ForumFeedSection {
  _id: string;
  title: string;
  topics: {
    id: string;
    title: string;
    description: string;
    participants: string;
    replies: string;
    lastPoster: { name: string; time: string; avatar: string };
  }[];
}

export interface CommunityPostCommentPreview {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  contentPreview: string;
  imageUrl?: string;
  author: string;
  authorAvatar: string;
  likes: number;
  likedByMe: boolean;
  replyCount: number;
  views: number;
  sectionId: string;
  sectionTitle: string;
  createdAt?: string;
  time: string;
  previewComments?: CommunityPostCommentPreview[];
}

export interface CommunityPostsPage {
  posts: CommunityPost[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ForumCommentNode {
  id: string;
  parentId?: string | null;
  replyToAuthor?: string;
  author: string;
  avatar: string;
  date: string;
  content: string;
  avatarColor: string;
  likes: number;
  dislikes: number;
  likedByMe?: boolean;
  replies?: ForumCommentNode[];
}

export interface ForumThreadDetailResponse {
  success: boolean;
  thread: {
    id: string;
    title: string;
    created: string;
    participants: string;
    replies: string;
    replyCount?: number;
    commentCount?: number;
    views?: number;
    likedByMe?: boolean;
    post: {
      author: string;
      avatar: string;
      date: string;
      content: string;
      image: string;
      likes: number;
      dislikes: number;
    };
    comments: ForumCommentNode[];
  };
  related: { id: string; title: string; date: string }[];
}

export interface MyForumPostItem {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  likes: number;
  replies: number;
  views: number;
}

const fetchJson = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any).message || "Request failed");
  return data;
};

export const fetchForumFeed = async (search?: string): Promise<ForumFeedSection[]> => {
  const qs = new URLSearchParams();
  if (search?.trim()) qs.set("search", search.trim());
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/forum/feed?${qs.toString()}`);
  return data.sections || [];
};

export const fetchCommunityPosts = async (opts?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<CommunityPostsPage> => {
  const qs = new URLSearchParams();
  if (opts?.search?.trim()) qs.set("search", opts.search.trim());
  qs.set("page", String(opts?.page || 1));
  qs.set("limit", String(opts?.limit || 10));
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/forum/posts?${qs.toString()}`, {
    headers: getAuthHeaders(),
  });
  return {
    posts: (data.posts || []).map((p: CommunityPost) => ({
      ...p,
      likedByMe: !!p.likedByMe,
      imageUrl: p.imageUrl || "",
      previewComments: p.previewComments || [],
    })),
    page: data.page || 1,
    limit: data.limit || 10,
    total: data.total || 0,
    totalPages: data.totalPages || 1,
    hasMore: !!data.hasMore,
  };
};

export const createForumPost = async (payload: {
  title: string;
  content: string;
  sectionId?: string;
  image?: File | null;
}): Promise<{ id: string; title: string; content: string; imageUrl?: string }> => {
  const fd = new FormData();
  fd.append("title", payload.title);
  fd.append("content", payload.content);
  if (payload.sectionId) fd.append("sectionId", payload.sectionId);
  if (payload.image) fd.append("image", payload.image);

  const res = await fetch(`${API_CONFIG.BASE_URL}/forum/posts`, {
    method: "POST",
    headers: getAuthHeadersMultipart(),
    body: fd,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any).message || "Request failed");
  return data.post;
};

export const toggleForumLike = async (
  targetType: "thread" | "comment",
  targetId: string
): Promise<{ liked: boolean; likes: number }> => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/forum/like`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ targetType, targetId }),
  });
  return { liked: !!data.liked, likes: data.likes ?? 0 };
};

export const fetchForumThread = async (id: string): Promise<ForumThreadDetailResponse> => {
  return fetchJson(`${API_CONFIG.BASE_URL}/forum/threads/${id}`, {
    headers: getAuthHeaders(),
  });
};

export const postForumComment = async (
  threadId: string,
  body: string,
  parentId?: string | null
): Promise<ForumCommentNode> => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/forum/threads/${threadId}/comments`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ body, parentId: parentId || null }),
  });
  return data.comment;
};

export const fetchMyForumPosts = async (): Promise<MyForumPostItem[]> => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/forum/threads/me`, {
    headers: getAuthHeaders(),
  });
  return data.items || [];
};
