import styled, { css, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

export const userColors = {
  navy: '#132E58',
  navyLight: '#1a4a7a',
  gold: '#Fbbf24',
  goldSoft: '#fde68a',
  bg: '#eef2f7',
  card: '#ffffff',
  border: '#e2e8f0',
  text: '#0f172a',
  muted: '#64748b',
  success: '#059669',
  danger: '#dc2626',
  warning: '#d97706',
};

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const PageWrap = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  animation: ${fadeUp} 0.4s ease both;
`;

export const DashboardHero = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.15rem;
  padding: 1.35rem 1.45rem;
  margin-bottom: 1.15rem;
  background:
    radial-gradient(ellipse 55% 120% at 100% -20%, rgba(251, 191, 36, 0.32) 0%, transparent 55%),
    radial-gradient(ellipse 40% 80% at 0% 100%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
    linear-gradient(128deg, #0a1830 0%, ${userColors.navy} 48%, ${userColors.navyLight} 100%);
  border-radius: 18px;
  color: white;
  flex-wrap: wrap;
  box-shadow: 0 14px 36px rgba(12, 31, 61, 0.22);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: auto 0 0 0;
    height: 3px;
    background: linear-gradient(90deg, ${userColors.gold}, transparent 70%);
  }

  h1 {
    margin: 0 0 0.3rem;
    font-size: clamp(1.15rem, 2vw, 1.4rem);
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  p {
    margin: 0;
    font-size: 0.8125rem;
    opacity: 0.9;
    line-height: 1.5;
    max-width: 420px;
  }
`;

export const PageHeader = styled.div`
  position: relative;
  margin-bottom: 1.25rem;
  padding: 1.15rem 1.25rem 1.2rem;
  border-radius: 16px;
  background:
    radial-gradient(ellipse 70% 100% at 100% 0%, rgba(251, 191, 36, 0.1) 0%, transparent 55%),
    linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid ${userColors.border};
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, ${userColors.gold}, ${userColors.navy});
    border-radius: 4px 0 0 4px;
  }
`;

export const PageTitle = styled.h1`
  font-size: clamp(1.15rem, 2vw, 1.35rem);
  font-weight: 800;
  color: ${userColors.navy};
  margin: 0 0 0.35rem;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  letter-spacing: -0.03em;

  svg {
    color: ${userColors.gold};
    font-size: 1.15rem;
    filter: drop-shadow(0 2px 4px rgba(251, 191, 36, 0.35));
  }
`;

export const PageSubtitle = styled.p`
  margin: 0;
  font-size: 0.8375rem;
  color: ${userColors.muted};
  line-height: 1.55;
  max-width: 560px;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
  margin-bottom: 1.1rem;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

export const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem 1.05rem;
  background: ${userColors.card};
  border: 1px solid ${userColors.border};
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 3px;
    background: linear-gradient(180deg, ${userColors.gold}, transparent);
    opacity: 0;
    transition: opacity 0.15s;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(19, 46, 88, 0.1);
    border-color: rgba(251, 191, 36, 0.45);
    &::before { opacity: 1; }
  }
`;

export const StatIconBox = styled.div<{ $color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ $color }) => `linear-gradient(145deg, ${$color}22 0%, ${$color}0a 100%)`};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px ${({ $color }) => `${$color}28`};
`;

export const StatBody = styled.div` flex: 1; min-width: 0; `;

export const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${userColors.navy};
  line-height: 1.15;
  letter-spacing: -0.03em;
`;

export const StatLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${userColors.muted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.15rem;
`;

export const StatMeta = styled.div<{ $positive?: boolean }>`
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${({ $positive }) => ($positive !== false ? userColors.success : userColors.danger)};
  margin-top: 0.15rem;
`;

export const HintBar = styled.div`
  font-size: 0.8125rem;
  color: ${userColors.text};
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.06);
  strong { color: ${userColors.navy}; }
