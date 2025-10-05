import React from 'react';
import styled from 'styled-components';
import { ArrowLeft, Star, ExternalLink } from 'lucide-react';
import type { Broker } from './BrokerListingPage';
import customerLogo from '../../assets/JessicaComment.png';

type BrokerDetailPageProps = {
  broker: Broker;
  onBack: () => void;
  onSetupAccount: () => void;
};

const BrokerDetailPage: React.FC<BrokerDetailPageProps> = ({ broker, onBack, onSetupAccount }) => {
  return (
    <PageWrapper>
      <Container>
        <BackButton onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Brokers
        </BackButton>

        {/* Header Section */}
        <HeaderSection>
          <LogoBox>
            <BrokerLogo src={broker.logo} alt={broker.name} />
          </LogoBox>

          <HeaderContent>
            <BrokerTitle>{broker.name}</BrokerTitle>
            <BrokerSubtitle>{broker.description}</BrokerSubtitle>
          </HeaderContent>

          <HeaderActions>
            <VerifiedBadge>✓ Verified Broker</VerifiedBadge>
            <SetupButton onClick={onSetupAccount}>Setup Account</SetupButton>
          </HeaderActions>
        </HeaderSection>

        {/* Overview Tab */}
        <TabSection>
          <TabButton active>Overview</TabButton>
        </TabSection>

        <ContentGrid>
          {/* Left Column */}
          <LeftColumn>
            {/* About Section */}
            <Section>
              <SectionTitle>About {broker.name}</SectionTitle>
              <SectionText>
                {broker.name} is a leading Australian forex and CFDs broker offering multiple
                trading platforms and over 60 currency pairs. Long-term reliability and True
                ECN connectivity. Highly recommended, reliable, and transparent!
              </SectionText>
            </Section>

            {/* What Traders Love */}
            <Section>
              <SectionTitle>What Traders Love About {broker.name}</SectionTitle>
              <FeatureList>
                {broker.features.map((feature, i) => (
                  <FeatureItem key={i}>• {feature}</FeatureItem>
                ))}
                <FeatureItem>• Regulated by multiple authorities</FeatureItem>
                <FeatureItem>• Over 60 currency pairs</FeatureItem>
                <FeatureItem>• MT4, MT5, and cTrader platforms</FeatureItem>
                <FeatureItem>• Competitive spreads and low fees</FeatureItem>
              </FeatureList>
            </Section>

            {/* Why Choose Them */}
            <Section>
              <SectionTitle>Why Choose Them?</SectionTitle>
              <FeatureList>
                <FeatureItem>• Ultra-tight spreads starting from {broker.spreadFrom}</FeatureItem>
                <FeatureItem>• Institutional-grade liquidity</FeatureItem>
                <FeatureItem>• Wide range of instruments</FeatureItem>
                <FeatureItem>• Advanced trading platforms (MT4, MT5, cTrader)</FeatureItem>
                <FeatureItem>• Easy mobile trading options</FeatureItem>
              </FeatureList>
            </Section>


          </LeftColumn>

          {/* Right Column - Sidebar */}
          <RightColumn>
            {/* Customer Reviews */}
            {broker.reviews && broker.reviews.length > 0 && (
              <SidebarCard>
                <SidebarTitle>Customer Reviews</SidebarTitle>
                {broker.reviews.map((review, i) => (
                  <ReviewItem key={i}>
                    <ReviewHeader>
                      <ReviewerIcon><img src={customerLogo} alt="Reviewer" /></ReviewerIcon>
                      <ReviewerName>{review.name}</ReviewerName>
                      <StarRating>
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            size={14}
                            fill={j < review.rating ? '#fbbf24' : 'none'}
                            color="#fbbf24"
                          />
                        ))}
                      </StarRating>
                    </ReviewHeader>
                    <ReviewText>{review.comment}</ReviewText>
                  </ReviewItem>
                ))}
              </SidebarCard>
            )}

            {/* Funding Methods */}
            <SidebarCard>
              <SidebarTitle>Funding & Withdrawal Methods</SidebarTitle>
              <FundingList>
                {broker.fundingMethods && broker.fundingMethods.map((method, i) => (
                  <FundingItem key={i}>
                    <FundingIcon>{getFundingIcon(method)}</FundingIcon>
                    {method}
                  </FundingItem>
                ))}
              </FundingList>
            </SidebarCard>

            {/* CTA Button */}
            {/* <CTAButton onClick={onSetupAccount}>
              Setup Account
            </CTAButton>
            <VisitWebsiteButton href="#" target="_blank">
              Visit Official Website <ExternalLink size={16} />
            </VisitWebsiteButton> */}
          </RightColumn>

        </ContentGrid>
        {/* Account Types Table */}
        {broker.accountTypes && broker.accountTypes.length > 0 && (
          <Section>
            <SectionTitle>Account Types & Spreads</SectionTitle>
            <TableWrapper>
              <AccountTable>
                <thead>
                  <TableRow $header>
                    <TableHeader>Account Type</TableHeader>
                    <TableHeader>Platforms</TableHeader>
                    <TableHeader>Minimum Deposit</TableHeader>
                    <TableHeader>Spreads From</TableHeader>
                    <TableHeader>Commission</TableHeader>
                    <TableHeader>Ideal For</TableHeader>
                  </TableRow>
                </thead>
                <tbody>
                  {broker.accountTypes.map((account, i) => (
                    <TableRow key={i}>
                      <TableCell><strong>{account.name}</strong></TableCell>
                      <TableCell>{account.platform}</TableCell>
                      <TableCell>{account.minDeposit}</TableCell>
                      <TableCell>{account.spreadFrom}</TableCell>
                      <TableCell>{account.commission}</TableCell>
                      <TableCell>{account.idealFor}</TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </AccountTable>
            </TableWrapper>

            <CTAGroup>
              <SetupButton onClick={onSetupAccount} >
                Setup Account
              </SetupButton>

              <VisitWebsiteButton href="#" target="_blank">
                Visit Official Website <ExternalLink size={16} />
              </VisitWebsiteButton>
            </CTAGroup>


          </Section>
        )}
      </Container>
    </PageWrapper>
  );
};

// Helper function for funding icons
function getFundingIcon(method: string): string {
  if (method.toLowerCase().includes('bank')) return '🏦';
  if (method.toLowerCase().includes('card') || method.toLowerCase().includes('credit') || method.toLowerCase().includes('debit')) return '💳';
  if (method.toLowerCase().includes('wallet')) return '💼';
  if (method.toLowerCase().includes('crypto')) return '₿';
  return '💰';
}

export default BrokerDetailPage;

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  
  padding: 2rem 1rem;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  background-color: #fff;
  
`;

const CTAGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
  justify-content: flex-start;
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
  
  padding: 1rem;

  &:hover {
    color: #1f2937;
  }
`;

const HeaderSection = styled.div`
  background: #ffffff;
  /* border-radius: 12px; */
  padding: 2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); */

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const LogoBox = styled.div`
  width: 200px;
  height: 200px;
  /* background: #000; */
  /* border-radius: 8px; */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid #e5e7eb;
`;

const BrokerLogo = styled.img`
  max-width: 240px;
  max-height: 240px;
  object-fit: contain;
`;

const HeaderContent = styled.div`
  flex: 1;
  /* border: 2px solid red; */
  /* align-self: self-start; */
`;

const BrokerTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: #de992f;
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const BrokerSubtitle = styled.p`
  font-size: 24px;
  font-weight: 400;
  color: #132e58;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  /* align-items: flex-end; */

  @media (max-width: 768px) {
    width: 100%;
    align-items: stretch;
  }
`;

const VerifiedBadge = styled.div`
  background: #de992f;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  text-align: center;
`;

const SetupButton = styled.button`
  background: #132e58;
  color: #fff;
  padding: 0.75rem 2rem;
  border-radius: 24px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
width: 222px;
  &:hover {
    background: #1e40affd;
  }

  @media (max-width: 768px) {
    /* width: 100%; */
  }
`;

const TabSection = styled.div`
  background: #ffffff;
  /* border-radius: 12px; */
  padding: 0;
  /* margin-bottom: 1.5rem; */
  /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); */
