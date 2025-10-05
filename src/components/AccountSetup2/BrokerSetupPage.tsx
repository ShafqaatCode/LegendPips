import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronDown, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import type { Broker } from './BrokerListingPage';

type BrokerSetupPageProps = {
  broker: Broker;
  onBack: () => void;
};

const BrokerSetupPage: React.FC<BrokerSetupPageProps> = ({ broker, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    accountName: '',
    accountNumber: '',
    accountType: '',
    tradingPlatform: '',
    jurisdiction: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep2 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    }
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^\d+$/.test(formData.accountNumber)) {
      newErrors.accountNumber = 'Account number must contain only digits';
    }
    if (!formData.accountType) {
      newErrors.accountType = 'Please select account type';
    }
    if (!formData.tradingPlatform) {
      newErrors.tradingPlatform = 'Please select trading platform';
    }
    if (!formData.jurisdiction) {
      newErrors.jurisdiction = 'Please select jurisdiction';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToStep3 = () => {
    if (validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    setLoading(false);
    setSubmitted(true);
    console.log('Submitted form:', { broker: broker.name, ...formData });
  };

  const goToStep = (step: number) => {
    if (step < currentStep || step === 1) {
      setCurrentStep(step);
    }
  };

  const getLogoColor = (id: string): string => {
    const colors: { [key: string]: string } = {
      '1': '#10b981',
      '2': '#ef4444',
      '3': '#f59e0b',
      '4': '#3b82f6',
      '5': '#8b5cf6',
    };
    return colors[id] || '#6b7280';
  };

  return (
    <PageWrapper>
      <Container>
        <BackButton onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Broker Details
        </BackButton>

        <Header>{broker.name} Live Account Setup</Header>

        <ProgressContainer>
          <StepsWrapper>
            {[1, 2, 3].map((step, index) => (
              <React.Fragment key={step}>
                <StepCircleWrapper>
                  <StepCircle
                    $active={currentStep >= step}
                    $clickable={step < currentStep}
                    onClick={() => goToStep(step)}
                  >
                    {step}
                  </StepCircle>
                  <StepLabel>Step</StepLabel>
                </StepCircleWrapper>
                {index < 2 && <ProgressLine $active={currentStep > step} />}
              </React.Fragment>
            ))}
          </StepsWrapper>
        </ProgressContainer>

        {currentStep === 1 && (
          <Card>
            <BrokerSetupHeader>
              <SetupLogoBadge color={getLogoColor(broker.id)}>
                {/* {broker.logo} */}
                <img src={broker.logo} alt="broker logo" />
              </SetupLogoBadge>
              <div>
                <SetupBrokerTitle>{broker.name}</SetupBrokerTitle>
                {broker.verified && <SetupVerified>Verified Broker</SetupVerified>}
                <SetupFeatures>
                  {broker.features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </SetupFeatures>
                <SetupDescription>{broker.description}</SetupDescription>
              </div>
            </BrokerSetupHeader>

            <StepBadge>Step 1</StepBadge>
            <InfoBox>
              <InfoTitle>Start Your Live Trading Journey with {broker.name}</InfoTitle>
              <PrimaryButton onClick={() => setCurrentStep(2)}>
                Start Trading
              </PrimaryButton>
              <NotesList>
                <li>• Based in the EU, Brazil, the UK, or Australia? Please start your journey by opening an account with {broker.name}.</li>
                <li>• If your live account is already connected to another IB, simply open a new one with a different email through the link above.</li>
                <li>• If you don't have an IB linked yet, just enter your account number in Step 2 to connect with our IB group.</li>
              </NotesList>
            </InfoBox>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <StepBadge>Step 2</StepBadge>
            <SectionTitle>Enter your Live {broker.name} Account Number</SectionTitle>

            <FormGrid>
              <FormField>
                <Label>
                  Account Name <Required>*</Required>
                </Label>
                <Input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  placeholder="Enter account name"
                  $hasError={!!errors.accountName}
                />
                {errors.accountName && <ErrorText>{errors.accountName}</ErrorText>}
              </FormField>

              <FormField>
                <Label>
                  Account Number <Required>*</Required>
                </Label>
                <Input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  placeholder="Enter account number"
                  $hasError={!!errors.accountNumber}
                />
                {errors.accountNumber && <ErrorText>{errors.accountNumber}</ErrorText>}
              </FormField>
            </FormGrid>

            <FormGrid>
              <FormField>
                <Label>
                  Account Type <Required>*</Required>
                </Label>
                <SelectWrapper>
                  <Select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleInputChange}
                    $hasError={!!errors.accountType}
                  >
                    <option value="">Select</option>
                    <option value="standard">Standard</option>
                    <option value="micro">Micro</option>
                    <option value="zero">Zero</option>
                    <option value="raw">Raw Spread</option>
                  </Select>
                  <IconWrapper>
                    <ChevronDown size={20} />
                  </IconWrapper>
                </SelectWrapper>
                {errors.accountType && <ErrorText>{errors.accountType}</ErrorText>}
              </FormField>

              <FormField>
                <Label>
                  Trading Platform <Required>*</Required>
                </Label>
                <SelectWrapper>
                  <Select
                    name="tradingPlatform"
                    value={formData.tradingPlatform}
                    onChange={handleInputChange}
                    $hasError={!!errors.tradingPlatform}
                  >
                    <option value="">Select</option>
                    <option value="mt4">MT4</option>
                    <option value="mt5">MT5</option>
                    <option value="ctrader">cTrader</option>
                  </Select>
                  <IconWrapper>
                    <ChevronDown size={20} />
                  </IconWrapper>
                </SelectWrapper>
                {errors.tradingPlatform && <ErrorText>{errors.tradingPlatform}</ErrorText>}
              </FormField>
            </FormGrid>

            <FormFieldSingle>
              <Label>
                Jurisdiction <Required>*</Required>
              </Label>
              <SelectWrapper>
                <Select
                  name="jurisdiction"
                  value={formData.jurisdiction}
                  onChange={handleInputChange}
                  $hasError={!!errors.jurisdiction}
                >
                  <option value="">Select</option>
                  <option value="global">Global</option>
                  <option value="eu">European Union</option>
                  <option value="uk">United Kingdom</option>
                  <option value="aus">Australia</option>
                </Select>
                <IconWrapper>
                  <ChevronDown size={20} />
                </IconWrapper>
              </SelectWrapper>
              {errors.jurisdiction && <ErrorText>{errors.jurisdiction}</ErrorText>}
            </FormFieldSingle>

            <TermsText>
              I understand and accept the{' '}
              <TermsLink href="#" onClick={(e) => e.preventDefault()}>
                Terms and Conditions
              </TermsLink>
            </TermsText>

            <ButtonGroup>
              <BackButtonSecondary onClick={() => setCurrentStep(1)}>
                <ArrowLeft size={18} />
                Back
              </BackButtonSecondary>
              <ContinueButton onClick={handleContinueToStep3}>
                Continue to Step 3
              </ContinueButton>
            </ButtonGroup>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <StepBadge>Step 3</StepBadge>

            {!submitted ? (
              <>
                <SectionTitle>Submit Your Account</SectionTitle>
                <SubmitButton onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 size={18} className="spin-icon" />
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </SubmitButton>
              </>
            ) : (
              <SuccessContainer>
                <CheckCircle2 size={64} color="#10b981" />
                <SuccessTitle>Account Successfully Linked!</SuccessTitle>
                <SuccessMessage>
                  Your {broker.name} account has been submitted and linked to our system.
                  You will receive a confirmation email shortly.
                </SuccessMessage>
                <ResetButton onClick={() => {
                  setCurrentStep(1);
                  setSubmitted(false);
                  setFormData({
                    accountName: '',
                    accountNumber: '',
                    accountType: '',
                    tradingPlatform: '',
                    jurisdiction: '',
                  });
                }}>
                  Submit Another Account
                </ResetButton>
              </SuccessContainer>
            )}
          </Card>
        )}
      </Container>
    </PageWrapper>
  );
};

export default BrokerSetupPage;

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  /* background: #f3f4f6; */
  padding: 2rem 1rem;
`;

const Container = styled.div`
  max-width: 1180px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  padding: 0.5rem 0;
  transition: color 0.2s;

  &:hover {
    color: #1f2937;
  }
`;

const Header = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ProgressContainer = styled.div`
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

const StepCircle = styled.div<{ $active: boolean; $clickable?: boolean }>`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  background: ${p => p.$active ? '#f59e0b' : '#d1d5db'};
  color: ${p => p.$active ? '#fff' : '#6b7280'};
  transition: all 0.3s;
  cursor: ${p => p.$clickable ? 'pointer' : 'default'};

  &:hover {
    ${p => p.$clickable && `
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    `}
  }

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

const ProgressLine = styled.div<{ $active: boolean }>`
  flex: 1;
  height: 4px;
  margin: 0 1rem;
  margin-top: -2rem;
  background: ${p => p.$active ? '#f59e0b' : '#d1d5db'};
  transition: all 0.3s;

  @media (max-width: 768px) {
    margin: 0 0.5rem;
    margin-top: -1.5rem;
  }
`;

const Card = styled.div`
  /* background: #fff; */
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const BrokerSetupHeader = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  background: #fff;
  padding: 0.4rem;
  border: 1px solid #0000004D;
  border-radius: 8px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SetupLogoBadge = styled.div<{ color: string }>`
 
  display: flex;
  align-items: start;
  justify-content: center;
 
`;

const SetupBrokerTitle = styled.h2`
  font-size:3rem;
  font-weight: 700;
  color: #DE992F;
  margin-bottom: 0.5rem;

`;

const SetupVerified = styled.div`
  display: inline-block;
  background: #3b82f6;
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const SetupFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.75rem 0;
  font-size: 20px;
  color: #132e58;
  font-weight: 400;

  li {
    margin-bottom: 0.25rem;
  }

 
`;

const SetupDescription = styled.p`
  font-size: 20px;
  color: #132e58;
  line-height: 1.6;
`;

const StepBadge = styled.div`
  display: inline-block;
  background: #d9d9d9;
  padding: 0.5rem 1.2rem;
  border-radius: 30px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 1.5rem;
  width: 120px;
  text-align: center;
`;

const InfoBox = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  
  background: #fff;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const InfoTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #132e58;
  margin-bottom: 1rem;
`;

const PrimaryButton = styled.button`
  background: #132e58;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;

  &:hover {
    background: #1e40af;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  @media (min-width: 640px) {
    width: auto;
  }
`;

const NotesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
  font-size: 20px;
  font-weight: 400;
  color: #132e58;
  line-height: 1.6;
  

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
  }
`;

const FormField = styled.div`
  display: flex;
  /* flex-direction: column; */
  justify-content: space-between;
  border: 1px solid #132E5899;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormFieldSingle = styled.div`
  display: flex;
  /* flex-direction: column; */
  justify-content: space-between;
  margin-bottom: 1.5rem;
  max-width: 49%;
  border: 1px solid #132E5899;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  

  @media (max-width: 768px) {
    flex-direction: column;
    max-width: 100%;
  }
`;

const Label = styled.label`
  font-size: 20px;
  font-weight: 500;
  color: #132e58;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
  /* border: 2px solid blue; */
`;

const Required = styled.span`
  color: #ef4444;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  background: #132e58;
  color: #fff;
  border: 2px solid ${p => p.$hasError ? '#ef4444' : 'transparent'};
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  width: 236px;

  

  &:focus {
    border-color: ${p => p.$hasError ? '#ef4444' : '#3b82f6'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: end;

  @media (max-width: 768px) {
    justify-content: center;
  }

`;

const IconWrapper = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  pointer-events: none;
`;

const Select = styled.select<{ $hasError?: boolean }>`
  width: 100%;
  max-width: 236px;
  padding: 0.75rem 1rem;
  padding-right: 2.5rem;
  background: #132e58;
  color: #fff;
  border: 2px solid ${p => p.$hasError ? '#ef4444' : 'transparent'};
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${p => p.$hasError ? '#ef4444' : '#3b82f6'};
  }

  option {
    background: #1f2937;
    color: #fff;
  }
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.375rem;
`;

const TermsText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

const TermsLink = styled.a`
  color: #f59e0b;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const BackButtonSecondary = styled.button`
  background: #e5e7eb;
  color: #374151;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: #d1d5db;
  }

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

const ContinueButton = styled.button`
  background: #132e58;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #1e40af;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const SubmitButton = styled.button`
  background: #1e3a8a;
  color: #fff;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  width: 100%;

  &:hover:not(:disabled) {
    background: #1e40af;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spin-icon {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @media (min-width: 640px) {
    width: auto;
  }
`;

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
`;

const SuccessTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #10b981;
  margin: 1rem 0 0.5rem 0;
`;

const SuccessMessage = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ResetButton = styled.button`
  background: #1e3a8a;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #1e40af;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;