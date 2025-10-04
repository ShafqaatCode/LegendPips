import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronDown } from 'lucide-react';

export default function LiveAccountSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    accountName: '',
    accountNumber: '',
    accountType: '',
    tradingPlatform: '',
    jurisdiction: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    alert('Account submitted successfully!');
    console.log('Form data:', formData);
  };

  return (
    <Wrapper>
      <Container>
        <Header>IC Markets Live Account Setup</Header>

        <ProgressContainer>
          <StepsWrapper>
            {[1, 2, 3].map((step, index) => (
              <React.Fragment key={step}>
                <StepCircleWrapper>
                  <StepCircle active={currentStep >= step}>
                    {step}
                  </StepCircle>
                  <StepLabel>Step</StepLabel>
                </StepCircleWrapper>
                {index < 2 && (
                  <ProgressLine active={currentStep > step} />
                )}
              </React.Fragment>
            ))}
          </StepsWrapper>
        </ProgressContainer>

        {currentStep >= 1 && (
          <Card>
            <BrokerInfoSection>
              <LogoBox>
                <LogoText>XM</LogoText>
              </LogoBox>
              <BrokerContent>
                <BrokerHeader>
                  <BrokerTitle>XM MARKET</BrokerTitle>
                  <DetailButton>Detailed Broker</DetailButton>
                </BrokerHeader>
                <FeatureList>
                  <li>• Regulated in multiple jurisdictions globally</li>
                  <li>• Spreads from 0.0 pips</li>
                  <li>• 50+ tradable instruments worldwide</li>
                </FeatureList>
                <BrokerDescription>
                  Trade 1,000+ instruments including Forex, CFDs, Commodities, Indices, Stocks & Cryptocurrencies
                </BrokerDescription>
              </BrokerContent>
            </BrokerInfoSection>

            <StepBadge>Step 1</StepBadge>

            <InfoBox>
              <InfoTitle>
                Start Your Live Trading Journey with XM MARKETS
              </InfoTitle>
              <OpenAccountButton onClick={() => setCurrentStep(2)}>
                Open Account
              </OpenAccountButton>
              <NotesList>
                <li>• Existing XM profiles or accounts are not eligible for this offer. Please create a new profile using the button above.</li>
                <li>• Even if your profile is already assigned to our IB, you will still need to open additional accounts through the referral link provided above.</li>
                <li>• If you don't have an IB linked yet, just enter your account number in Step 2 to connect with our IB group.</li>
              </NotesList>
            </InfoBox>
          </Card>
        )}

        {currentStep >= 2 && (
          <Card>
            <StepBadge>Step 2</StepBadge>

            <SectionTitle>
              Enter your Live XM Account Number
            </SectionTitle>

            <FormGrid>
              <FormField>
                <Label>Account Name</Label>
                <Input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  placeholder="Enter account name"
                />
              </FormField>
              <FormField>
                <Label>Account Number</Label>
                <Input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  placeholder="Enter account number"
                />
              </FormField>
            </FormGrid>

            <FormGrid>
              <FormField>
                <Label>Account Type</Label>
                <SelectWrapper>
                  <Select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value="standard">Standard</option>
                    <option value="micro">Micro</option>
                    <option value="zero">Zero</option>
                  </Select>
                  <ChevronDown size={20} />
                </SelectWrapper>
              </FormField>
              <FormField>
                <Label>Trading Platform</Label>
                <SelectWrapper>
                  <Select
                    name="tradingPlatform"
                    value={formData.tradingPlatform}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value="mt4">MT4</option>
                    <option value="mt5">MT5</option>
                    <option value="ctrader">cTrader</option>
                  </Select>
                  <ChevronDown size={20} />
                </SelectWrapper>
              </FormField>
            </FormGrid>

            <FormField style={{ marginBottom: '1.5rem' }}>
              <Label>Jurisdiction</Label>
              <SelectWrapper style={{ maxWidth: '50%' }}>
                <Select
                  name="jurisdiction"
                  value={formData.jurisdiction}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="global">Global</option>
                  <option value="eu">European Union</option>
                  <option value="uk">United Kingdom</option>
                  <option value="aus">Australia</option>
                </Select>
                <ChevronDown size={20} />
              </SelectWrapper>
            </FormField>

            <TermsText>
              I understand and accept the{' '}
              <TermsLink>Terms and Conditions</TermsLink>
            </TermsText>

            <ContinueButton onClick={() => setCurrentStep(3)}>
              Continue to Step 3
            </ContinueButton>
          </Card>
        )}

        {currentStep >= 3 && (
          <Card>
            <StepBadge>Step 3</StepBadge>

            <SectionTitle>Submit Your Account</SectionTitle>

            <SubmitButton onClick={handleSubmit}>
              Submit
            </SubmitButton>
          </Card>
        )}
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const ProgressContainer = styled.div`
  position: relative;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const StepsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StepCircleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
`;

const StepCircle = styled.div<{ active: boolean }>`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  background-color: ${props => props.active ? '#f59e0b' : '#d1d5db'};
  color: ${props => props.active ? '#ffffff' : '#6b7280'};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
`;

const StepLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const ProgressLine = styled.div<{ active: boolean }>`
  flex: 1;
  height: 4px;
  margin: 0 1rem;
  margin-top: -2rem;
  background-color: ${props => props.active ? '#f59e0b' : '#d1d5db'};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    margin: 0 0.5rem;
    margin-top: -1.5rem;
  }
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const BrokerInfoSection = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const LogoBox = styled.div`
  width: 6rem;
  height: 6rem;
  background-color: #000000;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const LogoText = styled.div`
  color: #ffffff;
  font-weight: 700;
  font-size: 1.5rem;
`;

const BrokerContent = styled.div`
  flex: 1;
`;

const BrokerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const BrokerTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #f59e0b;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const DetailButton = styled.button`
  background-color: #2563eb;
  color: #ffffff;
  padding: 0.25rem 1rem;
  border-radius: 0.25rem;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: #374151;

  li {
    margin-bottom: 0.25rem;
  }
`;

const BrokerDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

const StepBadge = styled.div`
  display: inline-block;
  background-color: #f3f4f6;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 1.5rem;
`;

const InfoBox = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const InfoTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const OpenAccountButton = styled.button`
  background-color: #1f2937;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background-color 0.2s;
  width: 100%;

  &:hover {
    background-color: #374151;
  }

  @media (min-width: 640px) {
    width: auto;
  }
`;

const NotesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;

  li {
    margin-bottom: 0.5rem;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #1f2937;
  color: #ffffff;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  outline: none;

  &:focus {
    ring: 2px;
    ring-color: #3b82f6;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;

  svg {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #ffffff;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    max-width: 100% !important;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #1f2937;
  color: #ffffff;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  outline: none;
  appearance: none;
  cursor: pointer;

  &:focus {
    ring: 2px;
    ring-color: #3b82f6;
  }

  option {
    background-color: #1f2937;
    color: #ffffff;
  }
`;

const TermsText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
`;

const TermsLink = styled.span`
  color: #f59e0b;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ContinueButton = styled.button`
  background-color: #1f2937;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;

  &:hover {
    background-color: #374151;
  }

  @media (min-width: 640px) {
    width: auto;
  }
`;

const SubmitButton = styled.button`
  background-color: #1f2937;
  color: #ffffff;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;

  &:hover {
    background-color: #374151;
  }

  @media (min-width: 640px) {
    width: auto;
  }
`;