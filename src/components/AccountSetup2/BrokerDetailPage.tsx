import React from 'react';
import styled from 'styled-components';
import { ArrowLeft, Star } from 'lucide-react';
import { Broker } from './BrokerListingPage';

type BrokerDetailPageProps = {
  broker: Broker;
  onBack: () => void;
  onSetupAccount: () => void;
};

export default function BrokerDetailPage({ broker, onBack, onSetupAccount }: BrokerDetailPageProps) {
  return (
    <PageWrapper>
      <Container>
        <BackButton onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Brokers
        </BackButton>
        
        <DetailHeader>
          <DetailLogoBadge color={getLogoColor(broker.id)}>
            <DetailLogoText>{broker.logo}</DetailLogoText>
          </DetailLogoBadge>
          <DetailHeaderContent>
            <DetailTitle>{broker.name}</DetailTitle>
            <DetailSubtitle>{broker.description}</DetailSubtitle>
          </DetailHeaderContent>
          <DetailActions>
            {broker.verified && <VerifiedButton>Verified Broker</VerifiedButton>}
            <SetupButton onClick={onSetupAccount}>Setup Account</SetupButton>
          </DetailActions>
        </DetailHeader>

        <TabSection>
          <Tab active>Overview</Tab>
        </TabSection>

        <DetailGrid>
          <MainContent>
            <Section>
              <SectionTitle>About {broker.name}</SectionTitle>
              <SectionText>
                {broker.name} is a leading forex and CFDs broker offering multiple 
                trading platforms and currency pairs. Long-term reliability and 
                advanced technology, highly regulated by {broker.regulation}.
              </SectionText>
            </Section>

            <Section>
              <SectionTitle>What Traders Love About {broker.name}</SectionTitle>
              <FeatureList>
                {broker.features.map((feature, i) => (
                  <li key={i}>• {feature}</li>
                ))}
                <li>• Highly rated by multiple authorities</li>
                <li>• MT4, MT5, and cTrader platforms</li>
                <li>• Competitive spreads and fast execution</li>
                <li>• Professional customer support</li>
              </FeatureList>
            </Section>

            <Section>
              <SectionTitle>Why Choose {broker.name}?</SectionTitle>
              <FeatureList>
                <li>• Ultra-tight spreads starting from {broker.spreadFrom}</li>
                <li>• Institutional-grade liquidity</li>
                <li>• Advanced trading platforms (MT4, MT5, cTrader)</li>
                <li>• Easy mobile trading options</li>
              </FeatureList>
            </Section>

            {broker.accountTypes && broker.accountTypes.length > 0 && (
              <Section>
                <SectionTitle>Account Types & Spreads</SectionTitle>
                <TableWrapper>
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
                      {broker.accountTypes.map((account, i) => (
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
                </TableWrapper>
                <SetupButton onClick={onSetupAccount} style={{ marginTop: '1rem' }}>
                  Setup Account
                </SetupButton>
              </Section>
            )}
          </MainContent>

          <Sidebar>
            {broker.reviews && broker.reviews.length > 0 && (
              <SidebarSection>
                <SidebarTitle>Customer Reviews</SidebarTitle>
                {broker.reviews.map((review, i) => (
                  <ReviewCard key={i}>
                    <ReviewHeader>
                      <ReviewName>{review.name}</ReviewName>
                      <StarRating>
                        {[...Array(5)].map((_, j) => (
                          <Star 
                            key={j} 
                            size={14} 
                            fill={j < review.rating ? '#f59e0b' : 'none'} 
                            color="#f59e0b" 
                          />
                        ))}
                      </StarRating>
                    </ReviewHeader>
                    <ReviewText>{review.comment}</ReviewText>
                  </ReviewCard>
                ))}
              </SidebarSection>
            )}

            <SidebarSection>
              <SidebarTitle>Funding & Withdrawal Methods</SidebarTitle>
              <FundingList>
                {broker.fundingMethods && broker.fundingMethods.map((method, i) => (
                  <FundingItem key={i}>✓ {method}</FundingItem>
                ))}
              </FundingList>
            </SidebarSection>

            <SidebarSection>
              <SidebarTitle>Quick Facts</SidebarTitle>
              <QuickFacts>
                <QuickFactItem>
                  <FactLabel>Minimum Deposit:</FactLabel>
                  <FactValue>${broker.minDeposit}</FactValue>
                </QuickFactItem>
                <QuickFactItem>
                  <FactLabel>Regulation:</FactLabel>
                  <FactValue>{broker.regulation}</FactValue>
                </QuickFactItem>
                <QuickFactItem>
                  <FactLabel>Crypto Trading:</FactLabel>
                  <FactValue>{broker.crypto}</FactValue>
                </QuickFactItem>
                <QuickFactItem>
                  <FactLabel>Spreads From:</FactLabel>
                  <FactValue>{broker.spreadFrom}</FactValue>
                </QuickFactItem>
              </QuickFacts>
            </SidebarSection>

            <CTABox>
              <CTATitle>Ready to Start Trading?</CTATitle>
              <CTAText>Open your account with {broker.name} today</CTAText>
              <SetupButton onClick={onSetupAccount} style={{ width: '100%' }}>
                Setup Account Now
              </SetupButton>
            </CTABox>
          </Sidebar>
        </DetailGrid>
      </Container>
    </PageWrapper>
  );
}

// Helper function
function getLogoColor(id: string): string {
  const colors: { [key: string]: string } = {
    '1': '#10b981',
    '2': '#ef4444',
    '3': '#f59e0b',
    '4': '#3b82f6',
    '5': '#8b5cf6',
  };
  return colors[id] || '#6b7280';
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

const DetailHeader = styled.div`
  background: #fff;
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1.5rem;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
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

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const DetailSubtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.5;
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
  cursor: default;
  white-space: nowrap;
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
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const TabSection = styled.div`
  background: #fff;
  border-radius: 0.75rem;
  padding: 0;
  margin-bottom: 1.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Tab = styled.button<{ active?: boolean }>`
  background: ${p => p.active ? '#f59e0b' : 'transparent'};
  color: ${p => p.active ? '#fff' : '#6b7280'};
  padding: 1rem 2rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${p => p.active ? '#f59e0b' : '#f3f4f6'};
  }
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const SectionText = styled.p`
  color: #6b7280;
  line-height: 1.7;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  color: #374151;
  line-height: 1.8;
  
  li {
    margin-bottom: 0.5rem;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 1rem;
`;

const AccountTable = styled.table`
  width: 100%;
  border-collapse: collapse;

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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

const QuickFacts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const QuickFactItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FactLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const FactValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
`;

const CTABox = styled.div`
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  color: #fff;
`;

const CTATitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const CTAText = styled.p`
  font-size: 0.875rem;
  margin-bottom: 1rem;
  opacity: 0.9;
`;