import React, { useState, type JSX } from "react";
import styled from "styled-components";
import ContestRules from "./ContestRules";
import ComingSoon from "../../pages/ComminSoon/CommingSoon";
import Leaderboard from "../Leaderboard/LeaderBoard";


const tabs = [
  "Rules",
  "FAQs",
  "Rankings (1230)",
  "How to Join",
  "Schedule",
  "Final Qualifiers",
  "Forum Posts (35)",
];

const tabContent: Record<string, JSX.Element> = {
  "Rules": (
    <>
     <ContestRules />
    </>
  ),
  "FAQs": (
    <>
      <h2>Frequently Asked Questions</h2>
      <p>Here are some of the common questions asked by participants:</p>
      <ul>
        <li>How do I register?</li>
        <li>Can I use an existing account?</li>
        <li>Where can I check my ranking?</li>
      </ul>
    </>
  ),
  "Rankings (1230)": (
    <>
      <Leaderboard />   
    </>
  ),
  "How to Join": (
    <>
      <h2>Joining the Contest</h2>
      <p>Follow these steps to join:</p>
      <ol>
        <li>Open a new account with ICTrading.</li>
        <li>Verify your profile.</li>
        <li>Log in to MT5 and connect to ICTrading-Demo server.</li>
      </ol>
    </>
  ),
  "Schedule": (
    <>
      <h2>Contest Schedule</h2>
      <ul>
        <li>Round 1: July 7 – July 10</li>
        <li>Round 2: July 11 – July 14</li>
        <li>Final: July 15 – July 19</li>
      </ul>
    </>
  ),
  "Final Qualifiers": (
    <>
      <ComingSoon />
    </>
  ),
  "Forum Posts (35)": (
    <>
      <h2>Community Forum</h2>
      <p>Check out what other traders are saying:</p>
      <ul>
        <li>User123: “How do I fix my server connection?”</li>
        <li>TraderPro: “Sharing my winning strategy!”</li>
        <li>NoobKing: “Just joined, any tips?”</li>
      </ul>
    </>
  ),
};

const ContestTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Rules");

  return (
    <TabsWrapper>
      <TabList>
        {tabs.map((tab) => (
          <TabButton
            key={tab}
            active={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </TabButton>
        ))}
      </TabList>

      <TabContent>{tabContent[activeTab]}</TabContent>
    </TabsWrapper>
  );
};

export default ContestTabs;

// Styled Components
const TabsWrapper = styled.div`
  font-family: 'Segoe UI', sans-serif;
  margin-bottom: 2rem;
  /* background-color: #f3f4f7; */
`;

const TabList = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  border-bottom: 2px solid #ccc;
  margin-bottom: 1rem;
  padding: 10px;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 0.7rem 1.2rem;
  background: ${({ active }) => (active ? "#132e58" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "#132e58")};
  border: none;
  border-radius: 4px 4px 0 0;
  margin-right: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 18px;
  border: 1px solid #132e58;

  &:hover {
    background: ${({ active }) => (active ? "#013e7e" : "#f0f0f0")};
  }
`;
const TabContent = styled.div`
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 0 0 6px 6px;
  padding: 1.5rem;
  min-height: 200px;
  color: #333;

  h2 {
    font-size: 1.3rem;
    margin-bottom: 0.8rem;
  }

  p {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  ul,
  ol {
    padding-left: 1.2rem;
  }

  li {
    margin-bottom: 0.4rem;
  }
`;