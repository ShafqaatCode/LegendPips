import React, { useState, useEffect } from "react";
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
import ListPagination from "../SharedComponents/ListPagination";
import {
  BROKER_KIND_COLORS,
  BROKER_KIND_DESCRIPTIONS,
  BROKER_KIND_LABELS,
  BROKER_KIND_ORDER,
  type BrokerKind,
} from "../../utils/brokerTypes";
import { FiGlobe, FiCpu, FiAward } from "react-icons/fi";

const KIND_ICONS: Record<BrokerKind, React.ReactNode> = {
  forex: <FiGlobe />,
  crypto: <FiCpu />,
  prop: <FiAward />,
};

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
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  category?: "forex" | "crypto" | "prop";
  onCategoryChange?: (cat: "forex" | "crypto" | "prop") => void;
};

const ITEMS_PER_PAGE = 10;

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

const BrokerListingPage: React.FC<BrokerListingPageProps> = ({
  brokers,
  onBrokerSelect,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  category = "forex",
  onCategoryChange,
}) => {
  const heading = BROKER_KIND_LABELS[category] || "Brokers";
  const sub = BROKER_KIND_DESCRIPTIONS[category];

  return (
    <PageWrapper>
      <SectionInner>
        <Header>
          <Heading>{heading}</Heading>
          <Subheading>{sub}</Subheading>
        </Header>

        {onCategoryChange && (
          <TypeTabs role="tablist" aria-label="Broker types">
            {BROKER_KIND_ORDER.map((kind) => (
              <TypeTab
                key={kind}
                type="button"
                role="tab"
                aria-selected={category === kind}
                $active={category === kind}
                $kind={kind}
                onClick={() => onCategoryChange(kind)}
              >
                <span className="ico">{KIND_ICONS[kind]}</span>
                {BROKER_KIND_LABELS[kind]}
              </TypeTab>
            ))}
          </TypeTabs>
        )}

        <BrokerStack>
          {brokers.map((broker, idx) => {
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

        <ListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={onPageChange}
        />
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

const TypeTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 1.15rem;
  padding: 0.35rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
`;

const TypeTab = styled.button<{ $active?: boolean; $kind: BrokerKind }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: none;
  border-radius: 9px;
  padding: 0.55rem 0.95rem;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  color: ${({ $active, $kind }) =>
    $active ? BROKER_KIND_COLORS[$kind].color : "#475569"};
  background: ${({ $active, $kind }) =>
    $active ? BROKER_KIND_COLORS[$kind].soft : "transparent"};
  box-shadow: ${({ $active, $kind }) =>
    $active ? `inset 0 0 0 1.5px ${BROKER_KIND_COLORS[$kind].border}` : "none"};
  transition: all 0.12s;

  .ico {
    display: inline-flex;
    font-size: 0.95rem;
  }

  &:hover {
    background: ${({ $kind }) => BROKER_KIND_COLORS[$kind].soft};
  }
`;

const BrokerStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

