import styled, { css } from 'styled-components';

/* ── Layout tokens ── */
export const adminColors = {
  navy: '#132E58',
  navyLight: '#1a4a7a',
  gold: '#Fbbf24',
  bg: '#eef2f7',
  card: '#ffffff',
  border: '#e2e8f0',
  text: '#1e293b',
  muted: '#64748b',
  success: '#059669',
  danger: '#dc2626',
  warning: '#d97706',
  shadow: '0 4px 20px rgba(15, 23, 42, 0.06)',
  shadowHover: '0 10px 28px rgba(15, 23, 42, 0.1)',
};

/* ── Page header ── */
export const PageWrap = styled.div`
  max-width: 1440px;
  margin: 0 auto;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.35rem;
  flex-wrap: wrap;
`;

export const PageTitleGroup = styled.div``;

export const PageTitle = styled.h1`
  font-size: 1.375rem;
  font-weight: 800;
  color: ${adminColors.navy};
  margin: 0 0 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  letter-spacing: -0.02em;

  svg {
    color: ${adminColors.navy};
    font-size: 1.05rem;
    padding: 0.4rem;
    border-radius: 10px;
    background: linear-gradient(145deg, ${adminColors.gold}, #f59e0b);
    box-sizing: content-box;
  }
`;

export const PageSubtitle = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: ${adminColors.muted};
  line-height: 1.45;
`;

export const PrimaryButton = styled.button<{ $sm?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: ${({ $sm }) => ($sm ? '0.48rem 0.85rem' : '0.6rem 1.1rem')};
  font-size: ${({ $sm }) => ($sm ? '0.75rem' : '0.8125rem')};
  font-weight: 700;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, ${adminColors.navy} 0%, ${adminColors.navyLight} 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(19, 46, 88, 0.22);
  transition: transform 0.12s, box-shadow 0.15s, filter 0.15s;

  &:hover:not(:disabled) {
    filter: brightness(1.06);
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(19, 46, 88, 0.28);
  }
  &:disabled { opacity: 0.55; cursor: not-allowed; transform: none; box-shadow: none; }
`;

export const GhostButton = styled.button<{ $danger?: boolean; $sm?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: ${({ $sm }) => ($sm ? '0.42rem 0.7rem' : '0.52rem 0.9rem')};
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9px;
  cursor: pointer;
  background: white;
  color: ${({ $danger }) => ($danger ? adminColors.danger : adminColors.navy)};
  border: 1px solid ${({ $danger }) => ($danger ? '#fecaca' : adminColors.border)};
  transition: all 0.15s;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);

  &:hover:not(:disabled) {
    background: ${({ $danger }) => ($danger ? '#fef2f2' : '#f8fafc')};
    border-color: ${({ $danger }) => ($danger ? adminColors.danger : adminColors.navy)};
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

/* ── Stats ── */
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.85rem;
  margin-bottom: 1.35rem;

  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 520px) { grid-template-columns: 1fr; }
`;

export const StatCard = styled.button<{ $accent?: string }>`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem 1.05rem;
  background: ${adminColors.card};
  border: 1px solid ${adminColors.border};
  border-radius: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.18s ease;
  width: 100%;
  box-shadow: ${adminColors.shadow};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 3px;
    background: linear-gradient(180deg, ${adminColors.gold}, transparent);
    opacity: 0;
    transition: opacity 0.15s;
  }

  &:hover {
    border-color: rgba(251, 191, 36, 0.55);
    box-shadow: ${adminColors.shadowHover};
    transform: translateY(-2px);
    &::before { opacity: 1; }
  }
`;

export const StatIconBox = styled.div<{ $color: string }>`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: ${({ $color }) => $color}18;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px ${({ $color }) => $color}22;
`;

export const StatBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const StatValue = styled.div`
  font-size: 1.35rem;
  font-weight: 800;
  color: ${adminColors.navy};
  line-height: 1.15;
  letter-spacing: -0.03em;
`;

export const StatLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${adminColors.muted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.15rem;
`;

