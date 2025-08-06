import React, { useState } from "react";
import styled from "styled-components";
import Note from "./Note";
import PrizePoolCard from "./PrizePool";

const TabContainer = styled.div`
  margin: 1rem;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
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

const TabContent = styled.div`
  margin-top: 1.5rem;
`;



const ContestTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState("more");

    return (
        <TabContainer>
            <TabButtons>
                <TabButton
                    active={activeTab === "prizes"}
                    onClick={() => setActiveTab("prizes")}
                >
                    Show Prizes
                </TabButton>
                <TabButton
                    active={activeTab === "more"}
                    onClick={() => setActiveTab("more")}
                >
                    More Info
                </TabButton>
                <TabButton
                    active={activeTab === "chat"}
                    onClick={() => setActiveTab("chat")}
                >
                    Chat Room ( Telegram app )
                </TabButton>
            </TabButtons>

            <TabContent>
                {activeTab === "more" && (
                    <Note />
                )}

                {activeTab === "prizes" && (
                    <div style={{ marginTop: "1rem" }}>

                        <PrizePoolCard
                            description="Test your trading skills in Forex and Metals—risk-free, reward real! Compete in the zForex Demo Contest and prove you're the sharpest trader in the market."
                            prizes={[
                                "1st place: $300",
                                "2nd place: $250",
                                "3rd place: $200",
                                "4th place: $150",
                                "5th place: $125",
                                "6th place: $100",
                                "7th place: $90",
                                "8th place: $80",
                                "9th place: $70",
                                "10th place: $60",
                                "11th–12th place: $50 each",
                                "13th–14th place: $45 each",
                                "15th–16th place: $40 each",
                                "17th–18th place: $35 each",
                                "19th–20th place: $30 each",
                            ]}
                            startDate="Jul 7, 2025, 01:00 PM"
                            closeDate="Jul 19, 2025, 12:00 PM"
                            totalPrize="$2,000"
                        />


                    </div>
                )}

                {activeTab === "chat" && (
                    <div style={{ marginTop: "1rem" }}>
                        💬 Join our Telegram room:{" "}
                        <a
                            href="https://t.me/yourchatroom"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#1a1e4d", textDecoration: "underline" }}
                        >
                            Click here to chat
                        </a>
                    </div>
                )}
            </TabContent>
        </TabContainer>
    );
};

export default ContestTabs;
