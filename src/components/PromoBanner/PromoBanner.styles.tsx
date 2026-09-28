import styled from "styled-components";
import bgImage from "../../assets/banner/hero-bg3.png";
import { motion } from "framer-motion";

export const BannerWrapper = styled.section`
  position: relative;
  overflow: hidden;
  min-height: clamp(520px, 78vh, 640px);
  display: flex;
  align-items: center;
  padding: clamp(2.25rem, 5vw, 3.5rem) ${({ theme }) => theme.typography.pageGutter}
    clamp(6.5rem, 10vw, 8.5rem);
  background-image: url("${bgImage}");
  background-size: cover;
  background-position: center;
  color: ${({ theme }) => theme.colors.WHITE};

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(105deg, rgba(8, 20, 40, 0.72) 0%, rgba(19, 46, 88, 0.45) 48%, rgba(19, 46, 88, 0.2) 100%),
      radial-gradient(ellipse 50% 70% at 85% 40%, rgba(251, 191, 36, 0.12), transparent 55%);
    z-index: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-height: auto;
    padding: 2rem ${({ theme }) => theme.typography.pageGutter} 6.25rem;
  }
`;

export const HeroShell = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(260px, 0.9fr);
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 36rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    align-items: center;
    text-align: center;
    max-width: 100%;
  }
`;

export const SubheadingWrapper = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.75rem 0.35rem 0.45rem;
  border-radius: 999px;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.28);
  margin-bottom: 0.85rem;

  img {
    height: 18px;
    width: 18px;
  }
`;

export const HeroSubTitle = styled.p`
  font-family: ${({ theme }) => theme.font.family};
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.gold};
  text-transform: uppercase;
  margin: 0;
`;

export const HeroTitle = styled(motion.h1)`
  font-family: ${({ theme }) => theme.font.family};
  font-size: clamp(1.85rem, 3.2vw + 0.6rem, 2.65rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin: 0 0 0.75rem;
  color: #fff;

  span {
    color: ${({ theme }) => theme.colors.gold};
  }
`;

export const HeroLead = styled(motion.p)`
  margin: 0 0 1.35rem;
  font-family: ${({ theme }) => theme.font.family};
  font-size: clamp(0.92rem, 1.1vw + 0.65rem, 1.05rem);
  font-weight: 400;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.82);
  max-width: 32rem;

  strong {
    color: ${({ theme }) => theme.colors.gold};
    font-weight: 700;
  }
`;

export const ActionButtons = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    width: 100%;
    align-items: stretch;
  }
`;

const ButtonBase = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 1.45rem;
  font-size: 0.9rem;
  font-weight: 800;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease;
  border: 1.5px solid transparent;
  font-family: ${({ theme }) => theme.font.family};
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
  }

  img {
    width: 18px;
    height: 18px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

export const JoinButton = styled(ButtonBase)`
  background: ${({ theme }) => theme.colors.Gold};
  color: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 12px 28px rgba(251, 191, 36, 0.28);

  &:hover {
    box-shadow: 0 16px 32px rgba(251, 191, 36, 0.38);
  }
`;

export const CompareButton = styled(ButtonBase)`
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(8px);

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.55);
  }
`;

export const HeroTrustRow = styled(motion.ul)`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    justify-content: center;
  }
`;

export const HeroTrustItem = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: rgba(255, 255, 255, 0.78);
  font-family: ${({ theme }) => theme.font.family};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.01em;

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.gold};

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

export const HeroVisual = styled(motion.aside)`
  position: relative;
  border-radius: 22px;
  padding: 1.45rem 1.35rem 1.45rem;
  background:
    radial-gradient(ellipse 80% 50% at 100% 0%, rgba(251, 191, 36, 0.18), transparent 55%),
    linear-gradient(165deg, rgba(15, 36, 72, 0.92) 0%, rgba(19, 46, 88, 0.88) 55%, rgba(10, 24, 48, 0.94) 100%);
  border: 1px solid rgba(251, 191, 36, 0.28);
  backdrop-filter: blur(16px);
  box-shadow:
    0 28px 56px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    max-width: 420px;
    margin: 0 auto;
    width: 100%;
  }
`;

export const VisualEyebrow = styled.p`
  margin: 0 0 0.3rem;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gold};
`;

export const VisualTitle = styled.h2`
  margin: 0 0 1.15rem;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #fff;
  line-height: 1.25;
`;

export const LogoStack = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.85rem;
`;

export const LogoBubble = styled.button`
  appearance: none;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  padding: 0;
  margin-left: -12px;
  border: 2px solid rgba(255, 255, 255, 0.92);
  background: #fff;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s ease, z-index 0s;
  position: relative;
  z-index: 1;

  &:first-child {
    margin-left: 0;
  }

  &:hover {
    transform: translateY(-4px) scale(1.06);
    z-index: 5;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 6px;
    box-sizing: border-box;
    display: block;
  }
`;

export const LogoFallback = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 0.7rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  background: linear-gradient(135deg, #fbbf24, #fef3c7);
`;

export const MoreBubble = styled.button`
  appearance: none;
  margin-left: -12px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px solid rgba(251, 191, 36, 0.55);
  background: rgba(251, 191, 36, 0.18);
  color: ${({ theme }) => theme.colors.gold};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
  position: relative;
  z-index: 0;
  padding: 0;

  &:hover {
    background: rgba(251, 191, 36, 0.28);
  }
`;

export const BrokerNameRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 1.15rem;
`;

export const BrokerChip = styled.button`
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.88);
  font-family: inherit;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: rgba(251, 191, 36, 0.16);
    border-color: rgba(251, 191, 36, 0.4);
    color: #fff;
  }
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
  margin-bottom: 1.1rem;
`;

export const StatCell = styled.div`
  padding: 0.75rem 0.45rem;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(251, 191, 36, 0.2);
  text-align: center;

  strong {
    display: block;
    font-size: 1.1rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.gold};
    letter-spacing: -0.02em;
    line-height: 1.15;
  }

  span {
    display: block;
    margin-top: 0.22rem;
    font-size: 0.62rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.68);
    line-height: 1.3;
  }
`;

export const VisualCta = styled.button`
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.Gold};
  color: ${({ theme }) => theme.colors.primary};
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 12px 26px rgba(251, 191, 36, 0.28);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 32px rgba(251, 191, 36, 0.38);
  }
`;

export const VisualHint = styled.p`
  margin: 0.65rem 0 0;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.55);
`;

/* Keep old names exported so any stray imports don't break */
export const TrustLine = styled(motion.p)``;
export const BrokersContainer = styled(motion.div)``;
export const BrokerLeftSection = styled.div``;
export const BrokerRightSection = styled.div``;
export const BrokerAvatars = styled.div``;
