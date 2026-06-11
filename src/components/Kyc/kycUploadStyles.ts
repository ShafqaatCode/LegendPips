import styled from 'styled-components';

/** Shared compact KYC upload / camera card styles */
export const KycUploadCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
`;

export const KycUploadHeader = styled.div`
  padding: 0.5rem 0.65rem;
  background: #fafbfc;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;

  .meta {
    min-width: 0;
  }

  strong {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: #132E58;
    line-height: 1.3;
  }

  span {
    display: block;
    font-size: 0.6875rem;
    color: #64748b;
    margin-top: 0.125rem;
    line-height: 1.35;
  }
`;

export const KycPreviewArea = styled.div`
  position: relative;
  height: 96px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  video,
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  video {
    object-fit: cover;
    background: #0f172a;
  }

  img {
    background: #f1f5f9;
  }
`;

export const KycStatusBadge = styled.div`
  position: absolute;
  top: 0.375rem;
  right: 0.375rem;
  background: #059669;
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.2rem 0.45rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  line-height: 1;

  svg { font-size: 0.625rem; }
`;

export const KycActions = styled.div`
  display: flex;
  gap: 0.375rem;
  padding: 0.45rem 0.65rem;
  background: white;
  border-top: 1px solid #f1f5f9;
`;

export const KycActionBtn = styled.button<{ $primary?: boolean; $success?: boolean }>`
  flex: 1;
  min-width: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.4rem 0.55rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.6875rem;
  cursor: pointer;
  border: 1px solid
    ${({ $primary, $success }) => ($primary ? '#132E58' : $success ? '#059669' : '#e2e8f0')};
  background: ${({ $primary, $success }) => ($primary ? '#132E58' : $success ? '#059669' : 'white')};
  color: ${({ $primary, $success }) => ($primary || $success ? 'white' : '#132E58')};

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg { font-size: 0.75rem; flex-shrink: 0; }
`;

export const KycErrorNote = styled.div`
  padding: 0.45rem 0.65rem;
  font-size: 0.6875rem;
  color: #dc2626;
  background: #fef2f2;
  border-top: 1px solid #fecaca;
`;

export const KycEmptyZone = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  width: calc(100% - 1rem);
  height: calc(100% - 0.75rem);
  margin: 0.375rem 0.5rem;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  color: #64748b;
  text-align: center;
  padding: 0.5rem;
  transition: border-color 0.12s, background 0.12s;

  &:hover {
    border-color: #132E58;
    background: #f8fafc;
  }

  input { display: none; }

  svg {
    font-size: 1.125rem;
    color: #Fbbf24;
  }

  strong {
    color: #132E58;
    font-size: 0.6875rem;
    font-weight: 600;
  }

  span {
    font-size: 0.625rem;
    color: #94a3b8;
  }
`;

export const KycPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  width: calc(100% - 1rem);
  height: calc(100% - 0.75rem);
  margin: 0.375rem 0.5rem;
  border: 1px dashed #475569;
  border-radius: 6px;
  background: #0f172a;
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
  padding: 0.5rem;
  font-size: 0.6875rem;

  svg {
    font-size: 1.125rem;
    color: #Fbbf24;
  }
`;
