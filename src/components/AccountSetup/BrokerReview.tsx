import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronDown, Loader2, CheckCircle2, ArrowLeft, Star, Check } from 'lucide-react';

// Types
type Broker = {
  id: string;
  name: string;
  logo: string;
  minDeposit: number;
  regulation: string;
  spreadFrom: string;
  crypto: string;
  topCashback: boolean;
  verified: boolean;
  description: string;
  features: string[];
  accountTypes: AccountType[];
  reviews: Review[];
  fundingMethods: string[];
};

type AccountType = {
  name: string;
  platform: string;
  minDeposit: string;
  spreadFrom: string;
  commission: string;
  idealFor: string;
};

type Review = {
  name: string;
  rating: number;
  comment: string;
};

// Sample Data
const brokers: Broker[] = [
  {
    id: '1',
    name: 'IC Markets',
    logo: 'IC',
    minDeposit: 100,
    regulation: 'ASIC, CySEC',
    spreadFrom: '0.0 pips',
    crypto: 'Yes',
    topCashback: true,
    verified: true,
    description: "Trade online with the world's largest True ECN forex broker",
    features: [
      'Regulated in Australia & globally',
      'Spreads from 0.0 pips',
      'Trusted by traders worldwide'
    ],
    accountTypes: [
      {
        name: 'Standard Account',
        platform: 'MT4 / MT5',
        minDeposit: '$200',
        spreadFrom: '~0.6-0.8 pips',
        commission: 'None',
        idealFor: 'Beginners, Discretionary traders'
      },
      {
        name: 'Raw Spread (MetaTrader)',
        platform: 'MT4 / MT5',
        minDeposit: '$200',
        spreadFrom: 'From 0.0 pips',
        commission: '+$3.5 per lot per side',
        idealFor: 'EAs, scalpers, active traders'
      }
    ],
    reviews: [
      { name: 'Jessica', rating: 5, comment: 'Outstanding spreads and super speedy execution.' },
      { name: 'David', rating: 4, comment: 'Excellent platform, highly reliable.' }
    ],
    fundingMethods: ['Bank transfer', 'Credit/Debit card', 'E-wallets', 'Crypto']
  },
  {
    id: '2',
    name: 'XTREME Market',
    logo: 'XM',
    minDeposit: 5,
    regulation: 'IFSC, CySEC',
    spreadFrom: '0.6 pips',
    crypto: 'No',
    topCashback: true,
    verified: true,
    description: 'Award-winning forex broker with excellent execution',
    features: [
      'Regulated globally',
      'Low minimum deposit',
      'Fast execution'
    ],
    accountTypes: [],
    reviews: [],
    fundingMethods: ['Bank transfer', 'Credit/Debit card', 'E-wallets']
  },
  {
    id: '3',
    name: 'Exness',
    logo: 'EX',
    minDeposit: 10,
    regulation: 'FCA, CySEC',
    spreadFrom: '0.3 pips',
    crypto: 'Yes',
    topCashback: true,
    verified: true,
    description: 'Professional trading with tight spreads',
    features: ['FCA Regulated', 'Unlimited leverage', 'Instant withdrawals'],
    accountTypes: [],
    reviews: [],
    fundingMethods: ['Bank transfer', 'Credit/Debit card', 'E-wallets', 'Crypto']
  }
];