`;

export const ErrorBanner = styled.div`
  background: linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%);
  color: #b91c1c;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  border: 1px solid #fecaca;
  font-size: 0.8125rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.06);
`;

export const SectionCard = styled.section`
  background: ${userColors.card};
  border: 1px solid ${userColors.border};
  border-radius: 16px;
  margin-bottom: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.045);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  &:hover {
    box-shadow: 0 8px 28px rgba(15, 23, 42, 0.07);
    border-color: #d1d9e6;
  }
`;

export const SectionHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.9rem 1.15rem;
  border-bottom: 1px solid ${userColors.border};
  background: linear-gradient(180deg, #fbfcfe 0%, #f4f7fb 100%);

  h2 {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 800;
    color: ${userColors.navy};
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.35rem;
    letter-spacing: -0.01em;
    svg { color: ${userColors.gold}; }
  }
`;

export const SectionBody = styled.div`
  padding: 1.1rem 1.15rem 1.2rem;
`;

export const Pill = styled.span<{ $variant?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.28rem 0.65rem;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: capitalize;
  letter-spacing: 0.02em;

  ${({ $variant }) => {
    switch ($variant) {
      case 'approved':
      case 'active':
      case 'completed':
        return css`background: #ecfdf5; color: #059669; box-shadow: inset 0 0 0 1px #a7f3d0;`;
      case 'pending':
        return css`background: #fffbeb; color: #d97706; box-shadow: inset 0 0 0 1px #fde68a;`;
      case 'rejected':
        return css`background: #fef2f2; color: #dc2626; box-shadow: inset 0 0 0 1px #fecaca;`;
      case 'incomplete':
        return css`background: #f1f5f9; color: #64748b; box-shadow: inset 0 0 0 1px #e2e8f0;`;
      case 'user':
        return css`background: #eff6ff; color: #2563eb; box-shadow: inset 0 0 0 1px #bfdbfe;`;
      default:
        return css`background: #f1f5f9; color: #64748b; box-shadow: inset 0 0 0 1px #e2e8f0;`;
    }
  }}
`;

export const PrimaryButton = styled.button<{ $sm?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: ${({ $sm }) => ($sm ? '0.48rem 0.85rem' : '0.62rem 1.15rem')};
  font-size: ${({ $sm }) => ($sm ? '0.75rem' : '0.8125rem')};
  font-weight: 700;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, ${userColors.navy} 0%, ${userColors.navyLight} 100%);
  color: white;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(19, 46, 88, 0.22);
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;

  &:hover:not(:disabled) {
    filter: brightness(1.06);
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(19, 46, 88, 0.28);
  }
  &:disabled { opacity: 0.55; cursor: not-allowed; box-shadow: none; }
`;

export const GhostNavLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 9px;
  background: white;
  color: ${userColors.navy};
  border: 1px solid ${userColors.border};
  text-decoration: none;
  transition: all 0.15s;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);

  &:hover {
    background: #fffbeb;
    border-color: rgba(251, 191, 36, 0.55);
    color: ${userColors.navy};
  }
`;

export const GhostLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 9px;
  background: white;
  color: ${userColors.navy};
  border: 1px solid ${userColors.border};
  text-decoration: none;
  transition: all 0.15s;

  &:hover {
    background: #f8fafc;
    border-color: ${userColors.navy};
  }
`;

