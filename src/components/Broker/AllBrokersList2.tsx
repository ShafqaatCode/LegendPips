import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import BrokerCard3 from "./BrokerCard3";
import { fetchRebatesPageBrokers } from "../../services/brokerService";
import type { ApiBroker } from "../../services/brokerService";
import { BrokerListSkeleton } from "../SharedComponents/Shimmer";
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PageButton = styled.button<{ $isActive?: boolean }>`
  background-color: ${(props) => (props.$isActive ? "#132E58" : "transparent")};
  color: ${(props) => (props.$isActive ? "white" : "#132E58")};
  border: 1px solid #132e58;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover:not(:disabled):not([aria-current="page"]) {
    background-color: #f0f0f0;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StatusLine = styled.p`
  text-align: center;
  color: #6b7280;
`;

const ITEMS_PER_PAGE = 5;

const parseFeatures = (b: ApiBroker): { name: string; value: string }[] => {
  const rows = (b.features || []).map((line) => {
    const i = line.indexOf(":");
    if (i === -1) return { name: line, value: "" };
    return { name: line.slice(0, i).trim(), value: line.slice(i + 1).trim() };
  });
  return rows.length ? rows : [{ name: "Details", value: b.description?.slice(0, 120) || "—" }];
};

const AllBrokersListPaginated: React.FC = () => {
  const [brokers, setBrokers] = useState<ApiBroker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const items = await fetchRebatesPageBrokers();
        if (!cancelled) {
          setBrokers(items);
          setError(null);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message || "Failed to load brokers");
          setBrokers([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(brokers.length / ITEMS_PER_PAGE));

  const visibleBrokers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return brokers.slice(start, start + ITEMS_PER_PAGE);
  }, [brokers, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <PageButton key={i} $isActive={i === currentPage} onClick={() => handlePageChange(i)}>
          {i}
        </PageButton>
      );
    }
    return buttons;
  };

  if (loading) {
    return (
      <BrokerSectionWrapper>
        <BrokerListSkeleton rows={5} />
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

      {totalPages > 1 && (
        <PaginationContainer>
          <PageButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </PageButton>
          {renderPaginationButtons()}
          <PageButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </PageButton>
        </PaginationContainer>
      )}
    </BrokerSectionWrapper>
  );
};

export default AllBrokersListPaginated;
