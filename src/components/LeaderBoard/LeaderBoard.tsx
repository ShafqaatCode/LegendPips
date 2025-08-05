import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchLeaderboard, type LeaderboardEntry } from "../api/mockLeaderboard";
import Spinner from "../Loaders/spinner";
import { useNavigate } from "react-router-dom";


const LeaderBoard: React.FC = () => {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [filteredData, setFilteredData] = useState<LeaderboardEntry[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaderboard().then((res) => {
      setData(res);
      setFilteredData(res);
      setLoading(false);
    });
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = filteredData.slice((currentPage - 1) * perPage, currentPage * perPage);

  if (loading) return <Spinner />;

  return (
    <Wrapper>
      <Header>
        <Title>Competition Leader-board</Title>
        <SearchBox>
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </SearchBox>
      </Header>

      <Table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Account</th>
            <th>Account Balance</th>
            <th>Profit %</th>
            <th>Trades</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((entry, index) => (
            <Row
              key={entry.id}
              topRank={index + 1 + (currentPage - 1) * perPage <= 3}
            >
              <td>{index + 1 + (currentPage - 1) * perPage}</td>
              <td>{entry.name}</td>
              <td>{entry.account}</td>
              <td>{entry.accountBalance.toLocaleString()}</td>
              <td>{entry.profitPercent.toFixed(2)}%</td>
              <td>{entry.trades}</td>
              <td>
                <ActionButton onClick={() => navigate(`/leaderboard/${entry.id}`)}>
                  View Details
                </ActionButton>
              </td>
            </Row>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {Array.from({ length: totalPages }, (_, i) => (
          <PageButton
            key={i + 1}
            active={currentPage === i + 1}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </PageButton>
        ))}
      </Pagination>
    </Wrapper>
  );
};

export default LeaderBoard;

// Styled Components
const Wrapper = styled.div`
  padding: 2rem;
  font-family: "Segoe UI", sans-serif;
  background: #f8fafc;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #0f172a;
`;

const SearchBox = styled.div`
  input {
    padding: 0.5rem 0.8rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    min-width: 220px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background: white;
  border-radius: 6px;
  overflow: hidden;

  thead {
    background: #0f172a;
    color: white;
  }

  th, td {
    text-align: center;
    padding: 0.75rem;
    border-bottom: 1px solid #e2e8f0;
  }
`;

const Row = styled.tr<{ topRank: boolean }>`
  background: ${({ topRank }) => (topRank ? "#f0fdf4" : "white")};

  &:hover {
    background: #f1f5f9;
  }
`;

const ActionButton = styled.button`
  background: #0f172a;
  color: white;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #1e293b;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 0.3rem;
`;

const PageButton = styled.button<{ active: boolean }>`
  padding: 0.4rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: ${({ active }) => (active ? "#0f172a" : "white")};
  color: ${({ active }) => (active ? "white" : "#0f172a")};
  cursor: pointer;

  &:hover {
    background: ${({ active }) => (active ? "#1e293b" : "#f1f5f9")};
  }
`;