export const KycStrip = styled.div<{ $variant: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  padding: 0.9rem 1.1rem;
  border-radius: 14px;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  font-size: 0.8125rem;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
  border: 1px solid ${({ $variant }) =>
    $variant === 'approved' ? '#a7f3d0' :
    $variant === 'pending' ? '#fde68a' :
    $variant === 'rejected' ? '#fecaca' : '#bfdbfe'};
  background: ${({ $variant }) =>
    $variant === 'approved' ? 'linear-gradient(135deg, #ecfdf5, #f0fdf4)' :
    $variant === 'pending' ? 'linear-gradient(135deg, #fffbeb, #fefce8)' :
    $variant === 'rejected' ? 'linear-gradient(135deg, #fef2f2, #fff1f2)' :
    'linear-gradient(135deg, #eff6ff, #f0f9ff)'};

  .label { font-weight: 800; color: ${userColors.navy}; }
  .desc { font-size: 0.75rem; color: ${userColors.muted}; margin-top: 3px; line-height: 1.4; }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem 1rem;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.55rem 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.8125rem;
  &:last-child { border-bottom: none; }
  span:first-child { color: ${userColors.muted}; font-weight: 500; }
  span:last-child { color: ${userColors.navy}; font-weight: 700; text-align: right; }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${userColors.navy};
  &.full { grid-column: 1 / -1; }

  input, select, textarea {
    font-weight: 500;
    padding: 0.62rem 0.8rem;
    border: 1px solid ${userColors.border};
    border-radius: 10px;
    outline: none;
    font-size: 0.8125rem;
    background: #f8fafc;
    color: ${userColors.navy};
    font-family: inherit;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    &:focus {
      border-color: ${userColors.navy};
      box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.1);
      background: white;
    }
    &:disabled { background: #f1f5f9; color: ${userColors.muted}; cursor: not-allowed; }
  }
`;

export const QuickLinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-top: 0.25rem;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

export const QuickLinkCard = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 1rem 1.05rem;
  background: ${userColors.card};
  border: 1px solid ${userColors.border};
  border-radius: 14px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(251, 191, 36, 0.5);
    box-shadow: 0 12px 28px rgba(19, 46, 88, 0.1);
  }

  .icon {
    width: 38px;
    height: 38px;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.05rem;
    background: linear-gradient(145deg, rgba(251, 191, 36, 0.22) 0%, rgba(251, 191, 36, 0.08) 100%);
    color: ${userColors.navy};
    box-shadow: inset 0 0 0 1px rgba(251, 191, 36, 0.25);
  }

  .title {
    font-size: 0.8375rem;
    font-weight: 800;
    color: ${userColors.navy};
    letter-spacing: -0.01em;
  }

  .desc {
    font-size: 0.72rem;
    color: ${userColors.muted};
    line-height: 1.4;
  }
`;

export const SectionLabel = styled.h2`
  margin: 0 0 0.75rem;
  font-size: 0.8125rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${userColors.navy};
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, ${userColors.border}, transparent);
  }
`;

export const DocGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.625rem;

  @media (max-width: 720px) { grid-template-columns: 1fr; }
`;

export const DocCameraRow = styled.div`
  grid-column: 1 / -1;
  max-width: 340px;
`;

export const DocPreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.625rem;
`;

export const DocPreviewItem = styled.a`
  display: block;
  border: 1px solid ${userColors.border};
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;

  img {
    width: 100%;
    height: 90px;
    object-fit: cover;
    background: #f1f5f9;
  }

  div {
    padding: 0.45rem;
    font-size: 0.6875rem;
    font-weight: 700;
    color: ${userColors.navy};
  }
`;

export const ProgressTrack = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0;
  margin-bottom: 1rem;
  padding: 1rem 1.1rem;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid ${userColors.border};
  border-radius: 16px;
  overflow-x: auto;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
`;

export const ProgressStep = styled.div<{ $state: 'done' | 'current' | 'upcoming' | 'failed' }>`
  flex: 1;
  min-width: 100px;
  text-align: center;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 14px;
    left: calc(50% + 16px);
    right: calc(-50% + 16px);
    height: 2px;
    background: ${({ $state }) =>
      $state === 'done' ? userColors.success :
      $state === 'failed' ? userColors.danger : userColors.border};
  }

  .dot {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    margin: 0 auto 0.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    border: 2px solid ${({ $state }) =>
      $state === 'done' ? userColors.success :
      $state === 'current' ? userColors.gold :
      $state === 'failed' ? userColors.danger : userColors.border};
    background: ${({ $state }) =>
      $state === 'done' ? userColors.success :
      $state === 'current' ? userColors.gold :
      $state === 'failed' ? userColors.danger : 'white'};
    color: ${({ $state }) =>
      $state === 'done' || $state === 'failed' || $state === 'current' ? 'white' : userColors.muted};
    position: relative;
    z-index: 1;
  }

  .label {
    font-size: 0.6875rem;
    font-weight: 700;
    color: ${({ $state }) =>
      $state === 'current' ? userColors.navy :
      $state === 'done' ? userColors.success :
      $state === 'failed' ? userColors.danger : userColors.muted};
  }

  .sub {
    font-size: 0.625rem;
    color: ${userColors.muted};
    margin-top: 2px;
  }
