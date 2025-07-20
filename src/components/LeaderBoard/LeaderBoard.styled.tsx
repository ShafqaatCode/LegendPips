import styled from "styled-components";

export const Container = styled.div`
  background: #f6f8fc;
  padding: 2rem;
  border-radius: 12px;
  font-family: "Inter", sans-serif;
`;

export const SearchWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
`;

export const SearchInput = styled.input`
  padding: 10px 16px;
  border: 1px dashed #b2b9c6;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
`;

export const TableHead = styled.thead`
  background: #f2f5f9;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #e4e7ed;
`;

export const TableHeader = styled.th`
  padding: 12px;
  text-align: left;
  font-weight: 600;
  font-size: 0.95rem;
  color: #555;
`;

export const TableBody = styled.tbody``;

export const TableData = styled.td`
  padding: 12px;
  font-size: 0.9rem;
  color: #333;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Avatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;

export const Username = styled.span`
  font-weight: 500;
`;

export const AccountLink = styled.div`
  color: #0077cc;
  font-size: 0.85rem;
  cursor: pointer;
`;

export const Pagination = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 8px;
`;

export const PageButton = styled.button<{ active?: boolean }>`
  padding: 8px 14px;
  border: 1px dashed #b2b9c6;
  background: ${({ active }) => (active ? "#0077cc" : "white")};
  color: ${({ active }) => (active ? "white" : "#333")};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
`;
