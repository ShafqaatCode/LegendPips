import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { FiBell } from "react-icons/fi";
import {
  fetchMyNotifications,
  fetchUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationRow,
} from "../../services/notificationService";
import { useLocale } from "../../contexts/LocaleContext";

type BellVariant = "navbar" | "panel";

const Wrap = styled.div`
  position: relative;
  display: inline-flex;
`;

const BellBtn = styled.button<{ $variant: BellVariant }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-family: inherit;
  line-height: 1;
  transition: all 0.22s ease;

  ${({ $variant }) =>
    $variant === "navbar"
      ? css`
          width: 2rem;
          height: 2rem;
          padding: 0;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: rgba(255, 255, 255, 0.92);
          font-size: 1.05rem;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);

          &:hover {
            background: rgba(255, 255, 255, 0.14);
            border-color: rgba(251, 191, 36, 0.55);
            color: #fbbf24;
            transform: translateY(-1px);
          }

          &[aria-expanded="true"] {
            background: rgba(251, 191, 36, 0.18);
            border-color: rgba(251, 191, 36, 0.65);
            color: #fbbf24;
            box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.12);
          }
        `
      : css`
          width: 2.15rem;
          height: 2.15rem;
          padding: 0;
          border-radius: 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #132e58;
          font-size: 1.05rem;

          &:hover {
            background: #fffbeb;
            border-color: rgba(251, 191, 36, 0.45);
            color: #132e58;
          }

          &[aria-expanded="true"] {
            background: #fffbeb;
            border-color: #fbbf24;
            box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.15);
          }
        `}
`;

const Badge = styled.span<{ $variant: BellVariant }>`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 999px;
  font-size: 0.625rem;
  font-weight: 800;
  line-height: 17px;
  text-align: center;
  pointer-events: none;

  ${({ $variant }) =>
    $variant === "navbar"
      ? css`
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: #132e58;
          box-shadow: 0 0 0 2px #132e58, 0 2px 6px rgba(0, 0, 0, 0.2);
        `
      : css`
          background: #dc2626;
          color: #fff;
          box-shadow: 0 0 0 2px #fff;
        `}
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: min(380px, calc(100vw - 24px));
  background: #fff;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 14px;
  box-shadow:
    0 4px 6px rgba(15, 23, 42, 0.04),
    0 20px 48px rgba(15, 23, 42, 0.14);
  z-index: 2100;
  overflow: hidden;
  animation: drop-in 0.2s ease;

  @keyframes drop-in {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #132e58 0%, #fbbf24 50%, #132e58 100%);
  }
`;

const DropHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(180deg, #f8fafc 0%, #fff 100%);

  span {
    font-size: 0.8125rem;
    font-weight: 800;
    color: #132e58;
    letter-spacing: -0.02em;
  }
`;

const MarkAll = styled.button`
  border: none;
  background: none;
  color: #64748b;
  font-size: 0.6875rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0.2rem 0.35rem;
  border-radius: 4px;
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: #132e58;
    background: rgba(251, 191, 36, 0.12);
  }
`;

const List = styled.div`
  max-height: 320px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 4px;
  }
`;

const Item = styled.button<{ $unread?: boolean }>`
  display: block;
  width: 100%;
  text-align: left;
  border: none;
  border-bottom: 1px solid #f8fafc;
  background: ${({ $unread }) =>
    $unread ? "linear-gradient(90deg, #fffbeb 0%, #fff 100%)" : "#fff"};
  padding: 0.8rem 1rem;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ItemTitle = styled.div`
  font-size: 0.8125rem;
  font-weight: 700;
  color: #132e58;
  line-height: 1.35;
`;

const ItemBody = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 3px;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ItemTime = styled.div`
  font-size: 0.6875rem;
  color: #94a3b8;
  margin-top: 5px;
  font-weight: 600;
`;

const Empty = styled.div`
  padding: 1.5rem 1rem;
  font-size: 0.8125rem;
  color: #94a3b8;
  text-align: center;
  line-height: 1.5;
`;

const Footer = styled(Link)`
  display: block;
  padding: 0.8rem 1rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #132e58;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  text-decoration: none;
  border-top: 1px solid #e8ecf1;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: #fffbeb;
    color: #0f172a;
  }
`;

interface NotificationBellProps {
  variant?: BellVariant;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ variant = "panel" }) => {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const refreshCount = useCallback(async () => {
    try {
      const count = await fetchUnreadNotificationCount();
      setUnread(count);
    } catch {
      /* ignore */
    }
  }, []);

  const loadRecent = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMyNotifications(1, 8);
      setItems(data.items);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCount();
    const id = setInterval(() => void refreshCount(), 60_000);
    return () => clearInterval(id);
  }, [refreshCount]);

  useEffect(() => {
    if (!open) return;
    void loadRecent();
  }, [open, loadRecent]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const onItemClick = async (n: NotificationRow) => {
    if (!n.read) {
      try {
        await markNotificationRead(n.id);
        setUnread((c) => Math.max(0, c - 1));
        setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
      } catch {
        /* ignore */
      }
    }
    setOpen(false);
    if (n.link) window.location.href = n.link;
  };

  const onMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      setUnread(0);
      setItems((prev) => prev.map((x) => ({ ...x, read: true })));
    } catch {
      /* ignore */
    }
  };

  return (
    <Wrap ref={ref}>
      <BellBtn
        type="button"
        $variant={variant}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("panel.notifications")}
        onClick={() => setOpen((v) => !v)}
      >
        <FiBell strokeWidth={2} />
        {unread > 0 && (
          <Badge $variant={variant}>{unread > 99 ? "99+" : unread}</Badge>
        )}
      </BellBtn>
      {open && (
        <Dropdown role="menu">
          <DropHead>
            <span>{t("panel.notifications")}</span>
            {unread > 0 && (
              <MarkAll type="button" onClick={() => void onMarkAll()}>
                Mark all read
              </MarkAll>
            )}
          </DropHead>
          <List>
            {loading && <Empty>Loading…</Empty>}
            {!loading && items.length === 0 && (
              <Empty>No notifications yet. Signal and account updates will show here.</Empty>
            )}
            {!loading &&
              items.map((n) => (
                <Item key={n.id} type="button" $unread={!n.read} onClick={() => void onItemClick(n)}>
                  <ItemTitle>{n.title}</ItemTitle>
                  {n.body && <ItemBody>{n.body}</ItemBody>}
                  <ItemTime>{n.time}</ItemTime>
                </Item>
              ))}
          </List>
          <Footer to="/user-panel/alerts" onClick={() => setOpen(false)}>
            View all alerts →
          </Footer>
        </Dropdown>
      )}
    </Wrap>
  );
};

export default NotificationBell;
