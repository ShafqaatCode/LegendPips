import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

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

export interface ForumThreadDetailResponse {
  success: boolean;
  thread: {
    id: string;
    title: string;
    created: string;
    participants: string;
    replies: string;
    post: {
      author: string;
      avatar: string;
      date: string;
      content: string;
      image: string;
      likes: number;
      dislikes: number;
    };
    comments: {
      id: string;
      author: string;
      avatar: string;
      date: string;
      content: string;
      avatarColor: string;
      likes: number;
      dislikes: number;
    }[];
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
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const fetchForumFeed = async (search?: string): Promise<ForumFeedSection[]> => {
  const qs = new URLSearchParams();
  if (search?.trim()) qs.set("search", search.trim());
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/forum/feed?${qs.toString()}`);
  return data.sections || [];
};

export const fetchForumThread = async (id: string): Promise<ForumThreadDetailResponse> => {
  return fetchJson(`${API_CONFIG.BASE_URL}/forum/threads/${id}`);
};

export const postForumComment = async (threadId: string, body: string): Promise<void> => {
  await fetchJson(`${API_CONFIG.BASE_URL}/forum/threads/${threadId}/comments`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ body }),
  });
};

export const fetchMyForumPosts = async (): Promise<MyForumPostItem[]> => {
  const data = await fetchJson(`${API_CONFIG.BASE_URL}/forum/threads/me`, {
    headers: getAuthHeaders(),
  });
  return data.items || [];
};
