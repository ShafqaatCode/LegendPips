import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FiSettings, FiSave, FiGlobe, FiShield, FiDatabase } from "react-icons/fi";
import {
  fetchAdminPlatformSettings,
  saveAdminPlatformSettings,
  requestBackupNote,
  requestInvalidateCache,
  type PlatformSettings,
} from "../../../services/platformSettingsService";

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
  color: #132e58;
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
  color: #132e58;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: #fbbf24;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #132e58;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #132e58;
    box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  color: #132e58;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #132e58;
    box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const SaveButton = styled.button`
  background: #132e58;
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

  &:hover:not(:disabled) {
    background: #1a4a7a;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Status = styled.p`
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: #6b7280;
`;

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const s = await fetchAdminPlatformSettings();
        if (!cancelled) setSettings(s);
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Failed to load settings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = async (patch: Partial<PlatformSettings>) => {
    if (!settings) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const next = await saveAdminPlatformSettings(patch);
      setSettings(next);
      setMessage("Saved.");
    } catch (e: any) {
      setError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <Container>
        <Header>
          <Title>Admin Settings</Title>
        </Header>
        <Status>{error || "Loading settings…"}</Status>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Admin Settings</Title>
        <FiSettings style={{ display: "none" }} aria-hidden />
      </Header>

      {message && <Status style={{ color: "#059669" }}>{message}</Status>}
      {error && <Status style={{ color: "#b91c1c" }}>{error}</Status>}

      <SettingsSection>
        <SectionTitle>
          <FiGlobe />
          General Settings
        </SectionTitle>
        <FormGroup>
          <Label>Site Name</Label>
          <Input
            type="text"
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <Label>Admin Email</Label>
          <Input
            type="email"
            value={settings.siteEmail}
            onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <Label>Default Language</Label>
          <Select
            value={settings.defaultLanguage}
            onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </Select>
        </FormGroup>
        <ButtonGroup>
          <SaveButton
            type="button"
            disabled={saving}
            onClick={() =>
              persist({
                siteName: settings.siteName,
                siteEmail: settings.siteEmail,
                defaultLanguage: settings.defaultLanguage,
              })
            }
          >
            <FiSave />
            Save Changes
          </SaveButton>
        </ButtonGroup>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>
          <FiShield />
          Security Settings
        </SectionTitle>
        <FormGroup>
          <Label>Maintenance Mode</Label>
          <Select
            value={settings.maintenanceMode ? "true" : "false"}
            onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.value === "true" })}
          >
            <option value="false">Disabled</option>
            <option value="true">Enabled</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>Allow New Registrations</Label>
          <Select
            value={settings.allowRegistrations ? "true" : "false"}
            onChange={(e) => setSettings({ ...settings, allowRegistrations: e.target.value === "true" })}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
        </FormGroup>
        <ButtonGroup>
          <SaveButton
            type="button"
            disabled={saving}
            onClick={() =>
              persist({
                maintenanceMode: settings.maintenanceMode,
                allowRegistrations: settings.allowRegistrations,
              })
            }
          >
            <FiSave />
            Save Changes
          </SaveButton>
        </ButtonGroup>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>
          <FiDatabase />
          Database Management
        </SectionTitle>
        <ButtonGroup>
          <SaveButton
            style={{ background: "#10b981" }}
            type="button"
            disabled={saving}
            onClick={async () => {
              try {
                const msg = await requestBackupNote();
                alert(msg);
              } catch (e: any) {
                alert(e.message || "Request failed");
              }
            }}
          >
            <FiDatabase />
            Backup Database
          </SaveButton>
          <SaveButton
            style={{ background: "#ef4444" }}
            type="button"
            disabled={saving}
            onClick={async () => {
              try {
                const msg = await requestInvalidateCache();
                alert(msg);
              } catch (e: any) {
                alert(e.message || "Request failed");
              }
            }}
          >
            <FiDatabase />
            Clear Cache
          </SaveButton>
        </ButtonGroup>
      </SettingsSection>
    </Container>
  );
};

export default AdminSettings;