export const StatMeta = styled.div<{ $positive?: boolean }>`
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${({ $positive }) => ($positive !== false ? adminColors.success : adminColors.danger)};
  margin-top: 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* ── Filters ── */
export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.9rem;
  padding: 0.7rem 0.85rem;
  background: ${adminColors.card};
  border: 1px solid ${adminColors.border};
  border-radius: 14px;
  box-shadow: ${adminColors.shadow};
`;

export const SearchInput = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex: 1;
  min-width: 180px;
  max-width: 280px;
  padding: 0.45rem 0.65rem;
  background: #f8fafc;
  border: 1px solid ${adminColors.border};
  border-radius: 7px;

  svg { color: ${adminColors.muted}; font-size: 0.875rem; }

  input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.8125rem;
    color: ${adminColors.text};
    width: 100%;
  }
`;

export const FilterSelect = styled.select`
  padding: 0.45rem 0.65rem;
  font-size: 0.8125rem;
  border: 1px solid ${adminColors.border};
  border-radius: 7px;
  background: #f8fafc;
  color: ${adminColors.text};
  outline: none;
  cursor: pointer;
`;

export const FilterCount = styled.span`
  margin-left: auto;
  font-size: 0.75rem;
  color: ${adminColors.muted};
  font-weight: 500;
`;

/* ── Table ── */
export const TableCard = styled.div`
  background: ${adminColors.card};
  border: 1px solid ${adminColors.border};
  border-radius: 14px;
  overflow: hidden;
  box-shadow: ${adminColors.shadow};
`;

export const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  padding: 0.625rem 0.875rem;
  text-align: left;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${adminColors.muted};
  background: #f8fafc;
  border-bottom: 1px solid ${adminColors.border};
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 0.625rem 0.875rem;
  font-size: 0.8125rem;
  color: ${adminColors.text};
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
`;

export const Tr = styled.tr`
  transition: background 0.12s;
  &:hover { background: #f8fafc; }
  &:last-child td { border-bottom: none; }
`;

export const EmptyCell = styled.td`
  padding: 2.5rem;
  text-align: center;
  color: ${adminColors.muted};
  font-size: 0.8125rem;
`;

/* ── Badges ── */
const badgeStyles = {
  active: { bg: '#ecfdf5', color: '#059669' },
  blocked: { bg: '#fef2f2', color: '#dc2626' },
  admin: { bg: '#fef9c3', color: '#a16207' },
  user: { bg: '#f1f5f9', color: '#475569' },
  pending: { bg: '#fffbeb', color: '#d97706' },
  approved: { bg: '#ecfdf5', color: '#059669' },
  rejected: { bg: '#fef2f2', color: '#dc2626' },
  incomplete: { bg: '#f1f5f9', color: '#64748b' },
  default: { bg: '#f1f5f9', color: '#64748b' },
};

