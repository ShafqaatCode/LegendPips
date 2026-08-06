import styled from 'styled-components';
import { adminColors } from '../../../components/AdminPanel/adminUi';

export const SettingsShell = styled.div`
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr);
  gap: 0.95rem;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const SettingsNav = styled.nav`
  background: ${adminColors.card};
  border: 1px solid ${adminColors.border};
  border-radius: 14px;
  padding: 0.55rem;
  position: sticky;
  top: 72px;
  box-shadow: ${adminColors.shadow};

  @media (max-width: 900px) {
    position: static;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
`;

export const SettingsNavBtn = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.7rem;
  border: none;
  border-radius: 10px;
  background: ${({ $active }) =>
    $active
      ? `linear-gradient(135deg, ${adminColors.navy}, ${adminColors.navyLight})`
      : 'transparent'};
  color: ${({ $active }) => ($active ? 'white' : adminColors.text)};
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  text-align: left;
  transition: all 0.12s;
  box-shadow: ${({ $active }) => ($active ? '0 4px 12px rgba(19, 46, 88, 0.2)' : 'none')};

  svg {
    font-size: 0.9rem;
    flex-shrink: 0;
    color: ${({ $active }) => ($active ? adminColors.gold : adminColors.muted)};
  }

  &:hover {
    background: ${({ $active }) =>
      $active
        ? `linear-gradient(135deg, ${adminColors.navy}, ${adminColors.navyLight})`
        : '#f1f5f9'};
  }

  @media (max-width: 900px) {
    width: auto;
  }
`;

export const SettingsPanel = styled.div`
  background: ${adminColors.card};
  border: 1px solid ${adminColors.border};
  border-radius: 14px;
  overflow: hidden;
  box-shadow: ${adminColors.shadow};
`;

export const PanelHead = styled.div`
  padding: 0.95rem 1.1rem;
  border-bottom: 1px solid ${adminColors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  background: linear-gradient(180deg, #f8fafc 0%, white 100%);

  h2 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 800;
    color: ${adminColors.navy};
    letter-spacing: -0.01em;
  }

  p {
    margin: 0.2rem 0 0;
    font-size: 0.6875rem;
    color: ${adminColors.muted};
  }
`;

export const PanelBody = styled.div`
  padding: 1rem 1.1rem;
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
  .full {
    grid-column: 1 / -1;
  }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${adminColors.navy};

  input,
  select,
  textarea {
    padding: 0.5rem 0.6rem;
    border: 1px solid ${adminColors.border};
    border-radius: 9px;
    font-size: 0.8125rem;
    font-weight: 400;
    outline: none;
    background: #fafbfc;
    color: ${adminColors.text};
    transition: border-color 0.12s, box-shadow 0.12s;

    &:focus {
      border-color: ${adminColors.navy};
      box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.08);
      background: white;
    }
  }

  textarea {
    min-height: 72px;
    resize: vertical;
  }
`;

export const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.65rem 0.75rem;
  border: 1px solid ${adminColors.border};
  border-radius: 10px;
  background: #fafbfc;
  cursor: pointer;

  .info {
    strong {
      display: block;
      font-size: 0.8125rem;
      color: ${adminColors.navy};
    }
    span {
      font-size: 0.6875rem;
      color: ${adminColors.muted};
    }
  }

  input {
    width: 18px;
    height: 18px;
    accent-color: ${adminColors.navy};
  }
`;

export const LogoPreview = styled.div`
  width: 160px;
  height: 56px;
  border: 1px dashed ${adminColors.border};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

export const NavItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.65rem;
  border: 1px solid ${adminColors.border};
  border-radius: 10px;
  background: white;
  margin-bottom: 0.4rem;

  .order-btns {
    display: flex;
    flex-direction: column;
    gap: 2px;
    button {
      border: 1px solid ${adminColors.border};
      background: white;
      border-radius: 4px;
      width: 22px;
      height: 18px;
      font-size: 0.625rem;
      cursor: pointer;
      &:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }
    }
  }

  .fields {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 0.4rem;
    align-items: center;
    @media (max-width: 720px) {
      grid-template-columns: 1fr;
    }
  }

  input {
    padding: 0.35rem 0.5rem;
    border: 1px solid ${adminColors.border};
    border-radius: 6px;
    font-size: 0.75rem;
  }

  label.vis {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.6875rem;
    white-space: nowrap;
  }
`;

export const MemberCard = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid ${adminColors.border};
  border-radius: 12px;
  margin-bottom: 0.5rem;
  align-items: flex-start;
  box-shadow: ${adminColors.shadow};

  .avatar {
    width: 52px;
    height: 52px;
    border-radius: 10px;
    background: linear-gradient(135deg, ${adminColors.gold}, #f4b400);
    flex-shrink: 0;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .body {
    flex: 1;
    min-width: 0;
    .top {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 0.25rem;
    }
    h3 {
      margin: 0;
      font-size: 0.875rem;
      color: ${adminColors.navy};
    }
    .role {
      font-size: 0.625rem;
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: 999px;
      background: #eff6ff;
      color: #1d4ed8;
      text-transform: uppercase;
    }
    p {
      margin: 0;
      font-size: 0.75rem;
      color: ${adminColors.muted};
      line-height: 1.45;
    }
  }

  .actions {
    display: flex;
    gap: 0.35rem;
    flex-shrink: 0;
  }
`;

export const ReviewCard = styled(MemberCard)``;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalBox = styled.div`
  background: white;
  border-radius: 14px;
  width: min(480px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);

  .head {
    padding: 0.875rem 1rem;
    border-bottom: 1px solid ${adminColors.border};
    background: linear-gradient(180deg, #f8fafc 0%, white 100%);
    h3 {
      margin: 0;
      font-size: 0.9375rem;
      color: ${adminColors.navy};
      font-weight: 800;
    }
  }

  .content {
    padding: 1rem;
  }
  .foot {
    padding: 0.75rem 1rem;
    border-top: 1px solid ${adminColors.border};
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
`;

export const StatusMsg = styled.div<{ $ok?: boolean }>`
  padding: 0.5rem 0.75rem;
  border-radius: 9px;
  font-size: 0.75rem;
  margin-bottom: 0.75rem;
  background: ${({ $ok }) => ($ok ? '#ecfdf5' : '#fef2f2')};
  color: ${({ $ok }) => ($ok ? '#059669' : '#dc2626')};
  border: 1px solid ${({ $ok }) => ($ok ? '#a7f3d0' : '#fecaca')};
`;

export const SectionTabs = styled.div`
  display: flex;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;

  button {
    padding: 0.35rem 0.65rem;
    border-radius: 999px;
    border: 1px solid ${adminColors.border};
    background: white;
    font-size: 0.6875rem;
    font-weight: 600;
    cursor: pointer;
    &.active {
      background: ${adminColors.navy};
      color: white;
      border-color: ${adminColors.navy};
    }
  }
`;