export default function BrokerSystem() {
  const [currentPage, setCurrentPage] = useState<'listing' | 'detail' | 'setup'>('listing');
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
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

  const handleBrokerSelect = (broker: Broker) => {
    setSelectedBroker(broker);
    setCurrentPage('detail');
  };

  const handleSetupAccount = () => {
    setCurrentPage('setup');
    setCurrentStep(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep2 = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.accountName.trim()) newErrors.accountName = 'Required';
    if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Required';
    if (!formData.accountType) newErrors.accountType = 'Required';
    if (!formData.tradingPlatform) newErrors.tradingPlatform = 'Required';
    if (!formData.jurisdiction) newErrors.jurisdiction = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  // BROKER LISTING PAGE
  if (currentPage === 'listing') {
    return (
      <PageWrapper>
        <Container>
          <PageTitle>Forex Brokers</PageTitle>
          <BrokerList>
            {brokers.map(broker => (
              <BrokerCard key={broker.id}>
                {broker.topCashback && <CashbackBadge>Top Cashback</CashbackBadge>}
                
                <BrokerHeader>
                  <LogoBadge color={broker.id === '1' ? '#10b981' : broker.id === '2' ? '#ef4444' : '#f59e0b'}>
                    <LogoIcon>{broker.logo}</LogoIcon>
                    {broker.verified && <VerifiedIcon><Check size={12} /></VerifiedIcon>}
                  </LogoBadge>
                  
                  <BrokerInfo>
                    <BrokerNameRow>
                      <BrokerName>{broker.name}</BrokerName>
                      <VerifiedBadge>Verified Broker</VerifiedBadge>
                    </BrokerNameRow>
                    
                    <InfoGrid>
                      <InfoItem>
                        <InfoLabel>Minimum Deposit:</InfoLabel>
                        <InfoValue>${broker.minDeposit}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>Regulated By:</InfoLabel>
                        <InfoValue>{broker.regulation}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>Spread:</InfoLabel>
                        <InfoValue>{broker.spreadFrom}</InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>Crypto:</InfoLabel>
                        <InfoValue>{broker.crypto}</InfoValue>
                      </InfoItem>
                    </InfoGrid>
                  </BrokerInfo>
                  
                  <ActionColumn>
                    <CashbackInfo>
                      <CashbackLabel>Forex & Cashback from:</CashbackLabel>
                      <CashbackValue>0.40 pip</CashbackValue>
                    </CashbackInfo>
                    <SetupButton onClick={() => handleBrokerSelect(broker)}>
                      Setup Account
                    </SetupButton>
                    <ReviewLink onClick={() => handleBrokerSelect(broker)}>
                      Broker Reviews
                    </ReviewLink>
                  </ActionColumn>
                </BrokerHeader>
              </BrokerCard>
            ))}
          </BrokerList>
          
          <Pagination>
            <PaginationButton active>1</PaginationButton>
            <PaginationButton>2</PaginationButton>
            <PaginationButton>3</PaginationButton>
            <PaginationDots>...</PaginationDots>
            <PaginationButton>15</PaginationButton>
          </Pagination>
        </Container>
      </PageWrapper>
    );
  }

  // BROKER DETAIL PAGE
  if (currentPage === 'detail' && selectedBroker) {
    return (
      <PageWrapper>
        <Container>
          <BackButton onClick={() => setCurrentPage('listing')}>
            <ArrowLeft size={18} /> Back to Brokers
          </BackButton>
          
          <DetailHeader>
            <DetailLogoBadge color={selectedBroker.id === '1' ? '#10b981' : '#f59e0b'}>
              <DetailLogoText>{selectedBroker.logo}</DetailLogoText>
            </DetailLogoBadge>
            <DetailHeaderContent>
              <DetailTitle>{selectedBroker.name}</DetailTitle>
              <DetailSubtitle>{selectedBroker.description}</DetailSubtitle>
            </DetailHeaderContent>
            <DetailActions>
              <VerifiedButton>Verified Broker</VerifiedButton>
              <SetupButton onClick={handleSetupAccount}>Setup Account</SetupButton>
            </DetailActions>
          </DetailHeader>

          <TabSection>
            <Tab active>Overview</Tab>
          </TabSection>

          <DetailGrid>
            <MainContent>
              <Section>
                <SectionTitle>About {selectedBroker.name}</SectionTitle>
                <SectionText>
                  {selectedBroker.name} is a leading Australian forex and CFDs broker offering multiple 
                  trading platforms and over 60 currency pairs. Long-term reliability and True 
                  ECN technology, highly regulated by ASIC.
                </SectionText>
              </Section>

              <Section>
                <SectionTitle>What Traders Love About {selectedBroker.name}</SectionTitle>
                <FeatureList>
                  {selectedBroker.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                  <li>Highly rated by multiple authorities</li>
                  <li>Over 10k trading pairs</li>
                  <li>MT4, MT5, and cTrader platforms</li>
                  <li>Competitive spreads and fast execution</li>
                </FeatureList>
              </Section>

              {selectedBroker.accountTypes.length > 0 && (
                <Section>
                  <SectionTitle>Account Types & Spreads</SectionTitle>
                  <AccountTable>
                    <thead>
                      <tr>
                        <TableHeader>Account Type</TableHeader>
                        <TableHeader>Platforms</TableHeader>
                        <TableHeader>Minimum Deposit</TableHeader>
                        <TableHeader>Spreads From</TableHeader>
                        <TableHeader>Commission</TableHeader>
                        <TableHeader>Ideal For</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBroker.accountTypes.map((account, i) => (
                        <tr key={i}>
                          <TableCell><strong>{account.name}</strong></TableCell>
                          <TableCell>{account.platform}</TableCell>
                          <TableCell>{account.minDeposit}</TableCell>
                          <TableCell>{account.spreadFrom}</TableCell>
                          <TableCell>{account.commission}</TableCell>
                          <TableCell>{account.idealFor}</TableCell>
                        </tr>
                      ))}
                    </tbody>
                  </AccountTable>
                  <SetupButton onClick={handleSetupAccount} style={{ marginTop: '1rem' }}>
                    Setup Account
                  </SetupButton>
                </Section>
              )}
            </MainContent>

            <Sidebar>
              <SidebarSection>
                <SidebarTitle>Customer Reviews</SidebarTitle>
                {selectedBroker.reviews.map((review, i) => (
                  <ReviewCard key={i}>
                    <ReviewHeader>
                      <ReviewName>{review.name}</ReviewName>
                      <StarRating>
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={14} fill={j < review.rating ? '#f59e0b' : 'none'} color="#f59e0b" />
                        ))}
                      </StarRating>
                    </ReviewHeader>
                    <ReviewText>{review.comment}</ReviewText>
                  </ReviewCard>
                ))}
              </SidebarSection>

              <SidebarSection>
                <SidebarTitle>Funding & Withdrawal Methods</SidebarTitle>
                <FundingList>
                  {selectedBroker.fundingMethods.map((method, i) => (
                    <FundingItem key={i}>✓ {method}</FundingItem>
                  ))}
                </FundingList>
              </SidebarSection>
            </Sidebar>
          </DetailGrid>
        </Container>
      </PageWrapper>
    );
  }

  // SETUP ACCOUNT PAGE
  if (currentPage === 'setup' && selectedBroker) {
    return (
      <PageWrapper>
        <Container>
          <BackButton onClick={() => setCurrentPage('detail')}>
            <ArrowLeft size={18} /> Back to Broker Details
          </BackButton>
          
          <PageTitle>{selectedBroker.name} Live Account Setup</PageTitle>

          <ProgressContainer>
            <StepsWrapper>
              {[1, 2, 3].map((step, index) => (
                <React.Fragment key={step}>
                  <StepCircleWrapper>
                    <StepCircle active={currentStep >= step}>{step}</StepCircle>
                    <StepLabel>Step</StepLabel>
                  </StepCircleWrapper>
                  {index < 2 && <ProgressLine active={currentStep > step} />}
                </React.Fragment>
              ))}
            </StepsWrapper>
          </ProgressContainer>

          {currentStep === 1 && (
            <Card>
              <BrokerSetupHeader>
                <SetupLogoBadge color={selectedBroker.id === '1' ? '#10b981' : '#f59e0b'}>
                  {selectedBroker.logo}
                </SetupLogoBadge>
                <div>
                  <SetupBrokerTitle>{selectedBroker.name}</SetupBrokerTitle>
                  <SetupVerified>Verified Broker</SetupVerified>
                  <SetupFeatures>
                    {selectedBroker.features.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </SetupFeatures>
                  <SetupDescription>{selectedBroker.description}</SetupDescription>
                </div>
              </BrokerSetupHeader>

              <StepBadge>Step 1</StepBadge>
              <InfoBox>
                <InfoTitle>Start Your Live Trading Journey with {selectedBroker.name}</InfoTitle>
                <PrimaryButton onClick={() => setCurrentStep(2)}>Start Trading</PrimaryButton>
                <NotesList>
                  <li>• Based in the EU, Brazil, the UK, or Australia? Please start your journey by opening an account with IC trading.</li>
                  <li>• If your live account is already connected to another IB, simply open a new one with a different email through the link above.</li>
                  <li>• If you don't have an IB linked yet, just enter your account number in Step 2 to connect with our IB group.</li>
                </NotesList>
              </InfoBox>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <StepBadge>Step 2</StepBadge>
              <SectionTitle>Enter Your Account Details</SectionTitle>

              <FormGrid>
                <FormField>
                  <Label>Account Name</Label>
                  <Input
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleInputChange}
                    hasError={!!errors.accountName}
                  />
                  {errors.accountName && <ErrorText>{errors.accountName}</ErrorText>}
                </FormField>

                <FormField>
                  <Label>Account Number</Label>
                  <Input
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    hasError={!!errors.accountNumber}
                  />
                  {errors.accountNumber && <ErrorText>{errors.accountNumber}</ErrorText>}
                </FormField>
              </FormGrid>

              <FormGrid>
                <FormField>
                  <Label>Account Type</Label>
                  <SelectWrapper>
                    <Select name="accountType" value={formData.accountType} onChange={handleInputChange} hasError={!!errors.accountType}>
                      <option value="">Select</option>
                      <option value="standard">Standard</option>
                      <option value="raw">Raw Spread</option>
                    </Select>
                    <ChevronDown size={20} />
                  </SelectWrapper>
                  {errors.accountType && <ErrorText>{errors.accountType}</ErrorText>}
                </FormField>

                <FormField>
                  <Label>Trading Platform</Label>
                  <SelectWrapper>
                    <Select name="tradingPlatform" value={formData.tradingPlatform} onChange={handleInputChange} hasError={!!errors.tradingPlatform}>
                      <option value="">Select</option>
                      <option value="mt4">MT4</option>
                      <option value="mt5">MT5</option>
                    </Select>
                    <ChevronDown size={20} />
                  </SelectWrapper>
                  {errors.tradingPlatform && <ErrorText>{errors.tradingPlatform}</ErrorText>}
                </FormField>
              </FormGrid>

              <FormField>
                <Label>Jurisdiction</Label>
                <SelectWrapper>
                  <Select name="jurisdiction" value={formData.jurisdiction} onChange={handleInputChange} hasError={!!errors.jurisdiction}>
                    <option value="">Select</option>
                    <option value="aus">Australia</option>
                    <option value="eu">EU</option>
                  </Select>
                  <ChevronDown size={20} />
                </SelectWrapper>
                {errors.jurisdiction && <ErrorText>{errors.jurisdiction}</ErrorText>}
              </FormField>

              <TermsText>I understand and accept the <TermsLink>Terms and Conditions</TermsLink></TermsText>

              <ButtonRow>
                <SecondaryButton onClick={() => setCurrentStep(1)}>Back</SecondaryButton>
                <PrimaryButton onClick={() => validateStep2() && setCurrentStep(3)}>Continue</PrimaryButton>
              </ButtonRow>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <StepBadge>Step 3</StepBadge>
              {!submitted ? (
                <>
                  <SectionTitle>Submit Your Account</SectionTitle>
                  <PrimaryButton onClick={handleSubmit} disabled={loading}>
                    {loading ? <><Loader2 size={18} className="spin" /> Submitting...</> : 'Submit'}
                  </PrimaryButton>
                </>
              ) : (
                <SuccessBox>
                  <CheckCircle2 size={64} color="#10b981" />
                  <SuccessTitle>Account Successfully Linked!</SuccessTitle>
                  <SuccessText>Your account has been submitted and linked to our system.</SuccessText>
                </SuccessBox>
              )}
            </Card>
          )}
        </Container>
      </PageWrapper>
    );
  }

  return null;
}

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f3f4f6;
  padding: 2rem 1rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
