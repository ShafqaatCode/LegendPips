import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import {
  Container,
  CardContainer,
  LogoSection,
  LogoImg,
  InfoSection,
  TitleRow,
  VerifiedBadge,
  FeaturedRibbon,
  RatingBox,
  StarRow,
  ReviewText,
  ActionSection,
  PrimaryButton,
  SecondaryButton,
  TermsText,
  TopIndex,
} from "../Broker/BrokerCard.styles";
import { Description } from "../Broker/BrokerCard2";
import TradeLogo from "../../assets/TradeMarketBrands/Ellipse 1-1.svg";

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

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

function averageReviewStars(reviews: Review[]): number {
  if (!reviews?.length) return 0;
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return Math.min(5, Math.max(0, Math.round(sum / reviews.length)));
}

const BodyBlurb = styled.p`
  font-size: 0.8125rem;
  line-height: 1.5;
  color: rgba(15, 23, 42, 0.75);
  margin: 0 0 0.6rem 0;
  width: 100%;
  max-width: 36rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
`;

const ListingLogo: React.FC<{ src: string }> = ({ src }) => {
  const [url, setUrl] = useState(src);
  useEffect(() => {
    setUrl(src);
  }, [src]);
  return (
    <LogoImg
      src={url}
      alt=""
      onError={() => setUrl(TradeLogo)}
    />
  );
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPaginationButtons = () => {
    const buttons: React.ReactNode[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <PaginatorButton
            key={i}
            $isActive={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginatorButton>
        );
      }
    } else {
      buttons.push(
        <PaginatorButton key={1} $isActive={1 === currentPage} onClick={() => handlePageChange(1)}>
          1
        </PaginatorButton>
      );

      if (currentPage > 3) {
        buttons.push(<Ellipsis key="ellipsis-1">...</Ellipsis>);
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        buttons.push(
          <PaginatorButton key={i} $isActive={i === currentPage} onClick={() => handlePageChange(i)}>
            {i}
          </PaginatorButton>
        );
      }

      if (currentPage < totalPages - 2) {
        buttons.push(<Ellipsis key="ellipsis-2">...</Ellipsis>);
      }

      buttons.push(
        <PaginatorButton
          key={totalPages}
          $isActive={totalPages === currentPage}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </PaginatorButton>
      );
    }

    return buttons;
  };

  const shouldShowPagination = totalPages > 1;

  return (
    <PageWrapper>
      <SectionInner>
        <Header>
          <Heading>Forex Brokers</Heading>
          <Subheading>Find the best forex brokers with cashback rewards</Subheading>
        </Header>

        <BrokerStack>
          {visibleBrokers.map((broker, idx) => {
            const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
            const stars = averageReviewStars(broker.reviews);
            const reviewCount = broker.reviews?.length ?? 0;

            return (
              <Container key={broker.id}>
                <motion.div
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
                      <ListingLogo src={broker.logo} />
                    </LogoSection>

                    <InfoSection>
                      <TitleRow>
                        <h2>{broker.name}</h2>
                        {broker.verified ? <VerifiedBadge>✔ Verified Broker</VerifiedBadge> : null}
                      </TitleRow>
                      {broker.description?.trim() ? (
                        <BodyBlurb>{broker.description.trim()}</BodyBlurb>
                      ) : null}
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

                    <RatingBox>
                      <StarRow>
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} color={i < stars ? "#FBAF00" : "#d1d5db"} />
                        ))}
                      </StarRow>
                      <ReviewText>
                        <strong>{reviewCount.toLocaleString()}</strong>
                        <span>Reviews</span>
                      </ReviewText>
                    </RatingBox>

                    <ActionSection>
                      <TermsText>Terms & Conditions Apply</TermsText>
                      <PrimaryButton type="button" onClick={() => onBrokerSelect(broker)}>
                        Setup Account
                      </PrimaryButton>
                      <SecondaryButton as="button" type="button" onClick={() => onBrokerSelect(broker)}>
                        Broker Reviews →
                      </SecondaryButton>
                    </ActionSection>
                  </CardContainer>
                </motion.div>
              </Container>
            );
          })}
        </BrokerStack>

        {shouldShowPagination && (
          <PaginationContainer>
            <PaginatorButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </PaginatorButton>

            {renderPaginationButtons()}

            <PaginatorButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </PaginatorButton>
          </PaginationContainer>
        )}
      </SectionInner>
    </PageWrapper>
  );
};

export default BrokerListingPage;

const PageWrapper = styled.section`
  background: #f8fafc;
  padding: 0 0 2rem;
  box-sizing: border-box;
`;

const SectionInner = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 1.25rem ${({ theme }) => theme.typography.pageGutter} 0;
  box-sizing: border-box;
`;

const Header = styled.div`
  margin-bottom: 1.1rem;
`;

const Heading = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #132e58;
  margin: 0 0 0.35rem;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const Subheading = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
`;

const BrokerStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const PaginatorButton = styled.button<{ $isActive?: boolean }>`
  background-color: ${(props) => (props.$isActive ? "#132E58" : "transparent")};
  color: ${(props) => (props.$isActive ? "white" : "#132E58")};
  border: 1px solid #132e58;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 2.5rem;
  justify-content: center;
  font-size: 0.875rem;

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.$isActive ? "#132E58" : "#f1f5f9")};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.75rem;
    font-size: 0.8125rem;
  }
`;

const Ellipsis = styled.span`
  color: #6b7280;
  padding: 0 0.5rem;
  font-weight: 600;
`;
