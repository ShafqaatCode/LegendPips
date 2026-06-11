import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

export const userColors = {
  navy: '#132E58',
  navyLight: '#1a4a7a',
  gold: '#Fbbf24',
  bg: '#f4f6f9',
  card: '#ffffff',
  border: '#e8ecf1',
  text: '#1e293b',
  muted: '#64748b',
  success: '#059669',
  danger: '#dc2626',
  warning: '#d97706',
};

export const PageWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const DashboardHero = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1rem;
  margin-bottom: 0.875rem;
  background: linear-gradient(135deg, ${userColors.navy} 0%, ${userColors.navyLight} 100%);
  border-radius: 10px;
  color: white;
  flex-wrap: wrap;

  h1 {
    margin: 0 0 0.15rem;
    font-size: 1.0625rem;
    font-weight: 700;
  }

  p {
    margin: 0;
    font-size: 0.75rem;
    opacity: 0.85;
  }
`;

export const PageHeader = styled.div`
  margin-bottom: 1rem;
`;

export const PageTitle = styled.h1`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${userColors.navy};
  margin: 0 0 0.2rem;
  display: flex;
  align-items: center;
  gap: 0.45rem;

  svg { color: ${userColors.gold}; font-size: 1rem; }
`;

export const PageSubtitle = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: ${userColors.muted};
  line-height: 1.5;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.625rem;
  margin-bottom: 0.875rem;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

export const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 0.875rem;
  background: ${userColors.card};
  border: 1px solid ${userColors.border};
  border-radius: 10px;
`;

export const StatIconBox = styled.div<{ $color: string }>`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: ${({ $color }) => $color}14;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9375rem;
  flex-shrink: 0;
`;

export const StatBody = styled.div` flex: 1; min-width: 0; `;

export const StatValue = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${userColors.navy};
  line-height: 1.2;
`;

export const StatLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${userColors.muted};
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

export const StatMeta = styled.div<{ $positive?: boolean }>`
  font-size: 0.6875rem;
  color: ${({ $positive }) => ($positive !== false ? userColors.success : userColors.danger)};
  margin-top: 0.1rem;
`;

export const HintBar = styled.div`
  font-size: 0.75rem;
  color: ${userColors.text};
  padding: 0.55rem 0.75rem;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  margin-bottom: 0.875rem;

  strong { color: ${userColors.navy}; }
`;

export const ErrorBanner = styled.div`
  background: #fef2f2;
  color: #b91c1c;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  margin-bottom: 0.875rem;
  border: 1px solid #fecaca;
  font-size: 0.8125rem;
`;

export const SectionCard = styled.section`
  background: ${userColors.card};
  border: 1px solid ${userColors.border};
  border-radius: 10px;
  margin-bottom: 0.75rem;
  overflow: hidden;
`;

export const SectionHead = styled.div`
  padding: 0.625rem 0.875rem;
  border-bottom: 1px solid ${userColors.border};
  background: #fafbfc;

  h2 {
    margin: 0;
    font-size: 0.8125rem;
    font-weight: 700;
    color: ${userColors.navy};
  }
`;

export const SectionBody = styled.div` padding: 0.875rem; `;

export const Pill = styled.span<{ $variant?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: capitalize;

  ${({ $variant }) => {
    switch ($variant) {
      case 'approved':
        return css`background: #ecfdf5; color: #059669;`;
      case 'pending':
        return css`background: #fffbeb; color: #d97706;`;
      case 'rejected':
        return css`background: #fef2f2; color: #dc2626;`;
      case 'incomplete':
        return css`background: #f1f5f9; color: #64748b;`;
      default:
        return css`background: #f1f5f9; color: #64748b;`;
    }
  }}
`;

export const PrimaryButton = styled.button<{ $sm?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: ${({ $sm }) => ($sm ? '0.45rem 0.75rem' : '0.55rem 1rem')};
  font-size: ${({ $sm }) => ($sm ? '0.75rem' : '0.8125rem')};
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: ${userColors.navy};
  color: white;
  text-decoration: none;
  transition: background 0.15s;

  &:hover:not(:disabled) { background: ${userColors.navyLight}; }
  &:disabled { opacity: 0.55; cursor: not-allowed; }
`;

export const GhostNavLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 7px;
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

