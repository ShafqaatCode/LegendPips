import React, { useState } from 'react';
import { FiSettings, FiBell, FiShield, FiGlobe } from 'react-icons/fi';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle,
  SectionCard, SectionHead, SectionBody,
  SettingRow, Toggle, SelectCompact, PrimaryButton,
} from '../../../components/UserPanel/userUi';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true, push: false, signals: true, contests: true, webinars: true,
  });
  const [privacy, setPrivacy] = useState({ profileVisible: true, showEmail: false });
  const [language, setLanguage] = useState('en');

  const notifRow = (key: keyof typeof notifications, label: string, desc: string) => (
    <SettingRow key={key}>
      <div><h4>{label}</h4><p>{desc}</p></div>
      <Toggle>
        <input type="checkbox" checked={notifications[key]} onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })} />
        <span />
      </Toggle>
    </SettingRow>
  );

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle><FiSettings /> Settings</PageTitle>
        <PageSubtitle>Notifications, privacy, and preferences</PageSubtitle>
      </PageHeader>

      <SectionCard>
        <SectionHead><h2><FiBell style={{ marginRight: 6 }} />Notifications</h2></SectionHead>
        <SectionBody>
          {notifRow('email', 'Email notifications', 'Receive updates via email')}
          {notifRow('push', 'Push notifications', 'Browser push alerts')}
          {notifRow('signals', 'Signal alerts', 'New trading signals')}
          {notifRow('contests', 'Contest updates', 'Rankings and results')}
          {notifRow('webinars', 'Webinar reminders', 'Upcoming sessions')}
        </SectionBody>
      </SectionCard>

      <SectionCard>
        <SectionHead><h2><FiShield style={{ marginRight: 6 }} />Privacy & Security</h2></SectionHead>
        <SectionBody>
          <SettingRow>
            <div><h4>Public profile</h4><p>Allow others to view your profile</p></div>
            <Toggle>
              <input type="checkbox" checked={privacy.profileVisible} onChange={(e) => setPrivacy({ ...privacy, profileVisible: e.target.checked })} />
              <span />
            </Toggle>
          </SettingRow>
          <SettingRow>
            <div><h4>Show email</h4><p>Display email on public profile</p></div>
            <Toggle>
              <input type="checkbox" checked={privacy.showEmail} onChange={(e) => setPrivacy({ ...privacy, showEmail: e.target.checked })} />
              <span />
            </Toggle>
          </SettingRow>
          <SettingRow>
            <div><h4>Password</h4><p>Update your account password</p></div>
            <PrimaryButton $sm type="button">Change</PrimaryButton>
          </SettingRow>
        </SectionBody>
      </SectionCard>

      <SectionCard>
        <SectionHead><h2><FiGlobe style={{ marginRight: 6 }} />Preferences</h2></SectionHead>
        <SectionBody>
          <SettingRow>
            <div><h4>Language</h4><p>Preferred display language</p></div>
            <SelectCompact value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </SelectCompact>
          </SettingRow>
        </SectionBody>
      </SectionCard>
    </PageWrap>
  );
};

export default Settings;
