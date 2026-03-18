import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSettings, FiBell, FiLock, FiShield, FiMail, FiGlobe } from 'react-icons/fi';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #132E58;
  margin: 0;
`;

const SettingsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #132E58;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: #Fbbf24;
  }
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 0;
  border-bottom: 1px solid #e5e7eb;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingLabel = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #132E58;
  margin: 0 0 0.25rem 0;
`;

const SettingDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
    
    &:checked + span {
      background: #132E58;
      
      &:before {
        transform: translateX(24px);
      }
    }
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #d1d5db;
    transition: 0.3s;
    border-radius: 28px;
    
    &:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 4px;
      bottom: 4px;
      background: white;
      transition: 0.3s;
      border-radius: 50%;
    }
  }
`;

const Select = styled.select`
  padding: 0.625rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #132E58;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #132E58;
  }
`;

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    signals: true,
    contests: true,
    webinars: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
  });

  const [language, setLanguage] = useState('en');

  return (
    <Container>
      <Header>
        <Title>Settings</Title>
      </Header>

      <SettingsSection>
        <SectionTitle>
          <FiBell />
          Notifications
        </SectionTitle>
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Email Notifications</SettingLabel>
            <SettingDescription>Receive notifications via email</SettingDescription>
          </SettingInfo>
          <Toggle>
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
            />
            <span />
          </Toggle>
        </SettingItem>
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Push Notifications</SettingLabel>
            <SettingDescription>Receive browser push notifications</SettingDescription>
          </SettingInfo>
          <Toggle>
            <input
              type="checkbox"
              checked={notifications.push}
              onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
            />
            <span />
          </Toggle>
        </SettingItem>
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Signal Alerts</SettingLabel>
            <SettingDescription>Get notified about new trading signals</SettingDescription>
          </SettingInfo>
          <Toggle>
            <input
              type="checkbox"
              checked={notifications.signals}
              onChange={(e) => setNotifications({ ...notifications, signals: e.target.checked })}
            />
            <span />
          </Toggle>
        </SettingItem>
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Contest Updates</SettingLabel>
            <SettingDescription>Notifications about contest rankings and results</SettingDescription>
          </SettingInfo>
          <Toggle>
            <input
              type="checkbox"
              checked={notifications.contests}
              onChange={(e) => setNotifications({ ...notifications, contests: e.target.checked })}
            />
            <span />
          </Toggle>
        </SettingItem>
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Webinar Reminders</SettingLabel>
            <SettingDescription>Reminders for upcoming webinars</SettingDescription>
          </SettingInfo>
          <Toggle>
            <input
              type="checkbox"
              checked={notifications.webinars}
              onChange={(e) => setNotifications({ ...notifications, webinars: e.target.checked })}
            />
            <span />
          </Toggle>
        </SettingItem>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>
          <FiShield />
          Privacy & Security
        </SectionTitle>
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Public Profile</SettingLabel>
            <SettingDescription>Allow others to view your profile</SettingDescription>
          </SettingInfo>
          <Toggle>
            <input
              type="checkbox"
              checked={privacy.profileVisible}
              onChange={(e) => setPrivacy({ ...privacy, profileVisible: e.target.checked })}
            />
            <span />
          </Toggle>
        </SettingItem>
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Show Email</SettingLabel>
            <SettingDescription>Display your email on your public profile</SettingDescription>
          </SettingInfo>
          <Toggle>
            <input
              type="checkbox"
              checked={privacy.showEmail}
              onChange={(e) => setPrivacy({ ...privacy, showEmail: e.target.checked })}
            />
            <span />
          </Toggle>
        </SettingItem>
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Change Password</SettingLabel>
            <SettingDescription>Update your account password</SettingDescription>
          </SettingInfo>
          <button style={{
            padding: '0.625rem 1.5rem',
            background: '#132E58',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            Change Password
          </button>
        </SettingItem>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>
          <FiGlobe />
          Preferences
        </SectionTitle>
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Language</SettingLabel>
            <SettingDescription>Choose your preferred language</SettingDescription>
          </SettingInfo>
          <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </Select>
        </SettingItem>
      </SettingsSection>
    </Container>
  );
};

export default Settings;