export const GhostLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 7px;
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
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  border-radius: 9px;
  margin-bottom: 0.875rem;
  flex-wrap: wrap;
  font-size: 0.8125rem;
  border: 1px solid ${({ $variant }) =>
    $variant === 'approved' ? '#a7f3d0' :
    $variant === 'pending' ? '#fde68a' :
    $variant === 'rejected' ? '#fecaca' : '#bfdbfe'};
  background: ${({ $variant }) =>
    $variant === 'approved' ? '#ecfdf5' :
    $variant === 'pending' ? '#fffbeb' :
    $variant === 'rejected' ? '#fef2f2' : '#eff6ff'};

  .label { font-weight: 700; color: ${userColors.navy}; }
  .desc { font-size: 0.75rem; color: ${userColors.muted}; margin-top: 2px; }
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
  padding: 0.4rem 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.8125rem;

  &:last-child { border-bottom: none; }
  span:first-child { color: ${userColors.muted}; }
  span:last-child { color: ${userColors.navy}; font-weight: 600; text-align: right; }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;

  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${userColors.navy};

  &.full { grid-column: 1 / -1; }

  input, select {
    font-weight: 400;
    padding: 0.55rem 0.65rem;
    border: 1px solid ${userColors.border};
    border-radius: 7px;
    outline: none;
    font-size: 0.8125rem;

    &:focus { border-color: ${userColors.navy}; }
    &:disabled { background: #f8fafc; color: ${userColors.muted}; cursor: not-allowed; }
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
  padding: 0.875rem;
  background: ${userColors.card};
  border: 1px solid ${userColors.border};
  border-radius: 10px;
  overflow-x: auto;
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
  gap: 0.75rem;
  padding: 0.875rem;
  border-radius: 10px;
  margin-bottom: 0.75rem;
  border: 1px solid ${({ $variant }) =>
    $variant === 'approved' ? '#a7f3d0' :
    $variant === 'pending' ? '#fde68a' :
    $variant === 'rejected' ? '#fecaca' : '#e2e8f0'};
  background: ${({ $variant }) =>
    $variant === 'approved' ? '#ecfdf5' :
    $variant === 'pending' ? '#fffbeb' :
    $variant === 'rejected' ? '#fef2f2' : '#f8fafc'};

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
  padding: 0.4rem 0.75rem;
  border: 1px solid ${({ $active }) => ($active ? userColors.navy : userColors.border)};
  background: ${({ $active }) => ($active ? userColors.navy : userColors.card)};
  color: ${({ $active }) => ($active ? 'white' : userColors.navy)};
  border-radius: 7px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.12s;

  &:hover {
    border-color: ${userColors.navy};
    background: ${({ $active }) => ($active ? userColors.navy : '#f8fafc')};
  }
`;

export const GhostButton = styled.button<{ $sm?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: ${({ $sm }) => ($sm ? '0.4rem 0.65rem' : '0.5rem 0.85rem')};
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 7px;
  cursor: pointer;
  background: white;
  color: ${userColors.navy};
  border: 1px solid ${userColors.border};
  transition: all 0.12s;

  &:hover:not(:disabled) {
    background: #f8fafc;
    border-color: ${userColors.navy};
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const TableCard = styled.div`
  background: ${userColors.card};
  border: 1px solid ${userColors.border};
  border-radius: 10px;
  overflow: hidden;
`;

export const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
`;

export const Th = styled.th`
  text-align: left;
  padding: 0.55rem 0.75rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${userColors.muted};
  background: #fafbfc;
  border-bottom: 1px solid ${userColors.border};
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 0.55rem 0.75rem;
  color: ${userColors.text};
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
`;

export const Tr = styled.tr`
  &:last-child td { border-bottom: none; }
  &:hover td { background: #fafbfc; }
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
  gap: 0.625rem;

  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

export const MediaCard = styled.div`
  background: ${userColors.card};
  border: 1px solid ${userColors.border};
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.12s;

  &:hover { border-color: ${userColors.gold}; }
`;

export const MediaThumb = styled.div`
  height: 96px;
  background: linear-gradient(135deg, ${userColors.navy} 0%, ${userColors.navyLight} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  position: relative;
`;

export const CardBody = styled.div` padding: 0.75rem; `;

export const CardTitle = styled.h3`
  margin: 0 0 0.35rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${userColors.navy};
  line-height: 1.35;
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
  border-radius: 10px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.12s;

  &:hover {
    border-color: ${userColors.gold};
    box-shadow: 0 2px 6px rgba(19, 46, 88, 0.05);
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  background: ${userColors.card};
  border: 1px dashed ${userColors.border};
  border-radius: 10px;
  color: ${userColors.muted};
  font-size: 0.8125rem;
  line-height: 1.5;
`;

export const ProfileBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, ${userColors.navy} 0%, ${userColors.navyLight} 100%);
  border-radius: 10px;
  color: white;
  flex-wrap: wrap;
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
  gap: 0.75rem;
  padding: 0.625rem 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child { border-bottom: none; }

  h4 {
    margin: 0 0 0.1rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: ${userColors.navy};
  }

  p {
    margin: 0;
    font-size: 0.6875rem;
    color: ${userColors.muted};
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
