import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BrokerCard3 from "./BrokerCard3";
import { fetchBrokersPage } from "../../services/brokerService";
import type { ApiBroker } from "../../services/brokerService";
import { BrokerListSkeleton } from "../SharedComponents/Shimmer";
import ListPagination from "../SharedComponents/ListPagination";
import { mapApiBrokerToRebateCardRow } from "../../utils/rebatesBrokersDisplay";

const BrokerSectionWrapper = styled.section`
  padding: 1rem 0;
  margin: 3rem auto;
`;

const BrokerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const StatusLine = styled.p`
  text-align: center;
  color: #6b7280;
`;

const ITEMS_PER_PAGE = 10;

const parseFeatures = (b: ApiBroker): { name: string; value: string }[] => {
  const rows = (b.features || []).map((line) => {
    const i = line.indexOf(":");
    if (i === -1) return { name: line, value: "" };
    return { name: line.slice(0, i).trim(), value: line.slice(i + 1).trim() };
  });
  return rows.length ? rows : [{ name: "Details", value: b.description?.slice(0, 120) || "—" }];
};

const AllBrokersListPaginated: React.FC = () => {
  const [brokers, setBrokers] = useState<ApiBroker[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setError(null);
        setBrokers(null);
        const result = await fetchBrokersPage({
          rebatesPage: true,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });
        if (!cancelled) {
          setBrokers(result.items);
          setTotalPages(Math.max(1, result.pagination.totalPages));
          setTotalItems(result.pagination.totalItems);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message || "Failed to load brokers");
          setBrokers([]);
          setTotalPages(1);
          setTotalItems(0);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  const loading = brokers === null && !error;
  const visibleBrokers = brokers ?? [];

  if (loading) {
    return (
      <BrokerSectionWrapper>
        <BrokerListSkeleton rows={ITEMS_PER_PAGE} />
      </BrokerSectionWrapper>
    );
  }

  if (error) {
    return (
      <BrokerSectionWrapper>
        <StatusLine>{error}</StatusLine>
      </BrokerSectionWrapper>
    );
  }

  return (
    <BrokerSectionWrapper>
      <BrokerWrapper>
        {visibleBrokers.map((b, idx) => {
          const row = mapApiBrokerToRebateCardRow(b);
          const uniqueKey = (currentPage - 1) * ITEMS_PER_PAGE + idx;
          return (
            <BrokerCard3
              key={b._id || String(uniqueKey)}
              index={row.index}
              featured={row.featured}
              title={row.title}
              logoSrc={row.logoSrc}
              rating={row.rating}
              reviewsCount={row.reviewsCount}
              features={parseFeatures(b)}
            />
          );
        })}
      </BrokerWrapper>

      <ListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
      />
    </BrokerSectionWrapper>
  );
};

export default AllBrokersListPaginated;
