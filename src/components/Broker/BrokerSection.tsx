import React, { useEffect, useState } from "react";
import BrokerCard from "./BrokerCard";
import styled from "styled-components";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";
import ButtonBase from "../SharedComponents/Button";
import ArrowIcon from "../../assets/arrow-narrow-circle-broken-up-right-blue.png";

import { Link } from "react-router-dom";
import { fetchRebatesPageBrokers } from "../../services/brokerService";
import { mapApiBrokerToRebateCardRow } from "../../utils/rebatesBrokersDisplay";
import type { ApiBroker } from "../../services/brokerService";

const BrokerSectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding: 1rem 0;
  margin: 2rem 0;
`;

const BrokerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const StatusLine = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0;
`;

interface props {
  showAll?: boolean;
}

const BrokerSection: React.FC<props> = ({ showAll = false }) => {
  const [items, setItems] = useState<ApiBroker[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchRebatesPageBrokers(showAll ? undefined : { limit: 5 });
        if (!cancelled) {
          setItems(list);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load brokers");
          setItems([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showAll]);

  const list = items ?? [];
  const cards = list.map((b) => {
    const row = mapApiBrokerToRebateCardRow(b);
    return {
      key: b._id,
      index: row.index,
      featured: row.featured,
      title: row.title,
      description: b.description || "",
      logoSrc: row.logoSrc,
      rating: row.rating,
      reviewsCount: row.reviewsCount,
    };
  });

  return (
    <BrokerSectionWrapper>
      <SectionHeadingSet
        upperText="All in one Trading Platform"
        mainHeading="Top Forex Brokers"
        subText="Find the best brokers carefully compared & reviewed for your trading needs. Trade confidently with secure platforms."
      />
      {error && <StatusLine>{error}</StatusLine>}
      {items === null && !error && <StatusLine>Loading brokers…</StatusLine>}
      {items !== null && cards.length === 0 && !error && (
        <StatusLine>No rebate brokers are published yet.</StatusLine>
      )}
      <BrokerWrapper>
        {cards.map((broker) => (
          <BrokerCard
            key={broker.key}
            index={broker.index}
            featured={broker.featured}
            title={broker.title}
            description={broker.description}
            logoSrc={broker.logoSrc}
            rating={broker.rating}
            reviewsCount={broker.reviewsCount}
          />
        ))}
      </BrokerWrapper>
      {!showAll && (
        <ButtonContainer>
          <Link to={"/rebates"} style={{ textDecoration: "none" }}>
            <ButtonBase
              bgColor="transparent"
              color="#132E58"
              borderColor="#132E58"
              padding="1rem 2.5rem"
              fontSize="1.2rem"
              fontWeight="600"
            >
              View All Brokers <img src={ArrowIcon} alt="icon" />
            </ButtonBase>
          </Link>
        </ButtonContainer>
      )}
    </BrokerSectionWrapper>
  );
};

export default BrokerSection;
