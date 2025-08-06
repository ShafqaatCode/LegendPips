import React, { useState } from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import PieChartImg from "../../assets/icons/statistics1.svg"; 
import ArrowIcon from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg"; // Assuming you have an arrow icon

interface LeaderboardEntry {
    rank: number;
    name: string;
    account: string;
    accountNumber: string;
    balance: string;
    profit: string;
    trades: number;
}

const data: LeaderboardEntry[] = [
    { rank: 1, name: "Via", account: "Contest Account", accountNumber: "352819", balance: "18,830.30", profit: "2,117.90%", trades: 28 },
    { rank: 2, name: "Mohmi", account: "Contest Account", accountNumber: "353810", balance: "20,230.30", profit: "1,927.80%", trades: 19 },
    { rank: 3, name: "Taj Wali Khan", account: "Contest Account", accountNumber: "342816", balance: "17,830.30", profit: "1,784.55%", trades: 32 },
    { rank: 4, name: "Josphine", account: "Contest Account", accountNumber: "362819", balance: "17,630.30", profit: "1,454.55%", trades: 34 },
    { rank: 5, name: "Rose", account: "Contest Account", accountNumber: "352819", balance: "16,630.30", profit: "1,394.55%", trades: 31 },
    { rank: 6, name: "Amaar", account: "Contest Account", accountNumber: "372819", balance: "13,430.30", profit: "1,364.55%", trades: 29 },
];

const Leaderboard: React.FC = () => {
    const [search, setSearch] = useState("");

    const filtered = data.filter((entry) =>
        entry.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Wrapper>
            <Titlebar>
                <Title>Competition Leader-board</Title>
                <SearchBar>
                    <FaSearch />
                    <input type="text"
                    placeholder="Search by name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    />
                </SearchBar>
            </Titlebar>


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
                            <th>Statistics</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((entry) => (
                            <tr key={entry.rank} className={`row-${entry.rank}`}>
                                <td className="bordered">
                                    <RankBadge>{entry.rank}</RankBadge>
                                </td>
                                <td className="bordered">{entry.name}</td>
                                <td className="bordered">
                                    {entry.account} <br />
                                    {entry.accountNumber}
                                </td>
                                <td className="bordered">{entry.balance}</td>
                                <td className="bordered">{entry.profit}</td>
                                <td className="bordered">{entry.trades}</td>
                                <td className="no-border">
                                    
                                    <img src={PieChartImg} alt="PieChart img" />
                                </td>
                                <td className="no-border">
                                    <ActionButton>
                                        View Details <img src={ArrowIcon} alt="ArrowIco" />
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
  /* max-width: 1100px; */
  margin: 1rem auto;
  background: #f9fafb;
  padding: 1rem;
  border-radius: 6px;
`;


const Titlebar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;
const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #132e58;
  margin-bottom: 0.5rem;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 15px;
  padding: 0.8rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid #132E58B2;
  max-width: 250px;

  input {
    border: none;
    outline: none;
    margin-left: 0.4rem;
    font-size: 0.9rem;
    flex: 1;
  }
`;

const TableWrapper = styled.div`
padding:0 2rem;
  overflow-x: auto;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;

  thead {
    background: #0f2a58;
    color: #fff;
    font-weight: 500;
    text-decoration: underline;
    border-radius: 8px;
    padding: 2rem;
  }

  th, td {
    padding: 0.8rem 0.8rem;
    text-align: center;
    font-size: 16px;
    

  }

  td.bordered {
    background: #fff;
    border-top: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
  }
  td.bordered:first-child {
    border-left: 1px solid #e5e7eb;
    border-radius: 8px 0 0 8px;
  }
  td.bordered:last-child {
    border-right: 1px solid #e5e7eb;
    border-radius: 0 8px 8px 0;
  }

  th:last-child{
    border-radius: 0 8px 8px 0;
  }

  th:first-child{
    border-radius: 8px 0 0 8px;
  }

  td.no-border {
    background: transparent;
    border: none;
  }

  /* Top 3 borders */
  tbody tr.row-1 td.bordered { border-color: #facc15; } 
  tbody tr.row-2 td.bordered { border-color: #d1d5db; } 
  tbody tr.row-3 td.bordered { border-color: #4ade80; } 

  @media (max-width: 768px) {
    font-size: 0.8rem;
    td:nth-child(4), td:nth-child(5) {
      display: none; /* Hide balance & profit on small screens */
    }
  }
`;

const RankBadge = styled.span`
  display: inline-block;
  background-color: #0f172a;
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
  padding: 8px 20px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin: 0 auto;

  &:hover {
    background-color: #0d2247;
  }
`;
