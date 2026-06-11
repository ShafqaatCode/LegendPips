export type UserListPresetId =
  | ''
  | 'kyc-verified'
  | 'kyc-pending'
  | 'email-verified'
  | 'active'
  | 'banned';

export interface UserListPreset {
  id: UserListPresetId;
  label: string;
  title: string;
  subtitle: string;
  params: {
    kycStatus?: string;
    status?: string;
    emailVerified?: string;
    role?: string;
  };
}

export const USER_LIST_PRESETS: UserListPreset[] = [
  {
    id: '',
    label: 'All Users',
    title: 'All Users',
    subtitle: 'Complete list of registered accounts',
    params: {},
  },
  {
    id: 'kyc-verified',
    label: 'KYC Verified',
    title: 'KYC Verified Users',
    subtitle: 'Users with approved identity verification',
    params: { kycStatus: 'approved' },
  },
  {
    id: 'kyc-pending',
    label: 'KYC Pending',
    title: 'Pending KYC Review',
    subtitle: 'Users waiting for document verification',
    params: { kycStatus: 'pending' },
  },
  {
    id: 'email-verified',
    label: 'Email Verified',
    title: 'Email Verified Users',
    subtitle: 'Users who completed email verification at registration',
    params: { emailVerified: 'true' },
  },
  {
    id: 'active',
    label: 'Active Users',
    title: 'Active Users',
    subtitle: 'Accounts in good standing with platform access',
    params: { status: 'active' },
  },
  {
    id: 'banned',
    label: 'Banned Users',
    title: 'Banned Users',
    subtitle: 'Accounts blocked from the platform',
    params: { status: 'blocked' },
  },
];

export const getUserListPreset = (id: string | null): UserListPreset =>
  USER_LIST_PRESETS.find((p) => p.id === (id || '')) || USER_LIST_PRESETS[0];
