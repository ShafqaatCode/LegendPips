import React, { useEffect, useState } from 'react';
import { FiCheck, FiClock, FiX, FiAlertCircle, FiShield } from 'react-icons/fi';
import LiveCameraCapture from '../../../components/Kyc/LiveCameraCapture';
import DocumentUpload from '../../../components/Kyc/DocumentUpload';
import {
  getMyKyc,
  submitKyc,
  KYC_STATUS_LABELS,
  DOCUMENT_LABELS,
  type KycData,
  type KycStatus,
  type KycDocumentType,
} from '../../../services/kycService';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle,
  SectionCard, SectionHead, SectionBody,
  ProgressTrack, ProgressStep, StatusHero, RejectionBox,
  InfoGrid, InfoRow, FormGrid, Field, DocGrid, DocCameraRow, DocPreviewGrid, DocPreviewItem,
  PrimaryButton, ErrorBanner, Pill,
} from '../../../components/UserPanel/userUi';

type CaptureState = { file: File | null; preview: string | null };
const emptyCapture = (): CaptureState => ({ file: null, preview: null });

const fmtDate = (d?: string) => (d ? new Date(d).toLocaleString() : '—');

const statusIcon = (status: KycStatus) => {
  if (status === 'approved') return <FiCheck />;
  if (status === 'pending') return <FiClock />;
  if (status === 'rejected') return <FiX />;
  return <FiAlertCircle />;
};

type StepState = 'done' | 'current' | 'upcoming' | 'failed';

function getStepStates(status: KycStatus): StepState[] {
  if (status === 'incomplete') return ['current', 'upcoming', 'upcoming', 'upcoming'];
  if (status === 'pending') return ['done', 'done', 'current', 'upcoming'];
  if (status === 'approved') return ['done', 'done', 'done', 'done'];
  if (status === 'rejected') return ['done', 'done', 'failed', 'upcoming'];
  return ['upcoming', 'upcoming', 'upcoming', 'upcoming'];
}

const STEPS = [
  { label: 'Profile', sub: 'Personal details' },
  { label: 'Documents', sub: 'ID & selfie' },
  { label: 'Review', sub: 'Admin check' },
  { label: 'Complete', sub: 'Verified' },
];

