import React, { useState } from 'react';
import styled from 'styled-components';
import { FiUser, FiMail, FiPhone, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';

const ProfileContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #132E58 0%, #1a4a7a 100%);
  border-radius: 16px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1.5rem;
  }
`;

const AvatarLarge = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #Fbbf24 0%, #f4b400 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  color: #132E58;
  border: 4px solid white;
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const ProfileEmail = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0 0 0.5rem 0;
`;

const ProfileRole = styled.span`
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const EditButton = styled.button`
  background: #Fbbf24;
  color: #132E58;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f4b400;
    transform: translateY(-2px);
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #132E58;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: #Fbbf24;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #132E58;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #132E58;
    box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.1);
  }
  
  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #132E58;
    box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.1);
  }
  
  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SaveButton = styled.button`
  background: #132E58;
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #1a4a7a;
    transform: translateY(-2px);
  }
`;

const CancelButton = styled.button`
  background: white;
  color: #132E58;
  border: 2px solid #e5e7eb;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f9fafb;
    border-color: #132E58;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const StatCard = styled.div`
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #132E58;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: 'Experienced trader with 5+ years in Forex and Crypto markets.',
  });

  const handleSave = () => {
    // TODO: API call to save profile
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: 'Experienced trader with 5+ years in Forex and Crypto markets.',
    });
    setIsEditing(false);
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <AvatarLarge>
          {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
        </AvatarLarge>
        <ProfileInfo>
          <ProfileName>
            {user ? `${user.firstName} ${user.lastName}` : 'User'}
          </ProfileName>
          <ProfileEmail>{user?.email || 'user@example.com'}</ProfileEmail>
          <ProfileRole>{user?.role || 'Trader'}</ProfileRole>
        </ProfileInfo>
        {!isEditing && (
          <EditButton onClick={() => setIsEditing(true)}>
            <FiEdit2 />
            Edit Profile
          </EditButton>
        )}
      </ProfileHeader>

      <Section>
        <SectionTitle>
          <FiUser />
          Personal Information
        </SectionTitle>
        <FormGrid>
          <FormGroup>
            <Label>First Name</Label>
            <Input
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              disabled={!isEditing}
            />
          </FormGroup>
          <FormGroup>
            <Label>Last Name</Label>
            <Input
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              disabled={!isEditing}
            />
          </FormGroup>
          <FormGroup>
            <Label>Email Address</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
            />
          </FormGroup>
          <FormGroup>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
            />
          </FormGroup>
        </FormGrid>
        <FormGroup style={{ marginTop: '1.5rem' }}>
          <Label>Bio</Label>
          <TextArea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            disabled={!isEditing}
            placeholder="Tell us about yourself..."
          />
        </FormGroup>
        {isEditing && (
          <ButtonGroup>
            <SaveButton onClick={handleSave}>
              <FiSave />
              Save Changes
            </SaveButton>
            <CancelButton onClick={handleCancel}>
              <FiX />
              Cancel
            </CancelButton>
          </ButtonGroup>
        )}
      </Section>

      <Section>
        <SectionTitle>
          <FiUser />
          Account Statistics
        </SectionTitle>
        <StatsGrid>
          <StatCard>
            <StatValue>127</StatValue>
            <StatLabel>Total Signals</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>5</StatValue>
            <StatLabel>Active Contests</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>23</StatValue>
            <StatLabel>Webinars Watched</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>8</StatValue>
            <StatLabel>Courses Completed</StatLabel>
          </StatCard>
        </StatsGrid>
      </Section>
    </ProfileContainer>
  );
};

export default Profile;