`;

export const StatusHero = styled.div<{ $variant: string }>`
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 1.05rem 1.15rem;
  border-radius: 14px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
  border: 1px solid ${({ $variant }) =>
    $variant === 'approved' ? '#a7f3d0' :
    $variant === 'pending' ? '#fde68a' :
    $variant === 'rejected' ? '#fecaca' : '#bfdbfe'};
  background: ${({ $variant }) =>
    $variant === 'approved' ? 'linear-gradient(135deg, #ecfdf5, #f0fdf4)' :
    $variant === 'pending' ? 'linear-gradient(135deg, #fffbeb, #fefce8)' :
    $variant === 'rejected' ? 'linear-gradient(135deg, #fef2f2, #fff1f2)' :
    'linear-gradient(135deg, #eff6ff, #f8fafc)'};

  .icon {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.125rem;
    flex-shrink: 0;
    background: ${({ $variant }) =>
      $variant === 'approved' ? '#d1fae5' :
      $variant === 'pending' ? '#fef3c7' :
      $variant === 'rejected' ? '#fee2e2' : '#e2e8f0'};
    color: ${({ $variant }) =>
      $variant === 'approved' ? userColors.success :
      $variant === 'pending' ? userColors.warning :
      $variant === 'rejected' ? userColors.danger : userColors.muted};
  }

  h3 {
    margin: 0 0 0.2rem;
    font-size: 0.9375rem;
    font-weight: 700;
    color: ${userColors.navy};
  }

  p {
    margin: 0;
    font-size: 0.8125rem;
    color: ${userColors.muted};
    line-height: 1.5;
  }
`;

export const RejectionBox = styled.div`
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  margin-top: 0.5rem;

  strong {
    display: block;
    font-size: 0.75rem;
    color: #b91c1c;
    margin-bottom: 0.25rem;
  }

  p {
    margin: 0;
    font-size: 0.8125rem;
    color: #991b1b;
    line-height: 1.5;
  }
`;

/* ── Shared list / table / filter layout ── */
export const PageHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
`;

export const FilterTabs = styled.div`
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
`;

export const FilterTab = styled.button<{ $active?: boolean }>`
  padding: 0.45rem 0.85rem;
  border: 1px solid ${({ $active }) => ($active ? 'transparent' : userColors.border)};
  background: ${({ $active }) => (
    $active
      ? `linear-gradient(135deg, ${userColors.navy} 0%, ${userColors.navyLight} 100%)`
      : userColors.card
  )};
  color: ${({ $active }) => ($active ? 'white' : userColors.navy)};
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: ${({ $active }) => ($active ? '0 4px 12px rgba(19, 46, 88, 0.2)' : '0 1px 2px rgba(15, 23, 42, 0.03)')};

  &:hover {
    border-color: ${({ $active }) => ($active ? 'transparent' : 'rgba(251, 191, 36, 0.5)')};
    background: ${({ $active }) => (
      $active
        ? `linear-gradient(135deg, ${userColors.navy} 0%, ${userColors.navyLight} 100%)`
        : '#fffbeb'
    )};
  }
`;

