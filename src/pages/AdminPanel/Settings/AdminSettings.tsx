import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSettings, FiSave, FiGlobe, FiMail, FiShield, FiDatabase } from 'react-icons/fi';

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

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #132E58;
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
    border-color: #132E58;
    box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
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
`;

const Select = styled.select`
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  color: #132E58;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #132E58;
    box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
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

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'LegendPips',
    siteEmail: 'admin@legendpips.com',
    defaultLanguage: 'en',
    maintenanceMode: false,
    allowRegistrations: true,
  });

  return (
    <Container>
      <Header>
        <Title>Admin Settings</Title>
      </Header>

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
            onClick={() => {
              alert("Settings saved (frontend demo). API will be added later.");
            }}
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
            value={settings.maintenanceMode ? 'true' : 'false'}
            onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.value === 'true' })}
          >
            <option value="false">Disabled</option>
            <option value="true">Enabled</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>Allow New Registrations</Label>
          <Select
            value={settings.allowRegistrations ? 'true' : 'false'}
            onChange={(e) => setSettings({ ...settings, allowRegistrations: e.target.value === 'true' })}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
        </FormGroup>
        <ButtonGroup>
          <SaveButton
            onClick={() => {
              alert("Settings saved (frontend demo). API will be added later.");
            }}
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
            style={{ background: '#10b981' }}
            onClick={() => {
              alert("Backup is not connected yet. This is a frontend demo.");
            }}
          >
            <FiDatabase />
            Backup Database
          </SaveButton>
          <SaveButton
            style={{ background: '#ef4444' }}
            onClick={() => {
              alert("Clear cache is not connected yet. This is a frontend demo.");
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
