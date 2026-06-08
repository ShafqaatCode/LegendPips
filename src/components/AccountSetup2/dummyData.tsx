import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import BrokerListingPage from "./BrokerListingPage";
import BrokerDetailPage from "./BrokerDetailPage";
import BrokerSetupPage from "./BrokerSetupPage";
import type { Broker } from "./BrokerListingPage";
import TradeLogo from "../../assets/TradeMarketBrands/Ellipse 1-1.svg";
import { BrokerListSkeleton } from "../SharedComponents/Shimmer";
import { fetchBrokersPage, mapApiBrokerToBroker } from "../../services/brokerService";

const BROKERS_PER_PAGE = 10;

const StatusWrap = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  color: #6b7280;
`;

const RetryBtn = styled.button`
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: 2px solid #132e58;
  background: white;
  color: #132e58;
  font-weight: 600;
  cursor: pointer;
`;

type PageType = "listing" | "detail" | "setup";

const BrokerList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>("listing");
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [listPage, setListPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBrokers = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchBrokersPage({ page, limit: BROKERS_PER_PAGE });
      setBrokers(result.items.map((b) => mapApiBrokerToBroker(b, TradeLogo)));
      setListPage(result.pagination.currentPage);
      setTotalPages(Math.max(1, result.pagination.totalPages));
      setTotalItems(result.pagination.totalItems);
    } catch (e: any) {
      setError(e.message || "Could not load brokers.");
      setBrokers([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentPage === "listing") {
      loadBrokers(listPage);
    }
  }, [currentPage, listPage, loadBrokers]);

  const handleBrokerSelect = (broker: Broker) => {
    setSelectedBroker(broker);
    setCurrentPage("detail");
  };

  const handleSetupAccount = () => {
    setCurrentPage("setup");
  };

  const handleBackToListing = () => {
    setCurrentPage("listing");
    setSelectedBroker(null);
  };

  const handleBackToDetail = () => {
    setCurrentPage("detail");
  };

  const handleListPageChange = (page: number) => {
    setListPage(page);
  };

  if (loading && currentPage === "listing") {
    return (
      <StatusWrap>
        <BrokerListSkeleton rows={4} />
      </StatusWrap>
    );
  }

  if (error && currentPage === "listing") {
    return (
      <StatusWrap>
        <div>{error}</div>
        <RetryBtn type="button" onClick={() => loadBrokers(listPage)}>
          Retry
        </RetryBtn>
      </StatusWrap>
    );
  }

  return (
    <>
      {currentPage === "listing" && (
        <BrokerListingPage
          brokers={brokers}
          currentPage={listPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={handleListPageChange}
          onBrokerSelect={handleBrokerSelect}
        />
      )}

      {currentPage === "detail" && selectedBroker && (
        <BrokerDetailPage broker={selectedBroker} onBack={handleBackToListing} onSetupAccount={handleSetupAccount} />
      )}

      {currentPage === "setup" && selectedBroker && (
        <BrokerSetupPage broker={selectedBroker} onBack={handleBackToDetail} />
      )}
    </>
  );
};

export default BrokerList;
