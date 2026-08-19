import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import styled from "styled-components";

import RebatesBrokersSection from "./RebateBrokerBanner";
import AllBrokersList from "../../components/Broker/AllBrokersList";
import type { RebateTabCategory } from "../../services/brokerService";

const SectionWrapper = styled.section``;

const TAB_VALUES: RebateTabCategory[] = ["forex", "prop", "crypto"];

const RebateBrokers: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const tabParam = params.get("tab") as RebateTabCategory | null;
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState<RebateTabCategory>(
    tabParam && TAB_VALUES.includes(tabParam) ? tabParam : "forex"
  );

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 280);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const onTabChange = (tab: RebateTabCategory) => {
    setActiveTab(tab);
    setParams(tab === "forex" ? {} : { tab }, { replace: true });
  };

  return (
    <SectionWrapper>
      <RebatesBrokersSection
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      <AllBrokersList showAll={true} search={debouncedSearch} category={activeTab} />
    </SectionWrapper>
  );
};

export default RebateBrokers;
