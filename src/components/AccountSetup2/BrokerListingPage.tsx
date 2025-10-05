import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Types
export type Broker = {
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
  cashbackRate?: string;
};

export type AccountType = {
  name: string;
  platform: string;
  minDeposit: string;
  spreadFrom: string;
  commission: string;
  idealFor: string;
};

export type Review = {
  name: string;
  rating: number;
  comment: string;
};

type BrokerListingPageProps = {
  brokers: Broker[];
  onBrokerSelect: (broker: Broker) => void;
};

const ITEMS_PER_PAGE = 5;

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

const BrokerListingPage: React.FC<BrokerListingPageProps> = ({ brokers, onBrokerSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalItems = brokers.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const visibleBrokers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return brokers.slice(startIndex, endIndex);
  }, [currentPage, brokers]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <PageButton
            key={i}
            $isActive={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PageButton>
        );
      }
    } else {
      buttons.push(
        <PageButton
          key={1}
          $isActive={1 === currentPage}
          onClick={() => handlePageChange(1)}
        >
          1
        </PageButton>
      );

      if (currentPage > 3) {
        buttons.push(<Ellipsis key="ellipsis-1">...</Ellipsis>);
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        buttons.push(
          <PageButton
            key={i}
            $isActive={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PageButton>
        );
      }

      if (currentPage < totalPages - 2) {
        buttons.push(<Ellipsis key="ellipsis-2">...</Ellipsis>);
      }

      buttons.push(
        <PageButton
          key={totalPages}
          $isActive={totalPages === currentPage}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </PageButton>
      );
    }

    return buttons;
  };

  const shouldShowPagination = totalPages > 1;

  return (
    <PageWrapper>
      <Container>
        <Header>
          <Title>Forex Brokers</Title>
          <Subtitle>Find the best forex brokers with cashback rewards</Subtitle>
        </Header>

        <BrokerList>
          {visibleBrokers.map((broker, idx) => {
            const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
            return (
              <motion.div
                key={broker.id}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <CardContainer>
                  {broker.topCashback && <FeaturedRibbon>Featured</FeaturedRibbon>}
                  <TopIndex>{globalIndex}</TopIndex>

                  <LogoSection>
                    <LogoImg src={broker.logo} alt={`${broker.name} Logo`} />
                  </LogoSection>

                  <InfoSection>
                    <TitleRow>
                      <h2>{broker.name}</h2>
                      {broker.verified && <VerifiedBadge>✔ Verified Broker</VerifiedBadge>}
                    </TitleRow>
                    
                    <Description>
                      <div>
                        <h4>Minimum Deposit</h4>
                        <p>${broker.minDeposit}</p>
                      </div>
                      <div>
                        <h4>Regulated By</h4>
                        <p>{broker.regulation}</p>
                      </div>
                      <div>
                        <h4>Spread From</h4>
                        <p>{broker.spreadFrom}</p>
                      </div>
                      <div>
                        <h4>Crypto Trading</h4>
                        <p>{broker.crypto}</p>
                      </div>
                    </Description>
                  </InfoSection>

                  <ActionSection>
                    <TermsText>Terms & Conditions Apply</TermsText>
                    <PrimaryButton onClick={() => onBrokerSelect(broker)}>
                      Setup Account
                    </PrimaryButton>
                    <SecondaryButton onClick={() => onBrokerSelect(broker)}>
                      Broker Reviews →
                    </SecondaryButton>
                  </ActionSection>
                </CardContainer>
              </motion.div>
            );
          })}
        </BrokerList>

        {shouldShowPagination && (
          <PaginationContainer>
            <PageButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </PageButton>

            {renderPaginationButtons()}
            
            <PageButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </PageButton>
          </PaginationContainer>
        )}
      </Container>
    </PageWrapper>
  );
};

export default BrokerListingPage;

// Styled Components - Matching your exact structure
const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f3f4f6;
  padding: 2rem 1rem;

