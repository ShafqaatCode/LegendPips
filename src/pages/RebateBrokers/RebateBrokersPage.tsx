import React, { useEffect, useState } from "react";

import styled from "styled-components";

import RebatesBrokersSection from "./RebateBrokerBanner";
import AllBrokersList from "../../components/Broker/AllBrokersList";

const SectionWrapper = styled.section``;

const RebateBrokers: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 280);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  return (
    <SectionWrapper>
      <RebatesBrokersSection searchValue={searchInput} onSearchChange={setSearchInput} />
      <AllBrokersList showAll={true} search={debouncedSearch} />
    </SectionWrapper>
  );
};

export default RebateBrokers;