`;

const BrokerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BrokerCard = styled.div`
  background: #fff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  position: relative;
`;

const CashbackBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #fff;
  padding: 0.25rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0 0.75rem 0 0.5rem;
`;

const BrokerHeader = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const LogoBadge = styled.div<{ color: string }>`
  width: 5rem;
  height: 5rem;
  background: ${p => p.color};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
`;

const LogoIcon = styled.div`
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
`;

const VerifiedIcon = styled.div`
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  background: #1f2937;
  color: #fff;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BrokerInfo = styled.div`
  flex: 1;
`;

const BrokerNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
`;

const BrokerName = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
`;

const VerifiedBadge = styled.span`
  background: #3b82f6;
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
`;

const ActionColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;

  @media (max-width: 968px) {
    align-items: stretch;
  }
`;

const CashbackInfo = styled.div`
  text-align: right;
  margin-bottom: 0.5rem;

  @media (max-width: 968px) {
    text-align: left;
  }
`;

const CashbackLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const CashbackValue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
`;

const SetupButton = styled.button`
  background: #1e3a8a;
  color: #fff;
  padding: 0.625rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: #1e40af;
    transform: translateY(-1px);
  }

  @media (max-width: 968px) {
    width: 100%;
  }
`;

const ReviewLink = styled.button`
  background: transparent;
  color: #6b7280;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0;
  text-decoration: underline;

  &:hover {
    color: #1f2937;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button<{ active?: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  background: ${p => p.active ? '#f59e0b' : '#fff'};
  color: ${p => p.active ? '#fff' : '#1f2937'};
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${p => p.active ? '#f59e0b' : '#f3f4f6'};
  }
