import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FiUser, FiEdit2, FiSave, FiX, FiCamera } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import { getMe } from '../../../services/authService';
import { updateMyProfile, uploadProfileAvatar, persistUser } from '../../../services/profileService';
import {
  PageWrap, PageHeader, PageSubtitle, PageTitle,
  ProfileBanner, ProfileAvatar, ProfileBannerInfo, AvatarUploadWrap, AvatarCameraBadge, AvatarChangeBtn, ReadOnlyInput,
  SectionCard, SectionHead, SectionBody,
  FormGrid, Field, TextArea, PrimaryButton, GhostButton, Pill,
  StatsGrid, StatCard, StatIconBox, StatBody, StatValue, StatLabel,
  ErrorBanner,
} from '../../../components/UserPanel/userUi';
import { useLocale } from '../../../contexts/LocaleContext';

const FieldHint = styled.span`
  font-size: 0.6875rem;
  color: #94a3b8;
  font-weight: 500;
`;

const Profile: React.FC = () => {
  const { t } = useLocale();
  const { user, setUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  useEffect(() => {
    getMe()
      .then(({ user: me }) => {
        setFormData({
          firstName: me.firstName,
          lastName: me.lastName,
          email: me.email,
          phone: me.phone || '',
          bio: me.bio || '',
        });
        setProfileImage(me.profileImage || '');
        setUser(me);
        persistUser(me);
      })
      .catch(() => undefined);
  }, [setUser]);

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : 'U';

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const updated = await updateMyProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        bio: formData.bio,
      });
      setUser(updated);
      persistUser(updated);
      setIsEditing(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
    });
    setIsEditing(false);
    setError('');
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    setError('');
    try {
      const updated = await uploadProfileAvatar(file);
      setProfileImage(updated.profileImage || '');
      setUser(updated);
      persistUser(updated);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle><FiUser /> {t("panel.pageProfile")}</PageTitle>
      </PageHeader>
      <ProfileBanner>
        <AvatarUploadWrap>
          <ProfileAvatar
            $image={profileImage || undefined}
            $clickable
            style={{ width: 64, height: 64, fontSize: '1.125rem', borderRadius: 12 }}
            role="button"
            tabIndex={0}
            title="Change profile photo"
            onClick={() => !uploadingPhoto && fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            {!profileImage && initials}
            <AvatarCameraBadge aria-hidden><FiCamera /></AvatarCameraBadge>
          </ProfileAvatar>
          <AvatarChangeBtn
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPhoto}
          >
            <FiCamera />
            {uploadingPhoto ? 'Uploading…' : 'Change photo'}
          </AvatarChangeBtn>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoSelect}
            aria-label="Upload profile photo"
          />
        </AvatarUploadWrap>
        <ProfileBannerInfo>
          <h2>{user ? `${user.firstName} ${user.lastName}` : 'User'}</h2>
          <p>{user?.email}</p>
        </ProfileBannerInfo>
        <Pill $variant="approved">{user?.role || 'Member'}</Pill>
        {!isEditing && (
          <GhostButton type="button" onClick={() => setIsEditing(true)} style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)' }}>
            <FiEdit2 /> Edit
          </GhostButton>
        )}
      </ProfileBanner>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <SectionCard>
        <SectionHead><h2><FiUser style={{ marginRight: 6 }} />Personal Information</h2></SectionHead>
        <SectionBody>
          <FormGrid>
            <Field>
              First Name
              <input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} disabled={!isEditing} />
            </Field>
            <Field>
              Last Name
              <input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} disabled={!isEditing} />
            </Field>
            <Field>
              Email
              <ReadOnlyInput type="email" value={formData.email} readOnly tabIndex={-1} />
              <FieldHint>Email cannot be changed</FieldHint>
            </Field>
            <Field>
              Phone
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={!isEditing} />
            </Field>
            <Field className="full">
              Bio
              <TextArea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} disabled={!isEditing} placeholder="Tell us about yourself…" />
            </Field>
          </FormGrid>
          {isEditing && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <PrimaryButton $sm type="button" onClick={handleSave} disabled={saving}>
                <FiSave /> {saving ? 'Saving…' : 'Save'}
              </PrimaryButton>
              <GhostButton $sm type="button" onClick={handleCancel} disabled={saving}><FiX /> Cancel</GhostButton>
            </div>
          )}
        </SectionBody>
      </SectionCard>

      <PageHeader style={{ marginTop: '0.5rem' }}>
        <PageSubtitle>Account overview</PageSubtitle>
      </PageHeader>
      <StatsGrid>
        <StatCard>
          <StatIconBox $color="#10b981"><FiUser /></StatIconBox>
          <StatBody><StatValue>—</StatValue><StatLabel>Signals</StatLabel></StatBody>
        </StatCard>
        <StatCard>
          <StatIconBox $color="#Fbbf24"><FiUser /></StatIconBox>
          <StatBody><StatValue>—</StatValue><StatLabel>Contests</StatLabel></StatBody>
        </StatCard>
        <StatCard>
          <StatIconBox $color="#3b82f6"><FiUser /></StatIconBox>
          <StatBody><StatValue>—</StatValue><StatLabel>Webinars</StatLabel></StatBody>
        </StatCard>
      </StatsGrid>
    </PageWrap>
  );
};

export default Profile;
