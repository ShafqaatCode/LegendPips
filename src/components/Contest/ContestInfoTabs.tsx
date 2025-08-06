import React, { useState } from "react";
import styled from "styled-components";
import RulesAccordion from "./RulesAccordion";

const Container = styled.div`
  padding: 2rem;
  /* max-width: 900px; */
  margin: auto;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const TabButton = styled.button<{ active: boolean }>`
  background: ${({ active }) => (active ? "#1a1e4d" : "white")};
  color: ${({ active }) => (active ? "white" : "#132e58")};
  border: 2px solid #132e58;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const InfoBox = styled.div`
  font-weight: 400;
  padding: 1rem;
  font-size: 20px;
  color: #132e58;
  margin-bottom: 1.5rem;
  max-width: 1000px;
  

  @media (max-width : 768px){
    font-size: 16px;
    padding: 0;
  }
`;

const SelectLabel = styled.label`
font-size: 20px;
  /* display: block; */
  margin: 1rem 0 0.5rem;
  font-weight: 500;
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 100%;
  max-width: 250px;
`;



const Warning = styled.div`
  margin-top: 2rem;
  font-size: 24px;
  

  strong {
    display: block;
    font-weight: bold;
    color: #132e58;
    margin-bottom: 0.25rem;
  }

  @media (max-width: 768px)
  {
    font-size: 14px;

    strong{
        font-size: 16px;
    }
  }
`;

const CountryBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: baseline;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px)
  {
    flex-direction: column;
  }
`;



const ContestInfoTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState("join");


    return (
        <Container>
            <TabButtons>
                <TabButton active={activeTab === "join"} onClick={() => setActiveTab("join")}>How to Join</TabButton>
                <TabButton active={activeTab === "final"} onClick={() => setActiveTab("final")}>Final Qualifiers</TabButton>
            </TabButtons>

            {activeTab === "join" && (
                <>
                    <InfoBox>
                        To participate, a new LIVE trading account (no deposit required) must be opened under LegendPips as the Introducing Broker (IB) with IC Trading – Mauritius.
                        <br />
                        If you're a resident of a country restricted from opening a live account with IC Trading – Mauritius, you may instead open a new live account with IC Markets Global – Seychelles.
                    </InfoBox>

                    <CountryBox>
                        <SelectLabel>Select Your Country :</SelectLabel>
                        <Select>
                            <option>-- Choose Country --</option>
                            <option>Pakistan</option>
                            <option>India</option>
                            <option>UAE</option>
                        </Select>
                    </CountryBox>




                    <RulesAccordion />



                    <Warning>
                        <strong>We will remove any contestant found violating the spirit of fair competition:</strong>
                        In general, any trading activity that would not succeed in a real-world trading environment will be considered unfair. This includes, for example, opening multiple accounts and placing similar but opposing trades as an individual or coordinated group.
                    </Warning>
                </>
            )}

            {activeTab === "final" && <p>Final qualifiers content goes here.</p>}
        </Container>
    );
};

export default ContestInfoTabs;