`;

const TabButton = styled.button<{ active?: boolean }>`
  background: ${p => p.active ? '#DE992F' : 'transparent'};
  color: ${p => p.active ? '#fff' : '#fff'};
  padding: 8px 2rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  border-radius:12px;
  font-size: 40px;
  margin: 1rem;

  &:hover {
    background: ${p => p.active ? '#fbbf24' : '#f3f4f6'};
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  margin: 1rem 0;
  /* gap: 1.5rem; */
  

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  /* gap: 1.5rem; */
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  /* gap: 1.5rem; */
`;

const Section = styled.div`
  background: #ffffff;
  /* border-radius: 12px; */
  padding: 2rem;
  /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); */
  /* width: 100%; */
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #132e58;
  margin: 0 0 1rem 0;
`;

const SectionText = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: #132E58;
  margin: 0;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
 

`;

const FeatureItem = styled.li`
  font-size: 0.95rem;
  color: #374151;
  margin-bottom: 0.5rem;
  line-height: 1.6;

  &::marker {
    color: #de992f;
  } 
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 1rem;
`;

const AccountTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr<{ $header?: boolean }>`
  background: ${p => p.$header ? '#132e58' : '#fff'};
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  color: #fff;
  padding: 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.75rem;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  font-size: 1rem;
  font-weight: 400;
  color: #000;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.75rem;
  }
`;

const SidebarCard = styled.div`
  background: #ffffff;
  /* border-radius: 12px; */
  padding: 2rem;
  /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); */
`;

const SidebarTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #132e58;
  margin: 0 0 1rem 0;
`;

const ReviewItem = styled.div`
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  /* justify-content: start; */
  
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ReviewerIcon = styled.span`
  /* font-size: 1.25rem; */

  display: flex;
  align-items: center;
  justify-content: center;
`;

const ReviewerName = styled.span`
  font-weight: 500;
  font-size: 20px;
  color: #132e58;
  flex: 1;
`;

const StarRating = styled.div`
  /* display: flex; */
  /* gap: 0.125rem; */
`;

const ReviewText = styled.p`
  font-size: 1rem;
  color: #000;
  margin: 0;
  line-height: 1.5;
`;

const FundingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FundingItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
`;

const FundingIcon = styled.span`
  font-size: 1.25rem;
`;

// const CTAButton = styled.button`
//   background: #132e58;
//   color: #fff;
//   padding: 0.75rem 2rem;
//   border-radius: 24px;
//   border: none;
//   font-size: 1rem;
//   font-weight: 600;
//   cursor: pointer;
//   white-space: nowrap;

//   &:hover {
//     background: #1e40af;
//   }

//   @media (max-width: 768px) {
//     width: 100%;
//   }
// `;

const VisitWebsiteButton = styled.a`
 background: #132e58;
  color: #fff;
  padding: 0.75rem 2rem;
  border-radius: 24px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  text-align: center;

  &:hover {
    background: #1e40affd;
  }

  @media (max-width: 768px) {
    /* width: 100%; */
text-align: center;

  }
`;