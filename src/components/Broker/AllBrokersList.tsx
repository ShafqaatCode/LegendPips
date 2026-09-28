import React, { useEffect, useState } from "react";

import styled from "styled-components";

import ButtonBase from "../SharedComponents/Button";
import ArrowIcon from "../../assets/arrow-narrow-circle-broken-up-right-blue.png";

import { Link } from "react-router-dom";
import BrokerCard2 from "./BrokerCard2";
import PropFirmCard from "./PropFirmCard";
import { BrokerListSkeleton } from "../SharedComponents/Shimmer";
import ListPagination from "../SharedComponents/ListPagination";
import { fetchBrokersPage, type RebateTabCategory } from "../../services/brokerService";
import { mapApiBrokerToRebateCardRow, sortBrokersFeaturedFirst, type RebateBrokerCardRow } from "../../utils/rebatesBrokersDisplay";

const BROKERS_PER_PAGE = 10;
const SEARCH_PAGE_SIZE = 24;

const BrokerSectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter} 1.5rem;
  box-sizing: border-box;
`;

const BrokerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
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
  /** Debounced query for /rebates broker search (optional). */
  search?: string;
  /** Rebates page tab filter (forex / crypto). */
  category?: RebateTabCategory;
}

const AllBrokersList: React.FC<props> = ({ showAll = false, search = "", category = "forex" }) => {
  const [rows, setRows] = useState<RebateBrokerCardRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [search, category, showAll]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setError(null);
        if (showAll) setRows(null);
        const isSearching = Boolean(showAll && search.trim());
        const result = await fetchBrokersPage({
          rebatesPage: true,
          // Browse: keep tab filter. Search: all published categories so every broker is findable.
          category: isSearching ? undefined : showAll ? category : "forex",
          search: isSearching ? search.trim() : undefined,
          page: showAll ? page : 1,
          limit: showAll ? (isSearching ? SEARCH_PAGE_SIZE : BROKERS_PER_PAGE) : 5,
        });
        const mapped = sortBrokersFeaturedFirst(result.items.map(mapApiBrokerToRebateCardRow));
        if (!cancelled) {
          setRows(mapped);
          setTotalPages(Math.max(1, result.pagination.totalPages));
          setTotalItems(result.pagination.totalItems);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load brokers");
          setRows([]);
          setTotalPages(1);
          setTotalItems(0);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showAll, search, category, page]);

  const visibleRows = rows ?? [];
  const loading = rows === null && !error;
  const isSearching = Boolean(search.trim());
  const pageSize = showAll && isSearching ? SEARCH_PAGE_SIZE : BROKERS_PER_PAGE;

  return (
    <BrokerSectionWrapper>
      {error && <StatusLine>{error}</StatusLine>}
      {loading && <BrokerListSkeleton rows={showAll ? pageSize : 3} />}
      {!loading && showAll && isSearching && totalItems > 0 && (
        <StatusLine>
          {totalItems} broker{totalItems === 1 ? "" : "s"} found
        </StatusLine>
      )}
      {!loading && visibleRows.length === 0 && !error && (
        <StatusLine>
          {isSearching
            ? "No brokers match your search. Try another name or keyword."
            : category === "crypto"
              ? "No crypto exchanges published for this tab yet. Add brokers with Crypto Exchange type in the admin panel (rebates list order ≥ 1)."
              : category === "prop"
                ? "No prop firms published for this tab yet. Add brokers with Prop Firms type in the admin panel (rebates list order ≥ 1)."
                : "No forex brokers published for this tab yet. Add brokers with Forex Broker type in the admin panel (rebates list order ≥ 1)."}
        </StatusLine>
      )}
      <BrokerWrapper>
        {visibleRows.map((broker, idx) => {
          const rank = showAll ? (page - 1) * pageSize + idx + 1 : idx + 1;
          return (!isSearching && category === "prop") ||
          (isSearching && (broker.propOffers?.length ?? 0) > 0) ? (
            <PropFirmCard
              key={broker.key}
              title={broker.title}
              brokerId={broker.key}
              logoSrc={broker.logoSrc}
              rating={broker.rating}
              reviewsCount={broker.reviewsCount}
              propOffers={broker.propOffers || []}
              propPromoCodes={broker.propPromoCodes}
              setupUrl={broker.setupUrl}
              temporarilyDisabled={broker.temporarilyDisabled}
            />
          ) : (
            <BrokerCard2
              key={broker.key}
              index={rank}
              featured={broker.featured}
              title={broker.title}
              brokerId={broker.key}
              description={broker.description}
              logoSrc={broker.logoSrc}
              rating={broker.rating}
              reviewsCount={broker.reviewsCount}
              accountTypes={broker.accountTypes}
              temporarilyDisabled={broker.temporarilyDisabled}
            />
          );
        })}
      </BrokerWrapper>

      {showAll && !loading && visibleRows.length > 0 && (
        <ListPagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setPage}
        />
      )}

      {!showAll && (
        <ButtonContainer>
          <Link to={"/rebates"} style={{ textDecoration: "none" }}>
            <ButtonBase
              bgColor="transparent"
              color="#132E58"
              borderColor="#132E58"
              padding="0.55rem 1.35rem"
              fontSize="0.875rem"
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