`;

const PaginationDots = styled.span`
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  color: #6b7280;
`;

const DetailHeader = styled.div`
  background: #fff;
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const DetailLogoBadge = styled.div<{ color: string }>`
  width: 6rem;
  height: 6rem;
  background: ${p => p.color};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const DetailLogoText = styled.div`
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
`;

const DetailHeaderContent = styled.div`
  flex: 1;
`;

const DetailTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #f59e0b;
  margin-bottom: 0.5rem;
`;

const DetailSubtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
`;

const DetailActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const VerifiedButton = styled.button`
  background: #3b82f6;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
`;

const TabSection = styled.div`
  background: #fff;
  border-radius: 0.75rem;
  padding: 0;
  margin-bottom: 1.5rem;
  overflow: hidden;
`;

const Tab = styled.button<{ active?: boolean }>`
  background: ${p => p.active ? '#f59e0b' : 'transparent'};
  color: ${p => p.active ? '#fff' : '#6b7280'};
  padding: 1rem 2rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Section = styled.div`
  background: #fff;
  border-radius: 0.75rem;
  padding: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const SectionText = styled.p`
  color: #6b7280;
  line-height: 1.6;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  color: #374151;
  
  li {
    margin-bottom: 0.5rem;
  }
`;

const AccountTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const TableHeader = styled.th`
  background: #1e3a8a;
  color: #fff;
  padding: 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;

  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 0.75rem;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 0.75rem;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SidebarSection = styled.div`
  background: #fff;
  border-radius: 0.75rem;
  padding: 1.5rem;
`;

const SidebarTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const ReviewCard = styled.div`
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 1rem;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ReviewName = styled.span`
  font-weight: 600;
  color: #1f2937;
`;

const StarRating = styled.div`
  display: flex;
  gap: 0.125rem;
`;

const ReviewText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
`;

const FundingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FundingItem = styled.div`
  font-size: 0.875rem;
  color: #374151;
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

  &:hover {
    color: #1f2937;
  }
`;

const ProgressContainer = styled.div`
  margin-bottom: 3rem;
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
  background: ${p => p.active ? '#f59e0b' : '#d1d5db'};
  color: ${p => p.active ? '#fff' : '#6b7280'};
  transition: all 0.3s;

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
`;

const ProgressLine = styled.div<{ active: boolean }>`
  flex: 1;
  height: 4px;
  margin: 0 1rem;
  margin-top: -2rem;
  background: ${p => p.active ? '#f59e0b' : '#d1d5db'};
  transition: all 0.3s;

  @media (max-width: 768px) {
    margin: 0 0.5rem;
    margin-top: -1.5rem;
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const BrokerSetupHeader = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SetupLogoBadge = styled.div<{ color: string }>`
  width: 6rem;
  height: 6rem;
  background: ${p => p.color};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  flex-shrink: 0;
`;

const SetupBrokerTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #f59e0b;
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
  font-size: 0.875rem;
  color: #374151;

  li {
    margin-bottom: 0.25rem;
  }
`;

const SetupDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const StepBadge = styled.div`
  display: inline-block;
  background: #f3f4f6;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 1.5rem;
`;

const InfoBox = styled.div`
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
`;

const PrimaryButton = styled.button`
  background: #1e3a8a;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;

  &:hover:not(:disabled) {
    background: #1e40af;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spin {
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

const SecondaryButton = styled.button`
  background: #e5e7eb;
  color: #374151;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #d1d5db;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const NotesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.6;

  li {
    margin-bottom: 0.5rem;
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
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  background: #1e3a8a;
  color: #fff;
  border: 2px solid ${p => p.hasError ? '#ef4444' : 'transparent'};
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: ${p => p.hasError ? '#ef4444' : '#3b82f6'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SelectWrapper = styled.div`
  position: relative;

  svg {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #fff;
    pointer-events: none;
  }
`;

const Select = styled.select<{ hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  padding-right: 2.5rem;
  background: #1e3a8a;
  color: #fff;
  border: 2px solid ${p => p.hasError ? '#ef4444' : 'transparent'};
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  appearance: none;
  cursor: pointer;

  &:focus {
    border-color: ${p => p.hasError ? '#ef4444' : '#3b82f6'};
  }

  option {
    background: #1e3a8a;
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
  margin: 1rem 0;
`;

const TermsLink = styled.a`
  color: #f59e0b;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const SuccessBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
`;

const SuccessTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #10b981;
  margin: 1rem 0 0.5rem 0;
`;

const SuccessText = styled.p`
  color: #6b7280;
  line-height: 1.6;
`;