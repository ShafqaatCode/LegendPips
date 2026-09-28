import styled from "styled-components";
import { motion } from "framer-motion";

export const SectionShell = styled.section`
  position: relative;
  z-index: 3;
  width: 100%;
  padding: 0 0 clamp(2rem, 3.5vw, 2.75rem);
  background: linear-gradient(
    180deg,
    transparent 0,
    transparent 64px,
    #eef1f6 64px,
    #eef1f6 100%
  );
`;

export const SliderWrapper = styled.div`
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: -56px auto 0;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  box-sizing: border-box;

  @media (max-width: 768px) {
    margin-top: -40px;
  }
`;

export const SliderRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: clamp(0.55rem, 1vw, 0.85rem);
`;

export const CardsViewport = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
`;

export const CardsTrack = styled.div`
  display: grid;
  grid-template-columns: repeat(var(--cols, 4), minmax(0, 1fr));
  gap: clamp(0.65rem, 1vw, 0.85rem);
`;

export const CardSlot = styled(motion.div)`
  min-width: 0;
  will-change: transform, opacity;

  a {
    display: block;
    text-decoration: none;
    color: inherit;
  }

  @media (prefers-reduced-motion: reduce) {
    will-change: auto;
  }
`;

export const Card = styled.article`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-height: 92px;
  padding: 0.95rem 1rem;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid rgba(19, 46, 88, 0.06);
  box-shadow: 0 6px 28px rgba(19, 46, 88, 0.08);
  cursor: pointer;
  overflow: hidden;
  transition:
    transform 0.4s cubic-bezier(0.45, 0.05, 0.55, 0.95),
    box-shadow 0.4s cubic-bezier(0.45, 0.05, 0.55, 0.95),
    border-color 0.4s cubic-bezier(0.45, 0.05, 0.55, 0.95);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(251, 191, 36, 0.07) 0%,
      transparent 55%
    );
    opacity: 0;
    transition: opacity 0.4s cubic-bezier(0.45, 0.05, 0.55, 0.95);
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #fbbf24 0%, #132e58 100%);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.45s cubic-bezier(0.45, 0.05, 0.55, 0.95);
  }

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(251, 191, 36, 0.35);
    box-shadow: 0 14px 36px rgba(19, 46, 88, 0.13);
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover::after {
    transform: scaleX(1);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    text-align: center;
    min-height: 108px;
    padding: 0.9rem 0.75rem;
    gap: 0.65rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &::before,
    &::after {
      transition: none;
    }
  }
`;

export const IconWrap = styled.div`
  position: relative;
  z-index: 1;
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #f7f9fc 0%, #eef2f7 100%);
  box-shadow:
    0 0 0 1px rgba(19, 46, 88, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition: transform 0.4s cubic-bezier(0.45, 0.05, 0.55, 0.95);

  ${Card}:hover & {
    transform: scale(1.04);
  }

  img {
    width: 28px;
    height: 28px;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    width: 46px;
    height: 46px;

    img {
      width: 26px;
      height: 26px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const CardCopy = styled.div`
  position: relative;
  z-index: 1;
  min-width: 0;
  flex: 1;
`;

export const CardLabel = styled.p`
  margin: 0;
  font-size: clamp(0.78rem, 0.45vw + 0.68rem, 0.875rem);
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.35;
  letter-spacing: -0.02em;
`;

export const CardHint = styled.span`
  display: block;
  margin-top: 0.2rem;
  font-size: 0.68rem;
  font-weight: 500;
  color: rgba(19, 46, 88, 0.48);
  letter-spacing: 0.01em;
  transition: color 0.35s cubic-bezier(0.45, 0.05, 0.55, 0.95);

  ${Card}:hover & {
    color: rgba(19, 46, 88, 0.72);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const NavButton = styled.button`
  flex-shrink: 0;
  align-self: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid rgba(19, 46, 88, 0.1);
  background: #ffffff;
  color: ${({ theme }) => theme.colors.primary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(19, 46, 88, 0.1);
  transition:
    transform 0.35s cubic-bezier(0.45, 0.05, 0.55, 0.95),
    border-color 0.35s cubic-bezier(0.45, 0.05, 0.55, 0.95),
    background 0.35s cubic-bezier(0.45, 0.05, 0.55, 0.95),
    box-shadow 0.35s cubic-bezier(0.45, 0.05, 0.55, 0.95);

  &:hover {
    transform: scale(1.04);
    border-color: rgba(251, 191, 36, 0.65);
    background: #fffdf5;
    box-shadow: 0 6px 20px rgba(19, 46, 88, 0.14);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 640px) {
    width: 36px;
    height: 36px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const ProgressRow = styled.div`
  margin-top: 1rem;
  padding: 0 3rem;
`;

export const ProgressTrack = styled.div`
  height: 3px;
  border-radius: 999px;
  background: rgba(19, 46, 88, 0.1);
  overflow: hidden;
`;

export const ProgressFill = styled(motion.div)`
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #fbbf24 0%, #132e58 100%);
  will-change: width;

  @media (prefers-reduced-motion: reduce) {
    will-change: auto;
  }
`;
