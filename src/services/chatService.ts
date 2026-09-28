import { io, Socket } from "socket.io-client";
import { API_CONFIG, getAuthToken } from "../utils/apiConfig";

export type ChatSenderRole = "user" | "admin";

export interface ChatUserBrief {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
}

export interface ChatConversation {
  id: string;
  userId: string;
  status: "open" | "closed";
  lastMessageAt: string | null;
  lastMessagePreview: string;
  unreadByAdmin: number;
  unreadByUser: number;
  assignedAdminId?: string | null;
  user?: ChatUserBrief;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: ChatSenderRole;
  body: string;
  createdAt: string;
}

export interface ChatPagination {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const fetchJson = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken() || ""}`,
      ...(options?.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data as T;
};

export const getSocketBaseUrl = () =>
  API_CONFIG.BASE_URL.replace(/\/api\/?$/, "") || window.location.origin;

export const fetchMyChat = () =>
  fetchJson<{ success: boolean; conversation: ChatConversation; messages: ChatMessage[] }>(
    `${API_CONFIG.BASE_URL}/chat/me`
  );

export const sendMyChatMessageHttp = (body: string) =>
  fetchJson<{ success: boolean; message: ChatMessage; conversation: ChatConversation }>(
    `${API_CONFIG.BASE_URL}/chat/me/messages`,
    { method: "POST", body: JSON.stringify({ body }) }
  );

export const markMyChatReadHttp = (conversationId: string) =>
  fetchJson<{ success: boolean; conversation: ChatConversation }>(
    `${API_CONFIG.BASE_URL}/chat/me/conversations/${conversationId}/read`,
    { method: "POST", body: "{}" }
  );

export const fetchAdminChatConversations = (opts?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const qs = new URLSearchParams();
  if (opts?.status) qs.set("status", opts.status);
  if (opts?.search) qs.set("search", opts.search);
  if (opts?.page) qs.set("page", String(opts.page));
  if (opts?.limit) qs.set("limit", String(opts.limit));
  const q = qs.toString();
  return fetchJson<{
    success: boolean;
    items: ChatConversation[];
    pagination: ChatPagination;
    unreadTotal: number;
  }>(`${API_CONFIG.BASE_URL}/chat/admin/conversations${q ? `?${q}` : ""}`);
};

export const fetchAdminChatConversation = (id: string) =>
  fetchJson<{ success: boolean; conversation: ChatConversation; messages: ChatMessage[] }>(
    `${API_CONFIG.BASE_URL}/chat/admin/conversations/${id}`
  );

export const sendAdminChatMessageHttp = (conversationId: string, body: string) =>
  fetchJson<{ success: boolean; message: ChatMessage; conversation: ChatConversation }>(
    `${API_CONFIG.BASE_URL}/chat/admin/conversations/${conversationId}/messages`,
    { method: "POST", body: JSON.stringify({ body }) }
  );

export const markAdminChatReadHttp = (conversationId: string) =>
  fetchJson<{ success: boolean; conversation: ChatConversation }>(
    `${API_CONFIG.BASE_URL}/chat/admin/conversations/${conversationId}/read`,
    { method: "POST", body: "{}" }
  );

export const setAdminChatStatus = (conversationId: string, status: "open" | "closed") =>
  fetchJson<{ success: boolean; conversation: ChatConversation }>(
    `${API_CONFIG.BASE_URL}/chat/admin/conversations/${conversationId}/status`,
    { method: "PATCH", body: JSON.stringify({ status }) }
  );

let sharedSocket: Socket | null = null;

export function getChatSocket(): Socket | null {
  return sharedSocket;
}

export function connectChatSocket(): Socket | null {
  const token = getAuthToken();
  if (!token) return null;
  if (sharedSocket?.connected) return sharedSocket;
  if (sharedSocket) {
    sharedSocket.auth = { token };
    sharedSocket.connect();
    return sharedSocket;
  }
  // Prefer polling first so chat works behind reverse proxies that don't
  // upgrade WebSockets yet; Socket.IO will upgrade to websocket when available.
  sharedSocket = io(getSocketBaseUrl(), {
    path: "/socket.io",
    auth: { token },
    transports: ["polling", "websocket"],
    upgrade: true,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 12,
    timeout: 8000,
  });
  return sharedSocket;
}

export function disconnectChatSocket() {
  if (sharedSocket) {
    sharedSocket.disconnect();
    sharedSocket = null;
  }
}

export function socketSendChat(payload: {
  body: string;
  conversationId?: string;
}): Promise<{ success: boolean; message?: ChatMessage; conversation?: ChatConversation; messageText?: string }> {
  return new Promise((resolve) => {
    const socket = connectChatSocket();
    if (!socket) {
      resolve({ success: false, messageText: "Not connected" });
      return;
    }
    // Don't block the UI for ~12s when WS is blocked by nginx — fall back to HTTP ASAP.
    if (!socket.connected) {
      resolve({ success: false, messageText: "Socket not ready" });
      return;
    }
    socket.timeout(4000).emit("chat:send", payload, (err: Error | null, res: any) => {
      if (err) {
        resolve({ success: false, messageText: err.message || "Timeout" });
        return;
      }
      resolve(res || { success: false });
    });
  });
}

export function socketMarkChatRead(conversationId: string) {
  const socket = connectChatSocket();
  socket?.emit("chat:read", { conversationId });
}
