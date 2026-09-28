import React, { useEffect, useState } from 'react';
import { FiSettings, FiBell, FiShield, FiGlobe } from 'react-icons/fi';
import {
  PageWrap, PageHeader, PageTitle, PageSubtitle,
  SectionCard, SectionHead, SectionBody,
  SettingRow, Toggle, SelectCompact, PrimaryButton,
  ErrorBanner,
} from '../../../components/UserPanel/userUi';
import { LOCALES } from '../../../i18n/locales';
import { useLocale } from '../../../contexts/LocaleContext';
import {
  fetchNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences,
} from '../../../services/notificationService';

const Settings: React.FC = () => {
  const { locale, setLocale, t } = useLocale();
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    email: true, push: false, signals: true, contests: true, webinars: true, priceAlerts: true,
  });
  const [privacy, setPrivacy] = useState({ profileVisible: true, showEmail: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchNotificationPreferences()
      .then(setNotifications)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load preferences'))
      .finally(() => setLoaded(true));
  }, []);

  const savePref = async (key: keyof NotificationPreferences, value: boolean) => {
    const next = { ...notifications, [key]: value };
    setNotifications(next);
    setSaving(true);
    setError(null);
    try {
      const saved = await updateNotificationPreferences({ [key]: value });
      setNotifications(saved);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
      setNotifications(notifications);
    } finally {
      setSaving(false);
    }
  };

  const notifRow = (key: keyof NotificationPreferences, label: string, desc: string) => (
    <SettingRow key={key}>
      <div><h4>{label}</h4><p>{desc}</p></div>
      <Toggle>
        <input
          type="checkbox"
          checked={notifications[key]}
          disabled={!loaded || saving}
          onChange={(e) => void savePref(key, e.target.checked)}
        />
        <span />
      </Toggle>
    </SettingRow>
  );

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle><FiSettings /> {t('settings.title')}</PageTitle>
        <PageSubtitle>{t('settings.subtitle')}</PageSubtitle>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <SectionCard>
        <SectionHead><h2><FiBell style={{ marginRight: 6 }} />Notifications</h2></SectionHead>
        <SectionBody>
          {notifRow('email', 'Email notifications', 'Receive updates via email')}
          {notifRow('push', 'Push notifications', 'Browser push alerts (coming soon)')}
          {notifRow('signals', 'Signal alerts', 'New trading signals')}
          {notifRow('contests', 'Contest updates', 'Rankings and results')}
          {notifRow('webinars', 'Webinar reminders', 'Upcoming sessions')}
          {notifRow('priceAlerts', 'Price alerts', 'When your watchlist targets are hit')}
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
            <div><h4>{t('settings.language')}</h4><p>{t('settings.languageHint')}</p></div>
            <SelectCompact value={locale} onChange={(e) => setLocale(e.target.value as typeof locale)}>
              {LOCALES.map((l) => (
                <option key={l.code} value={l.code}>{l.native}</option>
              ))}
            </SelectCompact>
          </SettingRow>
        </SectionBody>
      </SectionCard>
    </PageWrap>
  );
};

export default Settings;
