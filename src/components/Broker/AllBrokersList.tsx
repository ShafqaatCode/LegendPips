import React, { useEffect, useState } from "react";

import styled from "styled-components";

import ButtonBase from "../SharedComponents/Button";
import ArrowIcon from "../../assets/arrow-narrow-circle-broken-up-right-blue.png";

import { Link } from "react-router-dom";
import BrokerCard2 from "./BrokerCard2";
import { fetchRebatesPageBrokers } from "../../services/brokerService";
import { mapApiBrokerToRebateCardRow, type RebateBrokerCardRow } from "../../utils/rebatesBrokersDisplay";

const BrokerSectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 0;
  margin: 3rem 1rem;
`;

const BrokerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
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

const AllBrokersList: React.FC<props> = ({ showAll = false }) => {
  const [rows, setRows] = useState<RebateBrokerCardRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const items = await fetchRebatesPageBrokers(showAll ? undefined : { limit: 5 });
        const mapped = items.map(mapApiBrokerToRebateCardRow);
        if (!cancelled) {
          setRows(mapped);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load brokers");
          setRows([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showAll]);

  const visibleRows = rows ?? [];

  return (
    <BrokerSectionWrapper>
      {error && <StatusLine>{error}</StatusLine>}
      {rows === null && !error && <StatusLine>Loading brokers…</StatusLine>}
      {rows !== null && visibleRows.length === 0 && !error && (
        <StatusLine>No rebate brokers are published yet. Run the rebates seed on the server.</StatusLine>
      )}
      <BrokerWrapper>
        {visibleRows.map((broker) => (
          <BrokerCard2
            key={broker.key}
            index={broker.index}
            featured={broker.featured}
            title={broker.title}
            description={broker.description}
            logoSrc={broker.logoSrc}
            rating={broker.rating}
            reviewsCount={broker.reviewsCount}
            accountTypes={broker.accountTypes}
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

export default AllBrokersList;
