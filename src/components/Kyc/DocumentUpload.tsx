import React from 'react';
import styled from 'styled-components';
import { FiUpload, FiRefreshCw, FiCheck, FiFileText } from 'react-icons/fi';
import {
  KycUploadCard,
  KycUploadHeader,
  KycPreviewArea,
  KycStatusBadge,
  KycActions,
  KycActionBtn,
  KycEmptyZone,
} from './kycUploadStyles';

const PdfPreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  width: 100%;
  height: 100%;
  color: #475569;
  padding: 0.5rem;

  svg {
    font-size: 1.25rem;
    color: #Fbbf24;
  }

  span {
    font-size: 0.625rem;
    max-width: 95%;
    text-align: center;
    word-break: break-all;
    line-height: 1.3;
  }
`;

export interface DocumentUploadProps {
  label: string;
  hint?: string;
  accept?: string;
  value: File | null;
  previewUrl?: string | null;
  onChange: (file: File | null, previewUrl: string | null) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  hint,
  accept = 'image/*,.pdf',
  value,
  previewUrl,
  onChange,
}) => {
  const isPdf = value?.type === 'application/pdf';

  const handleFile = (file: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (!file) {
      onChange(null, null);
      return;
    }
    const url = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    onChange(file, url);
  };

  const clear = () => handleFile(null);

  return (
    <KycUploadCard>
      <KycUploadHeader>
        <div className="meta">
          <strong>{label}</strong>
          {hint && <span>{hint}</span>}
        </div>
      </KycUploadHeader>

      <KycPreviewArea>
        {value ? (
          <>
            {isPdf ? (
              <PdfPreview>
                <FiFileText />
                <span>{value.name}</span>
              </PdfPreview>
            ) : previewUrl ? (
              <img src={previewUrl} alt={label} />
            ) : null}
            <KycStatusBadge><FiCheck /> Uploaded</KycStatusBadge>
          </>
        ) : (
          <KycEmptyZone>
            <FiUpload />
            <strong>Click to upload</strong>
            <span>JPEG, PNG, WebP or PDF</span>
            <input
              type="file"
              accept={accept}
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
            />
          </KycEmptyZone>
        )}
      </KycPreviewArea>

      {value && (
        <KycActions>
          <KycActionBtn type="button" onClick={clear}>
            <FiRefreshCw /> Remove
          </KycActionBtn>
        </KycActions>
      )}
    </KycUploadCard>
  );
};

export default DocumentUpload;