export const Pill = styled.span<{ $variant?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: capitalize;
  ${({ $variant = 'default' }) => {
    const s = badgeStyles[$variant as keyof typeof badgeStyles] || badgeStyles.default;
    return css`background: ${s.bg}; color: ${s.color};`;
  }}
`;

/* ── User cell ── */
export const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #Fbbf24, #f59e0b);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 800;
  color: ${adminColors.navy};
  flex-shrink: 0;
`;

export const UserName = styled.div`
  font-weight: 600;
  font-size: 0.8125rem;
  color: ${adminColors.navy};
`;

export const UserEmail = styled.div`
  font-size: 0.6875rem;
  color: ${adminColors.muted};
`;

/* ── Actions ── */
export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const IconBtn = styled.button<{ $danger?: boolean; $success?: boolean }>`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${adminColors.border};
  border-radius: 6px;
  background: white;
  cursor: pointer;
  color: ${({ $danger, $success }) =>
    $danger ? adminColors.danger : $success ? adminColors.success : adminColors.muted};
  font-size: 0.8125rem;
  transition: all 0.12s;

  &:hover {
    background: ${({ $danger, $success }) =>
      $danger ? '#fef2f2' : $success ? '#ecfdf5' : '#f8fafc'};
    color: ${({ $danger, $success }) =>
      $danger ? adminColors.danger : $success ? adminColors.success : adminColors.navy};
    border-color: ${({ $danger, $success }) =>
      $danger ? '#fecaca' : $success ? '#a7f3d0' : adminColors.navy};
  }

  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

/* ── Pagination ── */
export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 0.875rem;
  border-top: 1px solid ${adminColors.border};
  background: #fafbfc;
`;

export const PageButtons = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const PageBtn = styled.button<{ $active?: boolean }>`
  min-width: 28px;
  height: 28px;
  padding: 0 0.4rem;
  border-radius: 6px;
  border: 1px solid ${({ $active }) => ($active ? adminColors.navy : adminColors.border)};
  background: ${({ $active }) => ($active ? adminColors.navy : 'white')};
  color: ${({ $active }) => ($active ? 'white' : adminColors.text)};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;

  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

/* ── Cards / sections ── */
export const SectionCard = styled.div`
  background: ${adminColors.card};
  border: 1px solid ${adminColors.border};
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: ${adminColors.shadow};
`;

export const SectionHead = styled.div`
  padding: 0.85rem 1.1rem;
  border-bottom: 1px solid ${adminColors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(180deg, #fafbfc 0%, white 100%);

  h2 {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 800;
    color: ${adminColors.navy};
    letter-spacing: -0.01em;
  }
`;

export const SectionBody = styled.div`
  padding: 0.85rem 1.1rem;
`;

export const ErrorBanner = styled.div`
  padding: 0.7rem 0.95rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  color: #b91c1c;
  font-size: 0.8125rem;
  margin-bottom: 0.9rem;
`;

export const DashboardHero = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1.35rem 1.5rem;
  margin-bottom: 1.35rem;
  background:
    radial-gradient(ellipse 70% 120% at 100% 0%, rgba(251, 191, 36, 0.22) 0%, transparent 55%),
    linear-gradient(125deg, #0c1f3d 0%, ${adminColors.navy} 45%, ${adminColors.navyLight} 100%);
  border-radius: 16px;
  color: white;
  box-shadow: 0 12px 32px rgba(12, 31, 61, 0.28);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    right: -20px;
    bottom: -40px;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: rgba(251, 191, 36, 0.08);
    pointer-events: none;
  }

  h1 {
    margin: 0 0 0.3rem;
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  p {
    margin: 0;
    font-size: 0.8125rem;
    opacity: 0.88;
    max-width: 420px;
    line-height: 1.45;
  }
`;

export const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.625rem;
  margin-bottom: 1.25rem;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
`;

export const QuickLink = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  background: ${adminColors.card};
  border: 1px solid ${adminColors.border};
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;

  &:hover {
    border-color: ${adminColors.gold};
    background: #fffbeb;
  }

  svg {
    font-size: 0.9375rem;
    color: ${adminColors.gold};
    flex-shrink: 0;
  }

  span {
    font-size: 0.75rem;
    font-weight: 600;
    color: ${adminColors.navy};
  }
`;

export const ActivityRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.625rem 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child { border-bottom: none; }
`;

export const ActivityDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  margin-top: 0.35rem;
  flex-shrink: 0;
`;

export const ActivityText = styled.div`
  font-size: 0.8125rem;
  color: ${adminColors.text};
  line-height: 1.4;

  strong { color: ${adminColors.navy}; }
`;

export const ActivityTime = styled.div`
  font-size: 0.6875rem;
  color: ${adminColors.muted};
  margin-top: 0.15rem;
`;

export const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.25rem;

  @media (max-width: 1100px) { grid-template-columns: 1fr 1fr; }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

export const ShowAllBtn = styled.button`
  background: none;
  border: none;
  color: ${adminColors.gold};
  font-size: 0.6875rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  &:hover { text-decoration: underline; color: #f59e0b; }
`;

export const PreviewRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.1s;
  border-radius: 4px;
  margin: 0 -0.25rem;
  padding-left: 0.25rem;
  padding-right: 0.25rem;

  &:last-child { border-bottom: none; }
  &:hover { background: #f8fafc; }

  .main {
    flex: 1;
    min-width: 0;
  }

  .title {
    font-size: 0.8125rem;
    font-weight: 600;
    color: ${adminColors.navy};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sub {
    font-size: 0.6875rem;
    color: ${adminColors.muted};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const EmptyPreview = styled.div`
  font-size: 0.8125rem;
  color: ${adminColors.muted};
  padding: 0.75rem 0;
  text-align: center;
`;