export const GhostButton = styled.button<{ $sm?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: ${({ $sm }) => ($sm ? '0.42rem 0.7rem' : '0.55rem 0.9rem')};
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 10px;
  cursor: pointer;
  background: white;
  color: ${userColors.navy};
  border: 1px solid ${userColors.border};
  transition: all 0.15s;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);

  &:hover:not(:disabled) {
    background: #fffbeb;
    border-color: rgba(251, 191, 36, 0.55);
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const TableCard = styled.div`
  background: ${userColors.card};
  border: 1px solid ${userColors.border};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.045);
`;

export const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
`;

export const Th = styled.th`
  text-align: left;
  padding: 0.7rem 0.9rem;
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${userColors.muted};
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid ${userColors.border};
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 0.7rem 0.9rem;
  color: ${userColors.text};
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
`;

export const Tr = styled.tr`
  transition: background 0.12s;
  &:last-child td { border-bottom: none; }
  &:hover td { background: #f8fafc; }
`;

export const EmptyCell = styled.td`
  padding: 1.5rem;
  text-align: center;
  color: ${userColors.muted};
  font-size: 0.8125rem;
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 0.85rem;

  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

export const MediaCard = styled.div`
  background: ${userColors.card};
  border: 1px solid ${userColors.border};
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;

  &:hover {
    border-color: rgba(251, 191, 36, 0.5);
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(19, 46, 88, 0.1);
  }
`;

export const MediaThumb = styled.div`
  height: 110px;
  background:
    radial-gradient(ellipse 70% 80% at 100% 0%, rgba(251, 191, 36, 0.28) 0%, transparent 55%),
    linear-gradient(135deg, #0a1830 0%, ${userColors.navy} 50%, ${userColors.navyLight} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.65rem;
  position: relative;
`;

export const CardBody = styled.div` padding: 0.9rem 1rem 1rem; `;

export const CardTitle = styled.h3`
  margin: 0 0 0.4rem;
  font-size: 0.875rem;
  font-weight: 800;
  color: ${userColors.navy};
  line-height: 1.35;
  letter-spacing: -0.01em;
`;

export const MetaLine = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.6875rem;
  color: ${userColors.muted};
  margin-bottom: 0.25rem;

  svg { color: ${userColors.gold}; flex-shrink: 0; }
`;

export const ListStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ListCard = styled.div`
  background: ${userColors.card};
  border: 1px solid ${userColors.border};
  border-radius: 14px;
  padding: 1rem 1.05rem;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s;

  &:hover {
    border-color: rgba(251, 191, 36, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(19, 46, 88, 0.09);
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 2.25rem 1.25rem;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  color: ${userColors.muted};
  font-size: 0.8375rem;
  line-height: 1.55;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
`;

export const ProfileBanner = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.35rem;
  margin-bottom: 1.1rem;
  background:
    radial-gradient(ellipse 55% 120% at 100% -20%, rgba(251, 191, 36, 0.32) 0%, transparent 55%),
    linear-gradient(128deg, #0a1830 0%, ${userColors.navy} 48%, ${userColors.navyLight} 100%);
  border-radius: 18px;
  color: white;
  flex-wrap: wrap;
  box-shadow: 0 14px 36px rgba(12, 31, 61, 0.22);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: auto 0 0 0;
    height: 3px;
    background: linear-gradient(90deg, ${userColors.gold}, transparent 70%);
  }
`;

export const ProfileAvatar = styled.div<{ $image?: string; $clickable?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: ${({ $image }) =>
    $image ? `url(${$image}) center/cover no-repeat` : 'linear-gradient(135deg, #Fbbf24 0%, #f4b400 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: #132E58;
  flex-shrink: 0;
  position: relative;
  overflow: visible;
  border: 2px solid ${({ $clickable }) => ($clickable ? 'rgba(251, 191, 36, 0.85)' : 'transparent')};
  box-shadow: ${({ $clickable }) => ($clickable ? '0 0 0 2px rgba(251, 191, 36, 0.25)' : 'none')};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

export const AvatarUploadWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;

  input[type='file'] {
    display: none;
  }
`;

export const AvatarCameraBadge = styled.span`
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #Fbbf24;
  color: #132E58;
  border: 2px solid #132E58;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  pointer-events: none;
`;

export const AvatarChangeBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.55rem;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.14);
  color: white;
  font-size: 0.6875rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.12s, border-color 0.12s;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.24);
    border-color: #Fbbf24;
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  svg { font-size: 0.75rem; }
`;

export const ReadOnlyInput = styled.input`
  font-weight: 400;
  padding: 0.55rem 0.65rem;
  border: 1px solid ${userColors.border};
  border-radius: 7px;
  font-size: 0.8125rem;
  background: #f8fafc;
  color: ${userColors.muted};
  cursor: not-allowed;
  width: 100%;
`;

export const ProfileBannerInfo = styled.div`
  flex: 1;
  min-width: 140px;

  h2 {
    margin: 0 0 0.1rem;
    font-size: 0.9375rem;
    font-weight: 700;
  }

  p {
    margin: 0;
    font-size: 0.75rem;
    opacity: 0.85;
  }
`;

export const TextArea = styled.textarea`
  font-weight: 400;
  padding: 0.55rem 0.65rem;
  border: 1px solid ${userColors.border};
  border-radius: 7px;
  outline: none;
  font-size: 0.8125rem;
  min-height: 72px;
  resize: vertical;
  font-family: inherit;

  &:focus { border-color: ${userColors.navy}; }
  &:disabled { background: #f8fafc; cursor: not-allowed; }
`;

export const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 0.15rem;
  border-bottom: 1px solid #f1f5f9;

  &:last-child { border-bottom: none; }

  h4 {
    margin: 0 0 0.2rem;
    font-size: 0.8375rem;
    font-weight: 700;
    color: ${userColors.navy};
  }

  p {
    margin: 0;
    font-size: 0.75rem;
    color: ${userColors.muted};
    line-height: 1.4;
  }
`;

export const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  flex-shrink: 0;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + span {
      background: ${userColors.navy};
      &::before { transform: translateX(18px); }
    }
  }

  span {
    position: absolute;
    inset: 0;
    background: #cbd5e1;
    border-radius: 22px;
    cursor: pointer;
    transition: 0.2s;

    &::before {
      content: '';
      position: absolute;
      height: 16px;
      width: 16px;
      left: 3px;
      bottom: 3px;
      background: white;
      border-radius: 50%;
      transition: 0.2s;
    }
  }
`;

export const SelectCompact = styled.select`
  padding: 0.45rem 0.65rem;
  border: 1px solid ${userColors.border};
  border-radius: 7px;
  font-size: 0.8125rem;
  color: ${userColors.navy};
  background: white;
  cursor: pointer;

  &:focus { outline: none; border-color: ${userColors.navy}; }
`;

export const TimelineList = styled.div`
  background: ${userColors.card};
  border: 1px solid ${userColors.border};
  border-radius: 10px;
  padding: 0 0.75rem;
`;

export const TimelineItem = styled.div`
  display: flex;
  gap: 0.65rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child { border-bottom: none; }
`;

export const TimelineIcon = styled.div<{ $color?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ $color }) => ($color ? `${$color}14` : '#f1f5f9')};
  color: ${({ $color }) => $color || userColors.muted};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  flex-shrink: 0;
`;

export const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
`;

export const InlineStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.35rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 7px;
  margin: 0.5rem 0;
  text-align: center;

  strong {
    display: block;
    font-size: 0.8125rem;
    color: ${userColors.navy};
  }

  span {
    font-size: 0.625rem;
    color: ${userColors.muted};
    text-transform: uppercase;
  }
`;

export const BadgeOverlay = styled.span<{ $variant?: string }>`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  font-size: 0.625rem;
  font-weight: 700;
  background: ${({ $variant }) =>
    $variant === 'live' ? '#ef4444' :
    $variant === 'active' ? '#10b981' :
    $variant === 'upcoming' ? '#f59e0b' : '#64748b'};
  color: white;
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #f1f5f9;
  font-size: 0.6875rem;
  color: ${userColors.muted};
`;