`;

const Container = styled.section`
  margin: 0px 30px;
  max-width: 1400px;
  /* margin: auto; */
  @media (min-width: 1440px) {
    margin: auto;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #132e58;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
`;

const BrokerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const CardContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 1rem;
  background-color: #fefefe;
  border-radius: 12px;
  background-clip: padding-box;
  flex-wrap: wrap;
  margin: auto;

  @media (max-width: 1024px) {
    gap: 2rem;
    /* padding-left: 5rem; */
    width: 90%;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 2rem 1.5rem;
    width: 95%;
    gap: 1.5rem;
    margin: 1rem auto;
  }
`;

const TopIndex = styled.span`
  background-color: #132E58;
  position: absolute;
  color: white;
  top: -20px;
  left: 20px;
  text-align: center;
  padding: 5px 12px;
  border-radius: 5px;
`;

const FeaturedRibbon = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #fac41d;
  color: white;
  padding: 6px 14px;
  font-weight: bold;
  font-size: 12px;
  border-radius: 0 12px 0 5px;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    margin-bottom: 1rem;
  }
`;

const LogoImg = styled.img`
  height: 140px;
  width: 140px;
  border-radius: 50%;
  background-color: #fff;
  object-fit: cover;

  @media (max-width: 768px) {
    height: 100px;
    width: 100px;
  }
`;

const InfoSection = styled.div`
  flex: 2;
  min-width: 250px;

  @media (max-width: 768px) {
    min-width: unset;
    width: 100%;
    text-align: center;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;

  h2 {
    font-size: 36px;
    margin: 0;
    color: #0f1c46;

    @media (max-width: 768px) {
      font-size: 28px;
    }
  }

  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const VerifiedBadge = styled.span`
  background-color: #2563eb;
  color: #ffffff;
  font-size: 13px;
  padding: 4px 10px;
  border-radius: 5px;
  white-space: nowrap;
`;

const Description = styled.div`
  font-size: 16px;
  color: rgba(15, 23, 42, 0.8);
  margin: 0;
  display: flex;
  gap: 4rem;
  flex-wrap: wrap;
  margin: auto;

  h4 {
    font-size: 16px;
    font-weight: 500;
  }

  p {
    font-size: 14px;
    font-weight: 300;
  }

  @media (max-width: 1024px) {
    flex-wrap: wrap;
    gap: 2rem;
    text-align: center;
  }

  @media (max-width: 768px) {
    justify-content: center;
    gap: 1rem;
  }
`;

const ActionSection = styled.div`
  min-width: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;

  @media (max-width: 768px) {
    align-items: center;
    width: 100%;
  }
`;

const TermsText = styled.span`
  font-size: 10px;
  color: #0f172a;
`;

const PrimaryButton = styled.button`
  background-color: #132E58;
  color: #fff;
  border: none;
  padding: 0.6rem 2.3rem;
  border-radius: 2rem;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  width: 100%;
  max-width: 200px;
  justify-content: center;

  &:hover {
    background-color: #1a2c60;
  }
`;

const SecondaryButton = styled.button`
  color: #132e58;
  font-size: 14px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  background: none;
  border: none;

  &:hover {
    text-decoration: underline;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
  flex-wrap: wrap;
`;

const PageButton = styled.button<{ $isActive?: boolean }>`
  background-color: ${props => (props.$isActive ? '#132E58' : 'transparent')};
  color: ${props => (props.$isActive ? 'white' : '#132E58')};
  border: 1px solid #132E58;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 2.5rem;
  justify-content: center;

  &:hover:not(:disabled) {
    background-color: ${props => (props.$isActive ? '#132E58' : '#f0f0f0')};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.75rem;
    font-size: 0.875rem;
  }
`;

const Ellipsis = styled.span`
  color: #6b7280;
  padding: 0 0.5rem;
  font-weight: 600;
`;