const KycVerification: React.FC = () => {
  const [kyc, setKyc] = useState<KycData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [idDocumentType, setIdDocumentType] = useState<'passport' | 'national_id' | 'drivers_license' | 'other'>('passport');
  const [idDocumentNumber, setIdDocumentNumber] = useState('');
  const [phone, setPhone] = useState('');

  const [identityFront, setIdentityFront] = useState<CaptureState>(emptyCapture());
  const [identityBack, setIdentityBack] = useState<CaptureState>(emptyCapture());
  const [proofOfAddress, setProofOfAddress] = useState<CaptureState>(emptyCapture());
  const [selfieWithId, setSelfieWithId] = useState<CaptureState>(emptyCapture());

  const canEdit = !kyc || kyc.kycStatus === 'incomplete' || kyc.kycStatus === 'rejected';

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyKyc();
        setKyc(data);
        if (data.kycProfile) {
          const p = data.kycProfile;
          if (p.dateOfBirth) setDateOfBirth(p.dateOfBirth.slice(0, 10));
          setNationality(p.nationality || '');
          setAddressLine1(p.addressLine1 || '');
          setAddressLine2(p.addressLine2 || '');
          setCity(p.city || '');
          setState(p.state || '');
          setCountry(p.country || '');
          setPostalCode(p.postalCode || '');
          if (p.idDocumentType) setIdDocumentType(p.idDocumentType);
          setIdDocumentNumber(p.idDocumentNumber || '');
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const setCapture = (
    setter: React.Dispatch<React.SetStateAction<CaptureState>>,
    prev: CaptureState
  ) => (file: File | null, preview: string | null) => {
    if (prev.preview && prev.preview !== preview) URL.revokeObjectURL(prev.preview);
    setter({ file, preview });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identityFront.file || !proofOfAddress.file || !selfieWithId.file) {
      setError('Please upload all required documents and capture your selfie before submitting.');
      return;
    }
    if (idDocumentType !== 'passport' && !identityBack.file) {
      setError('Please upload the back of your ID document.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitKyc({
        dateOfBirth, nationality, addressLine1, addressLine2,
        city, state, country, postalCode, idDocumentType, idDocumentNumber, phone,
        identityFront: identityFront.file,
        identityBack: identityBack.file || undefined,
        proofOfAddress: proofOfAddress.file,
        selfieWithId: selfieWithId.file,
      });
      setKyc({
        kycStatus: result.kycStatus,
        kycProfile: result.kycProfile,
        kycDocuments: result.kycDocuments,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageWrap>
        <PageSubtitle>Loading verification status…</PageSubtitle>
      </PageWrap>
    );
  }

  const status = kyc?.kycStatus || 'incomplete';
  const profile = kyc?.kycProfile;
  const stepStates = getStepStates(status);

  const statusMessage: Record<KycStatus, string> = {
    incomplete: 'Complete your profile and upload documents below to begin verification.',
    pending: 'Your submission is being reviewed by our team. This usually takes 1–2 business days.',
    approved: 'Congratulations — your identity has been verified. You now have full platform access.',
    rejected: 'Your submission was not approved. Please review the reason below and resubmit.',
  };

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle><FiShield /> Identity Verification</PageTitle>
        <PageSubtitle>
          Upload your ID and proof of address, then capture a live selfie holding your ID.
        </PageSubtitle>
      </PageHeader>

      <ProgressTrack>
        {STEPS.map((step, i) => (
          <ProgressStep key={step.label} $state={stepStates[i]}>
            <div className="dot">
              {stepStates[i] === 'done' ? <FiCheck /> :
               stepStates[i] === 'failed' ? <FiX /> : i + 1}
            </div>
            <div className="label">{step.label}</div>
            <div className="sub">{step.sub}</div>
          </ProgressStep>
        ))}
      </ProgressTrack>

      <StatusHero $variant={status}>
        <div className="icon">{statusIcon(status)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h3>{KYC_STATUS_LABELS[status]}</h3>
            <Pill $variant={status}>{status === 'approved' ? 'Active' : status}</Pill>
          </div>
          <p>{statusMessage[status]}</p>
          {status === 'rejected' && profile?.rejectionReason && (
            <RejectionBox>
              <strong>Reason for rejection</strong>
              <p>{profile.rejectionReason}</p>
            </RejectionBox>
          )}
        </div>
      </StatusHero>

      {(status === 'pending' || status === 'approved' || status === 'rejected') && profile && (
        <SectionCard>
          <SectionHead><h2>Submission Details</h2></SectionHead>
          <SectionBody>
            <InfoGrid>
              <InfoRow><span>Submitted</span><span>{fmtDate(profile.submittedAt)}</span></InfoRow>
              {profile.reviewedAt && (
                <InfoRow><span>Reviewed</span><span>{fmtDate(profile.reviewedAt)}</span></InfoRow>
              )}
              <InfoRow><span>Document type</span><span>{profile.idDocumentType?.replace(/_/g, ' ') || '—'}</span></InfoRow>
              <InfoRow><span>Nationality</span><span>{profile.nationality || '—'}</span></InfoRow>
            </InfoGrid>
          </SectionBody>
        </SectionCard>
      )}

      {kyc?.kycDocuments && kyc.kycDocuments.length > 0 && !canEdit && (
        <SectionCard>
          <SectionHead><h2>Submitted Documents</h2></SectionHead>
          <SectionBody>
            <DocPreviewGrid>
              {kyc.kycDocuments.map((doc) => (
                <DocPreviewItem key={doc.type} href={doc.url} target="_blank" rel="noopener noreferrer">
                  {doc.url.toLowerCase().includes('.pdf') ? (
                    <div style={{ height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', fontSize: '0.6875rem' }}>PDF</div>
                  ) : (
                    <img src={doc.url} alt={DOCUMENT_LABELS[doc.type as KycDocumentType]} />
                  )}
                  <div>{DOCUMENT_LABELS[doc.type as KycDocumentType]}</div>
                </DocPreviewItem>
              ))}
            </DocPreviewGrid>
          </SectionBody>
        </SectionCard>
      )}

      {status === 'approved' && profile && (
        <SectionCard>
          <SectionHead><h2>Verified Profile</h2></SectionHead>
          <SectionBody>
            <InfoGrid>
              <InfoRow><span>ID number</span><span>{profile.idDocumentNumber ? `•••• ${profile.idDocumentNumber.slice(-4)}` : '—'}</span></InfoRow>
              <InfoRow><span>Date of birth</span><span>{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : '—'}</span></InfoRow>
              <InfoRow><span>Address</span><span>{[profile.addressLine1, profile.city, profile.country].filter(Boolean).join(', ') || '—'}</span></InfoRow>
              <InfoRow><span>Status</span><span style={{ color: '#059669' }}>Verified member</span></InfoRow>
            </InfoGrid>
          </SectionBody>
        </SectionCard>
      )}

      {canEdit && (
        <form onSubmit={handleSubmit}>
          <SectionCard>
            <SectionHead><h2>Personal Information</h2></SectionHead>
            <SectionBody>
              <FormGrid>
                <Field>
                  Date of Birth
                  <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
                </Field>
                <Field>
                  Nationality
                  <input value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="e.g. United States" required />
                </Field>
                <Field>
                  Phone
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" />
                </Field>
                <Field>
                  ID Document Type
                  <select value={idDocumentType} onChange={(e) => setIdDocumentType(e.target.value as typeof idDocumentType)} required>
                    <option value="passport">Passport</option>
                    <option value="national_id">National ID Card</option>
                    <option value="drivers_license">Driver&apos;s License</option>
                    <option value="other">Other Government ID</option>
                  </select>
                </Field>
                <Field className="full">
                  ID Document Number
                  <input value={idDocumentNumber} onChange={(e) => setIdDocumentNumber(e.target.value)} required />
                </Field>
              </FormGrid>
            </SectionBody>
          </SectionCard>

          <SectionCard>
            <SectionHead><h2>Residential Address</h2></SectionHead>
            <SectionBody>
              <FormGrid>
                <Field className="full">
                  Address Line 1
                  <input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} required />
                </Field>
                <Field className="full">
                  Address Line 2 (optional)
                  <input value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
                </Field>
                <Field>
                  City
                  <input value={city} onChange={(e) => setCity(e.target.value)} required />
                </Field>
                <Field>
                  State / Province
                  <input value={state} onChange={(e) => setState(e.target.value)} />
                </Field>
                <Field>
                  Country
                  <input value={country} onChange={(e) => setCountry(e.target.value)} required />
                </Field>
                <Field>
                  Postal Code
                  <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                </Field>
              </FormGrid>
            </SectionBody>
          </SectionCard>

          <SectionCard>
            <SectionHead><h2>Documents</h2></SectionHead>
            <SectionBody>
              <PageSubtitle style={{ marginBottom: '0.75rem' }}>
                Upload ID and proof of address (JPEG, PNG, WebP, or PDF). Selfie must be captured live with your camera.
              </PageSubtitle>
              <DocGrid>
                <DocumentUpload
                  label="ID Document (Front) *"
                  hint="Passport, national ID, or driver's license"
                  value={identityFront.file}
                  previewUrl={identityFront.preview}
                  onChange={setCapture(setIdentityFront, identityFront)}
                />
                {idDocumentType !== 'passport' && (
                  <DocumentUpload
                    label="ID Document (Back) *"
                    hint="Back side of your ID card"
                    value={identityBack.file}
                    previewUrl={identityBack.preview}
                    onChange={setCapture(setIdentityBack, identityBack)}
                  />
                )}
                <DocumentUpload
                  label="Proof of Address *"
                  hint="Utility bill, bank statement, or gov letter"
                  value={proofOfAddress.file}
                  previewUrl={proofOfAddress.preview}
                  onChange={setCapture(setProofOfAddress, proofOfAddress)}
                />
                <DocCameraRow>
                  <LiveCameraCapture
                    label="Selfie Holding ID *"
                    hint="Your face and ID must both be visible — live camera only"
                    fileName="selfie-with-id"
                    facingMode="user"
                    value={selfieWithId.file}
                    previewUrl={selfieWithId.preview}
                    onChange={setCapture(setSelfieWithId, selfieWithId)}
                  />
                </DocCameraRow>
              </DocGrid>
            </SectionBody>
          </SectionCard>

          {error && <ErrorBanner>{error}</ErrorBanner>}
          <PrimaryButton type="submit" disabled={submitting} style={{ width: '100%' }}>
            {submitting ? 'Submitting…' : status === 'rejected' ? 'Resubmit Verification' : 'Submit for Review'}
          </PrimaryButton>
        </form>
      )}
    </PageWrap>
  );
};

export default KycVerification;
