import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiAlertCircle, FiBell, FiStar, FiX } from "react-icons/fi";
import {
  dismissHighlight,
  fetchActivePanelHighlights,
  getHighlightTheme,
  isHighlightDismissed,
  type PanelHighlight,
} from "../../services/panelHighlightService";

const Stack = styled.div<{ $placement: "top" | "bottom" }>`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  ${({ $placement }) =>
    $placement === "top"
      ? `
    padding: 0.75rem 1.65rem 0;
    @media (max-width: 768px) {
      padding: 0.65rem 0.9rem 0;
    }
  `
      : `
    position: sticky;
    bottom: 0.35rem;
    z-index: 40;
    margin-top: 1.25rem;
  `}
`;

const Banner = styled.div<{ $bg: string; $text: string }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 0.7rem 0.85rem;
  border-radius: 14px;
  background: ${({ $bg }) => $bg};
  color: ${({ $text }) => $text};
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06);
  animation: hlIn 0.35s ease both;

  @keyframes hlIn {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Avatar = styled.div<{ $accent: string }>`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: ${({ $accent }) => $accent};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.18);
`;

const Message = styled.div`
  flex: 1;
  min-width: 180px;
  font-size: 0.8125rem;
  line-height: 1.45;

  .eyebrow {
    font-weight: 800;
    margin-right: 0.25rem;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  flex-shrink: 0;
  margin-left: auto;
`;

const Cta = styled(Link)<{ $bg: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.95rem;
  border-radius: 999px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.12s, filter 0.12s;

  &:hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
  }
`;

const CloseBtn = styled.button<{ $color: string }>`
  border: none;
  background: transparent;
  color: ${({ $color }) => $color};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.25rem 0.35rem;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  opacity: 0.85;

  &:hover {
    opacity: 1;
  }
`;

type Props = {
  placement: "top" | "bottom";
};

const IconFor = ({ style }: { style: string }) => {
  if (style === "bell") return <FiBell size={16} />;
  if (style === "alert") return <FiAlertCircle size={16} />;
  if (style === "star") return <FiStar size={16} />;
  return null;
};

const UserPanelHighlightBanners: React.FC<Props> = ({ placement }) => {
  const [items, setItems] = useState<PanelHighlight[]>([]);
  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    fetchActivePanelHighlights()
      .then((list) => {
        if (!cancelled) setItems(list);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => {
    const forPlacement = items
      .filter((h) => h.placement === placement)
      .filter((h) => !isHighlightDismissed(h.id) && !hidden[h.id])
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
    // One banner per placement keeps the panel calm
    return forPlacement.slice(0, 1);
  }, [items, placement, hidden]);

  if (!visible.length) return null;

  return (
    <Stack $placement={placement}>
      {visible.map((h) => {
        const theme = getHighlightTheme(h.theme);
        return (
          <Banner key={h.id} $bg={theme.bannerBg} $text={theme.text} role="status">
            <Avatar $accent={theme.accent} aria-hidden>
              {h.iconStyle === "initials" || !h.iconStyle ? (
                h.initials || "LP"
              ) : (
                <IconFor style={h.iconStyle} />
              )}
            </Avatar>
            <Message>
              {h.eyebrow ? <span className="eyebrow">{h.eyebrow}</span> : null}
              {h.title}
            </Message>
            <Actions>
              <Cta
                to={`/user-panel/highlights/${h.id}`}
                $bg={theme.ctaBg}
                $color={theme.ctaText}
              >
                {h.ctaLabel || "See why"}
              </Cta>
              <CloseBtn
                type="button"
                $color={theme.text}
                onClick={() => {
                  dismissHighlight(h.id);
                  setHidden((prev) => ({ ...prev, [h.id]: true }));
                }}
              >
                <FiX size={14} /> Close
              </CloseBtn>
            </Actions>
          </Banner>
        );
      })}
    </Stack>
  );
};

export default UserPanelHighlightBanners;
