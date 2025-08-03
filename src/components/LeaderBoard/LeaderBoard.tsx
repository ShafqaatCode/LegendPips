import { useState, useMemo } from "react";
import {
  Container,
  SearchPaginationWrapper,
  SearchWrapper,
  SearchInput,
  TopPagination,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableData,
  UserInfo,
  Avatar,
  Username,
  Pagination,
  PageButton,
  AccountLink,
} from "./LeaderBoard.styled";
import data from "./data";

const rowsPerPage = 10;

const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return data.filter((user) =>
      (user.username + user.account).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const pageCount = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pageCount) setCurrentPage(page);
  };

  return (
    <Container>
      <SearchPaginationWrapper>
        <TopPagination>
          <PageButton onClick={() => handlePageChange(currentPage - 1)}>{"<"}</PageButton>
          {Array.from({ length: pageCount }, (_, i) => (
            <PageButton
              key={i}
              onClick={() => handlePageChange(i + 1)}
              active={currentPage === i + 1}
            >
              {i + 1}
            </PageButton>
          ))}
          <PageButton onClick={() => handlePageChange(currentPage + 1)}>{">"}</PageButton>
        </TopPagination>

        <SearchWrapper>
          <SearchInput
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </SearchWrapper>
      </SearchPaginationWrapper>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>#</TableHeader>
            <TableHeader>User</TableHeader>
            <TableHeader>Country</TableHeader>
            <TableHeader>Account</TableHeader>
            <TableHeader>Equity</TableHeader>
            <TableHeader>Open Profit</TableHeader>
            <TableHeader>Profit %</TableHeader>
            <TableHeader>Peak Drawdown</TableHeader>
            <TableHeader>Calculated Trades</TableHeader>
            <TableHeader>Excluded Trades</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((user, index) => (
            <TableRow key={user.id}>
              <TableData>{(currentPage - 1) * rowsPerPage + index + 1}</TableData>
              <TableData>
                <UserInfo>
                  <Avatar src={user.flag} alt="flag" />
                  <Username>{user.username}</Username>
                </UserInfo>
              </TableData>
              <TableData>
                <Avatar src={user.flag} alt="flag" />
              </TableData>
              <TableData>
                <AccountLink>{user.account}</AccountLink>
              </TableData>
              <TableData>{user.equity}</TableData>
              <TableData>{user.openProfit}</TableData>
              <TableData>{user.profitPercent}</TableData>
              <TableData>{user.peakDrawdown}</TableData>
              <TableData>{user.calculatedTrades}</TableData>
              <TableData>{user.excludedTrades}</TableData>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PageButton onClick={() => handlePageChange(currentPage - 1)}>{"<"}</PageButton>
        {Array.from({ length: pageCount }, (_, i) => (
          <PageButton
            key={i}
            onClick={() => handlePageChange(i + 1)}
            active={currentPage === i + 1}
          >
            {i + 1}
          </PageButton>
        ))}
        <PageButton onClick={() => handlePageChange(currentPage + 1)}>{">"}</PageButton>
      </Pagination>
    </Container>
  );
};

export default Leaderboard;
