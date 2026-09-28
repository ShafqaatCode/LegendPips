import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { FiMessageSquare, FiRefreshCw, FiSearch, FiSend, FiCheckCircle, FiSlash } from "react-icons/fi";
import {
  connectChatSocket,
  fetchAdminChatConversation,
  fetchAdminChatConversations,
  markAdminChatReadHttp,
  sendAdminChatMessageHttp,
  setAdminChatStatus,
  socketMarkChatRead,
  socketSendChat,
  type ChatConversation,
  type ChatMessage,
} from "../../../services/chatService";
import {
  PageWrap, PageHeader, PageTitleGroup, PageTitle, PageSubtitle,
  GhostButton, PrimaryButton, ErrorBanner, adminColors, Pill,
} from "../../../components/AdminPanel/adminUi";

const Shell = styled.div`
  display: grid;
  grid-template-columns: minmax(260px, 320px) minmax(0, 1fr);
  gap: 0;
  min-height: min(70vh, 720px);
  background: #fff;
  border: 1px solid ${adminColors.border};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${adminColors.shadow};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

const ListPane = styled.div`
  border-right: 1px solid ${adminColors.border};
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  min-height: 420px;
`;

const ListHead = styled.div`
  padding: 0.85rem;
  border-bottom: 1px solid ${adminColors.border};
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  background: #fff;
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.65rem;
  border: 1px solid ${adminColors.border};
  border-radius: 10px;
  background: #f8fafc;
  color: ${adminColors.muted};
  input {
    border: none;
    background: transparent;
    outline: none;
    width: 100%;
    font-size: 0.8125rem;
    font-family: inherit;
  }
`;

const Filters = styled.div`
  display: flex;
  gap: 0.35rem;
  button {
    border: 1px solid ${adminColors.border};
    background: #fff;
    border-radius: 999px;
    padding: 0.25rem 0.65rem;
    font-size: 0.7rem;
    font-weight: 700;
    cursor: pointer;
    color: ${adminColors.muted};
    &.on {
      background: ${adminColors.navy};
      border-color: ${adminColors.navy};
      color: #fff;
    }
  }
`;

const ConvList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ConvItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  text-align: left;
  border: none;
  border-bottom: 1px solid ${adminColors.border};
  background: ${({ $active }) => ($active ? "#fff7ed" : "#fff")};
  padding: 0.8rem 0.85rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  &:hover { background: ${({ $active }) => ($active ? "#fff7ed" : "#f8fafc")}; }

  .row {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    align-items: center;
  }
  .name {
    font-size: 0.8125rem;
    font-weight: 800;
    color: ${adminColors.navy};
  }
  .time {
    font-size: 0.65rem;
    color: ${adminColors.muted};
    white-space: nowrap;
  }
  .preview {
    font-size: 0.75rem;
    color: #64748b;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Unread = styled.span`
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: #dc2626;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const ChatPane = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 420px;
  background: #fff;
