import React, { useState } from "react";
import styled from "styled-components";
import { FaSearch, FaChartPie, FaArrowRight } from "react-icons/fa";

interface LeaderboardEntry {
  rank: number;
  name: string;
  account: string;
  accountNumber: string;
  balance: string;
  profit: string;
  trades: number;
}

const sampleData: LeaderboardEntry[] = [
  { rank: 1, name: "Via", account: "Contest Account", accountNumber: "352819", balance: "18,830.30", profit: "2,117.90%", trades: 28 },
  { rank: 2, name: "Mohmi", account: "Contest Account", accountNumber: "353810", balance: "20,230.30", profit: "1,927.80%", trades: 19 },
  { rank: 3, name: "Taj Wali Khan", account: "Contest Account", accountNumber: "342816", balance: "17,830.30", profit: "1,784.55%", trades: 32 },
  { rank: 4, name: "Josphine", account: "Contest Account", accountNumber: "362819", balance: "17,630.30", profit: "1,454.55%", trades: 34 },
  { rank: 5, name: "Rose", account: "Contest Account", accountNumber: "352819", balance: "16,630.30", profit: "1,394.55%", trades: 31 },
];

const Leaderboard: React.FC = () => {
  const [search, setSearch] = useState("");

  const filteredData = sampleData.filter((entry) =>
    entry.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Wrapper>
      <Title>Competition Leader-board</Title>

      <SearchBar>
        <FaSearch />
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchBar>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Account</th>
              <th>Account Balance</th>
              <th>Profit %</th>
              <th>Trades</th>
              <th className="no-border">Statistics</th>
              <th className="no-border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((entry) => (
              <tr key={entry.rank} className={entry.rank <= 3 ? `top-${entry.rank}` : ""}>
                {/* Bordered Section */}
                <td className="bordered">
                  <RankBadge rank={entry.rank}>{entry.rank}</RankBadge>
                </td>
                <td className="bordered">{entry.name}</td>
                <td className="bordered">
                  {entry.account} <br />
                  {entry.accountNumber}
                </td>
                <td className="bordered">{entry.balance}</td>
                <td className="bordered">{entry.profit}</td>
                <td className="bordered">{entry.trades}</td>

                {/* Non-bordered Section */}
                <td className="no-border">
                  <FaChartPie />
                </td>
                <td className="no-border">
                  <ActionButton>
                    View Details <FaArrowRight />
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </Wrapper>
  );
};

export default Leaderboard;

// ---------------- Styled Components ----------------

const Wrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 1rem auto;
  background: #f9fafb;
  padding: 1rem;
  border-radius: 6px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 20px;
  padding: 0.4rem 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #e5e7eb;
  max-width: 250px;

  input {
    border: none;
    outline: none;
    margin-left: 0.4rem;
    font-size: 0.9rem;
    flex: 1;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    margin: 0 auto 1rem auto;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  min-width: 700px;
  border-collapse: separate;
  border-spacing: 0 8px; /* space between rows for card effect */

  thead {
    background: #0f2a58;
    color: #fff;
    font-weight: 600;
  }

  th,
  td {
    padding: 0.7rem 0.8rem;
    text-align: center;
    font-size: 0.9rem;
  }

  td.bordered {
    background: #fff;
    
    
  }
  td.bordered:first-child {
    border-left: 1px solid #e5e7eb;
    border-radius: 8px 0 0 8px;
  }
  td.bordered:last-child {
    border-right: 1px solid #e5e7eb;
    border-radius: 0 8px 8px 0;
  }

  td.no-border {
    background: transparent;
    border: none;
  }

  tr{
    border-top: 2px solid blue;
  }

  tbody tr.top-1 td.bordered {
    /* border-left: 4px solid gold; */
    border-top: 2px solid green;
    border-bottom: 2px solid green;
  }
  tbody tr.top-2 td.bordered {
    /* border-left: 4px solid silver; */
    
  }
  tbody tr.top-3 td.bordered {
    /* border-left: 4px solid #6ee7b7; */
  }

  @media (max-width: 600px) {
    td:nth-child(6),
    th:nth-child(6) {
      display: none;
    }
  }
`;

const RankBadge = styled.span<{ rank: number }>`
  display: inline-block;
  background-color: ${({ rank }) =>
    rank === 1 ? "#0f172a" : rank === 2 ? "#0f172a" : rank === 3 ? "#0f172a" : "#e5e7eb"};
  color: #fff;
  font-weight: 600;
  padding: 0.3rem 0.6rem;
  border-radius: 50%;
  font-size: 0.85rem;
`;

const ActionButton = styled.button`
  background-color: #0f2a58;
  color: #fff;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  cursor: pointer;

  &:hover {
    background-color: #0d2247;
  }
`;
