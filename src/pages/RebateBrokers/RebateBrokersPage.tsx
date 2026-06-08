import React, { useEffect, useState } from "react";

import styled from "styled-components";

import RebatesBrokersSection from "./RebateBrokerBanner";
import AllBrokersList from "../../components/Broker/AllBrokersList";
import type { RebateTabCategory } from "../../services/brokerService";

const SectionWrapper = styled.section``;

const RebateBrokers: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState<RebateTabCategory>("forex");

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 280);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  return (
    <SectionWrapper>
      <RebatesBrokersSection
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <AllBrokersList showAll={true} search={debouncedSearch} category={activeTab} />
    </SectionWrapper>
  );
};

export default RebateBrokers;