`;

const ChatHead = styled.div`
  padding: 0.85rem 1rem;
  border-bottom: 1px solid ${adminColors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  .name { font-weight: 800; color: ${adminColors.navy}; font-size: 0.95rem; }
  .email { font-size: 0.75rem; color: ${adminColors.muted}; }
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background:
    radial-gradient(circle at top left, rgba(19, 46, 88, 0.05), transparent 45%),
    #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  min-height: 280px;
  max-height: 520px;
`;

const Bubble = styled.div<{ $mine?: boolean }>`
  max-width: 75%;
  align-self: ${({ $mine }) => ($mine ? "flex-end" : "flex-start")};
  background: ${({ $mine }) => ($mine ? adminColors.navy : "#fff")};
  color: ${({ $mine }) => ($mine ? "#fff" : "#0f172a")};
  border: 1px solid ${({ $mine }) => ($mine ? "transparent" : adminColors.border)};
  padding: 0.55rem 0.75rem;
  border-radius: ${({ $mine }) => ($mine ? "14px 14px 4px 14px" : "14px 14px 14px 4px")};
  font-size: 0.8125rem;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
  .meta { margin-top: 0.25rem; font-size: 0.62rem; opacity: 0.72; }
`;

const Empty = styled.div`
  margin: auto;
  text-align: center;
  color: ${adminColors.muted};
  font-size: 0.875rem;
  padding: 2rem 1rem;
`;

const Composer = styled.form`
  display: flex;
  gap: 0.5rem;
  padding: 0.85rem;
  border-top: 1px solid ${adminColors.border};
  background: #fff;
`;

const Input = styled.input`
  flex: 1;
  border: 1px solid ${adminColors.border};
  border-radius: 12px;
  padding: 0.65rem 0.85rem;
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  &:focus { border-color: ${adminColors.gold}; box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.18); }
`;

const AdminLiveChat: React.FC = () => {
  const [items, setItems] = useState<ChatConversation[]>([]);
  const [status, setStatus] = useState<"open" | "closed" | "">("open");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selected, setSelected] = useState<ChatConversation | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [unreadTotal, setUnreadTotal] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const selectedConv = useMemo(
    () => items.find((i) => i.id === selectedId) || selected,
    [items, selectedId, selected]
  );

  const refreshList = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminChatConversations({
        status: status || undefined,
        search: search.trim() || undefined,
        page: 1,
        limit: 40,
      });
      setItems(data.items);
      setUnreadTotal(data.unreadTotal || 0);
    } catch (e: any) {
      setError(e.message || "Failed to load chats");
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  const openConversation = useCallback(async (id: string) => {
    setSelectedId(id);
    setError("");
    try {
      const data = await fetchAdminChatConversation(id);
      setSelected(data.conversation);
      setMessages(data.messages || []);
      socketMarkChatRead(id);
      try {
        const read = await markAdminChatReadHttp(id);
        setSelected(read.conversation);
        setItems((prev) => prev.map((c) => (c.id === id ? { ...c, ...read.conversation } : c)));
      } catch {
        // ignore
      }
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
    } catch (e: any) {
      setError(e.message || "Failed to open chat");
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(refreshList, 200);
    return () => clearTimeout(t);
  }, [refreshList]);

  useEffect(() => {
    const socket = connectChatSocket();
    if (!socket) return;

    const onMessage = (msg: ChatMessage) => {
      setMessages((prev) => {
        if (!selectedId || msg.conversationId !== selectedId) return prev;
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      if (selectedId && msg.conversationId === selectedId && msg.senderRole === "user") {
        socketMarkChatRead(selectedId);
      }
    };
    const onConversation = (conv: ChatConversation) => {
      setItems((prev) => {
        const rest = prev.filter((c) => c.id !== conv.id);
        return [conv, ...rest];
      });
      setSelected((prev) => (prev?.id === conv.id ? { ...prev, ...conv } : prev));
      setUnreadTotal((n) => Math.max(0, n)); // refreshed on list; soft update
    };

    socket.on("chat:message", onMessage);
    socket.on("chat:conversation", onConversation);
    return () => {
      socket.off("chat:message", onMessage);
      socket.off("chat:conversation", onConversation);
    };
  }, [selectedId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !text.trim() || sending) return;
    const body = text.trim();
    setSending(true);
    setText("");
    try {
      const viaSocket = await socketSendChat({ body, conversationId: selectedId });
      if (viaSocket.success && viaSocket.message) {
        setMessages((prev) => (prev.some((m) => m.id === viaSocket.message!.id) ? prev : [...prev, viaSocket.message!]));
        if (viaSocket.conversation) {
          setSelected(viaSocket.conversation);
          setItems((prev) => {
            const rest = prev.filter((c) => c.id !== viaSocket.conversation!.id);
            return [viaSocket.conversation!, ...rest];
          });
        }
      } else {
        const http = await sendAdminChatMessageHttp(selectedId, body);
        setMessages((prev) => [...prev, http.message]);
        setSelected(http.conversation);
      }
    } catch (err: any) {
      setText(body);
      setError(err.message || "Failed to send");
    } finally {
      setSending(false);
    }
  };

  const toggleStatus = async () => {
    if (!selectedId || !selectedConv) return;
    const next = selectedConv.status === "open" ? "closed" : "open";
    try {
      const res = await setAdminChatStatus(selectedId, next);
      setSelected(res.conversation);
      setItems((prev) => prev.map((c) => (c.id === selectedId ? { ...c, ...res.conversation } : c)));
    } catch (e: any) {
      setError(e.message || "Failed to update status");
    }
  };

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle><FiMessageSquare /> Live chat</PageTitle>
          <PageSubtitle>
            Real-time member support. Grant staff the <strong>Live chat</strong> permission to receive and reply.
          </PageSubtitle>
        </PageTitleGroup>
        <GhostButton type="button" onClick={refreshList} disabled={loading}>
          <FiRefreshCw /> Refresh
        </GhostButton>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <div style={{ marginBottom: "0.75rem", fontSize: "0.8125rem", color: adminColors.muted }}>
        Unread for team: <strong style={{ color: adminColors.navy }}>{unreadTotal}</strong>
      </div>

      <Shell>
        <ListPane>
          <ListHead>
            <Search>
              <FiSearch size={14} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email…"
              />
            </Search>
            <Filters>
              <button type="button" className={status === "open" ? "on" : ""} onClick={() => setStatus("open")}>Open</button>
              <button type="button" className={status === "closed" ? "on" : ""} onClick={() => setStatus("closed")}>Closed</button>
              <button type="button" className={status === "" ? "on" : ""} onClick={() => setStatus("")}>All</button>
            </Filters>
          </ListHead>
          <ConvList>
            {loading && items.length === 0 && <Empty>Loading conversations…</Empty>}
            {!loading && items.length === 0 && <Empty>No chats yet.</Empty>}
            {items.map((c) => {
              const name = c.user
                ? `${c.user.firstName} ${c.user.lastName}`.trim() || c.user.email
                : c.userId;
              return (
                <ConvItem
                  key={c.id}
                  type="button"
                  $active={c.id === selectedId}
                  onClick={() => openConversation(c.id)}
                >
                  <div className="row">
                    <span className="name">{name}</span>
                    <span className="time">
                      {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <div className="row">
                    <span className="preview">{c.lastMessagePreview || "—"}</span>
                    {c.unreadByAdmin > 0 && <Unread>{c.unreadByAdmin > 9 ? "9+" : c.unreadByAdmin}</Unread>}
                  </div>
                </ConvItem>
              );
            })}
          </ConvList>
        </ListPane>

        <ChatPane>
          {!selectedId || !selectedConv ? (
            <Empty>Select a conversation to reply.</Empty>
          ) : (
            <>
              <ChatHead>
                <div>
                  <div className="name">
                    {selectedConv.user
                      ? `${selectedConv.user.firstName} ${selectedConv.user.lastName}`.trim()
                      : "Member"}
                  </div>
                  <div className="email">{selectedConv.user?.email || selectedConv.userId}</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Pill $variant={selectedConv.status === "open" ? "approved" : "incomplete"}>
                    {selectedConv.status}
                  </Pill>
                  <GhostButton $sm type="button" onClick={toggleStatus}>
                    {selectedConv.status === "open" ? <><FiSlash /> Close</> : <><FiCheckCircle /> Reopen</>}
                  </GhostButton>
                </div>
              </ChatHead>
              <Messages>
                {messages.map((m) => (
                  <Bubble key={m.id} $mine={m.senderRole === "admin"}>
                    {m.body}
                    <div className="meta">
                      {m.senderRole === "admin" ? "You" : "Member"} ·{" "}
                      {new Date(m.createdAt).toLocaleString()}
                    </div>
                  </Bubble>
                ))}
                <div ref={bottomRef} />
              </Messages>
              <Composer onSubmit={handleSend}>
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={selectedConv.status === "closed" ? "Reopen to reply…" : "Reply to member…"}
                  disabled={sending || selectedConv.status === "closed"}
                  maxLength={4000}
                />
                <PrimaryButton type="submit" disabled={sending || !text.trim() || selectedConv.status === "closed"}>
                  <FiSend /> Send
                </PrimaryButton>
              </Composer>
            </>
          )}
        </ChatPane>
      </Shell>
    </PageWrap>
  );
};

export default AdminLiveChat;
