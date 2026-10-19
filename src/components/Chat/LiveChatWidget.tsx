import React, { useCallback, useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { FiMessageCircle, FiX, FiSend, FiMinimize2, FiLifeBuoy, FiChevronUp, FiHeadphones } from "react-icons/fi";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import {
  connectChatSocket,
  disconnectChatSocket,
  fetchMyChat,
  markMyChatReadHttp,
  sendMyChatMessageHttp,
  socketMarkChatRead,
  socketSendChat,
  type ChatConversation,
  type ChatMessage,
} from "../../services/chatService";
import { OPEN_LIVE_CHAT_EVENT } from "../../utils/liveChatEvents";
import { WHATSAPP_SUPPORT_NUMBER_DISPLAY, WHATSAPP_SUPPORT_URL } from "../../utils/whatsappSupport";
import { TELEGRAM_SUPPORT_URL } from "../../utils/supportChannels";
import { useAuthModal } from "../../contexts/AuthModalContext";

const pop = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const rise = keyframes`
  from { opacity: 0; transform: translateY(10px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const FabStack = styled.div`
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 1200;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.55rem;

  @media (max-width: 640px) {
    right: 1rem;
    bottom: 1rem;
  }
`;

const MenuActions = styled.div<{ $open: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.55rem;
  max-height: ${({ $open }) => ($open ? "280px" : "0")};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  overflow: hidden;
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition: max-height 0.25s ease, opacity 0.2s ease;
`;

const Fab = styled.button<{ $variant?: "main" | "chat" | "tickets" | "whatsapp" }>`
  position: relative;
  width: ${({ $variant }) => ($variant === "main" ? "58px" : "48px")};
  height: ${({ $variant }) => ($variant === "main" ? "58px" : "48px")};
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $variant }) => ($variant === "chat" ? "#0f172a" : "#fff")};
  background: ${({ $variant }) => {
    if ($variant === "whatsapp") return "linear-gradient(135deg, #25d366, #128c7e)";
    if ($variant === "tickets") return "linear-gradient(135deg, #132e58, #1e3a5f)";
    if ($variant === "chat") return "linear-gradient(135deg, #fbbf24, #f59e0b)";
    return "linear-gradient(135deg, #132e58 0%, #1e3a6e 55%, #243f78 100%)";
  }};
  box-shadow: ${({ $variant }) => {
    if ($variant === "whatsapp") return "0 10px 24px rgba(37, 211, 102, 0.4)";
    if ($variant === "tickets") return "0 10px 24px rgba(19, 46, 88, 0.35)";
    if ($variant === "chat") return "0 12px 28px rgba(245, 158, 11, 0.45)";
    return "0 14px 32px rgba(19, 46, 88, 0.45)";
  }};
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  animation: ${rise} 0.22s ease;

  &:hover {
    transform: translateY(-2px) scale(1.04);
  }

  svg {
    font-size: ${({ $variant }) => ($variant === "main" ? "1.4rem" : "1.2rem")};
  }
`;

const FabLink = styled.a<{ $tone?: "whatsapp" | "telegram" }>`
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-decoration: none;
  background: ${({ $tone }) =>
    $tone === "telegram"
      ? "linear-gradient(135deg, #2aabee, #229ed9)"
      : "linear-gradient(135deg, #25d366, #128c7e)"};
  box-shadow: ${({ $tone }) =>
    $tone === "telegram"
      ? "0 10px 24px rgba(42, 171, 238, 0.4)"
      : "0 10px 24px rgba(37, 211, 102, 0.4)"};
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  animation: ${rise} 0.22s ease;

  &:hover {
    transform: translateY(-2px) scale(1.04);
  }

  svg { font-size: 1.25rem; }
`;

const FabLabel = styled.span`
  position: absolute;
  right: calc(100% + 0.55rem);
  white-space: nowrap;
  background: #0f172a;
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.35rem 0.55rem;
  border-radius: 8px;
  opacity: 0;
  pointer-events: none;
  transform: translateX(4px);
  transition: opacity 0.15s ease, transform 0.15s ease;

  ${Fab}:hover &,
  ${FabLink}:hover & {
    opacity: 1;
    transform: translateX(0);
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const ExpandHint = styled.span<{ $open?: boolean }>`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fbbf24;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;

  svg {
    font-size: 0.7rem !important;
    transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
    transition: transform 0.2s ease;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: #dc2626;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
`;

const Panel = styled.div`
  position: fixed;
  right: 1.25rem;
  bottom: 5.75rem;
  z-index: 1200;
  width: min(380px, calc(100vw - 1.5rem));
  height: min(520px, calc(100vh - 7rem));
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);
  overflow: hidden;
  animation: ${pop} 0.22s ease;

  @media (max-width: 640px) {
    right: 0.75rem;
    left: 0.75rem;
    width: auto;
    bottom: 5.25rem;
  }
`;

const Head = styled.div`
  padding: 0.9rem 1rem;
  background: linear-gradient(135deg, #132e58 0%, #1e3a6e 55%, #243f78 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;

  .title {
    font-size: 0.95rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  .sub {
    font-size: 0.7rem;
    opacity: 0.8;
    margin-top: 0.1rem;
  }
`;

const HeadActions = styled.div`
  display: flex;
  gap: 0.35rem;
`;

const IconBtn = styled.button`
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover { background: rgba(255, 255, 255, 0.22); }
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.9rem;
  background:
    radial-gradient(circle at top right, rgba(251, 191, 36, 0.08), transparent 40%),
    #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;

const Bubble = styled.div<{ $mine?: boolean }>`
  max-width: 82%;
  align-self: ${({ $mine }) => ($mine ? "flex-end" : "flex-start")};
  background: ${({ $mine }) => ($mine ? "#132e58" : "#fff")};
  color: ${({ $mine }) => ($mine ? "#fff" : "#0f172a")};
  border: 1px solid ${({ $mine }) => ($mine ? "transparent" : "#e2e8f0")};
  padding: 0.55rem 0.75rem;
  border-radius: ${({ $mine }) => ($mine ? "14px 14px 4px 14px" : "14px 14px 14px 4px")};
  font-size: 0.8125rem;
  line-height: 1.45;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
  white-space: pre-wrap;
  word-break: break-word;

  .meta {
    margin-top: 0.3rem;
    font-size: 0.62rem;
    opacity: 0.7;
  }
`;

const Empty = styled.div`
  margin: auto;
  text-align: center;
  color: #64748b;
  font-size: 0.8125rem;
  padding: 1rem;
  max-width: 240px;
  line-height: 1.45;
`;

const Composer = styled.form`
  display: flex;
  gap: 0.45rem;
  padding: 0.75rem;
  border-top: 1px solid #e2e8f0;
  background: #fff;
`;

const Input = styled.input`
  flex: 1;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 0.55rem 0.9rem;
  font-size: 0.8125rem;
  font-family: inherit;
  outline: none;
  &:focus { border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15); }
`;

const SendBtn = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #132e58;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &:hover:not(:disabled) { background: #1a3d6e; }
`;

const LiveChatWidget: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { openSignIn } = useAuthModal();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const hideOnAdmin = pathname.startsWith("/admin-panel");
  const isMember = isAuthenticated && !!user && user.role !== "admin";
  /** FAB always visible on public/user pages so visitors know live chat exists. */
  const visible = !hideOnAdmin;

  useEffect(() => {
    const onOpen = () => {
      if (hideOnAdmin) return;
      if (!isMember) {
        openSignIn({ returnTo: pathname || "/live-chat", redirectAfterLogin: true });
        return;
      }
      setMenuOpen(false);
      setOpen(true);
    };
    window.addEventListener(OPEN_LIVE_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_LIVE_CHAT_EVENT, onOpen);
  }, [hideOnAdmin, isMember, openSignIn, pathname]);

  const scrollBottom = () => {
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
  };

  const upsertMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMyChat();
      setConversation(data.conversation);
      setMessages(data.messages || []);
      if (data.conversation?.id && (data.conversation.unreadByUser || 0) > 0) {
        socketMarkChatRead(data.conversation.id);
        try {
          await markMyChatReadHttp(data.conversation.id);
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
      scrollBottom();
    }
  }, []);

  useEffect(() => {
    if (!isMember || hideOnAdmin) {
      disconnectChatSocket();
      return;
    }
    const socket = connectChatSocket();
    if (!socket) return;

    const onMessage = (msg: ChatMessage) => {
      setMessages((prev) => {
        if (prev.length && prev[0].conversationId !== msg.conversationId) return prev;
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      scrollBottom();
      if (open && msg.senderRole === "admin" && msg.conversationId) {
        socketMarkChatRead(msg.conversationId);
      }
    };
    const onConversation = (conv: ChatConversation) => {
      setConversation(conv);
    };

    socket.on("chat:message", onMessage);
    socket.on("chat:conversation", onConversation);
    return () => {
      socket.off("chat:message", onMessage);
      socket.off("chat:conversation", onConversation);
    };
  }, [isMember, hideOnAdmin, open]);

  useEffect(() => {
    if (open && isMember) load();
  }, [open, isMember, load]);

  useEffect(() => {
    scrollBottom();
  }, [messages.length, open]);

  if (!visible) return null;

  const unread = conversation?.unreadByUser || 0;

  const handleFabClick = () => {
    if (!isMember) {
      openSignIn({ returnTo: pathname || "/live-chat", redirectAfterLogin: true });
      return;
    }
    setMenuOpen(false);
    setOpen((v) => !v);
  };

  const toggleMenu = () => {
    if (open) setOpen(false);
    setMenuOpen((v) => !v);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body || sending || !isMember) return;
    setSending(true);
    setText("");
    try {
      const viaSocket = await socketSendChat({ body });
      if (viaSocket.success && viaSocket.message) {
        upsertMessage(viaSocket.message);
        if (viaSocket.conversation) setConversation(viaSocket.conversation);
      } else {
        const http = await sendMyChatMessageHttp(body);
        upsertMessage(http.message);
        setConversation(http.conversation);
      }
      scrollBottom();
    } catch {
      setText(body);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {open && isMember && (
        <Panel>
          <Head>
            <div>
              <div className="title">Live support</div>
              <div className="sub">We typically reply within minutes</div>
            </div>
            <HeadActions>
              <IconBtn type="button" aria-label="Minimize" onClick={() => setOpen(false)}>
                <FiMinimize2 size={14} />
              </IconBtn>
              <IconBtn type="button" aria-label="Close" onClick={() => setOpen(false)}>
                <FiX size={14} />
              </IconBtn>
            </HeadActions>
          </Head>
          <Messages>
            {loading && messages.length === 0 && <Empty>Connecting…</Empty>}
            {!loading && messages.length === 0 && (
              <Empty>Say hello — ask about rebates, brokers, KYC, or account help.</Empty>
            )}
            {messages.map((m) => (
              <Bubble key={m.id} $mine={m.senderRole === "user"}>
                {m.body}
                <div className="meta">
                  {m.senderRole === "admin" ? "Support" : "You"} ·{" "}
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </Bubble>
            ))}
            <div ref={bottomRef} />
          </Messages>
          <Composer onSubmit={handleSend}>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message…"
              maxLength={4000}
              disabled={sending}
            />
            <SendBtn type="submit" disabled={sending || !text.trim()} aria-label="Send">
              <FiSend size={16} />
            </SendBtn>
          </Composer>
        </Panel>
      )}
      <FabStack>
        <MenuActions $open={menuOpen}>
          <FabLink
            $tone="whatsapp"
            href={WHATSAPP_SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp ${WHATSAPP_SUPPORT_NUMBER_DISPLAY}`}
            title={`WhatsApp ${WHATSAPP_SUPPORT_NUMBER_DISPLAY}`}
            onClick={() => setMenuOpen(false)}
          >
            <FabLabel>WhatsApp</FabLabel>
            <FaWhatsapp />
          </FabLink>
          <FabLink
            $tone="telegram"
            href={TELEGRAM_SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            title="Telegram"
            onClick={() => setMenuOpen(false)}
          >
            <FabLabel>Telegram</FabLabel>
            <FaTelegramPlane />
          </FabLink>
          <Fab
            type="button"
            $variant="tickets"
            onClick={() => {
              setMenuOpen(false);
              navigate(isAuthenticated ? "/user-panel/tickets" : "/support/tickets");
            }}
            aria-label="Support tickets"
            title="Support tickets"
          >
            <FabLabel>Support tickets</FabLabel>
            <FiLifeBuoy />
          </Fab>
          <Fab
            type="button"
            $variant="chat"
            onClick={handleFabClick}
            aria-label="Open live chat"
            title="Live Chat"
          >
            <FabLabel>Live chat</FabLabel>
            {open && isMember ? <FiX /> : <FiMessageCircle />}
            {isMember && !open && unread > 0 && <Badge>{unread > 9 ? "9+" : unread}</Badge>}
          </Fab>
        </MenuActions>

        <Fab
          type="button"
          $variant="main"
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close support menu" : "Open support menu"}
          aria-expanded={menuOpen}
          title="Support"
        >
          <FabLabel>{menuOpen ? "Close" : "Support"}</FabLabel>
          {menuOpen ? <FiX /> : <FiHeadphones />}
          {!menuOpen && isMember && unread > 0 && <Badge>{unread > 9 ? "9+" : unread}</Badge>}
          <ExpandHint $open={menuOpen} aria-hidden>
            <FiChevronUp />
          </ExpandHint>
        </Fab>
      </FabStack>
    </>
  );
};

export default LiveChatWidget;
