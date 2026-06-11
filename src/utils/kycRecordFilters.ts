export type KycRecordPresetId = '' | 'pending' | 'approved' | 'rejected';

export interface KycRecordPreset {
  id: KycRecordPresetId;
  label: string;
  title: string;
  subtitle: string;
  params: {
    kycStatus?: string;
    kycScope?: 'submitted';
  };
}

export const KYC_RECORD_PRESETS: KycRecordPreset[] = [
  {
    id: '',
    label: 'All KYC Records',
    title: 'All KYC Records',
    subtitle: 'Every submitted identity verification request',
    params: { kycScope: 'submitted' },
  },
  {
    id: 'pending',
    label: 'Pending',
    title: 'Pending KYC',
    subtitle: 'Submissions awaiting admin review',
    params: { kycStatus: 'pending' },
  },
  {
    id: 'approved',
    label: 'Approved',
    title: 'Approved KYC',
    subtitle: 'Verified users with approved documents',
    params: { kycStatus: 'approved' },
  },
  {
    id: 'rejected',
    label: 'Rejected',
    title: 'Rejected KYC',
    subtitle: 'Submissions that were declined',
    params: { kycStatus: 'rejected' },
  },
];

export const getKycRecordPreset = (id: string | null): KycRecordPreset =>
  KYC_RECORD_PRESETS.find((p) => p.id === (id || '')) || KYC_RECORD_PRESETS[0];
