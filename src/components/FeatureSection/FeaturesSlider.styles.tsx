import styled from "styled-components";
import { motion } from "framer-motion";

export const SectionShell = styled.section`
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 0 0 clamp(1.75rem, 3vw, 2.25rem);
  /* Transparent band matches the card pull-up so gray starts under the cards */
  background: linear-gradient(
    180deg,
    transparent 0,
    transparent 72px,
    #eef1f6 72px,
    #eef1f6 100%
  );
`;

export const SliderWrapper = styled.div`
  position: relative;
  /* Below hero CTAs (z-index 5), above banner background */
  z-index: 3;
  width: 100%;
  max-width: ${({ theme }) => theme.typography.contentMax};
  /* Classic overlap onto banner — only into reserved empty blue below CTAs */
  margin: -72px auto 0;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  box-sizing: border-box;

  @media (max-width: 768px) {
    margin-top: -48px;
  }
`;

export const CardsRow = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 1.2vw, 0.85rem);
`;

export const CardsViewport = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

export const CardsSlider = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(var(--cols, 5), minmax(0, 1fr));
  gap: clamp(0.5rem, 1.2vw, 0.85rem);
`;

export const Card = styled(motion.article)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  padding: clamp(0.9rem, 1.6vw, 1.15rem) clamp(0.65rem, 1.2vw, 0.85rem);
  min-height: 108px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.WHITE};
  border: 1px solid #e3e7ee;
  box-shadow:
    0 1px 2px rgba(19, 46, 88, 0.04),
    0 8px 24px rgba(19, 46, 88, 0.08);
  text-align: center;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(251, 191, 36, 0.45);
    box-shadow:
      0 2px 4px rgba(19, 46, 88, 0.06),
      0 14px 28px rgba(19, 46, 88, 0.12);
  }

  @media (max-width: 768px) {
    min-height: 96px;
    gap: 0.5rem;
    padding: 0.85rem 0.55rem;
  }
`;

export const IconBadge = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: linear-gradient(145deg, rgba(19, 46, 88, 0.06) 0%, rgba(19, 46, 88, 0.03) 100%);
  border: 1px solid rgba(19, 46, 88, 0.08);
  transition: background 0.22s ease, border-color 0.22s ease;

  ${Card}:hover & {
    background: linear-gradient(145deg, rgba(251, 191, 36, 0.18) 0%, rgba(251, 191, 36, 0.08) 100%);
    border-color: rgba(251, 191, 36, 0.35);
  }

  img {
    width: 26px;
    height: 26px;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    border-radius: 10px;

    img {
      width: 24px;
      height: 24px;
    }
  }
`;

export const CardLabel = styled.p`
  margin: 0;
  font-size: clamp(0.72rem, 0.55vw + 0.62rem, 0.8125rem);
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.3;
  letter-spacing: -0.01em;
`;

export const NavButton = styled.button`
  flex-shrink: 0;
  border: 1px solid #dde2ea;
  background: ${({ theme }) => theme.colors.WHITE};
  color: ${({ theme }) => theme.colors.primary};
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(19, 46, 88, 0.08);
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.gold};
    transform: scale(1.05);
  }

  @media (max-width: 640px) {
    width: 34px;
    height: 34px;
  }
`;

export const DotsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 0.85rem;
`;

export const Dot = styled.button<{ $active?: boolean }>`
  width: ${({ $active }) => ($active ? "18px" : "6px")};
  height: 6px;
  border-radius: 999px;
  border: none;
  padding: 0;
  cursor: pointer;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.gold : "rgba(19, 46, 88, 0.18)"};
  transition: width 0.22s ease, background 0.22s ease;
`;
