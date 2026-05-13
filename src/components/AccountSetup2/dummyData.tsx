import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import BrokerListingPage from "./BrokerListingPage";
import BrokerDetailPage from "./BrokerDetailPage";
import BrokerSetupPage from "./BrokerSetupPage";
import type { Broker } from "./BrokerListingPage";
import TradeLogo from "../../assets/TradeMarketBrands/Ellipse 1-1.svg";
import { fetchPublicBrokers, mapApiBrokerToBroker } from "../../services/brokerService";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBrokers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchPublicBrokers();
      setBrokers(items.map((b) => mapApiBrokerToBroker(b, TradeLogo)));
    } catch (e: any) {
      setError(e.message || "Could not load brokers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBrokers();
  }, [loadBrokers]);

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

  if (loading) {
    return <StatusWrap>Loading brokers…</StatusWrap>;
  }

  if (error) {
    return (
      <StatusWrap>
        <div>{error}</div>
        <RetryBtn type="button" onClick={loadBrokers}>
          Retry
        </RetryBtn>
      </StatusWrap>
    );
  }

  return (
    <>
      {currentPage === "listing" && (
        <BrokerListingPage brokers={brokers} onBrokerSelect={handleBrokerSelect} />
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
