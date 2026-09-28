import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowRight, FiBell, FiExternalLink, FiX, FiZap } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { fetchPublicAnnouncements, type PublicAnnouncement } from "../../services/announcementService";
import {
  dismissHomeAnnouncement,
  shouldShowHomeAlertPopup,
} from "../../utils/homeAlertPopup";

const SHOW_DELAY_MS = 700;

const HomeAlertPopup: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [announcement, setAnnouncement] = useState<PublicAnnouncement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const load = async () => {
      try {
        const data = await fetchPublicAnnouncements(1, 1);
        const latest = data.items?.[0];
        if (cancelled || !latest) return;
        if (!shouldShowHomeAlertPopup(latest.id, latest.createdAt)) return;

        setAnnouncement(latest);
        timer = setTimeout(() => {
          if (!cancelled) setOpen(true);
        }, SHOW_DELAY_MS);
      } catch {
        // Silent — homepage should not break if alerts API is down
      }
    };

    if (!isLoading) load();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = () => {
    if (announcement) dismissHomeAnnouncement(announcement.id);
    setOpen(false);
  };

  const externalLink =
    announcement?.link?.startsWith("http://") || announcement?.link?.startsWith("https://");

  return (
    <AnimatePresence>
      {open && announcement && (
        <Overlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          onClick={close}
          role="presentation"
        >
          <GlowOrb aria-hidden />
          <Dialog
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-alert-title"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 32, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
          >
            <AccentBar aria-hidden />
            <Mesh aria-hidden />

            <CloseBtn type="button" onClick={close} aria-label="Close alert">
              <FiX size={18} />
            </CloseBtn>

            <IconWrap aria-hidden>
              <IconRing />
              <IconCore>
                <FiBell size={22} />
              </IconCore>
            </IconWrap>

            <LiveBadge>
              <LiveDot />
              Live platform alert
            </LiveBadge>

            <Title id="home-alert-title">{announcement.title}</Title>
            {announcement.body ? <Body>{announcement.body}</Body> : null}
            {announcement.time ? <Meta>{announcement.time}</Meta> : null}

            <Actions>
              <PrimaryLink to="/alerts" onClick={close}>
                <FiZap size={15} aria-hidden />
                View all alerts
                <FiArrowRight size={15} aria-hidden />
              </PrimaryLink>
              {announcement.link ? (
                externalLink ? (
                  <SecondaryLink
                    href={announcement.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={close}
                  >
                    Learn more
                    <FiExternalLink size={14} aria-hidden />
                  </SecondaryLink>
                ) : (
                  <SecondaryRouterLink to={announcement.link} onClick={close}>
                    Learn more
                    <FiArrowRight size={14} aria-hidden />
                  </SecondaryRouterLink>
                )
              ) : null}
            </Actions>

            <DismissHint type="button" onClick={close}>
              Dismiss for now
            </DismissHint>
          </Dialog>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default HomeAlertPopup;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.55; }
  50% { transform: scale(1.08); opacity: 0.9; }
`;

const shimmer = keyframes`
  0% { transform: translateX(-120%) rotate(12deg); }
  100% { transform: translateX(220%) rotate(12deg); }
`;

const liveBlink = keyframes`
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.5); }
  50% { opacity: 0.65; box-shadow: 0 0 0 6px rgba(251, 191, 36, 0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(251, 191, 36, 0.12), transparent 55%),
    rgba(8, 18, 38, 0.72);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const GlowOrb = styled.div`
  position: absolute;
  width: min(420px, 70vw);
  height: min(420px, 70vw);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.22) 0%, transparent 68%);
  pointer-events: none;
  filter: blur(8px);
`;

const Dialog = styled(motion.div)`
  position: relative;
  width: min(100%, 460px);
  overflow: hidden;
  border-radius: 24px;
  padding: 1.65rem 1.65rem 1.35rem;
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow:
    0 0 0 1px rgba(19, 46, 88, 0.06),
    0 32px 64px rgba(8, 18, 38, 0.28),
    0 8px 24px rgba(19, 46, 88, 0.12);
`;

const AccentBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #132e58 0%, #fbbf24 45%, #132e58 100%);
  background-size: 200% 100%;
  animation: ${shimmer} 4s ease-in-out infinite;
`;

const Mesh = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 100% 0%, rgba(251, 191, 36, 0.1), transparent 42%),
    radial-gradient(circle at 0% 100%, rgba(19, 46, 88, 0.06), transparent 40%);
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  border: 1px solid rgba(19, 46, 88, 0.08);
  background: rgba(255, 255, 255, 0.85);
  color: #64748b;
  width: 2.15rem;
  height: 2.15rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #132e58;
    border-color: #132e58;
    color: #fbbf24;
    transform: rotate(90deg);
  }
`;

const IconWrap = styled.div`
  position: relative;
  width: 58px;
  height: 58px;
  margin-bottom: 1rem;
`;

const IconRing = styled.div`
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px solid rgba(251, 191, 36, 0.45);
  animation: ${pulse} 2.4s ease-in-out infinite;
`;

const IconCore = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #132e58;
  background: linear-gradient(145deg, #fff9e6 0%, #fff 45%, #eef2f7 100%);
  box-shadow:
    0 0 0 1px rgba(251, 191, 36, 0.25),
    0 10px 24px rgba(19, 46, 88, 0.12);
`;

const LiveBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(19, 46, 88, 0.06);
  border: 1px solid rgba(19, 46, 88, 0.08);
  color: #132e58;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.85rem;
`;

const LiveDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #fbbf24;
  animation: ${liveBlink} 1.8s ease-in-out infinite;
`;

const Title = styled.h2`
  position: relative;
  z-index: 1;
  margin: 0 2.25rem 0.65rem 0;
  color: #132e58;
  font-size: clamp(1.25rem, 2.5vw, 1.45rem);
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.02em;
`;

const Body = styled.p`
  position: relative;
  z-index: 1;
  margin: 0 0 0.85rem;
  color: #475569;
  font-size: 0.92rem;
  line-height: 1.65;
  white-space: pre-wrap;
`;

const Meta = styled.p`
  position: relative;
  z-index: 1;
  margin: 0 0 1.15rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #94a3b8;
`;

const Actions = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
`;

const PrimaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  flex: 1;
  min-width: 160px;
  padding: 0.7rem 1rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #132e58 0%, #1e3f73 55%, #132e58 100%);
  color: #fff;
  font-size: 0.84rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(19, 46, 88, 0.22);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 28px rgba(19, 46, 88, 0.28);
    color: #fff;
  }
`;

const secondaryBtn = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.7rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(19, 46, 88, 0.12);
  background: rgba(255, 255, 255, 0.75);
  color: #132e58;
  font-size: 0.84rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: #fff;
    border-color: rgba(251, 191, 36, 0.55);
    transform: translateY(-1px);
  }
`;

const SecondaryLink = styled.a`
  ${secondaryBtn}
`;

const SecondaryRouterLink = styled(Link)`
  ${secondaryBtn}
`;

const DismissHint = styled.button`
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  margin-top: 0.85rem;
  padding: 0.35rem;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #64748b;
  }
`;
